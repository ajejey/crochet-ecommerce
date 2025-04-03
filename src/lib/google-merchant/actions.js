'use server';

import { revalidatePath } from 'next/cache';
import { getMerchantApiClient, convertProductToMerchantFormat } from './index';
import { Product } from '@/models/Product';
import dbConnect from '@/lib/mongodb';
import { PRODUCT_STATUSES } from '@/constants/product';

/**
 * Sync a single product to Google Merchant Center
 * @param {string} productId - MongoDB product ID
 * @returns {Promise<Object>} Result of the operation
 */
export async function syncProductToMerchant(productId) {
  try {
    await dbConnect();
    
    // Get product from database
    const product = await Product.findById(productId);
    
    if (!product) {
      return { success: false, error: 'Product not found' };
    }
    
    // Only sync active products
    if (product.status !== PRODUCT_STATUSES.ACTIVE) {
      return { 
        success: false, 
        error: 'Only active products can be synced to Google Merchant Center' 
      };
    }
    
    // Convert product to Google Merchant format
    const merchantProduct = convertProductToMerchantFormat(product);
    
    // Get Merchant API client
    const merchantApi = await getMerchantApiClient();
    const merchantId = process.env.GOOGLE_MERCHANT_ID;
    
    // Insert or update product in Google Merchant Center using Content API
    // Note: The Content API expects the product in the 'resource' field
    console.log('Syncing product to Google Merchant Center:', JSON.stringify(merchantProduct, null, 2));
    
    const response = await merchantApi.products.insert({
      merchantId,
      resource: merchantProduct // Content API expects 'resource', not 'product'
    });
    
    return { 
      success: true, 
      message: 'Product synced to Google Merchant Center',
      productId: product._id.toString(),
      merchantProductId: response.data.id
    };
  } catch (error) {
    console.error('Error syncing product to Google Merchant Center:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to sync product to Google Merchant Center' 
    };
  }
}

/**
 * Delete a product from Google Merchant Center
 * @param {string} productId - MongoDB product ID
 * @returns {Promise<Object>} Result of the operation
 */
export async function deleteProductFromMerchant(productId) {
  try {
    // Get Merchant API client
    const merchantApi = await getMerchantApiClient();
    const merchantId = process.env.GOOGLE_MERCHANT_ID;
    
    // Delete product from Google Merchant Center using Merchant API
    await merchantApi.products.delete({
      merchantId,
      productId: productId.toString()
    });
    
    return { 
      success: true, 
      message: 'Product deleted from Google Merchant Center',
      productId
    };
  } catch (error) {
    console.error('Error deleting product from Google Merchant Center:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to delete product from Google Merchant Center' 
    };
  }
}

/**
 * Sync all published products to Google Merchant Center
 * @returns {Promise<Object>} Result of the operation
 */
export async function syncAllProductsToMerchant() {
  try {
    await dbConnect();
    
    // Get all active products
    const products = await Product.find({ status: PRODUCT_STATUSES.ACTIVE });
    
    if (products.length === 0) {
      return { success: false, error: 'No active products found' };
    }
    
    // Get Merchant API client
    const merchantApi = await getMerchantApiClient();
    const merchantId = process.env.GOOGLE_MERCHANT_ID;
    
    // Track results
    const results = {
      total: products.length,
      success: 0,
      failed: 0,
      errors: []
    };
    
    // Process products in batches to avoid rate limits
    const batchSize = 50;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      // Process batch in parallel
      const batchPromises = batch.map(async (product) => {
        try {
          const merchantProduct = convertProductToMerchantFormat(product);
          
          await merchantApi.products.insert({
            merchantId,
            resource: merchantProduct // Content API expects 'resource', not 'product'
          });
          
          results.success++;
          return { success: true, productId: product._id.toString() };
        } catch (error) {
          results.failed++;
          results.errors.push({
            productId: product._id.toString(),
            error: error.message || 'Unknown error'
          });
          return { success: false, productId: product._id.toString(), error };
        }
      });
      
      await Promise.all(batchPromises);
      
      // Add a small delay between batches to avoid rate limits
      if (i + batchSize < products.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return { 
      success: true, 
      message: `Synced ${results.success} products to Google Merchant Center`,
      results
    };
  } catch (error) {
    console.error('Error syncing all products to Google Merchant Center:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to sync products to Google Merchant Center' 
    };
  }
}

/**
 * Get the status of products in Google Merchant Center
 * @returns {Promise<Object>} Status information
 */
export async function getMerchantProductsStatus() {
  try {
    // Get Merchant API client
    const merchantApi = await getMerchantApiClient();
    const merchantId = process.env.GOOGLE_MERCHANT_ID;
    
    console.log('Getting product status from Google Merchant Center...');
    
    // Get product status using Content API
    const response = await merchantApi.productstatuses.list({
      merchantId,
      maxResults: 250 // Adjust as needed
    });
    
    console.log('Product status response:', JSON.stringify(response.data, null, 2));
    
    // The response structure might vary, so we handle different possible formats
    let products = [];
    
    if (response.data.resources && response.data.resources.length > 0) {
      products = response.data.resources;
    } else if (response.data.items && response.data.items.length > 0) {
      products = response.data.items;
    } else {
      console.log('No products found in the response. Products might still be processing.');
    }
    
    return { 
      success: true, 
      products: products
    };
  } catch (error) {
    console.error('Error getting product status from Google Merchant Center:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to get product status from Google Merchant Center' 
    };
  }
}

/**
 * Sync product inventory with Google Merchant Center
 * @param {string} productId - MongoDB product ID
 * @returns {Promise<Object>} Result of the operation
 */
export async function syncProductInventory(productId) {
  try {
    await dbConnect();
    
    // Get product from database
    const product = await Product.findById(productId);
    
    if (!product) {
      return { success: false, error: 'Product not found' };
    }
    
    // Get Merchant API client
    const merchantApi = await getMerchantApiClient();
    const merchantId = process.env.GOOGLE_MERCHANT_ID;
    
    // Update inventory only
    const inventoryUpdate = {
      availability: product.inventory.stockCount > 0 ? 'in stock' : 'out of stock',
      price: {
        value: (product.salePrice || product.price).toFixed(2),
        currency: 'INR'
      }
    };
    
    // Update product in Google Merchant Center using Merchant API
    await merchantApi.inventory.set({
      merchantId,
      productId: product._id.toString(),
      resource: inventoryUpdate
    });
    
    return { 
      success: true, 
      message: 'Product inventory synced to Google Merchant Center',
      productId: product._id.toString()
    };
  } catch (error) {
    console.error('Error syncing product inventory to Google Merchant Center:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to sync product inventory' 
    };
  }
}

/**
 * Create a scheduled sync job for Google Merchant products
 * This should be called from an API route that's triggered by a cron job
 */
export async function scheduledProductSync() {
  try {
    const result = await syncAllProductsToMerchant();
    
    // Revalidate relevant paths
    revalidatePath('/shop');
    revalidatePath('/admin/products');
    
    return result;
  } catch (error) {
    console.error('Scheduled product sync failed:', error);
    return { 
      success: false, 
      error: error.message || 'Scheduled product sync failed' 
    };
  }
}
