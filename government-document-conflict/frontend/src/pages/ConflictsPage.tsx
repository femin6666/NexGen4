import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Filter,
  RefreshCw,
  Sparkles,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Layers,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { ConflictItem, ConflictType } from '../types';
import { ConflictCard } from '../components/ConflictCard';

export const ConflictsPage: React.FC = () => {
  const navigate = useNavigate();
  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const filterOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Direct Conflict', value: 'DIRECT_CONFLICT' },
    { label: 'Numeric Conflict', value: 'NUMERIC_CONFLICT' },
    { label: 'Date Conflict', value: 'DATE_CONFLICT' },
    { label: 'Conditional Difference', value: 'CONDITIONAL_DIFFERENCE' },
    { label: 'Policy Change', value: 'POLICY_CHANGE' },
    { label: 'Possible Conflict', value: 'POSSIBLE_CONFLICT' },
  ];

  const fetchConflicts = async () => {
    setIsLoading(true);
    try {
      const data = await api.getConflicts(activeFilter);
      setConflicts(data);
    } catch (err) {
      console.error('Failed to load conflicts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConflicts();

    const handleDataChanged = () => fetchConflicts();
    window.addEventListener('govverify:data-changed', handleDataChanged);
    return () => window.removeEventListener('govverify:data-changed', handleDataChanged);
  }, [activeFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gov-dark font-heading">
            Detected Conflicts
          </h1>
          <p className="text-xs text-gov-muted mt-1">
            Compare statements across official documents to expose policy contradictions, differing eligibility, and financial divergence.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchConflicts}
            title="Refresh conflicts"
            className="p-2 text-xs font-semibold text-gov-muted hover:text-gov-dark bg-white border border-gov-border rounded-lg shadow-xs transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => navigate('/evidence')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gov-teal bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-lg shadow-xs transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Inspect Evidence Citations</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="gov-card p-3 bg-white border border-gov-border rounded-xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-gov-muted font-semibold px-2 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {filterOptions.map((f) => {
            const isSelected = activeFilter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-gov-navy text-white shadow-xs'
                    : 'text-gov-dark hover:bg-slate-100 bg-slate-50 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conflict Items List */}
      {isLoading ? (
        <div className="gov-card p-16 text-center text-xs text-gov-muted bg-white border border-gov-border rounded-xl">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gov-teal" />
          Loading conflict records...
        </div>
      ) : conflicts.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gov-muted px-1">
            <span>Showing <strong>{conflicts.length}</strong> identified discrepancies</span>
            <span className="text-slate-400">All results mapped to verified document citations</span>
          </div>

          {conflicts.map((conflict) => (
            <ConflictCard
              key={conflict._id}
              conflict={conflict}
              onViewEvidence={() => navigate('/evidence')}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="gov-card p-16 text-center bg-white border border-gov-border rounded-xl flex flex-col items-center justify-center">
          <div className="p-3.5 rounded-full bg-slate-100 text-slate-400 mb-3">
            <AlertTriangle className="w-8 h-8 text-gov-muted" />
          </div>
          <h3 className="text-sm font-semibold text-gov-dark mb-1">
            No conflicts detected yet.
          </h3>
          <p className="text-xs text-gov-muted max-w-sm mb-5 leading-relaxed">
            Analyze government documents to identify contradictions and differences. You can also load the demo scholarship dataset from the sidebar to inspect sample conflict cards.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/documents')}
              className="px-4 py-2 text-xs font-semibold text-white bg-gov-navy hover:bg-slate-900 rounded-lg transition-colors"
            >
              Upload New Documents
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConflictsPage;
