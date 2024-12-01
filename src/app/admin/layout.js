import React from 'react';
import AdminNavigation from './components/AdminNavigation';
import { requireAdmin } from '@/lib/auth-context';

export default async function AdminLayout({ children }) {
  // Check if user is admin
 const user = await requireAdmin();
 console.log("user in admin layout", user)

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminNavigation />
        <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
