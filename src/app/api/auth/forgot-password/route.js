import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { generateResetToken } from '@/lib/auth';
import { sendEmail } from '@/lib/email-auth';

export async function POST(request) {
    try {
        const { email } = await request.json();

        // Validate input
        if (!email) {
            return NextResponse.json(
                { success: false, error: 'Email is required' },
                { status: 400 }
            );
        }

        // Connect to database
        await dbConnect();

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        // Don't reveal if user exists or not for security
        if (!user) {
            return NextResponse.json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent.'
            });
        }

        // Generate reset token
        const resetToken = generateResetToken();

        // Save reset token and expiry to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        // Send reset email
        const emailResult = await sendEmail({
            from: `"Knitkart.in" <${process.env.GMAIL_USERNAME}>`,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #E11D48; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; border: 1px solid #ddd; border-top: none; }
            .button { 
              display: inline-block; 
              padding: 12px 30px; 
              background-color: #E11D48; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello ${user.name},</p>
              <p>We received a request to reset your password for your Knitkart.in account.</p>
              <p>Click the button below to reset your password:</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request a password reset, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Knitkart.in. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
        });

        if (!emailResult.success) {
            console.error('Failed to send reset email:', emailResult.error);
            return NextResponse.json(
                { success: false, error: 'Failed to send reset email. Please try again later.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent.'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { success: false, error: 'An error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}
