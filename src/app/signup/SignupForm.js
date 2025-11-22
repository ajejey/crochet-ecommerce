'use server';

import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth-context';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { User } from '@/models/User';
import { CartItem } from '@/models/CartItem';
import { Product } from '@/models/Product';
import dbConnect from '@/lib/mongodb';
import { sendWelcomeEmail } from '@/lib/email-auth';
import { cookies } from 'next/headers';
import SignupFormClient from './SignupFormClient';

async function createAccount(formData) {
  "use server";

  try {
    const data = Object.fromEntries(formData);
    const { name, email, password } = data;

    // Validate input
    if (!name || !email || !password) {
      return { error: 'Name, email, and password are required' };
    }

    // Validate password strength
    if (password.length < 8) {
      return { error: 'Password must be at least 8 characters long' };
    }

    // Connect to database
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return { error: 'An account with this email already exists' };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Get guest cart ID before creating account
    const guestCartId = cookies().get('cartId')?.value;

    // Create new user
    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: 'user',
      emailVerified: false,
      lastSync: new Date(),
      metadata: {
        lastLogin: new Date(),
        loginCount: 1,
        preferences: {
          newsletter: false,
          notifications: true
        }
      }
    });

    // Send welcome email (don't fail registration if email fails)
    sendWelcomeEmail(email, name).catch(error => {
      console.error('Error sending welcome email:', error);
    });

    // Migrate guest cart if exists
    if (guestCartId) {
      try {
        // Get the guest cart items with complete product data
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
            await CartItem.create({
              userId: newUser._id.toString(),
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

        // Clear the guest cart cookie
        cookies().delete('cartId');
      } catch (error) {
        console.error('Error migrating guest cart:', error);
        // Don't fail registration if cart migration fails
      }
    }

    // Generate JWT token
    const token = generateToken(newUser._id.toString(), newUser.email, newUser.role);

    // Set auth cookie
    setAuthCookie(token);

    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return { error: error.message || 'Failed to create account' };
  }
}

export default async function SignupForm({ searchParams }) {
  const user = await getAuthUser();
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