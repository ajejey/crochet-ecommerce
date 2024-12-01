'use server';

import { requireSeller } from '@/lib/auth-context';
import dbConnect, { getMongoDb } from '@/lib/mongodb';
import { SellerProfile } from '@/models/SellerProfile';

export async function updateSellerProfile(formData) {
  try {
    // Get the authenticated seller
    const user = await requireSeller();
    if (!user) {
      return { error: 'Not authenticated as a seller' };
    }

    // Get form data
    const businessName = formData.get('businessName');
    const contactEmail = formData.get('contactEmail') || user.email; // Use user email as fallback
    const phoneNumber = formData.get('phoneNumber') || user.phone; // Use user phone as fallback
    const description = formData.get('description');
    const street = formData.get('street');
    const city = formData.get('city');
    const state = formData.get('state');
    const postalCode = formData.get('postalCode');
    const country = formData.get('country');

    // Validate required fields
    if (!businessName) {
      return { error: 'Business name is required' };
    }

    // Create update object following the schema
    const updateData = {
      businessName,
      contactEmail,
      phoneNumber,
      description,
      address: {
        street,
        city,
        state,
        postalCode,
        country
      }
    };

    // Connect to MongoDB
    await dbConnect();

    // Update in MongoDB using the correct collection name
    const result = await SellerProfile.updateOne(
      { userId: user.$id }, // Use $id from Appwrite user
      { 
        $set: updateData,
        $setOnInsert: { 
          status: 'active',
          metadata: {
            productsCount: 0,
            ordersCount: 0,
            totalSales: 0,
            rating: {
              average: 0,
              count: 0
            },
            featured: false
          }
        }
      },
      { upsert: true }
    );

    if (!result.acknowledged) {
      return { error: 'Failed to update profile' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating seller profile:', error);
    return { error: 'An unexpected error occurred' };
  }
}