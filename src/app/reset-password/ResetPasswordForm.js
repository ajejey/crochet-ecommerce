import { redirect } from 'next/navigation';
import { User } from '@/models/User';
import dbConnect from '@/lib/mongodb';
import { hashPassword, verifyResetToken, generateToken, setAuthCookie } from '@/lib/auth';
import ResetPasswordFormClient from './ResetPasswordFormClient';

export default async function ResetPasswordForm({ searchParams }) {
  // Extract token from query parameters
  const token = searchParams?.token;

  // If token is missing, redirect to forgot password page
  if (!token) {
    redirect('/forgot-password');
  }

  async function resetPassword(formData) {
    "use server";
    const data = Object.fromEntries(formData);
    const { password } = data;

    try {
      // Validate input
      if (!password) {
        return { success: false, error: 'Password is required' };
      }

      // Validate password strength
      if (password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters long' };
      }

      // Verify reset token
      const decoded = verifyResetToken(token);
      if (!decoded) {
        return { success: false, error: 'Invalid or expired reset token' };
      }

      // Connect to database
      await dbConnect();

      // Find user with valid reset token
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
      });

      if (!user) {
        return { success: false, error: 'Invalid or expired reset token' };
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

      console.log('Password reset successful');

      return { success: true, message: 'Password reset successful' };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Failed to reset password. The link may have expired or is invalid.' };
    }
  }

  return <ResetPasswordFormClient resetPassword={resetPassword} />;
}
