'use server';

import { cookies } from 'next/headers';
import { createSessionClient } from '@/appwrite/config';

export async function GET() {
  try {
    const sessionCookie = cookies().get('session');
    
    if (!sessionCookie?.value) {
      return Response.json({ authenticated: false });
    }

    const { account } = await createSessionClient(sessionCookie.value);
    const user = await account.get();

    return Response.json({ 
      authenticated: true, 
      user: {
        id: user.$id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return Response.json({ authenticated: false });
  }
}
