'use server';

import { getAuthUser } from '@/lib/auth-context';
import { User } from '@/models/User';
import { SellerProfile } from '@/models/SellerProfile';
import dbConnect from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/appwrite/config';
import { ID } from 'node-appwrite';

export async function registerSeller(formData) {
  try {
    // Get current user with cached auth context
    const user = await getAuthUser();
    if (!user) {
      return { error: 'Authentication error. Please try logging in again.' };
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
        // Create seller profile
        sellerProfile = await SellerProfile.create({
          userId: user.$id,
          businessName: formData.get('businessName'),
          description: formData.get('description'),
          contactEmail: user.email, // Use the email from signup
          phoneNumber: formData.get('phone'),
          category: formData.get('category'),
          status: 'pending',
          address: {
            street: formData.get('street'),
            city: formData.get('city'),
            state: formData.get('state'),
            country: 'India', // Default to India
            postalCode: formData.get('postalCode')
          },
          metadata: {
            productsCount: 0,
            ordersCount: 0,
            totalSales: 0,
            rating: {
              average: 0,
              count: 0
            },
            identityVerified: false,
            documentsSubmitted: false
          }
        });

        // Update user role to seller
        await User.findOneAndUpdate(
          { appwriteId: user.$id },
          { 
            role: 'seller',
            sellerProfile: sellerProfile._id
          }
        );
      });

      await session.endSession();
      revalidatePath('/become-seller');
      
      return { 
        success: true, 
        message: 'Your seller profile has been created! You can now start setting up your shop. Remember to submit your identity documents later to enable payments through Razorpay.',
        sellerProfile 
      };
    } catch (error) {
      await session.endSession();
      throw error;
    }
  } catch (error) {
    console.error('Error registering seller:', error);
    return { error: 'Failed to register seller. Please try again.' };
  }
}

export async function createSellerAccount(formData) {
  try {
    const { email, password, name } = Object.fromEntries(formData);
    const { account } = createAdminClient();

    // Create Appwrite account
    const appwriteUser = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    // Connect to MongoDB
    await dbConnect();

    // Create MongoDB user
    await User.create({
      appwriteId: appwriteUser.$id,
      email,
      name,
      role: 'user',
      lastSync: new Date(),
      metadata: {
        lastLogin: new Date(),
        loginCount: 0,
        preferences: {
          newsletter: false,
          notifications: true
        }
      }
    });

    // Create session
    const session = await account.createEmailPasswordSession(email, password);
    return { success: true, session };
  } catch (error) {
    console.error('Error creating account:', error);
    return { error: error.message || 'Failed to create account' };
  }
}