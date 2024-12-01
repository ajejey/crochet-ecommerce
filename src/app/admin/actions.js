'use server';

import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { AdminProfile } from '@/models/AdminProfile';
import { PlatformSettings } from '@/models/PlatformSettings';

// export async function promoteToSuperAdmin(userId, displayName) {
//   await dbConnect();

//   try {
//     // 1. Find and update the user's role
//     const user = await User.findOneAndUpdate(
//       { appwriteId: userId },
//       { role: 'admin' },
//       { new: true }
//     );

//     if (!user) {
//       throw new Error('User not found');
//     }

//     // 2. Create admin profile with super admin privileges
//     const adminProfile = await AdminProfile.create({
//       userId: user.appwriteId,
//       displayName: displayName || user.name,
//       accessLevel: 'super',
//       status: 'active',
//       permissions: {
//         manageUsers: true,
//         manageAdmins: true,
//         viewSellers: true,
//         approveSellers: true,
//         manageSellers: true,
//         viewProducts: true,
//         moderateProducts: true,
//         manageCategories: true,
//         viewOrders: true,
//         manageOrders: true,
//         managePayouts: true,
//         manageRefunds: true,
//         viewSettings: true,
//         manageSettings: true
//       },
//       contactInfo: {
//         email: user.email
//       }
//     });

//     // 3. Initialize platform settings if they don't exist
//     const existingSettings = await PlatformSettings.findOne();
//     if (!existingSettings) {
//       await PlatformSettings.create({
//         platform: {
//           name: 'Crochet E-commerce Platform',
//           supportEmail: user.email
//         },
//         notifications: {
//           adminEmails: [user.email]
//         }
//       });
//     }

//     return {
//       success: true,
//       user,
//       adminProfile
//     };
//   } catch (error) {
//     console.error('Failed to promote user to super admin:', error);
//     throw error;
//   }
// }

// export async function initializePlatformSettings() {
//   await dbConnect();

//   try {
//     const existingSettings = await PlatformSettings.findOne();
//     if (existingSettings) {
//       return { success: true, message: 'Platform settings already exist' };
//     }

//     const settings = await PlatformSettings.create({
//       platform: {
//         name: 'Crochet E-commerce Platform',
//         maintenance: false,
//       },
//       registration: {
//         allowNewSellers: true,
//         allowNewUsers: true,
//         requireEmailVerification: true
//       },
//       seller: {
//         verification: {
//           requireKYC: true,
//           autoApprove: false,
//           requiredDocuments: [
//             {
//               name: 'Government ID',
//               required: true,
//               description: 'Valid government-issued photo ID'
//             },
//             {
//               name: 'Address Proof',
//               required: true,
//               description: 'Recent utility bill or bank statement'
//             }
//           ]
//         }
//       }
//     });

//     return {
//       success: true,
//       settings
//     };
//   } catch (error) {
//     console.error('Failed to initialize platform settings:', error);
//     throw error;
//   }
// }
