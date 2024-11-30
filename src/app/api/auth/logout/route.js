'use server';

import { cookies } from 'next/headers';
import { createSessionClient } from '@/appwrite/config';

export async function POST() {
  try {
    const sessionCookie = cookies().get('session');
    
    if (sessionCookie?.value) {
      const { account } = await createSessionClient(sessionCookie.value);
      await account.deleteSession('current');
      
      // Clear the session cookie
      cookies().delete('session');
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json({ success: false, error: 'Failed to logout' });
  }
}
