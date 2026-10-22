import React from 'react';
import { StaffMember } from '../types';
import { Star, CheckCircle, Calendar } from 'lucide-react';

interface StylistShowcaseProps {
  staff: StaffMember[];
  onSelectStaff: (staff: StaffMember) => void;
}

export const StylistShowcase: React.FC<StylistShowcaseProps> = ({ staff, onSelectStaff }) => {
  return (
    <section id="artisans" className="py-16 lg:py-24 bg-[#FAF8F5] border-b border-[#E8E2D9]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#9A7B50] mb-2">
            The Master Collective
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18181B]" style={{ textWrap: 'balance' }}>
            Meet Kutus’ leading hair & grooming specialists.
          </h2>
          <p className="text-sm text-[#71717A] mt-2">
            Each chair is led by a master artisan committed to precision, scalp wellness, and a personalized luxury experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {staff.map(artisan => (
            <div
              key={artisan.id}
              className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-lg p-6 flex flex-col justify-between hover:border-[#C5A880] transition-colors"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-[#E8E2D9] border border-[#C5A880]/40 shrink-0">
                    <img
                      src={artisan.avatar}
                      alt={artisan.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#18181B]">
                      {artisan.name}
                    </h3>
                    <p className="text-xs text-[#9A7B50] font-medium">
                      {artisan.title}
                    </p>
                  </div>
                </div>

                {/* Rating & Reviews without pills */}
                <div className="flex items-center gap-2 text-xs text-[#71717A] mb-3">
                  <span className="flex items-center gap-1 font-mono font-medium text-[#18181B] tabular-nums">
                    <Star className="w-3.5 h-3.5 fill-[#C5A880] text-[#C5A880]" />
                    {artisan.rating.toFixed(2)}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{artisan.reviewsCount} verified reviews</span>
                </div>

                <p className="text-xs text-[#52525B] leading-relaxed mb-4">
                  {artisan.bio}
                </p>

                {/* Specialties */}
                <div className="pt-3 border-t border-[#F3EFEA] mb-4">
                  <div className="text-[11px] uppercase tracking-wider text-[#A1A1AA] font-semibold mb-2">
                    Core Specialties
                  </div>
                  <div className="space-y-1">
                    {artisan.specialties.map((spec, i) => (
                      <div key={i} className="text-xs text-[#71717A] flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-[#9A7B50]" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectStaff(artisan)}
                className="w-full mt-2 py-2 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#F3EFEA] hover:bg-[#C5A880] rounded transition-colors flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book With {artisan.name.split(' ')[0]}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
