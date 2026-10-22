import React, { useState, useEffect } from 'react';
import { Service, StaffMember, Appointment, PaymentMethod } from '../types';
import { CURRENT_TENANT, generateBookingRef, saveAppointment } from '../services/dataStorage';
import { X, Calendar, Clock, User, Phone, Check, ArrowRight, CheckCircle2, MessageCircle, Copy } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  staff: StaffMember[];
  initialService?: Service | null;
  initialStaff?: StaffMember | null;
  onAppointmentCreated: (appointment: Appointment) => void;
}

const TIME_SLOTS = [
  '08:30 AM',
  '10:00 AM',
  '11:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:30 PM',
  '07:00 PM',
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  services,
  staff,
  initialService,
  initialStaff,
  onAppointmentCreated,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  
  // Client details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+254 7');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa_till');
  const [notes, setNotes] = useState('');

  // Confirmation state
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (initialService) {
      setSelectedServiceId(initialService.id);
    } else if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }
  }, [initialService, services]);

  useEffect(() => {
    if (initialStaff) {
      setSelectedStaffId(initialStaff.id);
    } else if (staff.length > 0 && !selectedStaffId) {
      setSelectedStaffId(staff[0].id);
    }
  }, [initialStaff, staff]);

  useEffect(() => {
    // Default to today
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  if (!isOpen) return null;

  const currentSelectedService = services.find(s => s.id === selectedServiceId) || services[0];
  const currentSelectedStaff = staff.find(st => st.id === selectedStaffId) || staff[0];

  const handlePhoneChange = (val: string) => {
    setCustomerPhone(val);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      return;
    }

    const bookingRef = generateBookingRef();
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      bookingRef,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      serviceId: currentSelectedService.id,
      serviceName: currentSelectedService.name,
      staffId: currentSelectedStaff.id,
      staffName: currentSelectedStaff.name,
      date: selectedDate,
      timeSlot: selectedTime,
      status: 'scheduled',
      priceKes: currentSelectedService.priceKes,
      paymentMethod,
      paymentStatus: paymentMethod === 'mpesa_till' ? 'pending' : 'unpaid',
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      isDemo: true,
    };

    saveAppointment(newAppointment);
    onAppointmentCreated(newAppointment);
    setConfirmedAppointment(newAppointment);
    setStep(4);
  };

  const handleCopyRef = () => {
    if (confirmedAppointment) {
      navigator.clipboard.writeText(confirmedAppointment.bookingRef);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const getWhatsAppShareUrl = () => {
    if (!confirmedAppointment) return '';
    const text = encodeURIComponent(
      `Hello Aurum Salon Kutus! I have booked an appointment.\nRef: ${confirmedAppointment.bookingRef}\nService: ${confirmedAppointment.serviceName}\nStylist: ${confirmedAppointment.staffName}\nDate: ${confirmedAppointment.date} at ${confirmedAppointment.timeSlot}\nName: ${confirmedAppointment.customerName}`
    );
    return `https://wa.me/254722894120?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#18181B]/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#18181B] text-[#FAF8F5] px-6 py-4 flex items-center justify-between border-b border-[#27272A]">
          <div>
            <div className="text-[11px] font-mono tracking-wider uppercase text-[#C5A880]">
              Online Chair Reservation
            </div>
            <h2 className="font-serif text-lg font-bold text-white">
              {step === 4 ? 'Appointment Confirmed' : 'Book Your Session at Aurum Kutus'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#A1A1AA] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator (when not finished) */}
        {step < 4 && (
          <div className="bg-[#F3EFEA] border-b border-[#E8E2D9] px-6 py-2.5 flex items-center justify-between text-xs text-[#71717A]">
            <span className={step >= 1 ? 'text-[#18181B] font-semibold' : ''}>1. Service & Artisan</span>
            <span className="text-[#D9D2C7]">/</span>
            <span className={step >= 2 ? 'text-[#18181B] font-semibold' : ''}>2. Date & Time</span>
            <span className="text-[#D9D2C7]">/</span>
            <span className={step >= 3 ? 'text-[#18181B] font-semibold' : ''}>3. Client & M-Pesa</span>
          </div>
        )}

        <div className="p-6">
          {/* STEP 1: Select Service & Staff */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-2">
                  Select Treatment
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                  {services.map(svc => (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => setSelectedServiceId(svc.id)}
                      className={`p-3 text-left border rounded transition-all flex flex-col justify-between ${
                        selectedServiceId === svc.id
                          ? 'border-[#18181B] bg-white ring-1 ring-[#18181B]'
                          : 'border-[#E8E2D9] bg-[#FDFBF7] hover:border-[#C5A880]'
                      }`}
                    >
                      <div className="font-serif font-semibold text-sm text-[#18181B]">
                        {svc.name}
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-[#71717A]">
                        <span>{svc.durationMin} mins</span>
                        <span className="font-mono font-bold text-[#18181B] tabular-nums">
                          KES {svc.priceKes.toLocaleString()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-2">
                  Select Preferred Artisan
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {staff.map(artisan => (
                    <button
                      key={artisan.id}
                      type="button"
                      onClick={() => setSelectedStaffId(artisan.id)}
                      className={`p-3 text-center border rounded transition-all flex flex-col items-center ${
                        selectedStaffId === artisan.id
                          ? 'border-[#18181B] bg-white ring-1 ring-[#18181B]'
                          : 'border-[#E8E2D9] bg-[#FDFBF7] hover:border-[#C5A880]'
                      }`}
                    >
                      <img
                        src={artisan.avatar}
                        alt={artisan.name}
                        className="w-10 h-10 rounded-full object-cover mb-2 border border-[#C5A880]/30"
                        referrerPolicy="no-referrer"
                      />
                      <div className="font-semibold text-xs text-[#18181B] line-clamp-1">
                        {artisan.name.split(' ')[0]}
                      </div>
                      <div className="text-[10px] text-[#71717A] line-clamp-1">
                        {artisan.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E2D9] flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-colors flex items-center gap-2"
                >
                  <span>Select Date & Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Select Date & Time */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="p-3 bg-[#F3EFEA] rounded border border-[#E8E2D9] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#18181B]">{currentSelectedService.name}</span>
                  <span className="text-[#71717A] ml-2">with {currentSelectedStaff.name}</span>
                </div>
                <span className="font-mono font-bold text-[#18181B] tabular-nums">
                  KES {currentSelectedService.priceKes.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-2">
                  Appointment Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full bg-white border border-[#E8E2D9] rounded pl-10 pr-4 py-2.5 text-xs text-[#18181B] font-mono focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-2">
                  Available Chair Times
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 px-3 text-xs font-mono rounded border transition-all text-center ${
                        selectedTime === slot
                          ? 'bg-[#18181B] text-white border-[#18181B] font-semibold'
                          : 'bg-[#FDFBF7] text-[#52525B] border-[#E8E2D9] hover:border-[#C5A880]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E2D9] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-medium text-[#71717A] hover:text-[#18181B]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-colors flex items-center gap-2"
                >
                  <span>Client & Contact Info</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Client Details & M-Pesa info */}
          {step === 3 && (
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div className="p-3 bg-[#F3EFEA] rounded border border-[#E8E2D9] flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-[#18181B]">
                    {currentSelectedService.name} · {selectedDate} @ {selectedTime}
                  </div>
                  <div className="text-[#71717A]">With {currentSelectedStaff.name} ({currentSelectedService.durationMin} mins)</div>
                </div>
                <div className="font-mono font-bold text-sm text-[#18181B] tabular-nums">
                  KES {currentSelectedService.priceKes.toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grace Wambui"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full bg-white border border-[#E8E2D9] rounded pl-9 pr-3 py-2 text-xs text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                    M-Pesa Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+254 7XX XXX XXX"
                      value={customerPhone}
                      onChange={e => handlePhoneChange(e.target.value)}
                      className="w-full bg-white border border-[#E8E2D9] rounded pl-9 pr-3 py-2 text-xs text-[#18181B] font-mono focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                  Email Address (Optional receipt)
                </label>
                <input
                  type="email"
                  placeholder="e.g. grace@example.com"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full bg-white border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-2">
                  Payment Method Preference
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa_till')}
                    className={`p-2.5 rounded border text-left transition-all ${
                      paymentMethod === 'mpesa_till'
                        ? 'border-[#18181B] bg-white ring-1 ring-[#18181B]'
                        : 'border-[#E8E2D9] bg-[#FDFBF7]'
                    }`}
                  >
                    <div className="font-semibold text-[#18181B]">M-Pesa Till</div>
                    <div className="text-[10px] text-[#71717A] font-mono mt-0.5">Till {CURRENT_TENANT.mpesaTill}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa_paybill')}
                    className={`p-2.5 rounded border text-left transition-all ${
                      paymentMethod === 'mpesa_paybill'
                        ? 'border-[#18181B] bg-white ring-1 ring-[#18181B]'
                        : 'border-[#E8E2D9] bg-[#FDFBF7]'
                    }`}
                  >
                    <div className="font-semibold text-[#18181B]">Paybill</div>
                    <div className="text-[10px] text-[#71717A] font-mono mt-0.5">522522</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2.5 rounded border text-left transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-[#18181B] bg-white ring-1 ring-[#18181B]'
                        : 'border-[#E8E2D9] bg-[#FDFBF7]'
                    }`}
                  >
                    <div className="font-semibold text-[#18181B]">Cash at Salon</div>
                    <div className="text-[10px] text-[#71717A] mt-0.5">Pay after service</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded border text-left transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#18181B] bg-white ring-1 ring-[#18181B]'
                        : 'border-[#E8E2D9] bg-[#FDFBF7]'
                    }`}
                  >
                    <div className="font-semibold text-[#18181B]">Card POS</div>
                    <div className="text-[10px] text-[#71717A] mt-0.5">Visa / Mastercard</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                  Styling Notes / Hair Length / Add-on Requests
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Waist length, sensitive scalp, low taper fade on sides..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-white border border-[#E8E2D9] rounded p-2 text-xs text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="pt-4 border-t border-[#E8E2D9] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-medium text-[#71717A] hover:text-[#18181B]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Chair Booking</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Instant Confirmation & M-Pesa Instructions */}
          {step === 4 && confirmedAppointment && (
            <div className="space-y-6">
              <div className="text-center py-4 space-y-2">
                <div className="w-12 h-12 bg-[#10B981]/10 text-[#10B981] rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#18181B]">
                  Chair Reserved Successfully!
                </h3>
                <p className="text-xs text-[#71717A] max-w-md mx-auto">
                  Your appointment is registered in Aurum’s live schedule in Kutus. We have saved your slot with {confirmedAppointment.staffName}.
                </p>
              </div>

              {/* Booking Reference Box */}
              <div className="p-4 bg-[#F3EFEA] border border-[#E8E2D9] rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-[#71717A]">
                      Booking Reference
                    </div>
                    <div className="font-mono text-xl font-bold text-[#18181B] tracking-wider">
                      {confirmedAppointment.bookingRef}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyRef}
                    className="px-3 py-1.5 text-xs bg-white border border-[#D9D2C7] rounded hover:border-[#18181B] transition-colors flex items-center gap-1.5 font-medium"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#9A7B50]" />
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-3 border-t border-[#E8E2D9]">
                  <div>
                    <span className="text-[#71717A] block">Treatment:</span>
                    <span className="font-semibold text-[#18181B]">{confirmedAppointment.serviceName}</span>
                  </div>
                  <div>
                    <span className="text-[#71717A] block">Date & Time:</span>
                    <span className="font-semibold text-[#18181B] font-mono">
                      {confirmedAppointment.date} · {confirmedAppointment.timeSlot}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#71717A] block">Total Amount:</span>
                    <span className="font-bold text-[#18181B] font-mono tabular-nums">
                      KES {confirmedAppointment.priceKes.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* M-Pesa Instructions Callout */}
              <div className="p-4 bg-white border border-[#C5A880]/60 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#18181B]">
                  <span>Safaricom M-Pesa Till Instructions</span>
                  <span className="font-mono text-[#9A7B50]">Buy Goods: {CURRENT_TENANT.mpesaTill}</span>
                </div>
                <p className="text-xs text-[#52525B] leading-relaxed">
                  Go to M-Pesa &gt; Lipa na M-Pesa &gt; Buy Goods and Services &gt; Enter Till <strong>{CURRENT_TENANT.mpesaTill}</strong> (Aurum Salon Kutus). You can pay in advance or instantly upon sitting in your chair.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <a
                  href={getWhatsAppShareUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Confirmation via WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#E8E2D9] hover:bg-[#C5A880] rounded transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
