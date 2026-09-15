import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FileText,
  Bookmark,
  CheckCircle2,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Hash,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { EvidenceItem } from '../types';

export const EvidencePage: React.FC = () => {
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEvidence = async () => {
    setIsLoading(true);
    try {
      const data = await api.getEvidence();
      setEvidenceList(data);
    } catch (err) {
      console.error('Failed to load evidence:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();

    const handleDataChanged = () => fetchEvidence();
    window.addEventListener('govverify:data-changed', handleDataChanged);
    return () => window.removeEventListener('govverify:data-changed', handleDataChanged);
  }, []);

  const filteredEvidence = evidenceList.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.sourceText.toLowerCase().includes(q) ||
      (item.documentName && item.documentName.toLowerCase().includes(q)) ||
      item.section.toLowerCase().includes(q) ||
      (item.explanation && item.explanation.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gov-dark font-heading">
            Evidence Verification
          </h1>
          <p className="text-xs text-gov-muted mt-1">
            Auditable citation records linking identified discrepancies back to official gazette pages, sections, and source text.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchEvidence}
            title="Refresh citations"
            className="p-2 text-xs font-semibold text-gov-muted hover:text-gov-dark bg-white border border-gov-border rounded-lg shadow-xs transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Traceability Verified</span>
          </span>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="gov-card p-4 bg-white border border-gov-border rounded-xl">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by source text, document, or clause..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-teal/20 focus:border-gov-teal"
          />
        </div>
      </div>

      {/* Evidence Cards List */}
      {isLoading ? (
        <div className="gov-card p-16 text-center text-xs text-gov-muted bg-white border border-gov-border rounded-xl">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gov-teal" />
          Loading evidence records...
        </div>
      ) : filteredEvidence.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvidence.map((item) => (
            <div
              key={item._id}
              className="gov-card p-5 bg-white border border-gov-border rounded-xl flex flex-col justify-between"
            >
              <div>
                {/* Document & Citation Locator */}
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-gov-border">
                  <div className="flex items-center gap-2 text-xs font-bold text-gov-navy truncate">
                    <FileText className="w-4 h-4 text-gov-teal shrink-0" />
                    <span className="truncate">{item.documentName || 'Official Document'}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] shrink-0">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700 border border-slate-200">
                      Page {item.pageNumber}
                    </span>
                    {item.isDemo && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                        DEMO
                      </span>
                    )}
                  </div>
                </div>

                {/* Section header */}
                <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.section}</span>
                </div>

                {/* Verbatim Source Quote */}
                <div className="mb-4">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Verbatim Document Statement:
                  </div>
                  <blockquote className="p-3 bg-slate-50 rounded-lg border-l-3 border-gov-teal text-xs text-gov-dark font-medium leading-relaxed italic">
                    "{item.sourceText}"
                  </blockquote>
                </div>

                {/* Related Statement or Context */}
                {item.relatedStatement && (
                  <div className="mb-3 p-2.5 rounded bg-amber-50/50 border border-amber-200 text-xs">
                    <div className="text-[10px] uppercase font-bold text-amber-800 mb-0.5">
                      Contrasting Policy Claim:
                    </div>
                    <div className="text-slate-700 text-[11px] italic">
                      "{item.relatedStatement}"
                    </div>
                  </div>
                )}

                {/* Audit Explanation */}
                {item.explanation && (
                  <div className="text-xs text-slate-500 leading-relaxed">
                    <strong className="text-gov-dark">Citation Context: </strong>
                    {item.explanation}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verified by Citation Engine</span>
                <span className="font-mono text-[10px]">ID: {item._id.substring(0, 8)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="gov-card p-16 text-center bg-white border border-gov-border rounded-xl flex flex-col items-center justify-center">
          <div className="p-3.5 rounded-full bg-slate-100 text-slate-400 mb-3">
            <BookOpen className="w-8 h-8 text-gov-muted" />
          </div>
          <h3 className="text-sm font-semibold text-gov-dark mb-1">
            Evidence will appear after document analysis.
          </h3>
          <p className="text-xs text-gov-muted max-w-sm mb-4 leading-relaxed">
            When cross-comparison identifies contradictions, verified source citations with exact page numbers and clauses will be populated here.
          </p>
        </div>
      )}
    </div>
  );
};

export default EvidencePage;
