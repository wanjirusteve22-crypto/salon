import React from 'react';
import { Coffee, ShieldCheck, Wifi, Sparkles, Quote } from 'lucide-react';
import { CURRENT_TENANT } from '../services/dataStorage';

export const SanctuaryExperience: React.FC = () => {
  return (
    <section id="experience" className="py-16 lg:py-24 bg-[#FAF8F5] border-b border-[#E8E2D9]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#9A7B50]">
              The Aurum Standard
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18181B]" style={{ textWrap: 'balance' }}>
              More than a salon — Kirinyaga’s executive grooming sanctuary.
            </h2>
            <p className="text-sm sm:text-base text-[#52525B] leading-relaxed">
              We engineered Aurum for busy professionals, Kirinyaga University lecturers, entrepreneurs, and clients who refuse to settle for crowded waiting benches or unsterile equipment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#18181B]">
                  <ShieldCheck className="w-4 h-4 text-[#9A7B50]" />
                  <span>Hospital-Grade Sterilization</span>
                </div>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  Single-use razor cartridges, UV sanitizing cabinets for barber tools, and fresh towels for every single client.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#18181B]">
                  <Wifi className="w-4 h-4 text-[#9A7B50]" />
                  <span>High-Speed Fiber & Power</span>
                </div>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  Full solar inverter backup and dedicated high-speed Wi-Fi so you can work comfortably while under the dryer.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#18181B]">
                  <Coffee className="w-4 h-4 text-[#9A7B50]" />
                  <span>Mount Kenya Herbal Bar</span>
                </div>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  Complimentary local spiced chai, hibiscus tea, and espresso brewed fresh upon arrival.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#18181B]">
                  <Sparkles className="w-4 h-4 text-[#9A7B50]" />
                  <span>Guaranteed Chair Time</span>
                </div>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  When you book via SalonFlow, your slot is locked. Zero 2-hour queueing or seat jumping.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Client Proof & Testimonials */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-lg p-6 sm:p-8 relative">
              <Quote className="w-8 h-8 text-[#C5A880]/30 absolute top-6 right-6" />
              <p className="font-serif text-base sm:text-lg italic text-[#27272A] leading-relaxed mb-6">
                "Finding a barber in Kirinyaga who understands precision skin fades and takes appointments seriously used to be impossible. Mwangi’s hot towel treatment and SalonFlow’s booking system made me an Aurum client for life."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#18181B] text-[#FAF8F5] flex items-center justify-center font-bold text-xs">
                  DK
                </div>
                <div>
                  <div className="text-sm font-bold text-[#18181B]">David Kariuki</div>
                  <div className="text-xs text-[#71717A]">Senior Lecturer, Kirinyaga University</div>
                </div>
              </div>
            </div>

            <div className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-lg p-6 sm:p-8 relative">
              <Quote className="w-8 h-8 text-[#C5A880]/30 absolute top-6 right-6" />
              <p className="font-serif text-base sm:text-lg italic text-[#27272A] leading-relaxed mb-6">
                "Shiku did my bohemian knotless braids for my graduation ceremony. Zero pain, featherweight, and they lasted 8 full weeks without a single flyaway. The M-Pesa booking is so smooth!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#9A7B50] text-[#FAF8F5] flex items-center justify-center font-bold text-xs">
                  WN
                </div>
                <div>
                  <div className="text-sm font-bold text-[#18181B]">Winfred Njeri</div>
                  <div className="text-xs text-[#71717A]">Kerugoya Business Owner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
