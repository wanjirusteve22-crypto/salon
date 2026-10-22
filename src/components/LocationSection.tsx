import React from 'react';
import { MapPin, Phone, Clock, MessageSquare, Navigation, CreditCard } from 'lucide-react';
import { CURRENT_TENANT } from '../services/dataStorage';

export const LocationSection: React.FC = () => {
  return (
    <section id="location" className="py-16 lg:py-24 bg-[#FDFBF7] border-b border-[#E8E2D9]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#9A7B50]">
              Visit Aurum in Kutus
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18181B]" style={{ textWrap: 'balance' }}>
              Centrally located in Kirinyaga County.
            </h2>
            <p className="text-sm sm:text-base text-[#52525B] leading-relaxed">
              Situated in the commercial hub of Kutus, moments from Kirinyaga University and easily accessible from Kerugoya, Kagio, and Embu. Ample secured parking and elevator access available.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#9A7B50] shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-[#18181B]">{CURRENT_TENANT.address}</div>
                  <div className="text-xs text-[#71717A] mt-0.5">{CURRENT_TENANT.landmark}</div>
                  <div className="text-xs text-[#71717A]">{CURRENT_TENANT.town}, {CURRENT_TENANT.county}, Kenya</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#9A7B50] shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-[#18181B]">Operating Hours</div>
                  <div className="text-xs text-[#71717A] mt-0.5">
                    Monday – Friday: {CURRENT_TENANT.openingHours.weekdays}
                  </div>
                  <div className="text-xs text-[#71717A]">
                    Saturday: {CURRENT_TENANT.openingHours.saturday}
                  </div>
                  <div className="text-xs text-[#71717A]">
                    Sunday: {CURRENT_TENANT.openingHours.sunday}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-[#9A7B50] shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-[#18181B]">M-Pesa Business Channels</div>
                  <div className="text-xs font-mono text-[#18181B] mt-0.5">
                    Lipa Na M-Pesa Buy Goods: <strong>{CURRENT_TENANT.mpesaTill}</strong>
                  </div>
                  <div className="text-xs font-mono text-[#71717A]">
                    Paybill: {CURRENT_TENANT.mpesaPaybill}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href={`tel:${CURRENT_TENANT.phone}`}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#E8E2D9] hover:bg-[#C5A880] rounded transition-colors flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Desk: {CURRENT_TENANT.phone}</span>
              </a>
              <a
                href="https://wa.me/254722894120"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Right: Map card / Direction Guide */}
          <div className="lg:col-span-6">
            <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
                <div className="flex items-center gap-2 text-sm font-bold text-[#18181B]">
                  <Navigation className="w-4 h-4 text-[#9A7B50]" />
                  <span>Kutus Landmark Directions</span>
                </div>
                <span className="text-xs font-mono text-[#71717A]">Kirinyaga Hub</span>
              </div>

              <div className="space-y-3 text-xs text-[#52525B]">
                <div className="p-3 bg-white border border-[#E8E2D9] rounded">
                  <div className="font-semibold text-[#18181B] mb-1">From Kirinyaga University (Main Campus):</div>
                  <p>Walk or drive down University Road to Kutus Junction (approx 5 mins). Turn left towards Equity Bank. Aurum is on 2nd Floor of Kutus Central Plaza.</p>
                </div>

                <div className="p-3 bg-white border border-[#E8E2D9] rounded">
                  <div className="font-semibold text-[#18181B] mb-1">From Kerugoya / Kagio:</div>
                  <p>Follow Kerugoya-Kutus Highway to Kutus town roundabout. Turn onto the Embu road; Plaza is situated opposite Equity Bank with direct ground parking.</p>
                </div>

                <div className="p-3 bg-white border border-[#E8E2D9] rounded">
                  <div className="font-semibold text-[#18181B] mb-1">From Embu:</div>
                  <p>Take the Embu-Kutus Road into town. Plaza is located on the right side before reaching the main university roundabout.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
