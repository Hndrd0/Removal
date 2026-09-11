import React, { useState } from 'react';
import { SplitSquareVertical, Sparkles } from 'lucide-react';

interface CategoryItem {
  id: string;
  label: string;
  original: string;
  cutout: string;
  description: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'people',
    label: 'People',
    original: '/samples/stockimg1.jpg',
    cutout: '/samples/stockimg1-cutout.png',
    description: 'Crisp individual hair strands, zero jagged outlines, and natural skin translucency.',
  },
  {
    id: 'animals',
    label: 'Animals',
    original: '/samples/stockimg2.avif',
    cutout: '/samples/stockimg2-cutout.png',
    description: 'Soft whisker contours, intricate fur textures, and halo-free edge separation.',
  },
  {
    id: 'cars',
    label: 'Cars',
    original: '/samples/stockimg3.avif',
    cutout: '/samples/stockimg3-cutout.png',
    description: 'Pin-sharp automotive reflections, rim contours, and windshield glass precision.',
  },
  {
    id: 'nature',
    label: 'Nature',
    original: '/samples/stockimg4.jpg',
    cutout: '/samples/stockimg4-cutout.png',
    description: 'Delicate flower petals, organic leaf edges, and complex botanical silhouettes.',
  },
];

export const QualityShowcase: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('people');
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const currentItem = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  return (
    <section className="w-full max-w-5xl mx-auto py-12 sm:py-20 px-4 sm:px-6 text-center">
      <div className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper-2 border border-rule text-muted text-xs font-mono mb-3">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Sub-Pixel Alpha Matting</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Stunning Quality
        </h2>
        <p className="text-muted text-sm sm:text-base max-w-xl mx-auto mt-2 leading-relaxed">
          Handles delicate hair strands, feather borders, transparent packaging, and tricky reflections with surgical accuracy.
        </p>

        {/* Category Tabs */}
        <div className="inline-flex items-center p-1 rounded-full bg-paper-2 border border-rule mt-6 shadow-sm">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSliderPos(50);
              }}
              className={`px-4 sm:px-6 py-2 rounded-full font-display font-medium text-xs sm:text-sm tracking-tight transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-accent text-accent-ink shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Split Comparison Card */}
      <div className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden border border-rule bg-paper shadow-2xl">
        <div
          className="relative aspect-[16/10] sm:aspect-[16/9] w-full cursor-ew-resize select-none overflow-hidden"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={handleTouchMove}
        >
          {/* Right/Cutout Side (Checkerboard Transparent) */}
          <div className="absolute inset-0 w-full h-full checkerboard-light dark:checkerboard-pattern flex items-center justify-center p-4">
            <img
              src={currentItem.cutout}
              alt={`${currentItem.label} cutout`}
              className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
            />
          </div>

          {/* Left/Original Side */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden p-4 bg-paper-2"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <img
              src={currentItem.original}
              alt={`${currentItem.label} original`}
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>

          {/* Draggable Divider Handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-accent z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
            style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent text-accent-ink shadow-xl flex items-center justify-center border-2 border-paper">
              <SplitSquareVertical className="w-4 h-4" />
            </div>
          </div>

          {/* Floating Pill Badges */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-paper/90 backdrop-blur-sm border border-rule text-xs font-mono font-medium text-ink shadow-sm pointer-events-none">
            Original
          </div>
          <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-accent text-accent-ink text-xs font-mono font-medium shadow-sm pointer-events-none">
            Background Removed
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-paper/85 backdrop-blur-sm border border-rule text-[11px] font-mono text-muted pointer-events-none">
            Drag slider left / right to compare
          </div>
        </div>

        {/* Caption bar */}
        <div className="py-3.5 px-6 bg-paper-2 border-t border-rule text-xs font-mono text-muted flex items-center justify-between">
          <span>{currentItem.description}</span>
          <span className="text-accent font-semibold">100% In-Browser</span>
        </div>
      </div>
    </section>
  );
};
