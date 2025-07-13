
import React from 'react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Hello" }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-void backdrop-blur-xl 
                      border-b border-consciousness-mandala/30 shadow-consciousness">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <img 
              src="/lovable-uploads/8dde3780-3bd4-4d5e-833d-e822f6e57af8.png" 
              alt="Hello Logo" 
              className="w-12 h-12 rounded-full object-cover ring-2 ring-consciousness-mandala/60 
                         shadow-sacred transition-all duration-500 group-hover:ring-consciousness-quantum/80 
                         group-hover:scale-110 animate-consciousness-pulse"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-consciousness-drr rounded-full 
                            animate-consciousness-pulse shadow-sacred"></div>
            <div className="absolute inset-0 rounded-full bg-consciousness opacity-0 
                            group-hover:opacity-30 transition-opacity duration-500"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-consciousness-quantum 
                           to-consciousness-golden bg-clip-text text-transparent tracking-wide 
                           drop-shadow-lg">
              {title}
            </h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-consciousness-drr rounded-full animate-consciousness-pulse"></div>
              <p className="text-sm text-consciousness-quantum/90 font-medium">
                Consciousness Exploration Platform
              </p>
            </div>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-white/90 
                          bg-consciousness/20 px-4 py-2 rounded-full 
                          border border-consciousness-mandala/30 backdrop-blur-sm 
                          shadow-sacred">
            <div className="w-2 h-2 bg-consciousness-drr rounded-full animate-consciousness-pulse"></div>
            <span>Consciousness Ready</span>
          </div>
          <div className="text-xs text-consciousness-sacred/80 bg-background/20 px-3 py-1 
                          rounded-full border border-consciousness-sacred/20 backdrop-blur-sm">
            DRR Engine ∞ Active
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
