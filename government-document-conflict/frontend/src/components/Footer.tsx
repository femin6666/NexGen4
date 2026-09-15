import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, FileText, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gov-dark text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="bg-slate-900/60 p-2 rounded-lg inline-block border border-slate-700/50">
              <Logo showSubtitle={false} />
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              GovVerify is an open enterprise platform providing verifiable, evidence-based cross-document conflict detection across official government orders, policies, notifications, and circulars.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-gov-teal">
              <ShieldCheck className="w-4 h-4" />
              <span>Evidence-First Traceability • Zero Black-Box Answers</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">System Sections</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/dashboard" className="hover:text-white transition-colors">Overview Dashboard</a></li>
              <li><a href="/documents" className="hover:text-white transition-colors">Document Repository</a></li>
              <li><a href="/analysis" className="hover:text-white transition-colors">Comparison Pipeline</a></li>
              <li><a href="/conflicts" className="hover:text-white transition-colors">Detected Conflicts</a></li>
              <li><a href="/evidence" className="hover:text-white transition-colors">Evidence Citations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Governance & Phase</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Current: <strong className="text-slate-200">Phase 1 (Foundation)</strong></li>
              <li>Engine: FastAPI + PyMongo + React</li>
              <li>Architecture: Modular ML Ready</li>
              <li>Compliance: Traceable Claims</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} GovVerify. Government Document Intelligence & Conflict Verification System.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">Designed for Legal, Policy & Enterprise Auditing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
