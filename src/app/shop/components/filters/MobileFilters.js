'use client';

import { useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useFilters } from './FilterProvider';
import { createPortal } from 'react-dom';

function BottomSheet({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-out">
        <div className="bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
          {/* Handle */}
          <div className="flex justify-center p-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
          
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function MobileFilters() {
  const { filters, setFilter } = useFilters();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
      >
        <SlidersHorizontal className="h-5 w-5 mr-2" />
        <span>Filters</span>
      </button>

      {/* Filter Bottom Sheet */}
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h2 className="text-lg font-medium">Filters</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-2">Price Range</h3>
            <div className="flex items-center space-x-2">
              <div className="w-24">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-2 py-1.5 border rounded-md text-sm"
                  value={filters.priceRange.min || ''}
                  onChange={(e) => setFilter('priceRange', { ...filters.priceRange, min: e.target.value })}
                />
              </div>
              <span className="text-gray-500 text-sm">to</span>
              <div className="w-24">
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-2 py-1.5 border rounded-md text-sm"
                  value={filters.priceRange.max || ''}
                  onChange={(e) => setFilter('priceRange', { ...filters.priceRange, max: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="font-medium mb-2">Rating</h3>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={filters.rating || ''}
              onChange={(e) => setFilter('rating', e.target.value)}
            >
              <option value="">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Stars</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <h3 className="font-medium mb-2">Availability</h3>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={filters.availability}
              onChange={(e) => setFilter('availability', e.target.value)}
            >
              <option value="all">All Items</option>
              <option value="inStock">In Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
          </div>

          {/* Material */}
          <div>
            <h3 className="font-medium mb-2">Material</h3>
            <div className="space-y-2">
              {['Cotton', 'Wool', 'Acrylic', 'Bamboo'].map((material) => (
                <label key={material} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                    checked={filters.materials.includes(material)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilter('materials', [...filters.materials, material]);
                      } else {
                        setFilter('materials', filters.materials.filter(m => m !== material));
                      }
                    }}
                  />
                  <span className="ml-2">{material}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="font-medium mb-2">Colors</h3>
            <div className="flex flex-wrap gap-3">
              {['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Black', 'White'].map((color) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    filters.colors.includes(color) 
                      ? 'border-rose-500 scale-110' 
                      : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ 
                    backgroundColor: color.toLowerCase(),
                    borderColor: color.toLowerCase() === 'white' ? '#e5e7eb' : undefined
                  }}
                  onClick={() => {
                    if (filters.colors.includes(color)) {
                      setFilter('colors', filters.colors.filter(c => c !== color));
                    } else {
                      setFilter('colors', [...filters.colors, color]);
                    }
                  }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="p-4 border-t">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-rose-600 text-white py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
