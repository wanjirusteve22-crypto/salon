import React from 'react';
import { SalonTenant, PublicPage } from '../types';

interface FooterProps {
  tenant: SalonTenant;
  onSelectPage: (page: PublicPage) => void;
  onOpenBooking: () => void;
  onOpenTracker: () => void;
  onOpenCommercialModal: () => void;
  onOpenSupabaseModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  tenant,
  onSelectPage,
  onOpenBooking,
  onOpenTracker,
  onOpenCommercialModal,
  onOpenSupabaseModal,
}) => {
  const handleNav = (page: PublicPage) => {
    onSelectPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#18181B] text-[#FAF8F5] border-t border-[#27272A] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#27272A]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => handleNav('home')}
              className="font-serif text-2xl font-bold tracking-tight text-white flex items-center gap-2 cursor-pointer text-left"
            >
              <span>AURUM</span>
              <span className="font-sans text-xs uppercase tracking-widest text-[#C5A880] font-semibold border-l border-[#3F3F46] pl-2">
                Kutus · SalonFlow
              </span>
            </button>
            <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-sm">
              The premier hair styling, loc maintenance, facial spa, and executive grooming destination in Kutus, Kirinyaga County.
            </p>
            <div className="text-xs text-[#71717A] space-y-1 pt-1">
              <div>{tenant.address}</div>
              <div>{tenant.landmark}</div>
              <div className="font-mono text-[#E5D3B3] pt-1">Safaricom Till: {tenant.mpesaTill}</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
              The Sanctuary
            </div>
            <ul className="space-y-2 text-xs text-[#A1A1AA]">
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Services & Pricing
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('staff')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Master Collective
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gallery')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Visual Archive
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Hours & Directions
                </button>
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
                <button onClick={onOpenBooking} className="hover:text-white transition-colors text-left cursor-pointer">
                  Reserve Chair Online
                </button>
              </li>
              <li>
                <button onClick={onOpenTracker} className="hover:text-white transition-colors text-left cursor-pointer">
                  Track Appointment Status
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/254722894120"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors block"
                >
                  WhatsApp Concierge
                </a>
              </li>
              <li>
                <button onClick={() => handleNav('terms')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('privacy')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Commercial & Technical */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
              Commercial SaaS
            </div>
            <ul className="space-y-2 text-xs text-[#A1A1AA]">
              <li>
                <button onClick={onOpenCommercialModal} className="hover:text-white transition-colors text-left cursor-pointer">
                  US$ 400 License Spec
                </button>
              </li>
              <li>
                <button onClick={onOpenSupabaseModal} className="hover:text-white transition-colors text-left cursor-pointer">
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
            © {new Date().getFullYear()} {tenant.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => handleNav('privacy')} className="hover:underline cursor-pointer">
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => handleNav('terms')} className="hover:underline cursor-pointer">
              Terms of Service
            </button>
            <span aria-hidden="true">·</span>
            <span>SalonFlow Kenya</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
