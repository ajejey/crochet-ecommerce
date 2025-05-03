import { NextResponse } from 'next/server';
import { getProduct } from '@/app/shop/actions';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

/**
 * API route that generates optimized OpenGraph images for WhatsApp sharing
 * Converts product images to 1200x630 WEBP format as required by WhatsApp
 * 
 * This is crucial for WhatsApp sharing as it requires:
 * 1. WEBP format specifically
 * 2. 1200x630 dimensions
 * 3. Proper caching headers
 */
// Cache the fallback image buffer to avoid reading from disk on every request
let fallbackImageBuffer;

/**
 * Get the fallback image buffer for products without images
 * @returns {Buffer} The fallback image buffer
 */
function getFallbackImageBuffer() {
  if (fallbackImageBuffer) {
    return fallbackImageBuffer;
  }
  
  try {
    // Try to read the fallback image from the public directory
    const fallbackPath = path.join(process.cwd(), 'public', 'images', 'og-fallback.webp');
    fallbackImageBuffer = fs.readFileSync(fallbackPath);
    return fallbackImageBuffer;
  } catch (error) {
    // If fallback image doesn't exist, create a simple one with text
    console.log('Fallback image not found, generating a basic one');
    return sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
      .composite([
        {
          input: Buffer.from(
            `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
              <rect width="1200" height="630" fill="#f8f8f8"/>
              <text x="50%" y="50%" font-family="Arial" font-size="48" fill="#e11d48" text-anchor="middle">KnitKart.in</text>
              <text x="50%" y="60%" font-family="Arial" font-size="32" fill="#666" text-anchor="middle">Handcrafted Crochet Products</text>
            </svg>`
          ),
          top: 0,
          left: 0,
        },
      ])
      .webp()
      .toBuffer();
  }
}

export async function GET(request, { params }) {
  try {
    const productId = params.productId;
    
    // Fetch the product data
    const product = await getProduct(productId, { includeSeller: false });
    
    if (!product) {
      return new NextResponse('Product not found', { status: 404 });
    }
    
    let imageBuffer;
    
    // Check if product has images
    if (product.images && product.images.length > 0) {
      // Get the first image URL
      const imageUrl = product.images[0].url;
      
      try {
        // Fetch the image
        const imageResponse = await fetch(imageUrl);
        if (imageResponse.ok) {
          imageBuffer = await imageResponse.arrayBuffer();
        } else {
          // Use fallback if fetch fails
          imageBuffer = getFallbackImageBuffer();
        }
      } catch (error) {
        console.error('Error fetching product image:', error);
        // Use fallback on error
        imageBuffer = getFallbackImageBuffer();
      }
    } else {
      // Use fallback for products without images
      imageBuffer = getFallbackImageBuffer();
    }
    
    // Process the image with sharp
    // First, analyze the image to determine its dimensions
    const metadata = await sharp(Buffer.from(imageBuffer)).metadata();
    
    let processedImageBuffer;
    
    // Check image aspect ratio to determine best processing approach
    const imageAspectRatio = metadata.width / metadata.height;
    const targetAspectRatio = 1200 / 630; // ~1.9:1
    
    // For all images, prioritize showing the entire product
    // This approach ensures we don't crop out important parts of the product
    
    if (imageAspectRatio < targetAspectRatio) {
      // For portrait or square images (taller than they are wide)
      // Calculate the width needed to maintain aspect ratio within 630px height
      const calculatedWidth = Math.round(630 * imageAspectRatio);
      
      // Resize the image to fit within the height constraint
      const resizedImage = await sharp(Buffer.from(imageBuffer))
        .resize({
          height: 630,
          width: calculatedWidth,
          fit: 'inside',
          withoutEnlargement: true
        })
        .toBuffer();
      
      // Create a white canvas of 1200x630 and place the image in the center
      processedImageBuffer = await sharp({
        create: {
          width: 1200,
          height: 630,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      })
      .composite([
        {
          input: resizedImage,
          gravity: 'center'
        }
      ])
      .webp({ quality: 90 })
      .toBuffer();
    } else {
      // For landscape images (wider than they are tall)
      // Calculate the height needed to maintain aspect ratio within 1200px width
      const calculatedHeight = Math.round(1200 / imageAspectRatio);
      
      // If calculated height is less than 630px, we can fit the entire image
      if (calculatedHeight <= 630) {
        // Resize the image to fit within the width constraint
        const resizedImage = await sharp(Buffer.from(imageBuffer))
          .resize({
            width: 1200,
            height: calculatedHeight,
            fit: 'inside',
            withoutEnlargement: true
          })
          .toBuffer();
        
        // Create a white canvas of 1200x630 and place the image in the center
        processedImageBuffer = await sharp({
          create: {
            width: 1200,
            height: 630,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          }
        })
        .composite([
          {
            input: resizedImage,
            gravity: 'center'
          }
        ])
        .webp({ quality: 90 })
        .toBuffer();
      } else {
        // For images that are too tall even after fitting to width,
        // we'll need to resize to fit within the 1200x630 box
        processedImageBuffer = await sharp(Buffer.from(imageBuffer))
          .resize({
            width: 1200,
            height: 630,
            fit: 'inside',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .extend({
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .webp({ quality: 90 })
          .toBuffer();
      }
    }
    
    // Return the processed image
    return new NextResponse(processedImageBuffer, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new NextResponse('Error generating image', { status: 500 });
  }
}
