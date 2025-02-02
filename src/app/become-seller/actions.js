'use server';

import { getAuthUser } from '@/lib/auth-context';
import { User } from '@/models/User';
import { SellerProfile } from '@/models/SellerProfile';
import dbConnect from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/appwrite/config';
import { ID } from 'node-appwrite';

// Utility function to generate a unique slug
const generateUniqueSlug = async (businessName) => {
  // Convert business name to a URL-friendly slug
  const baseSlug = businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  let slug = baseSlug;
  let counter = 1;
  
  // Check if slug already exists, if so, append a number
  while (await SellerProfile.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

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

    // Generate unique slug for seller profile
    const businessName = formData.get('businessName');
    const slug = await generateUniqueSlug(businessName);

    // Use a session to ensure atomic operations
    const session = await User.startSession();
    let sellerProfile;

    try {
      await session.withTransaction(async () => {
        // Create seller profile
        sellerProfile = await SellerProfile.create({
          userId: user.$id,
          businessName,
          slug, // Add the generated slug here
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

      return { 
        success: true, 
        message: 'Seller registration successful', 
        sellerProfile: {
          businessName: sellerProfile.businessName,
          slug: sellerProfile.slug
        }
      };
    } catch (transactionError) {
      console.error('Transaction error:', transactionError);
      return { error: 'Failed to complete seller registration' };
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Seller registration error:', error);
    return { error: error.message || 'Failed to register as seller' };
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