'use server';

import { NextResponse } from 'next/server';
import { generateSampleEvents } from '@/lib/generate-sample-events';
import { getAuthUser } from '@/lib/auth-context';

export async function POST(request) {
  try {
    // Check if user is admin
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.json();
    const count = data.count || 10;
    
    const result = await generateSampleEvents(count);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating sample events:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
