'use server';

import { NextResponse } from 'next/server';
import SocialProofEvent from '@/models/SocialProofEvent';
import dbConnect from '@/lib/mongodb';
import { getAuthUser } from '@/lib/auth-context';

export async function GET() {
  try {
    // Check if user is admin
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    
    // Get total count
    const total = await SocialProofEvent.countDocuments();
    
    // Get counts by type
    const typeCounts = await SocialProofEvent.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    const byType = {};
    typeCounts.forEach(item => {
      byType[item._id] = item.count;
    });
    
    // Get oldest and newest events
    const oldest = await SocialProofEvent.findOne().sort({ timestamp: 1 });
    const newest = await SocialProofEvent.findOne().sort({ timestamp: -1 });
    
    return NextResponse.json({
      success: true,
      stats: {
        total,
        byType,
        oldest: oldest?.timestamp || null,
        newest: newest?.timestamp || null
      }
    });
  } catch (error) {
    console.error('Error fetching social proof stats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
