export type ServiceCategory = 
  | 'All' 
  | 'Braiding & Locs' 
  | 'Barbering & Grooming' 
  | 'Hair Styling & Color' 
  | 'Nails & Spa' 
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
}

export type AppointmentStatus = 'scheduled' | 'in_chair' | 'completed' | 'cancelled';
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

export interface SalonTenant {
  id: string;
  name: string;
  tagline: string;
  town: string;
  county: string;
  address: string;
  landmark: string;
  phone: string;
  mpesaTill: string;
  mpesaPaybill: string;
  openingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export type AppViewRole = 'customer' | 'owner' | 'staff';
