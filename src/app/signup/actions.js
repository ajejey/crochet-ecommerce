'use server';

import { createAdminClient } from '@/appwrite/config';
import { ID } from 'node-appwrite';
import { cookies } from 'next/headers';
import { User } from '@/models/User';
import dbConnect from '@/lib/mongodb';

export async function createAccount(formData) {
  try {
    const data = Object.fromEntries(formData);
    const { email, password, name } = data;

    const { account } = createAdminClient();

    // Create Appwrite account
    const appwriteUser = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    // Connect to MongoDB
    await dbConnect();

    // Create MongoDB user
    await User.create({
      appwriteId: appwriteUser.$id,
      email,
      name,
      role: 'user',
      lastSync: new Date(),
      metadata: {
        lastLogin: new Date(),
        loginCount: 0,
        preferences: {
          newsletter: false,
          notifications: true
        }
      }
    });

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