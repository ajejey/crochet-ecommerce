'use client';

import { X } from 'lucide-react';
import { useFilters } from '../filters/FilterProvider';

function FilterChip({ label, onRemove }) {
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-sm">
      <span>{label}</span>
      <button onClick={onRemove} className="ml-1 hover:text-rose-900">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function ActiveFilters() {
  const { filters, resetFilter } = useFilters();

  const activeFilters = [];

  // Price Range
  if (filters.priceRange.min || filters.priceRange.max) {
    const label = `Price: ${filters.priceRange.min || '0'} - ${filters.priceRange.max || '∞'}`;
    activeFilters.push({
      key: 'priceRange',
      label,
      onRemove: () => resetFilter('priceRange')
    });
  }

  // Rating
  if (filters.rating) {
    activeFilters.push({
      key: 'rating',
      label: `${filters.rating}+ Stars`,
      onRemove: () => resetFilter('rating')
    });
  }

  // Availability
  if (filters.availability !== 'all') {
    activeFilters.push({
      key: 'availability',
      label: filters.availability === 'inStock' ? 'In Stock' : 'Out of Stock',
      onRemove: () => resetFilter('availability')
    });
  }

  // Materials
  filters.materials.forEach(material => {
    activeFilters.push({
      key: `material-${material}`,
      label: material,
      onRemove: () => {
        const newMaterials = filters.materials.filter(m => m !== material);
        resetFilter('materials', newMaterials);
      }
    });
  });

  // Colors
  filters.colors.forEach(color => {
    activeFilters.push({
      key: `color-${color}`,
      label: color,
      onRemove: () => {
        const newColors = filters.colors.filter(c => c !== color);
        resetFilter('colors', newColors);
      }
    });
  });

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {activeFilters.map(filter => (
        <FilterChip
          key={filter.key}
          label={filter.label}
          onRemove={filter.onRemove}
        />
      ))}
    </div>
  );
}
