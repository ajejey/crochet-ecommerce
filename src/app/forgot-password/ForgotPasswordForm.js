import { createAdminClient } from '@/appwrite/config';
import { redirect } from 'next/navigation';
import ForgotPasswordFormClient from './ForgotPasswordFormClient';

export default async function ForgotPasswordForm() {
  async function requestPasswordRecovery(formData) {
    "use server";
    const data = Object.fromEntries(formData);
    const { email } = data;

    try {
      const { account } = await createAdminClient();
      
      // Create password recovery request
      // The URL should point to the reset-password page in your application
      await account.createRecovery(
        email, 
        `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
      );

      console.log('Password recovery request sent successfully');
      
      // Return success status instead of redirecting directly
      return { success: true };
    } catch (error) {
      console.error('Password recovery error:', error);
      return { success: false, error: 'Failed to send recovery email. Please try again.' };
    }
  }

  return <ForgotPasswordFormClient requestPasswordRecovery={requestPasswordRecovery} />;
}
