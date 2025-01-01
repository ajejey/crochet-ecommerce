'use server';

import dbConnect from '@/lib/mongodb';
import { SellerProfile } from '@/models/SellerProfile';
import { Product } from '@/models/Product';
import SellerReview from '@/models/SellerReview';

const ITEMS_PER_PAGE = 12;

export async function getCreatorProducts(creatorId, { page = 1, sort = 'newest' } = {}) {
  try {
    await dbConnect();

    // Calculate pagination
    const skip = (parseInt(page) - 1) * ITEMS_PER_PAGE;

    // Determine sort order
    let sortOptions = {};
    switch (sort) {
      case 'price-high':
        sortOptions = { price: -1 };
        break;
      case 'price-low':
        sortOptions = { price: 1 };
        break;
      case 'popular':
        sortOptions = { 'metadata.rating.average': -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
    }

    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      Product.find({ sellerId: creatorId, status: 'active' })
        .sort(sortOptions)
        .skip(skip)
        .limit(ITEMS_PER_PAGE)
        .select('-__v')
        .lean(),
      Product.countDocuments({ sellerId: creatorId, status: 'active' })
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      products: products.map(product => ({
        ...product,
        _id: product._id.toString(),
        mainImage: product.images?.find(img => img.isMain)?.url || 
                  product.images?.[0]?.url || 
                  '/placeholder-product.jpg'
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
    console.error('Error fetching creator products:', error);
    throw new Error('Failed to fetch creator products');
  }
}

export async function getCreatorReviews(creatorId, { page = 1 } = {}) {
  try {
    await dbConnect();

    const skip = (parseInt(page) - 1) * ITEMS_PER_PAGE;

    const [reviews, totalCount] = await Promise.all([
      SellerReview.find({ 
        sellerId: creatorId,
        status: 'approved'
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(ITEMS_PER_PAGE)
        .select('-__v')
        .lean(),
      SellerReview.countDocuments({ 
        sellerId: creatorId,
        status: 'approved'
      })
    ]);

    console.log("REVIEWS ", reviews)
    console.log("totalCount ", totalCount)

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    if(reviews.length === 0) {
      return {
        reviews: [],
        pagination: {
          page: parseInt(page),
          totalPages,
          hasNextPage,
          hasPrevPage,
          totalItems: totalCount
        }
      };
    }

    return {
      reviews: reviews.map(review => ({
        ...review,
        _id: review._id.toString()
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
    console.error('Error fetching creator reviews:', error);
    throw new Error('Failed to fetch creator reviews');
  }
}

export async function getCreatorStats(creatorId) {
  try {
    await dbConnect();
    
    // Get seller profile
    const sellerProfile = await SellerProfile.findOne({ userId: creatorId }).lean();
    if (!sellerProfile) return null;

    // Get real-time counts
    const [productsCount, reviewsCount] = await Promise.all([
      Product.countDocuments({ sellerId: creatorId, status: 'active' }),
      SellerReview.countDocuments({ sellerId: creatorId })
    ]);

    // Combine profile data with real-time stats
    return {
      ...sellerProfile,
      metadata: {
        ...sellerProfile.metadata,
        productsCount,
        reviewsCount
      }
    };
  } catch (error) {
    console.error('Error fetching creator stats:', error);
    throw new Error('Failed to fetch creator stats');
  }
}