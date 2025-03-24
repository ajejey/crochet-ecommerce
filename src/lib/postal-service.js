'use server';

const POSTAL_API_BASE_URL = 'https://api.postalpincode.in/pincode';

/**
 * Get location details by PIN code
 * @param {string} pincode - 6-digit postal PIN code
 * @returns {Promise<{success: boolean, message: string, data?: {city: string, state: string}}>}
 */
export async function getLocationByPincode(pincode) {
  try {
    // Validate pincode format
    if (!/^\d{6}$/.test(pincode)) {
      return {
        success: false,
        message: 'Please enter a valid 6-digit PIN code'
      };
    }

    const response = await fetch(`${POSTAL_API_BASE_URL}/${pincode}`, {
      // Adding cache configuration for better performance
      next: {
        revalidate: 86400 // Cache for 24 hours
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }

    const data = await response.json();
    
    // API returns array with single item
    const result = data[0];

    if (result.Status !== 'Success' || !result.PostOffice?.length) {
      return {
        success: false,
        message: 'Invalid PIN code or no location found'
      };
    }

    // Get the first post office data
    const postOffice = result.PostOffice[0];

    return {
      success: true,
      message: 'Location found',
      data: {
        city: postOffice.District,
        state: postOffice.State
      }
    };
  } catch (error) {
    console.error('Error fetching location data:', error);
    return {
      success: false,
      message: 'Failed to fetch location data'
    };
  }
}
