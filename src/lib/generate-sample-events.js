'use server';

import { queueEvent } from './event-queue';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import dbConnect from '@/lib/mongodb';

// Sample locations for anonymized display
const sampleLocations = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Kochi', 'Chandigarh', 'Indore', 'Bhopal', 'Nagpur'
];

// Get a random location
function getRandomLocation() {
  const randomIndex = Math.floor(Math.random() * sampleLocations.length);
  return sampleLocations[randomIndex] + ', India';
}

// Generate random quantity between min and max
function getRandomQuantity(min = 1, max = 5) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a batch of sample events for testing
export async function generateSampleEvents(count = 10) {
  try {
    await dbConnect();
    
    // Get random products from the database
    const totalProducts = await Product.countDocuments();
    const randomProducts = await Product.find()
      .skip(Math.max(0, Math.floor(Math.random() * totalProducts) - count))
      .limit(count)
      .lean();
    
    if (!randomProducts || randomProducts.length === 0) {
      return { success: false, message: 'No products found to generate events' };
    }
    
    // Get random sellers
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const randomSellers = await User.find({ role: 'seller' })
      .skip(Math.max(0, Math.floor(Math.random() * totalSellers) - 3))
      .limit(3)
      .lean();
    
    // Create a map of seller IDs to seller names
    const sellerMap = new Map();
    for (const seller of randomSellers) {
      sellerMap.set(seller.appwriteId, seller.name);
    }
    
    const eventTypes = ['purchase', 'cart_add', 'view', 'low_stock', 'review', 'wishlist_add'];
    const events = [];
    
    // Generate random events
    for (let i = 0; i < count; i++) {
      const product = randomProducts[i % randomProducts.length];
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      // Get seller name from map or use a default
      const sellerName = sellerMap.get(product.sellerId) || 'Knitkart Seller';
      
      // Get the main image or first available image
      let productImage = null;
      if (product.images && product.images.length > 0) {
        // First try to find the main image
        const mainImage = product.images.find(img => img.isMain);
        // If no main image is found, use the first image
        productImage = mainImage || product.images[0];
      }
      
      const baseEvent = {
        type: eventType,
        productId: product._id,
        productName: product.name,
        productImage: productImage,
        sellerId: product.sellerId,
        sellerName: sellerName,
        location: getRandomLocation(),
        quantity: getRandomQuantity(),
        timestamp: new Date() // Current time for immediate display
      };
      
      // Queue the event (non-blocking)
      queueEvent(baseEvent);
      events.push(baseEvent);
    }
    
    // Add a new seller event
    if (randomSellers && randomSellers.length > 0) {
      const randomSeller = randomSellers[0];
      const newSellerEvent = {
        type: 'new_seller',
        sellerId: randomSeller.appwriteId,
        sellerName: randomSeller.name || 'New Artisan',
        location: getRandomLocation(),
        timestamp: new Date() // Current time for immediate display
      };
      
      queueEvent(newSellerEvent);
      events.push(newSellerEvent);
    }
    
    return { success: true, count: events.length };
  } catch (error) {
    console.error('Error generating sample events:', error);
    return { success: false, error: error.message };
  }
}
