import { cache } from 'react';
import { cookies } from 'next/headers';
import { createSessionClient } from '@/appwrite/config';
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
    
    // Get Appwrite user
    const { account } = await createSessionClient(sessionCookie.value);
    const appwriteUser = await account.get();

    console.log("APPWRITE USER ------------------ ", appwriteUser)

    // Get or create MongoDB user
    let mongoUser = await User.findOne({ appwriteId: appwriteUser.$id })
      .populate('sellerProfile');
    
    if (!mongoUser) {
      // Create new user in MongoDB
      mongoUser = await User.create({
        appwriteId: appwriteUser.$id,
        email: appwriteUser.email,
        name: appwriteUser.name,
        role: 'user',
        lastSync: new Date(),
        metadata: {
          lastLogin: new Date(),
          loginCount: 1
        }
      });
    } else {
      // Update login metadata
      await User.findByIdAndUpdate(mongoUser._id, {
        $set: { 'metadata.lastLogin': new Date() },
        $inc: { 'metadata.loginCount': 1 }
      });
    }

    // Merge Appwrite and MongoDB user data
    return {
      ...appwriteUser,
      _id: JSON.parse(JSON.stringify(mongoUser._id)),
      role: mongoUser.role || 'user',
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
