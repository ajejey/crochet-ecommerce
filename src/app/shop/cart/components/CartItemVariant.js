'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CartItemVariant({ 
  item, 
  onQuantityChange, 
  onRemove 
}) {
  // Determine which image to use - variant image or first product image
  const imageUrl = item.variantImage 
    ? item.variantImage.url 
    : (item.image_urls && item.image_urls.length > 0 ? item.image_urls[0].url : null);
  
  // Calculate the current stock for this item
  const stockCount = item.variantId && item.variant 
    ? item.variant.stockCount 
    : (item.inventory?.stockCount || 0);
  
  return (
    <div className="py-6 flex">
      {/* Product Image - Show variant image if available */}
      <div className="flex-shrink-0 w-24 h-24 relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            className="rounded-md object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-500 text-xs">No image</span>
          </div>
        )}
      </div>
      
      {/* Product Details */}
      <div className="ml-4 flex-1 flex flex-col">
        <div>
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                <Link href={`/shop/product/${item._id}`} className="hover:text-rose-600">
                  {item.name}
                </Link>
              </h3>
              
              {/* Variant information */}
              {item.variantName && (
                <div className="mt-1 flex items-center">
                  <span className="text-sm text-gray-600">
                    Option: <span className="font-medium">{item.variantName}</span>
                  </span>
                  
                  {/* Show variant image indicator if it has a custom image */}
                  {item.variantImage && (
                    <span className="ml-2 text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 inline">
                        <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909.47.47a.75.75 0 11-1.06 1.06L6.53 8.091a.75.75 0 00-1.06 0l-2.97 2.97zM12 7a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* Price */}
            <p className="ml-4 text-lg font-medium text-gray-900">
              ₹{(item.salePrice || item.price) * item.quantity}
            </p>
          </div>
          
          {/* Sale price display */}
          {item.salePrice && (
            <p className="mt-1 text-sm text-gray-500 line-through">
              ₹{item.price * item.quantity}
            </p>
          )}
        </div>
        
        {/* Quantity controls and remove button */}
        <div className="flex-1 flex items-end justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onQuantityChange(item._id, item.quantity - 1, item.variantId)}
              disabled={item.quantity <= 1}
              className={`p-1 rounded-full ${
                item.quantity <= 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            
            <span className="text-gray-900 text-lg font-medium">{item.quantity}</span>
            
            <button
              onClick={() => onQuantityChange(item._id, item.quantity + 1, item.variantId)}
              disabled={item.quantity >= stockCount && !item.inventory?.allowBackorder}
              className={`p-1 rounded-full ${
                item.quantity >= stockCount && !item.inventory?.allowBackorder
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={() => onRemove(item._id, item.variantId)}
            className="text-gray-500 hover:text-rose-600"
            aria-label="Remove item"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
        
        {/* Stock information */}
        {stockCount <= 5 && stockCount > 0 && (
          <p className="text-xs text-amber-600 mt-2">
            Only {stockCount} left in stock
          </p>
        )}
        
        {stockCount === 0 && item.inventory?.allowBackorder && (
          <p className="text-xs text-amber-600 mt-2">
            Made to order - will be delivered in {item.inventory.madeToOrderDays || 7} days
          </p>
        )}
      </div>
    </div>
  );
}
