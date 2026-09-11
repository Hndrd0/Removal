import React from 'react';
import { MinusCircle, PlusCircle, Undo2, Redo2, RotateCcw, Paintbrush } from 'lucide-react';
import type { BrushMode } from '../services/brushCompositor';

interface CutoutBrushPanelProps {
  brushMode: BrushMode;
  onBrushModeChange: (mode: BrushMode) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  canUndo: boolean;
  onUndo: () => void;
  canRedo: boolean;
  onRedo: () => void;
  onResetToAI: () => void;
}

export const CutoutBrushPanel: React.FC<CutoutBrushPanelProps> = ({
  brushMode,
  onBrushModeChange,
  brushSize,
  onBrushSizeChange,
  canUndo,
  onUndo,
  canRedo,
  onRedo,
  onResetToAI,
}) => {
  return (
    <div className="w-full max-w-sm bg-paper-2 border border-rule rounded-2xl p-5 flex flex-col gap-4 text-left select-none shadow-xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-rule">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-paper border border-rule flex items-center justify-center text-accent shadow-sm">
            <Paintbrush className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-medium text-sm text-ink">Cutout Brush</h3>
            <p className="font-mono text-[10px] text-muted uppercase">Manual Corrections</p>
          </div>
        </div>
        <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full bg-paper border border-rule text-muted">
          Active
        </span>
      </div>

      {/* Mode Buttons: Erase vs Restore */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Erase Button */}
        <button
          onClick={() => onBrushModeChange('erase')}
          className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all cursor-pointer ${
            brushMode === 'erase'
              ? 'border-accent bg-paper text-accent font-medium shadow-sm ring-1 ring-accent'
              : 'border-rule bg-paper text-muted hover:border-ink/50 hover:text-ink'
          }`}
        >
          <MinusCircle className={`w-5 h-5 mb-1 ${brushMode === 'erase' ? 'text-accent' : 'text-muted'}`} />
          <span className="font-display font-medium text-xs">Erase</span>
          <span className="font-mono text-[9px] text-muted mt-0.5">Remove parts</span>
        </button>

        {/* Restore Button */}
        <button
          onClick={() => onBrushModeChange('restore')}
          className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all cursor-pointer ${
            brushMode === 'restore'
              ? 'border-ink bg-paper text-ink font-medium shadow-sm ring-1 ring-ink'
              : 'border-rule bg-paper text-muted hover:border-ink/50 hover:text-ink'
          }`}
        >
          <PlusCircle className={`w-5 h-5 mb-1 ${brushMode === 'restore' ? 'text-ink' : 'text-muted'}`} />
          <span className="font-display font-medium text-xs">Restore</span>
          <span className="font-mono text-[9px] text-muted mt-0.5">Bring back</span>
        </button>
      </div>

      {/* Brush Size Slider */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-muted text-[11px]">Brush Diameter</span>
          <span className="text-accent font-semibold">{brushSize}px</span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="rounded-full bg-accent shrink-0 shadow-sm"
            style={{
              width: `${Math.min(20, Math.max(6, brushSize * 0.25))}px`,
              height: `${Math.min(20, Math.max(6, brushSize * 0.25))}px`,
            }}
          />
          <input
            type="range"
            min="5"
            max="120"
            value={brushSize}
            onChange={(e) => onBrushSizeChange(Number(e.target.value))}
            className="w-full h-1.5 rounded-full bg-paper border border-rule appearance-none cursor-pointer accent-accent"
          />
        </div>
      </div>

      {/* History Controls: Undo / Redo / Reset */}
      <div className="flex items-center justify-between pt-3 border-t border-rule">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`px-2.5 py-1.5 rounded-full text-xs font-mono flex items-center gap-1 border transition-colors ${
              canUndo
                ? 'bg-paper text-ink border-rule hover:border-ink/50 cursor-pointer shadow-sm'
                : 'bg-paper-2 text-muted/40 border-rule/50 cursor-not-allowed'
            }`}
            title="Undo stroke (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Undo</span>
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`px-2.5 py-1.5 rounded-full text-xs font-mono flex items-center gap-1 border transition-colors ${
              canRedo
                ? 'bg-paper text-ink border-rule hover:border-ink/50 cursor-pointer shadow-sm'
                : 'bg-paper-2 text-muted/40 border-rule/50 cursor-not-allowed'
            }`}
            title="Redo stroke (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Redo</span>
          </button>
        </div>

        <button
          onClick={onResetToAI}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-mono text-accent hover:bg-accent/10 border border-transparent hover:border-accent/30 transition-colors cursor-pointer"
          title="Reset all manual brush strokes back to pure AI cutout"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
