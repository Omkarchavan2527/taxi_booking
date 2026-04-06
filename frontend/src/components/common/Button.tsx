import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'driver' | 'social' | 'outline';
  fullWidth?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  fullWidth = false, 
  children, 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyle = "flex items-center justify-center rounded-xl font-semibold transition-all active:scale-[0.98] py-3.5 px-4";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-700 shadow-sm",
    driver: "bg-driver text-white hover:bg-green-600 shadow-sm",
    social: "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 shadow-sm",
    outline: "bg-transparent text-primary border-2 border-primary hover:bg-blue-50"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};