'use server';

import { createAdminClient, createSessionClient } from '@/appwrite/config';
import { Query, ID } from 'node-appwrite';
import { cookies } from 'next/headers';

const ORDERS_COLLECTION = process.env.NEXT_PUBLIC_COLLECTION_ORDERS;
const ORDER_ITEMS_COLLECTION = 'order_items';
const CART_ITEMS_COLLECTION = process.env.NEXT_PUBLIC_COLLECTION_CART_ITEMS;

export async function createOrder(orderData) {
  try {
    const cookieStore = cookies();
    const cartId = cookieStore.get('cartId')?.value;
    const sessionCookie = cookieStore.get('session');

    if (!cartId) {
      return { success: false, message: 'No cart found' };
    }

    if (!sessionCookie?.value) {
      return { success: false, message: 'Please login to complete your purchase' };
    }

    // Get authenticated user
    const { account } = await createSessionClient(sessionCookie.value);
    const user = await account.get();

    const { databases } = createAdminClient();

    // Get cart items
    const cartItems = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      CART_ITEMS_COLLECTION,
      [Query.equal('cart_id', cartId)]
    );

    if (!cartItems.documents.length) {
      return { success: false, message: 'Cart is empty' };
    }

    // Get the first product to get seller information
    const firstCartItem = cartItems.documents[0];
    const firstProduct = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
      firstCartItem.product_id
    );

    // Calculate fees and amounts
    const platformFeePercentage = 0.10; // 10% platform fee
    const platformFee = orderData.total * platformFeePercentage;
    const sellerAmount = orderData.total - platformFee;

    // Create the order document
    const order = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      ORDERS_COLLECTION,
      ID.unique(),
      {
        buyer_id: user.$id,
        buyer_email: user.email,
        buyer_name: orderData.name,
        buyer_phone: orderData.phone,
        seller_id: firstProduct.seller_id,
        total_amount: orderData.total,
        platform_fee: platformFee,
        seller_amount: sellerAmount,
        status: 'pending',
        payment_status: 'pending',
        razorpay_order_id: '',
        razorpay_payment_id: '',
        shipping_address: orderData.address,
        shipping_city: orderData.city,
        shipping_state: orderData.state,
        shipping_pincode: orderData.pincode,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }
    );

    // Create order items
    for (const item of cartItems.documents) {
      // Get product details
      const product = await databases.getDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
        item.product_id
      );

      await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        ORDER_ITEMS_COLLECTION,
        ID.unique(),
        {
          order_id: order.$id,
          product_id: item.product_id,
          variant_id: null, // or item.variant_id if you have variants
          quantity: item.quantity,
          price: product.price
        }
      );
    }

    // Clear cart items
    for (const item of cartItems.documents) {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        CART_ITEMS_COLLECTION,
        item.$id
      );
    }

    return { success: true, orderId: order.$id };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, message: error.message };
  }
}
