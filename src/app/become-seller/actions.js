'use server';

import { getAuthUser } from '@/lib/auth-context';
import { User } from '@/models/User';
import { SellerProfile } from '@/models/SellerProfile';
import dbConnect from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';

export async function registerSeller(formData) {
  try {
    // Get current user with cached auth context
    const user = await getAuthUser();
    if (!user) {
      return { error: 'You must be logged in to register as a seller' };
    }

    await dbConnect();

    // Check if user is already a seller
    const existingProfile = await SellerProfile.findOne({ userId: user.$id });
    if (existingProfile) {
      return { error: 'You are already registered as a seller' };
    }

    // Use a session to ensure atomic operations
    const session = await User.startSession();
    let sellerProfile;

    try {
      await session.withTransaction(async () => {
        // Create seller profile - set status to active by default
        sellerProfile = await SellerProfile.create({
          userId: user.$id,
          businessName: formData.get('business_name'),
          description: formData.get('description'),
          status: 'active', // Changed from 'pending' to 'active'
          metadata: {
            productsCount: 0,
            ordersCount: 0,
            totalSales: 0,
            rating: {
              average: 0,
              count: 0
            }
          }
        });

        // Update user role to seller
        await User.findOneAndUpdate(
          { appwriteId: user.$id },
          { 
            role: 'seller',
            sellerProfile: sellerProfile._id,
            $set: { 
              'metadata.lastUpdated': new Date(),
              'metadata.becameSeller': new Date(),
              'metadata.autoApproved': true // Add a flag to indicate auto-approval
            }
          },
          { session }
        );
      });
    } finally {
      await session.endSession();
    }

    // Revalidate relevant paths
    revalidatePath('/seller');
    revalidatePath('/become-seller');
    revalidatePath('/profile');

    return { success: true };
  } catch (error) {
    console.error('Error registering seller:', error);
    
    // Return user-friendly error messages
    if (error.code === 11000) {  // MongoDB duplicate key error
      return { error: 'This business name is already taken' };
    }
    
    return { error: 'Failed to register as seller. Please try again.' };
  }
}