import React, { useState, useEffect } from 'react';
import { AppViewRole, Appointment, Service, StaffMember } from './types';
import { 
  INITIAL_SERVICES, 
  INITIAL_STAFF, 
  getStoredAppointments, 
  getStoredInventory 
} from './services/dataStorage';

import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServiceMenu } from './components/ServiceMenu';
import { StylistShowcase } from './components/StylistShowcase';
import { SanctuaryExperience } from './components/SanctuaryExperience';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';

import { BookingModal } from './components/BookingModal';
import { AppointmentTrackerModal } from './components/AppointmentTrackerModal';
import { OwnerDashboard } from './components/OwnerDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { CommercialModal } from './components/CommercialModal';
import { SupabaseSchemaModal } from './components/SupabaseSchemaModal';

export default function App() {
  const [currentRole, setCurrentRole] = useState<AppViewRole>('customer');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inventory, setInventory] = useState(getStoredInventory());
  const [services] = useState<Service[]>(INITIAL_SERVICES);
  const [staff] = useState<StaffMember[]>(INITIAL_STAFF);

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isCommercialOpen, setIsCommercialOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);

  // Pre-selected for booking
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const refreshData = () => {
    setAppointments(getStoredAppointments());
    setInventory(getStoredInventory());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleOpenBooking = (svc?: Service, stf?: StaffMember) => {
    setSelectedService(svc || null);
    setSelectedStaff(stf || null);
    setIsBookingOpen(true);
  };

  const handleAppointmentCreated = (newApt: Appointment) => {
    refreshData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#18181B]">
      {/* Persona & Architecture Switcher Bar */}
      <RoleSwitcherBar
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        onOpenSupabaseModal={() => setIsSupabaseOpen(true)}
        onOpenCommercialModal={() => setIsCommercialOpen(true)}
      />

      {/* Main View Router based on Persona */}
      {currentRole === 'customer' && (
        <main className="flex-1">
          {/* Top Navbar */}
          <Navbar
            onOpenBooking={() => handleOpenBooking()}
            onOpenTracker={() => setIsTrackerOpen(true)}
          />

          {/* Hero Section with Luxury Photography */}
          <HeroSection
            onOpenBooking={() => handleOpenBooking()}
            onExploreServices={() => {
              const el = document.getElementById('services');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Service Menu & Pricing */}
          <ServiceMenu
            services={services}
            onSelectService={svc => handleOpenBooking(svc)}
          />

          {/* Master Stylists & Barbers Showcase */}
          <StylistShowcase
            staff={staff}
            onSelectStaff={stf => handleOpenBooking(undefined, stf)}
          />

          {/* Luxury Hygiene, Amenities & Testimonials */}
          <SanctuaryExperience />

          {/* Kutus Location & Directions */}
          <LocationSection />

          {/* Footer */}
          <Footer
            onOpenBooking={() => handleOpenBooking()}
            onOpenTracker={() => setIsTrackerOpen(true)}
            onOpenCommercialModal={() => setIsCommercialOpen(true)}
            onOpenSupabaseModal={() => setIsSupabaseOpen(true)}
          />

          {/* Mobile Bottom Booking Bar (complies with 15% mobile sticky cap) */}
          <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E8E2D9] flex items-center justify-between gap-3 shadow-lg">
            <div className="text-xs">
              <span className="font-bold text-[#18181B] block">Aurum Kutus</span>
              <span className="text-[#9A7B50] font-mono text-[11px]">From KES 1,200</span>
            </div>
            <button
              onClick={() => handleOpenBooking()}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-colors shadow-xs"
            >
              Book Chair
            </button>
          </div>
        </main>
      )}

      {currentRole === 'owner' && (
        <main className="flex-1">
          <OwnerDashboard
            appointments={appointments}
            services={services}
            staff={staff}
            inventory={inventory}
            onRefreshData={refreshData}
            onOpenCommercialModal={() => setIsCommercialOpen(true)}
          />
        </main>
      )}

      {currentRole === 'staff' && (
        <main className="flex-1">
          <StaffDashboard
            appointments={appointments}
            staff={staff}
            services={services}
            onRefreshData={refreshData}
          />
        </main>
      )}

      {/* Interactive Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        services={services}
        staff={staff}
        initialService={selectedService}
        initialStaff={selectedStaff}
        onAppointmentCreated={handleAppointmentCreated}
      />

      <AppointmentTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

      <CommercialModal
        isOpen={isCommercialOpen}
        onClose={() => setIsCommercialOpen(false)}
      />

      <SupabaseSchemaModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
      />
    </div>
  );
}
