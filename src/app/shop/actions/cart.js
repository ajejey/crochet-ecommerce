'use server';

import { cookies } from 'next/headers';
import { ID } from 'node-appwrite';
import dbConnect from '@/lib/mongodb';
import { CartItem } from '@/models/CartItem';
import { Product } from '@/models/Product';
import { Variant } from '@/models/Variant';
import mongoose from 'mongoose';
import { recordCartAdd } from '@/lib/social-proof';

const CART_ITEMS_COLLECTION = process.env.NEXT_PUBLIC_COLLECTION_CART_ITEMS;

// Helper to get or create cart ID
async function getOrCreateCartId() {
  const cookieStore = cookies();
  let cartId = cookieStore.get("cartId")?.value;
  
  if (!cartId) {
    cartId = ID.unique();
    // Set cookie to expire in 7 days
    cookieStore.set("cartId", cartId, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }
  
  return cartId;
}

// Get cart items with optimized queries
export async function getCartItems() {
  try {
    const cookieStore = cookies();
    const cartId = cookieStore.get('cartId')?.value;

    if (!cartId) {
      return { success: true, items: [] };
    }

    await dbConnect();

    // Get cart items with populated product and variant data
    const cartItems = await CartItem.find({ cartId })
      .populate({
        path: 'product',
        model: Product,
        select: 'name description price images inventory.stockCount status'
      })
      .populate({
        path: 'variant',
        model: Variant,
        select: 'name price_adjustment'
      })
      .lean();

    // Transform the items to match the expected format
    const transformedItems = cartItems.map(item => ({
      $id: item._id.toString(),
      cartId: item.cartId,
      product: {
        ...item.product,
        _id: item.product._id.toString(),
        image_urls: item.product.images?.map(img => ({
          ...img,
          _id: img._id ? img._id.toString() : undefined,
          url: img.url
        })) || []
      },
      variant: item.variant ? {
        ...item.variant,
        _id: item.variant._id.toString(),
        price_adjustment: item.variant.price_adjustment
      } : null,
      quantity: item.quantity
    }));

    return { success: true, items: JSON.parse(JSON.stringify(transformedItems)) };
  } catch (error) {
    console.error('Error getting cart items:', error);
    return { success: false, error: error.message };
  }
}

// Add item to cart
export async function addToCart(data) {
  try {
    const { productId, variantId, quantity, productData } = data;
    const cartId = await getOrCreateCartId();
    
    // Convert string ID to ObjectId
    const productObjectId = new mongoose.Types.ObjectId(productId);
    
    let product;
    let variant = null;
    
    // If productData is provided, use it to avoid database lookup
    if (productData) {
      product = productData;
    } else {
      // Otherwise, fetch from database
      await dbConnect();
      
      // Check if product exists
      product = await Product.findById(productObjectId);
      if (!product) {
        return { success: false, error: 'Product not found' };
      }
    }

    await dbConnect();
    
    // Check if variant exists if variantId is provided
    let variantObjectId = null;
    if (variantId) {
      variantObjectId = new mongoose.Types.ObjectId(variantId);
      
      if (!productData || !productData.variant) {
        variant = await Variant.findById(variantObjectId);
        if (!variant) {
          return { success: false, error: 'Variant not found' };
        }
      }
    }

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({
      cartId,
      product: productObjectId,
      ...(variantObjectId ? { variant: variantObjectId } : {})
    });

    if (existingItem) {
      // Update quantity of existing item
      existingItem.quantity += quantity;
      existingItem.updatedAt = new Date();
      await existingItem.save();

      // Return the populated item
      const populatedItem = await CartItem.findById(existingItem._id)
        .populate({
          path: 'product',
          select: 'name description price images inventory.stockCount status'
        })
        .populate({
          path: 'variant',
          select: 'name price_adjustment'
        });

      // Transform the item
      const transformedItem = {
        $id: populatedItem._id.toString(),
        cartId: populatedItem.cartId,
        product: {
          ...populatedItem.product.toObject(),
          _id: populatedItem.product._id.toString(),
          image_urls: populatedItem.product.images?.map(img => ({
            ...img,
            _id: img._id ? img._id.toString() : undefined,
            url: img.url
          })) || []
        },
        variant: populatedItem.variant ? {
          ...populatedItem.variant.toObject(),
          _id: populatedItem.variant._id.toString()
        } : null,
        quantity: populatedItem.quantity
      };

      return { success: true, item: transformedItem };
    }

    // Add new item to cart
    const cartItem = await CartItem.create({
      cartId,
      product: productObjectId,
      variant: variantObjectId,
      quantity,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // If we have productData, construct the response without additional DB query
    if (productData) {
      const transformedItem = {
        $id: cartItem._id.toString(),
        cartId: cartItem.cartId,
        product: {
          _id: productId,
          name: productData.name,
          price: productData.price,
          description: productData.description || '',
          images: productData.images || [],
          image_urls: productData.images?.map(img => img.url) || [productData.image || ''],
          inventory: productData.inventory || { stockCount: 999 },
          status: productData.status || 'active'
        },
        variant: variantId && productData.variant ? {
          _id: variantId,
          name: productData.variant.name || '',
          price_adjustment: productData.variant.price_adjustment || 0
        } : null,
        quantity
      };
      
      // Record social proof event (non-blocking)
      recordCartAdd({
        _id: productId,
        name: productData.name,
        images: productData.images || [],
        seller: productData.seller || {}
      }, quantity);
      
      return { success: true, item: transformedItem };
    }

    // Otherwise, populate the new item from DB
    const populatedItem = await CartItem.findById(cartItem._id)
      .populate({
        path: 'product',
        select: 'name description price images inventory.stockCount status'
      })
      .populate({
        path: 'variant',
        select: 'name price_adjustment'
      });

    // Transform the item
    const transformedItem = {
      $id: populatedItem._id.toString(),
      cartId: populatedItem.cartId,
      product: {
        ...populatedItem.product.toObject(),
        _id: populatedItem.product._id.toString(),
        image_urls: populatedItem.product.images?.map(img => ({
          ...img,
          _id: img._id ? img._id.toString() : undefined,
          url: img.url
        })) || []
      },
      variant: populatedItem.variant ? {
        ...populatedItem.variant.toObject(),
        _id: populatedItem.variant._id.toString()
      } : null,
      quantity: populatedItem.quantity
    };

    return { success: true, item: transformedItem };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, error: error.message };
  }
}

// Remove item from cart
export async function removeFromCart(itemId) {
  try {
    await dbConnect();
    
    // Convert string ID to ObjectId if it's not a local ID
    let itemObjectId;
    if (!itemId.startsWith('local-')) {
      itemObjectId = new mongoose.Types.ObjectId(itemId);
    } else {
      // For local IDs, we need to find the item by other means
      // This would require additional logic if we want to support removing local items
      // For now, we'll just return success since the item is already removed from local state
      return { success: true };
    }
    
    const result = await CartItem.findByIdAndDelete(itemObjectId);
    
    if (!result) {
      return { success: false, error: 'Cart item not found' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, error: error.message };
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(itemId, quantity) {
  try {
    if (quantity < 1) {
      return removeFromCart(itemId);
    }
    
    await dbConnect();
    
    // Convert string ID to ObjectId if it's not a local ID
    let itemObjectId;
    if (!itemId.startsWith('local-')) {
      itemObjectId = new mongoose.Types.ObjectId(itemId);
    } else {
      // For local IDs, we need to find the item by other means
      // This would require additional logic if we want to support updating local items
      // For now, we'll just return success since the item is already updated in local state
      return { success: true };
    }
    
    const cartItem = await CartItem.findById(itemObjectId);
    
    if (!cartItem) {
      return { success: false, error: 'Cart item not found' };
    }
    
    cartItem.quantity = quantity;
    cartItem.updatedAt = new Date();
    await cartItem.save();
    
    return { success: true, item: { ...cartItem.toObject(), $id: cartItem._id.toString() } };
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return { success: false, error: error.message };
  }
}
