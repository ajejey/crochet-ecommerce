import React from 'react';

export const Heading = ({ 
  level = 1, 
  children, 
  className = '',
  ...props 
}) => {
  const Tag = `h${level}`;
  const baseStyles = 'font-heading';
  const sizeStyles = {
    1: 'text-4xl mb-6',
    2: 'text-3xl mb-5',
    3: 'text-2xl mb-4',
    4: 'text-xl mb-3',
    5: 'text-lg mb-2',
    6: 'text-base mb-2'
  };

  return (
    <Tag 
      className={`${baseStyles} ${sizeStyles[level]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
};

export const Text = ({ 
  variant = 'body', 
  children, 
  className = '',
  ...props 
}) => {
  const styles = {
    body: 'text-base',
    lead: 'text-lg font-medium',
    small: 'text-sm',
    caption: 'text-xs'
  };

  return (
    <p 
      className={`${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};
