'use server';

import { createAdminClient } from '@/appwrite/config';
import { Query } from 'node-appwrite';
import { cookies } from 'next/headers';
import { ID } from 'node-appwrite';
import auth from '@/auth';

export async function getActiveProducts() {
  const { databases } = createAdminClient();
  
  try {
    const products = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
      [
        Query.equal('status', 'active'),
        Query.orderDesc('$createdAt')
      ]
    );

    return products.documents;
  } catch (error) {
    console.error('Error fetching active products:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function getProduct(productId) {
  const { databases } = createAdminClient();
  
  try {
    const product = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
      productId
    );

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getProductReviews(productId) {
  const { databases } = createAdminClient();
  
  try {
    const reviews = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_REVIEWS,
      [
        Query.equal('product_id', productId),
        Query.orderDesc('$createdAt')
      ]
    );

    return reviews.documents;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export async function getProductsByCategory(category) {
  const { databases } = createAdminClient();
  
  try {
    const products = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
      [
        Query.equal('status', 'active'),
        Query.equal('category', category),
        Query.orderDesc('$createdAt')
      ]
    );

    return products.documents;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

export async function createReview(productId, rating, comment) {
  const { databases } = createAdminClient();
  
  try {
    // Get current user
    const user = await auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const review = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_REVIEWS,
      ID.unique(),
      {
        product_id: productId,
        buyer_id: user.$id,
        rating,
        comment,
        created_at: new Date().toISOString(),
      }
    );

    // Update product rating and review count
    const reviews = await getProductReviews(productId);
    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
      productId,
      {
        rating: averageRating,
        reviews_count: reviews.length
      }
    );

    return review;
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Failed to create review');
  }
}
