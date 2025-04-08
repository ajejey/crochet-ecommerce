'use server';

import { NextResponse } from 'next/server';
import { getRecentEvents } from '@/lib/event-queue';

export async function GET() {
  try {
    // Get the latest events
    const events = await getRecentEvents(15);
    
    // Return the events
    return NextResponse.json({
      success: true,
      events
    });
  } catch (error) {
    console.error('Error fetching latest social proof events:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
