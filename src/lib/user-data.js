import { client } from './mongodb';

export async function deleteUserData(userId) {
  const db = client.db();
  
  // Delete user's orders
  await db.collection('orders').deleteMany({ userId });
  
  // Delete user's cart
  await db.collection('carts').deleteMany({ userId });
  
  // Delete user's profile
  await db.collection('users').deleteOne({ _id: userId });
  
  // Delete any other user-related data
  await db.collection('wishlist').deleteMany({ userId });
  await db.collection('reviews').deleteMany({ userId });
  
  return true;
}
