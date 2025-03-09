'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getCartItems } from '@/app/shop/actions/cart';
import { addToCart as addToCartAction } from '@/app/shop/actions/cart';
import { removeFromCart as removeFromCartAction } from '@/app/shop/actions/cart';
import { updateCartItemQuantity as updateCartItemQuantityAction } from '@/app/shop/actions/cart';

// Create context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart provider component
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize cart on component mount
  useEffect(() => {
    const initializeCart = async () => {
      await syncCartWithServer();
    };
    
    initializeCart();
  }, []);

  // Sync cart with server
  const syncCartWithServer = async () => {
    try {
      setIsSyncing(true);
      
      // Get cart items from local storage
      const localCartItems = getLocalCartItems();
      
      // Get cart items from server
      const result = await getCartItems();
      
      if (result.success) {
        // If we have items in both local storage and server, merge them
        if (typeof window !== 'undefined') {
          if (localCartItems.length > 0 && result.items.length > 0) {
            // Map of server items by product ID
            const serverItemsMap = new Map(
              result.items.map(item => [item.product._id, item])
            );
            
            // Find local items not on server
            const localOnlyItems = localCartItems.filter(
              localItem => !serverItemsMap.has(localItem.product._id)
            );
            
            // Add local-only items to server
            for (const localItem of localOnlyItems) {
              await addToCartAction({
                productId: localItem.product._id,
                quantity: localItem.quantity,
                variantId: localItem.variant?._id,
                productData: {
                  name: localItem.product.name,
                  price: localItem.product.price,
                  images: [{ url: localItem.product.image_urls?.[0] || '' }]
                }
              });
            }
            
            // Refresh cart from server after sync
            const updatedResult = await getCartItems();
            if (updatedResult.success) {
              setCartItems(updatedResult.items);
              // Update local storage with the latest cart items
              saveCartItemsToLocalStorage(updatedResult.items);
            }
          } else {
            // If one is empty, use the non-empty one
            setCartItems(result.items.length > 0 ? result.items : localCartItems);
            // Update local storage with the latest cart items
            saveCartItemsToLocalStorage(result.items.length > 0 ? result.items : localCartItems);
          }
        } else {
          setCartItems(result.items);
        }
      }
    } catch (error) {
      console.error('Error syncing cart with server:', error);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  const refreshCart = async () => {
    try {
      setIsLoading(true);
      await syncCartWithServer();
    } catch (error) {
      console.error('Error refreshing cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if adding a quantity of a product would exceed available stock
  const checkStockAvailability = (productId, requestedQuantity, totalStock) => {
    if (typeof totalStock !== 'number') {
      // If we don't have stock information, allow the add
      return { canAdd: true };
    }
    
    // Check if product is already in cart
    const existingItem = cartItems.find(item => item.product._id === productId);
    const existingQuantity = existingItem ? existingItem.quantity : 0;
    
    // Calculate total quantity after adding
    const totalQuantity = existingQuantity + requestedQuantity;
    
    // Check if total quantity exceeds stock
    if (totalQuantity > totalStock) {
      // Calculate how many more can be added
      const availableToAdd = Math.max(0, totalStock - existingQuantity);
      
      return {
        canAdd: availableToAdd > 0,
        availableToAdd,
        reason: existingQuantity > 0 
          ? `You already have ${existingQuantity} in your cart. Only ${availableToAdd} more available.`
          : `Only ${totalStock} items available in stock.`
      };
    }
    
    return { canAdd: true, availableToAdd: requestedQuantity };
  };

  // Add to cart
  const addToCart = async (params) => {
    try {
      const { productId, quantity, productData } = params;
      
      // Check stock availability if we have stock information
      if (productData?.inventory?.stockCount !== undefined) {
        const stockCheck = checkStockAvailability(
          productId, 
          quantity, 
          productData.inventory.stockCount
        );
        
        if (!stockCheck.canAdd) {
          return { 
            success: false, 
            error: 'Not enough stock available',
            stockCheck 
          };
        }
        
        // If we can add some but not all requested items
        if (stockCheck.availableToAdd < quantity) {
          params.quantity = stockCheck.availableToAdd;
        }
      }
      
      // Update local cart immediately for better UX
      const existingItemIndex = cartItems.findIndex(item => item.product._id === productId);
      
      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex] = {
          ...updatedCartItems[existingItemIndex],
          quantity: updatedCartItems[existingItemIndex].quantity + params.quantity
        };
        setCartItems(updatedCartItems);
        // Update local storage
        saveCartItemsToLocalStorage(updatedCartItems);
      } else if (productData) {
        // Add new item with product data
        const newItem = {
          $id: `temp-${Date.now()}`,
          product: {
            _id: productId,
            ...productData
          },
          quantity: params.quantity
        };
        const updatedCartItems = [...cartItems, newItem];
        setCartItems(updatedCartItems);
        // Update local storage
        saveCartItemsToLocalStorage(updatedCartItems);
      }
      
      // Then sync with server
      const result = await addToCartAction(params);
      if (result.success) {
        // If we didn't have product data, refresh from server
        if (!productData) {
          await refreshCart();
        }
        return result;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Refresh cart to ensure consistency
      refreshCart();
      throw error;
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId) => {
    try {
      // Update local cart immediately
      const updatedCartItems = cartItems.filter(item => item.$id !== itemId);
      setCartItems(updatedCartItems);
      // Update local storage
      saveCartItemsToLocalStorage(updatedCartItems);
      
      // Then sync with server
      await removeFromCartAction(itemId);
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Refresh cart to ensure consistency
      refreshCart();
      throw error;
    }
  };

  const updateCartItemQuantity = async (itemId, quantity) => {
    try {
      // Check if the item exists and if we have stock information
      const itemIndex = cartItems.findIndex(item => item.$id === itemId);
      if (itemIndex === -1) {
        throw new Error('Item not found in cart');
      }
      
      const item = cartItems[itemIndex];
      const stockCount = item.product?.inventory?.stockCount;
      
      // If we have stock information, validate the requested quantity
      if (typeof stockCount === 'number' && quantity > stockCount) {
        return {
          success: false,
          error: `Only ${stockCount} items available in stock`
        };
      }
      
      // If quantity is 0 or less, remove the item
      if (quantity <= 0) {
        return removeFromCart(itemId);
      }
      
      // Update local cart immediately
      const updatedCartItems = cartItems.map(item => 
        item.$id === itemId ? { ...item, quantity } : item
      );
      setCartItems(updatedCartItems);
      // Update local storage
      saveCartItemsToLocalStorage(updatedCartItems);
      
      // Then sync with server
      await updateCartItemQuantityAction(itemId, quantity);
      return { success: true };
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      // Refresh cart to ensure consistency
      refreshCart();
      throw error;
    }
  };

  // Get remaining stock for a product
  const getRemainingStock = (productId, totalStock) => {
    if (typeof totalStock !== 'number') return null;
    
    const existingItem = cartItems.find(item => item.product._id === productId);
    const existingQuantity = existingItem ? existingItem.quantity : 0;
    
    return Math.max(0, totalStock - existingQuantity);
  };

  const value = {
    cartItems,
    isLoading,
    isSyncing,
    refreshCart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getRemainingStock,
    checkStockAvailability,
    itemCount: cartItems.reduce((total, item) => total + (item.quantity || 0), 0),
    totalPrice: cartItems.reduce((total, item) => {
      if (!item.product) return total;
      const itemPrice = item.variant && item.variant.price_adjustment
        ? item.product.price + item.variant.price_adjustment
        : item.product.price;
      return total + (itemPrice || 0) * (item.quantity || 0);
    }, 0)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Helper functions for local storage
function getLocalCartItems() {
  if (typeof window === 'undefined') return [];
  
  try {
    const cartItems = localStorage.getItem('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
  } catch (error) {
    console.error('Error getting cart items from local storage:', error);
    return [];
  }
}

function saveCartItemsToLocalStorage(cartItems) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart items to local storage:', error);
  }
}
