'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setError(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        setUser(null);
        router.push('/login'); // Redirect to login page
      } else {
        throw new Error(data.error || 'Failed to logout');
      }
    } catch (err) {
      console.error('Logout error:', err);
      setError(err);
    }
  };

  return {
    user,
    loading,
    error,
    logout,
    isAuthenticated: !!user,
    isSeller: user?.role === 'seller'
  };
}
