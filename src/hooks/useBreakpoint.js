'use client';

import { useState, useEffect } from 'react';

// Breakpoint values (in pixels)
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export default function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState({
    isMobile: null,
    isTablet: null,
    isDesktop: null,
    isLargeDesktop: null,
    currentBreakpoint: ''
  });

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      const width = window.innerWidth;
      
      setBreakpoint({
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg && width < breakpoints.xl,
        isLargeDesktop: width >= breakpoints.xl,
        currentBreakpoint: 
          width < breakpoints.sm ? 'xs' :
          width < breakpoints.md ? 'sm' :
          width < breakpoints.lg ? 'md' :
          width < breakpoints.xl ? 'lg' :
          width < breakpoints['2xl'] ? 'xl' : '2xl'
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures effect is only run on mount and unmount

  return breakpoint;
}
