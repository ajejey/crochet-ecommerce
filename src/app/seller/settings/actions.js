'use server';

import { createAdminClient } from '@/appwrite/config';
import { requireSeller } from '@/lib/auth-context';
import dbConnect, { getMongoDb } from '@/lib/mongodb';
import { SellerProfile } from '@/models/SellerProfile';
import { ID } from 'node-appwrite';

// Constants for image validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_DIMENSION = 2048; // Maximum width/height in pixels

export async function uploadProfileImage(formData) {
  try {
    const user = await requireSeller();
    if (!user) {
      return { error: 'Not authenticated as a seller' };
    }

    const file = formData.get('image');
    const type = formData.get('type'); // profile or banner

    if (!file || !file.size) {
      return { error: 'Please select an image to upload' };
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return { 
        error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image' 
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return { 
        error: `File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      };
    }

    const { storage } = createAdminClient();

    // Upload image to Appwrite storage
    const uploadedFile = await storage.createFile(
      process.env.NEXT_PUBLIC_STORAGE_ID,
      ID.unique(),
      file
    );

    // Generate the file URL
    const fileUrl = `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_STORAGE_ID}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`;

    return { success: true, fileUrl, fileId: uploadedFile.$id };
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // Handle specific Appwrite errors
    if (error.code) {
      switch (error.code) {
        case 413:
          return { error: 'File size exceeds the server limit. Please choose a smaller file.' };
        case 415:
          return { error: 'File type not supported. Please upload a JPEG, PNG, or WebP image.' };
        default:
          return { error: error.message || 'Failed to upload image. Please try again.' };
      }
    }
    
    return { error: 'Failed to upload image. Please try again.' };
  }
}

export async function updateSellerProfile(formData) {
  try {
    // Get the authenticated seller
    const user = await requireSeller();
    if (!user) {
      return { error: 'Not authenticated as a seller' };
    }

    // Get form data
    const businessName = formData.get('businessName');
    const contactEmail = formData.get('contactEmail') || user.email;
    const phoneNumber = formData.get('phoneNumber') || user.phone;
    const description = formData.get('description');
    const displayLocation = formData.get('displayLocation');
    const street = formData.get('street');
    const city = formData.get('city');
    const state = formData.get('state');
    const postalCode = formData.get('postalCode');
    const country = formData.get('country');

    // Parse JSON data
    const profileImage = formData.get('profileImage') ? JSON.parse(formData.get('profileImage')) : null;
    const bannerImage = formData.get('bannerImage') ? JSON.parse(formData.get('bannerImage')) : null;
    const socialLinks = formData.get('socialLinks') ? JSON.parse(formData.get('socialLinks')) : {};
    const shopPolicies = formData.get('shopPolicies') ? JSON.parse(formData.get('shopPolicies')) : {};
    
    // Handle specialties - convert comma-separated string to array
    const specialtiesStr = formData.get('specialties') || '';
    const specialties = specialtiesStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean); // Remove empty strings

    // Validate required fields
    if (!businessName) {
      return { error: 'Business name is required' };
    }

    // Validate email format
    if (contactEmail && !contactEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return { error: 'Please enter a valid email address' };
    }

    // Create update object following the schema
    const updateData = {
      businessName,
      contactEmail,
      phoneNumber,
      description,
      displayLocation,
      address: {
        street,
        city,
        state,
        postalCode,
        country
      },
      profileImage,
      bannerImage,
      socialLinks,
      shopPolicies,
      specialties
    };

    // Connect to MongoDB
    await dbConnect();

    // Update in MongoDB using the correct collection name
    const result = await SellerProfile.updateOne(
      { userId: user.$id },
      { $set: updateData },
      { upsert: true }
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating seller profile:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return { error: 'A seller with this business name already exists' };
    }
    
    return { error: 'Failed to update profile. Please try again.' };
  }
}