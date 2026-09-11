// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { BrushCompositor } from './brushCompositor';

describe('BrushCompositor (Erase & Restore Engine)', () => {
  beforeEach(() => {
    // Mock 2D Context for happy-dom testing
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextType: string) {
      if (contextType === '2d') {
        const dummyImageData = {
          width: this.width || 10,
          height: this.height || 10,
          data: new Uint8ClampedArray((this.width || 10) * (this.height || 10) * 4),
        };
        return {
          canvas: this,
          drawImage: () => {},
          getImageData: () => dummyImageData,
          putImageData: () => {},
          save: () => {},
          restore: () => {},
          beginPath: () => {},
          arc: () => {},
          fill: () => {},
          clip: () => {},
          createRadialGradient: () => ({ addColorStop: () => {} }),
          fillRect: () => {},
          clearRect: () => {},
          fillStyle: '#000000',
          globalCompositeOperation: 'source-over',
        } as unknown as CanvasRenderingContext2D;
      }
      return null;
    } as unknown as typeof HTMLCanvasElement.prototype.getContext;
  });

  it('initializes correctly and manages undo/redo states', () => {
    const origCanvas = document.createElement('canvas');
    origCanvas.width = 10;
    origCanvas.height = 10;

    const cutoutCanvas = document.createElement('canvas');
    cutoutCanvas.width = 10;
    cutoutCanvas.height = 10;

    const compositor = new BrushCompositor(10, 10, origCanvas, cutoutCanvas);
    expect(compositor.getWidth()).toBe(10);
    expect(compositor.getHeight()).toBe(10);
    expect(compositor.canUndo()).toBe(false);
    expect(compositor.canRedo()).toBe(false);

    // Apply an erase stroke
    compositor.drawStroke({ x: 5, y: 5 }, { x: 5, y: 5 }, 3, 'erase');
    compositor.pushHistory();

    expect(compositor.canUndo()).toBe(true);
    expect(compositor.canRedo()).toBe(false);

    // Test Undo
    const undone = compositor.undo();
    expect(undone).toBe(true);
    expect(compositor.canRedo()).toBe(true);

    // Test Redo
    const redone = compositor.redo();
    expect(redone).toBe(true);
    expect(compositor.canUndo()).toBe(true);
  });

  it('supports drawBrushStamp in both erase and restore modes', () => {
    const origCanvas = document.createElement('canvas');
    origCanvas.width = 20;
    origCanvas.height = 20;

    const cutoutCanvas = document.createElement('canvas');
    cutoutCanvas.width = 20;
    cutoutCanvas.height = 20;

    const compositor = new BrushCompositor(20, 20, origCanvas, cutoutCanvas);
    expect(() => {
      compositor.drawBrushStamp(10, 10, 5, 'erase');
      compositor.pushHistory();
      compositor.drawBrushStamp(12, 12, 5, 'restore');
      compositor.pushHistory();
    }).not.toThrow();

    expect(compositor.canUndo()).toBe(true);
  });

  it('clears history and reverts canvas when resetToInitial is called', () => {
    const origCanvas = document.createElement('canvas');
    origCanvas.width = 15;
    origCanvas.height = 15;

    const cutoutCanvas = document.createElement('canvas');
    cutoutCanvas.width = 15;
    cutoutCanvas.height = 15;

    const compositor = new BrushCompositor(15, 15, origCanvas, cutoutCanvas);
    compositor.drawStroke({ x: 2, y: 2 }, { x: 8, y: 8 }, 4, 'erase');
    compositor.pushHistory();
    expect(compositor.canUndo()).toBe(true);

    compositor.resetToInitial();
    expect(compositor.canUndo()).toBe(false);
    expect(compositor.canRedo()).toBe(false);
  });

  it('truncates redo stack when a new stroke is applied after undo', () => {
    const origCanvas = document.createElement('canvas');
    origCanvas.width = 10;
    origCanvas.height = 10;

    const cutoutCanvas = document.createElement('canvas');
    cutoutCanvas.width = 10;
    cutoutCanvas.height = 10;

    const compositor = new BrushCompositor(10, 10, origCanvas, cutoutCanvas);
    compositor.drawBrushStamp(5, 5, 2, 'erase');
    compositor.pushHistory();
    expect(compositor.canUndo()).toBe(true);

    compositor.undo();
    expect(compositor.canRedo()).toBe(true);

    // New action should discard redo stack
    compositor.drawBrushStamp(8, 8, 2, 'restore');
    compositor.pushHistory();
    expect(compositor.canRedo()).toBe(false);
    expect(compositor.canUndo()).toBe(true);
  });
});
