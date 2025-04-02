/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://knitkart.in',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: [
    '/admin*',
    '/seller/dashboard*',
    '/api*',
    '/server-sitemap.xml',
    '/server-sitemap-index.xml',
    '/product-sitemap-*.xml'
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin', '/seller/dashboard', '/api'] }
    ],
    additionalSitemaps: [
      'https://knitkart.in/server-sitemap-index.xml',
    ],
  },
  // Change frequency and priority for static pages
  changefreq: 'daily',
  priority: 0.7,
  // Transform function to customize each URL entry
  transform: async (config, path) => {
    // Customize the priority based on the path
    let priority = config.priority;
    if (path === '/') priority = 1.0;
    else if (path === '/shop') priority = 0.9;
    else if (path === '/about' || path === '/contact') priority = 0.8;
    
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
}
