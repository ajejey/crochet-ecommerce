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
  const { refreshCart } = useCart();

  console.log("CART ITEMS ", cartItems)

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

      const result = await updateCartItemQuantity(itemId, newQuantity);
      if (result.success) {
        if (result.deleted) {
          toast.success('Item removed from cart');
        } else {
          toast.success('Quantity updated');
        }
        // Revalidate the cart data
        mutate('cart-items');
        // Update cart context
        refreshCart();
      } else {
        // Revert to previous data if update failed
        mutate('cart-items', previousItems);
        toast.error(result.error || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      // Optimistic update
      const previousItems = cartItems;
      const optimisticData = cartItems.filter(item => item.$id !== itemId);
      
      mutate('cart-items', optimisticData, false);

      const result = await removeFromCart(itemId);
      if (result.success) {
        toast.success('Item removed from cart');
        // Revalidate the cart data
        mutate('cart-items');
        // Update cart context
        refreshCart();
      } else {
        // Revert to previous data if removal failed
        mutate('cart-items', previousItems);
        toast.error('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const calculateTotal = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((total, item) => {
      if (!item?.product) return total;
      const price = (item.product.price || 0) + (item.variant?.price_adjustment || 0);
      return total + (price * (item.quantity || 0));
    }, 0);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative py-8 md:py-12">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-50 to-white"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="text-red-600">Error loading cart items. Please try again later.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative py-8 md:py-12">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-50 to-white"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-24 bg-gray-100 rounded-lg"></div>
                <div className="h-24 bg-gray-100 rounded-lg"></div>
                <div className="h-24 bg-gray-100 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative py-8 md:py-12">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-50 to-white"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-600 mb-6">Your cart is empty</p>
              <Link href="/shop">
                <button className="px-6 py-3 bg-rose-600 text-white rounded-full text-lg font-medium hover:bg-rose-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("cartItems ", cartItems)

  return (
    <div className="min-h-screen bg-white">
      <div className="relative py-8 md:py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50 to-white"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const productImage = item.product.images[0]?.url;
                const productName = item.product.name;
                const price = (item.product.price || 0) + (item.variant?.price_adjustment || 0);
                
                return (
                  <div key={item.$id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="relative w-full sm:w-24 h-40 sm:h-24 rounded-lg overflow-hidden">
                        <Image
                          src={productImage}
                          alt={productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow space-y-2">
                        <h3 className="font-semibold text-lg text-gray-900">{productName}</h3>
                        {item.variant && (
                          <p className="text-sm text-gray-600">
                            Variant: {item.variant.name}
                          </p>
                        )}
                        <p className="text-rose-600 font-medium">
                          {formatPrice(price)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.$id, (item.quantity || 0) - 1)}
                            className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={!item.product}
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity || 0}</span>
                          <button
                            onClick={() => handleQuantityChange(item.$id, (item.quantity || 0) + 1)}
                            className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={!item.product}
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemove(item.$id)}
                          className="w-full sm:w-auto px-4 py-2 text-sm text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(calculateTotal())}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-sm text-gray-500">Calculated at checkout</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-rose-600">{formatPrice(calculateTotal())}</span>
                </div>
                
                <Link href="/shop/checkout" className="block mt-8">
                  <button className="w-full px-6 py-4 bg-rose-600 text-white rounded-full text-lg font-medium hover:bg-rose-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
