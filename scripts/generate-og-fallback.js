const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Generate a fallback OpenGraph image for products without images
 * Creates a 1200x630 WEBP image with KnitKart branding
 */
async function generateFallbackImage() {
  try {
    const outputPath = path.join(process.cwd(), 'public', 'images', 'og-fallback.webp');
    
    // Create SVG with KnitKart branding using the project's design guidelines
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff1f2" />
            <stop offset="100%" stop-color="#fecdd3" />
          </linearGradient>
          <pattern id="pattern" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
            <rect width="100%" height="100%" fill="#fff1f2"/>
            <circle cx="20" cy="20" r="2" fill="#e11d48" opacity="0.05"/>
          </pattern>
        </defs>
        <rect width="1200" height="630" fill="url(#pattern)"/>
        <rect width="800" height="400" x="200" y="115" rx="20" fill="white" fill-opacity="0.8"/>
        <text x="600" y="250" font-family="serif" font-size="72" font-weight="bold" fill="#111827" text-anchor="middle">KnitKart.in</text>
        <text x="600" y="350" font-family="sans-serif" font-size="32" fill="#4b5563" text-anchor="middle">Handcrafted Crochet Products</text>
        <text x="600" y="430" font-family="sans-serif" font-size="24" fill="#e11d48" text-anchor="middle">Quality Craftsmanship • Unique Designs • Made with Love</text>
      </svg>
    `;
    
    // Generate the image using sharp
    await sharp(Buffer.from(svg))
      .resize(1200, 630)
      .webp({ quality: 90 })
      .toFile(outputPath);
    
    console.log(`Fallback OpenGraph image created at: ${outputPath}`);
  } catch (error) {
    console.error('Error generating fallback image:', error);
  }
}

generateFallbackImage();
