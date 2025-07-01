
import React from 'react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Hello" }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black/90 to-black/80 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <img 
              src="/lovable-uploads/8dde3780-3bd4-4d5e-833d-e822f6e57af8.png" 
              alt="Hello Logo" 
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-400/60 shadow-xl transition-all duration-300 group-hover:ring-blue-300/80 group-hover:scale-105"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent tracking-wide">
              {title}
            </h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <p className="text-sm text-blue-300/90 font-medium">
                Focus & Flow Experience
              </p>
            </div>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-white/70 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Ready to Begin</span>
          </div>
          <div className="text-xs text-white/50 bg-black/30 px-3 py-1 rounded-full border border-white/10">
            DRR Engine Active
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
