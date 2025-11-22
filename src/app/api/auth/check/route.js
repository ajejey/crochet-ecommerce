import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, shouldRefreshToken, generateToken, setAuthCookie } from '@/lib/auth';
import { User } from '@/models/User';
import dbConnect from '@/lib/mongodb';


export async function GET() {
  try {
    const sessionCookie = cookies().get('session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ authenticated: false });
    }

    // Verify JWT token
    const decoded = verifyToken(sessionCookie.value);

    if (!decoded) {
      return NextResponse.json({ authenticated: false });
    }

    // Get user from MongoDB
    await dbConnect();
    const user = await User.findById(decoded.userId)
      .select('email name role')
      .lean();

    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    // Sliding session: Refresh token if it's expiring soon (less than 30 days remaining)
    if (shouldRefreshToken(decoded)) {
      const newToken = generateToken(user._id.toString(), user.email, user.role);
      setAuthCookie(newToken);
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        $id: user._id.toString(), // Keep $id for backward compatibility
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || 'user',
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}
