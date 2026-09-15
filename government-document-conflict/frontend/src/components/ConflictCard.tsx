import React from 'react';
import { ConflictItem, ConflictType } from '../types';
import { AlertTriangle, ArrowRight, BookOpen, CheckCircle, Clock, FileText, Info } from 'lucide-react';

interface ConflictCardProps {
  conflict: ConflictItem;
  onViewEvidence?: (conflictId: string) => void;
}

export const ConflictCard: React.FC<ConflictCardProps> = ({ conflict, onViewEvidence }) => {
  const getBadgeStyle = (type: ConflictType) => {
    switch (type) {
      case 'DIRECT_CONFLICT':
      case 'NUMERIC_CONFLICT':
        return {
          bg: 'bg-red-50 border-red-200 text-red-700',
          icon: '🔴',
          label: type === 'NUMERIC_CONFLICT' ? 'Numeric Conflict' : 'Direct Conflict',
        };
      case 'CONDITIONAL_DIFFERENCE':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          icon: '🟠',
          label: 'Conditional Difference',
        };
      case 'POLICY_CHANGE':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          icon: '🔵',
          label: 'Policy Change',
        };
      case 'DATE_CONFLICT':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          icon: '🔴',
          label: 'Date Conflict',
        };
      case 'POSSIBLE_CONFLICT':
      default:
        return {
          bg: 'bg-yellow-50 border-yellow-200 text-yellow-700',
          icon: '🟡',
          label: 'Possible Conflict',
        };
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const badgeInfo = getBadgeStyle(conflict.conflictType);

  return (
    <div className="gov-card p-5 border border-gov-border rounded-lg bg-white relative">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-gov-border">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${badgeInfo.bg}`}>
            <span>{badgeInfo.icon}</span>
            <span>{badgeInfo.label}</span>
          </span>
          {conflict.topic && (
            <span className="text-xs font-medium text-gov-muted px-2 py-0.5 rounded bg-slate-100">
              Topic: <strong className="text-gov-dark">{conflict.topic}</strong>
            </span>
          )}
          {conflict.isDemo && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
              DEMO DATA
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-gov-muted">
            Confidence: <strong className="text-gov-dark">{Math.round(conflict.confidence * 100)}%</strong>
          </span>
          <span className={`px-2 py-0.5 rounded font-semibold border ${getSeverityBadge(conflict.severity)}`}>
            {conflict.severity} Severity
          </span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Document A Statement */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-gov-navy" />
            <span className="text-xs font-semibold text-gov-navy truncate">
              {conflict.documentAName || 'Document A'}
            </span>
          </div>
          <div className="text-xs text-gov-muted uppercase font-semibold mb-1">Source Claim A:</div>
          <blockquote className="text-sm text-gov-dark font-medium leading-relaxed italic pl-3 border-l-2 border-gov-navy">
            "{conflict.statementAText || 'Statement A content from source document'}"
          </blockquote>
        </div>

        {/* Document B Statement */}
        <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200/80">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-gov-orange" />
            <span className="text-xs font-semibold text-gov-orange truncate">
              {conflict.documentBName || 'Document B'}
            </span>
          </div>
          <div className="text-xs text-gov-muted uppercase font-semibold mb-1">Conflicting Claim B:</div>
          <blockquote className="text-sm text-gov-dark font-medium leading-relaxed italic pl-3 border-l-2 border-gov-orange">
            "{conflict.statementBText || 'Statement B content from comparison document'}"
          </blockquote>
        </div>
      </div>

      {/* Conflict Reason */}
      <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-gov-dark flex items-start gap-2.5">
        <Info className="w-4 h-4 text-gov-teal shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-gov-navy">Explanation & Analysis: </span>
          <span>{conflict.reason || 'Divergence identified during cross-document comparative analysis.'}</span>
        </div>
      </div>

      {/* Action Footer */}
      {onViewEvidence && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => onViewEvidence(conflict._id)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gov-teal hover:text-teal-800 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Inspect Source Evidence & Citations
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ConflictCard;
