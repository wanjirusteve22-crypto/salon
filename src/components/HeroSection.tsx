import React from 'react';
import { ArrowRight, Clock, MapPin, Sparkles, PhoneCall } from 'lucide-react';
import { CURRENT_TENANT } from '../services/dataStorage';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onExploreServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBooking, onExploreServices }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#E8E2D9]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          {/* Left Column: Text & Intent */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Quiet unboxed kicker */}
              <div className="text-xs font-semibold uppercase tracking-widest text-[#9A7B50] flex items-center gap-2">
                <span>Kutus · Kirinyaga County</span>
                <span aria-hidden="true">·</span>
                <span>SalonFlow Commercial Suite</span>
              </div>

              {/* Display Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#18181B] leading-[1.12]" style={{ textWrap: 'balance' }}>
                Refined hair artistry, loc care & executive barbering in Kutus.
              </h1>

              {/* Body Prose */}
              <p className="text-base sm:text-lg text-[#52525B] leading-relaxed max-w-2xl">
                Experience Kirinyaga County’s elevated beauty sanctuary. From bohemian knotless braids and silk presses to precision hot-towel skin fades, reserve your chair seamlessly with instant M-Pesa confirmation.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Reserve Chair Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onExploreServices}
                className="px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#F3EFEA] hover:bg-[#E8E2D9] border border-[#E8E2D9] rounded transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>View Treatment Menu</span>
              </button>
            </div>

            {/* Micro Details (Quiet text metadata) */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#71717A] pt-4 border-t border-[#E8E2D9]">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#9A7B50]" />
                {CURRENT_TENANT.landmark}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#9A7B50]" />
                Mon–Sat: 7:30 AM – 8:30 PM
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#9A7B50]" />
                {CURRENT_TENANT.phone}
              </span>
            </div>
          </div>

          {/* Right Column: Visual Anchor */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-full min-h-[380px] lg:min-h-[500px] rounded-lg overflow-hidden border border-[#E8E2D9] bg-[#E8E2D9] shadow-sm">
              <img
                src="/src/assets/images/hero_luxury_salon_1792652771024.jpg"
                alt="Aurum Salon and Executive Barbershop interior in Kutus"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18181B]/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs uppercase tracking-widest text-[#E5D3B3] font-medium mb-1">
                  Private VIP Lounge & Styling Bays
                </div>
                <div className="font-serif text-xl font-medium">
                  Designed for comfort, speed, and bespoke pampering.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Claim-to-Proof Adjacency Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 mt-12 border-t border-[#E8E2D9]">
          <div>
            <div className="font-mono text-2xl lg:text-3xl font-semibold text-[#18181B] tabular-nums">
              KES 1,200+
            </div>
            <div className="text-xs text-[#71717A] mt-1">
              Transparent local pricing, zero hidden salon charges
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl lg:text-3xl font-semibold text-[#18181B] tabular-nums">
              M-Pesa Till
            </div>
            <div className="text-xs text-[#71717A] mt-1">
              Instant Safaricom Till {CURRENT_TENANT.mpesaTill} & Paybill support
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl lg:text-3xl font-semibold text-[#18181B] tabular-nums">
              4.96 / 5.0
            </div>
            <div className="text-xs text-[#71717A] mt-1">
              Kirinyaga University faculty & county professionals rating
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl lg:text-3xl font-semibold text-[#18181B] tabular-nums">
              4 Stylists On-Duty
            </div>
            <div className="text-xs text-[#71717A] mt-1">
              Loc specialists, master barbers & certified nail artists
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
