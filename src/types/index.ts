export type ServiceCategory = 
  | 'All' 
  | 'Braiding & Locs' 
  | 'Barbering & Grooming' 
  | 'Hair Styling & Color' 
  | 'Nails & Spa' 
  | 'Facials & Skin' 
  | 'Bridal & Packages';

export interface Service {
  id: string;
  name: string;
  category: Exclude<ServiceCategory, 'All'>;
  priceKes: number;
  durationMin: number;
  description: string;
  image?: string;
  popular?: boolean;
  highlights?: string[];
  isActive?: boolean;
}

export interface WorkScheduleDay {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isWorking: boolean;
  startTime: string;
  endTime: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  title: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  specialties: string[];
  commissionRate: number; // e.g. 0.35 for 35%
  phone: string;
  bio: string;
  isAvailableToday: boolean;
  schedule?: WorkScheduleDay[];
}

export type AppointmentStatus = 'scheduled' | 'in_chair' | 'completed' | 'cancelled' | 'no_show';
export type PaymentMethod = 'mpesa_till' | 'mpesa_paybill' | 'cash' | 'card';
export type PaymentStatus = 'paid' | 'pending' | 'unpaid';

export interface Appointment {
  id: string;
  bookingRef: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM"
  status: AppointmentStatus;
  priceKes: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  mpesaRef?: string;
  notes?: string;
  createdAt: string;
  isDemo: boolean;
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalVisits: number;
  totalSpentKes: number;
  lastVisitDate: string;
  preferredArtisan: string;
  preferredService: string;
  notes: string;
  loyaltyPoints?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  brand: string;
  category: 'Hair Care' | 'Grooming' | 'Nail Care' | 'Skin & Spa';
  quantity: number;
  unit: string;
  minThreshold: number;
  costPriceKes: number;
  retailPriceKes: number;
  lastRestocked: string;
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'restock' | 'service_usage' | 'damage_waste' | 'audit_adjustment';
  quantityDelta: number; // positive or negative
  resultingQuantity: number;
  reason: string;
  timestamp: string;
  recordedBy: string;
}

export type ExpenseCategory = 
  | 'Rent & Space' 
  | 'Barber & Salon Supplies' 
  | 'Utilities & Generator' 
  | 'Staff Refreshments' 
  | 'Marketing & Software' 
  | 'Maintenance & Cleaning';

export interface ExpenseItem {
  id: string;
  category: ExpenseCategory;
  title: string;
  amountKes: number;
  date: string; // YYYY-MM-DD
  receiptRef?: string;
  notes?: string;
  recordedBy: string;
}

export interface LoyaltyRewardTier {
  tierName: 'Silver Guest' | 'Gold VIP' | 'Aurum Elite';
  requiredPoints: number;
  discountPercentage: number;
  perks: string[];
}

export interface SalonTenant {
  id: string;
  name: string;
  tagline: string;
  town: string;
  county: string;
  address: string;
  landmark: string;
  phone: string;
  email: string;
  mpesaTill: string;
  mpesaPaybill: string;
  openingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export interface DailyBriefData {
  todayBookingsCount: number;
  inChairCount: number;
  pendingArrivalsCount: number;
  unconfirmedCount: number;
  cancellationsCount: number;
  noShowsCount: number;
  openSlotsAvailable: string[];
  returningClientsDue: {
    id: string;
    name: string;
    phone: string;
    daysSinceLastVisit: number;
    preferredService: string;
  }[];
  lowStockItems: InventoryItem[];
  topServiceToday: { name: string; count: number };
  followUpTasks: { id: string; task: string; priority: 'high' | 'medium' | 'normal'; done: boolean }[];
}

export interface NotificationTemplate {
  id: string;
  name: string;
  trigger: 'booking_confirmed' | '2h_reminder' | 'cancelled' | 'review_request' | 'return_invite';
  channel: 'SMS' | 'WhatsApp';
  templateText: string;
  isActive: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Braids & Locs' | 'Barbering' | 'Nails' | 'Facials & Spa' | 'Sanctuary Interior';
  image: string;
  description: string;
  artisanName?: string;
}

export type AppViewRole = 'customer' | 'owner' | 'staff';
export type PublicPage = 'home' | 'services' | 'gallery' | 'staff' | 'contact' | 'privacy' | 'terms';
