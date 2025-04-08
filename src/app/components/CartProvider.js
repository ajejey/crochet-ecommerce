'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Initialize cart with a function to avoid the empty cart initial state
  const [cart, setCart] = useState(() => {
    // Try to load cart from localStorage during initialization
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (parsedCart && parsedCart.items && Array.isArray(parsedCart.items)) {
            return parsedCart;
          }
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
        }
      }
    }
    // Default empty cart
    return {
      items: [],
      totalAmount: 0,
      totalItems: 0
    };
  });
  const [isInitialized, setIsInitialized] = useState(true);

  // Sync with localStorage if it changes in another tab
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        try {
          const parsedCart = JSON.parse(e.newValue);
          if (parsedCart && parsedCart.items && Array.isArray(parsedCart.items)) {
            setCart(parsedCart);
          }
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save cart to localStorage whenever it changes, but only after initialization
  useEffect(() => {
    // Only save to localStorage if:
    // 1. The component has been initialized (loaded from localStorage)
    // 2. The cart has items OR we explicitly cleared the cart (not just empty on initial load)
    if (isInitialized && (cart.items.length > 0 || cart.explicitlyClearedFlag)) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

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
      // Check if we have enough inventory or if backorder is allowed
      const stockCount = product.inventory?.stockCount || 0;
      const allowBackorder = product.inventory?.allowBackorder || false;
      const madeToOrderDays = product.inventory?.madeToOrderDays || 7;
      
      if (stockCount < quantity && !allowBackorder) {
        toast.error(`Sorry, only ${stockCount} items available`);
        return false;
      }
      
      // If made-to-order is allowed but there's not enough stock, show a made-to-order message
      if (stockCount < quantity && allowBackorder) {
        toast.info(`${quantity - stockCount} item(s) will be made to order and delivered in ${madeToOrderDays} days`);
      }

      setCart(prevCart => {
        const existingItem = prevCart.items.find(item => item._id === product._id);
        
        if (existingItem) {
          // Check if adding more would exceed inventory, unless backorder is allowed
          const newQuantity = existingItem.quantity + quantity;
          const stockCount = product.inventory?.stockCount || 0;
          const allowBackorder = product.inventory?.allowBackorder || false;
          const madeToOrderDays = product.inventory?.madeToOrderDays || 7;
          
          if (newQuantity > stockCount && !allowBackorder) {
            toast.error(`Sorry, only ${stockCount} items available`);
            return prevCart;
          }
          
          // If made-to-order is allowed but there's not enough stock, show a made-to-order message
          if (newQuantity > stockCount && allowBackorder) {
            toast.info(`${newQuantity - stockCount} item(s) will be made to order and delivered in ${madeToOrderDays} days`);
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

      // Check if new quantity is within inventory limits or if backorder is allowed
      const stockCount = item.inventory?.stockCount || 0;
      const allowBackorder = item.inventory?.allowBackorder || false;
      const madeToOrderDays = item.inventory?.madeToOrderDays || 7;
      
      if (newQuantity > stockCount && !allowBackorder) {
        toast.error(`Sorry, only ${stockCount} items available`);
        return prevCart;
      }
      
      // If made-to-order is allowed but there's not enough stock, show a made-to-order message
      if (newQuantity > stockCount && allowBackorder) {
        toast.info(`${newQuantity - stockCount} item(s) will be made to order and delivered in ${madeToOrderDays} days`);
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
    console.log('Clearing cart...');
    setCart({
      items: [],
      totalAmount: 0,
      totalItems: 0,
      explicitlyClearedFlag: true // Flag to indicate this was an explicit clear action
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