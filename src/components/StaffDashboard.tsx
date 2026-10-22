import React, { useState } from 'react';
import { Appointment, StaffMember, Service } from '../types';
import { updateAppointmentStatus } from '../services/dataStorage';
import { Scissors, Clock, CheckCircle2, DollarSign, Calendar, User, Phone, Check } from 'lucide-react';

interface StaffDashboardProps {
  appointments: Appointment[];
  staff: StaffMember[];
  services: Service[];
  onRefreshData: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  appointments,
  staff,
  services,
  onRefreshData,
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staff[0]?.id || '');

  const currentStylist = staff.find(s => s.id === selectedStaffId) || staff[0];
  const today = new Date().toISOString().split('T')[0];

  // Stylist's appointments
  const stylistAppointments = appointments.filter(
    a => a.staffId === currentStylist.id && (a.date === today || a.status === 'in_chair')
  );

  const completedToday = stylistAppointments.filter(a => a.status === 'completed');
  const inChairApt = stylistAppointments.find(a => a.status === 'in_chair');
  const upcomingToday = stylistAppointments.filter(a => a.status === 'scheduled');

  const earnedCommissionKes = completedToday.reduce(
    (sum, a) => sum + Math.round(a.priceKes * currentStylist.commissionRate),
    0
  );

  const handleSeatClient = (id: string) => {
    updateAppointmentStatus(id, 'in_chair');
    onRefreshData();
  };

  const handleCompleteService = (id: string) => {
    const mockMpesa = `RKL${Math.floor(100000 + Math.random() * 900000)}`;
    updateAppointmentStatus(id, 'completed', mockMpesa);
    onRefreshData();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Top Banner */}
      <div className="bg-[#18181B] text-[#FAF8F5] border-b border-[#27272A] px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#C5A880]">
              Stylist Station & Chair Hub
            </div>
            <h1 className="font-serif text-2xl font-bold text-white mt-1">
              {currentStylist.name}
            </h1>
            <p className="text-xs text-[#A1A1AA]">{currentStylist.role}</p>
          </div>

          {/* Switch Active Stylist */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A1A1AA]">Switch Artisan:</span>
            <select
              value={selectedStaffId}
              onChange={e => setSelectedStaffId(e.target.value)}
              className="bg-[#27272A] text-white border border-[#3F3F46] rounded px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-[#C5A880]"
            >
              {staff.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {/* Stylist KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-[#E8E2D9] rounded-lg p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A] flex items-center justify-between">
              <span>My Commission Today</span>
              <DollarSign className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#10B981] mt-2 tabular-nums">
              KES {earnedCommissionKes.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#71717A] mt-1 font-mono">
              Commission rate: {Math.round(currentStylist.commissionRate * 100)}%
            </div>
          </div>

          <div className="bg-white border border-[#E8E2D9] rounded-lg p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A] flex items-center justify-between">
              <span>Clients Completed</span>
              <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#18181B] mt-2 tabular-nums">
              {completedToday.length}
            </div>
            <div className="text-[11px] text-[#71717A] mt-1">
              Gross revenue generated: KES{' '}
              {completedToday.reduce((sum, a) => sum + a.priceKes, 0).toLocaleString()}
            </div>
          </div>

          <div className="bg-white border border-[#E8E2D9] rounded-lg p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A] flex items-center justify-between">
              <span>Upcoming In Queue</span>
              <Clock className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#18181B] mt-2 tabular-nums">
              {upcomingToday.length} Clients
            </div>
            <div className="text-[11px] text-[#71717A] mt-1">
              Chair booked for today
            </div>
          </div>
        </div>

        {/* CURRENTLY IN CHAIR SECTION */}
        <div className="bg-[#FAF8F5] border-2 border-[#C5A880] rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="font-serif text-lg font-bold text-[#18181B]">
                Currently in Station Chair
              </h2>
            </div>
            <span className="text-xs font-mono text-[#9A7B50] font-semibold">
              Live Station 01
            </span>
          </div>

          {inChairApt ? (
            <div className="bg-white border border-[#E8E2D9] rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-[#F3EFEA] px-2 py-0.5 rounded text-[#18181B]">
                    {inChairApt.bookingRef}
                  </span>
                  <span className="font-serif text-lg font-bold text-[#18181B]">
                    {inChairApt.customerName}
                  </span>
                  <span className="text-xs text-[#71717A]">({inChairApt.customerPhone})</span>
                </div>

                <div className="text-sm font-semibold text-[#9A7B50]">
                  {inChairApt.serviceName}
                </div>

                {inChairApt.notes && (
                  <p className="text-xs text-[#52525B] bg-[#FDFBF7] p-2.5 rounded border border-[#E8E2D9]">
                    <strong>Client Note:</strong> {inChairApt.notes}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <div className="text-right sm:pr-4">
                  <div className="text-xs text-[#71717A]">Your Commission:</div>
                  <div className="font-mono text-base font-bold text-[#10B981] tabular-nums">
                    KES {Math.round(inChairApt.priceKes * currentStylist.commissionRate).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => handleCompleteService(inChairApt.id)}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#10B981] hover:bg-[#059669] rounded transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Finish Service & Settle</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white border border-dashed border-[#D9D2C7] rounded-lg">
              <Scissors className="w-8 h-8 text-[#A1A1AA] mx-auto mb-2" />
              <p className="text-xs text-[#71717A]">
                Your chair is currently clear. Select a scheduled client below to seat them.
              </p>
            </div>
          )}
        </div>

        {/* UPCOMING QUEUE FOR TODAY */}
        <div className="bg-white border border-[#E8E2D9] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
            <h3 className="font-serif text-lg font-bold text-[#18181B]">
              Today’s Client Queue
            </h3>
            <span className="text-xs text-[#71717A]">{upcomingToday.length} waiting</span>
          </div>

          {upcomingToday.length === 0 ? (
            <p className="text-xs text-[#71717A] py-4 text-center">
              No further scheduled appointments in your queue today.
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingToday.map(apt => (
                <div
                  key={apt.id}
                  className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#18181B]">
                        {apt.timeSlot}
                      </span>
                      <span className="text-[#D9D2C7]">·</span>
                      <span className="font-semibold text-sm text-[#18181B]">
                        {apt.customerName}
                      </span>
                      <span className="text-xs text-[#71717A] font-mono">({apt.bookingRef})</span>
                    </div>
                    <div className="text-xs text-[#9A7B50] font-medium mt-1">
                      {apt.serviceName} · KES {apt.priceKes.toLocaleString()}
                    </div>
                    {apt.notes && (
                      <div className="text-xs text-[#71717A] mt-1 italic">
                        "{apt.notes}"
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleSeatClient(apt.id)}
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#E8E2D9] hover:bg-[#C5A880] rounded transition-colors whitespace-nowrap self-start sm:self-center"
                  >
                    Seat In Chair
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
