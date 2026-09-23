export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export type ScreenOrientationType = 'portrait' | 'landscape';
export type DeviceCategory = 'mobile' | 'tablet' | 'desktop';

export interface ViewportState {
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  effectivePixelRatio: number;
  orientation: ScreenOrientationType;
  deviceCategory: DeviceCategory;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  safeArea: SafeAreaInsets;
}

export class ViewportManager {
  private static instance: ViewportManager | null = null;
  private state: ViewportState;
  private listeners: Set<(state: ViewportState) => void> = new Set();
  private maxDpr: number = 2.5;

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

  private calculateViewportState(): ViewportState {
    const width = typeof window !== 'undefined'
      ? (window.visualViewport ? Math.round(window.visualViewport.width) : window.innerWidth)
      : 1920;
    const height = typeof window !== 'undefined'
      ? (window.visualViewport ? Math.round(window.visualViewport.height) : window.innerHeight)
      : 1080;

    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    // Mobile/tablets clamped to 2.25 max to preserve 60 FPS while keeping Ultra-HD sharpness
    const isCoarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    const effectiveDpr = Math.min(dpr, isCoarse ? Math.min(this.maxDpr, 2.25) : this.maxDpr);

    const orientation: ScreenOrientationType = height > width ? 'portrait' : 'landscape';

    const isMobile = width <= 768 || (isCoarse && width <= 920 && orientation === 'landscape');
    const isTablet = !isMobile && (width <= 1024 || (isCoarse && width <= 1366));
    const isDesktop = !isMobile && !isTablet;

    const deviceCategory: DeviceCategory = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

    // Parse CSS safe-area-insets if available or compute reasonable defaults
    const safeArea = this.getSafeAreaInsets();

    return {
      viewportWidth: width,
      viewportHeight: height,
      devicePixelRatio: dpr,
      effectivePixelRatio: effectiveDpr,
      orientation,
      deviceCategory,
      isMobile,
      isTablet,
      isDesktop,
      safeArea,
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
    }

    document.addEventListener('fullscreenchange', onResize, { passive: true });
  }

  private handleResize() {
    const nextState = this.calculateViewportState();
    this.state = nextState;
    this.listeners.forEach((listener) => {
      try {
        listener(nextState);
      } catch (err) {
        console.error('Viewport listener error:', err);
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
