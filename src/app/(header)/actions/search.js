'use server'

import { SearchPhrase } from '@/models/SearchPhrase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are helping an e-commerce platform specializing in crochet products. Generate search suggestions that are:
1. Specific to crochet items and techniques
2. Related to existing categories: blankets, baby items, winter wear, home decor
3. Include common variations and Indian context
4. Consider seasonal relevance

Format: Return ONLY an array of strings, each being a search phrase. No other text.
Example: ["crochet baby blanket", "crochet winter scarf", "crochet home decor"]`;

// In-memory cache with expiration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const suggestionCache = new Map();

// Batch save configuration
const BATCH_SIZE = 100;
const pendingSaves = [];
let saveTimeout;

function getCachedSuggestions(prefix) {
  const cached = suggestionCache.get(prefix);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

// Handle batch saves to MongoDB
async function saveSuggestionsToDb(suggestions) {
  pendingSaves.push(...suggestions);
  
  if (pendingSaves.length >= BATCH_SIZE) {
    await flushSaves();
  } else if (!saveTimeout) {
    saveTimeout = setTimeout(flushSaves, 1000);
  }
}

async function flushSaves() {
  if (pendingSaves.length === 0) return;
  
  const batch = pendingSaves.splice(0, BATCH_SIZE);
  clearTimeout(saveTimeout);
  saveTimeout = null;

  try {
    await SearchPhrase.insertMany(
      batch.map(phrase => ({
        phrase: phrase.phrase || phrase,
        type: 'ai_generated',
        frequency: 1,
        aiGenerated: true
      })),
      { 
        ordered: false,
        lean: true 
      }
    );
  } catch (error) {
    if (!error.code === 11000) { // Ignore duplicate key errors
      console.error('Batch save error:', error);
    }
  }
}

// Pending requests map to avoid duplicate AI calls
const pendingRequests = new Map();

export async function getSearchSuggestions(prefix) {
  if (!prefix || prefix.length < 2) return [];

  try {
    // 1. Check cache first
    const cached = getCachedSuggestions(prefix);
    if (cached) return cached;

    // 2. Check for pending request
    if (pendingRequests.has(prefix)) {
      return await pendingRequests.get(prefix);
    }

    // 3. Create new request promise
    const requestPromise = (async () => {
      // Check MongoDB first with optimized query
      const existingSuggestions = await SearchPhrase.find({
        phrase: { $regex: `^${prefix}`, $options: 'i' }
      })
      .select('phrase type -_id')
      .sort({ frequency: -1 })
      .limit(5)
      .lean()
      .collation({ locale: 'en', strength: 2 });

      if (existingSuggestions.length > 0) {
        return existingSuggestions;
      }

      // Use Gemini for new suggestions
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      const result = await model.generateContent(
        `${SYSTEM_PROMPT}\nGenerate 5 search suggestions starting with: "${prefix}"`
      );
      
      const text = result.response.text();
      let suggestions = [];
      
      try {
        suggestions = JSON.parse(text);
      } catch (e) {
        // If not valid JSON, split by newlines and clean up
        suggestions = text.split('\n')
          .map(s => s.trim())
          .filter(s => s && s.toLowerCase().startsWith(prefix.toLowerCase()))
          .slice(0, 5);
      }

      const formattedSuggestions = suggestions.map(phrase => ({
        phrase,
        type: 'ai_generated'
      }));

      // Save to cache
      suggestionCache.set(prefix, {
        data: formattedSuggestions,
        timestamp: Date.now()
      });

      // Save to DB in background
      saveSuggestionsToDb(suggestions).catch(console.error);

      return formattedSuggestions;
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
