"use server";

import { createAdminClient } from "@/appwrite/config";
import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";

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
    const { databases } = createAdminClient();
    const cookieStore = cookies();
    const cartId = cookieStore.get('cartId')?.value;

    if (!cartId) {
      return { success: true, items: [] };
    }

    // Get all cart items in a single query
    const cartItems = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      CART_ITEMS_COLLECTION,
      [Query.equal('cart_id', cartId)]
    );

    if (cartItems.documents.length === 0) {
      return { success: true, items: [] };
    }

    // Get all product IDs and variant IDs
    const productIds = [...new Set(cartItems.documents.map(item => item.product_id))];
    const variantIds = [...new Set(cartItems.documents.map(item => item.variant_id).filter(Boolean))];

    // Fetch all products in a single query
    const products = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
      [Query.equal('$id', productIds)]
    );

    // Fetch all variants in a single query if there are any
    let variants = [];
    if (variantIds.length > 0) {
      variants = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_VARIANTS,
        [Query.equal('$id', variantIds)]
      );
    }

    // Create lookup maps for faster access
    const productMap = new Map(products.documents.map(p => [p.$id, p]));
    const variantMap = new Map(variants.documents?.map(v => [v.$id, v]) || []);

    // Combine the data
    const itemsWithDetails = cartItems.documents.map(item => ({
      ...item,
      product: productMap.get(item.product_id),
      variant: item.variant_id ? variantMap.get(item.variant_id) : null
    }));

    return { success: true, items: itemsWithDetails };
  } catch (error) {
    console.error('Error getting cart items:', error);
    return { success: false, error: error.message };
  }
}

// Add item to cart
export async function addToCart({ productId, variantId, quantity }) {
  try {
    const { databases } = createAdminClient();
    const cartId = await getOrCreateCartId();

    // Check if item already exists in cart
    const existingItems = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      CART_ITEMS_COLLECTION,
      [
        Query.equal('cart_id', cartId),
        Query.equal('product_id', productId),
        variantId ? Query.equal('variant_id', variantId) : Query.isNull('variant_id'),
      ]
    );

    if (existingItems.documents.length > 0) {
      // Update quantity of existing item
      const existingItem = existingItems.documents[0];
      const updatedItem = await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        CART_ITEMS_COLLECTION,
        existingItem.$id,
        {
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString(),
        }
      );
      return { success: true, item: updatedItem };
    }

    // Add new item to cart
    const cartItem = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      CART_ITEMS_COLLECTION,
      ID.unique(),
      {
        cart_id: cartId,
        product_id: productId,
        variant_id: variantId || null,
        quantity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    );

    return { success: true, item: cartItem };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, error: error.message };
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(itemId, quantity) {
  try {
    const { databases } = createAdminClient();

    if (quantity <= 0) {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        CART_ITEMS_COLLECTION,
        itemId
      );
      return { success: true, deleted: true };
    }

    const updatedItem = await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      CART_ITEMS_COLLECTION,
      itemId,
      {
        quantity,
        updated_at: new Date().toISOString(),
      }
    );

    return { success: true, item: updatedItem };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return { success: false, error: error.message };
  }
}

// Remove item from cart
export async function removeFromCart(itemId) {
  try {
    const { databases } = createAdminClient();
    
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      CART_ITEMS_COLLECTION,
      itemId
    );

    return { success: true };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, error: error.message };
  }
}
