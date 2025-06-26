
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "min-h-screen bg-black text-white",
      "relative overflow-hidden",
      "flex flex-col",
      className
    )}>
      <div className="flex-1 relative">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
