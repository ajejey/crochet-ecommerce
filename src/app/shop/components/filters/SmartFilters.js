'use client';

import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useFilters } from './FilterProvider';
import { useState } from 'react';

function FilterSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
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

function FilterBadge({ label, onRemove, variant = 'default' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    auto: 'bg-rose-50 text-rose-700 border-rose-200',
    suggested: 'bg-blue-50 text-blue-700 border-blue-200'
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${variants[variant]}`}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-2 text-current opacity-60 hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

function SuggestedFilterButton({ filter, isApplied, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm text-left transition w-full
        ${isApplied
          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
        }`}
    >
      <div className="flex items-center justify-between">
        <span>{filter.label}</span>
        {filter.confidence && (
          <span className="text-xs opacity-60">
            {Math.round(filter.confidence * 100)}%
          </span>
        )}
      </div>
    </button>
  );
}

export function SmartFilters() {
  const { 
    filters, 
    setFilter, 
    aiSuggestions,
    smartGroups 
  } = useFilters();


  const getFilterValue = (filter) => {
    if (filter.type === 'priceRange') {
      return filter.value;
    }
    return filter.value;
  };

  const isFilterApplied = (filter) => {
    if (filter.type === 'priceRange') {
      return filters.priceRange.min === filter.value.min && 
             filters.priceRange.max === filter.value.max;
    }
    return filters[filter.type] === filter.value;
  };

  return (
    <div className="space-y-6">
      {/* AI Auto-applied Filters */}
      {aiSuggestions.autoApplied.length > 0 && (
        <div className="bg-rose-50/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            We've automatically applied:
          </h3>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.autoApplied.map((filter) => (
              <FilterBadge
                key={`${filter.type}-${filter.value}`}
                label={filter.label}
                variant="auto"
                onRemove={() => setFilter(filter.type, null)}
              />
            ))}
          </div>
        </div>
      )}

      {/* AI Suggested Filters */}
      {aiSuggestions.suggested.length > 0 && (
        <FilterSection title="Suggested Filters" defaultOpen={true}>
          <div className="space-y-2">
            {aiSuggestions.suggested.map((filter) => (
              <SuggestedFilterButton
                key={`${filter.type}-${filter.value}`}
                filter={filter}
                isApplied={isFilterApplied(filter)}
                onClick={() => setFilter(
                  filter.type,
                  isFilterApplied(filter) ? null : getFilterValue(filter),
                  'ai_suggestion'
                )}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Smart Filter Groups */}
      {Object.entries(smartGroups).map(([group, values]) => (
        values.length > 0 && (
          <FilterSection 
            key={group} 
            title={group.charAt(0).toUpperCase() + group.slice(1)}
          >
            <div className="space-y-2">
              {values.map((value) => (
                <label
                  key={value}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <input
                    type="checkbox"
                    checked={filters[group].includes(value)}
                    onChange={() => {
                      const newValues = filters[group].includes(value)
                        ? filters[group].filter(v => v !== value)
                        : [...filters[group], value];
                      setFilter(group, newValues);
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span>{value}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )
      ))}

      {/* Related Categories */}
      {aiSuggestions.related.length > 0 && (
        <FilterSection title="Related Categories">
          <div className="space-y-2">
            {aiSuggestions.related.map((category) => (
              <button
                key={category}
                onClick={() => setFilter('category', category)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition
                  ${filters.category === category
                    ? 'bg-rose-100 text-rose-700'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );
}
