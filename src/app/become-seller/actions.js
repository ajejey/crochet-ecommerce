'use server';

import { getAuthUser } from '@/lib/auth-context';
import { User } from '@/models/User';
import { SellerProfile } from '@/models/SellerProfile';
import dbConnect from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';

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
      // If already a seller, just redirect to the seller dashboard
      if (existingProfile.status === 'active') {
        return {
          success: true,
          message: 'You are already registered as a seller',
          sellerProfile: {
            businessName: existingProfile.businessName,
            slug: existingProfile.slug,
            status: existingProfile.status
          }
        };
      }
      // If pending approval, let them know
      else if (existingProfile.status === 'pending') {
        return {
          success: true,
          message: 'Your seller application is pending approval',
          sellerProfile: {
            businessName: existingProfile.businessName,
            slug: existingProfile.slug,
            status: 'pending'
          }
        };
      }
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

      // Send seller welcome email (don't fail registration if email fails)
      try {
        const { sendSellerWelcomeEmail } = await import('@/lib/email-auth');
        await sendSellerWelcomeEmail(user.email, user.name, sellerProfile.businessName);
      } catch (emailError) {
        console.error('Failed to send seller welcome email:', emailError);
        // Continue with registration even if email fails
      }

      // Revalidate the seller path to ensure latest data
      revalidatePath('/seller');

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