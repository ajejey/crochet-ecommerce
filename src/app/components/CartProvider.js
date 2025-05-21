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
        // Use the item price which already includes variant adjustments if any
        const price = item.salePrice || item.price;
        return sum + (price * item.quantity);
      }, 0)
    };
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      // Check if we have a variant or using base product
      const hasVariant = !!product.variant;
      const variantId = product.variantId || null;
      
      // Determine which stock count to use (variant or base product)
      const stockCount = hasVariant 
        ? product.variant.stockCount 
        : product.inventory?.stockCount || 0;
      
      const allowBackorder = product.inventory?.allowBackorder || false;
      const madeToOrderDays = product.inventory?.madeToOrderDays || 7;
      
      if (stockCount < quantity && !allowBackorder) {
        toast.error(`Sorry, only ${stockCount} items available`);
        return { success: false };
      }
      
      // If made-to-order is allowed but there's not enough stock, show a made-to-order message
      if (stockCount < quantity && allowBackorder) {
        toast.info(`${quantity - stockCount} item(s) will be made to order and delivered in ${madeToOrderDays} days`);
      }

      setCart(prevCart => {
        // Find existing item - now we need to match both product ID and variant ID
        const existingItem = prevCart.items.find(item => {
          if (product.variantId) {
            // If adding a product with variant, match both product and variant
            return item._id === product._id && item.variantId === product.variantId;
          } else {
            // If adding a product without variant, make sure we match only items without variants
            return item._id === product._id && !item.variantId;
          }
        });
        
        if (existingItem) {
          // Check if adding more would exceed inventory, unless backorder is allowed
          const newQuantity = existingItem.quantity + quantity;
          
          // Use the correct stock count based on whether we have a variant
          const stockCount = existingItem.variantId && existingItem.variant
            ? existingItem.variant.stockCount
            : product.inventory?.stockCount || 0;
            
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
          const updatedItems = prevCart.items.map(item => {
            if ((product.variantId && item._id === product._id && item.variantId === product.variantId) || 
                (!product.variantId && item._id === product._id && !item.variantId)) {
              return { ...item, quantity: item.quantity + quantity };
            }
            return item;
          });
          
          const totals = calculateTotals(updatedItems);
          
          return {
            items: updatedItems,
            ...totals
          };
        } else {
          // Add new item
          // Prepare the item to add to cart
          const newItem = {
            _id: product._id,
            name: product.name,
            price: product.finalPrice || product.price,
            salePrice: product.salePrice,
            image_urls: product.images || [],
            quantity: quantity,
            inventory: {
              stockCount,
              allowBackorder,
              madeToOrderDays
            },
            slug: product.slug,
            // Include seller information - critical for checkout
            sellerId: product.sellerId
          };
          
          // Add variant information if present
          if (product.variant) {
            newItem.variantId = product.variantId;
            newItem.variant = product.variant;
            // If variant has an image, use it as the primary image
            if (product.variant.image && product.variant.image.url) {
              newItem.variantImage = product.variant.image;
              // Keep original images as a backup
              newItem.originalImages = product.images || [];
            }
            // Store the variant name for display
            newItem.variantName = product.variant.name;
            // Store the base option name for display
            newItem.baseOptionName = product.baseOptionName || 'Original';
          }

          const updatedItems = [...prevCart.items, newItem];
          const totals = calculateTotals(updatedItems);

          return {
            items: updatedItems,
            ...totals
          };
        }
      });

      toast.success('Added to cart');
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
      return { success: false, error: error.message };
    }
  };

  const updateQuantity = async (productId, newQuantity, variantId = null) => {
    try {
      if (newQuantity <= 0) {
        return removeFromCart(productId, variantId);
      }

      setCart(prevCart => {
        // Find the existing item - match both product ID and variant ID if present
        const existingItem = prevCart.items.find(item => {
          if (variantId) {
            return item._id === productId && item.variantId === variantId;
          } else {
            return item._id === productId && !item.variantId;
          }
        });
        
        if (!existingItem) {
          return prevCart;
        }
        
        // Determine which stock count to use based on whether we have a variant
        const stockCount = existingItem.variantId && existingItem.variant
          ? existingItem.variant.stockCount
          : (existingItem.inventory?.stockCount || 0);
          
        const allowBackorder = existingItem.inventory?.allowBackorder || false;
        const madeToOrderDays = existingItem.inventory?.madeToOrderDays || 7;
        
        if (newQuantity > stockCount && !allowBackorder) {
          toast.error(`Sorry, only ${stockCount} items available`);
          return prevCart;
        }
        
        // If made-to-order is allowed but there's not enough stock, show a made-to-order message
        if (newQuantity > stockCount && allowBackorder) {
          toast.info(`${newQuantity - stockCount} item(s) will be made to order and delivered in ${madeToOrderDays} days`);
        }
        
        const updatedItems = prevCart.items.map(item => {
          if ((variantId && item._id === productId && item.variantId === variantId) || 
              (!variantId && item._id === productId && !item.variantId)) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        
        const totals = calculateTotals(updatedItems);
        
        return {
          items: updatedItems,
          ...totals
        };
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { success: false, error };
    }
  };

  const removeFromCart = async (productId, variantId = null) => {
    try {
      setCart(prevCart => {
        // Remove the specific item with matching product ID and variant ID (if provided)
        const updatedItems = prevCart.items.filter(item => {
          if (variantId) {
            return !(item._id === productId && item.variantId === variantId);
          } else {
            return !(item._id === productId && !item.variantId);
          }
        });
        const totals = calculateTotals(updatedItems);

        return {
          items: updatedItems,
          ...totals
        };
      });
      toast.success('Removed from cart');
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, error };
    }
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
    totalAmount: cart.totalAmount,
    // Helper function to check if a product+variant is in cart
    isInCart: (productId, variantId = null) => {
      return cart.items.some(item => {
        if (variantId) {
          return item._id === productId && item.variantId === variantId;
        } else {
          return item._id === productId && !item.variantId;
        }
      });
    }
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