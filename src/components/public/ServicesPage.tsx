import React, { useState } from 'react';
import { Service, ServiceCategory } from '../../types';
import { Clock, Check, ArrowRight, Search, Sparkles } from 'lucide-react';

interface ServicesPageProps {
  services: Service[];
  onSelectService: (service: Service) => void;
}

const CATEGORIES: ServiceCategory[] = [
  'All',
  'Braiding & Locs',
  'Barbering & Grooming',
  'Hair Styling & Color',
  'Nails & Spa',
  'Facials & Skin',
  'Bridal & Packages',
];

export const ServicesPage: React.FC<ServicesPageProps> = ({ services, onSelectService }) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 lg:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#9A7B50] mb-2">
            The Treatment Collection
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18181B]" style={{ textWrap: 'balance' }}>
            Comprehensive hair styling, grooming, and skin therapies.
          </h1>
          <p className="text-sm sm:text-base text-[#52525B] mt-3 leading-relaxed">
            Every service at Aurum SalonFlow is executed with hospital-grade sanitization, certified organic botanicals, and personalized consultations in Kutus, Kirinyaga.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E8E2D9]">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === category
                    ? 'bg-[#18181B] text-white font-semibold'
                    : 'bg-[#F3EFEA] text-[#52525B] hover:text-[#18181B] hover:bg-[#E8E2D9]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search treatments..."
              className="w-full bg-white border border-[#E8E2D9] rounded pl-8 pr-3 py-1.5 text-xs text-[#18181B] focus:outline-none focus:border-[#C5A880]"
            />
          </div>
        </div>

        {/* Services Listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="bg-white border border-[#E8E2D9] rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#C5A880] transition-colors"
            >
              {service.image && (
                <div className="h-48 w-full overflow-hidden bg-[#E8E2D9] relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-[#18181B]/80 backdrop-blur-xs text-[#FAF8F5] px-2.5 py-1 rounded text-xs font-mono font-bold tabular-nums">
                    KES {service.priceKes.toLocaleString()}
                  </div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#9A7B50] font-medium mb-1">
                    <span>{service.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-[#71717A]">
                      <Clock className="w-3 h-3 text-[#9A7B50]" />
                      {service.durationMin} mins
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#18181B]">
                    {service.name}
                  </h3>

                  <p className="text-xs text-[#52525B] leading-relaxed mt-2">
                    {service.description}
                  </p>

                  {service.highlights && service.highlights.length > 0 && (
                    <ul className="mt-4 space-y-1.5 pt-3 border-t border-[#F3EFEA]">
                      {service.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#71717A]">
                          <Check className="w-3.5 h-3.5 text-[#9A7B50] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-4 border-t border-[#E8E2D9] flex items-center justify-between">
                  {!service.image && (
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-[#71717A] block">
                        Fee (KES)
                      </span>
                      <span className="font-mono text-base font-bold text-[#18181B] tabular-nums">
                        KES {service.priceKes.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => onSelectService(service)}
                    className="ml-auto px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#E8E2D9] hover:bg-[#C5A880] rounded transition-colors flex items-center gap-1.5"
                  >
                    <span>Reserve Chair</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
