'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCartItems, addToCart as addToCartAction } from '../shop/actions/cart';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCartItems() {
      try {
        const result = await getCartItems();
        if (result.success) {
          setCartItems(result.items);
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCartItems();
  }, []);

  const refreshCart = async () => {
    try {
      setIsLoading(true);
      const result = await getCartItems();
      if (result.success) {
        setCartItems(result.items);
      }
    } catch (error) {
      console.error('Error refreshing cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, variantId = null) => {
    try {
      // If productId is an object, it's coming from the new format
      const params = typeof productId === 'object' 
        ? productId 
        : { productId, quantity, variantId };

      const result = await addToCartAction(params);
      if (result.success) {
        await refreshCart();
      }
      return result;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const value = {
    cartItems,
    isLoading,
    refreshCart,
    addToCart,
    itemCount: cartItems.reduce((total, item) => total + (item.quantity || 0), 0),
    totalPrice: cartItems.reduce((total, item) => {
      if (!item.product) return total;
      const itemPrice = item.variant && item.variant.price_adjustment
        ? item.product.price + item.variant.price_adjustment
        : item.product.price;
      return total + (itemPrice || 0) * (item.quantity || 0);
    }, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
