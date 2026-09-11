import React from 'react';
import { X, ShieldCheck, ServerOff, Check } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
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
      aria-labelledby="privacy-modal-title"
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
          aria-label="Close privacy modal"
          className="absolute top-6 right-6 p-2 rounded-full bg-paper border border-rule text-muted hover:text-ink hover:bg-paper-3 transition-colors cursor-pointer shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-paper border border-accent text-accent flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 id="privacy-modal-title" className="font-display font-medium text-xl sm:text-2xl text-ink tracking-tight">Privacy Architecture</h2>
            <p className="font-mono text-xs text-muted">100% Client-Side • Zero Knowledge Guarantee</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm text-ink leading-relaxed">
          <div className="p-4.5 rounded-2xl bg-paper border border-accent/60 shadow-sm">
            <h4 className="font-display font-medium text-sm text-accent flex items-center gap-2 mb-1">
              <ServerOff className="w-4 h-4" />
              Your images never leave your device
            </h4>
            <p className="text-xs text-muted">
              Unlike cloud-based services that upload your private photos to remote servers, Silhouex runs the entire AI neural matting model directly inside your local web browser using WebGPU and WebAssembly.
            </p>
          </div>

          <div>
            <h3 className="font-display text-base uppercase text-ink mb-2">STRICT PRIVACY COMMITMENTS</h3>
            <ul className="space-y-2.5 text-xs text-muted font-normal">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span><strong className="text-ink">Zero Telemetry:</strong> No Google Analytics, Meta Pixel, Hotjar, Clarity, or third-party tracking scripts whatsoever.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span><strong className="text-ink">No Account Required:</strong> No registration, passwords, emails, or logins to access full features.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span><strong className="text-ink">No Image Retention:</strong> Ephemeral browser memory only. Once the tab closes, all data vanishes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span><strong className="text-ink">No Advertising:</strong> Completely ad-free. No banner ads, popup ads, tracking pixels, or affiliate links.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span><strong className="text-ink">Air-Gapped / Offline Capable:</strong> Once model assets are cached by your browser, you can disconnect your network and matting still runs.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base uppercase text-ink mb-2">HOW TO VERIFY</h3>
            <p className="text-xs text-muted leading-relaxed">
              Open your browser Developer Tools (<kbd className="px-1 py-0.5 bg-paper border border-rule font-mono text-[10px] text-ink">F12</kbd>), navigate to the <strong>Network</strong> tab, and process an image. You will observe that <strong>zero image data or telemetry requests</strong> are sent across the wire.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-rule flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-paper hover:bg-paper-3 border border-rule hover:border-ink font-display text-xs uppercase tracking-wider text-ink transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
