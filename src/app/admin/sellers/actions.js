'use server';

import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { SellerProfile } from '@/models/SellerProfile';
import { getAuthUser, requireAdmin } from '@/lib/auth-context';

export async function getSellerStats() {
  await dbConnect();

  try {
    await requireAdmin();

    const [
      totalSellers,
      activeSellers,
      pendingSellers,
      suspendedSellers
    ] = await Promise.all([
      SellerProfile.countDocuments(),
      SellerProfile.countDocuments({ status: 'active' }),
      SellerProfile.countDocuments({ status: 'pending' }),
      SellerProfile.countDocuments({ status: 'suspended' })
    ]);

    return {
      total: totalSellers,
      active: activeSellers,
      pending: pendingSellers,
      suspended: suspendedSellers
    };
  } catch (error) {
    console.error('Failed to get seller stats:', error);
    throw error;
  }
}

export async function getSellers({ status, search, page = 1, limit = 10 }) {
  try {
    await requireAdmin();
    await dbConnect();

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { contactEmail: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const totalDocs = await SellerProfile.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);

    const sellers = await SellerProfile.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get all unique user IDs from sellers
    const userIds = sellers.map(seller => seller.userId);
    
    // Fetch all users in one query
    const users = await User.find({ appwriteId: { $in: userIds } })
      .select('name email')
      .lean();

    // Create a map of user data for quick lookup
    const userMap = users.reduce((acc, user) => {
      acc[user.appwriteId] = user;
      return acc;
    }, {});

    // Merge user data with seller data
    const sellersWithUsers = sellers.map(seller => ({
      ...seller,
      user: userMap[seller.userId]
    }));

    return {
      sellers: sellersWithUsers,
      page,
      pages: totalPages,
      total: totalDocs
    };
  } catch (error) {
    console.error('Error fetching sellers:', error);
    throw new Error('Failed to fetch sellers');
  }
}

export async function updateSellerStatus(sellerId, status) {
  await dbConnect();

  try {
    await requireAdmin();

    const seller = await SellerProfile.findByIdAndUpdate(
      sellerId,
      { status },
      { new: true }
    );

    if (!seller) {
      throw new Error('Seller not found');
    }

    return seller;
  } catch (error) {
    console.error('Failed to update seller status:', error);
    throw error;
  }
}
