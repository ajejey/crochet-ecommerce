'use client';

import { useState, useEffect } from 'react';
import ProductFilters from './ProductFilters';
import ProductGrid from './ProductGrid';
import useSWR from 'swr';
import { getActiveProducts } from '../actions';

export default function ProductsSection({ initialProducts, categories }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Fetch products with SWR for real-time updates
  const { data: products, error } = useSWR('active-products', getActiveProducts, {
    fallbackData: initialProducts,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
  
  // Filter and sort products
  const filteredProducts = products?.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default: // newest
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  if (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <section className="mt-8">
      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <ProductGrid products={filteredProducts} />
    </section>
  );
}
