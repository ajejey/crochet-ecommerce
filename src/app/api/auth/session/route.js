import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { session } = await request.json();

    // Set the session cookie
    cookies().set('session', session.secret, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      expires: new Date(session.expire),
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error setting session:', error);
    return new Response(JSON.stringify({ error: 'Failed to set session' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
