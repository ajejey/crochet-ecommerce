'use server';

import { createAdminClient } from '@/appwrite/config';
import auth from '@/auth';
import { ID } from 'node-appwrite';

export async function registerSeller(formData) {
  try {
    // Get current user
    const user = await auth.getUser();
    if (!user) {
      return { error: 'You must be logged in to register as a seller' };
    }

    const data = {
      user_id: user.$id,
      business_name: formData.get('business_name'),
      description: formData.get('description'), 
      status: 'pending',
      commission_rate: 10, // Default 10% commission
      created_at: new Date().toISOString()
    };

    // Create seller profile
    const { databases } = createAdminClient();
    const sellerProfile = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_SELLER_PROFILES,
      ID.unique(),
      data
    );

    // Update user role to seller
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_USERS,
      user.$id,
      {
        role: 'seller'
      }
    );

    return { success: true, seller: sellerProfile };
  } catch (error) {
    console.error('Error registering seller:', error);
    return { error: error.message };
  }
}