import React, { useState } from 'react';
import { X, ExternalLink, ShieldCheck } from 'lucide-react';

interface SunsetBannerProps {
  onOpenPrivacy: () => void;
}

export const SunsetBanner: React.FC<SunsetBannerProps> = ({ onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside aria-label="Announcement" className="w-full bg-paper-2 border-b border-rule py-2.5 px-4 text-xs text-ink transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-center sm:text-left flex-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/15 text-accent font-mono text-[10px] font-semibold shrink-0">
            <ShieldCheck className="w-3 h-3" />
            Independent Alternative
          </span>
          <p className="text-muted leading-relaxed">
            remove.bg&apos;s background removal is moving to Canva and will sunset on <strong>1 December 2026</strong>.{' '}
            <span className="text-ink font-medium">
              Removal Studio is your free, 100% in-browser alternative that will never shut down or paywall exports.
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenPrivacy}
            className="text-accent hover:text-accent-hover font-medium underline flex items-center gap-1 cursor-pointer"
          >
            <span>Zero-Cloud Guarantee</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-full text-muted hover:text-ink hover:bg-paper transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
