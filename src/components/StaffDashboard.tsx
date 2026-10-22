import React, { useState } from 'react';
import { Appointment, StaffMember, Service } from '../types';
import { updateAppointmentStatus } from '../services/dataStorage';
import { backendService } from '../services/backendService';
import { 
  Scissors, Clock, CheckCircle2, DollarSign, Calendar, 
  User, Phone, Check, History, Award, AlertCircle 
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'schedule' | 'history' | 'shifts'>('schedule');

  const currentStylist = staff.find(s => s.id === selectedStaffId) || staff[0];
  const today = new Date().toISOString().split('T')[0];

  // Stylist's appointments
  const allStylistAppointments = appointments.filter(a => a.staffId === currentStylist.id);
  const todayAppointments = allStylistAppointments.filter(
    a => a.date === today || a.status === 'in_chair'
  );

  const completedToday = todayAppointments.filter(a => a.status === 'completed');
  const inChairApt = todayAppointments.find(a => a.status === 'in_chair');
  const upcomingToday = todayAppointments.filter(a => a.status === 'scheduled');
  const allCompletedHistory = allStylistAppointments.filter(a => a.status === 'completed');

  const earnedCommissionTodayKes = completedToday.reduce(
    (sum, a) => sum + Math.round(a.priceKes * currentStylist.commissionRate),
    0
  );

  const totalLifetimeCommissionKes = allCompletedHistory.reduce(
    (sum, a) => sum + Math.round(a.priceKes * currentStylist.commissionRate),
    0
  );

  const handleSeatClient = async (id: string) => {
    await backendService.updateStatus(id, 'in_chair');
    onRefreshData();
  };

  const handleCompleteService = async (id: string) => {
    const mockMpesa = `RKL${Math.floor(100000 + Math.random() * 900000)}`;
    await backendService.updateStatus(id, 'completed', mockMpesa, currentStylist.commissionRate);
    onRefreshData();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Top Banner */}
      <div className="bg-[#18181B] text-[#FAF8F5] border-b border-[#27272A] px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentStylist.avatar}
              alt={currentStylist.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#C5A880]"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#C5A880]">
                Stylist Station & Chair Hub
              </div>
              <h1 className="font-serif text-2xl font-bold text-white mt-0.5">
                {currentStylist.name}
              </h1>
              <p className="text-xs text-[#A1A1AA]">{currentStylist.role}</p>
            </div>
          </div>

          {/* Switch Active Stylist */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A1A1AA]">Active Stylist:</span>
            <select
              value={selectedStaffId}
              onChange={e => setSelectedStaffId(e.target.value)}
              className="bg-[#27272A] text-white border border-[#3F3F46] rounded px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-[#C5A880] cursor-pointer"
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
              KES {earnedCommissionTodayKes.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#71717A] mt-1 font-mono">
              Rate: {Math.round(currentStylist.commissionRate * 100)}% of service fee
            </div>
          </div>

          <div className="bg-white border border-[#E8E2D9] rounded-lg p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A] flex items-center justify-between">
              <span>Completed Today</span>
              <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#18181B] mt-2 tabular-nums">
              {completedToday.length} Clients
            </div>
            <div className="text-[11px] text-[#71717A] mt-1 font-mono">
              Total historical: {allCompletedHistory.length} completed
            </div>
          </div>

          <div className="bg-white border border-[#E8E2D9] rounded-lg p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A] flex items-center justify-between">
              <span>Upcoming In Chair</span>
              <Clock className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#18181B] mt-2 tabular-nums">
              {upcomingToday.length} Scheduled
            </div>
            <div className="text-[11px] text-[#71717A] mt-1">
              Station booked for today
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E8E2D9] pb-3">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 text-xs font-semibold rounded transition-colors cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-[#18181B] text-white shadow-xs'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Today's Chair Queue ({todayAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-xs font-semibold rounded transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#18181B] text-white shadow-xs'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Completed Job History ({allCompletedHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('shifts')}
            className={`px-4 py-2 text-xs font-semibold rounded transition-colors cursor-pointer ${
              activeTab === 'shifts'
                ? 'bg-[#18181B] text-white shadow-xs'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            My Weekly Shift Schedule
          </button>
        </div>

        {/* TAB 1: Today's Schedule & In Chair */}
        {activeTab === 'schedule' && (
          <div className="space-y-8">
            {/* CURRENTLY IN CHAIR SECTION */}
            <div className="bg-[#FAF8F5] border-2 border-[#C5A880] rounded-xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <h2 className="font-serif text-lg font-bold text-[#18181B]">
                    Active in Station Chair
                  </h2>
                </div>
                <span className="text-xs font-mono text-[#9A7B50] font-semibold">
                  Station 01 · {currentStylist.name.split(' ')[0]}
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
                      className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#10B981] hover:bg-[#059669] rounded transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
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
                    Your station is currently clear. Select a scheduled client below to seat them.
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
                <p className="text-xs text-[#71717A] py-6 text-center">
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
                        className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#E8E2D9] hover:bg-[#C5A880] rounded transition-colors whitespace-nowrap self-start sm:self-center cursor-pointer"
                      >
                        Seat In Chair
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Completed Job History */}
        {activeTab === 'history' && (
          <div className="bg-white border border-[#E8E2D9] rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#18181B]">
                  Completed Service History & Earnings
                </h3>
                <p className="text-xs text-[#71717A]">
                  Archive of client services completed by {currentStylist.name}.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#71717A] block">Cumulative Earned</span>
                <span className="font-mono text-lg font-bold text-[#10B981] tabular-nums">
                  KES {totalLifetimeCommissionKes.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-[#71717A] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Service Fee</th>
                    <th className="py-3 px-4 text-right">Commission Earned</th>
                    <th className="py-3 px-4">M-Pesa Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D9]">
                  {allCompletedHistory.map(apt => (
                    <tr key={apt.id} className="hover:bg-[#FDFBF7]">
                      <td className="py-3 px-4 font-mono font-bold text-[#18181B]">
                        {apt.bookingRef}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#18181B]">
                        {apt.customerName}
                      </td>
                      <td className="py-3 px-4 text-[#52525B]">
                        {apt.serviceName}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#71717A]">
                        {apt.date} · {apt.timeSlot}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-[#18181B]">
                        KES {apt.priceKes.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#10B981] tabular-nums">
                        KES {Math.round(apt.priceKes * currentStylist.commissionRate).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#10B981]">
                        {apt.mpesaRef || 'Counter Cash'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Shift Schedule */}
        {activeTab === 'shifts' && (
          <div className="bg-white border border-[#E8E2D9] rounded-lg p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#18181B]">
              Weekly Station Schedule for {currentStylist.name}
            </h3>
            <p className="text-xs text-[#71717A] mb-4">
              Your scheduled duty hours at Aurum Studio & Executive Barber, Kutus Central Plaza.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentStylist.schedule?.map(day => (
                <div
                  key={day.day}
                  className={`p-4 rounded-lg border ${
                    day.isWorking ? 'bg-[#FAF8F5] border-[#E8E2D9]' : 'bg-[#F3EFEA] border-dashed border-[#D9D2C7] opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-[#18181B]">{day.day}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${day.isWorking ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-700'}`}>
                      {day.isWorking ? 'On Shift' : 'Off Duty'}
                    </span>
                  </div>

                  {day.isWorking ? (
                    <div className="mt-3 text-xs text-[#52525B] font-mono">
                      {day.startTime} — {day.endTime}
                    </div>
                  ) : (
                    <div className="mt-3 text-xs text-[#71717A]">Rest day</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
