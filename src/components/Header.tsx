
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
          <div className="relative group">
            <img 
              src="/lovable-uploads/e5b686f9-ff1e-4506-bab4-1bb5e2bb3d01.png"
              alt="Meditation Consciousness Logo"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-readiness-quantum/70
                         shadow-sacred transition-all duration-700 group-hover:ring-readiness-golden/90
                         group-hover:scale-125 animate-consciousness-glow backdrop-blur-sm"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-readiness-drr rounded-full
                            animate-readiness-pulse shadow-sacred"></div>
            <div className="absolute inset-0 rounded-full bg-readiness opacity-0
                            group-hover:opacity-30 transition-opacity duration-500"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-readiness-quantum
                           to-readiness-golden bg-clip-text text-transparent tracking-wide
                           drop-shadow-2xl animate-float">
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
