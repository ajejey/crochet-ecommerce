'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { syncProductToMerchant, deleteProductFromMerchant, syncProductInventory } from './actions';

/**
 * Hook for managing Google Merchant API operations in the UI
 * @returns {Object} Functions and state for Google Merchant operations
 */
export function useGoogleMerchant() {
  const [syncLoading, setSyncLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [inventoryLoading, setInventoryLoading] = useState(false);

  /**
   * Sync a product to Google Merchant Center
   * @param {string} productId - MongoDB product ID
   * @returns {Promise<Object>} Result of the operation
   */
  const syncProduct = async (productId) => {
    try {
      setSyncLoading(true);
      const result = await syncProductToMerchant(productId);
      
      if (result.success) {
        toast.success('Product synced to Google Merchant Center');
        return result;
      } else {
        toast.error(result.error || 'Failed to sync product');
        return result;
      }
    } catch (error) {
      console.error('Error syncing product:', error);
      toast.error('An unexpected error occurred');
      return { success: false, error: error.message };
    } finally {
      setSyncLoading(false);
    }
  };

  /**
   * Delete a product from Google Merchant Center
   * @param {string} productId - MongoDB product ID
   * @returns {Promise<Object>} Result of the operation
   */
  const deleteProduct = async (productId) => {
    try {
      setDeleteLoading(true);
      const result = await deleteProductFromMerchant(productId);
      
      if (result.success) {
        toast.success('Product deleted from Google Merchant Center');
        return result;
      } else {
        toast.error(result.error || 'Failed to delete product');
        return result;
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('An unexpected error occurred');
      return { success: false, error: error.message };
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * Sync product inventory with Google Merchant Center
   * @param {string} productId - MongoDB product ID
   * @returns {Promise<Object>} Result of the operation
   */
  const syncInventory = async (productId) => {
    try {
      setInventoryLoading(true);
      const result = await syncProductInventory(productId);
      
      if (result.success) {
        toast.success('Product inventory synced to Google Merchant Center');
        return result;
      } else {
        toast.error(result.error || 'Failed to sync product inventory');
        return result;
      }
    } catch (error) {
      console.error('Error syncing product inventory:', error);
      toast.error('An unexpected error occurred');
      return { success: false, error: error.message };
    } finally {
      setInventoryLoading(false);
    }
  };

  return {
    syncProduct,
    deleteProduct,
    syncInventory,
    syncLoading,
    deleteLoading,
    inventoryLoading
  };
}
