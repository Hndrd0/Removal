import React, { useState } from 'react';
import { Download, Copy, Check, RefreshCw, Layers, Sparkles } from 'lucide-react';
import type { ProcessingResult } from '../types';

interface ActionBarProps {
  result: ProcessingResult;
  onReset: () => void;
  haloDecontamination: boolean;
  onToggleHalo: (enabled: boolean) => void;
  edgeSmoothing: boolean;
  onToggleSmoothing: (enabled: boolean) => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  result,
  onReset,
  haloDecontamination,
  onToggleHalo,
  edgeSmoothing,
  onToggleSmoothing,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Trigger browser download
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = result.url;
    
    // Sensible naming: original-name-removal-studio.png
    const baseName = result.metadata.name.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}-removal-studio.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy PNG image blob directly to system clipboard
  const handleCopyClipboard = async () => {
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': result.blob,
          }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        alert('Direct image clipboard copy is not supported by your browser. Please use Download PNG.');
      }
    } catch (err) {
      console.error('Failed to copy image to clipboard:', err);
    }
  };

  const formattedFileSize = (result.blob.size / (1024 * 1024)).toFixed(2);

  return (
    <div className="w-full max-w-5xl mx-auto mt-4 px-4 flex flex-col sm:flex-row items-center justify-between gap-4 py-3.5 bg-paper-2 border border-rule rounded-2xl shadow-md">
      {/* Left Details: Dimensions & Resolution */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-ink">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-paper border border-rule font-mono text-[11px] shadow-sm">
          <Layers className="w-3.5 h-3.5 text-accent" />
          <span>{result.width} × {result.height} px</span>
          <span className="text-rule">•</span>
          <span>{formattedFileSize} MB</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onToggleHalo(!haloDecontamination)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-mono text-[11px] transition-all border cursor-pointer ${
              haloDecontamination
                ? 'bg-paper text-accent border-accent font-medium shadow-sm ring-1 ring-accent'
                : 'bg-paper text-muted border-rule hover:border-ink/40 hover:text-ink'
            }`}
            title="Suppresses white/dark color bleed along semi-transparent boundary edges"
          >
            <Sparkles className="w-3 h-3" />
            <span>Halo cleanup</span>
          </button>
          <button
            onClick={() => onToggleSmoothing(!edgeSmoothing)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-mono text-[11px] transition-all border cursor-pointer ${
              edgeSmoothing
                ? 'bg-paper text-accent border-accent font-medium shadow-sm ring-1 ring-accent'
                : 'bg-paper text-muted border-rule hover:border-ink/40 hover:text-ink'
            }`}
            title="Edge-aware smoothing for crisp borders"
          >
            <span>Edge smoothing</span>
          </button>
        </div>
      </div>

      {/* Right Controls: Reset, Copy, Download */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-paper hover:bg-paper-3 border border-rule hover:border-ink/40 font-display font-medium text-xs text-ink transition-colors cursor-pointer shadow-sm"
        >
          <RefreshCw className="w-3 h-3" />
          <span>New image</span>
        </button>

        {/* Copy to Clipboard */}
        <button
          onClick={handleCopyClipboard}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-paper hover:bg-paper-3 border border-rule hover:border-ink/40 font-display font-medium text-xs text-ink transition-colors cursor-pointer shadow-sm"
          title="Copy transparent PNG to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-accent" />
              <span className="text-accent font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-muted" />
              <span>Copy image</span>
            </>
          )}
        </button>

        {/* Primary Download Button */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-accent hover:bg-accent-hover text-accent-ink font-display font-medium text-xs sm:text-sm tracking-tight transition-all cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <Download className="w-4 h-4" />
          <span>Download PNG</span>
        </button>
      </div>
    </div>
  );
};
