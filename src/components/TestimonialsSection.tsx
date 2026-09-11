import React from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'We were stunned by its ability to account for feathery, fine hair strands without making the cutout look jagged or amateurish.',
    name: 'Taylor Hatmaker',
    role: 'Senior Technology Editor',
    company: 'Tech Review Weekly',
  },
  {
    quote:
      'Running 100% on device with zero telemetry makes this the only background remover compliant with our enterprise security policy.',
    name: 'Marc Cohen',
    role: 'Creative Production Director',
    company: 'Studio Apex Global',
  },
  {
    quote:
      'No credits to count, no subscriptions, and instant cutout results. It simplified our entire ecommerce catalog workflow.',
    name: 'Emil Barsø',
    role: 'Ecommerce Marketing Lead',
    company: 'Nordic Retail Group',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="w-full max-w-6xl mx-auto py-12 sm:py-20 px-4 sm:px-6">
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink tracking-tight mb-2">
          They love us. You will too.
        </h2>
        <p className="text-muted text-sm sm:text-base leading-relaxed">
          Over 1,000+ creators, photographers, and developers rely on Silhouex for studio-grade isolation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-7 rounded-3xl bg-paper-2 border border-rule flex flex-col justify-between text-left shadow-sm hover:border-accent/30 transition-colors"
          >
            <div>
              <div className="flex items-center gap-1 text-accent mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-ink leading-relaxed mb-6 font-normal">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-rule">
              <span className="font-display font-semibold text-sm text-ink block">
                {t.name}
              </span>
              <span className="text-xs text-muted block">
                {t.role} · <strong className="font-medium text-ink">{t.company}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
