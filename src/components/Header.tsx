import React, { useState } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenApi?: () => void;
  onOpenBulk?: () => void;
  onOpenPlugins?: () => void;
  onOpenPricing: () => void;
  onOpenAuth?: (type: 'login' | 'signup') => void;
  onScrollToUpload: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPricing,
  onScrollToUpload,
  isDark,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-2 sm:top-3 z-40 w-full px-3 sm:px-6 pointer-events-none">
      <nav
        aria-label="Primary navigation"
        className="max-w-6xl mx-auto h-14 px-4 sm:px-6 bg-paper/90 backdrop-blur-md border border-rule rounded-full shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] flex items-center justify-between pointer-events-auto transition-colors"
      >
        {/* Brand Wordmark */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onScrollToUpload}
            className="flex items-center gap-2 text-left cursor-pointer focus:outline-none"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] animate-pulse" />
            <span className="font-display font-semibold text-lg sm:text-xl tracking-tight text-ink select-none">
              Removal Studio
            </span>
          </button>
          <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full bg-paper-2 border border-rule font-mono text-[10px] text-muted font-medium">
            remove.bg alternative
          </span>
        </div>

        {/* Center Links (Desktop) */}
        <div className="hidden sm:flex items-center gap-1 xl:gap-2 text-xs font-medium text-muted">
          <button
            onClick={onScrollToUpload}
            className="px-3.5 py-1.5 rounded-full hover:text-ink hover:bg-paper-2 transition-colors cursor-pointer"
          >
            Uploads
          </button>
          <button
            onClick={onOpenPricing}
            className="px-3.5 py-1.5 rounded-full hover:text-ink hover:bg-paper-2 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Pricing</span>
            <span className="px-1.5 py-0.5 rounded-full bg-accent/15 text-accent font-mono text-[10px] font-semibold">Free</span>
          </button>
        </div>

        {/* Right Actions: Theme Toggle, Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Light / Dark Mode Pill Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-ink bg-paper-2 hover:bg-paper-3 border border-rule transition-colors cursor-pointer"
            title={`Toggle theme (Currently ${isDark ? 'Dark' : 'Light'})`}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-accent" />
                <span className="font-mono text-[11px]">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-accent" />
                <span className="font-mono text-[11px]">Dark</span>
              </>
            )}
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-full text-muted hover:text-ink hover:bg-paper-2 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-2 max-w-sm mx-auto p-4 bg-paper/95 backdrop-blur-md border border-rule rounded-3xl shadow-xl flex flex-col gap-2 text-xs font-medium text-ink pointer-events-auto transition-colors">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollToUpload();
            }}
            className="text-left px-3 py-2 rounded-xl hover:bg-paper-2 transition-colors"
          >
            Uploads
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPricing();
            }}
            className="text-left px-3 py-2 rounded-xl hover:bg-paper-2 transition-colors flex items-center justify-between"
          >
            <span>Pricing</span>
            <span className="px-1.5 py-0.5 rounded-full bg-accent/15 text-accent text-[10px]">Free</span>
          </button>
        </div>
      )}
    </header>
  );
};
