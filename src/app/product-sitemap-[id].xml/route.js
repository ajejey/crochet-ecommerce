'use server';

import { getServerSideSitemap } from 'next-sitemap';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';

const PRODUCTS_PER_SITEMAP = 1000;

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const pageIndex = parseInt(id, 10);
    
    // Validate pageIndex
    if (isNaN(pageIndex) || pageIndex < 0) {
      return new Response('Invalid sitemap ID', { status: 400 });
    }
    
    await dbConnect();
    
    // Fetch products with pagination, only active products
    const products = await Product.find({ status: 'active' })
      .select('_id updatedAt createdAt')
      .sort({ updatedAt: -1 })
      .skip(pageIndex * PRODUCTS_PER_SITEMAP)
      .limit(PRODUCTS_PER_SITEMAP)
      .lean();
    
    // Base URL from environment or default
    const siteUrl = process.env.SITE_URL || 'https://knitkart.in';
    
    // Create sitemap entries for each product
    const fields = products.map(product => ({
      loc: `${siteUrl}/shop/product/${product._id.toString()}`,
      lastmod: new Date(product.updatedAt || product.createdAt).toISOString(),
      changefreq: 'daily',
      priority: 0.7,
    }));
    
    return getServerSideSitemap(fields);
  } catch (error) {
    console.error('Error generating product sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}
