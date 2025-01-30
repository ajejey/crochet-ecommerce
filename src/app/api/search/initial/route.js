import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { SearchLog } from '@/models/SearchLog';

export async function GET() {
  try {
    await dbConnect();

    // Get trending searches from last 24 hours
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
      { $limit: 5 }
    ]);

    // Get featured products
    const featuredProducts = await Product.find({ 
      featured: true,
      status: 'active'
    })
    .select('name images price category')
    .sort({ 'metadata.salesCount': -1 })
    .limit(3)
    .lean();

    // Get popular categories with product counts
    const categories = await Product.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    return NextResponse.json({
      trending: trending.map(t => ({
        phrase: t._id,
        count: t.count,
        type: 'trending'
      })),
      featured: featuredProducts.map(p => ({
        ...p,
        type: 'product'
      })),
      categories: categories.map(c => ({
        category: c._id,
        count: c.count,
        type: 'category'
      }))
    });
  } catch (error) {
    console.error('Initial search suggestions error:', error);
    return NextResponse.json({
      trending: [],
      featured: [],
      categories: []
    }, { status: 500 });
  }
}
