'use server';

import { cookies } from 'next/headers';
import { createSessionClient } from '@/appwrite/config';
import { User } from '@/models/User';
import dbConnect from '@/lib/mongodb';

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const sessionCookie = cookies().get('session');
    
    if (!sessionCookie?.value) {
      return Response.json({ authenticated: false });
    }

    const { account } = await createSessionClient(sessionCookie.value);
    const user = await account.get();

    // Get user role from MongoDB
    await dbConnect();
    const mongoUser = await User.findOne({ appwriteId: user.$id })
      .select('role')
      .lean();

    console.log('Authenticated user:', { ...user, role: mongoUser?.role });

    return Response.json({ 
      authenticated: true, 
      user: {
        $id: user.$id,
        name: user.name,
        email: user.email,
        role: mongoUser?.role || 'user', // Default to 'user' if not found in MongoDB
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return Response.json({ authenticated: false });
  }
}
