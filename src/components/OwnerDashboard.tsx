import React, { useState } from 'react';
import { Appointment, InventoryItem, Service, StaffMember } from '../types';
import { CURRENT_TENANT, SUPABASE_SQL_SCHEMA, updateAppointmentStatus, updateInventoryQuantity } from '../services/dataStorage';
import { 
  DollarSign, Calendar, Scissors, Users, Package, CheckCircle2, 
  Clock, AlertTriangle, Plus, Printer, Download, Search, Check, 
  ExternalLink, Copy, RefreshCw, Smartphone
} from 'lucide-react';

interface OwnerDashboardProps {
  appointments: Appointment[];
  services: Service[];
  staff: StaffMember[];
  inventory: InventoryItem[];
  onRefreshData: () => void;
  onOpenCommercialModal: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  appointments,
  services,
  staff,
  inventory,
  onRefreshData,
  onOpenCommercialModal,
}) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'pos' | 'staff' | 'inventory' | 'supabase'>('appointments');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // POS State
  const [posCustomerName, setPosCustomerName] = useState('');
  const [posCustomerPhone, setPosCustomerPhone] = useState('+254 7');
  const [posServiceId, setPosServiceId] = useState(services[0]?.id || '');
  const [posStaffId, setPosStaffId] = useState(staff[0]?.id || '');
  const [posPaymentMethod, setPosPaymentMethod] = useState<'mpesa_till' | 'cash' | 'card'>('mpesa_till');
  const [posMpesaCode, setPosMpesaCode] = useState('');
  const [activeReceipt, setActiveReceipt] = useState<Appointment | null>(null);

  // Supabase copy feedback
  const [copiedSql, setCopiedSql] = useState(false);

  // Financial calculations
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === today);
  const totalRevenue = appointments
    .filter(a => a.status === 'completed' || a.paymentStatus === 'paid')
    .reduce((sum, a) => sum + a.priceKes, 0);

  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const inChairCount = appointments.filter(a => a.status === 'in_chair').length;
  const scheduledCount = appointments.filter(a => a.status === 'scheduled').length;

  // Calculate staff commission
  const staffCommissions = staff.map(member => {
    const memberAppointments = appointments.filter(
      a => a.staffId === member.id && (a.status === 'completed' || a.paymentStatus === 'paid')
    );
    const gross = memberAppointments.reduce((sum, a) => sum + a.priceKes, 0);
    const commission = Math.round(gross * member.commissionRate);
    return {
      ...member,
      completedJobs: memberAppointments.length,
      grossSalesKes: gross,
      commissionEarnedKes: commission,
    };
  });

  const totalCommissions = staffCommissions.reduce((sum, s) => sum + s.commissionEarnedKes, 0);

  // Filtered Appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesSearch =
      apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.customerPhone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (id: string, status: Appointment['status'], mpesaRef?: string) => {
    updateAppointmentStatus(id, status, mpesaRef);
    onRefreshData();
  };

  const handleCreatePosSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!posCustomerName.trim() || !posCustomerPhone.trim()) return;

    const selectedSvc = services.find(s => s.id === posServiceId) || services[0];
    const selectedStf = staff.find(st => st.id === posStaffId) || staff[0];

    const newApt: Appointment = {
      id: `pos-${Date.now()}`,
      bookingRef: `SFK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: posCustomerName.trim(),
      customerPhone: posCustomerPhone.trim(),
      serviceId: selectedSvc.id,
      serviceName: selectedSvc.name,
      staffId: selectedStf.id,
      staffName: selectedStf.name,
      date: today,
      timeSlot: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      priceKes: selectedSvc.priceKes,
      paymentMethod: posPaymentMethod,
      paymentStatus: 'paid',
      mpesaRef: posPaymentMethod === 'mpesa_till' ? (posMpesaCode.trim() || `RKL${Math.floor(100000 + Math.random() * 900000)}`) : undefined,
      notes: 'POS Walk-in checkout',
      createdAt: new Date().toISOString(),
      isDemo: true,
    };

    updateAppointmentStatus(newApt.id, 'completed', newApt.mpesaRef);
    // Add to storage
    const stored = JSON.parse(localStorage.getItem('salonflow_appointments_v1') || '[]');
    localStorage.setItem('salonflow_appointments_v1', JSON.stringify([newApt, ...stored]));
    
    onRefreshData();
    setActiveReceipt(newApt);
    setPosCustomerName('');
    setPosMpesaCode('');
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Top Banner & Title Bar */}
      <div className="bg-[#18181B] text-[#FAF8F5] border-b border-[#27272A] px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#C5A880] flex items-center gap-2">
              <span>{CURRENT_TENANT.name}</span>
              <span aria-hidden="true">·</span>
              <span>Kutus Branch Executive Portal</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Operations & Revenue Console
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefreshData}
              className="px-3.5 py-2 text-xs font-semibold bg-[#27272A] hover:bg-[#3F3F46] text-white rounded transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync State</span>
            </button>
            <button
              onClick={() => setActiveTab('pos')}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New POS Sale</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {/* KPI Metric Strip (Tabular Figures) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="bg-white border border-[#E8E2D9] rounded-lg p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A] flex items-center justify-between">
              <span>Total Revenue</span>
              <DollarSign className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#18181B] mt-2 tabular-nums">
              KES {totalRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#71717A] mt-1 flex items-center gap-1">
              <span className="text-[#10B981] font-semibold">Today's settlements</span>
              <span>· M-Pesa Till & Cash</span>
            </div>
          </div>

          <div className="bg-white border border-[#E8E2D9] rounded-lg p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A] flex items-center justify-between">
              <span>Appointments</span>
              <Calendar className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#18181B] mt-2 tabular-nums">
              {appointments.length}
            </div>
            <div className="text-[11px] text-[#71717A] mt-1">
              {scheduledCount} scheduled · {inChairCount} in chair
            </div>
          </div>

          <div className="bg-white border border-[#E8E2D9] rounded-lg p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A] flex items-center justify-between">
              <span>Commission Accrued</span>
              <Users className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#18181B] mt-2 tabular-nums">
              KES {totalCommissions.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#71717A] mt-1">
              Across 4 active master stylists
            </div>
          </div>

          <div className="bg-white border border-[#E8E2D9] rounded-lg p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A] flex items-center justify-between">
              <span>Retail Stock Health</span>
              <Package className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#18181B] mt-2 tabular-nums">
              {inventory.reduce((acc, i) => acc + i.quantity, 0)} Units
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-1">
              {inventory.filter(i => i.quantity <= i.minThreshold).length} items below restock threshold
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls (Interactive Segmented Bar) */}
        <div className="flex items-center gap-2 border-b border-[#E8E2D9] pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
              activeTab === 'appointments'
                ? 'bg-[#18181B] text-white'
                : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#E8E2D9]'
            }`}
          >
            Live Chairs & Bookings ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('pos')}
            className={`px-4 py-2 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
              activeTab === 'pos'
                ? 'bg-[#18181B] text-white'
                : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#E8E2D9]'
            }`}
          >
            M-Pesa POS & Checkout
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
              activeTab === 'staff'
                ? 'bg-[#18181B] text-white'
                : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#E8E2D9]'
            }`}
          >
            Stylist Commissions ({staff.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-[#18181B] text-white'
                : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#E8E2D9]'
            }`}
          >
            Retail Inventory ({inventory.length})
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-2 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
              activeTab === 'supabase'
                ? 'bg-[#18181B] text-white'
                : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#E8E2D9]'
            }`}
          >
            Supabase DB Architecture ($400 Package)
          </button>
        </div>

        {/* TAB 1: Appointments Table & Management */}
        {activeTab === 'appointments' && (
          <div className="bg-white border border-[#E8E2D9] rounded-lg overflow-hidden shadow-xs space-y-4">
            <div className="p-4 border-b border-[#E8E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['all', 'scheduled', 'in_chair', 'completed', 'cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 text-xs font-medium rounded capitalize whitespace-nowrap ${
                      statusFilter === st
                        ? 'bg-[#FAF8F5] text-[#18181B] font-bold border border-[#D9D2C7]'
                        : 'text-[#71717A] hover:text-[#18181B]'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter name, ref, phone..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded pl-8 pr-3 py-1.5 text-xs text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-[#71717A] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Ref Code</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Treatment</th>
                    <th className="py-3 px-4">Artisan</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4 text-right">Fee (KES)</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D9]">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-[#71717A]">
                        No appointments match this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map(apt => (
                      <tr key={apt.id} className="hover:bg-[#FDFBF7] transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-[#18181B]">
                          {apt.bookingRef}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#18181B]">{apt.customerName}</div>
                          <div className="text-[11px] text-[#71717A] font-mono">{apt.customerPhone}</div>
                        </td>
                        <td className="py-3 px-4 text-[#52525B]">
                          {apt.serviceName}
                        </td>
                        <td className="py-3 px-4 text-[#52525B]">
                          {apt.staffName}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#71717A]">
                          {apt.date} · {apt.timeSlot}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#18181B] tabular-nums">
                          KES {apt.priceKes.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="capitalize font-medium text-[#18181B]">
                            {apt.paymentMethod.replace('_', ' ')}
                          </div>
                          {apt.mpesaRef ? (
                            <span className="text-[10px] font-mono text-[#10B981] font-semibold">
                              {apt.mpesaRef}
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-700">
                              {apt.paymentStatus}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold text-[11px] capitalize ${
                              apt.status === 'in_chair'
                                ? 'text-amber-800'
                                : apt.status === 'completed'
                                ? 'text-emerald-800'
                                : apt.status === 'cancelled'
                                ? 'text-rose-800'
                                : 'text-[#9A7B50]'
                            }`}
                          >
                            {apt.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {apt.status === 'scheduled' && (
                              <button
                                onClick={() => handleUpdateStatus(apt.id, 'in_chair')}
                                className="px-2.5 py-1 text-[11px] font-medium bg-[#F3EFEA] hover:bg-[#E8E2D9] text-[#18181B] rounded"
                              >
                                Seat in Chair
                              </button>
                            )}
                            {apt.status === 'in_chair' && (
                              <button
                                onClick={() => {
                                  const mockMpesa = `RKL${Math.floor(100000 + Math.random() * 900000)}`;
                                  handleUpdateStatus(apt.id, 'completed', mockMpesa);
                                }}
                                className="px-2.5 py-1 text-[11px] font-medium bg-[#10B981] hover:bg-[#059669] text-white rounded"
                              >
                                Complete & Settle
                              </button>
                            )}
                            {apt.status === 'completed' && (
                              <button
                                onClick={() => setActiveReceipt(apt)}
                                className="px-2 py-1 text-[11px] text-[#71717A] hover:text-[#18181B] flex items-center gap-1"
                              >
                                <Printer className="w-3 h-3" />
                                Receipt
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Point of Sale & Checkout */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white border border-[#E8E2D9] rounded-lg p-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9] mb-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#18181B]">
                    Walk-in Client Point of Sale
                  </h3>
                  <p className="text-xs text-[#71717A]">
                    Instant billing for walk-in clients at Kutus reception.
                  </p>
                </div>
                <div className="text-xs font-mono font-semibold text-[#9A7B50]">
                  Till: {CURRENT_TENANT.mpesaTill}
                </div>
              </div>

              <form onSubmit={handleCreatePosSale} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                      Client Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samuel Maina"
                      value={posCustomerName}
                      onChange={e => setPosCustomerName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                      M-Pesa Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+254 7XX XXX XXX"
                      value={posCustomerPhone}
                      onChange={e => setPosCustomerPhone(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#18181B] font-mono focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                      Service Performed *
                    </label>
                    <select
                      value={posServiceId}
                      onChange={e => setPosServiceId(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                    >
                      {services.map(svc => (
                        <option key={svc.id} value={svc.id}>
                          {svc.name} — KES {svc.priceKes.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                      Artisan / Stylist *
                    </label>
                    <select
                      value={posStaffId}
                      onChange={e => setPosStaffId(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                    >
                      {staff.map(st => (
                        <option key={st.id} value={st.id}>
                          {st.name} ({Math.round(st.commissionRate * 100)}% comm.)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'mpesa_till', label: 'M-Pesa Till', sub: CURRENT_TENANT.mpesaTill },
                      { id: 'cash', label: 'Cash', sub: 'Counter Drawer' },
                      { id: 'card', label: 'Card POS', sub: 'PDQ Terminal' },
                    ].map(pm => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPosPaymentMethod(pm.id as any)}
                        className={`p-3 rounded border text-left transition-all ${
                          posPaymentMethod === pm.id
                            ? 'border-[#18181B] bg-white ring-1 ring-[#18181B]'
                            : 'border-[#E8E2D9] bg-[#FAF8F5]'
                        }`}
                      >
                        <div className="font-semibold text-xs text-[#18181B]">{pm.label}</div>
                        <div className="text-[10px] text-[#71717A] mt-0.5">{pm.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {posPaymentMethod === 'mpesa_till' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                      M-Pesa Transaction Code (Optional, or auto-generate)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. RKL492019"
                      value={posMpesaCode}
                      onChange={e => setPosMpesaCode(e.target.value.toUpperCase())}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs font-mono uppercase text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-[#E8E2D9]">
                  <button
                    type="submit"
                    className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-colors shadow-xs"
                  >
                    Complete Checkout & Print Receipt
                  </button>
                </div>
              </form>
            </div>

            {/* Receipt Preview */}
            <div className="lg:col-span-5 bg-white border border-[#E8E2D9] rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="text-center pb-4 border-b border-dashed border-[#D9D2C7] space-y-1">
                  <div className="font-serif font-bold text-xl text-[#18181B]">{CURRENT_TENANT.name}</div>
                  <div className="text-xs text-[#71717A]">{CURRENT_TENANT.address}</div>
                  <div className="text-[11px] text-[#71717A]">Tel: {CURRENT_TENANT.phone}</div>
                  <div className="text-[11px] font-mono font-semibold text-[#9A7B50]">
                    Lipa Na M-Pesa Till: {CURRENT_TENANT.mpesaTill}
                  </div>
                </div>

                {activeReceipt ? (
                  <div className="py-4 space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#71717A]">Receipt Ref:</span>
                      <span className="font-mono font-bold text-[#18181B]">{activeReceipt.bookingRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#71717A]">Date:</span>
                      <span className="font-mono text-[#18181B]">{activeReceipt.date} · {activeReceipt.timeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#71717A]">Client:</span>
                      <span className="font-semibold text-[#18181B]">{activeReceipt.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#71717A]">Served By:</span>
                      <span className="text-[#18181B]">{activeReceipt.staffName}</span>
                    </div>

                    <div className="pt-3 border-t border-dashed border-[#D9D2C7] space-y-1.5">
                      <div className="flex justify-between font-semibold text-[#18181B]">
                        <span>{activeReceipt.serviceName}</span>
                        <span className="font-mono tabular-nums">KES {activeReceipt.priceKes.toLocaleString()}</span>
                      </div>
                      {activeReceipt.mpesaRef && (
                        <div className="flex justify-between text-[11px] text-[#10B981] font-mono">
                          <span>M-Pesa Code:</span>
                          <span>{activeReceipt.mpesaRef}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t-2 border-[#18181B] flex justify-between font-bold text-sm text-[#18181B]">
                      <span>TOTAL PAID:</span>
                      <span className="font-mono tabular-nums">KES {activeReceipt.priceKes.toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-[#71717A] text-xs">
                    Complete a sale on the left or select "Receipt" on any completed booking to render printable thermal receipt.
                  </div>
                )}
              </div>

              {activeReceipt && (
                <div className="pt-4 border-t border-[#E8E2D9] flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-2 text-xs font-semibold bg-[#18181B] text-white rounded hover:bg-[#27272A] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Thermal Receipt</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Staff Commissions */}
        {activeTab === 'staff' && (
          <div className="bg-white border border-[#E8E2D9] rounded-lg overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#E8E2D9] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#18181B]">
                  Stylist & Barber Commission Ledger
                </h3>
                <p className="text-xs text-[#71717A]">
                  Automatic payout calculations based on completed client services.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#71717A] block">Total Commission Payable</span>
                <span className="font-mono text-lg font-bold text-[#18181B] tabular-nums">
                  KES {totalCommissions.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-[#71717A] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Artisan</th>
                    <th className="py-3 px-4">Title / Role</th>
                    <th className="py-3 px-4 text-center">Completed Jobs</th>
                    <th className="py-3 px-4 text-right">Gross Sales (KES)</th>
                    <th className="py-3 px-4 text-center">Comm. Rate</th>
                    <th className="py-3 px-4 text-right font-bold text-[#18181B]">Commission Owed</th>
                    <th className="py-3 px-4 text-center">Today's Chair Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D9]">
                  {staffCommissions.map(member => (
                    <tr key={member.id} className="hover:bg-[#FDFBF7]">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-full object-cover border border-[#D9D2C7]"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-[#18181B]">{member.name}</div>
                            <div className="text-[11px] text-[#71717A] font-mono">{member.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#52525B]">{member.role}</td>
                      <td className="py-3 px-4 text-center font-mono font-medium">{member.completedJobs}</td>
                      <td className="py-3 px-4 text-right font-mono font-medium tabular-nums">
                        KES {member.grossSalesKes.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-medium">
                        {Math.round(member.commissionRate * 100)}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#10B981] tabular-nums">
                        KES {member.commissionEarnedKes.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-emerald-800 font-semibold text-[11px]">
                          Active On Shift
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Retail Inventory */}
        {activeTab === 'inventory' && (
          <div className="bg-white border border-[#E8E2D9] rounded-lg overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#E8E2D9] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#18181B]">
                  Beauty & Grooming Product Inventory
                </h3>
                <p className="text-xs text-[#71717A]">
                  Track professional backbar salon treatments and retail shelf products.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-[#71717A] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Brand & Category</th>
                    <th className="py-3 px-4 text-center">Current Stock</th>
                    <th className="py-3 px-4 text-right">Cost (KES)</th>
                    <th className="py-3 px-4 text-right">Retail (KES)</th>
                    <th className="py-3 px-4 text-center">Stock Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D9]">
                  {inventory.map(item => {
                    const isLow = item.quantity <= item.minThreshold;
                    return (
                      <tr key={item.id} className="hover:bg-[#FDFBF7]">
                        <td className="py-3 px-4 font-semibold text-[#18181B]">
                          {item.name}
                        </td>
                        <td className="py-3 px-4 text-[#52525B]">
                          {item.brand} · {item.category}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded ${
                              isLow ? 'bg-amber-100 text-amber-900' : 'text-[#18181B]'
                            }`}
                          >
                            {item.quantity} {item.unit}
                          </span>
                          {isLow && (
                            <span className="block text-[10px] text-amber-800 font-semibold mt-0.5">
                              Low stock (&lt; {item.minThreshold})
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums">
                          KES {item.costPriceKes.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#18181B] tabular-nums">
                          KES {item.retailPriceKes.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1 border border-[#D9D2C7] rounded">
                            <button
                              onClick={() => {
                                updateInventoryQuantity(item.id, -1);
                                onRefreshData();
                              }}
                              className="px-2 py-0.5 text-xs font-bold hover:bg-[#E8E2D9]"
                            >
                              -
                            </button>
                            <span className="px-2 font-mono">{item.quantity}</span>
                            <button
                              onClick={() => {
                                updateInventoryQuantity(item.id, 1);
                                onRefreshData();
                              }}
                              className="px-2 py-0.5 text-xs font-bold hover:bg-[#E8E2D9]"
                            >
                              +
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: Supabase Architecture & Deployment Spec */}
        {activeTab === 'supabase' && (
          <div className="bg-white border border-[#E8E2D9] rounded-lg p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#9A7B50] font-semibold">
                  Commercial Product Engineering ($400 Package)
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#18181B]">
                  Supabase Production Database DDL Migration
                </h3>
                <p className="text-xs text-[#71717A] mt-1 max-w-2xl">
                  SalonFlow Kenya is engineered with an isolated multi-tenant PostgreSQL schema. When ready to sell or deploy to a live salon client, execute this SQL script in their Supabase console.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySql}
                  className="px-4 py-2 text-xs font-semibold bg-[#18181B] hover:bg-[#27272A] text-white rounded transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{copiedSql ? 'Copied SQL!' : 'Copy DDL Migration'}</span>
                </button>
                <button
                  onClick={onOpenCommercialModal}
                  className="px-4 py-2 text-xs font-semibold bg-[#C5A880] hover:bg-[#B89758] text-[#18181B] rounded transition-colors shrink-0"
                >
                  View $400 Scope
                </button>
              </div>
            </div>

            {/* Code Block */}
            <div className="relative">
              <pre className="p-4 bg-[#18181B] text-[#E4E4E7] rounded-lg text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
