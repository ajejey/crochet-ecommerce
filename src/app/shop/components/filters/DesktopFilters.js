'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useFilters } from './FilterProvider';
import { SmartFilters } from './SmartFilters';

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

// Rating Filter Option
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
  const { filters, setFilter, resetFilter, getActiveFilterCount } = useFilters();
  const activeCount = getActiveFilterCount();

  return (
    <div className="w-64 space-y-8 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
        {activeCount > 0 && (
          <button
            onClick={() => resetAllFilters()}
            className="text-sm text-rose-600 hover:text-rose-700"
          >
            Clear all
          </button>
        )}
      </div>
      
      {/* Smart Filters */}
      <SmartFilters />
      
      {/* Traditional Filters */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">
          Additional Filters
        </h3>
        
        {/* Price Range */}
        <FilterSection title="Price Range">
          <div className="flex items-center gap-2">
            <PriceRangeInput
              value={filters.priceRange.min}
              onChange={(value) => setFilter('priceRange', { ...filters.priceRange, min: value })}
              placeholder="Min"
            />
            <span className="text-gray-500">to</span>
            <PriceRangeInput
              value={filters.priceRange.max}
              onChange={(value) => setFilter('priceRange', { ...filters.priceRange, max: value })}
              placeholder="Max"
            />
          </div>
        </FilterSection>

        {/* Materials */}
        <FilterSection title="Materials">
          <div className="space-y-2">
            {['Cotton', 'Wool', 'Acrylic', 'Bamboo', 'Mixed'].map((material) => (
              <CheckboxOption
                key={material}
                label={material}
                checked={filters.materials.includes(material)}
                onChange={() => {
                  const newMaterials = filters.materials.includes(material)
                    ? filters.materials.filter(m => m !== material)
                    : [...filters.materials, material];
                  setFilter('materials', newMaterials);
                }}
              />
            ))}
          </div>
        </FilterSection>

        {/* Sizes */}
        <FilterSection title="Sizes">
          <div className="space-y-2">
            {['XS', 'S', 'M', 'L', 'XL', 'Custom'].map((size) => (
              <CheckboxOption
                key={size}
                label={size}
                checked={filters.sizes.includes(size)}
                onChange={() => {
                  const newSizes = filters.sizes.includes(size)
                    ? filters.sizes.filter(s => s !== size)
                    : [...filters.sizes, size];
                  setFilter('sizes', newSizes);
                }}
              />
            ))}
          </div>
        </FilterSection>

        {/* Colors */}
        <FilterSection title="Colors">
          <div className="grid grid-cols-2 gap-2">
            {['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'White', 'Black', 'Multi'].map((color) => (
              <CheckboxOption
                key={color}
                label={color}
                checked={filters.colors.includes(color)}
                onChange={() => {
                  const newColors = filters.colors.includes(color)
                    ? filters.colors.filter(c => c !== color)
                    : [...filters.colors, color];
                  setFilter('colors', newColors);
                }}
              />
            ))}
          </div>
        </FilterSection>

        {/* Rating */}
        <FilterSection title="Rating">
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <RatingOption
                key={rating}
                rating={rating}
                selected={filters.rating === rating}
                onChange={(value) => setFilter('rating', value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability">
          <div className="space-y-2">
            {[
              { value: 'all', label: 'All Items' },
              { value: 'inStock', label: 'In Stock' },
              { value: 'outOfStock', label: 'Out of Stock' }
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-2"
              >
                <input
                  type="radio"
                  checked={filters.availability === option.value}
                  onChange={() => setFilter('availability', option.value)}
                  className="h-4 w-4 border-gray-300 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-sm text-gray-600">{option.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
}
