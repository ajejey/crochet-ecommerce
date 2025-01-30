import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { SearchPhrase } from '@/models/SearchPhrase';
import { SearchLog } from '@/models/SearchLog';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const userId = searchParams.get('userId');

  if (!query || query.length < 2) {
    return NextResponse.json({
      suggestions: [],
      trending: [],
      recent: []
    });
  }

  try {
    await dbConnect();

    // 1. Get product matches
    const products = await Product.find({
      $and: [
        { status: 'active' },
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { 'description.short': { $regex: query, $options: 'i' } },
            { 'description.full': { $regex: query, $options: 'i' } },
            { tags: { $regex: query, $options: 'i' } },
            { material: { $regex: query, $options: 'i' } },
            { 'specifications.colors': { $regex: query, $options: 'i' } },
            { 'specifications.patterns': { $regex: query, $options: 'i' } },
            { 'metadata.searchKeywords': { $regex: query, $options: 'i' } }
          ]
        }
      ]
    }, null, {
      // Score results based on field matches
      score: {
        $meta: "textScore"
      }
    })
    .select('name images price category material specifications.colors tags')
    .sort({ 
      featured: -1,        // Featured products first
      'rating.average': -1, // Then by rating
      'metadata.salesCount': -1  // Then by sales count
    })
    .limit(5)
    .lean();

    // 2. Get phrase suggestions
    const phraseSuggestions = await SearchPhrase.find({
      phrase: { $regex: `^${query}`, $options: 'i' }
    })
    .sort({ searchCount: -1 })
    .limit(3)
    .lean();

    // 3. Get trending searches (last 24 hours)
    const trending = await SearchLog.aggregate([
      {
        $match: {
          timestamp: { 
            $gte: new Date(Date.now() - 24*60*60*1000) 
          }
        }
      },
      {
        $group: {
          _id: "$phrase",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    // 4. Log this search
    if (query.length >= 3) {
      await SearchLog.create({
        phrase: query,
        userId: userId || null,
        sessionId: request.headers.get('x-session-id') || null
      });

      // 5. Update or create search phrase
      await SearchPhrase.findOneAndUpdate(
        { phrase: query.toLowerCase() },
        { 
          $inc: { searchCount: 1 },
          $set: { lastSearched: new Date() }
        },
        { upsert: true }
      );
    }

    return NextResponse.json({
      suggestions: products.map(p => ({
        ...p,
        type: 'product'
      })),
      phrases: phraseSuggestions.map(p => ({
        ...p,
        type: 'phrase'
      })),
      trending: trending.map(t => ({
        phrase: t._id,
        count: t.count,
        type: 'trending'
      }))
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json({
      suggestions: [],
      phrases: [],
      trending: []
    }, { status: 500 });
  }
}
