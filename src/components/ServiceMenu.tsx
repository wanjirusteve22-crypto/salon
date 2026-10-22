import React, { useState } from 'react';
import { Service, ServiceCategory } from '../types';
import { Clock, Check, ArrowRight, Search } from 'lucide-react';

interface ServiceMenuProps {
  services: Service[];
  onSelectService: (service: Service) => void;
}

const CATEGORIES: ServiceCategory[] = [
  'All',
  'Braiding & Locs',
  'Barbering & Grooming',
  'Hair Styling & Color',
  'Nails & Spa',
  'Bridal & Packages',
];

export const ServiceMenu: React.FC<ServiceMenuProps> = ({ services, onSelectService }) => {
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
    <section id="services" className="py-16 lg:py-24 bg-[#FDFBF7] border-b border-[#E8E2D9]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#9A7B50] mb-2">
              Curated Treatment Menu
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18181B]" style={{ textWrap: 'balance' }}>
              Exceptional craftsmanship, transparent pricing.
            </h2>
            <p className="text-sm text-[#71717A] mt-2 max-w-xl">
              All treatments use verified organic botanical formulations, sterile single-use blades, and premium human braiding hair.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search braids, fades, spa..."
              className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded pl-9 pr-4 py-2 text-xs text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]"
            />
          </div>
        </div>

        {/* Category Filter Tabs (Interactive Segmented Buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === category
                  ? 'bg-[#18181B] text-[#FAF8F5] font-semibold'
                  : 'bg-[#F3EFEA] text-[#52525B] hover:text-[#18181B] hover:bg-[#E8E2D9]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-[#FAF8F5] border border-dashed border-[#D9D2C7] rounded-lg">
            <p className="text-sm text-[#71717A]">No treatments match your search filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-semibold text-[#9A7B50] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <div
                key={service.id}
                className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#C5A880] transition-all group"
              >
                {/* Service image if available */}
                {service.image && (
                  <div className="relative h-48 w-full overflow-hidden bg-[#E8E2D9]">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#18181B]/60 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3 bg-[#FAF8F5]/90 backdrop-blur-xs px-2.5 py-1 rounded text-xs font-mono font-semibold text-[#18181B] tabular-nums">
                      KES {service.priceKes.toLocaleString()}
                    </div>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Unboxed metadata without pills */}
                    <div className="flex items-center gap-2 text-xs text-[#9A7B50] font-medium mb-1">
                      <span>{service.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-[#71717A]">
                        <Clock className="w-3 h-3 text-[#9A7B50]" />
                        {service.durationMin} mins
                      </span>
                      {service.popular && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#B89758] font-semibold">Popular</span>
                        </>
                      )}
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#18181B] group-hover:text-[#9A7B50] transition-colors">
                      {service.name}
                    </h3>

                    <p className="text-xs text-[#52525B] leading-relaxed mt-2 line-clamp-3">
                      {service.description}
                    </p>

                    {/* Highlights */}
                    {service.highlights && service.highlights.length > 0 && (
                      <ul className="mt-4 space-y-1.5 pt-3 border-t border-[#F3EFEA]">
                        {service.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-[#71717A]">
                            <Check className="w-3.5 h-3.5 text-[#9A7B50] shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Card Action Row */}
                  <div className="pt-4 border-t border-[#E8E2D9] flex items-center justify-between">
                    {!service.image && (
                      <div>
                        <span className="text-xs text-[#71717A] block">Treatment Fee</span>
                        <span className="font-mono text-lg font-bold text-[#18181B] tabular-nums">
                          KES {service.priceKes.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => onSelectService(service)}
                      className="ml-auto px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#E8E2D9] group-hover:bg-[#C5A880] rounded transition-colors flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span>Reserve</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
