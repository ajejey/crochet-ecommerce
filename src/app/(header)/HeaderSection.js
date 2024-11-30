'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import TopBar from './components/TopBar';
import MainHeader from './components/MainHeader';
import CategoryNav from './components/CategoryNav';
import { useAuth } from '@/hooks/useAuth';

// Header component that maintains consistent spacing
export function HeaderSpacing({ children }) {
  return (
    <div className="pt-[120px]"> {/* Adjust this value based on your header height */}
      {children}
    </div>
  );
}

export default function HeaderSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();

  return (
    <HeaderSpacing>
      <header className="fixed w-full top-0 z-50 bg-white">
        {/* Main Header - Logo, Search, Actions */}
        <MainHeader 
          user={user}
          loading={loading}
          isMenuOpen={isMenuOpen}
          onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        />

        {/* Category Navigation */}
        <CategoryNav isMenuOpen={isMenuOpen} />
      </header>
    </HeaderSpacing>
  );
}
