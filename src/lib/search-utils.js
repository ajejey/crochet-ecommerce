// Utility functions for search functionality
// Note: This file doesn't need 'use server' since it's not directly called from client components

/**
 * Advanced search utility functions for KnitKart.in
 * Provides fuzzy matching, relevance scoring, and search optimization
 * for both search suggestions and product search
 */

/**
 * Performs fuzzy matching on text with a search query and returns relevance score
 * @param {string} text - The text to search in
 * @param {string} query - The search query
 * @returns {Object} - Match result with score and match type
 */
export function fuzzyMatch(text, query) {
  if (!text || !query) return { match: false, score: 0 };
  
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Exact match (highest priority)
  if (textLower === queryLower) {
    return { match: true, score: 100, matchType: 'exact' };
  }
  
  // Starts with query (high priority)
  if (textLower.startsWith(queryLower)) {
    return { match: true, score: 90, matchType: 'starts_with' };
  }
  
  // Contains query as a whole word (medium-high priority)
  const wordBoundaryRegex = new RegExp(`\\b${queryLower}\\b`);
  if (wordBoundaryRegex.test(textLower)) {
    return { match: true, score: 80, matchType: 'word_boundary' };
  }
  
  // Contains query as a substring (medium priority)
  if (textLower.includes(queryLower)) {
    return { match: true, score: 70, matchType: 'contains' };
  }
  
  // Word starts with query (medium-low priority)
  const words = textLower.split(/\s+/);
  for (const word of words) {
    if (word.startsWith(queryLower)) {
      return { match: true, score: 60, matchType: 'word_starts' };
    }
  }
  
  // Allow for minor typos (if query is at least 4 chars)
  if (queryLower.length >= 4) {
    // Check if most of the characters match in sequence
    let matchCount = 0;
    let textIndex = 0;
    
    for (let i = 0; i < queryLower.length; i++) {
      const char = queryLower[i];
      const foundIndex = textLower.indexOf(char, textIndex);
      
      if (foundIndex >= 0) {
        matchCount++;
        textIndex = foundIndex + 1;
      }
    }
    
    // If at least 75% of characters match in sequence
    const matchPercentage = matchCount / queryLower.length;
    if (matchPercentage >= 0.75) {
      return { 
        match: true, 
        score: Math.floor(50 * matchPercentage), // Score between 38-50
        matchType: 'fuzzy' 
      };
    }
  }
  
  return { match: false, score: 0 };
}

/**
 * Get search variations for a term (plurals, common alternatives)
 * @param {string} term - The search term
 * @returns {string[]} - Array of variations
 */
export function getSearchVariations(term) {
  if (!term) return [];
  
  const variations = new Set([term]);
  const termLower = term.toLowerCase();
  
  // Handle plurals/singulars
  if (termLower.endsWith('s')) {
    variations.add(termLower.slice(0, -1));
  } else {
    variations.add(`${termLower}s`);
  }
  
  // Handle common crochet-specific variations
  const crochetVariations = {
    // Crochet items
    'blanket': ['afghan', 'throw', 'coverlet', 'quilt'],
    'afghan': ['blanket', 'throw', 'coverlet'],
    'scarf': ['muffler', 'wrap', 'stole'],
    'stole': ['wrap', 'scarf', 'shawl'],
    'shawl': ['wrap', 'stole', 'scarf'],
    'hat': ['beanie', 'cap', 'toque'],
    'beanie': ['hat', 'cap', 'toque'],
    'sweater': ['jumper', 'pullover', 'cardigan'],
    'cardigan': ['sweater', 'jacket', 'top'],
    'amigurumi': ['toy', 'doll', 'stuffed', 'plush', 'plushie'],
    'toy': ['amigurumi', 'doll', 'stuffed'],
    'bag': ['purse', 'handbag', 'tote'],
    'purse': ['bag', 'handbag', 'clutch'],
    
    // Age groups
    'baby': ['infant', 'newborn', 'toddler'],
    'child': ['kid', 'children', 'toddler'],
    'adult': ['women', 'men', 'unisex'],
    
    // Techniques
    'crochet': ['crocheted', 'hook', 'yarn'],
    'pattern': ['design', 'instructions', 'tutorial'],
    
    // Seasons
    'winter': ['cold', 'warm', 'christmas', 'holiday'],
    'summer': ['spring', 'light', 'cool'],
    'monsoon': ['rainy', 'rain', 'wet'],
    
    // Materials
    'cotton': ['thread', 'yarn'],
    'wool': ['yarn', 'merino', 'alpaca'],
    'acrylic': ['yarn', 'synthetic'],
    
    // Demographics
    'women': ['woman', 'womens', "women's", 'female', 'ladies'],
    'men': ['man', 'mens', "men's", 'male', 'gents'],
    'unisex': ['gender neutral', 'all gender', 'universal'],
  };
  
  // Add variations based on the term
  for (const [key, values] of Object.entries(crochetVariations)) {
    if (termLower.includes(key)) {
      values.forEach(value => variations.add(value));
    }
    
    // Also check if the term is one of the variations
    if (values.includes(termLower)) {
      variations.add(key);
      values.forEach(value => {
        if (value !== termLower) variations.add(value);
      });
    }
  }
  
  return [...variations];
}

/**
 * Score a product based on how well it matches a search query
 * @param {Object} product - The product to score
 * @param {string} query - The search query
 * @returns {Object} - Match result with score and details
 */
export function scoreProductMatch(product, query) {
  if (!product || !query) return { match: false, score: 0 };
  
  let bestMatch = { match: false, score: 0 };
  let matchSource = null;
  let matchedTerm = null;
  
  // Check title (highest priority)
  const titleMatch = fuzzyMatch(product.name, query);
  if (titleMatch.match && titleMatch.score > bestMatch.score) {
    bestMatch = titleMatch;
    matchSource = 'title';
    matchedTerm = product.name;
  }
  
  // Check description (high priority)
  if (product.description) {
    const shortDesc = product.description.short || '';
    const shortDescMatch = fuzzyMatch(shortDesc, query);
    if (shortDescMatch.match && shortDescMatch.score > bestMatch.score) {
      bestMatch = { ...shortDescMatch, score: shortDescMatch.score - 5 }; // Slightly lower priority
      matchSource = 'description';
      matchedTerm = shortDesc;
    }
  }
  
  // Check category (high priority)
  if (product.category) {
    const categoryMatch = fuzzyMatch(product.category, query);
    if (categoryMatch.match && categoryMatch.score > bestMatch.score) {
      bestMatch = { ...categoryMatch, score: categoryMatch.score - 3 }; // Slightly lower priority
      matchSource = 'category';
      matchedTerm = product.category;
    }
  }
  
  // Check search keywords (medium priority)
  if (product.metadata?.searchKeywords) {
    for (const keyword of product.metadata.searchKeywords) {
      const keywordMatch = fuzzyMatch(keyword, query);
      if (keywordMatch.match && keywordMatch.score - 10 > bestMatch.score) {
        bestMatch = { ...keywordMatch, score: keywordMatch.score - 10 };
        matchSource = 'keyword';
        matchedTerm = keyword;
      }
    }
  }
  
  // Check search variations (medium-low priority)
  if (product.metadata?.searchVariations) {
    for (const variation of product.metadata.searchVariations) {
      const variationMatch = fuzzyMatch(variation, query);
      if (variationMatch.match && variationMatch.score - 15 > bestMatch.score) {
        bestMatch = { ...variationMatch, score: variationMatch.score - 15 };
        matchSource = 'variation';
        matchedTerm = variation;
      }
    }
  }
  
  // Check synonyms (low priority)
  if (product.metadata?.synonyms) {
    for (const synonym of product.metadata.synonyms) {
      const synonymMatch = fuzzyMatch(synonym, query);
      if (synonymMatch.match && synonymMatch.score - 20 > bestMatch.score) {
        bestMatch = { ...synonymMatch, score: synonymMatch.score - 20 };
        matchSource = 'synonym';
        matchedTerm = synonym;
      }
    }
  }
  
  return {
    ...bestMatch,
    matchSource,
    matchedTerm,
    productId: product._id.toString()
  };
}

/**
 * Build a MongoDB query for searching products without Atlas Search
 * @param {string} searchQuery - The search query
 * @returns {Object} - MongoDB query object
 */
export function buildSearchQuery(searchQuery) {
  if (!searchQuery) return {};
  
  console.log('Building search query for:', searchQuery);
  
  // Generate variations of the search term
  const searchTerms = getSearchVariations(searchQuery);
  console.log('Search variations:', searchTerms);
  
  // Build an array of conditions for the $or operator
  const searchConditions = [
    // Title search (highest priority)
    { name: { $regex: searchQuery, $options: 'i' } },
    
    // Category search
    { category: { $regex: searchQuery, $options: 'i' } },
    
    // Description search
    { 'description.short': { $regex: searchQuery, $options: 'i' } },
    
    // Full description search
    { 'description.full': { $regex: searchQuery, $options: 'i' } }
  ];
  
  // Only add these conditions if searchTerms is an array
  if (Array.isArray(searchTerms) && searchTerms.length > 0) {
    // Add direct string matching for each term instead of using RegExp objects
    // This avoids issues with RegExp serialization in MongoDB queries
    searchTerms.forEach(term => {
      searchConditions.push(
        // Search in metadata fields with direct string pattern
        { 'metadata.searchKeywords': { $regex: term, $options: 'i' } },
        
        // Variations search with direct string pattern
        { 'metadata.searchVariations': { $regex: term, $options: 'i' } },
        
        // Synonyms search with direct string pattern
        { 'metadata.synonyms': { $regex: term, $options: 'i' } }
      );
    });
  }
  
  // Also add a direct search for the term in tags
  searchConditions.push({ tags: { $regex: searchQuery, $options: 'i' } });
  
  console.log('Search conditions count:', searchConditions.length);
  return { $or: searchConditions };
}
