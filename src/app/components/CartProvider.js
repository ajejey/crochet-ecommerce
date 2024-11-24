'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCartItems } from '../shop/actions/cart';

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

  const value = {
    cartItems,
    isLoading,
    refreshCart,
    itemCount: cartItems.reduce((total, item) => total + item.quantity, 0),
    totalPrice: cartItems.reduce((total, item) => {
      const itemPrice = item.variant
        ? item.product.price + item.variant.price_adjustment
        : item.product.price;
      return total + itemPrice * item.quantity;
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
