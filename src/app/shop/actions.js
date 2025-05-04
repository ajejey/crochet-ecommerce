'use server';

import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Review } from '@/models/Review';
import { SellerProfile } from '@/models/SellerProfile';
import { SearchLog } from '@/models/SearchLog';
import { getAuthUser } from '@/lib/auth-context';
import { revalidatePath } from 'next/cache';

const PRODUCTS_PER_PAGE = 12;

// Constants for search configuration
const ATLAS_SEARCH_ENABLED = process.env.MONGODB_ATLAS_SEARCH === 'true';
const SEARCH_INDEX = 'default';  // Using the default index name

// Search term variations helper
function getSearchVariations(term) {
  const variations = new Set([term]);
  
  // Handle plurals/singulars
  if (term.endsWith('s')) {
    variations.add(term.slice(0, -1));
  } else {
    variations.add(`${term}s`);
  }
  
  // Handle common variations
  switch (term.toLowerCase()) {
    case 'women':
    case 'woman':
    case 'womens':
    case "women's":
      variations.add('women');
      variations.add('womens');
      variations.add("women's");
      variations.add('female');
      variations.add('ladies');
      break;
    case 'men':
    case 'mans':
    case 'mens':
    case "men's":
      variations.add('men');
      variations.add('mens');
      variations.add("men's");
      variations.add('male');
      break;
    case 'top':
    case 'tops':
      variations.add('top');
      variations.add('tops');
      variations.add('shirt');
      variations.add('shirts');
      variations.add('blouse');
      variations.add('blouses');
      break;
    // Add more crochet-specific variations here
  }
  
  return [...variations];
}

// Simple initial load function
export async function getInitialProducts() {
  try {
    await dbConnect();
    const products = await Product.find({ status: 'active' })
      .select('name price images category sellerId inventory salePrice isMultiPack packSize pricePerPiece')
      .sort({ createdAt: -1 })
      .limit(PRODUCTS_PER_PAGE)
      .lean();

    // Get seller profiles
    const sellerIds = [...new Set(products.map(p => p.sellerId))];
    const sellerProfiles = await SellerProfile.find({ userId: { $in: sellerIds } }).lean();
    const sellerMap = Object.fromEntries(
      sellerProfiles.map(seller => [seller.userId, seller])
    );

    return {
      products: products.map(product => ({
        ...product,
        _id: product._id.toString(),
        seller: sellerMap[product.sellerId],
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
  search = null,
  filters = {}
}) {
  try {
    await dbConnect();
    const sessionId = Math.random().toString(36).substring(7);
    const startTime = Date.now();
    
    // Build the aggregation pipeline
    const pipeline = [];

    // Add search stage if search query exists
    if (search) {
      pipeline.push(...getSearchPipeline(search));
    }

    // Match stage for basic filtering
    const matchStage = {
      status: 'active'
    };

    if (category && category !== 'all') {
      matchStage.category = category;
    }

    if (minPrice !== null || maxPrice !== null) {
      matchStage.price = {};
      if (minPrice !== null) matchStage.price.$gte = Number(minPrice);
      if (maxPrice !== null) matchStage.price.$lte = Number(maxPrice);
    }

    // Handle smart filters
    if (filters.skillLevel) {
      matchStage['specifications.skillLevel'] = filters.skillLevel;
    }
    if (filters.occasion) {
      matchStage['specifications.occasion'] = filters.occasion;
    }
    if (filters.season) {
      matchStage['specifications.season'] = filters.season;
    }
    if (filters.ageGroup) {
      matchStage['specifications.ageGroup'] = filters.ageGroup;
    }
    if (filters.materials?.length) {
      matchStage.material = { $in: filters.materials };
    }
    if (filters.colors?.length) {
      matchStage['specifications.colors'] = { $in: filters.colors };
    }
    if (filters.sizes?.length) {
      matchStage.size = { $in: filters.sizes };
    }
    if (filters.availability === 'inStock') {
      matchStage['inventory.stockCount'] = { $gt: 0 };
    } else if (filters.availability === 'outOfStock') {
      matchStage['inventory.stockCount'] = 0;
    }
    if (filters.rating) {
      matchStage['rating.average'] = { $gte: Number(filters.rating) };
    }

    // Add match stage to pipeline
    pipeline.push({ $match: matchStage });

    // Add scoring for relevance
    pipeline.push({
      $addFields: {
        relevanceScore: {
          $add: [
            { $ifNull: ['$searchScore', 0] },
            { $multiply: [{ $ifNull: ['$rating.average', 0] }, 0.3] },
            { $multiply: [{ $ifNull: ['$metadata.salesCount', 0] }, 0.2] },
            { $cond: [{ $gt: ['$inventory.stockCount', 0] }, 1, 0] },
            { $cond: [{ $eq: ['$featured', true] }, 2, 0] }
          ]
        }
      }
    });

    // Sorting stage
    const sortStage = {};
    switch (sort) {
      case 'price-asc':
        sortStage.$sort = { price: 1 };
        break;
      case 'price-desc':
        sortStage.$sort = { price: -1 };
        break;
      case 'popular':
        sortStage.$sort = { 'metadata.salesCount': -1 };
        break;
      case 'rating':
        sortStage.$sort = { 'rating.average': -1 };
        break;
      case 'relevance':
        sortStage.$sort = { relevanceScore: -1 };
        break;
      default: // latest
        sortStage.$sort = { createdAt: -1 };
    }
    pipeline.push(sortStage);

    // Get total count before pagination
    const countPipeline = [...pipeline, { $count: 'total' }];
    
    // Add pagination to main pipeline
    pipeline.push(
      { $skip: (page - 1) * PRODUCTS_PER_PAGE },
      { $limit: PRODUCTS_PER_PAGE }
    );

    // Select fields
    pipeline.push({
      $project: {
        name: 1,
        price: 1,
        salePrice: 1,
        images: 1,
        category: 1,
        sellerId: 1,
        inventory: 1,
        rating: 1,
        tags: 1,
        specifications: 1,
        featured: 1,
        createdAt: 1,
        isMultiPack: 1,
        packSize: 1,
        pricePerPiece: 1
      }
    });

    console.log('MongoDB Pipeline:', JSON.stringify(pipeline, null, 2));

    // Execute queries
    const [products, countResult] = await Promise.all([
      Product.aggregate(pipeline),
      Product.aggregate(countPipeline)
    ]);

    const total = countResult[0]?.total || 0;

    // Get seller profiles
    const sellerIds = [...new Set(products.map(p => p.sellerId))];
    const sellerProfiles = await SellerProfile.find({ userId: { $in: sellerIds } }).lean();
    const sellerMap = Object.fromEntries(
      sellerProfiles.map(seller => [seller.userId, seller])
    );

    // Log search for analytics
    if (search) {
      const user = await getAuthUser();
      await SearchLog.create({
        phrase: search,
        resultCount: total,
        userId: user?._id,
        sessionId,
        filters: {
          autoApplied: Object.entries(matchStage)
            .filter(([key]) => !['status', '$or'].includes(key))
            .map(([type, value]) => ({
              type,
              value,
              kept: true
            })),
          userApplied: Object.entries(filters).map(([type, value]) => ({
            type,
            value,
            source: 'manual'
          }))
        },
        metrics: {
          timeToFirstClick: null,
          timeToRefine: null,
          refinementCount: 0
        }
      });
    }

    console.log('Found products:', products.length, 'Total:', total);

    return {
      products: products.map(product => ({
        ...product,
        _id: product._id.toString(),
        seller: sellerMap[product.sellerId],
        mainImage: product.images?.find(img => img.isMain)?.url || 
                  product.images?.[0]?.url || 
                  '/placeholder-product.jpg'
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / PRODUCTS_PER_PAGE),
        hasMore: page * PRODUCTS_PER_PAGE < total
      },
      metadata: {
        total,
        searchTime: Date.now() - startTime,
        appliedFilters: Object.keys(matchStage).filter(key => !['status'].includes(key))
      }
    };

  } catch (error) {
    console.error('Error fetching filtered products:', error);
    return { 
      products: [], 
      pagination: { currentPage: page, totalPages: 0, hasMore: false },
      metadata: { total: 0, searchTime: 0, appliedFilters: [] }
    };
  }
}

// Search helper function
function getSearchPipeline(searchQuery) {
  if (!searchQuery) return [];

  // Clean and split search terms
  const searchTerms = searchQuery
    .toLowerCase()
    .replace(/['"""'']/g, '')
    .replace(/[-_]/g, ' ')
    .trim()
    .split(/\s+/);

  // Get variations for each term
  const termVariations = searchTerms.map(getSearchVariations).flat();
  
  if (ATLAS_SEARCH_ENABLED) {
    return [{
      $search: {
        index: SEARCH_INDEX,
        compound: {
          should: [
            {
              // Exact phrase matching with high boost
              phrase: {
                query: searchQuery,
                path: ['name', 'description.short', 'description.full'],
                score: { boost: { value: 5 } }
              }
            },
            ...termVariations.map(term => ({
              // Search each variation with fuzzy matching
              text: {
                query: term,
                path: ['name', 'description.short', 'description.full', 'metadata.searchKeywords', 'metadata.searchVariations', 'tags'],
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 2
                },
                score: { boost: { value: 3 } }
              }
            }))
          ],
          minimumShouldMatch: 1
        }
      }
    }];
  }

  // Fallback for non-Atlas search
  return [{
    $match: {
      $or: [
        // Match any variation in any field
        ...termVariations.map(term => ({
          $or: [
            { name: { $regex: term, $options: 'i' } },
            { 'description.short': { $regex: term, $options: 'i' } },
            { 'description.full': { $regex: term, $options: 'i' } },
            { tags: { $regex: term, $options: 'i' } },
            { 'metadata.searchKeywords': { $regex: term, $options: 'i' } },
            { 'metadata.searchVariations': { $regex: term, $options: 'i' } }
          ]
        }))
      ]
    }
  }];
}

// Get active products for homepage with optimized query
export async function getActiveProducts() {
  try {
    await dbConnect();
    const products = await Product.find({ 
      status: 'active',
      featured: true 
    })
      .select('name price images rating sellerId') // Only select fields we need
      .sort({ 'metadata.salesCount': -1 }) // Sort by sales count for better relevance
      .limit(6)
      .lean();

    // Get seller profiles
    const sellerIds = [...new Set(products.map(p => p.sellerId))];
    const sellerProfiles = await SellerProfile.find({ userId: { $in: sellerIds } }).lean();
    const sellerMap = Object.fromEntries(
      sellerProfiles.map(seller => [seller.userId, seller])
    );

    // Transform the data for frontend
    return products.map(product => ({
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      images: product.images || [],
      rating: product.rating?.average || 0,
      numReviews: product.rating?.count || 0,
      sellerId: product.sellerId,
      seller: sellerMap[product.sellerId],
      mainImage: product.images?.find(img => img.isMain)?.url || 
                product.images?.[0]?.url || 
                '/placeholder-product.jpg'
    }));
  } catch (error) {
    console.error('Error fetching active products:', error);
    return [];
  }
}

import { cache } from 'react';

// Cached version of getProduct to avoid duplicate DB calls
export const getProduct = cache(async function(productId, options = { includeSeller: true }) {
  try {
    await dbConnect();

    const product = await Product.findById(productId).lean();

    if (!product) {
      throw new Error('Product not found');
    }

    // Basic product data transformation
    const transformedProduct = {
      ...product,
      _id: product._id.toString(),
      sellerId: product.sellerId,
      averageRating: product.rating?.average || 0,
      totalReviews: product.rating?.count || 0,
      // Include price per piece fields
      isMultiPack: product.isMultiPack || false,
      packSize: product.packSize || 1,
      pricePerPiece: product.pricePerPiece,
      inventory: {
        stockCount: product.inventory?.stockCount || 0,
        lowStockThreshold: product.inventory?.lowStockThreshold || 5,
        sku: product.inventory?.sku || '',
        allowBackorder: product.inventory?.allowBackorder || false
      }
    };
    
    // Only fetch seller profile if needed
    if (options.includeSeller) {
      const sellerProfile = await SellerProfile.findOne({ userId: product.sellerId }).lean();
      transformedProduct.sellerName = sellerProfile?.businessName || 'Unknown Seller';
      transformedProduct.sellerEmail = sellerProfile?.contactEmail;
    }

    return transformedProduct;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
})

export const getProductReviews = cache(async function(productId, page = 1) {
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
})

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
