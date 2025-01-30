'use server'

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { PRODUCT_CATEGORIES } from '@/constants/product';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const searchAnalysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    searchIntent: {
      type: SchemaType.OBJECT,
      properties: {
        primaryCategory: {
          type: SchemaType.STRING,
          enum: PRODUCT_CATEGORIES.map(cat => cat.id),
          description: "The main product category that best matches the search query"
        },
        attributes: {
          type: SchemaType.OBJECT,
          properties: {
            itemType: { 
              type: SchemaType.STRING,
              description: "Specific type of item (e.g., 'booties', 'blanket', 'scarf')"
            },
            ageGroup: { 
              type: SchemaType.STRING,
              description: "Target age group (e.g., 'baby', 'adult', 'children')"
            },
            skillLevel: { 
              type: SchemaType.STRING,
              enum: ['beginner', 'intermediate', 'advanced'],
              description: "Required skill level for making the item"
            },
            occasion: { 
              type: SchemaType.STRING,
              description: "Occasion the item is suitable for (e.g., 'wedding', 'casual', 'festive')"
            },
            season: { 
              type: SchemaType.STRING,
              enum: ['summer', 'winter', 'monsoon', 'all-season'],
              description: "Season the item is most suitable for"
            }
          }
        },
        priceRange: {
          type: SchemaType.OBJECT,
          properties: {
            min: { type: SchemaType.NUMBER },
            max: { type: SchemaType.NUMBER }
          },
          description: "Suggested price range in Indian Rupees"
        }
      }
    },
    searchTerms: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Key terms to search for in product names/descriptions",
      minItems: 1
    },
    relatedCategories: {
      type: SchemaType.ARRAY,
      items: { 
        type: SchemaType.STRING,
        enum: PRODUCT_CATEGORIES.map(cat => cat.id)
      },
      description: "Other relevant categories to include in search",
      maxItems: 3
    },
    suggestedFilters: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          type: { type: SchemaType.STRING },
          value: { type: SchemaType.STRING },
          label: { type: SchemaType.STRING },
          confidence: { type: SchemaType.NUMBER }
        }
      },
      description: "Suggested filters based on search intent",
      maxItems: 5
    }
  },
  required: [
    "searchIntent",
    "searchTerms",
    "suggestedFilters"
  ]
};

const SYSTEM_PROMPT = `You are helping an Indian e-commerce platform specializing in crochet products. 
Analyze search queries to understand user intent and suggest relevant filters.

Consider:
1. Common crochet items: blankets, clothing, accessories, home decor
2. Skill levels: beginner, intermediate, advanced
3. Seasonal relevance in India
4. Price ranges in Indian Rupees (₹)
5. Age groups and occasions

Example Analysis:
Query: "baby winter booties"
{
  "searchIntent": {
    "primaryCategory": "baby-items",
    "attributes": {
      "itemType": "booties",
      "ageGroup": "baby",
      "skillLevel": "beginner",
      "season": "winter"
    },
    "priceRange": { "min": 300, "max": 800 }
  },
  "searchTerms": ["baby", "booties", "winter", "warm"],
  "relatedCategories": ["baby-accessories", "winter-wear"],
  "suggestedFilters": [
    { "type": "season", "value": "winter", "label": "Winter Items", "confidence": 0.9 },
    { "type": "ageGroup", "value": "baby", "label": "Baby (0-12 months)", "confidence": 0.95 }
  ]
}`;

export async function analyzeSearchIntent(searchQuery) {
  if (!searchQuery) return null;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.2,
        topK: 32,
        topP: 1,
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
        responseSchema: searchAnalysisSchema
      },
    });

    const result = await model.generateContent({
      contents: [{ 
        role: "user", 
        parts: [{ text: `${SYSTEM_PROMPT}\n\nAnalyze this search query: "${searchQuery}"` }]
      }],
      generationConfig: {
        temperature: 0.2,
        topK: 32,
        topP: 1,
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
        responseSchema: searchAnalysisSchema
      }
    });

    const response = await result.response;
    const text = response.text();

    console.log('Search analysis response:', text);
    
    try {
      // Parse the response text as it's still returned as a string
      const analysis = JSON.parse(text);
      
      // Validate the required fields
      if (!analysis.searchIntent || !analysis.searchTerms || !analysis.suggestedFilters) {
        console.error('Invalid analysis structure:', analysis);
        return null;
      }

      console.log('Search analysis result:', analysis);

      return analysis;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return null;
    }

  } catch (error) {
    console.error('Search analysis failed:', error);
    return null;
  }
}
