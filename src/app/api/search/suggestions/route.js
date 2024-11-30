import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 3) {
    return NextResponse.json([]);
  }

  try {
    await dbConnect();

    const products = await Product.find({
      $and: [
        { status: 'active' },
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { 'categories.name': { $regex: query, $options: 'i' } }
          ]
        }
      ]
    })
    .select('name slug images price') // Only select needed fields
    .limit(5) // Limit to 5 suggestions
    .lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
