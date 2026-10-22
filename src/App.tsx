import React, { useState, useEffect } from 'react';
import { AppViewRole, Appointment, PublicPage, Service, StaffMember } from './types';
import { 
  getStoredAppointments, 
  getStoredCustomers, 
  getStoredInventory, 
  getStoredServices, 
  getStoredStaff, 
  getStoredTenant 
} from './services/dataStorage';

import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServiceMenu } from './components/ServiceMenu';
import { StylistShowcase } from './components/StylistShowcase';
import { SanctuaryExperience } from './components/SanctuaryExperience';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';

// Public Pages
import { ServicesPage } from './components/public/ServicesPage';
import { StaffPage } from './components/public/StaffPage';
import { GallerySection } from './components/public/GallerySection';
import { ContactPage } from './components/public/ContactPage';
import { LegalPages } from './components/public/LegalPages';

// Dashboards & Modals
import { BookingModal } from './components/BookingModal';
import { AppointmentTrackerModal } from './components/AppointmentTrackerModal';
import { OwnerDashboard } from './components/OwnerDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { CommercialModal } from './components/CommercialModal';
import { SupabaseSchemaModal } from './components/SupabaseSchemaModal';

export default function App() {
  const [currentRole, setCurrentRole] = useState<AppViewRole>('customer');
  const [publicPage, setPublicPage] = useState<PublicPage>('home');

  // Stored State
  const [tenant, setTenant] = useState(getStoredTenant());
  const [services, setServices] = useState<Service[]>(getStoredServices());
  const [staff, setStaff] = useState<StaffMember[]>(getStoredStaff());
  const [appointments, setAppointments] = useState<Appointment[]>(getStoredAppointments());
  const [customers, setCustomers] = useState(getStoredCustomers());
  const [inventory, setInventory] = useState(getStoredInventory());

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isCommercialOpen, setIsCommercialOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);

  // Pre-selected for booking
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const refreshData = () => {
    setTenant(getStoredTenant());
    setServices(getStoredServices());
    setStaff(getStoredStaff());
    setAppointments(getStoredAppointments());
    setCustomers(getStoredCustomers());
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
        onSelectRole={role => {
          setCurrentRole(role);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSupabaseModal={() => setIsSupabaseOpen(true)}
        onOpenCommercialModal={() => setIsCommercialOpen(true)}
      />

      {/* Main View Router based on Persona */}
      {currentRole === 'customer' && (
        <main className="flex-1">
          {/* Top Navbar */}
          <Navbar
            activePage={publicPage}
            onSelectPage={setPublicPage}
            onOpenBooking={() => handleOpenBooking()}
            onOpenTracker={() => setIsTrackerOpen(true)}
          />

          {/* PAGE: HOME */}
          {publicPage === 'home' && (
            <>
              <HeroSection
                onOpenBooking={() => handleOpenBooking()}
                onExploreServices={() => setPublicPage('services')}
              />
              <ServiceMenu
                services={services}
                onSelectService={svc => handleOpenBooking(svc)}
              />
              <StylistShowcase
                staff={staff}
                onSelectStaff={stf => handleOpenBooking(undefined, stf)}
              />
              <SanctuaryExperience />
              <LocationSection />
            </>
          )}

          {/* PAGE: SERVICES */}
          {publicPage === 'services' && (
            <ServicesPage
              services={services}
              onSelectService={svc => handleOpenBooking(svc)}
            />
          )}

          {/* PAGE: STAFF / MASTER COLLECTIVE */}
          {publicPage === 'staff' && (
            <StaffPage
              staff={staff}
              onSelectStaff={stf => handleOpenBooking(undefined, stf)}
            />
          )}

          {/* PAGE: GALLERY */}
          {publicPage === 'gallery' && (
            <GallerySection
              onBookService={() => handleOpenBooking()}
            />
          )}

          {/* PAGE: CONTACT */}
          {publicPage === 'contact' && (
            <ContactPage
              tenant={tenant}
            />
          )}

          {/* PAGE: PRIVACY POLICY */}
          {publicPage === 'privacy' && (
            <LegalPages
              tenant={tenant}
              type="privacy"
            />
          )}

          {/* PAGE: TERMS OF SERVICE */}
          {publicPage === 'terms' && (
            <LegalPages
              tenant={tenant}
              type="terms"
            />
          )}

          {/* Footer */}
          <Footer
            tenant={tenant}
            onSelectPage={setPublicPage}
            onOpenBooking={() => handleOpenBooking()}
            onOpenTracker={() => setIsTrackerOpen(true)}
            onOpenCommercialModal={() => setIsCommercialOpen(true)}
            onOpenSupabaseModal={() => setIsSupabaseOpen(true)}
          />

          {/* Mobile Bottom Booking Bar */}
          <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E8E2D9] flex items-center justify-between gap-3 shadow-lg">
            <div className="text-xs">
              <span className="font-bold text-[#18181B] block">{tenant.name.split('&')[0]}</span>
              <span className="text-[#9A7B50] font-mono text-[11px]">Kutus · KES 1,200+</span>
            </div>
            <button
              onClick={() => handleOpenBooking()}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-colors shadow-xs cursor-pointer"
            >
              Book Chair
            </button>
          </div>
        </main>
      )}

      {currentRole === 'owner' && (
        <main className="flex-1">
          <OwnerDashboard
            tenant={tenant}
            appointments={appointments}
            services={services}
            staff={staff}
            inventory={inventory}
            customers={customers}
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
