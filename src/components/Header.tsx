
import React from 'react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Project Sentinel" }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-void backdrop-blur-xl 
                      border-b border-readiness-display-primary/30 shadow-readiness">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <img 
              src="/sentinel_logo.svg"
              alt="Sentinel Logo"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-readiness-display-primary/60
                         shadow-sacred transition-all duration-500 group-hover:ring-readiness-quantum/80
                         group-hover:scale-110 animate-readiness-pulse"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-readiness-drr rounded-full
                            animate-readiness-pulse shadow-sacred"></div>
            <div className="absolute inset-0 rounded-full bg-readiness opacity-0
                            group-hover:opacity-30 transition-opacity duration-500"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-readiness-quantum
                           to-readiness-golden bg-clip-text text-transparent tracking-wide
                           drop-shadow-lg">
              {title}
            </h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-readiness-drr rounded-full animate-readiness-pulse"></div>
              <p className="text-sm text-readiness-quantum/90 font-medium">
                Cognitive Readiness Training
              </p>
            </div>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-white/90 
                          bg-readiness/20 px-4 py-2 rounded-full
                          border border-readiness-display-primary/30 backdrop-blur-sm
                          shadow-sacred">
            <div className="w-2 h-2 bg-readiness-drr rounded-full animate-readiness-pulse"></div>
            <span>Cognitive Readiness Levels Ready</span>
          </div>
          <div className="text-xs text-readiness-display-secondary/80 bg-background/20 px-3 py-1
                          rounded-full border border-readiness-display-secondary/20 backdrop-blur-sm">
            DRR Engine ∞ Active
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
