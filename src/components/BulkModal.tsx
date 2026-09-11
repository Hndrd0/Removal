import React from 'react';
import { X, Layers, Zap, Cpu, Sparkles } from 'lucide-react';

interface BulkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadClick: () => void;
}

export const BulkModal: React.FC<BulkModalProps> = ({ isOpen, onClose, onUploadClick }) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-paper/80 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-paper-2 border border-rule rounded-3xl p-6 sm:p-8 shadow-2xl text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close bulk modal"
          className="absolute top-6 right-6 p-2 rounded-full bg-paper border border-rule text-muted hover:text-ink hover:bg-paper-3 transition-colors cursor-pointer shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-paper border border-accent text-accent flex items-center justify-center shadow-sm">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 id="bulk-modal-title" className="font-display font-medium text-xl text-ink tracking-tight">
              In-Browser Bulk Editing
            </h3>
            <p className="font-mono text-xs text-muted">Process Multiple Photos Simultaneously</p>
          </div>
        </div>

        <p className="text-xs text-muted leading-relaxed mb-5">
          Process entire product catalogs, wedding albums, or asset libraries directly on your device. Powered by WebGPU batch parallelism with zero server uploads.
        </p>

        <div className="space-y-3 mb-6 font-mono text-xs">
          <div className="p-3.5 rounded-2xl bg-paper border border-rule flex items-start gap-3">
            <Zap className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="text-ink font-semibold block mb-0.5">High-Throughput Parallel Matting</span>
              <span className="text-muted text-[11px] leading-relaxed">
                Processes multiple images concurrently using local GPU shader execution without network roundtrips.
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-paper border border-rule flex items-start gap-3">
            <Cpu className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="text-ink font-semibold block mb-0.5">Zero Cloud Bandwidth or Egress</span>
              <span className="text-muted text-[11px] leading-relaxed">
                Even 1,000 photos won&apos;t consume any upload bandwidth because raw bytes never travel across the internet.
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            onClose();
            onUploadClick();
          }}
          className="w-full py-3 rounded-full bg-accent hover:bg-accent-hover text-accent-ink font-display font-medium text-sm tracking-tight transition-all cursor-pointer shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Select Images to Process</span>
        </button>
      </div>
    </div>
  );
};
