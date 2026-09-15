import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Bookmark,
  CheckCircle2,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Filter,
  AlertCircle,
  X,
  ArrowRight,
  GitCompare,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { EvidenceItem, DocumentItem } from '../types';

export const EvidencePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlDocumentId = searchParams.get('documentId') || '';
  const urlAnalysisId = searchParams.get('analysisId') || '';
  const urlConflictId = searchParams.get('conflictId') || '';

  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected document filter state: 'MY_ANALYZED' | 'ALL' | specific document ID
  const [selectedDocFilter, setSelectedDocFilter] = useState<string>(
    urlDocumentId || 'MY_ANALYZED'
  );

  // Sync state if URL search param changes
  useEffect(() => {
    if (urlDocumentId) {
      setSelectedDocFilter(urlDocumentId);
    }
  }, [urlDocumentId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load both evidence records and all documents
      const [evidenceData, docsData] = await Promise.all([
        api.getEvidence({
          conflictId: urlConflictId || undefined,
          analysisId: urlAnalysisId || undefined
        }),
        api.getDocuments()
      ]);
      setEvidenceList(evidenceData);
      setDocuments(docsData);
    } catch (err) {
      console.error('Failed to load evidence data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleDataChanged = () => loadData();
    window.addEventListener('govverify:data-changed', handleDataChanged);
    return () => window.removeEventListener('govverify:data-changed', handleDataChanged);
  }, [urlConflictId, urlAnalysisId]);

  // Determine user's analyzed (non-demo) documents
  const userAnalyzedDocs = useMemo(() => {
    return documents.filter((d) => !d.isDemo);
  }, [documents]);

  const userAnalyzedDocIds = useMemo(() => {
    return new Set(userAnalyzedDocs.map((d) => d._id));
  }, [userAnalyzedDocs]);

  // Filter evidence based on the active document filter and search query
  const filteredEvidence = useMemo(() => {
    return evidenceList.filter((item) => {
      // 1. URL Conflict ID filter (if present)
      if (urlConflictId && item.conflictId !== urlConflictId) {
        return false;
      }

      // 2. URL Analysis ID filter (if present)
      if (urlAnalysisId && (item as any).analysisId && (item as any).analysisId !== urlAnalysisId) {
        return false;
      }

      // 3. Document Filter
      if (selectedDocFilter === 'MY_ANALYZED') {
        // If the user has analyzed their own documents, ONLY show evidence for those documents
        if (userAnalyzedDocIds.size > 0) {
          // Check by documentId or matching document title
          const matchesDocId = userAnalyzedDocIds.has(item.documentId);
          const matchesDocName = userAnalyzedDocs.some(
            (d) => d.title.toLowerCase() === (item.documentName || '').toLowerCase()
          );
          if (!matchesDocId && !matchesDocName && item.isDemo) {
            return false;
          }
        }
      } else if (selectedDocFilter !== 'ALL') {
        // Specific document selected
        const targetDoc = documents.find((d) => d._id === selectedDocFilter);
        const matchesDocId = item.documentId === selectedDocFilter;
        const matchesDocName = targetDoc && item.documentName && targetDoc.title.toLowerCase() === item.documentName.toLowerCase();
        if (!matchesDocId && !matchesDocName) {
          return false;
        }
      }

      // 4. Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.sourceText.toLowerCase().includes(q) ||
          (item.documentName && item.documentName.toLowerCase().includes(q)) ||
          item.section.toLowerCase().includes(q) ||
          (item.explanation && item.explanation.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [evidenceList, selectedDocFilter, userAnalyzedDocIds, userAnalyzedDocs, documents, searchQuery, urlConflictId, urlAnalysisId]);

  // Identify the active filter display label
  const activeFilterInfo = useMemo(() => {
    if (urlConflictId) {
      return {
        label: `Filtered by Conflict ID: ${urlConflictId.substring(0, 8)}...`,
        isFiltered: true
      };
    }
    if (urlAnalysisId) {
      return {
        label: `Filtered by Analysis Run ID: ${urlAnalysisId.substring(0, 8)}...`,
        isFiltered: true
      };
    }
    if (selectedDocFilter === 'MY_ANALYZED') {
      if (userAnalyzedDocs.length > 0) {
        const docNames = userAnalyzedDocs.map((d) => d.title).join(', ');
        return {
          label: `Only Analyzed Documents: ${docNames}`,
          isFiltered: true
        };
      }
      return { label: 'All Evidence', isFiltered: false };
    }
    if (selectedDocFilter !== 'ALL') {
      const doc = documents.find((d) => d._id === selectedDocFilter);
      return {
        label: `Only Document: ${doc?.title || selectedDocFilter}`,
        isFiltered: true
      };
    }
    return { label: 'All Evidence (including demo data)', isFiltered: false };
  }, [selectedDocFilter, documents, userAnalyzedDocs, urlConflictId, urlAnalysisId]);

  const handleClearFilters = () => {
    setSelectedDocFilter('ALL');
    setSearchQuery('');
    setSearchParams({});
  };

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
            onClick={loadData}
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

      {/* Filter Toolbar: Document Selector & Search Bar */}
      <div className="gov-card p-4 bg-white border border-gov-border rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Document Scope Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gov-teal shrink-0" />
            <label htmlFor="doc-scope" className="text-xs font-bold text-gov-dark shrink-0">
              Show Evidence For:
            </label>
            <select
              id="doc-scope"
              value={selectedDocFilter}
              onChange={(e) => {
                setSelectedDocFilter(e.target.value);
                if (e.target.value === 'ALL') {
                  setSearchParams({});
                } else if (e.target.value !== 'MY_ANALYZED') {
                  setSearchParams({ documentId: e.target.value });
                }
              }}
              className="text-xs font-medium bg-slate-50 border border-gov-border rounded-lg px-3 py-1.5 text-gov-dark focus:outline-none focus:ring-2 focus:ring-gov-teal/20 focus:border-gov-teal max-w-xs truncate"
            >
              {userAnalyzedDocs.length > 0 && (
                <option value="MY_ANALYZED">
                  ⭐ Only My Analyzed Documents ({userAnalyzedDocs.map((d) => d.title).join(', ')})
                </option>
              )}
              {documents.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.isDemo ? '📁 [Demo] ' : '📄 '} {doc.title}
                </option>
              ))}
              <option value="ALL">All Documents (Unfiltered)</option>
            </select>
          </div>

          {/* Search by text/clause */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search source text, section, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-teal/20 focus:border-gov-teal"
            />
          </div>
        </div>

        {/* Active Filter Scope Pill Banner */}
        {activeFilterInfo.isFiltered && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-teal-50 text-gov-teal font-semibold border border-teal-200 flex items-center gap-1.5 text-[11px]">
                <FileText className="w-3.5 h-3.5" />
                <span>{activeFilterInfo.label}</span>
              </span>
              <span className="text-gov-muted text-[11px]">
                ({filteredEvidence.length} citations verified)
              </span>
            </div>

            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-gov-dark transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Show All Documents</span>
            </button>
          </div>
        )}
      </div>

      {/* Evidence Cards List */}
      {isLoading ? (
        <div className="gov-card p-16 text-center text-xs text-gov-muted bg-white border border-gov-border rounded-xl">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gov-teal" />
          Loading verified evidence citations...
        </div>
      ) : filteredEvidence.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvidence.map((item) => (
            <div
              key={item._id}
              className="gov-card p-5 bg-white border border-gov-border rounded-xl flex flex-col justify-between hover:shadow-xs transition-shadow"
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
                    {item.isDemo ? (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                        DEMO
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                        ANALYZED
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
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified by Citation Engine</span>
                </span>
                <Link
                  to={`/conflicts`}
                  className="font-mono text-[10px] text-gov-teal hover:underline flex items-center gap-1"
                  title="View Corresponding Conflict"
                >
                  <span>Conflict: {item.conflictId.substring(0, 8)}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </Link>
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
          <h3 className="text-sm font-semibold text-gov-dark mb-1 font-heading">
            No evidence citations found for this selection.
          </h3>
          <p className="text-xs text-gov-muted max-w-md mb-5 leading-relaxed">
            {activeFilterInfo.isFiltered
              ? `No citations have been recorded for ${activeFilterInfo.label}. Documents must be processed through the Conflict Analysis Pipeline to extract and ground evidence.`
              : 'Evidence citations appear after running document analysis in the pipeline.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/analysis')}
              className="px-4 py-2 text-xs font-semibold text-white bg-gov-navy hover:bg-slate-900 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Go to Analysis Pipeline</span>
            </button>
            {activeFilterInfo.isFiltered && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Reset Document Filter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidencePage;
