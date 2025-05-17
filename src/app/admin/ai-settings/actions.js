'use server';

import dbConnect from '@/lib/mongodb';
import { PlatformSettings } from '@/models/PlatformSettings';
import { revalidatePath } from 'next/cache';

export async function getAISettings() {
  await dbConnect();
  
  try {
    // Find existing settings or create default ones
    let settings = await PlatformSettings.findOne();
    
    if (!settings) {
      settings = await PlatformSettings.create({
        ai: {
          geminiModel: 'gemini-2.0-flash'
        }
      });
    }
    
    return {
      success: true,
      aiSettings: settings.ai || { geminiModel: 'gemini-2.0-flash' }
    };
  } catch (error) {
    console.error('Failed to get AI settings:', error);
    return {
      success: false,
      error: error.message || 'Failed to get AI settings'
    };
  }
}

export async function updateAISettings(formData) {
  await dbConnect();
  
  try {
    const geminiModel = formData.get('geminiModel');
    
    if (!geminiModel) {
      throw new Error('Model name is required');
    }
    
    // Find existing settings or create new ones
    let settings = await PlatformSettings.findOne();
    
    if (!settings) {
      settings = await PlatformSettings.create({
        ai: { geminiModel }
      });
    } else {
      // Update existing settings
      settings.ai = { ...settings.ai, geminiModel };
      await settings.save();
    }
    
    // Revalidate the admin page to reflect changes
    revalidatePath('/admin');
    revalidatePath('/admin/ai-settings');
    revalidatePath('/seller/products/add');
    
    return {
      success: true,
      message: 'AI model settings updated successfully',
      aiSettings: settings.ai
    };
  } catch (error) {
    console.error('Failed to update AI settings:', error);
    return {
      success: false,
      error: error.message || 'Failed to update AI settings'
    };
  }
}
