import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth-context';
import { comparePassword, generateToken, setAuthCookie } from '@/lib/auth';
import { User } from '@/models/User';
import dbConnect from '@/lib/mongodb';
import LoginFormClient from './LoginFormClient';

export default async function LoginForm({ searchParams }) {
  const user = await getAuthUser();
  const redirectTo = searchParams?.from || '/';

  if (user) {
    redirect(redirectTo);
  }

  async function createSession(formData) {
    "use server";
    const data = Object.fromEntries(formData);
    const { email, password } = data;

    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Connect to database
      await dbConnect();

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user has a password (new auth system)
      if (!user.password) {
        throw new Error('This account was created with the old system. Please use password reset to set a new password.');
      }

      // Verify password
      const isValidPassword = await comparePassword(password, user.password);

      if (!isValidPassword) {
        throw new Error('Invalid email or password');
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

      redirect(redirectTo);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  return <LoginFormClient createSession={createSession} redirectTo={redirectTo} />;
}