'use server';

import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Initialize Google credentials from base64 encoded environment variable
 * This is used in production environments like Vercel where we can't store the JSON file directly
 */
export async function initGoogleCredentials() {
  // Only run this in production and if the base64 credentials are provided
  if (process.env.NODE_ENV === 'production' && process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
    try {
      // Decode the base64 credentials
      const credentials = Buffer.from(
        process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64,
        'base64'
      ).toString();
      
      // Create a temporary file to store the credentials
      const tempFilePath = path.join(os.tmpdir(), 'google-credentials.json');
      
      // Write the credentials to the temporary file
      fs.writeFileSync(tempFilePath, credentials);
      
      // Set the environment variable to point to this file
      process.env.GOOGLE_APPLICATION_CREDENTIALS = tempFilePath;
      
      console.log('Google credentials initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Google credentials:', error);
      return false;
    }
  }
  
  return true; // Already configured in development
}
