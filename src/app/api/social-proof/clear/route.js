'use server';

import { NextResponse } from 'next/server';
import SocialProofEvent from '@/models/SocialProofEvent';
import dbConnect from '@/lib/mongodb';
import { getAuthUser } from '@/lib/auth-context';

export async function POST() {
  try {
    // Check if user is admin
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    
    // Delete all social proof events
    const result = await SocialProofEvent.deleteMany({});
    
    return NextResponse.json({
      success: true,
      deleted: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing social proof events:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
