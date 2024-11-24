'use server';

import { createAdminClient } from '@/appwrite/config';
import { Query } from 'node-appwrite';
import { cookies } from 'next/headers';
import auth from '@/auth';

// Cache seller profile to avoid repeated lookups
let cachedSellerProfile = null;

async function getSellerProfile() {
  if (cachedSellerProfile) return cachedSellerProfile;

  const user = await auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const { databases } = createAdminClient();
  const sellerProfiles = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID,
    process.env.NEXT_PUBLIC_COLLECTION_SELLER_PROFILES,
    [Query.equal('user_id', user.$id)]
  );

  if (!sellerProfiles.documents.length) {
    throw new Error('Seller profile not found');
  }

  cachedSellerProfile = sellerProfiles.documents[0];
  return cachedSellerProfile;
}

export async function getSellerOrders({ status, search, page = 1, limit = 10 } = {}) {
  try {
    const seller = await getSellerProfile();
    const { databases } = createAdminClient();

    // Build query
    const queries = [
      Query.equal('seller_id', seller.$id),
      Query.orderDesc('$createdAt'),
      Query.limit(limit),
      Query.offset((page - 1) * limit)
    ];

    if (status && status !== 'all') {
      queries.push(Query.equal('status', status));
    }

    if (search) {
      queries.push(Query.search('buyer_name', search));
    }

    // Get orders
    const orders = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ORDERS,
      queries
    );

    // Get total count for pagination
    const totalQueries = [Query.equal('seller_id', seller.$id)];
    if (status && status !== 'all') {
      totalQueries.push(Query.equal('status', status));
    }
    if (search) {
      totalQueries.push(Query.search('buyer_name', search));
    }

    const totalOrders = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ORDERS,
      totalQueries
    );

    return {
      success: true,
      orders: orders.documents,
      total: totalOrders.total,
      page,
      totalPages: Math.ceil(totalOrders.total / limit)
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getOrderBasicDetails(orderId) {
  try {
    const seller = await getSellerProfile();
    const { databases } = createAdminClient();

    // Get order and verify ownership
    const order = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ORDERS,
      orderId
    );

    if (order.seller_id !== seller.$id) {
      throw new Error('Order not found');
    }

    return {
      success: true,
      order
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getOrderItems(orderId) {
  try {
    const seller = await getSellerProfile();
    const { databases } = createAdminClient();

    // Verify ownership first
    const order = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ORDERS,
      orderId
    );

    if (order.seller_id !== seller.$id) {
      throw new Error('Order not found');
    }

    // Get order items in a single query
    const orderItems = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ORDER_ITEMS,
      [Query.equal('order_id', orderId)]
    );

    // Get product details for each order item
    const itemsWithDetails = await Promise.all(
      orderItems.documents.map(async (item) => {
        const product = await databases.getDocument(
          process.env.NEXT_PUBLIC_DATABASE_ID,
          process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
          item.product_id
        );

        let variantDetails = null;
        if (item.variant_id) {
          try {
            variantDetails = await databases.getDocument(
              process.env.NEXT_PUBLIC_DATABASE_ID,
              process.env.NEXT_PUBLIC_COLLECTION_PRODUCT_VARIANTS,
              item.variant_id
            );
          } catch (error) {
            console.error('Error fetching variant:', error);
          }
        }

        return {
          ...item,
          product_name: product.name,
          product_image: product.images?.[0] || product.image_urls?.[0],
          variant_name: variantDetails?.name
        };
      })
    );

    return {
      success: true,
      items: itemsWithDetails
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getBuyerDetails(orderId) {
  try {
    const seller = await getSellerProfile();
    const { databases } = createAdminClient();

    // Get order and verify ownership
    const order = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ORDERS,
      orderId
    );

    if (order.seller_id !== seller.$id) {
      throw new Error('Order not found');
    }

    return {
      success: true,
      buyer: {
        name: order.buyer_name,
        email: order.buyer_email,
        phone: order.buyer_phone,
        shipping_address: order.shipping_address
      }
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getOrderStatus(orderId) {
  try {
    const seller = await getSellerProfile();
    const { databases } = createAdminClient();

    // Get order and verify ownership
    const order = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ORDERS,
      orderId
    );

    if (order.seller_id !== seller.$id) {
      throw new Error('Order not found');
    }

    return {
      success: true,
      status: order.status
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    const seller = await getSellerProfile();
    const { databases } = createAdminClient();

    // Verify ownership
    const order = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ORDERS,
      orderId
    );

    if (order.seller_id !== seller.$id) {
      throw new Error('Order not found');
    }

    // Update status
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ORDERS,
      orderId,
      {
        status,
        updated_at: new Date().toISOString()
      }
    );

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
