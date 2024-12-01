'use client';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

export function useAuth() {
  const router = useRouter();
  const { data, error, mutate } = useSWR('/api/auth/check', fetcher, {
    revalidateOnFocus: false,     // Don't revalidate on tab focus - rely on session cookie
    revalidateOnReconnect: true,  // Revalidate on reconnect to ensure session is still valid
    refreshInterval: 0,           // Don't auto-refresh - rely on session cookie
    dedupingInterval: 0,          // No deduping needed for auth - immediate revalidation when requested
    shouldRetryOnError: false,    // Don't retry on error - auth errors are usually permanent
    keepPreviousData: true,       // Keep showing previous user data while revalidating
  });

  const loading = !data && !error;
  const user = data?.authenticated ? data.user : null;

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        await mutate(null, { revalidate: false }); // Clear cache without revalidation
        router.push('/login');
      } else {
        throw new Error(data.error || 'Failed to logout');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Force revalidation when needed (e.g., after user updates their profile)
  const refresh = () => mutate();

  return {
    user,
    loading,
    error,
    logout,
    refresh,                    // Expose refresh function for manual revalidation
    isAuthenticated: !!user,
    isSeller: user?.role === 'seller',
  };
}
