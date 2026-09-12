import React from 'react';
import { X, FileText } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
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
      aria-labelledby="terms-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-paper/80 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-paper-2 border border-rule rounded-3xl p-6 sm:p-8 shadow-2xl text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close terms modal"
          className="absolute top-6 right-6 p-2 rounded-full bg-paper border border-rule text-muted hover:text-ink hover:bg-paper-3 transition-colors cursor-pointer shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-paper border border-rule text-accent flex items-center justify-center shadow-sm">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 id="terms-modal-title" className="font-display font-medium text-xl sm:text-2xl text-ink tracking-tight">Terms of Service</h2>
            <p className="font-mono text-xs text-muted">Open • Free • Responsible Use</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-5 text-xs sm:text-sm text-ink leading-relaxed">
          <div>
            <h3 className="font-display text-sm uppercase text-ink mb-1">1. FREE & OPEN SERVICE</h3>
            <p className="text-xs text-muted">
              Removal Studio is provided free of charge for personal, educational, and commercial background removal workflows. You retain full copyright and ownership of any images you process.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase text-ink mb-1">2. CLIENT-SIDE EXECUTION</h3>
            <p className="text-xs text-muted">
              All processing is executed entirely within your local device hardware. We do not inspect, retain, or share your images because they never pass through our servers.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase text-ink mb-1">3. ACCEPTABLE USE</h3>
            <p className="text-xs text-muted">
              You agree not to use the application to process illegal content or infringe upon third-party intellectual property rights. You are solely responsible for the images you choose to process.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase text-ink mb-1">4. DISCLAIMER OF WARRANTY</h3>
            <p className="text-xs text-muted">
              The service is provided &ldquo;as is&rdquo;, without warranty of any kind. While we engineer for maximum edge fidelity and reliability, processing performance depends on local browser and GPU capabilities.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-rule flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-paper hover:bg-paper-3 border border-rule hover:border-ink font-display text-xs uppercase tracking-wider text-ink transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
