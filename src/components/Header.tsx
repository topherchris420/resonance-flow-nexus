
import React from 'react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Hello" }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/8dde3780-3bd4-4d5e-833d-e822f6e57af8.png" 
            alt="Hello Logo" 
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
          />
          <h1 className="text-xl font-bold text-white tracking-wide">
            {title}
          </h1>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-xs text-white/60">
          <span>Focus & Flow</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
