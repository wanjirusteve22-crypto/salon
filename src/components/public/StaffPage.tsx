import React from 'react';
import { StaffMember } from '../../types';
import { Star, CheckCircle, Calendar, Clock, Phone } from 'lucide-react';

interface StaffPageProps {
  staff: StaffMember[];
  onSelectStaff: (staff: StaffMember) => void;
}

export const StaffPage: React.FC<StaffPageProps> = ({ staff, onSelectStaff }) => {
  return (
    <div className="py-12 lg:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#9A7B50] mb-2">
            The Master Collective
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18181B]" style={{ textWrap: 'balance' }}>
            Kirinyaga’s premier hair artisans, barbers & aestheticians.
          </h1>
          <p className="text-sm sm:text-base text-[#52525B] mt-3 leading-relaxed">
            Our specialists bring certified master training, gentle technique, and deep expertise in natural African hair textures, skin fades, and advanced nail restorative systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {staff.map(artisan => (
            <div
              key={artisan.id}
              className="bg-white border border-[#E8E2D9] rounded-lg p-6 sm:p-8 flex flex-col justify-between hover:border-[#C5A880] transition-colors"
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-[#E8E2D9]">
                  <img
                    src={artisan.avatar}
                    alt={artisan.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#C5A880]/50"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#18181B]">
                      {artisan.name}
                    </h2>
                    <div className="text-xs text-[#9A7B50] font-semibold">
                      {artisan.role}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#71717A] mt-2">
                      <span className="flex items-center gap-1 font-mono font-medium text-[#18181B]">
                        <Star className="w-3.5 h-3.5 fill-[#C5A880] text-[#C5A880]" />
                        {artisan.rating.toFixed(2)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{artisan.reviewsCount} verified reviews</span>
                    </div>
                  </div>
                </div>

                <div className="py-6 space-y-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold mb-1">
                      Professional Background
                    </div>
                    <p className="text-xs text-[#52525B] leading-relaxed">
                      {artisan.bio}
                    </p>
                  </div>

                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold mb-2">
                      Core Specialties
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {artisan.specialties.map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-[#FAF8F5] border border-[#E8E2D9] rounded text-xs text-[#18181B] flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3 text-[#9A7B50]" />
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Work Schedule Strip */}
                  <div className="pt-3 border-t border-[#F3EFEA]">
                    <div className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#9A7B50]" />
                      <span>Weekly In-Salon Schedule</span>
                    </div>
                    <div className="text-xs text-[#52525B]">
                      Monday – Saturday: 08:00 AM – 06:30 PM (Sunday by VIP appointment)
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E2D9] flex items-center justify-between gap-4">
                <span className="text-xs text-[#71717A] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                  Station Active in Kutus
                </span>

                <button
                  onClick={() => onSelectStaff(artisan)}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-colors flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reserve Session</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
