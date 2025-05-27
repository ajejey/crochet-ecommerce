'use server';

import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Review } from '@/models/Review';
import { SellerProfile } from '@/models/SellerProfile';
import { SearchLog } from '@/models/SearchLog';
import { Variant } from '@/models/Variant';
import { getAuthUser } from '@/lib/auth-context';
import { revalidatePath } from 'next/cache';
import { buildSearchQuery, scoreProductMatch, getSearchVariations } from '@/lib/search-utils';

const PRODUCTS_PER_PAGE = 12;

// We're now using the shared search utility functions from /lib/search-utils.js

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
                  '/placeholder-product.jpg',
        // Include search relevance info if available
        ...(product.searchScore ? {
          searchRelevance: {
            score: product.searchScore,
            matchType: product.matchType,
            matchSource: product.matchSource,
            matchedTerm: product.matchedTerm
          }
        } : {})
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
export async function getFilteredProducts(searchParams) {
  // Extract and validate parameters with proper defaults
  const {
    page = 1,
    category = null,
    sort = 'latest',
    search = null,
    filters = {}
  } = searchParams;
  
  // Parse price parameters carefully
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : null;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : null;
  
  console.log('Search params:', { page, category, sort, minPrice, maxPrice, search });
  try {
    await dbConnect();
    const sessionId = Math.random().toString(36).substring(7);
    const startTime = Date.now();
    
    // Build the query object
    let query = { status: 'active' };
    
    // Add category filter
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Add price range filter only if valid values are provided
    if (minPrice && !isNaN(minPrice) && minPrice > 0) {
      query.price = query.price || {};
      query.price.$gte = minPrice;
    }
    
    if (maxPrice && !isNaN(maxPrice) && maxPrice > 0) {
      query.price = query.price || {};
      query.price.$lte = maxPrice;
    }
    
    // Log the query before adding search conditions
    console.log('Base query before search:', JSON.stringify(query, null, 2));
    
    // Add search query if exists
    if (search) {
      // Use our new search utility to build a MongoDB query
      const searchQuery = buildSearchQuery(search);
      // Merge the search conditions with our base query
      if (searchQuery.$or) {
        query = { ...query, $or: searchQuery.$or };
      }
    }

    // Handle smart filters
    if (filters.skillLevel) {
      query['specifications.skillLevel'] = filters.skillLevel;
    }
    if (filters.occasion) {
      query['specifications.occasion'] = filters.occasion;
    }
    if (filters.season) {
      query['specifications.season'] = filters.season;
    }
    if (filters.ageGroup) {
      query['specifications.ageGroup'] = filters.ageGroup;
    }
    if (filters.itemType) {
      query['specifications.itemType'] = filters.itemType;
    }

    // Handle traditional filters
    if (filters.materials && filters.materials.length > 0) {
      query['specifications.material'] = { $in: filters.materials };
    }
    if (filters.colors && filters.colors.length > 0) {
      query['specifications.colors'] = { $in: filters.colors };
    }
    if (filters.sizes && filters.sizes.length > 0) {
      query['specifications.sizes'] = { $in: filters.sizes };
    }
    if (filters.rating) {
      query['rating.average'] = { $gte: Number(filters.rating) };
    }
    if (filters.availability) {
      if (filters.availability === 'inStock') {
        query['inventory.stockCount'] = { $gt: 0 };
      } else if (filters.availability === 'outOfStock') {
        query['inventory.stockCount'] = 0;
      }
    }
    
    // Determine sort order
    let sortOptions = {};
    switch (sort) {
      case 'price_low':
        sortOptions = { price: 1 };
        break;
      case 'price_high':
        sortOptions = { price: -1 };
        break;
      case 'popular':
        sortOptions = { 'metadata.salesCount': -1, 'metadata.views': -1 };
        break;
      case 'rating':
        sortOptions = { 'rating.average': -1 };
        break;
      case 'latest':
      default:
        sortOptions = { createdAt: -1 };
    }

    // Special handling for search queries to improve relevance
    let products = [];
    let total = 0;
    
    if (search) {
      // Use our advanced search function for better relevance
      const searchResults = await searchProducts(search, {
        category: category !== 'all' ? category : undefined,
        minPrice,
        maxPrice
      });
      
      // Apply filters to search results
      const filteredResults = searchResults.filter(product => {
        // Log each product for debugging
        console.log(`Filtering product: ${product.name}, ID: ${product._id}`);
        
        // Check smart filters - make sure we're handling undefined/null values properly
        if (filters.skillLevel && product.specifications?.skillLevel !== filters.skillLevel) {
          console.log(`- Filtered out by skillLevel: ${product.specifications?.skillLevel} != ${filters.skillLevel}`);
          return false;
        }
        if (filters.occasion && product.specifications?.occasion !== filters.occasion) {
          console.log(`- Filtered out by occasion: ${product.specifications?.occasion} != ${filters.occasion}`);
          return false;
        }
        if (filters.season && product.specifications?.season !== filters.season) {
          console.log(`- Filtered out by season: ${product.specifications?.season} != ${filters.season}`);
          return false;
        }
        if (filters.ageGroup && product.specifications?.ageGroup !== filters.ageGroup) {
          console.log(`- Filtered out by ageGroup: ${product.specifications?.ageGroup} != ${filters.ageGroup}`);
          return false;
        }
        if (filters.itemType && product.specifications?.itemType !== filters.itemType) {
          console.log(`- Filtered out by itemType: ${product.specifications?.itemType} != ${filters.itemType}`);
          return false;
        }
        
        // Check traditional filters - more careful handling of arrays and undefined values
        if (filters.materials?.length > 0) {
          const materialMatches = product.specifications?.material && 
            filters.materials.includes(product.specifications.material);
          if (!materialMatches) {
            console.log(`- Filtered out by materials: ${product.specifications?.material} not in [${filters.materials}]`);
            return false;
          }
        }
        
        if (filters.colors?.length > 0) {
          const colorMatches = product.specifications?.colors && 
            product.specifications.colors.some(c => filters.colors.includes(c));
          if (!colorMatches) {
            console.log(`- Filtered out by colors: ${product.specifications?.colors} has no match in [${filters.colors}]`);
            return false;
          }
        }
        
        if (filters.sizes?.length > 0) {
          const sizeMatches = product.specifications?.sizes && 
            product.specifications.sizes.some(s => filters.sizes.includes(s));
          if (!sizeMatches) {
            console.log(`- Filtered out by sizes: ${product.specifications?.sizes} has no match in [${filters.sizes}]`);
            return false;
          }
        }
        
        if (filters.rating) {
          const ratingMatches = product.rating?.average && 
            product.rating.average >= Number(filters.rating);
          if (!ratingMatches) {
            console.log(`- Filtered out by rating: ${product.rating?.average} < ${filters.rating}`);
            return false;
          }
        }
        
        if (filters.availability === 'inStock') {
          const inStockMatches = product.inventory?.stockCount && product.inventory.stockCount > 0;
          if (!inStockMatches) {
            console.log(`- Filtered out by availability (inStock): ${product.inventory?.stockCount} <= 0`);
            return false;
          }
        } else if (filters.availability === 'outOfStock') {
          const outOfStockMatches = !product.inventory?.stockCount || product.inventory.stockCount <= 0;
          if (!outOfStockMatches) {
            console.log(`- Filtered out by availability (outOfStock): ${product.inventory?.stockCount} > 0`);
            return false;
          }
        }
        
        console.log(`✓ Product passed all filters: ${product.name}`);
        return true;
      });
      
      // Get total count for pagination
      total = filteredResults.length;
      
      // Apply pagination
      const skip = (page - 1) * PRODUCTS_PER_PAGE;
      products = filteredResults.slice(skip, skip + PRODUCTS_PER_PAGE);
      
      // Log search for analytics
      try {
        await SearchLog.create({
          phrase: search, // Using 'phrase' instead of 'query' to match the model schema
          resultCount: total,
          sessionId,
          timestamp: new Date(),
          executionTimeMs: Date.now() - startTime
        });
      } catch (logError) {
        console.error('Error logging search:', logError);
      }
    } else {
      // For non-search queries, use regular MongoDB query
      // Get total count for pagination
      total = await Product.countDocuments(query);
      
      // Get paginated products
      const skip = (page - 1) * PRODUCTS_PER_PAGE;
      products = await Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(PRODUCTS_PER_PAGE)
        .lean();
    }

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
                  '/placeholder-product.jpg',
        // Include search relevance info if available
        ...(product.searchScore ? {
          searchRelevance: {
            score: product.searchScore,
            matchType: product.matchType,
            matchSource: product.matchSource,
            matchedTerm: product.matchedTerm
          }
        } : {})
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / PRODUCTS_PER_PAGE),
        hasMore: (page * PRODUCTS_PER_PAGE) < total,
        total
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

// Advanced search function that returns products with relevance scores
export async function searchProducts(searchQuery, options = {}) {
  if (!searchQuery) return [];
  
  try {
    await dbConnect();
    
    // Build base query with active status
    const baseQuery = { status: 'active' };
    
    // Add category filter if provided
    if (options.category && options.category !== 'all') {
      baseQuery.category = options.category;
    }
    
    // Add price range if provided and valid
    if (options.minPrice && !isNaN(Number(options.minPrice)) && Number(options.minPrice) > 0) {
      baseQuery.price = baseQuery.price || {};
      baseQuery.price.$gte = Number(options.minPrice);
    }
    
    if (options.maxPrice && !isNaN(Number(options.maxPrice)) && Number(options.maxPrice) > 0) {
      baseQuery.price = baseQuery.price || {};
      baseQuery.price.$lte = Number(options.maxPrice);
    }
    
    console.log('Search base query:', JSON.stringify(baseQuery, null, 2));
    
    // Get search conditions
    const searchConditions = buildSearchQuery(searchQuery);
    
    // Combine base query with search conditions
    const query = { ...baseQuery };
    if (searchConditions.$or) {
      query.$or = searchConditions.$or;
    }
    
    console.log('Search query:', JSON.stringify(query, null, 2));
    
    // First, get all matching products
    const products = await Product.find(query)
      .select('name price images category sellerId description metadata inventory status')
      .lean();
      
    console.log(`Found ${products.length} products for search "${searchQuery}"`);
    if (products.length === 0) {
      // If no products found, let's do a direct search just on title to debug
      const directTitleSearch = await Product.find({ 
        status: 'active',
        name: { $regex: searchQuery, $options: 'i' } 
      }).select('name').lean();
      
      console.log(`Direct title search found ${directTitleSearch.length} products:`, 
        directTitleSearch.map(p => p.name));
    }
    
    // Score each product based on how well it matches the search query
    const scoredProducts = products.map(product => {
      const matchResult = scoreProductMatch(product, searchQuery);
      console.log(`Product "${product.name}" match score: ${matchResult.score}, type: ${matchResult.matchType}, source: ${matchResult.matchSource}`);
      return {
        ...product,
        _id: product._id.toString(),
        searchScore: matchResult.score,
        matchType: matchResult.matchType,
        matchSource: matchResult.matchSource,
        matchedTerm: matchResult.matchedTerm
      };
    });
    
    // Sort by search score (highest first)
    scoredProducts.sort((a, b) => b.searchScore - a.searchScore);
    
    // Log search for analytics
    try {
      await SearchLog.create({
        phrase: searchQuery, // Using 'phrase' instead of 'query' to match the model schema
        resultCount: scoredProducts.length,
        timestamp: new Date()
      });
    } catch (logError) {
      console.error('Error logging search:', logError);
    }
    
    return scoredProducts;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
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
      baseOptionName: product.baseOptionName || 'Original',
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

// Fetch product variants
export const getProductVariants = cache(async function(productId) {
  try {
    await dbConnect();
    
    // Find all active variants for the product
    const variants = await Variant.find({
      product: productId,
      status: 'active'
    }).lean();
    
    // Transform the variants for client use
    return variants.map(variant => ({
      _id: variant._id.toString(),
      name: variant.name,
      price_adjustment: variant.price_adjustment,
      stockCount: variant.stockCount,
      sku: variant.sku || '',
      status: variant.status,
      image: variant.image || null
    }));
  } catch (error) {
    console.error('Error fetching product variants:', error);
    return [];
  }
})
