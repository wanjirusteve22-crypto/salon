import React, { useState } from 'react';
import { 
  Appointment, 
  CustomerRecord, 
  InventoryItem, 
  SalonTenant, 
  Service, 
  StaffMember, 
  WorkScheduleDay 
} from '../types';
import { 
  SUPABASE_SQL_SCHEMA, 
  updateAppointmentStatus, 
  updateInventoryQuantity,
  saveStoredServices,
  saveStoredStaff,
  saveStoredTenant,
  saveCustomer,
  getStoredExpenses,
  getStoredInventoryMovements,
  generateDailyBrief,
  exportToCsv
} from '../services/dataStorage';
import { backendService, RecordedSaleRecord } from '../services/backendService';
import { 
  isSupabaseConfigured, 
  testSupabaseConnection, 
  ConnectionTestResult, 
  DEFAULT_BUSINESS_SLUG,
  getSupabaseConfigErrors 
} from '../services/supabaseClient';
import { DailyBriefSection } from './DailyBriefSection';
import { ExpensesAndProfitTab } from './ExpensesAndProfitTab';
import { InventoryIntelligenceTab } from './InventoryIntelligenceTab';
import { MessagingAutomationTab } from './MessagingAutomationTab';
import { 
  DollarSign, Calendar, Scissors, Users, Package, CheckCircle2, 
  Clock, AlertTriangle, Plus, Printer, Download, Search, Check, 
  ExternalLink, Copy, RefreshCw, Smartphone, Edit2, Trash2, 
  Save, Phone, Mail, UserCheck, Shield, TrendingUp, BarChart3, Store, Database
} from 'lucide-react';

interface OwnerDashboardProps {
  tenant: SalonTenant;
  appointments: Appointment[];
  services: Service[];
  staff: StaffMember[];
  inventory: InventoryItem[];
  customers: CustomerRecord[];
  onRefreshData: () => void;
  onOpenCommercialModal: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  tenant,
  appointments,
  services,
  staff,
  inventory,
  customers,
  onRefreshData,
  onOpenCommercialModal,
}) => {
  const [activeTab, setActiveTab] = useState<
    'brief' | 'appointments' | 'pos' | 'sales' | 'expenses' | 'inventory' | 'automations' | 'services' | 'staff' | 'customers' | 'profile' | 'supabase'
  >('brief');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const expenses = getStoredExpenses();
  const movements = getStoredInventoryMovements();
  const dailyBrief = generateDailyBrief(appointments, customers, inventory);

  // Service Management state
  const [isAddingService, setIsAddingService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<Service['category']>('Braiding & Locs');
  const [newServicePrice, setNewServicePrice] = useState<number>(2000);
  const [newServiceDuration, setNewServiceDuration] = useState<number>(60);
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // Editing service state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDuration, setEditDuration] = useState<number>(0);

  // Business Profile state
  const [profileName, setProfileName] = useState(tenant.name);
  const [profileTagline, setProfileTagline] = useState(tenant.tagline);
  const [profileAddress, setProfileAddress] = useState(tenant.address);
  const [profileLandmark, setProfileLandmark] = useState(tenant.landmark);
  const [profilePhone, setProfilePhone] = useState(tenant.phone);
  const [profileEmail, setProfileEmail] = useState(tenant.email);
  const [profileTill, setProfileTill] = useState(tenant.mpesaTill);
  const [profilePaybill, setProfilePaybill] = useState(tenant.mpesaPaybill);
  const [profileWeekdays, setProfileWeekdays] = useState(tenant.openingHours.weekdays);
  const [profileSaturday, setProfileSaturday] = useState(tenant.openingHours.saturday);
  const [profileSunday, setProfileSunday] = useState(tenant.openingHours.sunday);
  const [profileSavedFeedback, setProfileSavedFeedback] = useState(false);

  // Customer search
  const [customerSearch, setCustomerSearch] = useState('');

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
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<ConnectionTestResult | null>(null);

  const handleTestSupabase = async () => {
    setIsTestingSupabase(true);
    try {
      const res = await testSupabaseConnection();
      setSupabaseTestResult(res);
    } catch (err: any) {
      setSupabaseTestResult({
        success: false,
        message: 'Connection test failed',
        details: err?.message,
        businessSlug: DEFAULT_BUSINESS_SLUG,
      });
    } finally {
      setIsTestingSupabase(false);
    }
  };

  // Real backend calculations
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === today);

  const {
    totalSalesKes,
    totalCommissionsKes,
    netBusinessKes,
    salesRecords
  } = backendService.calculateSalesLedger(appointments, staff);

  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const inChairCount = appointments.filter(a => a.status === 'in_chair').length;
  const scheduledCount = appointments.filter(a => a.status === 'scheduled').length;

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
    const stored = JSON.parse(localStorage.getItem('salonflow_appointments_v2') || '[]');
    localStorage.setItem('salonflow_appointments_v2', JSON.stringify([newApt, ...stored]));
    
    onRefreshData();
    setActiveReceipt(newApt);
    setPosCustomerName('');
    setPosMpesaCode('');
  };

  // Add new service
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const newSvc: Service = {
      id: `srv-${Date.now()}`,
      name: newServiceName.trim(),
      category: newServiceCategory,
      priceKes: Number(newServicePrice),
      durationMin: Number(newServiceDuration),
      description: newServiceDesc.trim() || 'Custom salon service performed by master artisan.',
      isActive: true,
    };

    const updated = [newSvc, ...services];
    saveStoredServices(updated);
    onRefreshData();
    setIsAddingService(false);
    setNewServiceName('');
    setNewServiceDesc('');
  };

  // Start editing a service
  const handleStartEditService = (svc: Service) => {
    setEditingServiceId(svc.id);
    setEditPrice(svc.priceKes);
    setEditDuration(svc.durationMin);
  };

  // Save edited service
  const handleSaveEditService = (id: string) => {
    const updated = services.map(s => {
      if (s.id === id) {
        return {
          ...s,
          priceKes: Number(editPrice),
          durationMin: Number(editDuration),
        };
      }
      return s;
    });
    saveStoredServices(updated);
    setEditingServiceId(null);
    onRefreshData();
  };

  // Toggle staff day schedule
  const handleToggleStaffDay = (staffId: string, dayIndex: number) => {
    const updatedStaff = staff.map(st => {
      if (st.id === staffId && st.schedule) {
        const newSched = [...st.schedule];
        newSched[dayIndex] = {
          ...newSched[dayIndex],
          isWorking: !newSched[dayIndex].isWorking,
        };
        return { ...st, schedule: newSched };
      }
      return st;
    });
    saveStoredStaff(updatedStaff);
    onRefreshData();
  };

  // Save profile settings
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTenant: SalonTenant = {
      ...tenant,
      name: profileName,
      tagline: profileTagline,
      address: profileAddress,
      landmark: profileLandmark,
      phone: profilePhone,
      email: profileEmail,
      mpesaTill: profileTill,
      mpesaPaybill: profilePaybill,
      openingHours: {
        weekdays: profileWeekdays,
        saturday: profileSaturday,
        sunday: profileSunday,
      },
    };
    saveStoredTenant(updatedTenant);
    onRefreshData();
    setProfileSavedFeedback(true);
    setTimeout(() => setProfileSavedFeedback(false), 3000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Weekly Sales breakdown
  const weeklyDays = [
    { day: 'Mon', revenueKes: 14200, count: 6 },
    { day: 'Tue', revenueKes: 11800, count: 5 },
    { day: 'Wed', revenueKes: 18400, count: 8 },
    { day: 'Thu', revenueKes: 16500, count: 7 },
    { day: 'Fri', revenueKes: 24200, count: 11 },
    { day: 'Sat', revenueKes: 38600, count: 17 },
    { day: 'Sun', revenueKes: 12400, count: 4 },
  ];
  const weeklyTotalKes = weeklyDays.reduce((acc, d) => acc + d.revenueKes, 0);

  // Filtered Customers
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch) ||
    c.preferredService.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const handleExportAppointmentsCsv = () => {
    const rows = filteredAppointments.map(a => ({
      'Booking Ref': a.bookingRef,
      'Client Name': a.customerName,
      'Phone': a.customerPhone,
      'Treatment': a.serviceName,
      'Artisan': a.staffName,
      'Date': a.date,
      'Time Slot': a.timeSlot,
      'Price (KES)': a.priceKes,
      'Status': a.status,
      'Payment Status': a.paymentStatus,
      'Payment Method': a.paymentMethod,
      'M-Pesa Ref': a.mpesaRef || '',
    }));
    exportToCsv(`salonflow_appointments_${today}`, rows);
  };

  const handleExportSalesCsv = () => {
    const rows = salesRecords.map(s => ({
      'Sale ID': s.id,
      'Customer': s.customerName,
      'Service': s.serviceName,
      'Artisan': s.employeeName,
      'Amount (KES)': s.amountKes,
      'Commission Rate': `${Math.round(s.commissionRate * 100)}%`,
      'Artisan Commission (KES)': s.commissionKes,
      'Net Salon (KES)': s.netBusinessKes,
      'Payment Method': s.paymentMethod,
      'M-Pesa Ref': s.mpesaReference || '',
      'Timestamp': s.timestamp,
    }));
    exportToCsv(`salonflow_sales_ledger_${today}`, rows);
  };

  const handleExportCustomersCsv = () => {
    const rows = filteredCustomers.map(c => ({
      'Name': c.name,
      'Phone': c.phone,
      'Email': c.email || '',
      'Total Visits': c.totalVisits,
      'Lifetime Spend (KES)': c.totalSpentKes,
      'Last Visit Date': c.lastVisitDate,
      'Preferred Artisan': c.preferredArtisan,
      'Preferred Service': c.preferredService,
      'Notes': c.notes,
    }));
    exportToCsv(`salonflow_customers_${today}`, rows);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Top Banner & Title Bar */}
      <div className="bg-[#18181B] text-[#FAF8F5] border-b border-[#27272A] px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#C5A880] flex items-center gap-2">
              <span>{tenant.name}</span>
              <span aria-hidden="true">·</span>
              <span>Owner & Management Console</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Operations & Revenue Command
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefreshData}
              className="px-3.5 py-2 text-xs font-semibold bg-[#27272A] hover:bg-[#3F3F46] text-white rounded transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Local State</span>
            </button>
            <button
              onClick={() => setActiveTab('pos')}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick POS Sale</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {/* KPI Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="bg-white border border-[#E8E2D9] rounded-lg p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A] flex items-center justify-between">
              <span>Today's Bookings</span>
              <Calendar className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#18181B] mt-2 tabular-nums">
              {todayAppointments.length}
            </div>
            <div className="text-[11px] text-[#71717A] mt-1">
              {inChairCount} in chair · {scheduledCount} pending
            </div>
          </div>

          <div className="bg-white border border-[#E8E2D9] rounded-lg p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A] flex items-center justify-between">
              <span>Pending Arrivals</span>
              <Clock className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#18181B] mt-2 tabular-nums">
              {scheduledCount}
            </div>
            <div className="text-[11px] text-[#71717A] mt-1">
              Guaranteed chair reservations
            </div>
          </div>

          <div className="bg-white border border-[#E8E2D9] rounded-lg p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A] flex items-center justify-between">
              <span>Completed Jobs</span>
              <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#18181B] mt-2 tabular-nums">
              {completedCount}
            </div>
            <div className="text-[11px] text-[#10B981] font-semibold mt-1">
              All settled at reception
            </div>
          </div>

          <div className="bg-white border border-[#E8E2D9] rounded-lg p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A] flex items-center justify-between">
              <span>Recorded Sales</span>
              <DollarSign className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#18181B] mt-2 tabular-nums">
              KES {totalSalesKes.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#71717A] mt-1 font-mono">
              Till {tenant.mpesaTill} & Cash
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-1.5 border-b border-[#E8E2D9] pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'brief', label: 'Daily Intelligence Brief' },
            { id: 'appointments', label: `Appointments (${appointments.length})` },
            { id: 'pos', label: 'M-Pesa POS Register' },
            { id: 'sales', label: 'Recorded Sales Ledger' },
            { id: 'expenses', label: 'Expenses & Net Profit' },
            { id: 'inventory', label: `Inventory Intelligence (${inventory.length})` },
            { id: 'automations', label: 'Client Messaging & SMS' },
            { id: 'services', label: `Services & Pricing (${services.length})` },
            { id: 'staff', label: `Staff & Schedules (${staff.length})` },
            { id: 'customers', label: `Customer Directory (${customers.length})` },
            { id: 'profile', label: 'Salon Settings' },
            { id: 'supabase', label: 'Backend & DB' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-2 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === t.id
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#E8E2D9]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 0: Daily Brief */}
        {activeTab === 'brief' && (
          <DailyBriefSection
            brief={dailyBrief}
            tenant={tenant}
            onNavigateTab={t => setActiveTab(t as any)}
            onRefresh={onRefreshData}
          />
        )}

        {/* TAB 1: Appointments List */}
        {activeTab === 'appointments' && (
          <div className="bg-white border border-[#E8E2D9] rounded-lg overflow-hidden shadow-xs space-y-4">
            <div className="p-4 border-b border-[#E8E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['all', 'scheduled', 'in_chair', 'completed', 'cancelled', 'no_show'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 text-xs font-medium rounded capitalize whitespace-nowrap cursor-pointer ${
                      statusFilter === st
                        ? 'bg-[#FAF8F5] text-[#18181B] font-bold border border-[#D9D2C7]'
                        : 'text-[#71717A] hover:text-[#18181B]'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportAppointmentsCsv}
                  className="px-3 py-1.5 text-xs font-semibold bg-[#FAF8F5] border border-[#E8E2D9] hover:border-[#18181B] text-[#18181B] rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <div className="relative w-full sm:w-60">
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
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(apt.id, 'in_chair')}
                                  className="px-2.5 py-1 text-[11px] font-semibold bg-[#0F281E] hover:bg-[#15382B] text-white rounded cursor-pointer"
                                >
                                  Seat Client
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(apt.id, 'no_show')}
                                  className="px-2 py-1 text-[11px] text-zinc-600 hover:text-zinc-900 border border-[#E8E2D9] rounded cursor-pointer"
                                  title="Mark client as no-show"
                                >
                                  No-Show
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                                  className="px-2 py-1 text-[11px] text-rose-700 hover:text-rose-900 cursor-pointer"
                                  title="Cancel appointment"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {apt.status === 'in_chair' && (
                              <button
                                onClick={() => {
                                  const mockMpesa = `RKL${Math.floor(100000 + Math.random() * 900000)}`;
                                  handleUpdateStatus(apt.id, 'completed', mockMpesa);
                                }}
                                className="px-2.5 py-1 text-[11px] font-medium bg-[#10B981] hover:bg-[#059669] text-white rounded cursor-pointer"
                              >
                                Complete & Settle
                              </button>
                            )}
                            {apt.status === 'completed' && (
                              <button
                                onClick={() => setActiveReceipt(apt)}
                                className="px-2 py-1 text-[11px] text-[#71717A] hover:text-[#18181B] flex items-center gap-1 cursor-pointer"
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

        {/* TAB 2: Point of Sale */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white border border-[#E8E2D9] rounded-lg p-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9] mb-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#18181B]">
                    Walk-in Client Point of Sale
                  </h3>
                  <p className="text-xs text-[#71717A]">
                    Instant billing for walk-in clients at Kutus reception desk.
                  </p>
                </div>
                <div className="text-xs font-mono font-semibold text-[#9A7B50]">
                  Till: {tenant.mpesaTill}
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
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs font-mono text-[#18181B] focus:outline-none focus:border-[#C5A880]"
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
                      { id: 'mpesa_till', label: 'M-Pesa Till', sub: tenant.mpesaTill },
                      { id: 'cash', label: 'Cash', sub: 'Counter Drawer' },
                      { id: 'card', label: 'Card POS', sub: 'PDQ Terminal' },
                    ].map(pm => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPosPaymentMethod(pm.id as any)}
                        className={`p-3 rounded border text-left transition-all cursor-pointer ${
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
                    className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-colors shadow-xs cursor-pointer"
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
                  <div className="font-serif font-bold text-xl text-[#18181B]">{tenant.name}</div>
                  <div className="text-xs text-[#71717A]">{tenant.address}</div>
                  <div className="text-[11px] text-[#71717A]">Tel: {tenant.phone}</div>
                  <div className="text-[11px] font-mono font-semibold text-[#9A7B50]">
                    Lipa Na M-Pesa Till: {tenant.mpesaTill}
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
                    className="flex-1 py-2 text-xs font-semibold bg-[#18181B] text-white rounded hover:bg-[#27272A] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Thermal Receipt</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Services & Pricing Management */}
        {activeTab === 'services' && (
          <div className="bg-white border border-[#E8E2D9] rounded-lg p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#18181B]">
                  Service Catalog & Pricing Management
                </h3>
                <p className="text-xs text-[#71717A]">
                  Add new services, update duration, or adjust prices in Kenyan Shillings.
                </p>
              </div>

              <button
                onClick={() => setIsAddingService(!isAddingService)}
                className="px-4 py-2 text-xs font-semibold bg-[#C5A880] hover:bg-[#B89758] text-[#18181B] rounded transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingService ? 'Cancel' : 'Add New Service'}</span>
              </button>
            </div>

            {/* Add Service Form */}
            {isAddingService && (
              <form onSubmit={handleAddService} className="p-5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg space-y-4">
                <div className="font-semibold text-xs text-[#18181B]">
                  Create New Salon Treatment
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Scalp Scrub & Steam"
                      value={newServiceName}
                      onChange={e => setNewServiceName(e.target.value)}
                      className="w-full bg-white border border-[#E8E2D9] rounded px-3 py-1.5 text-xs text-[#18181B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">
                      Category
                    </label>
                    <select
                      value={newServiceCategory}
                      onChange={e => setNewServiceCategory(e.target.value as any)}
                      className="w-full bg-white border border-[#E8E2D9] rounded px-3 py-1.5 text-xs text-[#18181B]"
                    >
                      <option value="Braiding & Locs">Braiding & Locs</option>
                      <option value="Barbering & Grooming">Barbering & Grooming</option>
                      <option value="Hair Styling & Color">Hair Styling & Color</option>
                      <option value="Nails & Spa">Nails & Spa</option>
                      <option value="Facials & Skin">Facials & Skin</option>
                      <option value="Bridal & Packages">Bridal & Packages</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">
                      Price (KES) *
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={newServicePrice}
                      onChange={e => setNewServicePrice(Number(e.target.value))}
                      className="w-full bg-white border border-[#E8E2D9] rounded px-3 py-1.5 text-xs font-mono text-[#18181B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">
                      Duration (Mins)
                    </label>
                    <input
                      type="number"
                      required
                      min={15}
                      step={15}
                      value={newServiceDuration}
                      onChange={e => setNewServiceDuration(Number(e.target.value))}
                      className="w-full bg-white border border-[#E8E2D9] rounded px-3 py-1.5 text-xs font-mono text-[#18181B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of products used or technique..."
                    value={newServiceDesc}
                    onChange={e => setNewServiceDesc(e.target.value)}
                    className="w-full bg-white border border-[#E8E2D9] rounded px-3 py-1.5 text-xs text-[#18181B]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingService(false)}
                    className="px-4 py-1.5 text-xs text-[#71717A]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-1.5 text-xs font-semibold bg-[#18181B] text-white rounded hover:bg-[#27272A]"
                  >
                    Save Service
                  </button>
                </div>
              </form>
            )}

            {/* Services Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-[#71717A] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Treatment Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4 text-right">Price (KES)</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D9]">
                  {services.map(svc => {
                    const isEditing = editingServiceId === svc.id;
                    return (
                      <tr key={svc.id} className="hover:bg-[#FDFBF7]">
                        <td className="py-3 px-4 font-semibold text-[#18181B]">
                          {svc.name}
                        </td>
                        <td className="py-3 px-4 text-[#52525B]">
                          {svc.category}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {isEditing ? (
                            <input
                              type="number"
                              min={15}
                              step={15}
                              value={editDuration}
                              onChange={e => setEditDuration(Number(e.target.value))}
                              className="w-20 px-2 py-0.5 border border-[#C5A880] rounded font-mono text-xs"
                            />
                          ) : (
                            <span>{svc.durationMin} mins</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#18181B] tabular-nums">
                          {isEditing ? (
                            <input
                              type="number"
                              min={100}
                              value={editPrice}
                              onChange={e => setEditPrice(Number(e.target.value))}
                              className="w-24 px-2 py-0.5 border border-[#C5A880] rounded font-mono text-xs text-right"
                            />
                          ) : (
                            <span>KES {svc.priceKes.toLocaleString()}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveEditService(svc.id)}
                              className="px-3 py-1 bg-[#10B981] text-white rounded text-xs font-semibold cursor-pointer"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEditService(svc)}
                              className="px-2.5 py-1 text-[#71717A] hover:text-[#18181B] font-medium flex items-center gap-1 ml-auto cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3 text-[#9A7B50]" />
                              <span>Edit</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Staff & Work Schedules */}
        {activeTab === 'staff' && (
          <div className="bg-white border border-[#E8E2D9] rounded-lg p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#18181B]">
                  Staff Roster & Weekly Work Schedules
                </h3>
                <p className="text-xs text-[#71717A]">
                  Manage artisan shifts, commission splits, and weekly station availability in Kutus.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {staff.map(artisan => (
                <div key={artisan.id} className="p-5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E8E2D9]">
                    <div className="flex items-center gap-3">
                      <img
                        src={artisan.avatar}
                        alt={artisan.name}
                        className="w-12 h-12 rounded-full object-cover border border-[#D9D2C7]"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-bold text-sm text-[#18181B]">{artisan.name}</div>
                        <div className="text-xs text-[#9A7B50] font-medium">{artisan.role}</div>
                        <div className="text-[11px] text-[#71717A] font-mono">{artisan.phone}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-[#71717A]">Commission Rate:</div>
                      <div className="font-mono font-bold text-[#10B981] text-sm">
                        {Math.round(artisan.commissionRate * 100)}% of service fee
                      </div>
                    </div>
                  </div>

                  {/* Work Schedule Day Toggles */}
                  <div>
                    <div className="text-[11px] uppercase font-semibold text-[#71717A] mb-2">
                      Weekly Shift Schedule (Click to toggle on/off duty)
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                      {artisan.schedule?.map((item, idx) => (
                        <button
                          key={item.day}
                          onClick={() => handleToggleStaffDay(artisan.id, idx)}
                          className={`p-2 rounded text-center border transition-all cursor-pointer ${
                            item.isWorking
                              ? 'bg-white border-[#18181B] shadow-xs'
                              : 'bg-[#F3EFEA] border-dashed border-[#D9D2C7] opacity-60'
                          }`}
                        >
                          <div className="font-bold text-[11px] text-[#18181B]">{item.day.slice(0, 3)}</div>
                          <div className={`text-[10px] font-semibold mt-1 ${item.isWorking ? 'text-emerald-700' : 'text-zinc-500'}`}>
                            {item.isWorking ? 'On Duty' : 'Day Off'}
                          </div>
                          {item.isWorking && (
                            <div className="text-[9px] font-mono text-[#71717A] mt-0.5">
                              {item.startTime}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Customer Directory */}
        {activeTab === 'customers' && (
          <div className="bg-white border border-[#E8E2D9] rounded-lg p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#18181B]">
                  Client Directory & Loyalty Records
                </h3>
                <p className="text-xs text-[#71717A]">
                  Track client visit frequency, lifetime spend, and personal styling preferences.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCustomersCsv}
                  className="px-3 py-1.5 text-xs font-semibold bg-[#FAF8F5] border border-[#E8E2D9] hover:border-[#18181B] text-[#18181B] rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search client by name, phone..."
                    value={customerSearch}
                    onChange={e => setCustomerSearch(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded pl-8 pr-3 py-1.5 text-xs text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-[#71717A] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4 text-center">Total Visits</th>
                    <th className="py-3 px-4 text-right">Lifetime Spend</th>
                    <th className="py-3 px-4">Preferred Artisan</th>
                    <th className="py-3 px-4">Styling / Scalp Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D9]">
                  {filteredCustomers.map(client => (
                    <tr key={client.id} className="hover:bg-[#FDFBF7]">
                      <td className="py-3 px-4 font-bold text-[#18181B]">
                        {client.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#52525B]">
                        {client.phone}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-medium">
                        {client.totalVisits} visits
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#10B981] tabular-nums">
                        KES {client.totalSpentKes.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-[#52525B]">
                        {client.preferredArtisan}
                      </td>
                      <td className="py-3 px-4 text-xs text-[#71717A] italic">
                        "{client.notes}"
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: Daily & Weekly Sales Summaries */}
        {activeTab === 'sales' && (
          <div className="bg-white border border-[#E8E2D9] rounded-lg p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#18181B]">
                  Recorded Sales & Commission Ledger
                </h3>
                <p className="text-xs text-[#71717A]">
                  Real-time sales calculated from completed salon services and settled M-Pesa transactions according to documented accounting rules.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportSalesCsv}
                  className="px-3.5 py-2 text-xs font-semibold bg-[#FAF8F5] border border-[#E8E2D9] hover:border-[#18181B] text-[#18181B] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Sales CSV</span>
                </button>
                <div className="text-right">
                  <span className="text-xs text-[#71717A] block">Gross Recorded Sales</span>
                  <span className="font-mono text-xl font-bold text-[#10B981] tabular-nums">
                    KES {totalSalesKes.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Documented Rule Callout */}
            <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg text-xs space-y-1">
              <div className="font-semibold text-[#18181B] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
                <span>Documented Accounting & Commission Rule</span>
              </div>
              <p className="text-[#52525B] leading-relaxed">
                Sales are recognized only when a chair appointment transitions to <strong>Completed</strong> and payment is confirmed via Safaricom Till {tenant.mpesaTill}, Paybill, or Counter Cash.
                Stylist commissions are automatically deducted per artisan contract: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#E8E2D9]">Commission = Amount (KES) × Rate</code>, and <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#E8E2D9]">Net Business = Amount - Commission</code>.
              </p>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#FDFBF7] border border-[#E8E2D9] rounded-lg">
                <span className="text-xs text-[#71717A] block">Gross Recognized Sales</span>
                <span className="font-mono text-xl font-bold text-[#18181B] mt-1 block tabular-nums">
                  KES {totalSalesKes.toLocaleString()}
                </span>
                <span className="text-[11px] text-[#71717A] mt-0.5 block font-mono">
                  From {salesRecords.length} completed treatments
                </span>
              </div>

              <div className="p-4 bg-[#FDFBF7] border border-[#E8E2D9] rounded-lg">
                <span className="text-xs text-[#71717A] block">Artisan Commissions Payable</span>
                <span className="font-mono text-xl font-bold text-amber-700 mt-1 block tabular-nums">
                  KES {totalCommissionsKes.toLocaleString()}
                </span>
                <span className="text-[11px] text-[#71717A] mt-0.5 block">
                  Earned by 4 master stylists
                </span>
              </div>

              <div className="p-4 bg-[#FDFBF7] border border-[#E8E2D9] rounded-lg">
                <span className="text-xs text-[#71717A] block">Net Business Retained</span>
                <span className="font-mono text-xl font-bold text-[#10B981] mt-1 block tabular-nums">
                  KES {netBusinessKes.toLocaleString()}
                </span>
                <span className="text-[11px] text-[#10B981] mt-0.5 block font-mono">
                  {totalSalesKes > 0 ? Math.round((netBusinessKes / totalSalesKes) * 100) : 0}% net salon margin
                </span>
              </div>
            </div>

            {/* Itemized Sales Ledger Table */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#18181B]">
                  Itemized Recorded Sales Ledger
                </div>
                <span className="text-xs font-mono text-[#71717A]">{salesRecords.length} transactions</span>
              </div>

              <div className="overflow-x-auto border border-[#E8E2D9] rounded-lg">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-[#71717A] uppercase tracking-wider font-semibold">
                      <th className="py-2.5 px-3">Treatment</th>
                      <th className="py-2.5 px-3">Client</th>
                      <th className="py-2.5 px-3">Artisan</th>
                      <th className="py-2.5 px-3 text-right">Gross (KES)</th>
                      <th className="py-2.5 px-3 text-right">Commission</th>
                      <th className="py-2.5 px-3 text-right font-bold text-[#10B981]">Net Salon</th>
                      <th className="py-2.5 px-3">M-Pesa / Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E2D9] bg-white">
                    {salesRecords.map(sale => (
                      <tr key={sale.id} className="hover:bg-[#FDFBF7]">
                        <td className="py-2.5 px-3 font-semibold text-[#18181B]">
                          {sale.serviceName}
                        </td>
                        <td className="py-2.5 px-3 text-[#52525B]">
                          {sale.customerName}
                        </td>
                        <td className="py-2.5 px-3 text-[#52525B]">
                          {sale.employeeName.split(' ')[0]} ({Math.round(sale.commissionRate * 100)}%)
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#18181B]">
                          KES {sale.amountKes.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-amber-700">
                          KES {sale.commissionKes.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-[#10B981] tabular-nums">
                          KES {sale.netBusinessKes.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="capitalize font-mono text-[11px] text-[#18181B]">
                            {sale.paymentMethod.replace('_', ' ')}
                          </span>
                          {sale.mpesaReference && (
                            <span className="block font-mono text-[10px] text-[#10B981] font-semibold">
                              {sale.mpesaReference}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Weekly Bar Chart Distribution */}
            <div className="space-y-3 pt-4 border-t border-[#E8E2D9]">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A]">
                Weekly Revenue Cadence (Monday – Sunday)
              </div>
              <div className="grid grid-cols-7 gap-3">
                {weeklyDays.map(item => {
                  const heightPercent = Math.round((item.revenueKes / 40000) * 100);
                  return (
                    <div key={item.day} className="flex flex-col items-center gap-2">
                      <div className="h-32 w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded flex items-end p-1.5">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-[#C5A880] hover:bg-[#B89758] rounded-xs transition-all relative group"
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#18181B] text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono z-10">
                            KES {item.revenueKes.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-xs text-[#18181B]">{item.day}</div>
                        <div className="text-[10px] font-mono text-[#71717A]">
                          KES {(item.revenueKes / 1000).toFixed(1)}k
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Expenses & Net Operating Profit */}
        {activeTab === 'expenses' && (
          <ExpensesAndProfitTab
            expenses={expenses}
            totalGrossSalesKes={totalSalesKes}
            totalCommissionsKes={totalCommissionsKes}
            onRefresh={onRefreshData}
          />
        )}

        {/* TAB: Inventory Intelligence */}
        {activeTab === 'inventory' && (
          <InventoryIntelligenceTab
            inventory={inventory}
            movements={movements}
            onRefresh={onRefreshData}
          />
        )}

        {/* TAB: Client Messaging & Automations */}
        {activeTab === 'automations' && (
          <MessagingAutomationTab
            tenant={tenant}
          />
        )}

        {/* TAB 7: Business Profile & Operating Hours */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-[#E8E2D9] rounded-lg p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#18181B]">
                  Salon Profile & Operating Hours
                </h3>
                <p className="text-xs text-[#71717A]">
                  Update physical address, M-Pesa business till number, and salon opening hours.
                </p>
              </div>

              {profileSavedFeedback && (
                <div className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Salon profile updated successfully!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                    Salon Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={profileTagline}
                    onChange={e => setProfileTagline(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                    Physical Address
                  </label>
                  <input
                    type="text"
                    value={profileAddress}
                    onChange={e => setProfileAddress(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                    Landmark / Proximity
                  </label>
                  <input
                    type="text"
                    value={profileLandmark}
                    onChange={e => setProfileLandmark(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs font-mono text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={e => setProfileEmail(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                    M-Pesa Till Number
                  </label>
                  <input
                    type="text"
                    value={profileTill}
                    onChange={e => setProfileTill(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs font-mono font-bold text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#18181B] mb-1">
                    Paybill (Optional)
                  </label>
                  <input
                    type="text"
                    value={profilePaybill}
                    onChange={e => setProfilePaybill(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs font-mono text-[#18181B] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              {/* Operating Hours */}
              <div className="pt-4 border-t border-[#E8E2D9] space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#18181B]">
                  Operating Hours Configuration
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-[#71717A] mb-1">Monday – Friday</label>
                    <input
                      type="text"
                      value={profileWeekdays}
                      onChange={e => setProfileWeekdays(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#18181B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#71717A] mb-1">Saturday</label>
                    <input
                      type="text"
                      value={profileSaturday}
                      onChange={e => setProfileSaturday(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#18181B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#71717A] mb-1">Sunday</label>
                    <input
                      type="text"
                      value={profileSunday}
                      onChange={e => setProfileSunday(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#18181B]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E2D9] flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Updates</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 8: Supabase Architecture */}
        {activeTab === 'supabase' && (
          <div className="bg-white border border-[#E8E2D9] rounded-lg p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#9A7B50] font-semibold">
                    Backend Architecture & Multi-Tenant Engine
                  </span>
                  {isSupabaseConfigured() ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      Supabase PostgreSQL Connected
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-900 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                      Local Storage Engine Active (Demo Mode)
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#18181B]">
                  Supabase PostgreSQL Schema & Security Policies
                </h3>
                <p className="text-xs text-[#71717A] mt-1 max-w-2xl">
                  Enforces strict Row Level Security (RLS) and tenant isolation for multi-business operations. When ready to sell or deploy to a live salon client in Kirinyaga, execute this SQL script in their Supabase console.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleTestSupabase}
                  disabled={isTestingSupabase}
                  className="px-4 py-2 text-xs font-semibold bg-[#C5A880] hover:bg-[#B89758] text-[#18181B] rounded transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {isTestingSupabase ? (
                    <>
                      <span className="w-3 h-3 border-2 border-[#18181B] border-t-transparent rounded-full animate-spin"></span>
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-3.5 h-3.5 text-[#18181B]" />
                      <span>Test Live Connection</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleCopySql}
                  className="px-4 py-2 text-xs font-semibold bg-[#18181B] hover:bg-[#27272A] text-white rounded transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{copiedSql ? 'Copied SQL!' : 'Copy DDL Migration'}</span>
                </button>
                <button
                  onClick={onOpenCommercialModal}
                  className="px-4 py-2 text-xs font-semibold border border-[#C5A880] text-[#9A7B50] hover:bg-[#FAF8F5] rounded transition-colors shrink-0 cursor-pointer"
                >
                  View $400 Scope
                </button>
              </div>
            </div>

            {/* Live Connection Test Results Banner */}
            {supabaseTestResult && (
              <div
                className={`p-4 rounded-lg border text-xs space-y-1.5 ${
                  supabaseTestResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-2">
                    {supabaseTestResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    )}
                    <span className="text-sm">{supabaseTestResult.message}</span>
                  </div>
                  {supabaseTestResult.latencyMs !== undefined && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/70 border border-current/20">
                      {supabaseTestResult.latencyMs}ms ping
                    </span>
                  )}
                </div>
                {supabaseTestResult.details && (
                  <p className="text-xs font-mono opacity-90 leading-relaxed pl-6">
                    {supabaseTestResult.details}
                  </p>
                )}
                <div className="text-[11px] text-zinc-500 pl-6 pt-1">
                  Active tenant slug: <code className="font-mono font-semibold">{supabaseTestResult.businessSlug || DEFAULT_BUSINESS_SLUG}</code>
                </div>
              </div>
            )}

            {/* Step-by-Step Production Deployment Guide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg space-y-1.5">
                <div className="font-bold text-[#18181B] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#18181B] text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Create Supabase Project</span>
                </div>
                <p className="text-[#52525B] leading-relaxed">
                  Sign in to Supabase and create a project in the EU (Frankfurt / London) or nearest cloud region for low latency to Kenya.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg space-y-1.5">
                <div className="font-bold text-[#18181B] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#18181B] text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Run SQL Migration</span>
                </div>
                <p className="text-[#52525B] leading-relaxed">
                  Open the Supabase SQL Editor, paste the DDL script below, and click Run. This creates tables, RLS policies, conflict triggers, and initial seed data.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg space-y-1.5">
                <div className="font-bold text-[#18181B] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#18181B] text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Configure Vercel / .env</span>
                </div>
                <p className="text-[#52525B] leading-relaxed">
                  Add <code className="bg-white px-1 py-0.5 rounded border border-[#E8E2D9] font-mono">VITE_SUPABASE_URL</code> and <code className="bg-white px-1 py-0.5 rounded border border-[#E8E2D9] font-mono">VITE_SUPABASE_ANON_KEY</code>. Never expose the service-role key.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#18181B] uppercase tracking-wider">
                  PostgreSQL DDL Migration File (/supabase/migrations/20261022_initial_schema.sql)
                </span>
                <span className="text-[#71717A] font-mono">UUIDs · FKs · Triggers · Multi-Tenant RLS</span>
              </div>
              <div className="relative">
                <pre className="p-4 bg-[#18181B] text-[#E4E4E7] rounded-lg text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
