import React, { useRef, useState } from 'react';
import { UploadCloud, Link2, Sparkles, SplitSquareVertical } from 'lucide-react';

interface HeroUploadSectionProps {
  onFileSelected: (file: File) => void;
  onSampleSelected: (samplePath: string, sampleName: string) => void;
  onOpenUrlModal: () => void;
  onOpenTerms: () => void;
  disabled?: boolean;
}

export const HeroUploadSection: React.FC<HeroUploadSectionProps> = ({
  onFileSelected,
  onSampleSelected,
  onOpenUrlModal,
  onOpenTerms,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [heroSliderPos, setHeroSliderPos] = useState(52); // percentage for demo visual
  const isDraggingDemoSlider = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const isKnownImageExt = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'bmp', 'tiff', 'gif'].includes(ext);
      if (file.type.startsWith('image/') || isKnownImageExt) {
        onFileSelected(file);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelected(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  // Demo slider mouse & touch drag logic
  const handleDemoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingDemoSlider.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(10, Math.min(90, (x / rect.width) * 100));
    setHeroSliderPos(pct);
  };

  const handleDemoTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingDemoSlider.current || e.touches.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const pct = Math.max(10, Math.min(90, (x / rect.width) * 100));
    setHeroSliderPos(pct);
  };

  return (
    <section id="hero-upload-section" className="w-full max-w-6xl mx-auto pt-6 pb-12 sm:pt-10 sm:pb-16 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Headline & Interactive Visual Showcase */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
          {/* Interactive Before/After Mini Showcase */}
          <div
            className="relative w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden border border-rule bg-paper-2 shadow-xl cursor-ew-resize select-none touch-none"
            onMouseDown={() => { isDraggingDemoSlider.current = true; }}
            onMouseUp={() => { isDraggingDemoSlider.current = false; }}
            onMouseLeave={() => { isDraggingDemoSlider.current = false; }}
            onMouseMove={handleDemoMouseMove}
            onTouchStart={() => { isDraggingDemoSlider.current = true; }}
            onTouchEnd={() => { isDraggingDemoSlider.current = false; }}
            onTouchMove={handleDemoTouchMove}
          >
            {/* Cutout (Transparent side) */}
            <div className="absolute inset-0 w-full h-full checkerboard-light dark:checkerboard-pattern flex items-center justify-center p-4">
              <img
                src="/samples/stockimg1-cutout.png"
                alt="Portrait with fine hair cutout"
                className="w-full h-full object-cover rounded-2xl pointer-events-none"
                style={{
                  filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.25))',
                }}
              />
            </div>

            {/* Original side overlay */}
            <div
              className="absolute inset-0 w-full h-full overflow-hidden p-4"
              style={{ clipPath: `inset(0 ${100 - heroSliderPos}% 0 0)` }}
            >
              <img
                src="/samples/stockimg1.jpg"
                alt="Original Portrait"
                className="w-full h-full object-cover rounded-2xl pointer-events-none brightness-95"
              />
            </div>

            {/* Split Slider Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-accent z-20 shadow-[0_0_8px_rgba(0,0,0,0.5)] pointer-events-none"
              style={{ left: `${heroSliderPos}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-accent text-accent-ink shadow-lg flex items-center justify-center border-2 border-paper">
                <SplitSquareVertical className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-paper/90 backdrop-blur-sm border border-rule text-[11px] font-mono font-medium text-ink shadow-sm">
              Original
            </div>
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-accent text-accent-ink text-[11px] font-mono font-medium shadow-sm">
              Transparent
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-0.5 rounded-full bg-paper/85 backdrop-blur-sm border border-rule text-[10px] font-mono text-muted">
              Drag to inspect edge quality
            </div>
          </div>

          {/* Hero Headline & Tagline */}
          <div className="space-y-2">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink tracking-tight leading-[1.08]">
              Studio-quality background removal.
            </h1>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1 text-2xl sm:text-3xl font-bold text-ink">
              <span className="px-3.5 py-0.5 rounded-full bg-accent text-accent-ink text-xl sm:text-2xl font-black shadow-sm">
                100% client-side.
              </span>
            </div>
            <p className="text-muted text-sm sm:text-base max-w-md mx-auto lg:mx-0 pt-2 leading-relaxed">
              Neural matting runs entirely inside your browser via WebGPU. Your photos never leave your device. Zero cloud uploads, zero telemetry.
            </p>
          </div>
        </div>

        {/* Right Column: The Iconic Remove.bg Upload Box Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-3xl p-6 sm:p-8 bg-paper-2 border-2 transition-all duration-200 shadow-2xl flex flex-col items-center text-center ${
              isDragOver ? 'border-accent bg-paper-3 shadow-accent/10' : 'border-rule'
            } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={disabled}
            />

            {/* Upload Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-paper border border-rule flex items-center justify-center mb-5 text-accent shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>

            {/* Primary Big Upload Button */}
            <button
              type="button"
              onClick={handleBrowseClick}
              className="w-full py-4 px-6 rounded-full bg-accent hover:bg-accent-hover text-accent-ink font-display font-bold text-base sm:text-lg tracking-tight shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer mb-3 active:scale-[0.98]"
            >
              Upload Image
            </button>

            {/* Subtext with URL link */}
            <p className="text-xs sm:text-sm text-ink font-medium mb-1">
              or drop a file, paste image or{' '}
              <button
                type="button"
                onClick={onOpenUrlModal}
                className="text-accent underline hover:text-accent-hover font-semibold cursor-pointer inline-flex items-center gap-0.5"
              >
                <span>URL</span>
                <Link2 className="w-3 h-3" />
              </button>
            </p>

            <p className="text-[11px] text-muted mb-6">
              Paste from clipboard with <kbd className="px-1.5 py-0.5 rounded bg-paper border border-rule text-ink font-mono text-[10px]">Ctrl+V</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-paper border border-rule text-ink font-mono text-[10px]">⌘+V</kbd>
            </p>

            {/* Curated Sample Section: "No image? Try one of these:" */}
            <div className="w-full pt-5 border-t border-rule text-left">
              <div className="flex items-center gap-1.5 text-xs text-muted mb-3 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>No image? Try one of these:</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => onSampleSelected('/samples/stockimg1.jpg', 'stockimg1.jpg')}
                  className="group flex flex-col items-center p-1.5 rounded-2xl bg-paper hover:bg-paper-3 border border-rule hover:border-accent transition-all cursor-pointer shadow-sm"
                  title="Test with Portrait sample (stockimg1.jpg)"
                >
                  <img
                    src="/samples/stockimg1.jpg"
                    alt="People Sample"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-rule mb-1.5 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-[10px] font-mono text-muted group-hover:text-ink truncate max-w-full">
                    People
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onSampleSelected('/samples/stockimg2.avif', 'stockimg2.avif')}
                  className="group flex flex-col items-center p-1.5 rounded-2xl bg-paper hover:bg-paper-3 border border-rule hover:border-accent transition-all cursor-pointer shadow-sm"
                  title="Test with Cat Animal sample (stockimg2.avif)"
                >
                  <img
                    src="/samples/stockimg2.avif"
                    alt="Animal Sample"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-rule mb-1.5 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-[10px] font-mono text-muted group-hover:text-ink truncate max-w-full">
                    Animals
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onSampleSelected('/samples/stockimg3.avif', 'stockimg3.avif')}
                  className="group flex flex-col items-center p-1.5 rounded-2xl bg-paper hover:bg-paper-3 border border-rule hover:border-accent transition-all cursor-pointer shadow-sm"
                  title="Test with Car sample (stockimg3.avif)"
                >
                  <img
                    src="/samples/stockimg3.avif"
                    alt="Car Sample"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-rule mb-1.5 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-[10px] font-mono text-muted group-hover:text-ink truncate max-w-full">
                    Cars
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onSampleSelected('/samples/stockimg4.jpg', 'stockimg4.jpg')}
                  className="group flex flex-col items-center p-1.5 rounded-2xl bg-paper hover:bg-paper-3 border border-rule hover:border-accent transition-all cursor-pointer shadow-sm"
                  title="Test with Sunflower sample (stockimg4.jpg)"
                >
                  <img
                    src="/samples/stockimg4.jpg"
                    alt="Nature Sample"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-rule mb-1.5 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-[10px] font-mono text-muted group-hover:text-ink truncate max-w-full">
                    Nature
                  </span>
                </button>
              </div>
            </div>

            {/* Terms notice matching Remove.bg */}
            <div className="mt-5 text-[10px] text-muted leading-relaxed">
              By uploading an image or URL you agree to our{' '}
              <button
                type="button"
                onClick={onOpenTerms}
                className="text-ink underline hover:text-accent cursor-pointer"
              >
                Terms of Service
              </button>
              . All computation executes 100% locally on your machine.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
