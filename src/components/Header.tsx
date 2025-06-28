
import React from 'react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Hello" }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src="/lovable-uploads/8dde3780-3bd4-4d5e-833d-e822f6e57af8.png" 
              alt="Hello Logo" 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-400/50 shadow-lg"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              {title}
            </h1>
            <p className="text-xs text-blue-300/80 font-medium">
              Focus & Flow Experience
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-3">
          <div className="text-xs text-white/60 bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Ready to Begin
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
