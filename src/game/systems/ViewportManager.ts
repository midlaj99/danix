export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export type ScreenOrientationType = 'portrait' | 'landscape';
export type DeviceTier = 'SMALL_MOBILE' | 'NORMAL_MOBILE' | 'LARGE_MOBILE' | 'TABLET' | 'DESKTOP';

export interface ViewportState {
  viewportWidth: number;
  viewportHeight: number;
  aspectRatio: number;
  devicePixelRatio: number;
  effectivePixelRatio: number;
  orientation: ScreenOrientationType;
  deviceTier: DeviceTier;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isFullscreen: boolean;
  safeArea: SafeAreaInsets;
  hudScale: number;
  controlScale: number;
  touchTargetSize: number;
}

export class ViewportManager {
  private static instance: ViewportManager | null = null;
  private state: ViewportState;
  private listeners: Set<(state: ViewportState) => void> = new Set();
  private maxDpr: number = 2.25;

  private constructor() {
    this.state = this.calculateViewportState();
    this.initEventListeners();
  }

  public static getInstance(): ViewportManager {
    if (!ViewportManager.instance) {
      ViewportManager.instance = new ViewportManager();
    }
    return ViewportManager.instance;
  }

  public setMaxDpr(max: number) {
    this.maxDpr = Math.max(1, max);
    this.handleResize();
  }

  public getState(): ViewportState {
    return this.state;
  }

  public subscribe(listener: (state: ViewportState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /* ------------------- FULLSCREEN API (SAFE & ROBUST) ------------------- */

  public isFullscreen(): boolean {
    if (typeof document === 'undefined') return false;
    return Boolean(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
  }

  public async requestFullscreen(): Promise<boolean> {
    if (typeof document === 'undefined') return false;
    try {
      const docEl = document.documentElement as any;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen({ navigationUI: 'hide' } as any);
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        await docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        await docEl.msRequestFullscreen();
      }

      // After user enters fullscreen, lock to landscape if supported
      await this.lockLandscape();
      this.handleResize();
      return true;
    } catch (err) {
      console.warn('[ViewportManager] Fullscreen request prevented or denied:', err);
      this.handleResize();
      return false;
    }
  }

  public async exitFullscreen(): Promise<boolean> {
    if (typeof document === 'undefined') return false;
    try {
      const doc = document as any;
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
      this.handleResize();
      return true;
    } catch (err) {
      console.warn('[ViewportManager] Exit fullscreen error:', err);
      return false;
    }
  }

  public async toggleFullscreen(): Promise<boolean> {
    if (this.isFullscreen()) {
      return this.exitFullscreen();
    } else {
      return this.requestFullscreen();
    }
  }

  public async lockLandscape(): Promise<boolean> {
    try {
      const orientation = (screen.orientation || (screen as any).mozOrientation || (screen as any).msOrientation) as any;
      if (orientation && typeof orientation.lock === 'function') {
        await orientation.lock('landscape');
        return true;
      }
    } catch {
      // Browser doesn't support or user didn't allow; fallback responsive layout kicks in
    }
    return false;
  }

  /* ------------------- RESPONSIVE SCALING HELPERS ------------------- */

  public getHudScale(): number {
    return this.state.hudScale;
  }

  public getControlScale(): number {
    return this.state.controlScale;
  }

  public getTouchTargetSize(): number {
    return this.state.touchTargetSize;
  }

  public getSafeArea(): SafeAreaInsets {
    return this.state.safeArea;
  }

  /**
   * Dedicated Camera Zoom Calculator:
   * Prevents cramped feeling, ensures expansive world view on phones,
   * dynamically widens when hero and monster separate in combat.
   */
  public getCameraZoom(
    mode: 'exploration' | 'combat' = 'exploration',
    combatDistance: number = 400
  ): number {
    const { viewportWidth, viewportHeight, isMobile, deviceTier } = this.state;
    const isPortrait = viewportHeight > viewportWidth;

    if (isPortrait) {
      return mode === 'combat' ? 0.62 : 0.68;
    }

    // Landscape Mode
    if (mode === 'exploration') {
      if (deviceTier === 'SMALL_MOBILE') return 0.58;
      if (deviceTier === 'NORMAL_MOBILE') return 0.64;
      if (deviceTier === 'LARGE_MOBILE') return 0.68;
      if (isMobile) return 0.62;
      return 0.82; // Desktop exploration
    }

    // Combat Mode: dynamic framing based on separation
    // Combat Span: characters + safe margin
    const span = Math.max(500, combatDistance + 280);
    const safePlayAreaWidth = viewportWidth * (isMobile ? 0.76 : 0.88);
    const fitZoomX = safePlayAreaWidth / span;
    const fitZoomY = (viewportHeight * (isMobile ? 0.65 : 0.75)) / 440;

    let targetZoom = Math.min(fitZoomX, fitZoomY);

    if (isMobile) {
      // Clamped between 0.48 (when far apart) and 0.72 (when close)
      return Math.min(0.72, Math.max(0.48, targetZoom));
    }

    return Math.min(1.0, Math.max(0.65, targetZoom));
  }

  /* ------------------- VIEWPORT METRICS CALCULATION ------------------- */

  private calculateViewportState(): ViewportState {
    const visual = typeof window !== 'undefined' ? window.visualViewport : null;
    const width = visual ? Math.round(visual.width) : (typeof window !== 'undefined' ? window.innerWidth : 1920);
    const height = visual ? Math.round(visual.height) : (typeof window !== 'undefined' ? window.innerHeight : 1080);
    const aspectRatio = width / Math.max(1, height);

    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    const isCoarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    const effectiveDpr = Math.min(dpr, isCoarse ? Math.min(this.maxDpr, 2.0) : this.maxDpr);

    const orientation: ScreenOrientationType = height > width ? 'portrait' : 'landscape';
    const isFullscreen = this.isFullscreen();

    // Determine device tier
    let deviceTier: DeviceTier = 'DESKTOP';
    let isMobile = false;
    let isTablet = false;
    let isDesktop = true;

    if (isCoarse || width <= 1024) {
      if (width <= 760 || (orientation === 'landscape' && height <= 420 && width <= 820)) {
        deviceTier = 'SMALL_MOBILE';
        isMobile = true;
        isDesktop = false;
      } else if (width <= 960 || (orientation === 'landscape' && height <= 480)) {
        deviceTier = 'NORMAL_MOBILE';
        isMobile = true;
        isDesktop = false;
      } else if (orientation === 'landscape' && aspectRatio >= 18.5 / 9) {
        deviceTier = 'LARGE_MOBILE';
        isMobile = true;
        isDesktop = false;
      } else if (width <= 1280 && isCoarse) {
        deviceTier = 'TABLET';
        isTablet = true;
        isDesktop = false;
      }
    }

    // Dynamic HUD & Control scales
    let hudScale = 1.0;
    let controlScale = 1.0;
    let touchTargetSize = 64;

    if (deviceTier === 'SMALL_MOBILE') {
      hudScale = 0.85;
      controlScale = 0.92;
      touchTargetSize = 58;
    } else if (deviceTier === 'NORMAL_MOBILE') {
      hudScale = 0.92;
      controlScale = 1.0;
      touchTargetSize = 64;
    } else if (deviceTier === 'LARGE_MOBILE') {
      hudScale = 0.95;
      controlScale = 1.05;
      touchTargetSize = 68;
    } else if (deviceTier === 'TABLET') {
      hudScale = 1.05;
      controlScale = 1.15;
      touchTargetSize = 72;
    }

    const safeArea = this.getSafeAreaInsets();

    return {
      viewportWidth: width,
      viewportHeight: height,
      aspectRatio,
      devicePixelRatio: dpr,
      effectivePixelRatio: effectiveDpr,
      orientation,
      deviceTier,
      isMobile,
      isTablet,
      isDesktop,
      isFullscreen,
      safeArea,
      hudScale,
      controlScale,
      touchTargetSize,
    };
  }

  private getSafeAreaInsets(): SafeAreaInsets {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    try {
      const style = getComputedStyle(document.documentElement);
      const top = parseFloat(style.getPropertyValue('--sat') || '0') || 0;
      const bottom = parseFloat(style.getPropertyValue('--sab') || '0') || 0;
      const left = parseFloat(style.getPropertyValue('--sal') || '0') || 0;
      const right = parseFloat(style.getPropertyValue('--sar') || '0') || 0;

      return { top, bottom, left, right };
    } catch {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }
  }

  private initEventListeners() {
    if (typeof window === 'undefined') return;

    const onResize = () => this.handleResize();

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onResize, { passive: true });
      window.visualViewport.addEventListener('scroll', onResize, { passive: true });
    }

    document.addEventListener('fullscreenchange', onResize, { passive: true });
    document.addEventListener('webkitfullscreenchange', onResize, { passive: true });
  }

  public handleResize() {
    const nextState = this.calculateViewportState();
    this.state = nextState;
    this.listeners.forEach((listener) => {
      try {
        listener(nextState);
      } catch (err) {
        console.error('[ViewportManager] Listener error:', err);
      }
    });
  }

  /**
   * Configures high-DPI canvas buffer backing while keeping CSS display dimensions intact.
   */
  public applyToCanvas(canvas: HTMLCanvasElement): { width: number; height: number; dpr: number } {
    const { viewportWidth, viewportHeight, effectivePixelRatio } = this.state;
    const targetBufferWidth = Math.round(viewportWidth * effectivePixelRatio);
    const targetBufferHeight = Math.round(viewportHeight * effectivePixelRatio);

    if (canvas.width !== targetBufferWidth || canvas.height !== targetBufferHeight) {
      canvas.width = targetBufferWidth;
      canvas.height = targetBufferHeight;
    }

    canvas.style.width = `${viewportWidth}px`;
    canvas.style.height = `${viewportHeight}px`;

    return {
      width: viewportWidth,
      height: viewportHeight,
      dpr: effectivePixelRatio,
    };
  }
}
