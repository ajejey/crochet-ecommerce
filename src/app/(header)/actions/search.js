'use server'

import { SearchPhrase } from '@/models/SearchPhrase';
import { Product } from '@/models/Product';
import { cache } from 'react';
import { fuzzyMatch } from '@/lib/search-utils';

// In-memory cache with expiration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const suggestionCache = new Map();

function getCachedSuggestions(prefix) {
  const cached = suggestionCache.get(prefix);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

// Pending requests map to avoid duplicate DB calls
const pendingRequests = new Map();

// Cached function to get product search data for suggestions
export const getProductSearchData = cache(async () => {
  try {
    return await Product.find({ status: 'active' })
      .select('_id name slug price salePrice category images metadata.searchKeywords metadata.searchVariations metadata.synonyms')
      .lean();
  } catch (error) {
    console.error('Error fetching product search data:', error);
    return [];
  }
});

// Helper function to perform fuzzy matching and return relevance score
// function fuzzyMatch(text, query) {
//   if (!text || !query) return { match: false, score: 0 };
  
//   const textLower = text.toLowerCase();
//   const queryLower = query.toLowerCase();
  
//   // Exact match (highest priority)
//   if (textLower === queryLower) {
//     return { match: true, score: 100, matchType: 'exact' };
//   }
  
//   // Starts with query (high priority)
//   if (textLower.startsWith(queryLower)) {
//     return { match: true, score: 90, matchType: 'starts_with' };
//   }
  
//   // Contains query as a whole word (medium-high priority)
//   const wordBoundaryRegex = new RegExp(`\\b${queryLower}\\b`);
//   if (wordBoundaryRegex.test(textLower)) {
//     return { match: true, score: 80, matchType: 'word_boundary' };
//   }
  
//   // Contains query as a substring (medium priority)
//   if (textLower.includes(queryLower)) {
//     return { match: true, score: 70, matchType: 'contains' };
//   }
  
//   // Word starts with query (medium-low priority)
//   const words = textLower.split(/\s+/);
//   for (const word of words) {
//     if (word.startsWith(queryLower)) {
//       return { match: true, score: 60, matchType: 'word_starts' };
//     }
//   }
  
//   // Allow for minor typos (if query is at least 4 chars)
//   if (queryLower.length >= 4) {
//     // Check if most of the characters match in sequence
//     let matchCount = 0;
//     let textIndex = 0;
    
//     for (let i = 0; i < queryLower.length; i++) {
//       const char = queryLower[i];
//       const foundIndex = textLower.indexOf(char, textIndex);
      
//       if (foundIndex >= 0) {
//         matchCount++;
//         textIndex = foundIndex + 1;
//       }
//     }
    
//     // If at least 75% of characters match in sequence
//     const matchPercentage = matchCount / queryLower.length;
//     if (matchPercentage >= 0.75) {
//       return { 
//         match: true, 
//         score: Math.floor(50 * matchPercentage), // Score between 38-50
//         matchType: 'fuzzy' 
//       };
//     }
//   }
  
//   return { match: false, score: 0 };
// }

export async function getSearchSuggestions(prefix) {
  console.log("Search prefix:", prefix);
  if (!prefix || prefix.length < 2) return [];

  try {
    // 1. Check cache first
    const cached = getCachedSuggestions(prefix);
    if (cached) return cached;
    console.log("Cache hit:", cached ? true : false);

    // 2. Check for pending request
    if (pendingRequests.has(prefix)) {
      return await pendingRequests.get(prefix);
    }
    console.log("Pending request exists:", pendingRequests.has(prefix));

    // 3. Create new request promise
    const requestPromise = (async () => {
      console.log("Creating new search request promise");
      // First, check previous search phrases from the database
      const existingSuggestions = await SearchPhrase.find({
        phrase: { $regex: `^${prefix}`, $options: 'i' }
      })
      .select('phrase type -_id')
      .sort({ frequency: -1 })
      .limit(5)
      .lean()
      .collation({ locale: 'en', strength: 2 });

      console.log("Existing search phrase suggestions:", existingSuggestions.length);
      if (existingSuggestions.length >= 5) {
        console.log("Using only existing search phrases (enough found)");
        // Save to cache
        suggestionCache.set(prefix, {
          data: existingSuggestions,
          timestamp: Date.now()
        });
        return existingSuggestions;
      }

      // If we don't have enough suggestions, look at product data
      const productsData = await getProductSearchData();
      console.log("Product data count:", productsData.length);
      const matchingProducts = new Set(); // Use Set to avoid duplicates
      
      // Store matches with their scores for sorting, grouped by product ID
      const productMatches = new Map(); // Map of productId -> best match info
      
      // Comprehensive search through all product data
      productsData.forEach(product => {
        const productId = product._id.toString();
        let bestMatchForProduct = { score: 0 }; // Track best match for this product
        
        // Ensure product title is available (using name field from the Product model)
        const productTitle = product.name || 'Unnamed Product';
        
        // Check product name (highest priority)
        const titleMatch = fuzzyMatch(productTitle, prefix);
        if (titleMatch.match && titleMatch.score > bestMatchForProduct.score) {
          bestMatchForProduct = {
            productId,
            phrase: productTitle,
            score: titleMatch.score,
            matchType: titleMatch.matchType,
            source: 'title'
          };
        }
        
        // Check search keywords
        if (product.metadata?.searchKeywords) {
          product.metadata.searchKeywords.forEach(keyword => {
            const keywordMatch = fuzzyMatch(keyword, prefix);
            const adjustedScore = keywordMatch.score - 5; // Slightly lower priority
            if (keywordMatch.match && adjustedScore > bestMatchForProduct.score) {
              bestMatchForProduct = {
                productId,
                phrase: productTitle || keyword, // Use actualMatch as fallback
                actualMatch: keyword, // Store the actual matching term
                score: adjustedScore,
                matchType: keywordMatch.matchType,
                source: 'keyword'
              };
            }
          });
        }
        
        // Check search variations
        if (product.metadata?.searchVariations) {
          product.metadata.searchVariations.forEach(variation => {
            const variationMatch = fuzzyMatch(variation, prefix);
            const adjustedScore = variationMatch.score - 10; // Lower priority
            if (variationMatch.match && adjustedScore > bestMatchForProduct.score) {
              bestMatchForProduct = {
                productId,
                phrase: productTitle || variation, // Use actualMatch as fallback
                actualMatch: variation, // Store the actual matching term
                score: adjustedScore,
                matchType: variationMatch.matchType,
                source: 'variation'
              };
            }
          });
        }
        
        // Check synonyms
        if (product.metadata?.synonyms) {
          product.metadata.synonyms.forEach(synonym => {
            const synonymMatch = fuzzyMatch(synonym, prefix);
            const adjustedScore = synonymMatch.score - 15; // Lowest priority
            if (synonymMatch.match && adjustedScore > bestMatchForProduct.score) {
              bestMatchForProduct = {
                productId,
                phrase: productTitle || synonym, // Use actualMatch as fallback
                actualMatch: synonym, // Store the actual matching term
                score: adjustedScore,
                matchType: synonymMatch.matchType,
                source: 'synonym'
              };
            }
          });
        }
        
        // Only add if we found a match for this product
        if (bestMatchForProduct.score > 0) {
          productMatches.set(productId, bestMatchForProduct);
        }
      });
      
      // Convert Map values to array
      const scoredMatches = Array.from(productMatches.values());
      
      console.log("Product matches (raw):", scoredMatches);
      
      // Sort by score (highest first)
      const sortedMatches = scoredMatches
        .sort((a, b) => b.score - a.score)
        .slice(0, 5 - existingSuggestions.length);
      
      console.log("Sorted matches (before formatting):", sortedMatches);
      
      // Format the suggestions with match type info
      const productSuggestions = sortedMatches.map(match => {
        // Use actualMatch as fallback if phrase is undefined
        const displayPhrase = match.phrase || match.actualMatch || 'Unnamed Product';
        
        // Find the original product data to include additional details
        const productData = productsData.find(p => p._id.toString() === match.productId);
        
        // Format price in Indian Rupees
        const price = productData?.price ? new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(productData.price) : '';
        
        // Get sale price if available
        const salePrice = productData?.salePrice ? new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(productData.salePrice) : null;
        
        // Get thumbnail image
        const thumbnailImage = productData?.images?.[0]?.url || null;
        
        return {
          phrase: displayPhrase,
          type: 'product_match',
          matchType: match.matchType,
          source: match.source,
          productId: match.productId,
          actualMatch: match.actualMatch,
          // Additional product details
          productDetails: {
            slug: productData?.slug || '',
            price,
            salePrice,
            category: productData?.category || '',
            thumbnailImage
          }
        };
      });
      
      console.log('Product suggestions formatted:', productSuggestions);

      // Combine both types of suggestions
      const combinedSuggestions = [...existingSuggestions, ...productSuggestions];

      // Save to cache
      suggestionCache.set(prefix, {
        data: combinedSuggestions,
        timestamp: Date.now()
      });

      return combinedSuggestions;
    })();

    // Store the promise
    pendingRequests.set(prefix, requestPromise);

    // Clean up after resolution
    requestPromise.finally(() => {
      pendingRequests.delete(prefix);
    });

    return await requestPromise;

  } catch (error) {
    console.error('Search suggestion error:', error);
    return [];
  }
}

export async function logSearchClick(phrase) {
  try {
    await SearchPhrase.updateOne(
      { phrase },
      { 
        $inc: { frequency: 1 },
        $set: { lastUsed: new Date() }
      },
      { 
        upsert: true,
        lean: true
      }
    );
  } catch (error) {
    console.error('Error logging search click:', error);
  }
}
