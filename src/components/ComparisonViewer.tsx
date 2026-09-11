import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Columns,
  SplitSquareVertical,
  RotateCcw,
  Palette,
  Move,
  Paintbrush,
} from 'lucide-react';
import { CutoutBrushPanel } from './CutoutBrushPanel';
import { BrushCompositor, type BrushMode, type Point } from '../services/brushCompositor';

interface ComparisonViewerProps {
  originalUrl: string;
  cutoutUrl: string;
  width: number;
  height: number;
  onCutoutUpdated?: (newBlob: Blob, newUrl: string) => void;
}

type ViewMode = 'slider' | 'side-by-side' | 'brush';
type BackdropType = 'checker-dark' | 'checker-light' | 'white' | 'black' | 'slate' | 'custom';

export const ComparisonViewer: React.FC<ComparisonViewerProps> = ({
  originalUrl,
  cutoutUrl,
  width,
  height,
  onCutoutUpdated,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('slider');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage (0 - 100)
  const [backdrop, setBackdrop] = useState<BackdropType>('checker-dark');
  const [customColor, setCustomColor] = useState<string>('#3b82f6');
  
  // Pan and Zoom states
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const startPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingSliderRef = useRef<boolean>(false);

  // Brush Editing States
  const [brushMode, setBrushMode] = useState<BrushMode>('erase');
  const [brushSize, setBrushSize] = useState<number>(25);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState<Point | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const compositorRef = useRef<BrushCompositor | null>(null);
  const brushCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastPointRef = useRef<Point | null>(null);

  // Fit to screen on initial mount
  useEffect(() => {
    handleFitToScreen();
  }, [width, height]);

  const handleFitToScreen = () => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    if (clientWidth === 0 || clientHeight === 0) return;

    // Leave margin for controls
    const scaleX = (clientWidth - 80) / width;
    const scaleY = (clientHeight - 80) / height;
    const fitScale = Math.min(scaleX, scaleY, 1);

    setZoom(Math.max(0.15, Number(fitScale.toFixed(2))));
    setPan({ x: 0, y: 0 });
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.15));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Initialize or re-initialize Brush Compositor
  const initCompositor = useCallback(async (force = false) => {
    if (compositorRef.current && !force) return;

    try {
      const origImg = new Image();
      if (!originalUrl.startsWith('blob:')) origImg.crossOrigin = 'anonymous';
      const cutoutImg = new Image();
      if (!cutoutUrl.startsWith('blob:')) cutoutImg.crossOrigin = 'anonymous';

      await Promise.all([
        new Promise<void>((resolve, reject) => {
          origImg.onload = () => resolve();
          origImg.onerror = (e) => reject(e);
          origImg.src = originalUrl;
          if (origImg.complete && origImg.naturalWidth > 0) resolve();
        }),
        new Promise<void>((resolve, reject) => {
          cutoutImg.onload = () => resolve();
          cutoutImg.onerror = (e) => reject(e);
          cutoutImg.src = cutoutUrl;
          if (cutoutImg.complete && cutoutImg.naturalWidth > 0) resolve();
        }),
      ]);

      const comp = new BrushCompositor(width, height, origImg, cutoutImg);
      compositorRef.current = comp;
      setCanUndo(comp.canUndo());
      setCanRedo(comp.canRedo());

      // Render onto visible brush canvas if mounted
      if (brushCanvasRef.current) {
        const bCtx = brushCanvasRef.current.getContext('2d');
        if (bCtx) {
          bCtx.clearRect(0, 0, width, height);
          bCtx.drawImage(comp.getCanvas(), 0, 0);
        }
      }
    } catch (err) {
      console.error('Failed to initialize cutout brush compositor:', err);
    }
  }, [originalUrl, cutoutUrl, width, height]);

  // When a new image is loaded from scratch, reset compositor
  useEffect(() => {
    compositorRef.current = null;
  }, [originalUrl]);

  // Pre-initialize compositor so brush mode is immediately responsive without latency
  useEffect(() => {
    if (!compositorRef.current) {
      initCompositor();
    }
  }, [initCompositor]);

  // Sync brush canvas to screen
  const redrawBrushCanvas = useCallback(() => {
    if (brushCanvasRef.current && compositorRef.current) {
      const bCtx = brushCanvasRef.current.getContext('2d');
      if (bCtx) {
        bCtx.clearRect(0, 0, width, height);
        bCtx.drawImage(compositorRef.current.getCanvas(), 0, 0);
      }
    }
  }, [width, height]);

  // When switching into brush mode, ensure canvas displays current state
  useEffect(() => {
    if (viewMode === 'brush') {
      redrawBrushCanvas();
    }
  }, [viewMode, redrawBrushCanvas]);

  // Commit stroke and update parent blob
  const commitStroke = async () => {
    if (!compositorRef.current) return;
    compositorRef.current.pushHistory();
    setCanUndo(compositorRef.current.canUndo());
    setCanRedo(compositorRef.current.canRedo());

    if (onCutoutUpdated) {
      try {
        const newBlob = await compositorRef.current.exportBlob();
        const newUrl = URL.createObjectURL(newBlob);
        onCutoutUpdated(newBlob, newUrl);
      } catch (err) {
        console.error('Failed to export edited cutout blob:', err);
      }
    }
  };

  const handleUndo = async () => {
    if (compositorRef.current && compositorRef.current.undo()) {
      setCanUndo(compositorRef.current.canUndo());
      setCanRedo(compositorRef.current.canRedo());
      redrawBrushCanvas();
      if (onCutoutUpdated) {
        const newBlob = await compositorRef.current.exportBlob();
        onCutoutUpdated(newBlob, URL.createObjectURL(newBlob));
      }
    }
  };

  const handleRedo = async () => {
    if (compositorRef.current && compositorRef.current.redo()) {
      setCanUndo(compositorRef.current.canUndo());
      setCanRedo(compositorRef.current.canRedo());
      redrawBrushCanvas();
      if (onCutoutUpdated) {
        const newBlob = await compositorRef.current.exportBlob();
        onCutoutUpdated(newBlob, URL.createObjectURL(newBlob));
      }
    }
  };

  const handleResetToAI = async () => {
    if (compositorRef.current) {
      compositorRef.current.resetToInitial();
      setCanUndo(false);
      setCanRedo(false);
      redrawBrushCanvas();
      if (onCutoutUpdated) {
        const newBlob = await compositorRef.current.exportBlob();
        onCutoutUpdated(newBlob, URL.createObjectURL(newBlob));
      }
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'brush') return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === '[') {
        setBrushSize((s) => Math.max(5, s - 5));
      } else if (e.key === ']') {
        setBrushSize((s) => Math.min(120, s + 5));
      } else if (e.key.toLowerCase() === 'e') {
        setBrushMode('erase');
      } else if (e.key.toLowerCase() === 'r') {
        setBrushMode('restore');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  // Pointer position mapper from screen coords to native image coords
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = brushCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Brush Pointer Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0 || !compositorRef.current) return;
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const pt = getCanvasCoords(e);
    lastPointRef.current = pt;
    setIsDrawing(true);

    // Apply single stamp
    compositorRef.current.drawBrushStamp(pt.x, pt.y, brushSize, brushMode);
    redrawBrushCanvas();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pt = getCanvasCoords(e);
    setCursorPos({ x: e.clientX, y: e.clientY });

    if (isDrawing && compositorRef.current && lastPointRef.current) {
      compositorRef.current.drawStroke(lastPointRef.current, pt, brushSize, brushMode);
      lastPointRef.current = pt;
      redrawBrushCanvas();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    if (!isDrawing) return;
    setIsDrawing(false);
    lastPointRef.current = null;
    commitStroke();
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setZoom((prev) => Math.min(Math.max(0.15, prev + delta), 4));
  };

  // Pan interaction (when not in brush mode or when middle mouse clicked)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewMode !== 'brush' && (e.button === 0 || e.button === 1)) {
      setIsPanning(true);
      startPanRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    } else if (e.button === 1) {
      // Middle click always pans
      setIsPanning(true);
      startPanRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingSliderRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(pct);
      return;
    }

    if (isPanning) {
      setPan({
        x: e.clientX - startPanRef.current.x,
        y: e.clientY - startPanRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    isDraggingSliderRef.current = false;
  };

  // Slider drag events
  const handleSliderStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    isDraggingSliderRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDraggingSliderRef.current && containerRef.current && e.touches.length > 0) {
      const rect = containerRef.current.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (touchX / rect.width) * 100));
      setSliderPosition(pct);
    }
  };

  const handleTouchEnd = () => {
    isDraggingSliderRef.current = false;
  };

  // Get background style for cutout
  const getBackdropStyle = (): { className: string; style?: React.CSSProperties } => {
    switch (backdrop) {
      case 'checker-dark':
        return { className: 'checkerboard-pattern' };
      case 'checker-light':
        return { className: 'checkerboard-light' };
      case 'white':
        return { className: 'bg-white' };
      case 'black':
        return { className: 'bg-black' };
      case 'slate':
        return { className: 'bg-slate-800' };
      case 'custom':
        return { className: '', style: { backgroundColor: customColor } };
      default:
        return { className: 'checkerboard-pattern' };
    }
  };

  const backdropConfig = getBackdropStyle();

  return (
    <div className="w-full flex flex-col items-center">
      {/* Viewer Toolbar */}
      <div className="w-full max-w-5xl mb-4 flex flex-wrap items-center justify-between gap-3 px-2">
        {/* View Mode Toggle: Slider vs Side-by-Side vs Brush */}
        <div className="flex items-center p-1 bg-paper-2 border border-rule rounded-full text-xs shadow-sm">
          <button
            onClick={() => setViewMode('slider')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium tracking-tight transition-all cursor-pointer ${
              viewMode === 'slider'
                ? 'bg-paper text-ink shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Split Slider</span>
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium tracking-tight transition-all cursor-pointer ${
              viewMode === 'side-by-side'
                ? 'bg-paper text-ink shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side by Side</span>
          </button>
          <button
            onClick={() => setViewMode('brush')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium tracking-tight transition-all cursor-pointer ${
              viewMode === 'brush'
                ? 'bg-accent text-accent-ink shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
          >
            <Paintbrush className="w-3.5 h-3.5" />
            <span>Cutout Brush</span>
          </button>
        </div>

        {/* Backdrop Color Switcher */}
        <div className="flex items-center gap-1.5 p-1 px-3 bg-paper-2 border border-rule rounded-full shadow-sm">
          <span className="text-[11px] font-mono text-muted px-1 flex items-center gap-1">
            <Palette className="w-3 h-3" />
            Backdrop:
          </span>
          <button
            onClick={() => setBackdrop('checker-dark')}
            className={`w-4.5 h-4.5 rounded-full border checkerboard-pattern transition-transform cursor-pointer ${
              backdrop === 'checker-dark' ? 'ring-2 ring-accent border-accent scale-110' : 'border-rule'
            }`}
            title="Dark Checkerboard"
          />
          <button
            onClick={() => setBackdrop('checker-light')}
            className={`w-4.5 h-4.5 rounded-full border checkerboard-light transition-transform cursor-pointer ${
              backdrop === 'checker-light' ? 'ring-2 ring-accent border-accent' : 'border-rule'
            }`}
            title="Light Checkerboard"
          />
          <button
            onClick={() => setBackdrop('white')}
            className={`w-4.5 h-4.5 rounded-full bg-white border transition-transform cursor-pointer ${
              backdrop === 'white' ? 'ring-2 ring-accent border-accent' : 'border-rule'
            }`}
            title="White"
          />
          <button
            onClick={() => setBackdrop('black')}
            className={`w-4.5 h-4.5 rounded-full bg-black border transition-transform cursor-pointer ${
              backdrop === 'black' ? 'ring-2 ring-accent border-accent' : 'border-rule'
            }`}
            title="Black"
          />
          <button
            onClick={() => setBackdrop('slate')}
            className={`w-4.5 h-4.5 rounded-full bg-stone-700 border transition-transform cursor-pointer ${
              backdrop === 'slate' ? 'ring-2 ring-accent border-accent' : 'border-rule'
            }`}
            title="Neutral Slate"
          />
          <label
            className={`relative w-4.5 h-4.5 rounded-full border cursor-pointer overflow-hidden transition-transform ${
              backdrop === 'custom' ? 'ring-2 ring-accent border-accent scale-110' : 'border-rule'
            }`}
            title="Custom Color"
          >
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                setBackdrop('custom');
              }}
              className="absolute -top-2 -left-2 w-8 h-8 cursor-pointer opacity-0"
            />
            <div className="w-full h-full rounded-full" style={{ backgroundColor: customColor }} />
          </label>
        </div>

        {/* Zoom & Pan Controls */}
        <div className="flex items-center gap-1 p-1 px-2.5 bg-paper-2 border border-rule rounded-full text-xs text-ink shadow-sm">
          <button
            onClick={handleZoomOut}
            className="p-1 rounded-full hover:bg-paper text-muted hover:text-ink transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="w-12 text-center font-mono text-[11px] text-ink font-semibold">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded-full hover:bg-paper text-muted hover:text-ink transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-3.5 bg-rule mx-1" />
          <button
            onClick={handleFitToScreen}
            className="p-1 rounded-full hover:bg-paper text-muted hover:text-ink transition-colors cursor-pointer"
            title="Fit to Screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1 rounded-full hover:bg-paper text-muted hover:text-ink transition-colors cursor-pointer"
            title="Actual Size (100%)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="relative w-full max-w-5xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6">
        {/* Viewport Canvas Frame */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative flex-1 w-full h-[480px] sm:h-[580px] md:h-[640px] rounded-3xl border border-rule bg-paper overflow-hidden select-none shadow-xl flex items-center justify-center"
        >
          {/* Zoom & Pan Wrapper */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform 0.1s ease-out',
            }}
            className="relative max-w-full max-h-full flex items-center justify-center"
          >
            {/* 1. Split Slider Mode */}
            {viewMode === 'slider' && (
              <div
                className="relative overflow-hidden rounded-2xl border border-rule shadow-2xl"
                style={{ width: `${width}px`, height: `${height}px`, maxWidth: '90vw', maxHeight: '75vh' }}
              >
                <div
                  className={`absolute inset-0 w-full h-full ${backdropConfig.className}`}
                  style={backdropConfig.style}
                >
                  <img
                    src={cutoutUrl}
                    alt="Transparent Cutout"
                    className="w-full h-full object-contain pointer-events-none"
                  />
                </div>

                <div
                  className="absolute inset-0 w-full h-full overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <img
                    src={originalUrl}
                    alt="Original Image"
                    className="w-full h-full object-contain pointer-events-none"
                  />
                </div>

                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-accent cursor-ew-resize z-20 shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                  onMouseDown={handleSliderStart}
                  onTouchStart={handleSliderStart}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-accent text-accent-ink shadow-lg flex items-center justify-center border-2 border-paper text-xs font-bold pointer-events-auto">
                    <SplitSquareVertical className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-paper/90 backdrop-blur-sm border border-rule text-[11px] font-mono font-medium text-ink shadow-sm">
                  Original
                </div>
                <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-accent text-accent-ink border border-accent text-[11px] font-mono font-medium shadow-sm">
                  Transparent
                </div>
              </div>
            )}

            {/* 2. Side-by-Side Mode */}
            {viewMode === 'side-by-side' && (
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4">
                <div className="flex flex-col items-center">
                  <div className="text-xs font-mono font-medium text-muted mb-2">Original</div>
                  <div
                    className="relative overflow-hidden rounded-2xl border border-rule bg-paper-2 shadow-xl"
                    style={{ width: `${width / 2}px`, height: `${height / 2}px`, maxWidth: '44vw', maxHeight: '65vh' }}
                  >
                    <img
                      src={originalUrl}
                      alt="Original"
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-xs font-mono font-medium text-accent mb-2">Removed Background</div>
                  <div
                    className={`relative overflow-hidden rounded-2xl border border-rule shadow-xl ${backdropConfig.className}`}
                    style={{
                      width: `${width / 2}px`,
                      height: `${height / 2}px`,
                      maxWidth: '44vw',
                      maxHeight: '65vh',
                      ...backdropConfig.style,
                    }}
                  >
                    <img
                      src={cutoutUrl}
                      alt="Cutout"
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Interactive Cutout Brush Mode */}
            {viewMode === 'brush' && (
              <div
                className={`relative overflow-hidden rounded-2xl border border-rule shadow-2xl ${backdropConfig.className}`}
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  maxWidth: '90vw',
                  maxHeight: '75vh',
                  cursor: 'crosshair',
                  ...backdropConfig.style,
                }}
              >
                <canvas
                  ref={brushCanvasRef}
                  width={width}
                  height={height}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={() => setCursorPos(null)}
                  className="w-full h-full object-contain touch-none"
                />

                {/* Floating active mode badge */}
                <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-paper/90 backdrop-blur-sm border border-rule text-[11px] font-mono font-medium flex items-center gap-1.5 shadow-sm">
                  <span className={`w-2 h-2 rounded-full ${brushMode === 'erase' ? 'bg-accent' : 'bg-ink'}`} />
                  <span className={brushMode === 'erase' ? 'text-accent' : 'text-ink'}>
                    {brushMode === 'erase' ? 'Erase active' : 'Restore active'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Helper Hint */}
          <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2 text-[11px] text-muted bg-paper/90 backdrop-blur-sm px-3 py-1 rounded-full border border-rule pointer-events-none font-mono shadow-sm">
            <Move className="w-3 h-3 text-ink" />
            <span>{viewMode === 'brush' ? 'Draw to Erase/Restore • Drag with middle mouse or scroll to pan/zoom' : 'Click & drag to pan • Scroll to zoom'}</span>
          </div>
        </div>

        {/* Brush Controls Panel (Visible when in Brush mode) */}
        {viewMode === 'brush' && (
          <div className="w-full lg:w-80 shrink-0">
            <CutoutBrushPanel
              brushMode={brushMode}
              onBrushModeChange={(mode) => setBrushMode(mode)}
              brushSize={brushSize}
              onBrushSizeChange={(size) => setBrushSize(size)}
              canUndo={canUndo}
              onUndo={handleUndo}
              canRedo={canRedo}
              onRedo={handleRedo}
              onResetToAI={handleResetToAI}
            />
          </div>
        )}
      </div>

      {/* Floating Brush Ring Cursor Preview (when hovering in brush mode) */}
      {viewMode === 'brush' && cursorPos && (
        <div
          className="fixed rounded-full pointer-events-none z-50 border-2 transition-transform duration-75 ease-out"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            width: `${brushSize * zoom * 2}px`,
            height: `${brushSize * zoom * 2}px`,
            transform: 'translate(-50%, -50%)',
            borderColor: brushMode === 'erase' ? 'var(--color-accent)' : 'var(--color-ink)',
            backgroundColor: brushMode === 'erase' ? 'rgba(217, 22, 22, 0.15)' : 'rgba(100, 100, 100, 0.15)',
          }}
        />
      )}
    </div>
  );
};
