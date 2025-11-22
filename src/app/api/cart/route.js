import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
// NOTE: This file uses old Appwrite code and may not be in use
// TODO: Remove or migrate to new auth system
// import { createAdminClient } from '@/appwrite/config';
// import { Query } from 'node-appwrite';

const CART_ITEMS_COLLECTION = process.env.NEXT_PUBLIC_COLLECTION_CART_ITEMS;

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { databases } = createAdminClient();
    const cookieStore = cookies();
    const cartId = cookieStore.get('cartId')?.value;

    if (!cartId) {
      return NextResponse.json({ success: true, items: [] });
    }

    // Get all cart items in a single query
    const cartItems = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      CART_ITEMS_COLLECTION,
      [Query.equal('cart_id', cartId)]
    );

    if (cartItems.documents.length === 0) {
      return NextResponse.json({ success: true, items: [] });
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

    return NextResponse.json({ success: true, items: itemsWithDetails });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart items' },
      { status: 500 }
    );
  }
}
