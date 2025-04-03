'use server';

export async function GET() {
  // Base URL from environment or default
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://knitkart.in';
  
  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin
Disallow: /seller/dashboard
Disallow: /api

# Sitemaps
Sitemap: ${siteUrl}/server-sitemap-index.xml
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}
