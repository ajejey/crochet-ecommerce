import { NextResponse } from 'next/server';
import { client } from '@/lib/mongodb';
import { deleteUserData } from '@/lib/user-data';

export async function POST(request) {
  try {
    const { userId } = await request.json();
    
    // Verify the request is coming from Facebook
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete user data from your database
    await deleteUserData(userId);

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error deleting user data:', error);
    return NextResponse.json(
      { error: 'Failed to delete user data' },
      { status: 500 }
    );
  }
}
