'use server';

/**
 * Pings search engines to notify them of sitemap updates
 * Call this function whenever a new product is added or updated
 * 
 * @param {string} url - The URL of the sitemap to ping (defaults to main sitemap)
 * @returns {Promise<void>}
 */
export async function pingSearchEngines(url) {
  try {
    const siteUrl = process.env.SITE_URL || 'https://knitkart.in';
    const sitemapUrl = url || `${siteUrl}/server-sitemap-index.xml`;
    
    // Ping Google
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    
    // Ping Bing
    await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    
    console.log('Search engines pinged successfully');
  } catch (error) {
    console.error('Error pinging search engines:', error);
  }
}

/**
 * Revalidates sitemap routes to ensure they're updated
 * Call this function whenever products are added, updated, or deleted
 * 
 * @returns {Promise<void>}
 */
export async function revalidateSitemaps() {
  try {
    const { revalidatePath } = await import('next/cache');
    
    // Revalidate the sitemap index
    revalidatePath('/server-sitemap-index.xml');
    
    // Revalidate product sitemaps (first few are most likely to change)
    // These are the URLs that users will access, which get rewritten
    revalidatePath('/product-sitemap-0.xml');
    revalidatePath('/product-sitemap-1.xml');
    // Also revalidate the actual route paths
    revalidatePath('/sitemap/0');
    revalidatePath('/sitemap/1');
    // Add more as your product count grows
    
    console.log('Sitemaps revalidated successfully');
  } catch (error) {
    console.error('Error revalidating sitemaps:', error);
  }
}
