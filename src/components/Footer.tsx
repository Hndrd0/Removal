import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenApi: () => void;
  onOpenBulk: () => void;
  onOpenPlugins: () => void;
  onOpenPricing: () => void;
  onScrollToUpload: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenApi,
  onOpenBulk,
  onOpenPlugins,
  onOpenPricing,
  onScrollToUpload,
}) => {
  return (
    <footer className="w-full bg-paper border-t border-rule mt-16 pt-16 pb-12 px-4 sm:px-8 transition-colors text-left">
      <div className="max-w-6xl mx-auto">
        {/* 4 Multi-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-rule text-xs">
          {/* Column 1: Learn more */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm text-ink tracking-tight uppercase">
              Learn More
            </h4>
            <ul className="space-y-2 text-muted">
              <li>
                <button onClick={onScrollToUpload} className="hover:text-ink transition-colors cursor-pointer text-left">
                  All features
                </button>
              </li>
              <li>
                <button onClick={onScrollToUpload} className="hover:text-ink transition-colors cursor-pointer text-left">
                  for Photographers
                </button>
              </li>
              <li>
                <button onClick={onScrollToUpload} className="hover:text-ink transition-colors cursor-pointer text-left">
                  for Marketing
                </button>
              </li>
              <li>
                <button onClick={onOpenApi} className="hover:text-ink transition-colors cursor-pointer text-left">
                  for Developers
                </button>
              </li>
              <li>
                <button onClick={onScrollToUpload} className="hover:text-ink transition-colors cursor-pointer text-left">
                  for Ecommerce
                </button>
              </li>
              <li>
                <button onClick={onScrollToUpload} className="hover:text-ink transition-colors cursor-pointer text-left">
                  for Media &amp; Creators
                </button>
              </li>
              <li>
                <button onClick={onOpenBulk} className="hover:text-ink transition-colors cursor-pointer text-left">
                  for Enterprise
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Tools & API */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm text-ink tracking-tight uppercase">
              Tools &amp; API
            </h4>
            <ul className="space-y-2 text-muted">
              <li>
                <button onClick={onOpenApi} className="hover:text-ink transition-colors cursor-pointer text-left">
                  WebGPU / WASM API
                </button>
              </li>
              <li>
                <button onClick={onOpenBulk} className="hover:text-ink transition-colors cursor-pointer text-left">
                  Bulk Batch Processing
                </button>
              </li>
              <li>
                <button onClick={onOpenPlugins} className="hover:text-ink transition-colors cursor-pointer text-left">
                  Photoshop Extension
                </button>
              </li>
              <li>
                <button onClick={onOpenPlugins} className="hover:text-ink transition-colors cursor-pointer text-left">
                  Figma Plugin
                </button>
              </li>
              <li>
                <button onClick={onOpenPlugins} className="hover:text-ink transition-colors cursor-pointer text-left">
                  Desktop App (Win/Mac/Linux)
                </button>
              </li>
              <li>
                <button onClick={onOpenPricing} className="hover:text-ink transition-colors cursor-pointer text-left">
                  Pricing &amp; Quotas ($0 Free)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Support & Transparency */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm text-ink tracking-tight uppercase">
              Support
            </h4>
            <ul className="space-y-2 text-muted">
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-ink transition-colors cursor-pointer text-left flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span>Zero-Telemetry Audit</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-ink transition-colors cursor-pointer text-left">
                  How to Verify with DevTools
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-ink transition-colors cursor-pointer text-left">
                  Help Center &amp; FAQ
                </button>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink transition-colors cursor-pointer text-left block"
                >
                  Contact Community
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Security */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm text-ink tracking-tight uppercase">
              Legal
            </h4>
            <ul className="space-y-2 text-muted">
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-ink transition-colors cursor-pointer text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-ink transition-colors cursor-pointer text-left">
                  Terms of Service
                </button>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink transition-colors cursor-pointer text-left block"
                >
                  Open Source (MIT License)
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink transition-colors cursor-pointer text-left block"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-accent inline-block"></span>
            <span className="font-semibold text-ink text-sm">Silhouex</span>
            <span>·</span>
            <span className="font-mono text-[11px]">100% In-Browser AI Background Remover</span>
          </div>

          <div className="flex items-center gap-1.5 text-muted font-mono text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-accent fill-current" />
            <span>as a standalone, forever-free alternative to remove.bg</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
