
import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Project Sentinel" }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-void backdrop-blur-xl 
                      border-b border-readiness-quantum/40 shadow-sacred">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="relative group cursor-pointer">
            <img 
              src="/sentinel-logo.jpg"
              alt="Project Sentinel Emblem"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-cyan-500/60
                         shadow-lg shadow-cyan-500/30 transition-all duration-500 group-hover:ring-cyan-300
                         group-hover:scale-110 group-hover:shadow-cyan-400/50"
            />
            <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-cyan-400 rounded-full
                            animate-ping opacity-75"></div>
            <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-cyan-400 rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="font-['Syne',sans-serif] text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-white via-cyan-100
                           to-cyan-400 bg-clip-text text-transparent tracking-wider uppercase
                           drop-shadow-md leading-none">
              {title}
              <span className="sr-only"> — Cognitive Readiness Training</span>
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-cyan-300/80 font-medium tracking-wide uppercase">
                Cognitive Readiness Matrix
              </p>
            </div>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center space-x-4">
          <Link to="/srv" className="text-sm text-white/90 hover:text-readiness-golden transition-colors">
            SRV
          </Link>
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
