import React from 'react';

const Container = ({ 
  children, 
  size = 'default',
  className = '',
  ...props 
}) => {
  const sizes = {
    small: 'max-w-4xl',
    default: 'max-w-6xl',
    large: 'max-w-7xl'
  };

  return (
    <div 
      className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
