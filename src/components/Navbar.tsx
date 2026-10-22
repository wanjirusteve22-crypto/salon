import React, { useState } from 'react';
import { PublicPage } from '../types';
import { Menu, X, Calendar, Search } from 'lucide-react';

interface NavbarProps {
  activePage: PublicPage;
  onSelectPage: (page: PublicPage) => void;
  onOpenBooking: () => void;
  onOpenTracker: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onSelectPage,
  onOpenBooking,
  onOpenTracker,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: PublicPage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Services', page: 'services' },
    { label: 'Artisans', page: 'staff' },
    { label: 'Gallery', page: 'gallery' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: PublicPage) => {
    onSelectPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D9] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="font-serif text-2xl font-bold tracking-tight text-[#18181B] whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer text-left"
        >
          <span>AURUM</span>
          <span className="font-sans text-xs uppercase tracking-widest text-[#9A7B50] font-semibold border-l border-[#D9D2C7] pl-2">
            Kutus · SalonFlow
          </span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#52525B]">
          {navLinks.map(item => (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`hover:text-[#18181B] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePage === item.page ? 'text-[#18181B] font-bold border-b-2 border-[#C5A880] pb-0.5' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={onOpenTracker}
            className="hover:text-[#18181B] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-[#18181B] cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#9A7B50]" />
            Find Appointment
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenBooking}
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-all shadow-xs flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Appointment
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#18181B] hover:text-[#9A7B50] focus:outline-none cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E8E2D9] px-6 py-4 space-y-2">
          {navLinks.map(item => (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`w-full text-left py-2.5 text-sm font-medium border-b border-[#F3EFEA] ${
                activePage === item.page ? 'text-[#18181B] font-bold' : 'text-[#52525B]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTracker();
            }}
            className="w-full text-left py-2.5 text-sm font-medium text-[#18181B] flex items-center gap-2 border-b border-[#F3EFEA]"
          >
            <Search className="w-4 h-4 text-[#9A7B50]" />
            Find Appointment
          </button>
          <div className="pt-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] rounded shadow-xs"
            >
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
