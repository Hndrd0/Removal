/**
 * Canvas Brush Compositor for Interactive Cutout Editing (Erase & Restore)
 * 
 * Operates at 100% full original resolution so brush modifications preserve
 * maximum image quality without any downscaling.
 */

export type BrushMode = 'erase' | 'restore';

export interface Point {
  x: number;
  y: number;
}

export class BrushCompositor {
  private width: number;
  private height: number;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private origCanvas: HTMLCanvasElement;
  private origCtx: CanvasRenderingContext2D;
  
  // History stack for Undo / Redo
  private history: ImageData[] = [];
  private historyIndex = -1;
  private maxHistory = 20;

  constructor(
    width: number,
    height: number,
    originalImg: HTMLImageElement | HTMLCanvasElement,
    initialCutoutImg: HTMLImageElement | HTMLCanvasElement
  ) {
    this.width = width;
    this.height = height;

    // 1. Working canvas (transparent cutout)
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    const ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Could not create 2D canvas context');
    this.ctx = ctx;

    // Draw initial cutout
    this.ctx.drawImage(initialCutoutImg, 0, 0, width, height);

    // 2. Reference canvas (original source image for restore mode)
    this.origCanvas = document.createElement('canvas');
    this.origCanvas.width = width;
    this.origCanvas.height = height;
    const origCtx = this.origCanvas.getContext('2d', { willReadFrequently: true });
    if (!origCtx) throw new Error('Could not create 2D canvas context for original image');
    this.origCtx = origCtx;
    this.origCtx.drawImage(originalImg, 0, 0, width, height);

    // Save initial state to history
    this.pushHistory();
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  /**
   * Pushes current state onto the undo history stack
   */
  public pushHistory(): void {
    // If we branched from a past state, discard redo future
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }

    const snapshot = this.ctx.getImageData(0, 0, this.width, this.height);
    this.history.push(snapshot);

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  public canUndo(): boolean {
    return this.historyIndex > 0;
  }

  public canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }

  public undo(): boolean {
    if (!this.canUndo()) return false;
    this.historyIndex--;
    const snapshot = this.history[this.historyIndex];
    this.ctx.putImageData(snapshot, 0, 0);
    return true;
  }

  public redo(): boolean {
    if (!this.canRedo()) return false;
    this.historyIndex++;
    const snapshot = this.history[this.historyIndex];
    this.ctx.putImageData(snapshot, 0, 0);
    return true;
  }

  public resetToInitial(): void {
    if (this.history.length > 0) {
      const initialSnapshot = this.history[0];
      this.ctx.putImageData(initialSnapshot, 0, 0);
      this.history = [initialSnapshot];
      this.historyIndex = 0;
    }
  }

  /**
   * Draws a stroke segment from p0 to p1
   */
  public drawStroke(
    p0: Point,
    p1: Point,
    radius: number,
    mode: BrushMode
  ): void {
    const dist = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const step = Math.max(1, radius * 0.25);
    const steps = Math.ceil(dist / step);

    for (let i = 0; i <= steps; i++) {
      const t = steps === 0 ? 0 : i / steps;
      const x = p0.x + (p1.x - p0.x) * t;
      const y = p0.y + (p1.y - p0.y) * t;
      this.drawBrushStamp(x, y, radius, mode);
    }
  }

  /**
   * Draws a single circular brush stamp at (x, y)
   */
  public drawBrushStamp(
    x: number,
    y: number,
    radius: number,
    mode: BrushMode
  ): void {
    this.ctx.save();

    if (mode === 'erase') {
      // Erase: removes alpha towards transparent
      this.ctx.globalCompositeOperation = 'destination-out';
      const radGrad = this.ctx.createRadialGradient(x, y, radius * 0.7, x, y, radius);
      radGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.ctx.fillStyle = radGrad;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      // Restore: paints original image pixels back
      // Clip to brush stamp circle and draw from original image
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.clip();

      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.drawImage(this.origCanvas, 0, 0);
    }

    this.ctx.restore();
  }

  /**
   * Exports the current state as a full-resolution 32-bit transparent PNG blob
   */
  public exportBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to encode canvas to PNG blob'));
      }, 'image/png');
    });
  }
}
