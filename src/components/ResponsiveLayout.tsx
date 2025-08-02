
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
      "p-4 sm:p-6 md:p-8",
      className
    )}
    style={{
      backgroundImage: `url(/lovable-uploads/a266cd75-6e99-4f5e-a3e0-a4b88e516e38.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/40 z-0" />
      
      <div className="flex-1 relative z-10 max-w-7xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
