import React from 'react';
import { X, Puzzle } from 'lucide-react';

interface PluginsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PluginsModal: React.FC<PluginsModalProps> = ({ isOpen, onClose }) => {
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
      aria-labelledby="plugins-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-paper/80 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-paper-2 border border-rule rounded-3xl p-6 sm:p-8 shadow-2xl text-left max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close plugins modal"
          className="absolute top-6 right-6 p-2 rounded-full bg-paper border border-rule text-muted hover:text-ink hover:bg-paper-3 transition-colors cursor-pointer shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-paper border border-accent text-accent flex items-center justify-center shadow-sm">
            <Puzzle className="w-6 h-6" />
          </div>
          <div>
            <h3 id="plugins-modal-title" className="font-display font-medium text-xl text-ink tracking-tight">
              Ecosystem &amp; Plugins
            </h3>
            <p className="font-mono text-xs text-muted">Direct Integrations for Creative Workflows</p>
          </div>
        </div>

        <p className="text-xs text-muted leading-relaxed mb-6">
          Bring Removal Studio&apos;s 100% private in-browser neural segmentation into your favorite design and production software.
        </p>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-paper border border-rule flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-ink text-sm">Figma Plugin</span>
                <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px]">Client-Side</span>
              </div>
              <p className="text-muted text-[11px] leading-relaxed">
                Remove backgrounds directly from canvas selections inside Figma with one keyboard shortcut.
              </p>
            </div>
            <span className="text-accent text-[11px] font-semibold shrink-0">Available</span>
          </div>

          <div className="p-4 rounded-2xl bg-paper border border-rule flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-ink text-sm">Adobe Photoshop Extension</span>
                <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px]">CEP / UXP</span>
              </div>
              <p className="text-muted text-[11px] leading-relaxed">
                Creates instant layer masks for high-resolution studio assets with halo decontamination.
              </p>
            </div>
            <span className="text-accent text-[11px] font-semibold shrink-0">Available</span>
          </div>

          <div className="p-4 rounded-2xl bg-paper border border-rule flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-ink text-sm">Desktop App (Windows / Mac / Linux)</span>
                <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px]">Offline First</span>
              </div>
              <p className="text-muted text-[11px] leading-relaxed">
                Run batch processing entirely on your local machine without needing an internet connection.
              </p>
            </div>
            <span className="text-accent text-[11px] font-semibold shrink-0">Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};
