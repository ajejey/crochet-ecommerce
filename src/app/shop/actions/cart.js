'use server';

import { cookies } from 'next/headers';
import { ID } from 'node-appwrite';
import dbConnect from '@/lib/mongodb';
import { CartItem } from '@/models/CartItem';
import { Product } from '@/models/Product';
import { Variant } from '@/models/Variant';
import mongoose from 'mongoose';

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
        image_urls: item.product.images?.map(img => img.url) || []
      },
      variant: item.variant ? {
        ...item.variant,
        _id: item.variant._id.toString(),
        price_adjustment: item.variant.price_adjustment
      } : null,
      quantity: item.quantity
    }));

    return { success: true, items: transformedItems };
  } catch (error) {
    console.error('Error getting cart items:', error);
    return { success: false, error: error.message };
  }
}

// Add item to cart
export async function addToCart(data) {
  try {
    const { productId, variantId, quantity } = data;
    const cartId = await getOrCreateCartId();
    await dbConnect();

    // Convert string ID to ObjectId
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Check if product exists
    const product = await Product.findById(productObjectId);
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    // Check if variant exists if variantId is provided
    let variantObjectId = null;
    if (variantId) {
      variantObjectId = new mongoose.Types.ObjectId(variantId);
      const variant = await Variant.findById(variantObjectId);
      if (!variant) {
        return { success: false, error: 'Variant not found' };
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
          image_urls: populatedItem.product.images?.map(img => img.url) || []
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

    // Populate the new item
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
        image_urls: populatedItem.product.images?.map(img => img.url) || []
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

// Update cart item quantity
export async function updateCartItemQuantity(itemId, quantity) {
  try {
    await dbConnect();

    // Convert string ID to ObjectId
    const itemIdObjectId = new mongoose.Types.ObjectId(itemId);

    // Find the cart item first to check if it exists
    const cartItem = await CartItem.findById(itemIdObjectId).populate('product');
    if (!cartItem) {
      return { success: false, error: 'Cart item not found' };
    }

    // Check if we have enough stock
    if (cartItem.product && quantity > cartItem.product.inventory.stockCount) {
      return { success: false, error: 'Not enough stock available' };
    }

    // If quantity is 0 or less, remove the item
    if (quantity <= 0) {
      await CartItem.findByIdAndDelete(itemIdObjectId);
      return { success: true, deleted: true };
    }

    // Update the quantity
    const updatedItem = await CartItem.findByIdAndUpdate(
      itemIdObjectId,
      { 
        quantity,
        updatedAt: new Date()
      },
      { new: true }
    ).populate({
      path: 'product',
      select: 'name description price images inventory.stockCount status'
    }).populate({
      path: 'variant',
      select: 'name price_adjustment'
    });

    if (!updatedItem) {
      return { success: false, error: 'Failed to update cart item' };
    }

    // Transform the updated item to match the expected format
    const transformedItem = {
      $id: updatedItem._id.toString(),
      cartId: updatedItem.cartId,
      product: {
        ...updatedItem.product.toObject(),
        _id: updatedItem.product._id.toString(),
        image_urls: updatedItem.product.images?.map(img => img.url) || []
      },
      variant: updatedItem.variant ? {
        ...updatedItem.variant.toObject(),
        _id: updatedItem.variant._id.toString()
      } : null,
      quantity: updatedItem.quantity
    };

    return { success: true, item: transformedItem };
  } catch (error) {
    console.error('Error updating cart item:', error);
    return { success: false, error: error.message };
  }
}

// Remove item from cart
export async function removeFromCart(itemId) {
  try {
    await dbConnect();
    
    // Convert string ID to ObjectId
    const itemIdObjectId = new mongoose.Types.ObjectId(itemId);

    // Check if the item exists first
    const cartItem = await CartItem.findById(itemIdObjectId);
    if (!cartItem) {
      return { success: false, error: 'Cart item not found' };
    }

    // Remove the item
    await CartItem.findByIdAndDelete(itemIdObjectId);
    
    return { success: true };
  } catch (error) {
    console.error('Error removing cart item:', error);
    return { success: false, error: error.message };
  }
}
