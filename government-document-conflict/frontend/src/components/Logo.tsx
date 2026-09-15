import React from 'react';
import { Shield, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  linkTo?: string;
}

export const Logo: React.FC<LogoProps> = ({
  showSubtitle = true,
  size = 'md',
  className = '',
  linkTo = '/'
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Document + Shield + Checkmark Icon */}
      <div className="relative flex items-center justify-center p-2 rounded-lg bg-gov-navy text-white shadow-sm border border-slate-700/30">
        <Shield className={`${iconSizes[size]} text-gov-teal`} strokeWidth={2.2} />
        <FileCheck className="w-4 h-4 text-white absolute inset-0 m-auto" strokeWidth={2.5} />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold tracking-tight text-gov-dark ${titleSizes[size]} font-heading`}>
            Gov<span className="text-gov-teal">Verify</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-gov-navy border border-slate-200">
            Phase 1
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-gov-muted tracking-tight hidden sm:block">
            Document Conflict Detection & Evidence Verification
          </span>
        )}
      </div>
    </div>
  );

  return linkTo ? (
    <Link to={linkTo} className="inline-block hover:opacity-95 transition-opacity">
      {content}
    </Link>
  ) : (
    content
  );
};

export default Logo;
