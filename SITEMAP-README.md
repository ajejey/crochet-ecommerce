# KnitKart Sitemap Implementation

This document explains how the sitemap system works for KnitKart.in and how to maintain it.

## Overview

KnitKart uses a dynamic sitemap system that automatically includes all products and static pages. The implementation consists of:

1. **Static Sitemap**: Generated during build time for all static pages
2. **Dynamic Product Sitemaps**: Generated on-demand for all products
3. **Sitemap Index**: A master sitemap that references all other sitemaps

## How It Works

### Static Pages

Static pages (home, about, contact, etc.) are handled by the `next-sitemap` package during the build process. This generates a `sitemap.xml` file in the public directory.

### Dynamic Product Pages

Product pages are handled by server-side routes:

- `/server-sitemap-index.xml`: The main sitemap index that references all other sitemaps
- `/product-sitemap-[id].xml`: Dynamic sitemaps for products, paginated by 1000 products per sitemap

### Automatic Updates

The system automatically updates sitemaps when:

1. New products are added
2. Existing products are updated
3. Product status changes (e.g., from draft to active)

## Maintenance

### After Deployment

After deploying the site, submit your sitemap to Google Search Console:

1. Log in to [Google Search Console](https://search.google.com/search-console)
2. Select your property
3. Go to Sitemaps
4. Enter `server-sitemap-index.xml` and click Submit

### Testing Sitemaps

To verify your sitemaps are working:

1. Visit `https://knitkart.in/server-sitemap-index.xml` in your browser
2. Check that it lists all your sitemaps
3. Visit one of the product sitemaps (e.g., `https://knitkart.in/product-sitemap-0.xml`)
4. Verify it contains your product URLs

## Troubleshooting

### Sitemap Not Updating

If your sitemap isn't updating with new products:

1. Make sure the product status is set to `active`
2. Rebuild the site with `npm run build`
3. Manually ping search engines by visiting:
   - `https://www.google.com/ping?sitemap=https://knitkart.in/server-sitemap-index.xml`

### Too Many Products

If you have a large number of products (10,000+), you may need to adjust the `PRODUCTS_PER_SITEMAP` value in the sitemap files to ensure each sitemap stays under the 50MB limit.

## Technical Details

- The sitemap implementation uses Next.js App Router's route handlers
- Products are fetched directly from MongoDB using the Mongoose models
- Search engines are automatically pinged when products are added or updated
- The system respects the `status` field and only includes `active` products

## Files

- `next-sitemap.config.js`: Configuration for static sitemap generation
- `src/app/server-sitemap-index.xml/route.js`: Sitemap index generator
- `src/app/product-sitemap-[id].xml/route.js`: Product sitemap generator
- `src/lib/sitemap-utils.js`: Utility functions for sitemap management
