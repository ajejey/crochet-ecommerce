import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { comparePassword, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Connect to database
        await dbConnect();

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check if user has a password (new auth system)
        if (!user.password) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'This account was created with the old system. Please use password reset to set a new password.'
                },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Update login metadata
        await User.findByIdAndUpdate(user._id, {
            $set: { 'metadata.lastLogin': new Date() },
            $inc: { 'metadata.loginCount': 1 }
        });

        // Generate JWT token
        const token = generateToken(user._id.toString(), user.email, user.role);

        // Set auth cookie
        setAuthCookie(token);

        return NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'An error occurred during login' },
            { status: 500 }
        );
    }
}
