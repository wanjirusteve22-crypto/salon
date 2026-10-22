import React from 'react';
import { X, CheckCircle, ShieldCheck, Database, Smartphone, Printer, Globe, Code } from 'lucide-react';

interface CommercialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommercialModal: React.FC<CommercialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#18181B]/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl shadow-2xl overflow-hidden my-8">
        <div className="bg-[#18181B] text-[#FAF8F5] px-6 py-5 flex items-center justify-between border-b border-[#27272A]">
          <div>
            <div className="text-[10px] font-mono tracking-wider uppercase text-[#C5A880]">
              Commercial Software Architecture
            </div>
            <h2 className="font-serif text-xl font-bold text-white">
              SalonFlow Kenya — Commercial License & Delivery Scope
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#A1A1AA] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-[#F3EFEA] border border-[#E8E2D9] rounded-lg flex items-center justify-between">
            <div>
              <div className="text-xs uppercase font-semibold text-[#71717A]">
                Turnkey Sale Valuation
              </div>
              <div className="font-mono text-2xl font-bold text-[#18181B]">
                US$ 400 <span className="text-xs font-normal text-[#71717A]">(~KES 52,000)</span>
              </div>
            </div>
            <span className="text-xs bg-[#C5A880] text-[#18181B] font-bold px-3 py-1 rounded">
              Ready for Kirinyaga Beauty Salons
            </span>
          </div>

          <p className="text-xs text-[#52525B] leading-relaxed">
            This platform is specifically designed as a standalone, production-ready SaaS product to sell to salons, executive barbershops, and spa lounges across Kutus, Kerugoya, Embu, and greater Kenya.
          </p>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#18181B]">
              Included Production Deliverables:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-[#E8E2D9] rounded flex items-start gap-2.5">
                <Database className="w-4 h-4 text-[#9A7B50] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#18181B]">Supabase PostgreSQL Backend</div>
                  <div className="text-[#71717A] text-[11px] mt-0.5">
                    Pre-configured DDL schema, Row Level Security (RLS), multi-tenant isolation, and automated daily backups.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white border border-[#E8E2D9] rounded flex items-start gap-2.5">
                <Smartphone className="w-4 h-4 text-[#9A7B50] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#18181B]">Safaricom M-Pesa Integration</div>
                  <div className="text-[#71717A] text-[11px] mt-0.5">
                    Support for Safaricom Till (Buy Goods), Paybill C2B validation, and Daraja STK Push prompt for instant settlement.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white border border-[#E8E2D9] rounded flex items-start gap-2.5">
                <Printer className="w-4 h-4 text-[#9A7B50] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#18181B]">Thermal Receipt Printing</div>
                  <div className="text-[#71717A] text-[11px] mt-0.5">
                    Compatible with standard 58mm / 80mm ESC/POS Bluetooth and USB thermal receipt printers at reception.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white border border-[#E8E2D9] rounded flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-[#9A7B50] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#18181B]">Custom Domain & Vercel Hosting</div>
                  <div className="text-[#71717A] text-[11px] mt-0.5">
                    Production deployment on GitHub & Vercel with SSL certificate under client’s custom domain (e.g. .co.ke).
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8E2D9] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-colors"
            >
              Close Specification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
