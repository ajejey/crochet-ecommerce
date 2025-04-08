import { queueEvent } from './event-queue';

// Helper function to anonymize location
export function anonymizeLocation(location) {
  if (!location) return 'somewhere';
  
  // If we have city and state/country, keep only that info
  const parts = location.split(',').map(part => part.trim());
  if (parts.length >= 2) {
    return `${parts[0]}, ${parts[parts.length - 1]}`;
  }
  return location;
}

// Helper to record purchase events
export function recordPurchase(order) {
  if (!order || !order.items || order.items.length === 0) return;
  
  // Record one random item from the order
  const randomIndex = Math.floor(Math.random() * order.items.length);
  const item = order.items[randomIndex];
  
  queueEvent({
    type: 'purchase',
    productId: item.productId,
    productName: item.name,
    productImage: item.image,
    sellerId: item.sellerId,
    sellerName: item.sellerName,
    location: anonymizeLocation(order.shippingAddress?.city),
    quantity: item.quantity
  });
}

// Helper to record cart add events
export function recordCartAdd(product, quantity = 1) {
  if (!product) return;
  
  // Get the main image or first available image
  let productImage = null;
  if (product.images && product.images.length > 0) {
    // First try to find the main image
    const mainImage = product.images.find(img => img.isMain);
    // If no main image is found, use the first image
    productImage = mainImage || product.images[0];
  }
  
  queueEvent({
    type: 'cart_add',
    productId: product._id,
    productName: product.name,
    productImage: productImage,
    sellerId: product.sellerId,
    sellerName: product.sellerName || 'Knitkart Seller',
    quantity
  });
}

// Helper to record product view events
export function recordProductView(product) {
  if (!product) return;
  
  // Get the main image or first available image
  let productImage = null;
  if (product.images && product.images.length > 0) {
    // First try to find the main image
    const mainImage = product.images.find(img => img.isMain);
    // If no main image is found, use the first image
    productImage = mainImage || product.images[0];
  }
  
  queueEvent({
    type: 'view',
    productId: product._id,
    productName: product.name,
    productImage: productImage,
    sellerId: product.sellerId,
    sellerName: product.sellerName || 'Knitkart Seller'
  });
}

// Helper to record low stock events
export function recordLowStock(product) {
  if (!product || !product.inventory || !product.inventory.stockCount || product.inventory.stockCount > 5) return;
  
  // Get the main image or first available image
  let productImage = null;
  if (product.images && product.images.length > 0) {
    // First try to find the main image
    const mainImage = product.images.find(img => img.isMain);
    // If no main image is found, use the first image
    productImage = mainImage || product.images[0];
  }
  
  queueEvent({
    type: 'low_stock',
    productId: product._id,
    productName: product.name,
    productImage: productImage,
    sellerId: product.sellerId,
    sellerName: product.sellerName || 'Knitkart Seller',
    quantity: product.inventory.stockCount
  });
}

// Helper to record new product events
export function recordNewProduct(product) {
  if (!product) return;
  
  queueEvent({
    type: 'new_arrival',
    productId: product._id,
    productName: product.name,
    productImage: product.images && product.images.length > 0 ? product.images[0] : null,
    sellerId: product.seller?._id,
    sellerName: product.seller?.name
  });
}

// Helper to record review events
export function recordReview(review) {
  if (!review || !review.product) return;
  
  queueEvent({
    type: 'review',
    productId: review.product._id,
    productName: review.product.name,
    productImage: review.product.images && review.product.images.length > 0 ? review.product.images[0] : null,
    sellerId: review.product.seller?._id,
    sellerName: review.product.seller?.name
  });
}

// Helper to record wishlist add events
export function recordWishlistAdd(product) {
  if (!product) return;
  
  queueEvent({
    type: 'wishlist_add',
    productId: product._id,
    productName: product.name,
    productImage: product.images && product.images.length > 0 ? product.images[0] : null,
    sellerId: product.seller?._id,
    sellerName: product.seller?.name
  });
}

// Helper to record new seller events
export function recordNewSeller(seller) {
  if (!seller) return;
  
  queueEvent({
    type: 'new_seller',
    sellerId: seller._id,
    sellerName: seller.name,
    location: anonymizeLocation(seller.location || seller.address?.city)
  });
}

// Format event message based on type
export function formatEventMessage(event) {
  if (!event) return '';
  
  switch(event.type) {
    case 'purchase':
      return `Someone in ${event.location || 'India'} just purchased "${event.productName}" by ${event.sellerName}!`;
    case 'cart_add':
      return `Someone just added "${event.productName}" to their cart.`;
    case 'view':
      return `${event.quantity || 'Several'} people are looking at "${event.productName}" right now.`;
    case 'low_stock':
      return `Only ${event.quantity} left of "${event.productName}"!`;
    case 'review':
      return `A customer just left a 5-star review for "${event.productName}"!`;
    case 'wishlist_add':
      return `Someone just added "${event.productName}" to their wishlist.`;
    case 'new_seller':
      return `Welcome ${event.sellerName}, our newest seller from ${event.location || 'India'}!`;
    case 'new_arrival':
      return `New "${event.productName}" just listed by ${event.sellerName}!`;
    default:
      return '';
  }
}
