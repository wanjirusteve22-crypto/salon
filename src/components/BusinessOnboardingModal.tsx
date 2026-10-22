import React, { useState } from 'react';
import { 
  X, Check, Building2, Smartphone, Clock, Scissors, 
  Users, Sparkles, ArrowRight, ArrowLeft 
} from 'lucide-react';
import { SalonTenant, Service, StaffMember } from '../types';
import { saveStoredTenant, saveStoredServices, saveStoredStaff } from '../services/dataStorage';

interface BusinessOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (tenant: SalonTenant) => void;
}

export const BusinessOnboardingModal: React.FC<BusinessOnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState('Elysian Beauty & Barbershop');
  const [tagline, setTagline] = useState('Premier Executive Grooming & Hair Care Lounge');
  const [town, setTown] = useState('Kutus');
  const [county, setCounty] = useState('Kirinyaga County');
  const [address, setAddress] = useState('Kutus Commercial Centre, 1st Floor');
  const [landmark, setLandmark] = useState('Near Kirinyaga University Main Gate');
  const [phone, setPhone] = useState('+254 712 345 678');
  const [email, setEmail] = useState('contact@elysiankutus.co.ke');
  const [mpesaTill, setMpesaTill] = useState('789456');
  const [mpesaPaybill, setMpesaPaybill] = useState('');
  
  // Hours
  const [weekdaysHours, setWeekdaysHours] = useState('7:30 AM — 8:30 PM');
  const [saturdayHours, setSaturdayHours] = useState('7:00 AM — 9:00 PM');
  const [sundayHours, setSundayHours] = useState('9:30 AM — 7:00 PM');

  // Services
  const [primaryService, setPrimaryService] = useState('Executive Beard Sculpt & Haircut');
  const [serviceCategory, setServiceCategory] = useState<'Barbering & Grooming' | 'Braiding & Locs' | 'Hair Styling & Color'>('Barbering & Grooming');
  const [servicePrice, setServicePrice] = useState(1500);
  const [serviceDuration, setServiceDuration] = useState(60);

  // Staff
  const [staffName, setStaffName] = useState('David Kinyua');
  const [staffRole, setStaffRole] = useState('Senior Barber & Stylist');
  const [staffCommission, setStaffCommission] = useState(35);

  if (!isOpen) return null;

  const handleFinishOnboarding = () => {
    const newTenant: SalonTenant = {
      id: `tenant-${Date.now()}`,
      name: name.trim() || 'My Kenya Salon',
      tagline: tagline.trim() || 'Beauty & Wellness',
      town: town.trim() || 'Kutus',
      county: county.trim() || 'Kirinyaga County',
      address: address.trim() || 'Town Centre',
      landmark: landmark.trim(),
      phone: phone.trim() || '+254 700 000 000',
      email: email.trim(),
      mpesaTill: mpesaTill.trim() || '000000',
      mpesaPaybill: mpesaPaybill.trim(),
      openingHours: {
        weekdays: weekdaysHours,
        saturday: saturdayHours,
        sunday: sundayHours,
      },
    };

    saveStoredTenant(newTenant);
    onComplete(newTenant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0F281E]/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#E8E2D9] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#0F281E] text-white px-6 py-5 border-b border-[#1E4333] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880]">
              SalonFlow Kenya · Commercial Setup Wizard
            </div>
            <h2 className="font-serif text-xl font-bold text-white mt-0.5">
              Launch Your Salon in 5 Simple Steps
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#C5A880]/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-[#F4EFEA] border-b border-[#E8E2D9] flex items-center justify-between text-xs">
          {[
            { num: 1, label: 'Identity' },
            { num: 2, label: 'M-Pesa' },
            { num: 3, label: 'Hours' },
            { num: 4, label: 'Service' },
            { num: 5, label: 'Review' },
          ].map(s => (
            <div key={s.num} className="flex items-center gap-1.5">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s.num
                    ? 'bg-[#0F281E] text-white'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#E8E2D9] text-[#71717A]'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </span>
              <span className={`hidden sm:inline ${step === s.num ? 'font-semibold text-[#0F281E]' : 'text-[#71717A]'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step Contents */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-xs text-[#71717A] leading-relaxed">
                Enter your salon or barbershop name and location in Kirinyaga County or anywhere in Kenya.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">
                    Salon / Barbershop Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs text-[#18181B] focus:outline-none focus:border-[#0F281E]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={e => setTagline(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs text-[#18181B] focus:outline-none focus:border-[#0F281E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">Town</label>
                  <input
                    type="text"
                    value={town}
                    onChange={e => setTown(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs text-[#18181B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">County</label>
                  <input
                    type="text"
                    value={county}
                    onChange={e => setCounty(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs text-[#18181B]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">Physical Address & Landmark</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={e => setLandmark(e.target.value)}
                    placeholder="e.g. 2nd Floor, Kutus Central Plaza opposite Equity"
                    className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs text-[#18181B]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-xs text-[#71717A] leading-relaxed">
                Configure your Kenyan payment receivers. Clients will receive this Till number in their booking SMS/receipt.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">
                    Safaricom M-Pesa Buy Goods Till
                  </label>
                  <input
                    type="text"
                    value={mpesaTill}
                    onChange={e => setMpesaTill(e.target.value)}
                    placeholder="e.g. 892341"
                    className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs font-mono font-bold text-[#18181B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">
                    Paybill Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={mpesaPaybill}
                    onChange={e => setMpesaPaybill(e.target.value)}
                    placeholder="e.g. 522522"
                    className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs font-mono text-[#18181B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">Official WhatsApp Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs font-mono text-[#18181B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">Currency & Timezone</label>
                  <div className="px-3 py-2 bg-[#F4EFEA] border border-[#E8E2D9] rounded-lg text-xs font-mono text-[#18181B]">
                    KES · Africa/Nairobi (UTC+3)
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-xs text-[#71717A] leading-relaxed">
                Define the operating hours for your Kutus salon. The booking schedule protection engine will enforce these windows.
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">Monday — Friday</label>
                  <input
                    type="text"
                    value={weekdaysHours}
                    onChange={e => setWeekdaysHours(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs text-[#18181B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">Saturday (Peak Day)</label>
                  <input
                    type="text"
                    value={saturdayHours}
                    onChange={e => setSaturdayHours(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs text-[#18181B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">Sunday</label>
                  <input
                    type="text"
                    value={sundayHours}
                    onChange={e => setSundayHours(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs text-[#18181B]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="text-xs text-[#71717A] leading-relaxed">
                Add your signature starter service and your first artisan. You can add more in the owner dashboard.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">Signature Treatment Name</label>
                  <input
                    type="text"
                    value={primaryService}
                    onChange={e => setPrimaryService(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs text-[#18181B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">Price (KES)</label>
                  <input
                    type="number"
                    value={servicePrice}
                    onChange={e => setServicePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs font-mono font-bold text-[#18181B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={serviceDuration}
                    onChange={e => setServiceDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs font-mono text-[#18181B]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="p-4 bg-[#F4EFEA] border border-[#E8E2D9] rounded-xl space-y-2 text-xs">
                <div className="font-serif text-lg font-bold text-[#0F281E]">
                  Ready to Launch {name}
                </div>
                <div className="text-[#52525B] leading-relaxed">
                  Your multi-tenant profile will be saved. You can immediately accept guest bookings, print POS receipts, view your Daily Brief, and manage master stylists.
                </div>
                <div className="pt-2 border-t border-[#E8E2D9] grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>Town: <span className="font-semibold text-[#18181B]">{town}, {county}</span></div>
                  <div>Till: <span className="font-semibold text-[#18181B]">{mpesaTill}</span></div>
                  <div>Service: <span className="font-semibold text-[#18181B]">{primaryService} (KES {servicePrice})</span></div>
                  <div>Phone: <span className="font-semibold text-[#18181B]">{phone}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-6 border-t border-[#E8E2D9] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-semibold text-[#71717A] hover:text-[#18181B] rounded border border-[#E8E2D9] bg-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div></div>}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2 text-xs font-semibold bg-[#0F281E] hover:bg-[#15382B] text-white rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch My Salon Workspace</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
