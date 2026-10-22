import React, { useState } from 'react';
import { SalonTenant } from '../../types';
import { 
  MapPin, Phone, Mail, Clock, MessageSquare, Send, 
  CheckCircle2, Navigation, AlertCircle 
} from 'lucide-react';

interface ContactPageProps {
  tenant: SalonTenant;
}

export const ContactPage: React.FC<ContactPageProps> = ({ tenant }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    // Simulate reliable form submission feedback
    setSubmitted(true);
    setName('');
    setMessage('');
  };

  const whatsAppUrl = `https://wa.me/254722894120?text=${encodeURIComponent(
    'Hello Aurum Salon Kutus! I would like to inquire about appointments and bridal packages.'
  )}`;

  return (
    <div className="py-12 lg:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#9A7B50] mb-2">
            Get in Touch
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18181B]" style={{ textWrap: 'balance' }}>
            Visit our sanctuary or speak with our concierge.
          </h1>
          <p className="text-sm sm:text-base text-[#52525B] mt-3 leading-relaxed">
            Whether booking a bridal party, seeking custom loc consultation, or finding directions from Kerugoya or Kirinyaga University, our front desk team is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E8E2D9] rounded-lg p-6 space-y-6">
              <h2 className="font-serif font-bold text-lg text-[#18181B] pb-3 border-b border-[#E8E2D9]">
                Kutus Studio Reception
              </h2>

              <div className="space-y-4 text-xs text-[#52525B]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#9A7B50] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#18181B] block">{tenant.address}</span>
                    <span className="text-[#71717A] block">{tenant.landmark}</span>
                    <span className="text-[#71717A] block">{tenant.town}, {tenant.county}, Kenya</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#9A7B50] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#18181B] block">Reception Desk</span>
                    <a href={`tel:${tenant.phone}`} className="text-[#9A7B50] hover:underline">
                      {tenant.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#9A7B50] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#18181B] block">Email Inquiries</span>
                    <span className="text-[#71717A]">{tenant.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#9A7B50] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#18181B] block">Operating Hours</span>
                    <div className="text-[#71717A] mt-0.5">Mon–Fri: {tenant.openingHours.weekdays}</div>
                    <div className="text-[#71717A]">Saturday: {tenant.openingHours.saturday}</div>
                    <div className="text-[#71717A]">Sunday: {tenant.openingHours.sunday}</div>
                  </div>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="pt-4 border-t border-[#E8E2D9] space-y-2.5">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp (+254 722 894 120)</span>
                </a>
                <a
                  href={`tel:${tenant.phone}`}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-[#18181B] bg-[#F3EFEA] hover:bg-[#E8E2D9] rounded transition-colors flex items-center justify-center gap-2 border border-[#E8E2D9]"
                >
                  <Phone className="w-4 h-4 text-[#9A7B50]" />
                  <span>Call Reception Desk</span>
                </a>
              </div>
            </div>

            {/* Travel Directions Note */}
            <div className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-lg p-5 text-xs text-[#52525B] space-y-2">
              <div className="font-bold text-[#18181B] flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-[#9A7B50]" />
                <span>Accessibility in Kutus</span>
              </div>
              <p className="leading-relaxed text-[#71717A]">
                Convenient ground parking with security is available for all guests. The building features wheelchair-accessible ramps and high-capacity elevators to our 2nd floor lounge.
              </p>
            </div>
          </div>

          {/* Right Column: Contact & Booking Inquiry Form */}
          <div className="lg:col-span-7 bg-white border border-[#E8E2D9] rounded-lg p-6 sm:p-8">
            <h2 className="font-serif font-bold text-xl text-[#18181B] mb-2">
              Send an Inquiry or Bridal Request
            </h2>
            <p className="text-xs text-[#71717A] mb-6">
              Fill in your details below and our front desk manager will reply via phone or WhatsApp within 30 minutes during working hours.
            </p>

            {submitted ? (
              <div className="p-6 bg-[#FAF8F5] border border-[#C5A880] rounded-lg text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#10B981] mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#18181B]">
                  Message Received!
                </h3>
                <p className="text-xs text-[#52525B] max-w-sm mx-auto">
                  Thank you for reaching out to Aurum Studio Kutus. A concierge representative will review your message and reach out shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-semibold text-[#9A7B50] hover:underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dennis Murimi"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+254 7XX XXX XXX"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs font-mono text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="General Inquiry">General Service Inquiry</option>
                    <option value="Bridal Consultation">Bridal & Wedding Hair Package</option>
                    <option value="Loc Care Consultation">Loc Retwist & Interlocking Consultation</option>
                    <option value="Executive Barber VIP">Executive Barber Grooming Session</option>
                    <option value="Corporate Grooming">Corporate Group Booking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                    Your Message / Specific Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details about your preferred dates, hair type, or special event timings..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded p-3 text-xs text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Reception</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
