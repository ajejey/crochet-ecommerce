import { createAdminClient } from '@/appwrite/config';
import { redirect } from 'next/navigation';
import ResetPasswordFormClient from './ResetPasswordFormClient';

export default async function ResetPasswordForm({ searchParams }) {
  // Extract userId and secret from query parameters
  const userId = searchParams?.userId;
  const secret = searchParams?.secret;

  // If userId or secret is missing, redirect to forgot password page
  if (!userId || !secret) {
    redirect('/forgot-password');
  }

  async function resetPassword(formData) {
    "use server";
    const data = Object.fromEntries(formData);
    const { password } = data;

    try {
      const { account } = await createAdminClient();
      
      // Complete the password recovery process
      await account.updateRecovery(
        userId,
        secret,
        password
      );
      
      console.log('Password reset successful');
      // Return success status instead of redirecting directly
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Failed to reset password. The link may have expired or is invalid.' };
    }
  }

  return <ResetPasswordFormClient resetPassword={resetPassword} />;
}
