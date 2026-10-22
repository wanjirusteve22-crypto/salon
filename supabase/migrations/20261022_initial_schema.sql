-- ============================================================================
-- SalonFlow Kenya - Production Supabase Migration
-- Target: Multi-tenant Beauty, Salon & Executive Barbershop Management
-- Primary Tenant: Aurum Studio & Executive Barber (Kutus, Kirinyaga County, Kenya)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. BUSINESSES (Multi-Tenant Master Table)
-- ----------------------------------------------------------------------------
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
    opening_hours JSONB NOT NULL DEFAULT '{
        "weekdays": "7:30 AM — 8:30 PM",
        "saturday": "7:00 AM — 9:00 PM",
        "sunday": "9:30 AM — 7:00 PM"
    }'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);

-- ----------------------------------------------------------------------------
-- 2. USER PROFILES & ROLES (Linked to Supabase auth.users)
-- ----------------------------------------------------------------------------
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

CREATE INDEX IF NOT EXISTS idx_user_profiles_business_role ON public.user_profiles(business_id, role);

-- ----------------------------------------------------------------------------
-- 3. SERVICES (Treatment Menu & Pricing)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Braiding & Locs', 
        'Barbering & Grooming', 
        'Hair Styling & Color', 
        'Nails & Spa', 
        'Facials & Skin', 
        'Bridal & Packages'
    )),
    price_kes NUMERIC(10,2) NOT NULL CHECK (price_kes >= 0),
    duration_min INTEGER NOT NULL CHECK (duration_min >= 15),
    description TEXT,
    image_url TEXT,
    highlights TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_business ON public.services(business_id, is_active);

-- ----------------------------------------------------------------------------
-- 4. EMPLOYEES & STAFF
-- ----------------------------------------------------------------------------
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

CREATE INDEX IF NOT EXISTS idx_employees_business ON public.employees(business_id, is_active);

-- ----------------------------------------------------------------------------
-- 5. STAFF AVAILABILITY & WEEKLY SHIFT SCHEDULES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staff_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 1=Mon, ..., 6=Sat
    is_working BOOLEAN DEFAULT TRUE,
    start_time TIME NOT NULL DEFAULT '08:00:00',
    end_time TIME NOT NULL DEFAULT '18:30:00',
    UNIQUE (employee_id, day_of_week)
);

CREATE INDEX IF NOT EXISTS idx_staff_availability_emp_day ON public.staff_availability(employee_id, day_of_week);

-- ----------------------------------------------------------------------------
-- 6. CUSTOMERS (Directory & Loyalty Record)
-- ----------------------------------------------------------------------------
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

CREATE INDEX IF NOT EXISTS idx_customers_business_phone ON public.customers(business_id, phone);

-- ----------------------------------------------------------------------------
-- 7. APPOINTMENTS (Booking & Chair Queue)
-- ----------------------------------------------------------------------------
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

CREATE INDEX IF NOT EXISTS idx_appointments_business_date ON public.appointments(business_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_employee_date ON public.appointments(employee_id, appointment_date, start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON public.appointments(customer_phone);

-- ----------------------------------------------------------------------------
-- 8. APPOINTMENT STATUS HISTORY (Audit Trail)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointment_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_status_history_appointment ON public.appointment_status_history(appointment_id);

-- ----------------------------------------------------------------------------
-- 9. RECORDED SALES (Financial Ledger)
-- ----------------------------------------------------------------------------
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

CREATE INDEX IF NOT EXISTS idx_sales_business_timestamp ON public.recorded_sales(business_id, sale_timestamp);
CREATE INDEX IF NOT EXISTS idx_sales_employee ON public.recorded_sales(employee_id);

-- ============================================================================
-- DATABASE FUNCTIONS & SAFE SERVER-SIDE VALIDATION
-- ============================================================================

-- Function: Check whether an employee has an appointment overlap
CREATE OR REPLACE FUNCTION public.fn_check_appointment_conflict(
    p_employee_id UUID,
    p_date DATE,
    p_start_time TIME,
    p_end_time TIME,
    p_exclude_appointment_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_conflict_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO v_conflict_count
    FROM public.appointments
    WHERE employee_id = p_employee_id
      AND appointment_date = p_date
      AND status IN ('scheduled', 'in_chair')
      AND (p_exclude_appointment_id IS NULL OR id <> p_exclude_appointment_id)
      AND (
          (start_time, end_time) OVERLAPS (p_start_time, p_end_time)
      );

    RETURN (v_conflict_count > 0);
END;
$$;

-- Trigger: Automatically prevent overlapping appointments before INSERT or UPDATE
CREATE OR REPLACE FUNCTION public.trg_enforce_no_appointment_conflict()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only check active scheduled or in_chair appointments
    IF NEW.status IN ('scheduled', 'in_chair') THEN
        IF public.fn_check_appointment_conflict(
            NEW.employee_id, 
            NEW.appointment_date, 
            NEW.start_time, 
            NEW.end_time, 
            NEW.id
        ) THEN
            RAISE EXCEPTION 'Booking conflict: The selected master stylist already has a scheduled client between % and % on %.',
                NEW.start_time, NEW.end_time, NEW.appointment_date;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_booking_conflict ON public.appointments;
CREATE TRIGGER trg_prevent_booking_conflict
BEFORE INSERT OR UPDATE OF employee_id, appointment_date, start_time, end_time, status
ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.trg_enforce_no_appointment_conflict();

-- Trigger: Record status change audit history automatically
CREATE OR REPLACE FUNCTION public.trg_record_appointment_status_history()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF (TG_OP = 'INSERT') OR (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO public.appointment_status_history (
            appointment_id,
            previous_status,
            new_status,
            changed_by,
            notes
        ) VALUES (
            NEW.id,
            CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE OLD.status END,
            NEW.status,
            auth.uid(),
            COALESCE(NEW.notes, 'Status transitioned to ' || NEW.status)
        );
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_appointment_history_audit ON public.appointments;
CREATE TRIGGER trg_appointment_history_audit
AFTER INSERT OR UPDATE OF status
ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.trg_record_appointment_status_history();

-- Trigger: Automatically generate recorded_sales row and update customer totals upon completion
CREATE OR REPLACE FUNCTION public.trg_record_sale_on_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_comm_rate NUMERIC(3,2);
    v_comm_kes NUMERIC(10,2);
    v_net_kes NUMERIC(10,2);
BEGIN
    -- When an appointment becomes completed and paid
    IF (NEW.status = 'completed' AND NEW.payment_status = 'paid') AND
       (OLD.status <> 'completed' OR OLD.payment_status <> 'paid' OR TG_OP = 'INSERT') THEN
       
        -- Get employee commission rate
        SELECT commission_rate INTO v_comm_rate
        FROM public.employees
        WHERE id = NEW.employee_id;
        
        IF v_comm_rate IS NULL THEN
            v_comm_rate := 0.35;
        END IF;
        
        v_comm_kes := ROUND(NEW.price_kes * v_comm_rate, 2);
        v_net_kes := NEW.price_kes - v_comm_kes;
        
        -- Insert into recorded_sales if not already present
        INSERT INTO public.recorded_sales (
            business_id,
            appointment_id,
            service_id,
            employee_id,
            customer_id,
            amount_kes,
            commission_rate,
            commission_kes,
            net_business_kes,
            payment_method,
            mpesa_reference,
            sale_timestamp
        ) VALUES (
            NEW.business_id,
            NEW.id,
            NEW.service_id,
            NEW.employee_id,
            NEW.customer_id,
            NEW.price_kes,
            v_comm_rate,
            v_comm_kes,
            v_net_kes,
            NEW.payment_method,
            NEW.mpesa_reference,
            NOW()
        );
        
        -- Update customer visit count and lifetime spend if linked
        IF NEW.customer_id IS NOT NULL THEN
            UPDATE public.customers
            SET total_visits = total_visits + 1,
                total_spent_kes = total_spent_kes + NEW.price_kes,
                last_visit_date = NEW.appointment_date,
                updated_at = NOW()
            WHERE id = NEW.customer_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sale_on_appointment_completion ON public.appointments;
CREATE TRIGGER trg_sale_on_appointment_completion
AFTER INSERT OR UPDATE OF status, payment_status
ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.trg_record_sale_on_completion();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recorded_sales ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.auth_user_business_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT business_id FROM public.user_profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.auth_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$;

-- Businesses: Public can view active businesses; Owners can update their own
CREATE POLICY "Public read active businesses"
ON public.businesses FOR SELECT
USING (is_active = TRUE);

CREATE POLICY "Owners update own business"
ON public.businesses FOR UPDATE
USING (id = public.auth_user_business_id() AND public.auth_user_role() = 'owner');

-- User Profiles: Users can view their own profile; Owners can view employees in their business
CREATE POLICY "Users read own profile"
ON public.user_profiles FOR SELECT
USING (id = auth.uid() OR (business_id = public.auth_user_business_id() AND public.auth_user_role() = 'owner'));

CREATE POLICY "Users update own profile"
ON public.user_profiles FOR UPDATE
USING (id = auth.uid());

-- Services: Public can read active services; Owners can manage services for their business
CREATE POLICY "Public read active services"
ON public.services FOR SELECT
USING (is_active = TRUE);

CREATE POLICY "Owners insert services"
ON public.services FOR INSERT
WITH CHECK (business_id = public.auth_user_business_id() AND public.auth_user_role() = 'owner');

CREATE POLICY "Owners update services"
ON public.services FOR UPDATE
USING (business_id = public.auth_user_business_id() AND public.auth_user_role() = 'owner');

-- Employees & Staff: Public read; Owners manage
CREATE POLICY "Public read active employees"
ON public.employees FOR SELECT
USING (is_active = TRUE);

CREATE POLICY "Owners manage employees"
ON public.employees FOR ALL
USING (business_id = public.auth_user_business_id() AND public.auth_user_role() = 'owner');

-- Staff Availability: Public read; Owners/Employee manage
CREATE POLICY "Public read staff availability"
ON public.staff_availability FOR SELECT
USING (TRUE);

CREATE POLICY "Staff manage own availability"
ON public.staff_availability FOR ALL
USING (
    employee_id IN (
        SELECT id FROM public.employees 
        WHERE user_id = auth.uid() OR business_id = public.auth_user_business_id()
    )
);

-- Customers: Owners & Employees of the business can read and update; Customers read own
CREATE POLICY "Staff read business customers"
ON public.customers FOR SELECT
USING (
    business_id = public.auth_user_business_id() 
    OR user_id = auth.uid()
);

CREATE POLICY "Staff manage business customers"
ON public.customers FOR ALL
USING (business_id = public.auth_user_business_id());

-- Appointments:
-- Public can create bookings
CREATE POLICY "Public create appointments"
ON public.appointments FOR INSERT
WITH CHECK (TRUE);

-- Customers can view their own appointments (by user_id, phone match, or booking_ref)
-- Staff & Owners can view and manage appointments for their business
CREATE POLICY "Appointments read access"
ON public.appointments FOR SELECT
USING (
    business_id = public.auth_user_business_id()
    OR customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid())
    OR auth.role() = 'anon' -- Allows booking ref tracker queries
);

CREATE POLICY "Appointments update access"
ON public.appointments FOR UPDATE
USING (
    business_id = public.auth_user_business_id()
);

-- Recorded Sales:
-- Owners view all sales in their business; Employees view their own commissions
CREATE POLICY "Sales read access"
ON public.recorded_sales FOR SELECT
USING (
    (business_id = public.auth_user_business_id() AND public.auth_user_role() = 'owner')
    OR (employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()))
);

-- ============================================================================
-- SAFE INITIAL SEED DATA (Kutus, Kirinyaga County Primary Sanctuary)
-- ============================================================================

INSERT INTO public.businesses (
    id, name, slug, county, town, address, landmark, phone, email, mpesa_till, mpesa_paybill
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Aurum Studio & Executive Barber',
    'aurum-kutus',
    'Kirinyaga',
    'Kutus',
    'Kutus Central Plaza, 2nd Floor, Suite 204',
    'Opposite Equity Bank, 200m from Kirinyaga University Junction',
    '+254 722 894 120',
    'concierge@aurumsalonflow.co.ke',
    '892341',
    '522522 (Acc: AURUM)'
) ON CONFLICT (id) DO NOTHING;

-- Seed Employees for Aurum Kutus
INSERT INTO public.employees (
    id, business_id, name, role_title, phone, rating, reviews_count, specialties, commission_rate, bio
) VALUES 
(
    'e0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Wanjiku "Shiku" Kariuki',
    'Lead Braider & Natural Locs Director',
    '+254 712 345 601',
    4.95,
    142,
    ARRAY['Knotless Braids', 'Loc Retwist', 'Bridal Hair Updos'],
    0.35,
    '8 years shaping trendsetting African protective styles with a gentle hand and precise geometric partings in Kutus.'
),
(
    'e0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'Mwangi "DJ" Kimani',
    'Master Barber & Grooming Specialist',
    '+254 723 456 702',
    4.98,
    218,
    ARRAY['Skin Fade', 'Beard Contouring', 'Hot Towel Rituals'],
    0.40,
    'Renowned for razor-sharp tapers and relaxing hot towel therapies. Barber of choice for Kirinyaga professionals.'
),
(
    'e0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'Joy Nyambura',
    'Senior Nail Artist & Aesthetician',
    '+254 734 567 803',
    4.90,
    96,
    ARRAY['BIAB Gel Overlay', 'Russian Manicure', 'Aroma Spa Pedicure', 'Clay Facials'],
    0.35,
    'Specialist in natural nail restoration, long-lasting builder gels, and relaxing reflexology pedicures.'
),
(
    'e0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000001',
    'Kevin Mutugi',
    'Color & Texture Specialist',
    '+254 745 678 904',
    4.88,
    64,
    ARRAY['Silk Press', 'Balayage & Ombre', 'Scalp Detox'],
    0.30,
    'Passionate about healthy heat management, gloss toners, and bespoke scalp rejuvenating treatments.'
) ON CONFLICT (id) DO NOTHING;

-- Seed Services
INSERT INTO public.services (
    id, business_id, name, category, price_kes, duration_min, description, highlights, is_active
) VALUES 
(
    's0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Bohemian Knotless Braids & Curls',
    'Braiding & Locs',
    3200,
    180,
    'Tension-free lightweight knotless braids with raw human curl curls and scalp oil nourishment.',
    ARRAY['Tension-free technique', 'Edge treatment included', 'Warm tea or herbal beverage'],
    TRUE
),
(
    's0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'Executive Fade, Beard Sculpt & Hot Towel',
    'Barbering & Grooming',
    1200,
    50,
    'Precision taper or low skin fade, razor sharp beard contour, organic eucalyptus hot towel wrap and head massage.',
    ARRAY['Cut-throat razor finish', 'Eucalyptus steam wrap', 'Beard balm conditioning'],
    TRUE
),
(
    's0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'BIAB Russian Manicure & Nail Art',
    'Nails & Spa',
    2200,
    75,
    'Builder In A Bottle structured overlay for natural nail strength with French chrome tips and cuticle exfoliation.',
    ARRAY['4-week chip resistant', 'Custom minimalist nail art', 'Hand & wrist aromatherapy massage'],
    TRUE
),
(
    's0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000001',
    'Organic Eucalyptus Facial & Clay Mask',
    'Facials & Skin',
    2600,
    60,
    'Deep pore detox, steaming herbal eucalyptus mist, organic bentonite clay purifying mask, and jade stone facial lymphatic massage.',
    ARRAY['Pore extraction & toner', 'Dead skin exfoliation', 'Botanical hyaluronic serum'],
    TRUE
),
(
    's0000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000001',
    'Silk Press & Botanical Deep Hydration',
    'Hair Styling & Color',
    2800,
    90,
    'Clarifying shampoo, ultra-rich steam conditioning masque, heat protectant infusion, and bone-straight glass shine.',
    ARRAY['Zero chemical relaxer', 'Infrared micro-mist steam', 'Split-end trim included'],
    TRUE
) ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 10. EXPENSES (Operational Cost Ledger)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN (
        'Rent & Space', 
        'Barber & Salon Supplies', 
        'Utilities & Generator', 
        'Staff Refreshments', 
        'Marketing & Software', 
        'Maintenance & Cleaning'
    )),
    title TEXT NOT NULL,
    amount_kes NUMERIC(10,2) NOT NULL CHECK (amount_kes >= 0),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    receipt_ref TEXT,
    notes TEXT,
    recorded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_business_date ON public.expenses(business_id, expense_date);

-- ----------------------------------------------------------------------------
-- 11. INVENTORY ITEMS & MOVEMENTS (Stock Intelligence)
-- ----------------------------------------------------------------------------
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_business ON public.inventory_items(business_id);

CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('restock', 'service_usage', 'damage_waste', 'audit_adjustment')),
    quantity_delta INTEGER NOT NULL,
    resulting_quantity INTEGER NOT NULL CHECK (resulting_quantity >= 0),
    reason TEXT NOT NULL,
    recorded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_item ON public.inventory_movements(item_id, created_at);

-- ----------------------------------------------------------------------------
-- 12. LOYALTY TRANSACTIONS & REWARDS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    points_delta INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_customer ON public.loyalty_transactions(customer_id);

-- ----------------------------------------------------------------------------
-- 13. NOTIFICATION LOGS (SMS / WhatsApp Dispatch Audit)
-- ----------------------------------------------------------------------------
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

CREATE INDEX IF NOT EXISTS idx_notification_logs_business ON public.notification_logs(business_id, sent_at);

-- RLS Enablement & Policies for Operational Tables
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage expenses" ON public.expenses FOR ALL 
USING (business_id = public.auth_user_business_id() AND public.auth_user_role() = 'owner');

CREATE POLICY "Staff read inventory" ON public.inventory_items FOR SELECT 
USING (business_id = public.auth_user_business_id());

CREATE POLICY "Owners manage inventory" ON public.inventory_items FOR ALL 
USING (business_id = public.auth_user_business_id() AND public.auth_user_role() = 'owner');

CREATE POLICY "Staff read inventory movements" ON public.inventory_movements FOR SELECT 
USING (business_id = public.auth_user_business_id());

CREATE POLICY "Staff record inventory movements" ON public.inventory_movements FOR INSERT 
WITH CHECK (business_id = public.auth_user_business_id());

CREATE POLICY "Staff read loyalty" ON public.loyalty_transactions FOR SELECT 
USING (business_id = public.auth_user_business_id());

CREATE POLICY "Staff read notification logs" ON public.notification_logs FOR SELECT 
USING (business_id = public.auth_user_business_id());

