'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    totalAmount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLoading]);

  const calculateTotals = (items) => {
    return {
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: items.reduce((sum, item) => {
        const price = item.salePrice || item.price;
        return sum + (price * item.quantity);
      }, 0)
    };
  };

  const addToCart = (product, quantity = 1) => {
    console.log("Adding to cart:", product, quantity);

    const sampleProduct = {
      "_id": "67cd66860a5f5c5c5067d11b",
      "name": "Handmade Crochet Tote",
      "price": 2500,
      "category": "accessories",
      "sellerId": "67cd4710002662124583",
      "status": "active",
      "rating": {
          "average": 0,
          "count": 0
      },
      "images": [
          {
              "url": "https://cloud.appwrite.io/v1/storage/buckets/product_images/files/67cd65ef00209cb88855/view?project=67271d60001a27af8ba4",
              "id": "67cd65ef00209cb88855",
              "isMain": true,
              "_id": "67cf2637f1151a6b5463f652"
          },
          {
              "url": "https://cloud.appwrite.io/v1/storage/buckets/product_images/files/67cd877400190b1dffa6/view?project=67271d60001a27af8ba4",
              "id": "67cd877400190b1dffa6",
              "isMain": false,
              "_id": "67cf2637f1151a6b5463f653"
          }
      ],
      "description": {
          "short": "Carry your essentials in style with this handcrafted crochet tote bag. Featuring a unique open weave and durable construction, it's perfect for everyday use or special occasions. Grab yours now!",
          "full": "<div style=\"font-family: Arial, sans-serif; color: #333333; line-height: 1.6;\">\r\n  <p style=\"margin-bottom: 15px;\">Isn't it time you treated yourself to a bag that's as unique as you are? A bag that whispers 'handmade with love' every time you carry it?</p>\r\n\r\n  <ul style=\"list-style-type: disc; padding-left: 20px; margin-bottom: 15px;\">\r\n    <li><b>Eye-Catching Design:</b> Stand out from the crowd with the intricate crochet work and unique open weave pattern.</li>\r\n    <li><b>Durable Construction:</b> Expertly crafted to withstand daily use, ensuring your essentials are always secure.</li>\r\n    <li><b>Versatile Style:</b> Complements any outfit, from casual daywear to elegant evening attire.</li>\r\n    <li><b>Comfortable to Carry:</b> Lightweight design and sturdy straps make it easy to carry all day long.</li>\r\n  </ul>\r\n\r\n  <p style=\"margin-bottom: 15px;\">This bag isn't just assembled; it's crafted with passion and meticulous attention to detail. Hours of expertise go into creating each piece, ensuring you receive a bag of unparalleled quality and charm.</p>\r\n\r\n  <p style=\"margin-bottom: 15px;\">Carry it to the farmer's market, use it as your everyday tote, or bring it on your next vacation. The possibilities are endless!</p>\r\n\r\n  <p style=\"margin-bottom: 15px;\">To keep your crochet bag looking its best, simply spot clean with a damp cloth and mild detergent. Air dry away from direct sunlight.</p>\r\n\r\n  <p style=\"margin-bottom: 15px;\">We stand behind the quality of our handcrafted items. Each bag is carefully inspected to meet our high standards of craftsmanship and durability.</p>\r\n\r\n  <p style=\"margin-bottom: 15px;\">Don't miss your chance to own this limited-edition crochet bag. Due to the handmade nature, only a few are available!</p>\r\n\r\n  <p style=\"font-weight: bold; margin-bottom: 0;\">Add this unique piece to your collection today and experience the joy of owning a truly special handmade creation.</p>\r\n</div>"
      },
      "specifications": {
          "colors": [
              "Yellow",
              "Black"
          ],
          "patterns": [],
          "dimensions": {
              "length": 26,
              "width": 26,
              "height": 3
          }
      },
      "inventory": {
          "stockCount": 1,
          "sku": "tote-bag-yellow",
          "allowBackorder": false,
          "lowStockThreshold": 5
      },
      "metadata": {
          "searchKeywords": [
              "Crochet tote bag",
              "Handmade handbag",
              "Woven shoulder bag",
              "Summer tote",
              "Beach bag",
              "Market bag",
              "Boho chic",
              "Artisanal bag",
              "Unique gift",
              "Ethical fashion",
              "Sustainable bag",
              "Limited edition",
              "Crochet fashion",
              "Festival bag",
              "Lightweight tote"
          ]
      },
      "createdAt": "2025-03-09T09:59:34.223Z",
      "relevanceScore": 3,
      "seller": {
          "_id": "67cd4d370a5f5c5c5067d094",
          "userId": "67cd4710002662124583",
          "businessName": "Anuradha Crochets",
          "slug": "anuradha-crochets",
          "description": "Anuradha Crochets is the heart and soul of Anuradha, who has been creating beautiful crochet pieces for over 30 years. From intricate doilies to cozy wearables and home décor, every piece is handcrafted with love and care. Her passion for crochet turns simple threads into timeless treasures, made just for you.",
          "contactEmail": "anubengoor68@gmail.com",
          "phoneNumber": "+91 9620893808",
          "specialties": [],
          "achievements": [],
          "status": "active",
          "address": {
              "street": "Rajarajeshwari nagar",
              "city": "Bangalore",
              "state": "Karnataka",
              "country": "India",
              "postalCode": "560098"
          },
          "metadata": {
              "productsCount": 1,
              "ordersCount": 0,
              "totalSales": 0,
              "rating": {
                  "average": 0,
                  "count": 0
              },
              "followersCount": 0,
              "followingCount": 0,
              "featured": false
          },
          "createdAt": "2025-03-09T08:11:35.237Z",
          "updatedAt": "2025-03-09T09:59:34.288Z",
          "__v": 0
      },
      "mainImage": "https://cloud.appwrite.io/v1/storage/buckets/product_images/files/67cd65ef00209cb88855/view?project=67271d60001a27af8ba4"
  }

    try {
      // Check stock availability
      const stockCount = product.inventory?.stockCount || 0;
      const existingItem = cart.items.find(item => item._id === product._id);
      const currentQuantity = existingItem?.quantity || 0;
      
      if (currentQuantity + quantity > stockCount) {
        toast.error(`Only ${stockCount - currentQuantity} items available`);
        return { success: false };
      }

      setCart(prevCart => {
        const existingItemIndex = prevCart.items.findIndex(item => item._id === product._id);
        let newItems;

        if (existingItemIndex > -1) {
          // Update quantity if item exists
          newItems = prevCart.items.map((item, index) => 
            index === existingItemIndex 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item
          newItems = [...prevCart.items, { 
            _id: product._id,
            name: product.name,
            price: product.price,
            salePrice: product.salePrice,
            quantity,
            image_urls: product.images,
            inventory: product.inventory
          }];
        }

        const totals = calculateTotals(newItems);
        return { items: newItems, ...totals };
      });
      
      toast.success('Added to cart');
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
      return { success: false };
    }
  };

  const removeFromCart = (productId) => {
    try {
      setCart(prevCart => {
        const newItems = prevCart.items.filter(item => item._id !== productId);
        const totals = calculateTotals(newItems);
        return { items: newItems, ...totals };
      });
      
      toast.success('Removed from cart');
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove from cart');
      return { success: false };
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        return removeFromCart(productId);
      }

      setCart(prevCart => {
        const item = prevCart.items.find(item => item._id === productId);
        if (!item) return prevCart;

        // Check stock availability
        if (newQuantity > (item.inventory?.stockCount || 0)) {
          toast.error(`Only ${item.inventory.stockCount} items available`);
          return prevCart;
        }

        const newItems = prevCart.items.map(item =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        );

        const totals = calculateTotals(newItems);
        return { items: newItems, ...totals };
      });

      toast.success('Quantity updated');
      return { success: true };
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
      return { success: false };
    }
  };

  const clearCart = () => {
    setCart({ items: [], totalItems: 0, totalAmount: 0 });
    localStorage.removeItem('cart');
  };

  const value = {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
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