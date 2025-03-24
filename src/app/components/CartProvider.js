'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
    totalItems: 0
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const calculateTotals = (items) => {
    return {
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: items.reduce((sum, item) => {
        const price = item.salePrice || item.price;
        return sum + (price * item.quantity);
      }, 0)
    };
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      // Check if we have enough inventory
      if (product.inventory.stockCount < quantity) {
        toast.error(`Sorry, only ${product.inventory.stockCount} items available`);
        return false;
      }

      setCart(prevCart => {
        const existingItem = prevCart.items.find(item => item._id === product._id);
        
        if (existingItem) {
          // Check if adding more would exceed inventory
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > product.inventory.stockCount) {
            toast.error(`Sorry, only ${product.inventory.stockCount} items available`);
            return prevCart;
          }

          // Update existing item
          const updatedItems = prevCart.items.map(item =>
            item._id === product._id
              ? { ...item, quantity: newQuantity }
              : item
          );

          const totals = calculateTotals(updatedItems);

          return {
            items: updatedItems,
            ...totals
          };
        } else {
          // Add new item
          const newItem = {
            _id: product._id,
            name: product.name,
            price: product.price,
            salePrice: product.salePrice,
            image_urls: product.images,
            quantity,
            inventory: product.inventory,
            sellerId: product.sellerId
          };

          const updatedItems = [...prevCart.items, newItem];
          const totals = calculateTotals(updatedItems);

          return {
            items: updatedItems,
            ...totals
          };
        }
      });

      toast.success('Added to cart');
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
      return false;
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart(prevCart => {
      const item = prevCart.items.find(item => item._id === productId);
      
      if (!item) {
        return prevCart;
      }

      // Check if new quantity is within inventory limits
      if (newQuantity > item.inventory.stockCount) {
        toast.error(`Sorry, only ${item.inventory.stockCount} items available`);
        return prevCart;
      }

      if (newQuantity < 1) {
        // Remove item if quantity is less than 1
        const updatedItems = prevCart.items.filter(item => item._id !== productId);
        const totals = calculateTotals(updatedItems);

        return {
          items: updatedItems,
          ...totals
        };
      }

      // Update quantity
      const updatedItems = prevCart.items.map(item =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );

      const totals = calculateTotals(updatedItems);

      return {
        items: updatedItems,
        ...totals
      };
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item._id !== productId);
      const totals = calculateTotals(updatedItems);

      return {
        items: updatedItems,
        ...totals
      };
    });
    toast.success('Removed from cart');
  };

  const clearCart = () => {
    setCart({
      items: [],
      totalAmount: 0,
      totalItems: 0
    });
  };

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount: cart.totalItems,
    totalAmount: cart.totalAmount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};