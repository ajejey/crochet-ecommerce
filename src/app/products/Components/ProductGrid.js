'use client';

import { useState, useEffect } from 'react';
import { searchProducts } from '../actions';
import ProductCard from './ProductCard';

export default function ProductGrid({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [sortBy, setSortBy] = useState('featured');

  console.log("initialProducts ", initialProducts)

  // Sort products client-side
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {sortedProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}