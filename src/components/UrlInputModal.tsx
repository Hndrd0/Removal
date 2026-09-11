import React, { useState } from 'react';
import { X, Link2, ArrowRight, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface UrlInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitUrl: (url: string) => void;
}

export const UrlInputModal: React.FC<UrlInputModalProps> = ({
  isOpen,
  onClose,
  onSubmitUrl,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputUrl.trim();
    if (!trimmed) return;

    try {
      if (!trimmed.startsWith('/')) {
        const parsed = new URL(trimmed);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          setError('Only HTTP and HTTPS URLs are supported.');
          return;
        }
      }
      setError(null);
      onSubmitUrl(trimmed);
      onClose();
    } catch {
      setError('Please enter a valid URL (starting with http:// or https://)');
    }
  };

  const handleSampleClick = (sampleUrl: string) => {
    onSubmitUrl(sampleUrl);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="url-input-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-paper/80 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-paper-2 border border-rule rounded-3xl p-6 sm:p-8 shadow-2xl text-left"
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
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <h3 id="url-input-modal-title" className="font-display font-medium text-xl text-ink tracking-tight">
              Paste Image URL
            </h3>
            <p className="font-mono text-xs text-muted">Load Any Public Image to Mat Locally</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="image-url-input" className="block text-xs font-mono text-muted mb-1.5 uppercase">
              Image Address / Web URL
            </label>
            <div className="relative">
              <input
                id="image-url-input"
                type="url"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setError(null);
                }}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-3 rounded-2xl bg-paper border border-rule text-ink placeholder:text-muted/60 text-sm focus:outline-none focus:border-accent font-mono"
                autoFocus
              />
            </div>
            {error && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-accent">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-accent hover:bg-accent-hover text-accent-ink font-display font-medium text-sm tracking-tight transition-all cursor-pointer shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Fetch &amp; Remove Background</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Sample Links */}
        <div className="mt-6 pt-5 border-t border-rule">
          <span className="block text-xs font-mono text-muted mb-2.5 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-accent" />
            Or try one of these test links:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleSampleClick('/samples/stockimg1.jpg')}
              className="px-3 py-1.5 rounded-full bg-paper hover:bg-paper-3 border border-rule text-xs text-ink font-medium transition-colors cursor-pointer"
            >
              People (stockimg1.jpg)
            </button>
            <button
              type="button"
              onClick={() => handleSampleClick('/samples/stockimg2.avif')}
              className="px-3 py-1.5 rounded-full bg-paper hover:bg-paper-3 border border-rule text-xs text-ink font-medium transition-colors cursor-pointer"
            >
              Animals (stockimg2.avif)
            </button>
            <button
              type="button"
              onClick={() => handleSampleClick('/samples/stockimg3.avif')}
              className="px-3 py-1.5 rounded-full bg-paper hover:bg-paper-3 border border-rule text-xs text-ink font-medium transition-colors cursor-pointer"
            >
              Cars (stockimg3.avif)
            </button>
            <button
              type="button"
              onClick={() => handleSampleClick('/samples/stockimg4.jpg')}
              className="px-3 py-1.5 rounded-full bg-paper hover:bg-paper-3 border border-rule text-xs text-ink font-medium transition-colors cursor-pointer"
            >
              Nature (stockimg4.jpg)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
