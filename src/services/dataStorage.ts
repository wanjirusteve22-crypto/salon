import { Appointment, InventoryItem, SalonTenant, Service, StaffMember } from '../types';

export const CURRENT_TENANT: SalonTenant = {
  id: 'aurum-kutus-01',
  name: 'Aurum Studio & Executive Barber',
  tagline: 'Kutus Premier Beauty Sanctuary & Grooming Lounge',
  town: 'Kutus',
  county: 'Kirinyaga County',
  address: 'Kutus Central Plaza, 2nd Floor, Suite 204',
  landmark: 'Opposite Equity Bank, 200m from Kirinyaga University Junction',
  phone: '+254 722 894 120',
  mpesaTill: '892341',
  mpesaPaybill: '522522 (Acc: AURUM)',
  openingHours: {
    weekdays: '7:30 AM — 8:30 PM',
    saturday: '7:00 AM — 9:00 PM',
    sunday: '9:30 AM — 7:00 PM',
  },
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-01',
    name: 'Bohemian Knotless Braids & Curls',
    category: 'Braiding & Locs',
    priceKes: 3200,
    durationMin: 180,
    description: 'Tension-free lightweight knotless braids with raw human curl curls and scalp oil nourishment.',
    popular: true,
    highlights: ['Tension-free technique', 'Edge treatment included', 'Warm tea or herbal beverage'],
    image: '/src/assets/images/service_braiding_styling_1792652772316.jpg',
  },
  {
    id: 'srv-02',
    name: 'Executive Fade, Beard Sculpt & Hot Towel',
    category: 'Barbering & Grooming',
    priceKes: 1200,
    durationMin: 50,
    description: 'Precision taper or low skin fade, razor sharp beard contour, organic eucalyptus hot towel wrap and head massage.',
    popular: true,
    highlights: ['Cut-throat razor finish', 'Eucalyptus steam wrap', 'Beard balm conditioning'],
    image: '/src/assets/images/service_executive_barber_1792652772553.jpg',
  },
  {
    id: 'srv-03',
    name: 'BIAB Russian Manicure & Nail Art',
    category: 'Nails & Spa',
    priceKes: 2200,
    durationMin: 75,
    description: 'Builder In A Bottle structured overlay for natural nail strength with French chrome tips and cuticle exfoliation.',
    popular: true,
    highlights: ['4-week chip resistant', 'Custom minimalist nail art', 'Hand & wrist aromatherapy massage'],
    image: '/src/assets/images/service_nail_spa_1792652773281.jpg',
  },
  {
    id: 'srv-04',
    name: 'Loc Retwist, Interlocking & Herbal Scalp Detox',
    category: 'Braiding & Locs',
    priceKes: 2500,
    durationMin: 120,
    description: 'ACV detox wash, organic honey retwist or palm-roll, finished with scalp tingling peppermint oil.',
    popular: false,
    highlights: ['Apple cider vinegar soak', 'Tear-free palm roll', 'Dome dryer setting'],
  },
  {
    id: 'srv-05',
    name: 'Silk Press & Botanical Deep Hydration',
    category: 'Hair Styling & Color',
    priceKes: 2800,
    durationMin: 90,
    description: 'Clarifying shampoo, ultra-rich steam conditioning masque, heat protectant infusion, and bone-straight glass shine.',
    popular: true,
    highlights: ['Zero chemical relaxer', 'Infrared micro-mist steam', 'Split-end trim included'],
  },
  {
    id: 'srv-06',
    name: 'The Royal Kirinyaga Bridal & Crown Glam',
    category: 'Bridal & Packages',
    priceKes: 14500,
    durationMin: 240,
    description: 'Full bridal glam: bespoke hair styling, luxury skin prep & HD makeup, gel extensions, and complimentary bridal champagne.',
    popular: false,
    highlights: ['Bridal trial session', 'Touch-up emergency kit', 'Priority private VIP styling booth'],
  },
  {
    id: 'srv-07',
    name: 'Men’s Executive Scalp Detox & Grey Blending',
    category: 'Barbering & Grooming',
    priceKes: 1800,
    durationMin: 60,
    description: 'Deep pore scalp scrub, cooling menthol wash, subtle discreet grey coverage tint, and styled blowout.',
    popular: false,
    highlights: ['Anti-dandruff formulation', 'Discreet natural pigment', 'High-frequency comb stimulation'],
  },
  {
    id: 'srv-08',
    name: 'Pedicure Deluxe with Dead Sea Mud Mask',
    category: 'Nails & Spa',
    priceKes: 1800,
    durationMin: 60,
    description: 'Callus softening treatment, peppermint foot soak, organic mud mask, and long-lasting gel polish.',
    popular: false,
    highlights: ['Paraffin heel soak', 'Deep callus smoothing', 'Reflexology pressure points'],
  },
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'stf-01',
    name: 'Wanjiku "Shiku" Kariuki',
    role: 'Lead Braider & Natural Locs Director',
    title: 'Senior Artisan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 4.95,
    reviewsCount: 142,
    specialties: ['Knotless Braids', 'Loc Retwist', 'Bridal Hair Updos'],
    commissionRate: 0.35,
    phone: '+254 712 345 601',
    bio: '8 years shaping trendsetting African protective styles with a gentle hand and precise geometric partings in Kutus.',
    isAvailableToday: true,
  },
  {
    id: 'stf-02',
    name: 'Mwangi "DJ" Kimani',
    role: 'Master Barber & Grooming Specialist',
    title: 'Executive Barber',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    rating: 4.98,
    reviewsCount: 218,
    specialties: ['Skin Fade', 'Beard Contouring', 'Hot Towel Rituals'],
    commissionRate: 0.40,
    phone: '+254 723 456 702',
    bio: 'Renowned for razor-sharp tapers and relaxing hot towel therapies. Barber of choice for Kirinyaga professionals.',
    isAvailableToday: true,
  },
  {
    id: 'stf-03',
    name: 'Joy Nyambura',
    role: 'Senior Nail Artist & Aesthetician',
    title: 'Nail Master',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    rating: 4.90,
    reviewsCount: 96,
    specialties: ['BIAB Gel Overlay', 'Russian Manicure', 'Aroma Spa Pedicure'],
    commissionRate: 0.35,
    phone: '+254 734 567 803',
    bio: 'Specialist in natural nail restoration, long-lasting builder gels, and relaxing reflexology pedicures.',
    isAvailableToday: true,
  },
  {
    id: 'stf-04',
    name: 'Kevin Mutugi',
    role: 'Color & Texture Specialist',
    title: 'Colorist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    rating: 4.88,
    reviewsCount: 64,
    specialties: ['Silk Press', 'Balayage & Ombre', 'Scalp Detox'],
    commissionRate: 0.30,
    phone: '+254 745 678 904',
    bio: 'Passionate about healthy heat management, gloss toners, and bespoke scalp rejuvenating treatments.',
    isAvailableToday: true,
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    bookingRef: 'SFK-8921',
    customerName: 'Dr. Esther Wairimu',
    customerPhone: '+254 722 411 902',
    customerEmail: 'esther.wairimu@kyu.ac.ke',
    serviceId: 'srv-01',
    serviceName: 'Bohemian Knotless Braids & Curls',
    staffId: 'stf-01',
    staffName: 'Wanjiku "Shiku" Kariuki',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:00 AM',
    status: 'in_chair',
    priceKes: 3200,
    paymentMethod: 'mpesa_till',
    paymentStatus: 'paid',
    mpesaRef: 'RKL993214',
    notes: 'Medium waist length, soft golden brown curl accents',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    isDemo: true,
  },
  {
    id: 'apt-002',
    bookingRef: 'SFK-8922',
    customerName: 'Dennis Murimi',
    customerPhone: '+254 701 334 112',
    customerEmail: 'dennis.murimi@gmail.com',
    serviceId: 'srv-02',
    serviceName: 'Executive Fade, Beard Sculpt & Hot Towel',
    staffId: 'stf-02',
    staffName: 'Mwangi "DJ" Kimani',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '11:00 AM',
    status: 'scheduled',
    priceKes: 1200,
    paymentMethod: 'mpesa_till',
    paymentStatus: 'pending',
    notes: 'Low taper fade, square beard outline, sensitive skin',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    isDemo: true,
  },
  {
    id: 'apt-003',
    bookingRef: 'SFK-8923',
    customerName: 'Grace Muthoni',
    customerPhone: '+254 711 990 432',
    serviceId: 'srv-03',
    serviceName: 'BIAB Russian Manicure & Nail Art',
    staffId: 'stf-03',
    staffName: 'Joy Nyambura',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '12:30 PM',
    status: 'scheduled',
    priceKes: 2200,
    paymentMethod: 'cash',
    paymentStatus: 'unpaid',
    notes: 'Milky glazed finish with gold foil specks',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    isDemo: true,
  },
  {
    id: 'apt-004',
    bookingRef: 'SFK-8919',
    customerName: 'Eng. Patrick Githinji',
    customerPhone: '+254 720 188 765',
    serviceId: 'srv-02',
    serviceName: 'Executive Fade, Beard Sculpt & Hot Towel',
    staffId: 'stf-02',
    staffName: 'Mwangi "DJ" Kimani',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '08:00 AM',
    status: 'completed',
    priceKes: 1200,
    paymentMethod: 'mpesa_till',
    paymentStatus: 'paid',
    mpesaRef: 'RKL884210',
    notes: 'Regular morning client',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    isDemo: true,
  },
  {
    id: 'apt-005',
    bookingRef: 'SFK-8920',
    customerName: 'Mercy Njoki',
    customerPhone: '+254 798 123 456',
    serviceId: 'srv-05',
    serviceName: 'Silk Press & Botanical Deep Hydration',
    staffId: 'stf-04',
    staffName: 'Kevin Mutugi',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '08:30 AM',
    status: 'completed',
    priceKes: 2800,
    paymentMethod: 'mpesa_till',
    paymentStatus: 'paid',
    mpesaRef: 'RKL891102',
    notes: 'Trimmed split ends, ultra shine spray applied',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    isDemo: true,
  },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-01',
    name: 'Mizani Butter Blend Moisture Mask',
    brand: 'Mizani',
    category: 'Hair Care',
    quantity: 14,
    unit: 'tubs (500ml)',
    minThreshold: 5,
    costPriceKes: 2100,
    retailPriceKes: 3400,
    lastRestocked: '2026-10-14',
  },
  {
    id: 'inv-02',
    name: 'Sandalwood & Baobab Beard Oil',
    brand: 'Kenya Grooming Co.',
    category: 'Grooming',
    quantity: 22,
    unit: 'bottles (50ml)',
    minThreshold: 8,
    costPriceKes: 650,
    retailPriceKes: 1200,
    lastRestocked: '2026-10-18',
  },
  {
    id: 'inv-03',
    name: 'BIAB Builder Gel - Nude 01',
    brand: 'The Gel Bottle',
    category: 'Nail Care',
    quantity: 4,
    unit: 'bottles (20ml)',
    minThreshold: 6, // Low stock warning!
    costPriceKes: 1800,
    retailPriceKes: 2600,
    lastRestocked: '2026-09-30',
  },
  {
    id: 'inv-04',
    name: 'Wahl Professional Clipper Blade Oil',
    brand: 'Wahl',
    category: 'Grooming',
    quantity: 9,
    unit: 'bottles (118ml)',
    minThreshold: 4,
    costPriceKes: 550,
    retailPriceKes: 950,
    lastRestocked: '2026-10-05',
  },
];

const STORAGE_KEY_APPOINTMENTS = 'salonflow_appointments_v1';
const STORAGE_KEY_INVENTORY = 'salonflow_inventory_v1';
const STORAGE_KEY_CONFIG = 'salonflow_config_v1';

export const getStoredAppointments = (): Appointment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
      return INITIAL_APPOINTMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_APPOINTMENTS;
  }
};

export const saveAppointment = (appointment: Appointment): Appointment[] => {
  const current = getStoredAppointments();
  const index = current.findIndex(a => a.id === appointment.id);
  let updated: Appointment[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = appointment;
  } else {
    updated = [appointment, ...current];
  }
  try {
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
  return updated;
};

export const updateAppointmentStatus = (id: string, status: Appointment['status'], mpesaRef?: string): Appointment[] => {
  const current = getStoredAppointments();
  const updated = current.map(item => {
    if (item.id === id) {
      return {
        ...item,
        status,
        ...(mpesaRef ? { mpesaRef, paymentStatus: 'paid' as const } : {}),
      };
    }
    return item;
  });
  try {
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save updated appointment', err);
  }
  return updated;
};

export const getStoredInventory = (): InventoryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INVENTORY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(INITIAL_INVENTORY));
      return INITIAL_INVENTORY;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_INVENTORY;
  }
};

export const updateInventoryQuantity = (id: string, delta: number): InventoryItem[] => {
  const current = getStoredInventory();
  const updated = current.map(item => {
    if (item.id === id) {
      const newQty = Math.max(0, item.quantity + delta);
      return { ...item, quantity: newQty };
    }
    return item;
  });
  try {
    localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update inventory', err);
  }
  return updated;
};

export const resetToDemoData = () => {
  localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
  localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(INITIAL_INVENTORY));
};

export const generateBookingRef = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `SFK-${randomNum}`;
};

/**
 * Commercial Supabase SQL Migration Blueprint
 * Ready to run directly in Supabase SQL editor for $400 client deployments.
 */
export const SUPABASE_SQL_SCHEMA = `-- SalonFlow Kenya - Production Supabase DDL Migration
-- Target: Kutus, Kirinyaga County & Kenyan Salons
-- Includes Multi-tenant isolation, RLS Policies & Kenyan M-Pesa tracking

-- 1. Create Tenants (Salons)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    county TEXT DEFAULT 'Kirinyaga',
    town TEXT DEFAULT 'Kutus',
    address TEXT,
    phone TEXT NOT NULL,
    mpesa_till TEXT,
    mpesa_paybill TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Staff & Stylists
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    phone TEXT,
    commission_rate NUMERIC(3,2) DEFAULT 0.35,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Services Catalog
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price_kes NUMERIC(10,2) NOT NULL,
    duration_min INTEGER NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. Appointments & M-Pesa References
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    booking_ref TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    service_id UUID REFERENCES public.services(id),
    staff_id UUID REFERENCES public.staff(id),
    appointment_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    status TEXT CHECK (status IN ('scheduled', 'in_chair', 'completed', 'cancelled')) DEFAULT 'scheduled',
    price_kes NUMERIC(10,2) NOT NULL,
    payment_method TEXT DEFAULT 'mpesa_till',
    payment_status TEXT CHECK (payment_status IN ('unpaid', 'pending', 'paid')) DEFAULT 'pending',
    mpesa_receipt TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Row Level Security (RLS)
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Public can view active services and staff for booking
CREATE POLICY "Public services read access" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public staff read access" ON public.staff FOR SELECT USING (is_active = true);
-- Public can insert new appointments
CREATE POLICY "Public can book appointments" ON public.appointments FOR INSERT WITH CHECK (true);
`;
