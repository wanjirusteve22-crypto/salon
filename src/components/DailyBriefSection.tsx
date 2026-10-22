import React, { useState } from 'react';
import { 
  Sparkles, Calendar, Clock, AlertTriangle, UserCheck, 
  Package, CheckCircle2, ArrowRight, Phone, MessageSquare, AlertCircle, RefreshCw 
} from 'lucide-react';
import { DailyBriefData, SalonTenant } from '../types';

interface DailyBriefSectionProps {
  brief: DailyBriefData;
  tenant: SalonTenant;
  onNavigateTab: (tab: string) => void;
  onRefresh: () => void;
}

export const DailyBriefSection: React.FC<DailyBriefSectionProps> = ({
  brief,
  tenant,
  onNavigateTab,
  onRefresh,
}) => {
  const [tasks, setTasks] = useState(brief.followUpTasks);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-sm">
      {/* Editorial Header */}
      <div className="bg-gradient-to-r from-[#0F281E] to-[#16382B] text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse"></span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#C5A880]">
                SalonFlow Daily Intelligence Brief · {new Date().toLocaleDateString('en-KE', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Morning Operations Briefing
            </h2>
            <p className="text-xs text-[#E6E0D6] mt-1 max-w-2xl leading-relaxed">
              Real-time operational summary computed deterministically from today's chair bookings, client visit intervals, and stock thresholds at {tenant.name}.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRefresh}
              className="px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-[#FAF8F5] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-white/10"
              title="Recalculate brief metrics"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Refresh Brief</span>
            </button>
            <button
              onClick={() => onNavigateTab('appointments')}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Manage Appointments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4-Stat Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xs">
            <div className="text-[11px] text-[#C5A880] font-mono uppercase tracking-wider">
              Today's Chair Schedule
            </div>
            <div className="text-3xl font-bold font-mono mt-1 text-white">
              {brief.todayBookingsCount}
            </div>
            <div className="text-[11px] text-[#E6E0D6] mt-0.5">
              {brief.inChairCount} in chair · {brief.pendingArrivalsCount} pending
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xs">
            <div className="text-[11px] text-[#C5A880] font-mono uppercase tracking-wider">
              Pending Confirmation
            </div>
            <div className="text-3xl font-bold font-mono mt-1 text-white">
              {brief.unconfirmedCount}
            </div>
            <div className="text-[11px] text-[#E6E0D6] mt-0.5">
              Arrivals requiring re-check
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xs">
            <div className="text-[11px] text-[#C5A880] font-mono uppercase tracking-wider">
              Retention Due (21+ Days)
            </div>
            <div className="text-3xl font-bold font-mono mt-1 text-white">
              {brief.returningClientsDue.length}
            </div>
            <div className="text-[11px] text-[#E6E0D6] mt-0.5">
              Clients ready for follow-up
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xs">
            <div className="text-[11px] text-[#C5A880] font-mono uppercase tracking-wider">
              Critical Stock Alerts
            </div>
            <div className="text-3xl font-bold font-mono mt-1 text-white">
              {brief.lowStockItems.length}
            </div>
            <div className="text-[11px] text-[#E6E0D6] mt-0.5">
              Products below min threshold
            </div>
          </div>
        </div>
      </div>

      {/* Detail Cards Grid */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#FAF8F5]">
        {/* Card 1: Actionable Daily Tasks */}
        <div className="bg-white border border-[#E8E2D9] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0F281E]" />
              <h3 className="font-serif font-bold text-sm text-[#18181B]">
                Staff Follow-Up Queue
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#71717A]">
              {tasks.filter(t => t.done).length}/{tasks.length} Completed
            </span>
          </div>

          <div className="space-y-2.5">
            {tasks.map(task => (
              <label
                key={task.id}
                className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                  task.done
                    ? 'bg-[#FAF8F5] border-[#E8E2D9] text-[#71717A] line-through'
                    : 'bg-white border-[#E8E2D9] text-[#18181B] hover:border-[#0F281E]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  className="mt-0.5 rounded border-[#C5A880] text-[#0F281E] focus:ring-[#0F281E]"
                />
                <span className="leading-relaxed flex-1">{task.task}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Card 2: Retention & Due Clients */}
        <div className="bg-white border border-[#E8E2D9] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#C5A880]" />
              <h3 className="font-serif font-bold text-sm text-[#18181B]">
                Clients Due for Return (21+ Days)
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('customers')}
              className="text-[11px] text-[#9A7B50] hover:underline font-medium cursor-pointer"
            >
              Directory →
            </button>
          </div>

          {brief.returningClientsDue.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#71717A]">
              All regular clients have recent active visits.
            </div>
          ) : (
            <div className="space-y-3">
              {brief.returningClientsDue.map(client => (
                <div
                  key={client.id}
                  className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#18181B]">{client.name}</span>
                    <span className="text-[10px] font-mono text-[#9A7B50]">
                      {client.daysSinceLastVisit} days ago
                    </span>
                  </div>
                  <div className="text-[11px] text-[#71717A] flex items-center justify-between">
                    <span>Prefers: {client.preferredService}</span>
                    <a
                      href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}?text=Habari%20${encodeURIComponent(client.name)},%20we%20miss%20you%20at%20${encodeURIComponent(tenant.name)}%20Kutus!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 3: Open Slots & Inventory Watch */}
        <div className="bg-white border border-[#E8E2D9] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0F281E]" />
              <h3 className="font-serif font-bold text-sm text-[#18181B]">
                Open Bookable Gaps Today
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {brief.openSlotsAvailable.length} slots open
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-[#71717A]">
              Promote these chair openings for walk-in clients:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {brief.openSlotsAvailable.slice(0, 6).map(slot => (
                <span
                  key={slot}
                  className="px-2.5 py-1 text-xs font-mono bg-[#F4EFEA] border border-[#E8E2D9] rounded text-[#18181B]"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>

          {/* Low stock alert box */}
          {brief.lowStockItems.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#E8E2D9] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Inventory Requiring Restock:</span>
              </div>
              <div className="space-y-1.5 text-xs">
                {brief.lowStockItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded bg-rose-50 border border-rose-200 text-rose-950">
                    <span className="truncate pr-2">{item.name}</span>
                    <span className="font-mono font-bold shrink-0">{item.quantity} left</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
