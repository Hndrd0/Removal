import React from 'react';
import {
  Paintbrush,
  User,
  Camera,
  Megaphone,
  Code,
  ShoppingBag,
  Tv,
  Car,
  Building2,
} from 'lucide-react';

interface UseCaseCard {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const USE_CASES: UseCaseCard[] = [
  {
    title: 'Magic Brush',
    subtitle: 'Surgical manual erase and restore brush for edge corrections.',
    icon: <Paintbrush className="w-5 h-5 text-accent" />,
  },
  {
    title: 'for Individuals',
    subtitle: 'Create transparent stickers, clean profile pics, and avatars.',
    icon: <User className="w-5 h-5 text-accent" />,
  },
  {
    title: 'for Photographers',
    subtitle: 'Speed up client delivery with batch portraits and hair isolation.',
    icon: <Camera className="w-5 h-5 text-accent" />,
  },
  {
    title: 'for Marketing',
    subtitle: 'Design eye-catching ads, banners, and social collateral in seconds.',
    icon: <Megaphone className="w-5 h-5 text-accent" />,
  },
  {
    title: 'for Developers',
    subtitle: 'Local WebGPU / WASM API without cloud servers or subscription costs.',
    icon: <Code className="w-5 h-5 text-accent" />,
  },
  {
    title: 'for Ecommerce',
    subtitle: 'Generate Amazon and Shopify compliant white background product shots.',
    icon: <ShoppingBag className="w-5 h-5 text-accent" />,
  },
  {
    title: 'for Media',
    subtitle: 'Create YouTube thumbnails, broadcast overlays, and key visuals.',
    icon: <Tv className="w-5 h-5 text-accent" />,
  },
  {
    title: 'for Car Dealerships',
    subtitle: 'Extract vehicles cleanly for showroom and inventory listings.',
    icon: <Car className="w-5 h-5 text-accent" />,
  },
  {
    title: 'for Enterprise',
    subtitle: 'Scale to thousands of internal assets with zero data compliance risk.',
    icon: <Building2 className="w-5 h-5 text-accent" />,
  },
];

export const UseCasesSection: React.FC = () => {
  return (
    <section className="w-full max-w-6xl mx-auto py-12 sm:py-20 px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink tracking-tight mb-3">
          One Tool, Endless Uses
        </h2>
        <p className="text-muted text-sm sm:text-base leading-relaxed">
          Whether you need pure white backdrops for marketplace listings, transparent PNGs for graphic design, or automated pipelines for software, Removal Studio delivers studio quality in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {USE_CASES.map((item, idx) => (
          <div
            key={idx}
            className="group p-6 rounded-3xl bg-paper-2 border border-rule hover:border-accent/40 hover:bg-paper-3 transition-all duration-200 flex flex-col justify-between text-left shadow-sm"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-paper border border-rule flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm">
                {item.icon}
              </div>
              <h3 className="font-display font-semibold text-base sm:text-lg text-ink mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
