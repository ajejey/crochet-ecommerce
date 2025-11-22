import { cache } from 'react';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { User } from '@/models/User';
import { SellerProfile } from '@/models/SellerProfile';
import dbConnect from '@/lib/mongodb';
import { redirect } from 'next/navigation';

// Cached function to get the current user
export const getAuthUser = cache(async () => {
  const sessionCookie = cookies().get('session');
  if (!sessionCookie?.value) return null;

  try {
    await dbConnect();

    // Verify JWT token
    const decoded = verifyToken(sessionCookie.value);
    if (!decoded) return null;

    // Get MongoDB user
    let mongoUser = await User.findById(decoded.userId)
      .populate('sellerProfile');

    if (!mongoUser) {
      return null;
    }

    // Update login metadata
    await User.findByIdAndUpdate(mongoUser._id, {
      $set: { 'metadata.lastLogin': new Date() },
      $inc: { 'metadata.loginCount': 1 }
    });

    // Return user data in format compatible with existing code
    return {
      $id: mongoUser._id.toString(), // Keep $id for backward compatibility
      id: mongoUser._id.toString(),
      email: mongoUser.email,
      name: mongoUser.name,
      role: mongoUser.role || 'user',
      _id: JSON.parse(JSON.stringify(mongoUser._id)),
      sellerProfile: mongoUser.sellerProfile,
      metadata: mongoUser.metadata
    };
  } catch (error) {
    console.error('Auth context error:', error);
    return null;
  }
});

// Helper to check if user is authenticated
export const requireAuth = async (redirectTo = '/login') => {
  const user = await getAuthUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
};

// Helper to check if user is a seller
export const requireSeller = async () => {
  const user = await requireAuth('/login');

  // console.log("user in requireSeller", user)

  if (user.role !== 'seller' && user.role !== 'admin') {
    redirect('/become-seller');
  }

  // Get the latest seller profile directly from MongoDB
  await dbConnect();
  const sellerProfile = await SellerProfile.findOne({ userId: user.$id });

  console.log("sellerProfile in requireSeller", sellerProfile)

  if (!sellerProfile) {
    redirect('/become-seller');
  }

  if (sellerProfile.status === 'pending') {
    return {
      ...user,
      sellerProfile,
      pendingApproval: true
    };
  }

  if (sellerProfile.status !== 'active') {
    redirect('/become-seller?error=inactive');
  }

  return {
    ...user,
    sellerProfile
  };
};

// Helper to check if user is admin
export async function requireAdmin() {
  const user = await getAuthUser();

  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  return user;
}

// Admin middleware helper
export function withAdmin(handler) {
  return async function adminMiddleware(params) {
    const user = await requireAdmin();
    return handler({ ...params, user });
  };
}

// Auth middleware helper
export const withAuth = (handler, options = {}) => {
  return async function authWrapper(...args) {
    try {
      const user = options.requireSeller
        ? await requireSeller()
        : await requireAuth();

      return handler(user, ...args);
    } catch (error) {
      return {
        error: error.message || 'Authentication failed',
        status: error.message.includes('required') ? 401 : 403
      };
    }
  };
};
