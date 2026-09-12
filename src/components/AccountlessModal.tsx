import React from 'react';
import { X, CheckCircle2, UserX, Sparkles } from 'lucide-react';

interface AccountlessModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'login' | 'signup';
}

export const AccountlessModal: React.FC<AccountlessModalProps> = ({
  isOpen,
  onClose,
  actionType,
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
      aria-labelledby="accountless-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-paper/80 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-paper-2 border border-rule rounded-3xl p-6 sm:p-8 shadow-2xl text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 p-2 rounded-full bg-paper border border-rule text-muted hover:text-ink hover:bg-paper-3 transition-colors cursor-pointer shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-paper border border-accent text-accent flex items-center justify-center shadow-sm">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <h3 id="accountless-modal-title" className="font-display font-medium text-xl text-ink tracking-tight">
              {actionType === 'login' ? 'No Login Required' : 'No Sign Up Needed'}
            </h3>
            <p className="font-mono text-xs text-muted">100% Free • Open • Accountless</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-muted leading-relaxed mb-6">
          <p className="text-sm text-ink font-normal">
            Unlike cloud background removers that force you to create accounts, buy subscriptions, or burn credits, <strong>Removal Studio works immediately right in your browser</strong>.
          </p>

          <div className="p-4 rounded-2xl bg-paper border border-rule space-y-2.5">
            <div className="flex items-center gap-2 text-ink font-medium">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>Zero credits to track or buy</span>
            </div>
            <div className="flex items-center gap-2 text-ink font-medium">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>Full resolution exports are never paywalled</span>
            </div>
            <div className="flex items-center gap-2 text-ink font-medium">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>No spam emails, passwords, or verification codes</span>
            </div>
            <div className="flex items-center gap-2 text-ink font-medium">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>100% private: images never touch a server</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-accent hover:bg-accent-hover text-accent-ink font-display font-medium text-sm tracking-tight transition-all cursor-pointer shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start Removing Backgrounds Now</span>
        </button>
      </div>
    </div>
  );
};
