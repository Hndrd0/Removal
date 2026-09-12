import React from 'react';
import { X, CheckCircle, HeartHandshake, Heart, Sparkles } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadClick: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onUploadClick }) => {
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
      aria-labelledby="pricing-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-paper/80 backdrop-blur-md animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-paper-2 border border-rule rounded-3xl p-6 sm:p-8 shadow-2xl text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close pricing dialog"
          className="absolute top-6 right-6 p-2 rounded-full bg-paper border border-rule text-muted hover:text-ink hover:bg-paper-3 transition-colors cursor-pointer shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-paper border border-accent text-accent flex items-center justify-center shadow-sm">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent font-mono text-[10px] font-semibold mb-1">
              <Heart className="w-3 h-3 fill-accent text-accent" />
              <span>Run by the love of you</span>
            </div>
            <h3 id="pricing-modal-title" className="font-display font-medium text-xl text-ink tracking-tight">
              100% Free Forever
            </h3>
            <p className="font-mono text-xs text-muted">Zero Paywalls • Unlimited HD Exports</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-paper border border-rule mb-5">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-4xl text-ink">$0</span>
              <span className="font-mono text-xs text-muted uppercase">/ FOREVER</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-mono text-[11px] font-bold">
              No Cards • No Fees
            </span>
          </div>

          <p className="text-xs text-muted leading-relaxed">
            Because Removal Studio runs 100% on your device&apos;s GPU via WebGPU and WebAssembly, we don&apos;t pay cloud server bills to process your images. Therefore, we pass that 100% savings directly to you &mdash; powered purely by local hardware and run by the love of you.
          </p>

          <div className="mt-4 pt-4 border-t border-rule space-y-2 text-xs font-mono text-ink">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>Unlimited full-resolution 4K/8K exports</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>Full access to Cutout Brush (Erase &amp; Restore)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>Commercial, personal, and educational use permitted</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>Zero ads, tracking cookies, or subscription renewals</span>
            </div>
            <div className="flex items-center gap-2 text-accent font-semibold pt-1">
              <Heart className="w-3.5 h-3.5 fill-accent shrink-0" />
              <span>Run by the love of you &mdash; 100% independent &amp; open</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            onClose();
            onUploadClick();
          }}
          className="w-full py-3.5 rounded-full bg-accent hover:bg-accent-hover text-accent-ink font-display font-bold text-sm tracking-tight transition-all cursor-pointer shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>Use Removal Studio For Free</span>
          <Sparkles className="w-4 h-4" />
        </button>

        <p className="mt-3 text-center font-mono text-[11px] text-muted flex items-center justify-center gap-1">
          <span>Made with care &amp; run by the love of you</span>
          <Heart className="w-3 h-3 text-accent fill-accent inline" />
        </p>
      </div>
    </div>
  );
};
