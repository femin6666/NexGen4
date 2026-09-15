import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  GitCompare,
  HelpCircle,
  ArrowRight,
  Upload,
  CheckCircle2,
  Server,
  Database,
  RefreshCw,
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';
import { api } from '../services/api';
import { HealthStatus, AnalysisItem } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    documentsAnalyzed: 0,
    statementsExtracted: 0,
    conflictsFound: 0,
    possibleConflicts: 0,
  });
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load health
      const hData = await api.getHealth();
      setHealth(hData);

      // Load status / seed counts
      const statusData = await api.getSeedStatus();
      setStats({
        documentsAnalyzed: statusData.documents || 0,
        statementsExtracted: statusData.statements || 0,
        conflictsFound: statusData.conflicts || 0,
        possibleConflicts: statusData.evidence > 0 ? 1 : 0,
      });

      // Load analyses
      const analData = await api.getAnalyses();
      setAnalyses(analData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Listen to custom event when demo data is loaded from sidebar
    const handleDataChanged = () => loadDashboardData();
    window.addEventListener('govverify:data-changed', handleDataChanged);
    return () => window.removeEventListener('govverify:data-changed', handleDataChanged);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gov-dark font-heading">
            Government Document Analysis
          </h1>
          <p className="text-xs text-gov-muted mt-1">
            Monitor document comparisons and detected conflicts across state and central policies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadDashboardData}
            title="Refresh Data"
            className="p-2 text-xs font-semibold text-gov-muted hover:text-gov-dark bg-white border border-gov-border rounded-lg shadow-xs transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            to="/documents"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-gov-navy hover:bg-slate-900 rounded-lg shadow-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Documents</span>
          </Link>
        </div>
      </div>

      {/* Live System Health Integration Card */}
      <div className="p-4 rounded-xl bg-white border border-gov-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-100 text-gov-navy">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gov-dark">Live System Integration Status</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Phase 1 Active
              </span>
            </div>
            <p className="text-[11px] text-gov-muted mt-0.5">
              Backend REST API connected to MongoDB Atlas / local database.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Backend Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-gov-border">
            <span className="text-gov-muted font-medium">Backend:</span>
            <span className={`inline-flex items-center gap-1 font-bold ${
              health?.status === 'healthy' || health?.status === 'degraded' ? 'text-emerald-700' : 'text-red-600'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                health?.status === 'healthy' || health?.status === 'degraded' ? 'bg-emerald-500' : 'bg-red-500'
              }`} />
              {health?.status === 'healthy' || health?.status === 'degraded' ? 'Connected (FastAPI)' : 'Disconnected'}
            </span>
          </div>

          {/* Database Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-gov-border">
            <span className="text-gov-muted font-medium">Database:</span>
            <span className={`inline-flex items-center gap-1 font-bold ${
              health?.database === 'connected' ? 'text-emerald-700' : 'text-amber-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                health?.database === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
              {health?.database === 'connected' ? 'Connected (MongoDB)' : 'Disconnected'}
            </span>
            {health?.database !== 'connected' && (
              <span className="text-[10px] text-amber-600 ml-1">(Ready for Atlas URI)</span>
            )}
          </div>
        </div>
      </div>

      {/* 4 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Documents Analyzed */}
        <div className="gov-card p-5 bg-white border border-gov-border rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gov-muted">Documents Analyzed</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gov-dark font-heading">
            {stats.documentsAnalyzed}
          </div>
          <div className="text-[11px] text-gov-muted mt-2 flex items-center justify-between">
            <span>In repository</span>
            <Link to="/documents" className="text-gov-teal font-semibold hover:underline">
              View all →
            </Link>
          </div>
        </div>

        {/* Card 2: Statements Extracted */}
        <div className="gov-card p-5 bg-white border border-gov-border rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gov-muted">Statements Extracted</span>
            <div className="p-2 rounded-lg bg-teal-50 text-gov-teal">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gov-dark font-heading">
            {stats.statementsExtracted}
          </div>
          <div className="text-[11px] text-gov-muted mt-2 flex items-center justify-between">
            <span>Atomic claims</span>
            <span className="text-slate-400">Schema ready</span>
          </div>
        </div>

        {/* Card 3: Conflicts Found */}
        <div className="gov-card p-5 bg-white border border-gov-border rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gov-muted">Conflicts Found</span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-red-600 font-heading">
            {stats.conflictsFound}
          </div>
          <div className="text-[11px] text-gov-muted mt-2 flex items-center justify-between">
            <span>Numeric & policy</span>
            <Link to="/conflicts" className="text-gov-teal font-semibold hover:underline">
              Inspect →
            </Link>
          </div>
        </div>

        {/* Card 4: Possible Conflicts */}
        <div className="gov-card p-5 bg-white border border-gov-border rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gov-muted">Possible Conflicts</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-600 font-heading">
            {stats.possibleConflicts}
          </div>
          <div className="text-[11px] text-gov-muted mt-2 flex items-center justify-between">
            <span>Conditional exceptions</span>
            <Link to="/conflicts" className="text-gov-teal font-semibold hover:underline">
              Inspect →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Analysis Section */}
      <div className="gov-card p-6 bg-white border border-gov-border rounded-xl">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gov-border">
          <div>
            <h2 className="text-base font-bold text-gov-dark font-heading">Recent Analysis</h2>
            <p className="text-xs text-gov-muted">Past cross-document comparisons and pipeline runs</p>
          </div>

          <button
            onClick={() => navigate('/analysis')}
            className="px-3.5 py-1.5 text-xs font-semibold text-gov-navy border border-gov-border hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Start New Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {analyses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-gov-dark uppercase font-semibold border-b border-gov-border">
                <tr>
                  <th className="py-2.5 px-4">Analysis Name</th>
                  <th className="py-2.5 px-4">Documents</th>
                  <th className="py-2.5 px-4">Statements</th>
                  <th className="py-2.5 px-4">Conflicts</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-border">
                {analyses.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gov-dark">
                      <div className="flex items-center gap-2">
                        <span>{a.title || 'Document Comparison'}</span>
                        {a.isDemo && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            DEMO
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gov-muted">{a.documentIds.length} Docs</td>
                    <td className="py-3 px-4 text-gov-muted">{a.totalStatements} Claims</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-semibold bg-red-50 text-red-700 border border-red-200">
                        {a.conflictsFound} Detected
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gov-muted">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/conflicts"
                        className="text-xs font-semibold text-gov-teal hover:underline"
                      >
                        View Report
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty state for Phase 1 */
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <div className="p-3 rounded-full bg-slate-100 text-slate-400 mb-3">
              <GitCompare className="w-8 h-8 text-gov-muted" />
            </div>
            <h3 className="text-sm font-semibold text-gov-dark mb-1">
              No analysis available yet.
            </h3>
            <p className="text-xs text-gov-muted max-w-sm mb-4 leading-relaxed">
              Upload official government documents or load the demo scholarship scenario to examine comparative analysis results.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/documents')}
                className="px-4 py-2 text-xs font-semibold text-white bg-gov-navy hover:bg-slate-900 rounded-lg transition-colors"
              >
                Upload Documents
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
