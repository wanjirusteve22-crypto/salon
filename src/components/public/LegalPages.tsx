import React, { useState } from 'react';
import { SalonTenant } from '../../types';
import { Shield, FileText, Check, Edit3, RotateCcw } from 'lucide-react';

interface LegalPagesProps {
  tenant: SalonTenant;
  type: 'privacy' | 'terms';
}

const DEFAULT_PRIVACY = `1. Introduction & Regulatory Scope
Aurum Studio & Executive Barber ("SalonFlow Kenya", "we", "our") is dedicated to safeguarding your personal data in accordance with the Kenya Data Protection Act, 2019 and relevant national telecommunication privacy regulations.

2. Personal Data We Collect
When you book an appointment or receive services in our Kutus salon, we collect:
- Full Name and contact telephone numbers (specifically Safaricom M-Pesa mobile numbers).
- Email addresses (for digital receipts and schedule notices).
- Service preferences, styling notes, and scalp/skin sensitivity details.
- Safaricom M-Pesa transaction reference identifiers (e.g., RKLxxxxxx) to reconcile accounting and Till settlements.

3. Purpose of Processing
Your data is used solely to:
- Reserve and hold your dedicated chair time with master artisans.
- Dispatch SMS or WhatsApp appointment reminders and updates.
- Reconcile payments made via Lipa na M-Pesa Buy Goods Till or Paybill.
- Maintain hygiene and personalized styling history across appointments.

4. Data Storage & Security
All records are stored securely within encrypted databases with strict Row Level Security (RLS). We do not sell, rent, or trade your personal telephone numbers or data to third-party marketing companies.

5. Your Rights as a Data Subject
You have the right to inspect, update, or request erasure of your client profile at any time by speaking to our front desk manager at Kutus Central Plaza or contacting concierge@aurumsalonflow.co.ke.`;

const DEFAULT_TERMS = `1. Appointment Booking & Punctuality
- To ensure exceptional service and respect every client's time, appointments booked via SalonFlow are held with a 15-minute grace period.
- If you anticipate arriving late, please notify our reception via phone (+254 722 894 120) or WhatsApp as soon as possible. Late arrivals exceeding 20 minutes may require rescheduling to avoid delaying subsequent clients.

2. Pricing & M-Pesa Payments
- All treatment fees are quoted transparently in Kenyan Shillings (KES).
- Official payments must be settled through our registered Safaricom Lipa Na M-Pesa Buy Goods Till (Till: 892341), Paybill 522522, official Card POS, or cash directly at the front desk.
- Never send funds directly to an individual stylist's private phone number unless authorized by salon management.

3. Scalp Wellness, Chemical Services & Patch Testing
- For chemical processing, coloring, or intensive scalp treatments, our artisans conduct a prior hair condition assessment. Please disclose any previous allergic reactions, sensitivities, or recent chemical treatments.

4. Cancellations & Rescheduling
- We kindly request at least 2 hours advance notice for cancellations or appointment modifications so that your chair may be offered to walk-in clients in Kutus.

5. Personal Belongings
- While our Kutus salon is equipped with CCTV security and secured lockers, clients are advised to look after personal valuables and jewelry removed during treatments.`;

export const LegalPages: React.FC<LegalPagesProps> = ({ tenant, type }) => {
  const isPrivacy = type === 'privacy';
  const storageKey = isPrivacy ? 'salonflow_legal_privacy' : 'salonflow_legal_terms';

  const [content, setContent] = useState<string>(() => {
    return localStorage.getItem(storageKey) || (isPrivacy ? DEFAULT_PRIVACY : DEFAULT_TERMS);
  });
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    localStorage.setItem(storageKey, content);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    const defaultText = isPrivacy ? DEFAULT_PRIVACY : DEFAULT_TERMS;
    setContent(defaultText);
    localStorage.setItem(storageKey, defaultText);
    setIsEditing(false);
  };

  return (
    <div className="py-12 lg:py-20 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E8E2D9]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#9A7B50] flex items-center gap-1.5 mb-1">
              {isPrivacy ? <Shield className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
              <span>{tenant.name} · Compliance Documentation</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#18181B]">
              {isPrivacy ? 'Privacy Policy & Kenya Data Protection' : 'Terms of Service & Salon Policy'}
            </h1>
            <p className="text-xs text-[#71717A] mt-1">
              Last updated: October 2026 · Governing operations in Kutus, Kirinyaga County.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-xs font-semibold bg-[#10B981] hover:bg-[#059669] text-white rounded transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Starter Content</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 text-xs text-[#71717A] hover:text-[#18181B]"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3.5 py-1.5 text-xs font-medium bg-white border border-[#D9D2C7] rounded hover:border-[#18181B] transition-colors flex items-center gap-1.5 text-[#18181B]"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#9A7B50]" />
                  <span>Customize Starter Text</span>
                </button>
                <button
                  onClick={handleReset}
                  title="Reset to default template"
                  className="p-1.5 text-[#71717A] hover:text-[#18181B]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Custom legal starter text saved into local configuration.</span>
          </div>
        )}

        {isEditing ? (
          <div className="space-y-4">
            <div className="text-xs text-[#71717A]">
              Edit the legal text below to match your salon's exact policies and terms:
            </div>
            <textarea
              rows={20}
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full bg-white border border-[#C5A880] rounded p-4 text-xs font-mono text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#C5A880] leading-relaxed"
            />
          </div>
        ) : (
          <div className="bg-white border border-[#E8E2D9] rounded-lg p-6 sm:p-8 space-y-4 text-xs text-[#52525B] leading-relaxed font-sans whitespace-pre-line">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};
