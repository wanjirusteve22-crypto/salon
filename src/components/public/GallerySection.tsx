import React, { useState } from 'react';
import { GalleryItem } from '../../types';
import { INITIAL_GALLERY } from '../../services/dataStorage';
import { Camera, Calendar, X, ZoomIn } from 'lucide-react';

interface GallerySectionProps {
  onBookService: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onBookService }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Braids & Locs', 'Barbering', 'Nails', 'Facials & Spa', 'Sanctuary Interior'];

  const filteredItems = INITIAL_GALLERY.filter(item => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  return (
    <section id="gallery" className="py-16 lg:py-24 bg-[#FAF8F5] border-b border-[#E8E2D9]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#9A7B50] mb-2">
              The Visual Archive
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18181B]" style={{ textWrap: 'balance' }}>
              Artistry crafted in our Kutus sanctuary.
            </h2>
            <p className="text-sm text-[#71717A] mt-2 max-w-xl">
              Authentic portraits, master fades, bridal crowns, and relaxing spa atmospheres photographed on-site at Aurum SalonFlow.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#18181B] text-white font-semibold'
                    : 'bg-[#F3EFEA] text-[#52525B] hover:text-[#18181B] hover:bg-[#E8E2D9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative bg-[#FDFBF7] border border-[#E8E2D9] rounded-lg overflow-hidden cursor-pointer hover:border-[#C5A880] transition-all"
            >
              <div className="aspect-4/3 w-full overflow-hidden bg-[#E8E2D9] relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18181B]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                  <div className="text-white space-y-1">
                    <span className="text-[11px] font-mono text-[#E5D3B3] uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <span className="font-serif font-bold text-base block">
                      {item.title}
                    </span>
                  </div>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-[#18181B] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
                  <ZoomIn className="w-4 h-4 text-[#9A7B50]" />
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E2D9]">
                <div className="text-xs font-semibold text-[#18181B] line-clamp-1">
                  {item.title}
                </div>
                <div className="text-[11px] text-[#71717A] mt-1 flex items-center justify-between">
                  <span>{item.category}</span>
                  {item.artisanName && (
                    <span className="text-[#9A7B50] font-medium">By {item.artisanName}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#18181B]/80 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-[#18181B] text-white px-6 py-4 flex items-center justify-between border-b border-[#27272A]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#C5A880] tracking-wider block">
                  {activeItem.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  {activeItem.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="p-1 rounded text-[#A1A1AA] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-7 bg-[#18181B] flex items-center justify-center p-2">
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  className="max-h-[420px] w-full object-contain rounded"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="md:col-span-5 p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs uppercase font-semibold text-[#71717A] block">
                      Description & Craft
                    </span>
                    <p className="text-xs text-[#52525B] leading-relaxed mt-1">
                      {activeItem.description}
                    </p>
                  </div>

                  {activeItem.artisanName && (
                    <div className="pt-3 border-t border-[#E8E2D9]">
                      <span className="text-xs uppercase font-semibold text-[#71717A] block">
                        Master Artisan
                      </span>
                      <div className="text-sm font-bold text-[#18181B] mt-0.5">
                        {activeItem.artisanName}
                      </div>
                      <div className="text-xs text-[#9A7B50]">Resident Stylist at Aurum Kutus</div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#E8E2D9] space-y-2">
                  <button
                    onClick={() => {
                      setActiveItem(null);
                      onBookService();
                    }}
                    className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-[#18181B] bg-[#C5A880] hover:bg-[#B89758] rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book This Treatment</span>
                  </button>
                  <button
                    onClick={() => setActiveItem(null)}
                    className="w-full py-2 text-xs font-medium text-[#71717A] hover:text-[#18181B]"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
