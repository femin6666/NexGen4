import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F8F9F7]/90 backdrop-blur-md border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Logo size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gov-dark">
            <a href="#how-it-works" className="hover:text-gov-teal transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-gov-teal transition-colors">
              Features
            </a>
            <a href="#pipeline" className="hover:text-gov-teal transition-colors">
              Architecture
            </a>
            <a href="#about" className="hover:text-gov-teal transition-colors">
              About
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-xs font-semibold px-4 py-2 rounded-lg text-gov-navy hover:text-slate-900 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/dashboard"
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-gov-navy text-white hover:bg-slate-900 shadow-sm flex items-center gap-1.5 transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gov-navy hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-gov-border bg-white px-4 pt-2 pb-6 space-y-3">
          <a
            href="#how-it-works"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-gov-dark hover:text-gov-teal"
          >
            How It Works
          </a>
          <a
            href="#features"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-gov-dark hover:text-gov-teal"
          >
            Features
          </a>
          <a
            href="#pipeline"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-gov-dark hover:text-gov-teal"
          >
            Architecture
          </a>
          <a
            href="#about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-gov-dark hover:text-gov-teal"
          >
            About
          </a>
          <div className="pt-3 border-t border-gov-border flex flex-col gap-2">
            <Link
              to="/dashboard"
              className="w-full text-center py-2 text-xs font-semibold text-gov-navy border border-gov-border rounded-lg"
            >
              Login
            </Link>
            <Link
              to="/dashboard"
              className="w-full text-center py-2 text-xs font-semibold text-white bg-gov-navy rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
