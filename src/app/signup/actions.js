'use server';

import { createAdminClient } from '@/appwrite/config';
import { ID } from 'node-appwrite';
import { cookies } from 'next/headers';

export async function createAccount(formData) {
  try {
    const data = Object.fromEntries(formData);
    const { email, password, name } = data;

    const { account, databases } = createAdminClient();

    // Create account
    const user = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    // Create user document
    await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_USERS,
      user.$id,
      {
        email,
        name,
        role: 'buyer', // default role
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    );

    // Create session
    const session = await account.createEmailPasswordSession(email, password);
    
    cookies().set('session', session.secret, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      expires: new Date(session.expire),
    });

    return { success: true };
  } catch (error) {
    console.error('Error creating account:', error);
    return { error: error.message };
  }
}