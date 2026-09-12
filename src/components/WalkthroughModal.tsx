import React from 'react';
import { X, Sparkles, ShieldCheck, CheckCircle2, ArrowRight, Zap, EyeOff, Paintbrush, Ban } from 'lucide-react';

interface WalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export const WalkthroughModal: React.FC<WalkthroughModalProps> = ({
  isOpen,
  onClose,
  onStart,
}) => {
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
      aria-labelledby="walkthrough-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-paper/80 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl my-8 bg-paper-2 border border-rule rounded-3xl p-6 sm:p-8 shadow-2xl text-left max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close walkthrough"
          className="absolute top-6 right-6 p-2 rounded-full bg-paper border border-rule text-muted hover:text-ink hover:bg-paper-3 transition-colors cursor-pointer shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-accent text-accent-ink flex items-center justify-center font-black shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-[11px] font-semibold uppercase tracking-wider mb-1">
              First-Time Visitor Guide
            </div>
            <h2 id="walkthrough-modal-title" className="font-display font-bold text-2xl sm:text-3xl text-ink tracking-tight">
              Welcome to Removal Studio
            </h2>
          </div>
        </div>

        {/* Two Feature Sections */}
        <div className="space-y-5">
          {/* Section 1: No Login Required */}
          <div className="p-5 sm:p-6 rounded-2xl bg-paper border border-rule shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-2.5">
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 rounded-md bg-accent/10 text-accent font-mono text-[11px] font-bold tracking-wide uppercase">
                  No Login Required
                </span>
                <h3 className="font-display font-bold text-lg sm:text-xl text-ink">
                  100% Free • Open • Accountless
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-paper-2 border border-rule text-accent flex items-center justify-center shrink-0">
                <EyeOff className="w-5 h-5" />
              </div>
            </div>

            <p className="text-muted text-xs sm:text-sm leading-relaxed mb-4">
              Unlike cloud background removers that force you to create accounts, buy subscriptions, or burn credits, Removal Studio works immediately right in your browser.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="flex items-center gap-2 text-xs font-medium text-ink">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>Zero credits to track or buy</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-ink">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>Full resolution exports are never paywalled</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-ink">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>No spam emails, passwords, or verification codes</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-ink">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                <span>100% private: images never touch a server</span>
              </div>
            </div>
          </div>

          {/* Section 2: 100% Free Forever */}
          <div className="p-5 sm:p-6 rounded-2xl bg-paper border border-rule shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-2.5">
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-mono text-[11px] font-bold tracking-wide uppercase">
                  100% Free Forever
                </span>
                <h3 className="font-display font-bold text-lg sm:text-xl text-ink">
                  Zero Paywalls • Unlimited HD Exports
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-paper-2 border border-rule text-emerald-500 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
            </div>

            <p className="text-muted text-xs sm:text-sm leading-relaxed mb-4">
              Because Removal Studio runs 100% on your device&apos;s GPU via WebGPU and WebAssembly, we don&apos;t pay cloud server bills to process your images. Therefore, we pass that 100% savings directly to you &mdash; run by the love of you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="flex items-center gap-2 text-xs font-medium text-ink">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>Unlimited full-resolution 4K/8K exports</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-ink">
                <Paintbrush className="w-4 h-4 text-accent shrink-0" />
                <span>Full access to Cutout Brush (Erase &amp; Restore)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-ink">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>Commercial, personal, and educational use permitted</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-ink">
                <Ban className="w-4 h-4 text-accent shrink-0" />
                <span>Zero ads, tracking cookies, or subscription renewals</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-6 pt-5 border-t border-rule flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-mono text-muted text-center sm:text-left">
            Your preference is saved locally. You won&apos;t see this again.
          </p>

          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-accent-ink font-display font-bold text-sm tracking-tight transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Start Removing Backgrounds Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
