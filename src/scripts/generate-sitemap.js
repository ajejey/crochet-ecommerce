'use server';

/**
 * This script can be run to manually generate and test sitemaps
 * Usage: node src/scripts/generate-sitemap.js
 */

import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { pingSearchEngines } from '@/lib/sitemap-utils';

async function generateSitemap() {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    
    console.log('Counting active products...');
    const totalProducts = await Product.countDocuments({ status: 'active' });
    console.log(`Found ${totalProducts} active products`);
    
    const PRODUCTS_PER_SITEMAP = 1000;
    const productSitemapCount = Math.ceil(totalProducts / PRODUCTS_PER_SITEMAP);
    console.log(`Will generate ${productSitemapCount} product sitemaps`);
    
    // Sample the first few products to verify
    const sampleProducts = await Product.find({ status: 'active' })
      .select('name _id updatedAt')
      .limit(5)
      .lean();
    
    console.log('Sample products that will be included in sitemap:');
    sampleProducts.forEach(product => {
      console.log(`- ${product.name} (ID: ${product._id}), last updated: ${new Date(product.updatedAt).toISOString()}`);
    });
    
    console.log('Sitemap generation test complete.');
    console.log('To generate actual sitemaps, run: npm run build');
    
    // Optionally ping search engines
    const shouldPing = process.argv.includes('--ping');
    if (shouldPing) {
      console.log('Pinging search engines...');
      await pingSearchEngines();
      console.log('Search engines pinged successfully');
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

// Only run if called directly
if (require.main === module) {
  generateSitemap();
}

export { generateSitemap };
