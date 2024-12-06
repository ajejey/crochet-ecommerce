'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useFilters } from './FilterProvider';

// Filter Section Component
function FilterSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="mt-4 space-y-4">{children}</div>}
    </div>
  );
}

// Price Range Input
function PriceRangeInput({ value, onChange, placeholder }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-24 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
    />
  );
}

// Checkbox Filter Option
function CheckboxOption({ label, checked, onChange }) {
  return (
    <label className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
      />
      <span>{label}</span>
    </label>
  );
}

// Star Rating Filter Option
function RatingOption({ rating, selected, onChange }) {
  return (
    <button
      onClick={() => onChange(rating)}
      className={`flex items-center space-x-2 text-sm ${
        selected ? 'text-gray-900' : 'text-gray-600'
      } hover:text-gray-900`}
    >
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-amber-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span>{`${rating} & Up`}</span>
    </button>
  );
}

export default function DesktopFilters() {
  const { filters, setFilter, resetFilter } = useFilters();

  return (
    <div className="w-64 space-y-8 p-4">
      <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
      
      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="flex items-center gap-2">
          <PriceRangeInput
            value={filters.priceRange.min || ''}
            onChange={(value) => setFilter('priceRange', { ...filters.priceRange, min: value })}
            placeholder="Min"
          />
          <span className="text-gray-500">to</span>
          <PriceRangeInput
            value={filters.priceRange.max || ''}
            onChange={(value) => setFilter('priceRange', { ...filters.priceRange, max: value })}
            placeholder="Max"
          />
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Rating">
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <RatingOption
              key={rating}
              rating={rating}
              selected={Number(filters.rating) === rating}
              onChange={(value) => setFilter('rating', value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <select
          className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          value={filters.availability}
          onChange={(e) => setFilter('availability', e.target.value)}
        >
          <option value="all">All Items</option>
          <option value="inStock">In Stock</option>
          <option value="outOfStock">Out of Stock</option>
        </select>
      </FilterSection>

      {/* Material */}
      <FilterSection title="Material">
        <div className="space-y-3">
          {['Cotton', 'Wool', 'Acrylic', 'Bamboo'].map((material) => (
            <CheckboxOption
              key={material}
              label={material}
              checked={filters.materials.includes(material)}
              onChange={(e) => {
                if (e.target.checked) {
                  setFilter('materials', [...filters.materials, material]);
                } else {
                  setFilter('materials', filters.materials.filter(m => m !== material));
                }
              }}
            />
          ))}
        </div>
      </FilterSection>

      {/* Colors */}
      <FilterSection title="Colors">
        <div className="flex flex-wrap gap-3">
          {['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Black', 'White'].map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border shadow-sm transition-all duration-200 ${
                filters.colors.includes(color) 
                  ? 'ring-2 ring-rose-500 ring-offset-2' 
                  : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
              }`}
              style={{ 
                backgroundColor: color.toLowerCase(),
                borderColor: ['White', 'Yellow'].includes(color) ? '#e5e7eb' : 'transparent'
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
      </FilterSection>
    </div>
  );
}
