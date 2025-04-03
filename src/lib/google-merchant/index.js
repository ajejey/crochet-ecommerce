/**
 * Google Merchant API Integration for Knitkart.in
 * 
 * This module provides functionality to sync products from our MongoDB database
 * to Google Merchant Center using the Merchant API (beta).
 */

import { google } from 'googleapis';
import { cache } from 'react';
import { initGoogleCredentials } from './credentials';

// Constants for Google Merchant API
const MERCHANT_ID = process.env.GOOGLE_MERCHANT_ID;
const SCOPES = ['https://www.googleapis.com/auth/content'];

/**
 * Create an authenticated Google API client
 * @returns {Promise<any>} Authenticated Google API client
 */
export async function getAuthClient() {
  try {
    // Use API key authentication instead of service account
    // This requires setting up an API key in Google Cloud Console
    const auth = new google.auth.GoogleAuth({
      // Try service account first
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: SCOPES,
    });
    
    try {
      // Try to get client with service account
      const authClient = await auth.getClient();
      console.log('Successfully authenticated with service account');
      return authClient;
    } catch (serviceAccountError) {
      console.warn('Service account authentication failed, trying API key:', serviceAccountError.message);
      
      // Fall back to API key if service account fails
      // You'll need to create an API key in Google Cloud Console
      // and add it to your environment variables as GOOGLE_API_KEY
      if (process.env.GOOGLE_API_KEY) {
        console.log('Using API key authentication');
        return { key: process.env.GOOGLE_API_KEY };
      } else {
        throw new Error('No API key found and service account authentication failed');
      }
    }
  } catch (error) {
    console.error('Error authenticating with Google:', error);
    throw new Error('Failed to authenticate with Google Merchant API');
  }
}

/**
 * Initialize the Google Merchant API client
 * @returns {Promise<any>} Merchant API client
 */
export const getMerchantApiClient = cache(async () => {
  try {
    // Initialize credentials from base64 if in production
    await initGoogleCredentials();
    const authClient = await getAuthClient();
    // For now, we'll use the Content API while transitioning to Merchant API
    // The Merchant API is still in beta and may not be fully available in the client library
    const merchantApi = google.content({
      version: 'v2.1', // Use Content API v2.1 for now
      auth: authClient
    });
    
    console.log('Successfully initialized Google API client');
    
    return merchantApi;
  } catch (error) {
    console.error('Error initializing Merchant API client:', error);
    throw new Error('Failed to initialize Google Merchant API client');
  }
});

/**
 * Convert a Knitkart product to Google Merchant API format
 * @param {Object} product - Product from MongoDB
 * @returns {Object} Product in Google Merchant API format
 */
export function convertProductToMerchantFormat(product) {
  // Get the main image URL
  const mainImage = product.images.find(img => img.isMain)?.url || product.images[0]?.url;
  
  // Get additional images (up to 10 as per Google's requirements)
  const additionalImageUrls = product.images
    .filter(img => !img.isMain)
    .slice(0, 9) // Google allows up to 10 images (1 main + 9 additional)
    .map(img => img.url);
  
  // Format the price (remove currency symbol and ensure it's a number with 2 decimal places)
  const priceValue = product.salePrice || product.price;
  
  // Build the product data in Content API format
  // Note: Content API uses offerId instead of productId
  const merchantProduct = {
    offerId: product._id.toString(), // Use MongoDB ID as the offer ID
    title: product.name,
    description: product.description.full || product.description.short || product.name,
    // Using _id instead of slug as per your note
    link: `${process.env.NEXT_PUBLIC_APP_URL}/shop/product/${product._id}`,
    imageLink: mainImage,
    contentLanguage: 'en',
    targetCountry: 'IN',
    channel: 'online',
    // Handle availability based on stock count and backorder settings
    availability: product.inventory.stockCount > 0 ? 'in stock' : 
                 (product.inventory.allowBackorder ? 'backorder' : 'out of stock'),
    condition: 'new',
    googleProductCategory: mapCategoryToGoogleCategory(product.category),
    price: {
      value: priceValue.toFixed(2),
      currency: 'INR'
    },
    brand: 'Knitkart', // Using Knitkart as the brand for all products
    mpn: product.inventory.sku || product._id.toString(),
    identifierExists: false, // Set to true if you have GTIN, MPN, and brand
    customAttributes: [
      {
        name: 'made_in',
        value: 'India'
      },
      {
        name: 'handmade',
        value: 'true'
      }
    ]
  };
  
  // Add additional image links if available
  if (additionalImageUrls.length > 0) {
    merchantProduct.additionalImageLinks = additionalImageUrls;
  }
  
  // Add optional fields if they exist in the product
  if (product.specifications?.ageGroup) {
    merchantProduct.ageGroup = mapAgeGroup(product.specifications.ageGroup);
  }
  
  if (product.specifications?.colors && product.specifications.colors.length > 0) {
    merchantProduct.color = product.specifications.colors.join('/');
  }
  
  if (product.material) {
    merchantProduct.material = product.material;
  }
  
  if (product.specifications?.patterns && product.specifications.patterns.length > 0) {
    merchantProduct.pattern = product.specifications.patterns.join('/');
  }
  
  if (product.size) {
    merchantProduct.sizes = [product.size];
  }
  
  // Add shipping information
  merchantProduct.shipping = [
    {
      country: 'IN',
      service: 'Standard',
      price: {
        value: '0.00',
        currency: 'INR'
      }
    }
  ];
  
  return merchantProduct;
}

/**
 * Map Knitkart category to Google product category
 * @param {string} category - Knitkart category
 * @returns {string} Google product category
 */
function mapCategoryToGoogleCategory(category) {
  // Google requires specific category taxonomy
  // See: https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt
  
  const categoryMap = {
    'womens-clothing': 'Apparel & Accessories > Clothing > Dresses',
    'mens-clothing': 'Apparel & Accessories > Clothing > Shirts & Tops',
    'kids-clothing': 'Apparel & Accessories > Clothing > Baby & Toddler Clothing',
    'home-decor': 'Home & Garden > Decor',
    'accessories': 'Apparel & Accessories > Clothing Accessories',
    'toys': 'Toys & Games > Stuffed Animals & Plush Toys',
    'bags': 'Apparel & Accessories > Handbags, Wallets & Cases > Handbags',
    'footwear': 'Apparel & Accessories > Shoes'
  };
  
  return categoryMap[category] || 'Apparel & Accessories > Clothing';
}

/**
 * Map Knitkart age group to Google age group
 * @param {string} ageGroup - Knitkart age group
 * @returns {string} Google age group
 */
function mapAgeGroup(ageGroup) {
  const ageGroupMap = {
    'baby': 'newborn',
    'toddler': 'infant',
    'children': 'kids',
    'teen': 'adult',
    'adult': 'adult'
  };
  
  return ageGroupMap[ageGroup] || 'adult';
}
