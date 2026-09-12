import React from 'react';
import { Layers, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface EfficiencySectionProps {
  onOpenBulk: () => void;
  onOpenApi: () => void;
}

export const EfficiencySection: React.FC<EfficiencySectionProps> = ({
  onOpenBulk,
  onOpenApi,
}) => {
  return (
    <section className="w-full max-w-6xl mx-auto py-12 sm:py-20 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 sm:p-12 rounded-3xl bg-paper-2 border border-rule shadow-xl">
        {/* Left text column */}
        <div className="text-left space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper border border-rule text-muted text-xs font-mono">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span>High-Throughput Parallelism</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink tracking-tight leading-tight">
            Boost your efficiency with automated background removal
          </h2>

          <p className="text-muted text-sm sm:text-base leading-relaxed">
            With Removal Studio, isolating subjects from complex backgrounds is lightning fast. Bulk editing allows you to process hundreds of images with parallel WebGPU shaders without network latency or upload limits.
          </p>

          <div className="space-y-2.5 pt-2 font-mono text-xs text-ink">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>Process batches directly in browser memory</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>Full resolution exports preserved without compression</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>Zero server bandwidth bills or cloud lock-in</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={onOpenBulk}
              className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-accent-ink font-display font-medium text-xs sm:text-sm tracking-tight transition-all cursor-pointer shadow-sm active:scale-[0.98] flex items-center gap-2"
            >
              <span>Explore Bulk Editing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenApi}
              className="px-5 py-2.5 rounded-full bg-paper hover:bg-paper-3 border border-rule text-ink font-display font-medium text-xs sm:text-sm tracking-tight transition-colors cursor-pointer"
            >
              View API Docs
            </button>
          </div>
        </div>

        {/* Right visual card */}
        <div className="relative rounded-3xl bg-paper border border-rule p-6 sm:p-8 flex flex-col justify-center items-center shadow-lg text-center">
          <div className="w-16 h-16 rounded-2xl bg-paper-2 border border-accent/40 flex items-center justify-center text-accent mb-4 shadow-sm">
            <Layers className="w-8 h-8" />
          </div>
          <span className="font-display font-black text-5xl sm:text-6xl text-ink tracking-tight">
            500+
          </span>
          <span className="font-mono text-xs uppercase text-accent font-semibold tracking-wider mt-1 mb-3">
            Images / Minute
          </span>
          <p className="text-xs text-muted max-w-xs leading-relaxed">
            Local GPU hardware acceleration scales directly with your device, eliminating roundtrip cloud API throttling.
          </p>
        </div>
      </div>
    </section>
  );
};
