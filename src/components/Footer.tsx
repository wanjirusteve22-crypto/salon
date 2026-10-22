import React from 'react';
import { CURRENT_TENANT } from '../services/dataStorage';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenTracker: () => void;
  onOpenCommercialModal: () => void;
  onOpenSupabaseModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenTracker,
  onOpenCommercialModal,
  onOpenSupabaseModal,
}) => {
  return (
    <footer className="bg-[#18181B] text-[#FAF8F5] border-t border-[#27272A] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#27272A]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="font-serif text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>AURUM</span>
              <span className="font-sans text-xs uppercase tracking-widest text-[#C5A880] font-semibold border-l border-[#3F3F46] pl-2">
                Kutus · SalonFlow
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-sm">
              The premier hair styling, loc maintenance, and executive grooming destination in Kutus, Kirinyaga County. Powered by SalonFlow Kenya software suite.
            </p>
            <div className="text-xs text-[#71717A] space-y-1 pt-1">
              <div>{CURRENT_TENANT.address}</div>
              <div>{CURRENT_TENANT.landmark}</div>
              <div className="font-mono text-[#E5D3B3] pt-1">Safaricom Till: {CURRENT_TENANT.mpesaTill}</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
              Sanctuary
            </div>
            <ul className="space-y-2 text-xs text-[#A1A1AA]">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Services & Pricing
                </a>
              </li>
              <li>
                <a href="#artisans" className="hover:text-white transition-colors">
                  Master Artisans
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-white transition-colors">
                  Hygiene & Amenities
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-white transition-colors">
                  Directions & Hours
                </a>
              </li>
            </ul>
          </div>

          {/* Client Self-Service */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
              Client Access
            </div>
            <ul className="space-y-2 text-xs text-[#A1A1AA]">
              <li>
                <button onClick={onOpenBooking} className="hover:text-white transition-colors text-left">
                  Reserve Chair Online
                </button>
              </li>
              <li>
                <button onClick={onOpenTracker} className="hover:text-white transition-colors text-left">
                  Track Appointment Status
                </button>
              </li>
              <li>
                <a href="https://wa.me/254722894120" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp Concierge
                </a>
              </li>
            </ul>
          </div>

          {/* Software & Commercial */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
              Commercial Software
            </div>
            <ul className="space-y-2 text-xs text-[#A1A1AA]">
              <li>
                <button onClick={onOpenCommercialModal} className="hover:text-white transition-colors text-left">
                  US$ 400 License Spec
                </button>
              </li>
              <li>
                <button onClick={onOpenSupabaseModal} className="hover:text-white transition-colors text-left">
                  Supabase DB Schema
                </button>
              </li>
              <li>
                <span className="text-[11px] text-[#71717A] block pt-1">
                  Vercel + GitHub Ready
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <div>
            © {new Date().getFullYear()} Aurum Salon & Barbershop Kutus. All rights reserved.
          </div>
          <div className="text-right">
            SalonFlow Kenya · Built for Kenyan Beauty Entrepreneurs
          </div>
        </div>
      </div>
    </footer>
  );
};
