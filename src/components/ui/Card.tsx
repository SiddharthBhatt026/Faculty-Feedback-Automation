import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  radius = 'md',
  className,
  ...props
}) => {
  const baseClasses = 'bg-white';
  
  const variantClasses = {
    default: 'shadow',
    outlined: 'border border-gray-200',
    elevated: 'shadow-md',
  };
  
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };
  
  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${radiusClasses[radius]}
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  children, 
  className, 
  ...props 
}) => (
  <div 
    className={`mb-4 ${className || ''}`} 
    {...props}
  >
    {children}
  </div>
);

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle: React.FC<CardTitleProps> = ({ 
  children, 
  className, 
  ...props 
}) => (
  <h3 
    className={`text-xl font-semibold ${className || ''}`} 
    {...props}
  >
    {children}
  </h3>
);

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription: React.FC<CardDescriptionProps> = ({ 
  children, 
  className, 
  ...props 
}) => (
  <p 
    className={`text-sm text-gray-500 ${className || ''}`} 
    {...props}
  >
    {children}
  </p>
);

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent: React.FC<CardContentProps> = ({ 
  children, 
  className, 
  ...props 
}) => (
  <div 
    className={`${className || ''}`} 
    {...props}
  >
    {children}
  </div>
);

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter: React.FC<CardFooterProps> = ({ 
  children, 
  className, 
  ...props 
}) => (
  <div 
    className={`mt-4 pt-4 border-t border-gray-100 ${className || ''}`} 
    {...props}
  >
    {children}
  </div>
);

export default Card;