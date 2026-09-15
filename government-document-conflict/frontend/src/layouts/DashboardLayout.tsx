import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  GitCompare,
  AlertTriangle,
  BookOpen,
  FileBarChart,
  Settings,
  Menu,
  X,
  Database,
  Server,
  RefreshCw,
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { api } from '../services/api';
import { HealthStatus } from '../types';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  const fetchHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const data = await api.getHealth();
      setHealth(data);
    } catch {
      setHealth({
        status: 'error',
        database: 'disconnected',
      });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleSeedDemoData = async () => {
    setIsSeeding(true);
    try {
      const res = await api.seedDemoData();
      setSeedNotice('Demo Scholarship scenario loaded successfully!');
      setTimeout(() => setSeedNotice(null), 4000);
      // Reload current page if needed or notify
      window.dispatchEvent(new CustomEvent('govverify:data-changed'));
    } catch (err) {
      setSeedNotice('Failed to seed demo data.');
    } finally {
      setIsSeeding(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Analysis', path: '/analysis', icon: GitCompare },
    { name: 'Conflicts', path: '/conflicts', icon: AlertTriangle },
    { name: 'Evidence', path: '/evidence', icon: BookOpen },
    { name: 'Reports', path: '/reports', icon: FileBarChart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const currentNav = navItems.find((item) => item.path === location.pathname) || navItems[0];

  return (
    <div className="min-h-screen bg-gov-bg flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#17212B] text-slate-200 border-r border-slate-800 shrink-0 select-none">
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-5 border-b border-slate-800 bg-[#121A22]">
          <Logo size="sm" showSubtitle={false} linkTo="/dashboard" />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gov-teal text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
                {item.name === 'Conflicts' && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded-full bg-red-900/60 text-red-200 border border-red-700/50">
                    Audit
                  </span>
                )}
              </Link>
            );
          })}

          {/* Quick Demo Seed Utility in Sidebar */}
          <div className="pt-6 px-1">
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 text-xs">
              <div className="flex items-center gap-2 text-gov-teal font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Demo Scenario</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2.5 leading-relaxed">
                Load scholarship conflict sample documents, claims & verified citations.
              </p>
              <button
                onClick={handleSeedDemoData}
                disabled={isSeeding}
                className="w-full py-1.5 px-2.5 text-[11px] font-semibold text-white bg-gov-navy hover:bg-slate-700 rounded border border-slate-600 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isSeeding ? 'animate-spin' : ''}`} />
                <span>{isSeeding ? 'Loading Demo...' : 'Load Scholarship Demo'}</span>
              </button>
            </div>
          </div>
        </nav>

        {/* System Status in Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#121A22]/90 text-[11px] space-y-2">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>System Status</span>
            <button
              onClick={fetchHealth}
              title="Refresh Health"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isCheckingHealth ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Backend Pill */}
          <div className="flex items-center justify-between p-1.5 rounded bg-slate-800/60 border border-slate-700/40">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Server className="w-3 h-3 text-slate-400" />
              <span>Backend API</span>
            </div>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              health?.status === 'healthy' || health?.status === 'degraded'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                : 'bg-red-950 text-red-300 border border-red-800/60'
            }`}>
              {health?.status === 'healthy' || health?.status === 'degraded' ? 'Connected' : 'Offline'}
            </span>
          </div>

          {/* Database Pill */}
          <div className="flex items-center justify-between p-1.5 rounded bg-slate-800/60 border border-slate-700/40">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Database className="w-3 h-3 text-slate-400" />
              <span>MongoDB</span>
            </div>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              health?.database === 'connected'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                : 'bg-amber-950 text-amber-300 border border-amber-800/60'
            }`}>
              {health?.database === 'connected' ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-gov-border flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gov-dark md:hidden hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Breadcrumb Title */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gov-muted">
              <span>GovVerify</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-gov-dark text-sm font-bold font-heading">{currentNav.name}</span>
            </div>
          </div>

          {/* Top Bar Right Items */}
          <div className="flex items-center gap-3">
            {/* Live Connection Badges on Top Bar */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-gov-border text-gov-dark text-[11px] font-medium">
                <span className={`w-2 h-2 rounded-full ${
                  health?.status === 'healthy' || health?.status === 'degraded' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                }`} />
                <span>Backend: <strong>{health?.status === 'healthy' || health?.status === 'degraded' ? 'Connected' : 'Offline'}</strong></span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-gov-border text-gov-dark text-[11px] font-medium">
                <span className={`w-2 h-2 rounded-full ${
                  health?.database === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
                <span>Database: <strong>{health?.database === 'connected' ? 'Connected' : 'Offline'}</strong></span>
              </div>
            </div>

            {/* User Profile Mockup */}
            <div className="flex items-center gap-2 pl-2 border-l border-gov-border">
              <div className="w-8 h-8 rounded-full bg-gov-navy text-white text-xs font-bold flex items-center justify-center shadow-xs">
                GV
              </div>
              <div className="hidden lg:block text-left text-xs">
                <div className="font-bold text-gov-dark leading-tight">Auditor Officer</div>
                <div className="text-[10px] text-gov-muted">Document Intelligence</div>
              </div>
            </div>
          </div>
        </header>

        {/* Demo Seed Toast Notification */}
        {seedNotice && (
          <div className="bg-teal-700 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{seedNotice}</span>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#17212B] text-slate-200 border-b border-slate-800 px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                    isActive ? 'bg-gov-teal text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Nested Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
