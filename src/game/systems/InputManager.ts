export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
  sprint: boolean;
  dodge: boolean;
  attack: boolean;
  interact: boolean;
  ultimate: boolean;
}

export class InputManager {
  private static instance: InputManager | null = null;

  public keys: InputState = {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    sprint: false,
    dodge: false,
    attack: false,
    interact: false,
    ultimate: false,
  };

  public mouseScreenX: number = 0;
  public mouseScreenY: number = 0;
  public mouseWorldX: number = 0;
  public mouseWorldY: number = 0;
  public isMouseDown: boolean = false;
  public justClicked: boolean = false;
  public justAttacked: boolean = false;
  public justDodged: boolean = false;
  public justJumped: boolean = false;
  public justUltimated: boolean = false;

  public isEnabled: boolean = true;
  public isTouchMode: boolean = false;
  public mobileAimAngle: number | null = null;
  public isAiming: boolean = false;

  public autoAimTarget: { x: number; y: number } | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private cameraX: number = 0;
  private cameraY: number = 0;
  private cameraZoom: number = 1.0;

  private constructor() {
    this.setupListeners();
  }

  public static getInstance(): InputManager {
    if (!InputManager.instance) {
      InputManager.instance = new InputManager();
    }
    return InputManager.instance;
  }

  public setCanvas(canvas: HTMLCanvasElement) {
    if (this.canvas) {
      this.canvas.removeEventListener('touchstart', this.handleCanvasTouchStart);
      this.canvas.removeEventListener('touchmove', this.handleCanvasTouchMove);
      this.canvas.removeEventListener('touchend', this.handleCanvasTouchEnd);
      this.canvas.removeEventListener('touchcancel', this.handleCanvasTouchEnd);
    }
    this.canvas = canvas;
    if (canvas) {
      canvas.addEventListener('touchstart', this.handleCanvasTouchStart, { passive: false });
      canvas.addEventListener('touchmove', this.handleCanvasTouchMove, { passive: false });
      canvas.addEventListener('touchend', this.handleCanvasTouchEnd, { passive: true });
      canvas.addEventListener('touchcancel', this.handleCanvasTouchEnd, { passive: true });
    }
  }

  public setCameraTransform(cameraX: number, cameraY: number = 0, zoom: number = 1.0) {
    this.cameraX = cameraX;
    this.cameraY = cameraY;
    this.cameraZoom = Math.max(0.2, zoom);
    this.updateWorldMouse();
  }

  public setCameraX(cameraX: number) {
    this.setCameraTransform(cameraX, this.cameraY, this.cameraZoom);
  }

  public setAutoAimTarget(worldX: number, worldY: number) {
    this.autoAimTarget = { x: worldX, y: worldY };
  }

  public clearAutoAimTarget() {
    this.autoAimTarget = null;
  }

  /**
   * Sets mobile aim vector from right drag touch or aim pad.
   * Pure player-controlled aiming without auto-lock or magnetic cheat.
   */
  public setMobileAimVector(dx: number, dy: number) {
    this.isTouchMode = true;
    const len = Math.hypot(dx, dy);
    if (len > 0.1) {
      this.isAiming = true;
      this.mobileAimAngle = Math.atan2(dy, dx);
    } else {
      this.isAiming = false;
      this.mobileAimAngle = null;
    }
  }

  public clearMobileAim() {
    this.isAiming = false;
    this.mobileAimAngle = null;
  }

  /**
   * Dedicated Virtual Direction Controls for Physical Arrow Buttons:
   * Left, Right, Up (Jump/Climb), Down (Drop/Slide).
   */
  public setVirtualDirection(dir: 'left' | 'right' | 'up' | 'down', active: boolean) {
    this.isTouchMode = true;
    if (dir === 'left') {
      this.keys.left = active;
      if (active) this.keys.right = false;
    } else if (dir === 'right') {
      this.keys.right = active;
      if (active) this.keys.left = false;
    } else if (dir === 'up') {
      this.keys.up = active;
      if (active) {
        if (!this.keys.jump) this.justJumped = true;
        this.keys.jump = true;
      } else {
        this.keys.jump = false;
      }
    } else if (dir === 'down') {
      this.keys.down = active;
    }
  }

  public setVirtualJoystick(dx: number, dy: number) {
    this.isTouchMode = true;
    if (dx < -0.15) {
      this.keys.left = true;
      this.keys.right = false;
    } else if (dx > 0.15) {
      this.keys.right = true;
      this.keys.left = false;
    } else {
      this.keys.left = false;
      this.keys.right = false;
    }

    if (dy < -0.42) {
      if (!this.keys.jump) {
        this.justJumped = true;
      }
      this.keys.jump = true;
    } else if (dy > -0.2) {
      this.keys.jump = false;
    }
  }

  public setVirtualAction(
    action: 'jump' | 'dodge' | 'sprint' | 'attack' | 'interact' | 'ultimate',
    pressed: boolean
  ) {
    this.isTouchMode = true;
    if (pressed) {
      if (action === 'jump') {
        if (!this.keys.jump) this.justJumped = true;
        this.keys.jump = true;
      } else if (action === 'dodge') {
        if (!this.keys.dodge) this.justDodged = true;
        this.keys.dodge = true;
      } else if (action === 'sprint') {
        this.keys.sprint = true;
      } else if (action === 'attack') {
        this.keys.attack = true;
        this.justAttacked = true;
        this.justClicked = true;
        this.isMouseDown = true;
      } else if (action === 'interact') {
        this.keys.interact = true;
      } else if (action === 'ultimate') {
        if (!this.keys.ultimate) this.justUltimated = true;
        this.keys.ultimate = true;
      }
    } else {
      if (action === 'jump') {
        this.keys.jump = false;
      } else if (action === 'dodge') {
        this.keys.dodge = false;
      } else if (action === 'sprint') {
        this.keys.sprint = false;
      } else if (action === 'attack') {
        this.keys.attack = false;
        this.isMouseDown = false;
      } else if (action === 'interact') {
        this.keys.interact = false;
      } else if (action === 'ultimate') {
        this.keys.ultimate = false;
      }
    }
  }

  public setTouchAim(screenX: number, screenY: number) {
    this.mouseScreenX = screenX;
    this.mouseScreenY = screenY;
    this.updateWorldMouse();
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.resetKeys();
    }
  }

  public resetKeys() {
    this.keys.left = false;
    this.keys.right = false;
    this.keys.up = false;
    this.down = false;
    this.keys.jump = false;
    this.keys.sprint = false;
    this.keys.dodge = false;
    this.keys.attack = false;
    this.keys.interact = false;
    this.keys.ultimate = false;
    this.justUltimated = false;
    this.isMouseDown = false;
    this.justClicked = false;
    this.justAttacked = false;
    this.justDodged = false;
    this.justJumped = false;
    this.isAiming = false;
    this.mobileAimAngle = null;
  }

  private set down(val: boolean) {
    this.keys.down = val;
  }

  private setupListeners() {
    window.addEventListener('keydown', this.handleKeyDown, { passive: false });
    window.addEventListener('keyup', this.handleKeyUp, { passive: false });
    window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    window.addEventListener('mousedown', this.handleMouseDown, { passive: false });
    window.addEventListener('mouseup', this.handleMouseUp, { passive: true });
    window.addEventListener('blur', this.handleBlur);
  }

  public destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('blur', this.handleBlur);
    if (this.canvas) {
      this.canvas.removeEventListener('touchstart', this.handleCanvasTouchStart);
      this.canvas.removeEventListener('touchmove', this.handleCanvasTouchMove);
      this.canvas.removeEventListener('touchend', this.handleCanvasTouchEnd);
      this.canvas.removeEventListener('touchcancel', this.handleCanvasTouchEnd);
    }
    InputManager.instance = null;
  }

  private handleCanvasTouchStart = (e: TouchEvent) => {
    if (!this.isEnabled || !this.canvas) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = this.canvas.getBoundingClientRect();
    this.mouseScreenX = touch.clientX - rect.left;
    this.mouseScreenY = touch.clientY - rect.top;
    this.updateWorldMouse();
    this.isTouchMode = true;
  };

  private handleCanvasTouchMove = (e: TouchEvent) => {
    if (!this.isEnabled || !this.canvas) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = this.canvas.getBoundingClientRect();
    this.mouseScreenX = touch.clientX - rect.left;
    this.mouseScreenY = touch.clientY - rect.top;
    this.updateWorldMouse();
  };

  private handleCanvasTouchEnd = () => {
    // End canvas touch
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

    if (!this.isEnabled) return;

    if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.keys.left = true;
    if (e.code === 'KeyD' || e.code === 'ArrowRight') this.keys.right = true;
    if (e.code === 'KeyW' || e.code === 'ArrowUp') {
      this.keys.up = true;
      if (!this.keys.jump) this.justJumped = true;
      this.keys.jump = true;
    }
    if (e.code === 'KeyS' || e.code === 'ArrowDown') this.keys.down = true;
    if (e.code === 'Space') {
      if (!this.keys.jump) this.justJumped = true;
      this.keys.jump = true;
      e.preventDefault();
    }
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.keys.sprint = true;
    if (e.code === 'KeyC' || e.code === 'KeyK') {
      if (!this.keys.dodge) this.justDodged = true;
      this.keys.dodge = true;
    }
    if (e.code === 'KeyJ' || e.code === 'KeyF') {
      if (!this.keys.attack) this.justAttacked = true;
      this.keys.attack = true;
    }
    if (e.code === 'KeyE') this.keys.interact = true;
    if (e.code === 'KeyR' || e.code === 'KeyQ') {
      if (!this.keys.ultimate) this.justUltimated = true;
      this.keys.ultimate = true;
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.keys.left = false;
    if (e.code === 'KeyD' || e.code === 'ArrowRight') this.keys.right = false;
    if (e.code === 'KeyW' || e.code === 'ArrowUp') {
      this.keys.up = false;
      this.keys.jump = false;
    }
    if (e.code === 'KeyS' || e.code === 'ArrowDown') this.keys.down = false;
    if (e.code === 'Space') this.keys.jump = false;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.keys.sprint = false;
    if (e.code === 'KeyC' || e.code === 'KeyK') this.keys.dodge = false;
    if (e.code === 'KeyJ' || e.code === 'KeyF') this.keys.attack = false;
    if (e.code === 'KeyE') this.keys.interact = false;
    if (e.code === 'KeyR' || e.code === 'KeyQ') this.keys.ultimate = false;
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.canvas) {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseScreenX = e.clientX - rect.left;
      this.mouseScreenY = e.clientY - rect.top;
    } else {
      this.mouseScreenX = e.clientX;
      this.mouseScreenY = e.clientY;
    }
    this.updateWorldMouse();
  };

  private handleMouseDown = (e: MouseEvent) => {
    if (!this.isEnabled) return;
    if (['INPUT', 'TEXTAREA', 'BUTTON'].includes((e.target as HTMLElement)?.tagName)) return;

    if (e.button === 0) {
      this.isMouseDown = true;
      this.justClicked = true;
      this.justAttacked = true;
      this.keys.attack = true;
    }
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (e.button === 0) {
      this.isMouseDown = false;
      this.keys.attack = false;
    }
  };

  private handleBlur = () => {
    this.resetKeys();
  };

  private updateWorldMouse() {
    // Screen coords to World coords using Camera transformation
    this.mouseWorldX = this.mouseScreenX / this.cameraZoom + this.cameraX;
    this.mouseWorldY = this.mouseScreenY / this.cameraZoom + this.cameraY;
  }

  public endFrame() {
    this.justClicked = false;
    this.justAttacked = false;
    this.justDodged = false;
    this.justJumped = false;
    this.justUltimated = false;
  }
}
