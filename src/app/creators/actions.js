'use server';

import dbConnect from '@/lib/mongodb';
import { SellerProfile } from '@/models/SellerProfile';
import { revalidatePath } from 'next/cache';

const ITEMS_PER_PAGE = 12;

export async function getActiveCreators({ page = 1, search = '', sort = 'newest' } = {}) {
  try {
    await dbConnect();
    
    const query = {
      status: 'active'
    };

    // Add search functionality
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { specialties: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * ITEMS_PER_PAGE;
    
    // Determine sort order
    let sortOptions = {};
    switch (sort) {
      case 'rating':
        sortOptions = { 'metadata.rating.average': -1 };
        break;
      case 'popular':
        sortOptions = { 'metadata.productsCount': -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
    }

    // Get creators with pagination
    const [creators, totalCount] = await Promise.all([
      SellerProfile.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(ITEMS_PER_PAGE)
        .select('-__v')
        .lean(),
      SellerProfile.countDocuments(query)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      creators: creators.map(creator => ({
        ...creator,
        _id: creator._id.toString()
      })),
      pagination: {
        page: parseInt(page),
        totalPages,
        hasNextPage,
        hasPrevPage,
        totalItems: totalCount
      }
    };
  } catch (error) {
    console.error('Error fetching creators:', error);
    throw new Error('Failed to fetch creators');
  }
}

export async function getCreatorById(creatorId) {
  try {
    await dbConnect();
    
    const creator = await SellerProfile.findOne({
      userId: creatorId,
      status: 'active'
    })
    .select('-__v')
    .lean();

    if (!creator) {
      throw new Error('Creator not found');
    }

    return {
      ...creator,
      _id: creator._id.toString()
    };
  } catch (error) {
    console.error('Error fetching creator:', error);
    throw new Error('Failed to fetch creator');
  }
}

export async function getCreatorStats(creatorId) {
  try {
    await dbConnect();
    
    const stats = await SellerProfile.aggregate([
      { $match: { userId: creatorId } },
      {
        $project: {
          totalProducts: '$metadata.productsCount',
          totalSales: '$metadata.totalSales',
          rating: '$metadata.rating',
          joinedDate: '$createdAt'
        }
      }
    ]);

    return stats[0] || null;
  } catch (error) {
    console.error('Error fetching creator stats:', error);
    throw new Error('Failed to fetch creator stats');
  }
}