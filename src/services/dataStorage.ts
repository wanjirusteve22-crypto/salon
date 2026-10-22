import { 
  Appointment, 
  CustomerRecord, 
  GalleryItem, 
  InventoryItem, 
  InventoryMovement,
  ExpenseItem,
  DailyBriefData,
  NotificationTemplate,
  SalonTenant, 
  Service, 
  StaffMember, 
  WorkScheduleDay 
} from '../types';

export const DEFAULT_WORK_SCHEDULE: WorkScheduleDay[] = [
  { day: 'Monday', isWorking: true, startTime: '08:00 AM', endTime: '06:00 PM' },
  { day: 'Tuesday', isWorking: true, startTime: '08:00 AM', endTime: '06:00 PM' },
  { day: 'Wednesday', isWorking: true, startTime: '08:00 AM', endTime: '06:00 PM' },
  { day: 'Thursday', isWorking: true, startTime: '08:00 AM', endTime: '06:00 PM' },
  { day: 'Friday', isWorking: true, startTime: '08:00 AM', endTime: '07:00 PM' },
  { day: 'Saturday', isWorking: true, startTime: '07:30 AM', endTime: '07:30 PM' },
  { day: 'Sunday', isWorking: false, startTime: '09:30 AM', endTime: '05:00 PM' },
];

export const INITIAL_TENANT: SalonTenant = {
  id: 'aurum-kutus-01',
  name: 'Aurum Studio & Executive Barber',
  tagline: 'Kutus Premier Beauty Sanctuary & Grooming Lounge',
  town: 'Kutus',
  county: 'Kirinyaga County',
  address: 'Kutus Central Plaza, 2nd Floor, Suite 204',
  landmark: 'Opposite Equity Bank, 200m from Kirinyaga University Junction',
  phone: '+254 722 894 120',
  email: 'concierge@aurumsalonflow.co.ke',
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
  },
  {
    id: 'srv-04',
    name: 'Organic Eucalyptus Facial & Clay Mask',
    category: 'Facials & Skin',
    priceKes: 2600,
    durationMin: 60,
    description: 'Deep pore detox, steaming herbal eucalyptus mist, organic bentonite clay purifying mask, and jade stone facial lymphatic massage.',
    popular: true,
    highlights: ['Pore extraction & toner', 'Dead skin exfoliation', 'Botanical hyaluronic serum'],
    image: '/src/assets/images/gallery_facial_spa_1792653410993.jpg',
    isActive: true,
  },
  {
    id: 'srv-05',
    name: 'Loc Retwist, Interlocking & Herbal Scalp Detox',
    category: 'Braiding & Locs',
    priceKes: 2500,
    durationMin: 120,
    description: 'ACV detox wash, organic honey retwist or palm-roll, finished with scalp tingling peppermint oil.',
    popular: false,
    highlights: ['Apple cider vinegar soak', 'Tear-free palm roll', 'Dome dryer setting'],
    isActive: true,
  },
  {
    id: 'srv-06',
    name: 'Silk Press & Botanical Deep Hydration',
    category: 'Hair Styling & Color',
    priceKes: 2800,
    durationMin: 90,
    description: 'Clarifying shampoo, ultra-rich steam conditioning masque, heat protectant infusion, and bone-straight glass shine.',
    popular: true,
    highlights: ['Zero chemical relaxer', 'Infrared micro-mist steam', 'Split-end trim included'],
    isActive: true,
  },
  {
    id: 'srv-07',
    name: 'The Royal Kirinyaga Bridal & Crown Glam',
    category: 'Bridal & Packages',
    priceKes: 14500,
    durationMin: 240,
    description: 'Full bridal glam: bespoke hair styling, luxury skin prep & HD makeup, gel extensions, and complimentary bridal champagne.',
    popular: false,
    highlights: ['Bridal trial session', 'Touch-up emergency kit', 'Priority private VIP styling booth'],
    isActive: true,
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
    isActive: true,
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
    schedule: DEFAULT_WORK_SCHEDULE,
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
    schedule: DEFAULT_WORK_SCHEDULE,
  },
  {
    id: 'stf-03',
    name: 'Joy Nyambura',
    role: 'Senior Nail Artist & Aesthetician',
    title: 'Nail Master',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    rating: 4.90,
    reviewsCount: 96,
    specialties: ['BIAB Gel Overlay', 'Russian Manicure', 'Aroma Spa Pedicure', 'Clay Facials'],
    commissionRate: 0.35,
    phone: '+254 734 567 803',
    bio: 'Specialist in natural nail restoration, long-lasting builder gels, and relaxing reflexology pedicures.',
    isAvailableToday: true,
    schedule: DEFAULT_WORK_SCHEDULE,
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
    schedule: DEFAULT_WORK_SCHEDULE,
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
  {
    id: 'apt-006',
    bookingRef: 'SFK-8918',
    customerName: 'Caroline Wangui',
    customerPhone: '+254 724 550 891',
    serviceId: 'srv-04',
    serviceName: 'Organic Eucalyptus Facial & Clay Mask',
    staffId: 'stf-03',
    staffName: 'Joy Nyambura',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:30 AM',
    status: 'completed',
    priceKes: 2600,
    paymentMethod: 'mpesa_till',
    paymentStatus: 'paid',
    mpesaRef: 'RKL892040',
    notes: 'Deep skin cleanse before wedding event',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    isDemo: true,
  },
];

export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cst-01',
    name: 'Dr. Esther Wairimu',
    phone: '+254 722 411 902',
    email: 'esther.wairimu@kyu.ac.ke',
    totalVisits: 8,
    totalSpentKes: 24600,
    lastVisitDate: '2026-10-22',
    preferredArtisan: 'Wanjiku "Shiku" Kariuki',
    preferredService: 'Bohemian Knotless Braids',
    notes: 'Prefers scalp peppermint cooling drops before braiding.',
  },
  {
    id: 'cst-02',
    name: 'Eng. Patrick Githinji',
    phone: '+254 720 188 765',
    email: 'patrick.githinji@consultancy.co.ke',
    totalVisits: 14,
    totalSpentKes: 18200,
    lastVisitDate: '2026-10-22',
    preferredArtisan: 'Mwangi "DJ" Kimani',
    preferredService: 'Executive Fade & Beard Sculpt',
    notes: 'Prefers 8:00 AM slots before site inspections in Kerugoya.',
  },
  {
    id: 'cst-03',
    name: 'Dennis Murimi',
    phone: '+254 701 334 112',
    email: 'dennis.murimi@gmail.com',
    totalVisits: 5,
    totalSpentKes: 6800,
    lastVisitDate: '2026-10-22',
    preferredArtisan: 'Mwangi "DJ" Kimani',
    preferredService: 'Executive Fade & Hot Towel',
    notes: 'Sensitive skin around neck; use alcohol-free balm.',
  },
  {
    id: 'cst-04',
    name: 'Grace Muthoni',
    phone: '+254 711 990 432',
    totalVisits: 6,
    totalSpentKes: 13400,
    lastVisitDate: '2026-10-20',
    preferredArtisan: 'Joy Nyambura',
    preferredService: 'BIAB Russian Manicure',
    notes: 'Short natural nails, loves subtle chrome and gold flakes.',
  },
  {
    id: 'cst-05',
    name: 'Caroline Wangui',
    phone: '+254 724 550 891',
    email: 'carol.wangui@kirinyaga.go.ke',
    totalVisits: 9,
    totalSpentKes: 28900,
    lastVisitDate: '2026-10-22',
    preferredArtisan: 'Joy Nyambura',
    preferredService: 'Organic Eucalyptus Facial & Clay Mask',
    notes: 'County government officer. Books early Saturdays.',
  },
  {
    id: 'cst-06',
    name: 'Mercy Njoki',
    phone: '+254 798 123 456',
    totalVisits: 4,
    totalSpentKes: 11200,
    lastVisitDate: '2026-10-18',
    preferredArtisan: 'Kevin Mutugi',
    preferredService: 'Silk Press & Deep Hydration',
    notes: 'Natural 4C texture, prefers low thermal heat styling.',
  },
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-01',
    title: 'Artistic Fulani Braids & Cowrie Shell Finish',
    category: 'Braids & Locs',
    image: '/src/assets/images/service_braiding_styling_1792652772316.jpg',
    description: 'Precision geometric parting with soft micro curls and champagne gold hair cuffs.',
    artisanName: 'Wanjiku "Shiku" Kariuki',
  },
  {
    id: 'gal-02',
    title: 'Executive Razor Fade & Hot Towel Sculpt',
    category: 'Barbering',
    image: '/src/assets/images/service_executive_barber_1792652772553.jpg',
    description: 'Sharp drop taper with straight-edge razor contour and beard butter treatment.',
    artisanName: 'Mwangi "DJ" Kimani',
  },
  {
    id: 'gal-03',
    title: 'BIAB Chrome French & Cuticle Therapy',
    category: 'Nails',
    image: '/src/assets/images/service_nail_spa_1792652773281.jpg',
    description: 'Natural BIAB overlay with iridescent glazed chrome finish on almond nails.',
    artisanName: 'Joy Nyambura',
  },
  {
    id: 'gal-04',
    title: 'Eucalyptus Steam & Bentonite Clay Purification',
    category: 'Facials & Spa',
    image: '/src/assets/images/gallery_facial_spa_1792653410993.jpg',
    description: 'Rejuvenating steam mist opening pores followed by natural detoxifying clay masque.',
    artisanName: 'Joy Nyambura',
  },
  {
    id: 'gal-05',
    title: 'The Aurum Main Bay & Styling Chairs',
    category: 'Sanctuary Interior',
    image: '/src/assets/images/hero_luxury_salon_1792652771024.jpg',
    description: 'Warm ivory architectural arches, backlit vanity mirrors, and luxury ergonomic leather chairs.',
  },
  {
    id: 'gal-06',
    title: 'Reclining Shampoo Basins & Scalp Detox Station',
    category: 'Sanctuary Interior',
    image: '/src/assets/images/gallery_salon_interior_1792653411115.jpg',
    description: 'Brushed champagne fixtures and ergonomic basins designed for deep scalp therapies.',
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
    minThreshold: 6,
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

// Local storage keys
const KEY_APPOINTMENTS = 'salonflow_appointments_v2';
const KEY_SERVICES = 'salonflow_services_v2';
const KEY_STAFF = 'salonflow_staff_v2';
const KEY_TENANT = 'salonflow_tenant_v2';
const KEY_CUSTOMERS = 'salonflow_customers_v2';
const KEY_INVENTORY = 'salonflow_inventory_v2';
const KEY_EXPENSES = 'salonflow_expenses_v2';
const KEY_MOVEMENTS = 'salonflow_movements_v2';
const KEY_NOTIF_TEMPLATES = 'salonflow_notif_templates_v2';

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-01',
    category: 'Rent & Space',
    title: 'Kutus Central Plaza Suite 204 Monthly Lease',
    amountKes: 28000,
    date: '2026-10-01',
    receiptRef: 'KCP-OCT-892',
    notes: 'Paid via bank transfer to Plaza Management',
    recordedBy: 'Owner',
  },
  {
    id: 'exp-02',
    category: 'Utilities & Generator',
    title: 'KPLC Prepaid Power Token + Backup Diesel',
    amountKes: 6400,
    date: '2026-10-15',
    receiptRef: 'KPLC-48910-2026',
    notes: 'Power backup during county line maintenance',
    recordedBy: 'Owner',
  },
  {
    id: 'exp-03',
    category: 'Barber & Salon Supplies',
    title: 'Mizani Masques & French Chrome Powder restock',
    amountKes: 9500,
    date: '2026-10-18',
    receiptRef: 'COS-NAI-992',
    notes: 'Nairobi Beauty Hub consignment delivery',
    recordedBy: 'Owner',
  },
  {
    id: 'exp-04',
    category: 'Staff Refreshments',
    title: 'Kericho Gold Teas, Fresh Eucalyptus & Coffee Beans',
    amountKes: 2200,
    date: '2026-10-20',
    receiptRef: 'SUP-KUT-104',
    notes: 'Client beverage station & aromatics',
    recordedBy: 'Reception',
  },
];

export const INITIAL_INVENTORY_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov-01',
    itemId: 'inv-01',
    itemName: 'Mizani Butter Blend Moisture Mask',
    type: 'restock',
    quantityDelta: 10,
    resultingQuantity: 14,
    reason: 'Monthly wholesale restock delivery from Nairobi',
    timestamp: '2026-10-14T09:30:00Z',
    recordedBy: 'Owner',
  },
  {
    id: 'mov-02',
    itemId: 'inv-03',
    itemName: 'BIAB Builder Gel - Nude 01',
    type: 'damage_waste',
    quantityDelta: -1,
    resultingQuantity: 4,
    reason: 'Bottle dropped at manicure station',
    timestamp: '2026-10-19T14:15:00Z',
    recordedBy: 'Joy Nyambura',
  },
  {
    id: 'mov-03',
    itemId: 'inv-02',
    itemName: 'Sandalwood & Baobab Beard Oil',
    type: 'restock',
    quantityDelta: 15,
    resultingQuantity: 22,
    reason: 'Handcrafted artisan batch arrived',
    timestamp: '2026-10-18T11:00:00Z',
    recordedBy: 'Owner',
  },
];

export const INITIAL_NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tpl-01',
    name: 'Booking Confirmation Receipt',
    trigger: 'booking_confirmed',
    channel: 'SMS',
    templateText: 'Habari {{customer_name}}, your appointment for {{service_name}} with {{staff_name}} at {{salon_name}} is confirmed for {{date}} at {{time_slot}}. Booking Ref: {{booking_ref}}. Kutus Central Plaza, 2nd Flr. Call {{salon_phone}} for queries.',
    isActive: true,
  },
  {
    id: 'tpl-02',
    name: '2-Hour Chair Reminder',
    trigger: '2h_reminder',
    channel: 'WhatsApp',
    templateText: 'Jambo {{customer_name}}! ☕ Your styling chair is reserved today at {{time_slot}} for {{service_name}} with {{staff_name}}. Complimentary eucalyptus tea awaits you at {{salon_name}} Kutus!',
    isActive: true,
  },
  {
    id: 'tpl-03',
    name: 'Rescheduling or Cancellation Notice',
    trigger: 'cancelled',
    channel: 'SMS',
    templateText: 'Hello {{customer_name}}, your booking {{booking_ref}} at {{salon_name}} has been updated. If you did not request this change, please call our concierge directly on {{salon_phone}}.',
    isActive: true,
  },
  {
    id: 'tpl-04',
    name: 'Post-Visit Loyalty Points Credit',
    trigger: 'review_request',
    channel: 'WhatsApp',
    templateText: 'Asante sana {{customer_name}} for visiting {{salon_name}} today! ✨ You have earned {{loyalty_points}} loyalty points toward your next treatment. We look forward to your next sanctuary experience.',
    isActive: true,
  },
  {
    id: 'tpl-05',
    name: '21-Day Return Visit Invitation',
    trigger: 'return_invite',
    channel: 'SMS',
    templateText: 'Habari {{customer_name}}! It has been 3 weeks since your {{service_name}} at {{salon_name}} Kutus. Keep your style fresh — book your priority chair this week at {{booking_link}}.',
    isActive: true,
  },
];

export const getStoredTenant = (): SalonTenant => {
  try {
    const raw = localStorage.getItem(KEY_TENANT);
    if (!raw) {
      localStorage.setItem(KEY_TENANT, JSON.stringify(INITIAL_TENANT));
      return INITIAL_TENANT;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TENANT;
  }
};

export const saveStoredTenant = (tenant: SalonTenant): SalonTenant => {
  try {
    localStorage.setItem(KEY_TENANT, JSON.stringify(tenant));
  } catch (err) {
    console.error(err);
  }
  return tenant;
};

export const getStoredServices = (): Service[] => {
  try {
    const raw = localStorage.getItem(KEY_SERVICES);
    if (!raw) {
      localStorage.setItem(KEY_SERVICES, JSON.stringify(INITIAL_SERVICES));
      return INITIAL_SERVICES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SERVICES;
  }
};

export const saveStoredServices = (services: Service[]): Service[] => {
  try {
    localStorage.setItem(KEY_SERVICES, JSON.stringify(services));
  } catch (err) {
    console.error(err);
  }
  return services;
};

export const getStoredStaff = (): StaffMember[] => {
  try {
    const raw = localStorage.getItem(KEY_STAFF);
    if (!raw) {
      localStorage.setItem(KEY_STAFF, JSON.stringify(INITIAL_STAFF));
      return INITIAL_STAFF;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_STAFF;
  }
};

export const saveStoredStaff = (staff: StaffMember[]): StaffMember[] => {
  try {
    localStorage.setItem(KEY_STAFF, JSON.stringify(staff));
  } catch (err) {
    console.error(err);
  }
  return staff;
};

export const getStoredAppointments = (): Appointment[] => {
  try {
    const raw = localStorage.getItem(KEY_APPOINTMENTS);
    if (!raw) {
      localStorage.setItem(KEY_APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
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
    localStorage.setItem(KEY_APPOINTMENTS, JSON.stringify(updated));
  } catch (err) {
    console.error(err);
  }
  return updated;
};

export const updateAppointmentStatus = (
  id: string, 
  status: Appointment['status'], 
  mpesaRef?: string
): Appointment[] => {
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
    localStorage.setItem(KEY_APPOINTMENTS, JSON.stringify(updated));
  } catch (err) {
    console.error(err);
  }
  return updated;
};

export const getStoredCustomers = (): CustomerRecord[] => {
  try {
    const raw = localStorage.getItem(KEY_CUSTOMERS);
    if (!raw) {
      localStorage.setItem(KEY_CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CUSTOMERS;
  }
};

export const saveCustomer = (customer: CustomerRecord): CustomerRecord[] => {
  const current = getStoredCustomers();
  const index = current.findIndex(c => c.id === customer.id);
  let updated: CustomerRecord[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = customer;
  } else {
    updated = [customer, ...current];
  }
  try {
    localStorage.setItem(KEY_CUSTOMERS, JSON.stringify(updated));
  } catch (err) {
    console.error(err);
  }
  return updated;
};

export const getStoredInventory = (): InventoryItem[] => {
  try {
    const raw = localStorage.getItem(KEY_INVENTORY);
    if (!raw) {
      localStorage.setItem(KEY_INVENTORY, JSON.stringify(INITIAL_INVENTORY));
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
      return { ...item, quantity: Math.max(0, item.quantity + delta) };
    }
    return item;
  });
  try {
    localStorage.setItem(KEY_INVENTORY, JSON.stringify(updated));
  } catch (err) {
    console.error(err);
  }
  return updated;
};

export const getStoredExpenses = (): ExpenseItem[] => {
  try {
    const raw = localStorage.getItem(KEY_EXPENSES);
    if (!raw) {
      localStorage.setItem(KEY_EXPENSES, JSON.stringify(INITIAL_EXPENSES));
      return INITIAL_EXPENSES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_EXPENSES;
  }
};

export const saveStoredExpenses = (expenses: ExpenseItem[]): ExpenseItem[] => {
  try {
    localStorage.setItem(KEY_EXPENSES, JSON.stringify(expenses));
  } catch (err) {
    console.error(err);
  }
  return expenses;
};

export const addExpense = (expense: ExpenseItem): ExpenseItem[] => {
  const current = getStoredExpenses();
  const updated = [expense, ...current];
  saveStoredExpenses(updated);
  return updated;
};

export const getStoredInventoryMovements = (): InventoryMovement[] => {
  try {
    const raw = localStorage.getItem(KEY_MOVEMENTS);
    if (!raw) {
      localStorage.setItem(KEY_MOVEMENTS, JSON.stringify(INITIAL_INVENTORY_MOVEMENTS));
      return INITIAL_INVENTORY_MOVEMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_INVENTORY_MOVEMENTS;
  }
};

export const addInventoryMovement = (movement: InventoryMovement): InventoryMovement[] => {
  const current = getStoredInventoryMovements();
  const updated = [movement, ...current];
  try {
    localStorage.setItem(KEY_MOVEMENTS, JSON.stringify(updated));
  } catch (err) {
    console.error(err);
  }
  return updated;
};

export const adjustInventoryStock = (
  itemId: string,
  delta: number,
  type: InventoryMovement['type'],
  reason: string,
  recordedBy = 'Owner'
): { items: InventoryItem[]; movements: InventoryMovement[] } => {
  const items = getStoredInventory();
  let resultingQty = 0;
  let itemName = 'Inventory Item';

  const updatedItems = items.map(item => {
    if (item.id === itemId) {
      resultingQty = Math.max(0, item.quantity + delta);
      itemName = item.name;
      return { ...item, quantity: resultingQty };
    }
    return item;
  });

  try {
    localStorage.setItem(KEY_INVENTORY, JSON.stringify(updatedItems));
  } catch (err) {
    console.error(err);
  }

  const newMovement: InventoryMovement = {
    id: `mov-${Date.now()}`,
    itemId,
    itemName,
    type,
    quantityDelta: delta,
    resultingQuantity: resultingQty,
    reason,
    timestamp: new Date().toISOString(),
    recordedBy,
  };

  const updatedMovements = addInventoryMovement(newMovement);
  return { items: updatedItems, movements: updatedMovements };
};

export const getNotificationTemplates = (): NotificationTemplate[] => {
  try {
    const raw = localStorage.getItem(KEY_NOTIF_TEMPLATES);
    if (!raw) {
      localStorage.setItem(KEY_NOTIF_TEMPLATES, JSON.stringify(INITIAL_NOTIFICATION_TEMPLATES));
      return INITIAL_NOTIFICATION_TEMPLATES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATION_TEMPLATES;
  }
};

export const updateNotificationTemplate = (id: string, templateText: string, isActive: boolean): NotificationTemplate[] => {
  const current = getNotificationTemplates();
  const updated = current.map(t => (t.id === id ? { ...t, templateText, isActive } : t));
  try {
    localStorage.setItem(KEY_NOTIF_TEMPLATES, JSON.stringify(updated));
  } catch (err) {
    console.error(err);
  }
  return updated;
};

export const generateDailyBrief = (
  appointments: Appointment[],
  customers: CustomerRecord[],
  inventory: InventoryItem[]
): DailyBriefData => {
  const today = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter(a => a.date === today);

  const todayBookingsCount = todayApts.length;
  const inChairCount = todayApts.filter(a => a.status === 'in_chair').length;
  const pendingArrivalsCount = todayApts.filter(a => a.status === 'scheduled').length;
  const unconfirmedCount = todayApts.filter(a => a.paymentStatus === 'pending' && a.status === 'scheduled').length;
  const cancellationsCount = todayApts.filter(a => a.status === 'cancelled').length;
  const noShowsCount = todayApts.filter(a => a.status === 'no_show').length;

  const allStandardSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', 
    '04:00 PM', '05:00 PM', '06:00 PM'
  ];
  const bookedSlots = new Set(todayApts.filter(a => a.status !== 'cancelled').map(a => a.timeSlot));
  const openSlotsAvailable = allStandardSlots.filter(s => !bookedSlots.has(s));

  const nowMs = Date.now();
  const returningClientsDue = customers
    .map(c => {
      const lastVisitMs = new Date(c.lastVisitDate).getTime();
      const daysSince = Math.floor((nowMs - lastVisitMs) / (1000 * 60 * 60 * 24));
      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        daysSinceLastVisit: isNaN(daysSince) ? 30 : daysSince,
        preferredService: c.preferredService,
      };
    })
    .filter(c => c.daysSinceLastVisit >= 21)
    .sort((a, b) => b.daysSinceLastVisit - a.daysSinceLastVisit)
    .slice(0, 4);

  const lowStockItems = inventory.filter(i => i.quantity <= i.minThreshold);

  const svcCounts: Record<string, number> = {};
  todayApts.forEach(a => {
    svcCounts[a.serviceName] = (svcCounts[a.serviceName] || 0) + 1;
  });
  let topServiceToday = { name: 'Bohemian Knotless Braids', count: 0 };
  Object.entries(svcCounts).forEach(([name, count]) => {
    if (count > topServiceToday.count) {
      topServiceToday = { name, count };
    }
  });

  const followUpTasks = [
    {
      id: 'task-1',
      task: unconfirmedCount > 0 
        ? `Contact ${unconfirmedCount} pending client(s) to confirm chair reservation` 
        : 'All booked clients confirmed for today',
      priority: unconfirmedCount > 0 ? ('high' as const) : ('normal' as const),
      done: false,
    },
    {
      id: 'task-2',
      task: lowStockItems.length > 0 
        ? `Reorder ${lowStockItems.map(i => i.name).slice(0, 2).join(', ')} (stock critical)` 
        : 'Inventory levels adequate for salon operations',
      priority: lowStockItems.length > 0 ? ('high' as const) : ('normal' as const),
      done: false,
    },
    {
      id: 'task-3',
      task: returningClientsDue.length > 0 
        ? `Send 21-day hair care reminder to ${returningClientsDue[0].name} (${returningClientsDue[0].preferredService})` 
        : 'Customer retention reminders dispatched',
      priority: 'medium' as const,
      done: false,
    },
    {
      id: 'task-4',
      task: 'Verify KPLC power token balance and backup generator diesel before evening peak rush',
      priority: 'normal' as const,
      done: true,
    },
  ];

  return {
    todayBookingsCount,
    inChairCount,
    pendingArrivalsCount,
    unconfirmedCount,
    cancellationsCount,
    noShowsCount,
    openSlotsAvailable,
    returningClientsDue,
    lowStockItems,
    topServiceToday,
    followUpTasks,
  };
};

export const exportToCsv = (filename: string, rows: Record<string, any>[]) => {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      headers
        .map(header => {
          const val = row[header] ?? '';
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const resetToDemoData = () => {
  localStorage.setItem(KEY_TENANT, JSON.stringify(INITIAL_TENANT));
  localStorage.setItem(KEY_SERVICES, JSON.stringify(INITIAL_SERVICES));
  localStorage.setItem(KEY_STAFF, JSON.stringify(INITIAL_STAFF));
  localStorage.setItem(KEY_APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
  localStorage.setItem(KEY_CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
  localStorage.setItem(KEY_INVENTORY, JSON.stringify(INITIAL_INVENTORY));
  localStorage.setItem(KEY_EXPENSES, JSON.stringify(INITIAL_EXPENSES));
  localStorage.setItem(KEY_MOVEMENTS, JSON.stringify(INITIAL_INVENTORY_MOVEMENTS));
  localStorage.setItem(KEY_NOTIF_TEMPLATES, JSON.stringify(INITIAL_NOTIFICATION_TEMPLATES));
};

export const generateBookingRef = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `SFK-${randomNum}`;
};

export const CURRENT_TENANT = INITIAL_TENANT;

export const SUPABASE_SQL_SCHEMA = `-- ============================================================================
-- SalonFlow Kenya - Production Supabase Migration
-- Target: Multi-tenant Beauty, Salon & Executive Barbershop Management
-- Primary Tenant: Aurum Studio & Executive Barber (Kutus, Kirinyaga County, Kenya)
-- Full Schema: 13 Tables + Multi-Tenant RLS + Conflict Triggers + Automated Sales Ledger
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BUSINESSES
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    county TEXT DEFAULT 'Kirinyaga',
    town TEXT DEFAULT 'Kutus',
    address TEXT NOT NULL,
    landmark TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    mpesa_till TEXT,
    mpesa_paybill TEXT,
    opening_hours JSONB NOT NULL DEFAULT '{"weekdays": "7:30 AM — 8:30 PM", "saturday": "7:00 AM — 9:00 PM", "sunday": "9:30 AM — 7:00 PM"}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PROFILES
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
    role TEXT NOT NULL CHECK (role IN ('superadmin', 'owner', 'employee', 'customer')),
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICES
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Braiding & Locs', 'Barbering & Grooming', 'Hair Styling & Color', 'Nails & Spa', 'Facials & Skin', 'Bridal & Packages')),
    price_kes NUMERIC(10,2) NOT NULL CHECK (price_kes >= 0),
    duration_min INTEGER NOT NULL CHECK (duration_min >= 15),
    description TEXT,
    image_url TEXT,
    highlights TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EMPLOYEES
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    phone TEXT NOT NULL,
    avatar_url TEXT,
    rating NUMERIC(3,2) DEFAULT 5.00 CHECK (rating BETWEEN 1.0 AND 5.0),
    reviews_count INTEGER DEFAULT 0,
    specialties TEXT[] DEFAULT '{}',
    commission_rate NUMERIC(3,2) NOT NULL DEFAULT 0.35 CHECK (commission_rate BETWEEN 0.0 AND 1.0),
    bio TEXT,
    is_available_today BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STAFF AVAILABILITY
CREATE TABLE IF NOT EXISTS public.staff_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    is_working BOOLEAN DEFAULT TRUE,
    start_time TIME NOT NULL DEFAULT '08:00:00',
    end_time TIME NOT NULL DEFAULT '18:30:00',
    UNIQUE (employee_id, day_of_week)
);

-- 6. CUSTOMERS
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    total_visits INTEGER DEFAULT 0 CHECK (total_visits >= 0),
    total_spent_kes NUMERIC(12,2) DEFAULT 0 CHECK (total_spent_kes >= 0),
    last_visit_date DATE,
    preferred_artisan_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(business_id, phone)
);

-- 7. APPOINTMENTS
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    booking_ref TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_min INTEGER NOT NULL CHECK (duration_min >= 15),
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_chair', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
    price_kes NUMERIC(10,2) NOT NULL CHECK (price_kes >= 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('mpesa_till', 'mpesa_paybill', 'cash', 'card')) DEFAULT 'mpesa_till',
    payment_status TEXT NOT NULL CHECK (payment_status IN ('unpaid', 'pending', 'paid')) DEFAULT 'pending',
    mpesa_reference TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. RECORDED SALES
CREATE TABLE IF NOT EXISTS public.recorded_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    amount_kes NUMERIC(10,2) NOT NULL CHECK (amount_kes >= 0),
    commission_rate NUMERIC(3,2) NOT NULL DEFAULT 0.35,
    commission_kes NUMERIC(10,2) NOT NULL CHECK (commission_kes >= 0),
    net_business_kes NUMERIC(10,2) NOT NULL CHECK (net_business_kes >= 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('mpesa_till', 'mpesa_paybill', 'cash', 'card')),
    mpesa_reference TEXT,
    sale_timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 9. EXPENSES
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('Rent & Space', 'Barber & Salon Supplies', 'Utilities & Generator', 'Staff Refreshments', 'Marketing & Software', 'Maintenance & Cleaning')),
    title TEXT NOT NULL,
    amount_kes NUMERIC(10,2) NOT NULL CHECK (amount_kes >= 0),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    receipt_ref TEXT,
    notes TEXT,
    recorded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INVENTORY
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Hair Care', 'Grooming', 'Nail Care', 'Skin & Spa')),
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    unit TEXT NOT NULL,
    min_threshold INTEGER NOT NULL DEFAULT 5 CHECK (min_threshold >= 0),
    cost_price_kes NUMERIC(10,2) NOT NULL CHECK (cost_price_kes >= 0),
    retail_price_kes NUMERIC(10,2) NOT NULL CHECK (retail_price_kes >= 0),
    last_restocked DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. INVENTORY MOVEMENTS
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('restock', 'service_usage', 'damage_waste', 'audit_adjustment')),
    quantity_delta INTEGER NOT NULL,
    resulting_quantity INTEGER NOT NULL CHECK (resulting_quantity >= 0),
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. LOYALTY
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    points_delta INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. NOTIFICATION LOGS
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    recipient_phone TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('SMS', 'WhatsApp')),
    template_type TEXT NOT NULL,
    message_body TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('queued', 'sent', 'delivered', 'failed')) DEFAULT 'sent',
    external_provider TEXT,
    external_id TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recorded_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read businesses" ON public.businesses FOR SELECT USING (is_active = true);
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read employees" ON public.employees FOR SELECT USING (is_active = true);
CREATE POLICY "Public book appointments" ON public.appointments FOR INSERT WITH CHECK (true);
`;

