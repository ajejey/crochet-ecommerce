import { NextResponse } from 'next/server';
import { scheduledProductSync } from '@/lib/google-merchant/actions';

/**
 * API route to handle scheduled syncing of products to Google Merchant Center
 * This can be triggered by a cron job (e.g., using Vercel Cron Jobs)
 * 
 * @param {Request} request - The incoming request
 * @returns {Promise<NextResponse>} API response
 */
export async function GET(request) {
  try {
    // Verify API key for security (should be set in environment variables)
    const apiKey = request.headers.get('x-api-key');
    const validApiKey = process.env.GOOGLE_MERCHANT_API_KEY;
    
    if (!apiKey || apiKey !== validApiKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Run the scheduled sync job
    const result = await scheduledProductSync();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in Google Merchant sync API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint for manual triggering of product sync
 */
export async function POST(request) {
  try {
    // Verify API key for security
    const apiKey = request.headers.get('x-api-key');
    const validApiKey = process.env.GOOGLE_MERCHANT_API_KEY;
    
    if (!apiKey || apiKey !== validApiKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get request body
    const body = await request.json();
    const { productId } = body;
    
    // If productId is provided, sync only that product
    if (productId) {
      const { syncProductToMerchant } = await import('@/lib/google-merchant/actions');
      const result = await syncProductToMerchant(productId);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
      
      return NextResponse.json(result);
    }
    
    // Otherwise, sync all products
    const result = await scheduledProductSync();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in Google Merchant sync API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
