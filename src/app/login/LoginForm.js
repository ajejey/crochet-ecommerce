import { createAdminClient } from '@/appwrite/config';
import auth from '@/auth';
import { ArrowRight, AtSign, KeyRoundIcon } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LoginFormClient from './LoginFormClient';

export default async function LoginForm({ searchParams }) {
  const user = await auth.getUser();
  const redirectTo = searchParams?.redirect || '/';

  if (user) {
    redirect(redirectTo);
  }

  async function createSession(formData) {
    "use server";
    const data = Object.fromEntries(formData);
    const { email, password } = data;

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set('session', session.secret, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      expires: new Date(session.expire),
    });
    redirect(redirectTo);
  }

  return <LoginFormClient createSession={createSession} />;
}