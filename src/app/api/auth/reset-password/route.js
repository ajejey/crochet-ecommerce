import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { hashPassword, verifyResetToken, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
    try {
        const { token, password } = await request.json();

        // Validate input
        if (!token || !password) {
            return NextResponse.json(
                { success: false, error: 'Token and password are required' },
                { status: 400 }
            );
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json(
                { success: false, error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        // Verify reset token
        const decoded = verifyResetToken(token);
        if (!decoded) {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        // Connect to database
        await dbConnect();

        // Find user with valid reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await hashPassword(password);

        // Update user password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Generate JWT token and log user in
        const authToken = generateToken(user._id.toString(), user.email, user.role);

        // Set auth cookie
        setAuthCookie(authToken);

        return NextResponse.json({
            success: true,
            message: 'Password reset successful',
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { success: false, error: 'An error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}
