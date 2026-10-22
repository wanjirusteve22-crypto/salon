import React, { useState } from 'react';
import { Appointment } from '../types';
import { getStoredAppointments } from '../services/dataStorage';
import { X, Search, CheckCircle2, Clock, Scissors, AlertCircle, Phone } from 'lucide-react';

interface AppointmentTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentTrackerModal: React.FC<AppointmentTrackerModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [result, setResult] = useState<Appointment | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const appointments = getStoredAppointments();
    const cleanQuery = query.trim().toUpperCase();
    
    const found = appointments.find(
      a =>
        a.bookingRef.toUpperCase() === cleanQuery ||
        a.customerPhone.includes(cleanQuery) ||
        (a.mpesaRef && a.mpesaRef.toUpperCase() === cleanQuery)
    );

    setResult(found || null);
    setHasSearched(true);
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'in_chair':
        return (
          <span className="text-amber-800 font-semibold flex items-center gap-1 text-xs">
            <Scissors className="w-3.5 h-3.5 text-amber-600" />
            Currently in Chair
          </span>
        );
      case 'completed':
        return (
          <span className="text-emerald-800 font-semibold flex items-center gap-1 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Service Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-rose-800 font-semibold flex items-center gap-1 text-xs">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Cancelled
          </span>
        );
      case 'scheduled':
      default:
        return (
          <span className="text-[#9A7B50] font-semibold flex items-center gap-1 text-xs">
            <Clock className="w-3.5 h-3.5 text-[#9A7B50]" />
            Chair Reserved / On Schedule
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#18181B]/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-[#18181B] text-[#FAF8F5] px-6 py-4 flex items-center justify-between border-b border-[#27272A]">
          <div>
            <div className="text-[10px] font-mono tracking-wider uppercase text-[#C5A880]">
              Client Self-Service
            </div>
            <h2 className="font-serif text-lg font-bold text-white">
              Track Your Appointment Status
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
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B]">
              Enter Booking Ref (e.g. SFK-8921) or Phone Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. SFK-8921 or 0722..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full bg-white border border-[#E8E2D9] rounded pl-9 pr-3 py-2 text-xs font-mono uppercase text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-colors shrink-0"
              >
                Track
              </button>
            </div>
          </form>

          {hasSearched && !result && (
            <div className="p-4 bg-[#F3EFEA] border border-[#E8E2D9] rounded-lg text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-[#9A7B50] mx-auto" />
              <p className="text-xs text-[#52525B]">
                No booking found for <strong>{query}</strong>. Please check your reference code or contact our reception.
              </p>
              <p className="text-[11px] text-[#71717A] flex items-center justify-center gap-1">
                <Phone className="w-3 h-3 text-[#9A7B50]" />
                Call Kutus Desk: +254 722 894 120
              </p>
            </div>
          )}

          {result && (
            <div className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#71717A]">
                    Booking Ref
                  </div>
                  <div className="font-mono text-lg font-bold text-[#18181B]">
                    {result.bookingRef}
                  </div>
                </div>
                <div>{getStatusBadge(result.status)}</div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Client Name:</span>
                  <span className="font-semibold text-[#18181B]">{result.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Treatment:</span>
                  <span className="font-semibold text-[#18181B]">{result.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Master Stylist:</span>
                  <span className="font-semibold text-[#18181B]">{result.staffName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Date & Chair Slot:</span>
                  <span className="font-mono font-medium text-[#18181B]">
                    {result.date} @ {result.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Fee & Payment:</span>
                  <span className="font-mono font-bold text-[#18181B] tabular-nums">
                    KES {result.priceKes.toLocaleString()} ({result.paymentStatus.toUpperCase()})
                  </span>
                </div>
                {result.mpesaRef && (
                  <div className="flex justify-between pt-1 border-t border-[#F3EFEA]">
                    <span className="text-[#71717A]">M-Pesa Receipt:</span>
                    <span className="font-mono font-semibold text-[#10B981]">{result.mpesaRef}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
