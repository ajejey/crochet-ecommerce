# Google Merchant API (Beta) Integration for Knitkart.in

This module provides functionality to sync your Knitkart.in products with Google Merchant Center using the new Merchant API (Beta), making them available on Google Shopping, Search, and other Google services.

## Overview

The Google Merchant API integration allows you to:

1. Automatically sync your product catalog to Google Merchant Center
2. Update product inventory and pricing in real-time
3. Track product status in Google Merchant Center
4. Increase product visibility across Google services

## Setup Instructions

### 1. Create a Google Merchant Center Account

1. Go to [Google Merchant Center](https://merchants.google.com) and sign up
2. Complete your business information
3. Verify and claim your website URL (knitkart.in)
4. Set up your shipping and tax settings

### 2. Create a Google Cloud Project and Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable the Merchant API (Beta)
4. Create a service account with the following roles:
   - Merchant Center Account Admin
   - Merchant Center Content API Admin
5. Create and download a JSON key for the service account

### 3. Configure Environment Variables

Add the following environment variables to your project:

```
GOOGLE_MERCHANT_ID=your_merchant_id
GOOGLE_APPLICATION_CREDENTIALS=path_to_service_account_json
GOOGLE_MERCHANT_API_KEY=030d6cc564f73659ec0164651bf6aa717b64214496e8ac14938e6a431cb00a51
NEXT_PUBLIC_APP_URL=https://knitkart.in
```

### 4. Set Up Scheduled Syncing

For Vercel deployment, you can use Vercel Cron Jobs to schedule regular syncing:

1. Add the following to your `vercel.json` file:

```json
{
  "crons": [
    {
      "path": "/api/google-merchant/sync",
      "schedule": "0 0 * * *"
    }
  ]
}
```

This will run the sync job daily at midnight.

## Usage

### Admin Interface

An admin interface is available at `/admin/google-merchant` that allows you to:

- Manually sync all products
- View product status in Google Merchant Center
- See sync results and errors

### Product Management Integration

The Google Merchant sync component is integrated into the product management workflow:

1. When a product is published, it can be synced to Google Merchant Center
2. Product inventory updates are automatically reflected in Google Merchant
3. Products can be removed from Google Merchant Center when needed

### API Endpoints

- `GET /api/google-merchant/sync` - Trigger a full product sync (requires API key)
- `POST /api/google-merchant/sync` - Sync a specific product (requires API key)

## Important Notes

1. Only published products can be synced to Google Merchant Center
2. Changes may take up to 24 hours to appear in Google Shopping results
3. Make sure your products comply with [Google's product data specifications](https://support.google.com/merchants/answer/7052112)
4. All product images must be high quality and comply with Google's image requirements

## Troubleshooting

If you encounter issues with product syncing:

1. Check the Google Merchant Center dashboard for product errors
2. Verify that your product data meets Google's requirements
3. Ensure your service account has the correct permissions
4. Check the server logs for API errors

## Resources

- [Google Merchant Center Help](https://support.google.com/merchants/)
- [Merchant API (Beta) Documentation](https://developers.google.com/merchant/api/overview)
- [Product Data Specification](https://support.google.com/merchants/answer/7052112)
