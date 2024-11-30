'use server';

import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Review } from '@/models/Review';
import { SellerProfile } from '@/models/SellerProfile';
import { getAuthUser } from '@/lib/auth-context';
import { revalidatePath } from 'next/cache';

const PRODUCTS_PER_PAGE = 12;

// Simple initial load function
export async function getInitialProducts() {
  try {
    await dbConnect();
    const products = await Product.find({ status: 'active' })
      .select('name price images category')
      .sort({ createdAt: -1 })
      .limit(PRODUCTS_PER_PAGE)
      .lean();

    return {
      products: products.map(product => ({
        ...product,
        _id: product._id.toString(),
        mainImage: product.images?.find(img => img.isMain)?.url || 
                  product.images?.[0]?.url || 
                  '/placeholder-product.jpg'
      })),
      pagination: {
        currentPage: 1,
        hasMore: products.length === PRODUCTS_PER_PAGE
      }
    };
  } catch (error) {
    console.error('Error fetching initial products:', error);
    return { products: [], pagination: { currentPage: 1, hasMore: false } };
  }
}

// Complex filtered products function
export async function getFilteredProducts({ 
  page = 1, 
  category = null, 
  sort = 'latest',
  minPrice = null,
  maxPrice = null,
  search = null
}) {
  try {
    await dbConnect();

    // Build query
    const query = { status: 'active' };
    if (category && category !== 'all') {
      query.category = category;
    }
    if (minPrice !== null || maxPrice !== null) {
      query.price = {};
      if (minPrice !== null) query.price.$gte = minPrice;
      if (maxPrice !== null) query.price.$lte = maxPrice;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sortQuery = {};
    switch (sort) {
      case 'price-asc':
        sortQuery.price = 1;
        break;
      case 'price-desc':
        sortQuery.price = -1;
        break;
      case 'popular':
        sortQuery['metadata.salesCount'] = -1;
        break;
      case 'rating':
        sortQuery['rating.average'] = -1;
        break;
      default: // latest
        sortQuery.createdAt = -1;
    }

    const skip = (page - 1) * PRODUCTS_PER_PAGE;
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .select('name description price images category status rating metadata createdAt sellerId')
        .sort(sortQuery)
        .skip(skip)
        .limit(PRODUCTS_PER_PAGE)
        .lean(),
      Product.countDocuments(query)
    ]);

    // Get seller profiles for all products
    const sellerIds = [...new Set(products.map(p => p.sellerId))];
    const sellerProfiles = await SellerProfile.find({ userId: { $in: sellerIds } }).lean();
    const sellerMap = Object.fromEntries(
      sellerProfiles.map(seller => [seller.userId, seller])
    );

    return {
      products: products.map(product => ({
        ...product,
        _id: product._id.toString(),
        mainImage: product.images?.find(img => img.isMain)?.url || 
                  product.images?.[0]?.url || 
                  '/placeholder-product.jpg',
        sellerId: product.sellerId,
        sellerName: sellerMap[product.sellerId]?.businessName || 'Unknown Seller',
        averageRating: product.rating?.average || 0,
        totalReviews: product.rating?.count || 0
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / PRODUCTS_PER_PAGE),
        hasMore: skip + products.length < total,
        total
      }
    };
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    return { products: [], pagination: { currentPage: page, hasMore: false, total: 0 } };
  }
}

export async function getProduct(productId) {
  try {
    await dbConnect();

    const product = await Product.findById(productId).lean();

    if (!product) {
      throw new Error('Product not found');
    }

    // Get seller profile
    const sellerProfile = await SellerProfile.findOne({ userId: product.sellerId }).lean();

    // Transform for client
    return {
      ...product,
      _id: product._id.toString(),
      sellerId: product.sellerId,
      sellerName: sellerProfile?.businessName || 'Unknown Seller',
      sellerEmail: sellerProfile?.contactEmail,
      averageRating: product.rating?.average || 0,
      totalReviews: product.rating?.count || 0,
      inventory: {
        stockCount: product.inventory?.stockCount || 0,
        lowStockThreshold: product.inventory?.lowStockThreshold || 5,
        sku: product.inventory?.sku || '',
        allowBackorder: product.inventory?.allowBackorder || false
      }
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
}

export async function getProductReviews(productId, page = 1) {
  try {
    await dbConnect();
    
    const REVIEWS_PER_PAGE = 10;
    const skip = (page - 1) * REVIEWS_PER_PAGE;

    const [reviews, total] = await Promise.all([
      Review.find({ productId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(REVIEWS_PER_PAGE)
        .lean(),
      Review.countDocuments({ productId })
    ]);

    return {
      reviews: reviews.map(review => ({
        ...review,
        _id: review._id.toString(),
        user: {
          id: review.userId,
          name: review.userName
        }
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / REVIEWS_PER_PAGE),
        hasMore: skip + reviews.length < total,
        total
      }
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw new Error('Failed to fetch reviews');
  }
}

export async function createReview(productId, rating, comment) {
  try {
    await dbConnect();
    const user = await getAuthUser();
    
    if (!user) {
      throw new Error('You must be logged in to leave a review');
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      productId,
      userId: user.$id // Use Appwrite user ID
    });

    if (existingReview) {
      throw new Error('You have already reviewed this product');
    }

    // Create the review
    const review = await Review.create({
      productId,
      userId: user.$id, // Use Appwrite user ID
      userName: user.name || 'Anonymous User',
      rating,
      comment,
      status: 'approved'
    });

    // Update product rating
    await updateProductRating(productId);

    // Revalidate the product page
    revalidatePath(`/shop/product/${productId}`);

    return {
      ...review.toObject(),
      _id: review._id.toString(),
      user: {
        id: user.$id, // Use Appwrite user ID
        name: user.name || 'Anonymous User'
      }
    };
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
}

async function updateProductRating(productId) {
  const reviews = await Review.find({ productId });
  if (reviews.length === 0) return;

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  await Product.findByIdAndUpdate(productId, {
    $set: {
      'rating.average': averageRating,
      'rating.count': reviews.length
    }
  });
}
