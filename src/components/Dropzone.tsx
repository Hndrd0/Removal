import React, { useRef, useState } from 'react';
import { UploadCloud, Shield, Lock, Layers, Brush } from 'lucide-react';

interface DropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFileSelected,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
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
    // reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Modern-Minimal Coral Headline */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper-2 border border-rule text-muted text-xs font-mono mb-4">
          <span className="w-2 h-2 rounded-full bg-accent inline-block animate-pulse"></span>
          <span>100% Client-Side Neural Matting</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.03em] text-ink leading-[1.08] mb-4">
          Studio background removal, <br className="hidden sm:inline" />
          <span className="text-accent">built into your browser.</span>
        </h1>
        <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
          Neural matting computed 100% inside your browser GPU & WASM. Your private images never touch a server. No accounts, no paywalls, zero telemetry.
        </p>
      </div>

      {/* Main Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        className={`relative group rounded-3xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden p-8 sm:p-14 text-center bg-paper-2 ${
          isDragOver
            ? 'border-accent bg-paper-3 shadow-lg'
            : 'border-rule hover:border-ink/50'
        } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="relative z-10 flex flex-col items-center justify-center">
          <div
            className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center mb-5 border transition-all duration-200 ${
              isDragOver
                ? 'bg-accent text-accent-ink border-accent'
                : 'bg-paper text-ink border-rule group-hover:border-ink/40 shadow-sm'
            }`}
          >
            <UploadCloud className="w-8 h-8 text-accent" />
          </div>

          <button
            type="button"
            className="px-8 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-accent-ink font-display font-medium text-sm sm:text-base tracking-tight shadow-sm transition-all duration-150 cursor-pointer mb-3 active:scale-[0.98]"
          >
            Select Image
          </button>

          <p className="text-ink font-medium text-sm sm:text-base mb-1.5">
            or drag & drop your image directly here
          </p>
          <p className="text-xs text-muted">
            Paste from clipboard with <kbd className="px-1.5 py-0.5 rounded bg-paper border border-rule text-ink font-mono text-[11px]">Ctrl+V</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-paper border border-rule text-ink font-mono text-[11px]">⌘+V</kbd>
          </p>

          {/* Supported Formats */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted">
            <span className="px-2.5 py-0.5 rounded-full bg-paper border border-rule font-mono text-[11px]">JPG</span>
            <span className="px-2.5 py-0.5 rounded-full bg-paper border border-rule font-mono text-[11px]">PNG</span>
            <span className="px-2.5 py-0.5 rounded-full bg-paper border border-rule font-mono text-[11px]">WEBP</span>
            <span className="px-2.5 py-0.5 rounded-full bg-paper border border-rule font-mono text-[11px]">AVIF</span>
            <span className="text-rule">•</span>
            <span className="font-mono text-[11px]">Up to 35MB & 45 Megapixels</span>
          </div>
        </div>
      </div>

      {/* Bento Product Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-8">
        <div className="p-5 rounded-2xl bg-paper-2 border border-rule text-left flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-xl bg-paper text-accent border border-rule flex items-center justify-center mb-3.5">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="font-display font-medium text-sm text-ink mb-1">
              Zero data uploaded
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Runs 100% inside your browser memory. Telemetry-free by architecture.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-paper-2 border border-rule text-left flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-xl bg-paper text-accent border border-rule flex items-center justify-center mb-3.5">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="font-display font-medium text-sm text-ink mb-1">
              Full resolution
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Never downscaled or paywalled on export. Full raw pixels preserved.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-paper-2 border border-rule text-left flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-xl bg-paper text-accent border border-rule flex items-center justify-center mb-3.5">
              <Shield className="w-4 h-4" />
            </div>
            <h4 className="font-display font-medium text-sm text-ink mb-1">
              Halo decontamination
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Edge-aware color bleeding suppression cleans white and dark halos.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-paper-2 border border-rule text-left flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-xl bg-paper text-accent border border-rule flex items-center justify-center mb-3.5">
              <Brush className="w-4 h-4" />
            </div>
            <h4 className="font-display font-medium text-sm text-ink mb-1">
              Cutout brush
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Integrated Erase and Restore brush for surgical edge corrections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
