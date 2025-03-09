'use client';

import { useEffect } from 'react';
import { getCartItems, updateCartItemQuantity, removeFromCart } from '../actions/cart';
import { toast } from 'sonner';
import Image from 'next/image';
import { formatPrice } from '@/utils/format';
import useSWR, { mutate } from 'swr';
import { useCart } from '@/app/components/CartProvider';
import Link from 'next/link';

const fetcher = async () => {
  const result = await getCartItems();
  if (!result.success) {
    throw new Error('Failed to load cart items');
  }
  return result.items || [];
};

export default function CartPage() {
  const { data: cartItems = [], error, isLoading } = useSWR('cart-items', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
  });
  const { refreshCart, updateCartItemQuantity: updateCartItemQuantityContext, removeFromCart: removeFromCartContext } = useCart();

  // Sync cart context with SWR data on initial load and refreshes
  useEffect(() => {
    if (cartItems.length > 0 || error) {
      refreshCart();
    }
  }, [cartItems.length, error, refreshCart]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      const item = cartItems.find(item => item.$id === itemId);
      if (!item?.product) {
        toast.error('Product not found');
        return;
      }

      // Check stock availability
      if (newQuantity > item.product.inventory.stockCount) {
        toast.error('Requested quantity exceeds available stock');
        return;
      }

      // Don't allow negative quantities
      if (newQuantity < 0) {
        newQuantity = 0;
      }

      // Optimistic update
      const previousItems = cartItems;
      let optimisticData = cartItems.map(item =>
        item.$id === itemId ? { ...item, quantity: newQuantity } : item
      );

      // If quantity is 0, remove the item
      if (newQuantity <= 0) {
        optimisticData = optimisticData.filter(item => item.$id !== itemId);
      }

      mutate('cart-items', optimisticData, false);

      // Use context function to update cart state immediately
      if (newQuantity <= 0) {
        const result = await removeFromCartContext(itemId);
        if (result.success) {
          toast.success('Item removed from cart');
        } else {
          // Revert to previous data if removal failed
          mutate('cart-items', previousItems);
          toast.error('Failed to remove item');
        }
      } else {
        const result = await updateCartItemQuantityContext(itemId, newQuantity);
        if (result.success) {
          toast.success('Quantity updated');
        } else {
          // Revert to previous data if update failed
          mutate('cart-items', previousItems);
          toast.error(result.error || 'Failed to update quantity');
        }
      }

      // Revalidate the cart data
      mutate('cart-items');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
      // Ensure cart is refreshed in case of error
      refreshCart();
    }
  };

  const handleRemove = async (itemId) => {
    try {
      // Optimistic update
      const previousItems = cartItems;
      const optimisticData = cartItems.filter(item => item.$id !== itemId);
      
      mutate('cart-items', optimisticData, false);

      // Use context function to update cart state immediately
      const result = await removeFromCartContext(itemId);
      if (result.success) {
        toast.success('Item removed from cart');
        // Revalidate the cart data
        mutate('cart-items');
      } else {
        // Revert to previous data if removal failed
        mutate('cart-items', previousItems);
        toast.error('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
      // Ensure cart is refreshed in case of error
      refreshCart();
    }
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    if (!item.product) return total;
    const price = item.product.salePrice || item.product.price;
    return total + (price * item.quantity);
  }, 0);

  // Calculate shipping (free over ₹1000)
  const shippingCost = subtotal >= 1000 ? 0 : 100;
  
  // Calculate total
  const total = subtotal + shippingCost;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-lg text-red-600">
          Failed to load cart. Please try refreshing the page.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link href="/shop" className="inline-block bg-rose-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.$id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                      <Image
                        src={item.product?.images?.[0]?.url || item.product?.mainImage || '/placeholder-product.jpg'}
                        alt={item.product?.name || 'Product'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">
                            {item.product?.name || 'Product'}
                          </h3>
                          {item.variant && (
                            <p className="mt-1 text-sm text-gray-500">
                              {item.variant.name}
                            </p>
                          )}
                        </div>
                        <div className="mt-2 sm:mt-0 text-base font-medium text-gray-900">
                          {formatPrice(item.product?.salePrice || item.product?.price || 0)}
                        </div>
                      </div>
                      
                      {/* Quantity and Remove */}
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => handleQuantityChange(item.$id, item.quantity - 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-gray-900 min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.$id, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            disabled={item.quantity >= (item.product?.inventory?.stockCount || 0)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(item.$id)}
                          className="text-sm text-rose-600 hover:text-rose-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
              </div>
              {shippingCost > 0 && (
                <div className="text-xs text-gray-500">
                  Add {formatPrice(1000 - subtotal)} more to get free shipping
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            
            <button
              className="w-full bg-rose-600 text-white py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors"
              onClick={() => {
                // TODO: Implement checkout
                toast.success('Proceeding to checkout...');
              }}
            >
              Proceed to Checkout
            </button>
            
            <div className="mt-4">
              <Link href="/shop" className="text-sm text-rose-600 hover:text-rose-800 flex justify-center">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
