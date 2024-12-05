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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <div className="text-red-600">Error loading cart items. Please try again later.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <div className="animate-pulse">
          <div className="h-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-24 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link href="/shop" className="text-blue-600 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  console.log("cartItems ", cartItems)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      
      <div className="grid gap-4">
        {cartItems.map((item) => {
          // Get the main image URL from the first image object
          const productImage = item.product.images[0]?.url;
          const productName = item.product.name;
          
          return (
            <div key={item.$id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="relative w-24 h-24">
                <Image
                  src={productImage}
                  alt={productName}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              
              <div className="flex-grow">
                <h3 className="font-semibold">{productName}</h3>
                {item.variant && (
                  <p className="text-sm text-gray-600">
                    Variant: {item.variant.name}
                  </p>
                )}
                <p className="text-blue-600">
                  {formatPrice((item.product.price || 0) + (item.variant?.price_adjustment || 0))}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item.$id, (item.quantity || 0) - 1)}
                  className="w-8 h-8 flex items-center justify-center border rounded"
                  disabled={!item.product}
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity || 0}</span>
                <button
                  onClick={() => handleQuantityChange(item.$id, (item.quantity || 0) + 1)}
                  className="w-8 h-8 flex items-center justify-center border rounded"
                  disabled={!item.product}
                >
                  +
                </button>
              </div>
              
              <button
                onClick={() => handleRemove(item.$id)}
                className="text-red-600 hover:text-red-800"
                disabled={!item.product}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
      
      {cartItems && cartItems.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">Total</span>
            <span className="text-2xl font-bold text-blue-600">
              {formatPrice(calculateTotal())}
            </span>
          </div>
          <Link
            href="/shop/checkout"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
