'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createAdminClient, createSessionClient } from '@/appwrite/config';
import SignupFormClient from './SignupFormClient';
import { User } from '@/models/User';
import dbConnect from '@/lib/mongodb';
import { ID } from 'node-appwrite';
import { CartItem } from '@/models/CartItem';
import { Product } from '@/models/Product';

async function getUser() {
  const sessionCookie = cookies().get('session');
  if (!sessionCookie?.value) return null;

  try {
    const { account } = await createSessionClient(sessionCookie.value);
    return await account.get();
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

async function createAccount(formData) {
  "use server";
  
  try {
    const data = Object.fromEntries(formData);
    const { name, email, password } = data;

    // Get guest cart ID before creating account
    const guestCartId = cookies().get('cartId')?.value;

    const { account } = await createAdminClient();
    
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

    // Create session immediately after account creation
    const session = await account.createEmailPasswordSession(email, password);
    
    // Set the session cookie
    cookies().set('session', session.secret, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      expires: new Date(session.expire),
    });

    // If there was a guest cart, migrate the items to the user's cart
    if (guestCartId) {
      try {
        // Get the guest cart items with complete product data to avoid future lookups
        const guestCartItems = await CartItem.find({ cartId: guestCartId })
          .populate({
            path: 'product',
            model: Product,
            select: 'name description price images inventory.stockCount status variants'
          })
          .lean();

        // For each guest cart item, create a new cart item for the user
        for (const item of guestCartItems) {
          // Check stock availability
          const stockCount = item.product?.inventory?.stockCount || 0;
          const requestedQuantity = item.quantity;

          // Only migrate items that are still in stock
          if (stockCount >= requestedQuantity) {
            // Create cart item with complete product data to avoid future lookups
            await CartItem.create({
              userId: appwriteUser.$id,
              product: item.product._id,
              quantity: requestedQuantity,
              variant: item.variant,
              productData: {
                name: item.product.name,
                description: item.product.description,
                price: item.product.price,
                images: item.product.images.map(img => ({
                  url: img.url,
                  _id: img._id.toString()
                })),
                inventory: {
                  stockCount: stockCount
                },
                status: item.product.status,
                variants: item.product.variants
              },
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
        }

        // Delete the guest cart items
        await CartItem.deleteMany({ cartId: guestCartId });

        // Clear the guest cart cookie since items are now associated with the user
        cookies().delete('cartId');
      } catch (error) {
        console.error('Error migrating guest cart:', error);
        // Don't throw error, allow signup to complete even if cart migration fails
      }
    }

    // Redirect will be handled by the server component after this returns
    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return { error: error.message || 'Failed to create account' };
  }
}

export default async function SignupForm({ searchParams }) {
  const user = await getUser();
  const redirectTo = searchParams?.from || '/';

  if (user) {
    redirect(redirectTo);
  }

  // After successful account creation and session creation, createAccount will set the cookie
  // and we'll redirect the user to their intended destination
  async function handleCreateAccount(formData) {
    "use server";
    
    const result = await createAccount(formData);
    
    if (result.success) {
      redirect(redirectTo);
    }
    
    return result;
  }

  return <SignupFormClient createAccount={handleCreateAccount} redirectTo={redirectTo} />;
}