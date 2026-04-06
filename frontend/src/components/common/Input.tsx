import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  icon, 
  rightElement, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-end mb-1.5">
        <label className="uppercase tracking-[0.08em] text-xs text-gray-500 font-semibold">
          {label}
        </label>
        {rightElement && <div>{rightElement}</div>}
      </div>
      <div className="relative">
        <input 
          className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${icon ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};