
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Waves, Activity, Sparkles, Compass } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Project Sentinel" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Session Studio', href: '/session', icon: Waves, highlight: true },
    { label: 'SRV Training', href: '/srv', icon: Compass },
    { label: 'Overview', href: '/', icon: Activity },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#090d16]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl safe-area-top">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 max-w-7xl mx-auto">
        
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <img 
              src="/sentinel_logo.svg"
              alt="Project Sentinel Emblem"
              className="w-10 h-10 rounded-xl object-contain ring-1 ring-cyan-500/40 p-0.5
                         shadow-lg shadow-cyan-500/20 transition-all duration-300 group-hover:ring-cyan-300
                         group-hover:scale-105 group-hover:shadow-cyan-400/40 bg-black/40"
            />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="font-['Syne',sans-serif] text-lg sm:text-xl font-extrabold bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent tracking-wide uppercase leading-none">
              {title}
            </h1>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] text-cyan-300/80 font-semibold tracking-wider uppercase">
                Cognitive Readiness Matrix
              </p>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/20'
                    : link.highlight
                    ? 'bg-white/10 text-white hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="ml-2 pl-3 border-l border-white/10 flex items-center space-x-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              DRR ∞ Ready
            </span>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090d16]/95 border-b border-white/10 px-4 py-4 backdrop-blur-2xl animate-accordion-down">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
