'use server';

import { createAdminClient, createSessionClient } from '@/appwrite/config';
import { Query } from 'node-appwrite';
import { cookies } from 'next/headers';

export async function getOrders() {
  try {
    const sessionCookie = cookies().get('session');
    if (!sessionCookie?.value) {
      return { success: false, message: 'Not authenticated' };
    }

    // Get current user
    const { account } = await createSessionClient(sessionCookie.value);
    const user = await account.get();

    const { databases } = createAdminClient();
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ORDERS,
      [
        Query.equal('buyer_id', user.$id),
        Query.orderDesc('$createdAt'),
        Query.limit(10)
      ]
    );
    
    return { success: true, orders: response.documents };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { success: false, message: error.message };
  }
}

export async function getOrderById(orderId) {
  try {
    const sessionCookie = cookies().get('session');
    if (!sessionCookie?.value) {
      return { success: false, message: 'Not authenticated' };
    }

    // Get current user
    const { account } = await createSessionClient(sessionCookie.value);
    const user = await account.get();

    const { databases } = createAdminClient();
    
    // Get the order
    const order = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ORDERS,
      orderId
    );

    // Check if the order belongs to the current user
    if (order.buyer_id !== user.$id) {
      return { success: false, message: 'Order not found' };
    }

    // Get order items
    const orderItems = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      'order_items',
      [Query.equal('order_id', orderId)]
    );

    return {
      success: true,
      order,
      orderItems: orderItems.documents
    };
  } catch (error) {
    console.error('Error fetching order details:', error);
    return { success: false, message: 'Failed to load order details' };
  }
}
