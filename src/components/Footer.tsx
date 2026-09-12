import React from 'react';
import { ShieldCheck, Heart, Info } from 'lucide-react';
import { RAZORPAY_PAYMENT_LINK } from '../config/donation';

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
        {/* Subtle, Non-Intrusive Support Project Card */}
        <div
          id="support-project-card"
          className="mb-12 p-6 sm:p-7 rounded-3xl bg-paper-2 border border-rule transition-colors flex flex-col gap-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="max-w-xl space-y-1.5">
              <h3 className="font-display font-semibold text-base sm:text-lg text-ink tracking-tight">
                Enjoying Removal?
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                This project is free, open-source, and runs entirely in your browser. If it saved you some time, consider supporting development ❤️
              </p>
            </div>
            <div className="shrink-0 w-full sm:w-auto">
              <a
                id="support-project-button"
                href={RAZORPAY_PAYMENT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-accent-ink font-display font-semibold text-xs sm:text-sm tracking-tight transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                aria-label="Support the project on Razorpay (opens in a new tab)"
              >
                <span>Support the project ❤️</span>
              </a>
            </div>
          </div>

          {/* Transparent Payment Account Note */}
          <div className="pt-4 border-t border-rule/70 flex items-start gap-3 text-left">
            <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-xs text-muted leading-relaxed">
              <p className="font-semibold text-ink">
                Why does the payment page say GreenJournal?
              </p>
              <p>
                The payment account is under <strong className="text-ink font-semibold">GreenJournal</strong>, another project created and maintained by the same developer behind Removal. I&apos;m currently using my existing Razorpay account for accepting voluntary support for this project, so the Razorpay checkout may display the GreenJournal name.
              </p>
              <p className="font-medium text-ink">
                Your donation still goes directly toward supporting the development and maintenance of Removal.
              </p>
            </div>
          </div>
        </div>

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
              <li className="pt-1">
                <a
                  id="footer-support-link"
                  href={RAZORPAY_PAYMENT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent text-muted transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                  aria-label="Support the project on Razorpay (opens in a new tab)"
                >
                  <Heart className="w-3.5 h-3.5 text-accent fill-accent shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-ink group-hover:text-accent">Support the project ❤️</span>
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
            <span className="font-semibold text-ink text-sm">Removal Studio</span>
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
