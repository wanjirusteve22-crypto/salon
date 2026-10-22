import React from 'react';
import { AppViewRole } from '../types';
import { ShieldCheck, User, Users, Store, Code2, Database } from 'lucide-react';

interface RoleSwitcherBarProps {
  currentRole: AppViewRole;
  onSelectRole: (role: AppViewRole) => void;
  onOpenSupabaseModal: () => void;
  onOpenCommercialModal: () => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({
  currentRole,
  onSelectRole,
  onOpenSupabaseModal,
  onOpenCommercialModal,
}) => {
  return (
    <div className="bg-[#18181B] text-[#FAF8F5] text-xs border-b border-[#27272A] px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Persona / Role Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#C5A880] font-medium tracking-wide flex items-center gap-1.5 whitespace-nowrap">
            <Store className="w-3.5 h-3.5 text-[#C5A880]" />
            Preview Persona:
          </span>
          <div className="flex items-center bg-[#27272A] p-0.5 rounded">
            <button
              onClick={() => onSelectRole('customer')}
              className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                currentRole === 'customer'
                  ? 'bg-[#C5A880] text-[#18181B] font-semibold shadow-xs'
                  : 'text-[#D4AF37]/80 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              Public Client & Booking
            </button>
            <button
              onClick={() => onSelectRole('owner')}
              className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                currentRole === 'owner'
                  ? 'bg-[#C5A880] text-[#18181B] font-semibold shadow-xs'
                  : 'text-[#D4AF37]/80 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              Salon Owner & Revenue POS
            </button>
            <button
              onClick={() => onSelectRole('staff')}
              className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                currentRole === 'staff'
                  ? 'bg-[#C5A880] text-[#18181B] font-semibold shadow-xs'
                  : 'text-[#D4AF37]/80 hover:text-white'
              }`}
            >
              <Users className="w-3 h-3" />
              Stylist & Chair Hub
            </button>
          </div>
        </div>

        {/* Right: Commercial & Supabase Deployment Readiness */}
        <div className="flex items-center gap-4 text-[#A1A1AA] flex-wrap justify-end">
          <span className="hidden sm:inline-flex items-center gap-1 text-[#E5D3B3] font-mono tabular-nums">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block"></span>
            Demo State: Local Persist
          </span>
          <button
            onClick={onOpenSupabaseModal}
            className="hover:text-white flex items-center gap-1 text-[#E5D3B3] underline underline-offset-2 transition-colors whitespace-nowrap"
          >
            <Database className="w-3 h-3 text-[#C5A880]" />
            Supabase Schema DDL
          </button>
          <button
            onClick={onOpenCommercialModal}
            className="px-2.5 py-0.5 rounded border border-[#C5A880]/60 text-[#C5A880] hover:bg-[#C5A880] hover:text-[#18181B] transition-colors flex items-center gap-1 font-medium whitespace-nowrap"
          >
            <Code2 className="w-3 h-3" />
            Commercial Spec ($400)
          </button>
        </div>
      </div>
    </div>
  );
};
