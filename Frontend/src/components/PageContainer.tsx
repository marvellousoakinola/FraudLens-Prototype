import React from 'react';

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className, ...props }) => {
  return (
    <div 
      className={`w-full max-w-[1280px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 box-border ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};
