import React from 'react';

const Card = ({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-white shadow-md',
    outlined: 'border border-gray-200',
    elevated: 'bg-white shadow-lg'
  };

  return (
    <div 
      className={`rounded-lg p-6 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
