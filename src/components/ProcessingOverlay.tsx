import React from 'react';
import { AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import type { ProcessProgress } from '../types';

interface ProcessingOverlayProps {
  progress: ProcessProgress;
  onRetry: () => void;
  onCancel: () => void;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  progress,
  onRetry,
  onCancel,
}) => {
  const isError = progress.stage === 'error';

  return (
    <div className="w-full max-w-md mx-auto py-10 px-6 bg-paper-2 border border-rule rounded-3xl shadow-2xl flex flex-col items-center text-center">
      {isError ? (
        /* Error State */
        <>
          <div className="w-14 h-14 rounded-2xl bg-paper border border-accent text-accent flex items-center justify-center mb-4 shadow-sm">
            <AlertCircle className="w-7 h-7" />
          </div>

          <h3 className="font-display font-medium text-xl text-ink tracking-tight mb-2">
            Could Not Process Image
          </h3>

          <p className="text-sm text-muted max-w-sm mb-6 leading-relaxed">
            {progress.details || progress.message || 'The selected file could not be processed. Verify format and try again.'}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2.5 rounded-full bg-paper hover:bg-paper-3 border border-rule hover:border-ink/40 font-display font-medium text-xs text-ink transition-colors cursor-pointer shadow-sm"
            >
              Choose Another
            </button>
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-accent-ink font-display font-medium text-xs tracking-tight transition-colors cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        </>
      ) : (
        /* Honest Processing Progress State */
        <>
          <div className="relative w-16 h-16 mb-5 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-rule border-t-accent animate-spin" />
            <div className="w-10 h-10 rounded-full bg-paper border border-rule flex items-center justify-center font-mono font-bold text-accent text-xs shadow-sm">
              {Math.round(progress.progress)}%
            </div>
          </div>

          <h3 className="font-display font-medium text-xl text-ink tracking-tight mb-1">
            {progress.message || 'Processing'}
          </h3>

          <p className="text-xs text-muted max-w-xs mb-5 font-mono">
            {progress.details || 'Executing local neural segmentation...'}
          </p>

          {/* Micro Progress Bar */}
          <div className="w-full max-w-xs bg-paper border border-rule rounded-full h-2 overflow-hidden mb-6 shadow-inner">
            <div
              className="bg-accent h-full rounded-full transition-[width] duration-200 ease-out"
              style={{ width: `${progress.progress}%` }}
            />
          </div>

          {/* Live Step Checklist */}
          <div className="w-full max-w-xs flex flex-col gap-2.5 text-left mb-6 font-mono text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 ${
                  progress.progress >= 10 ? 'text-accent' : 'text-rule'
                }`}
              />
              <span className={progress.progress >= 10 ? 'text-ink font-medium' : 'text-muted'}>
                Loading AI neural model
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 ${
                  progress.progress >= 70 ? 'text-accent' : 'text-rule'
                }`}
              />
              <span className={progress.progress >= 70 ? 'text-ink font-medium' : 'text-muted'}>
                Subject neural segmentation
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 ${
                  progress.progress >= 88 ? 'text-accent' : 'text-rule'
                }`}
              />
              <span className={progress.progress >= 88 ? 'text-ink font-medium' : 'text-muted'}>
                Refining edges & halo cleanup
              </span>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="px-3 py-1 rounded-full font-mono text-xs text-muted hover:text-ink hover:bg-paper-3 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};
