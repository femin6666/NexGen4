import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitCompare,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Layers,
  Sparkles,
  Brain,
  ShieldCheck,
  Scale,
  FileCheck2,
  Search,
  ChevronRight,
  Upload,
  Play,
  ArrowRight,
  Terminal,
  RefreshCw,
  BookOpen,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { DocumentItem, AnalysisRunResponse, ConflictItem } from '../types';
import { UploadModal } from '../components/UploadModal';
import { ConflictCard } from '../components/ConflictCard';
import { WorkflowFlowchart } from '../components/WorkflowFlowchart';

export const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [analysisTitle, setAnalysisTitle] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'pipeline' | 'flowchart'>('pipeline');

  // Simulation status & execution state
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [progressPercent, setProgressPercent] = useState(0);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisRunResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDocuments = async () => {
    try {
      const docs = await api.getDocuments();
      setDocuments(docs);
      if (docs.length >= 2 && selectedDocs.length === 0) {
        setSelectedDocs([docs[0]._id, docs[1]._id]);
      } else if (docs.length === 1 && selectedDocs.length === 0) {
        setSelectedDocs([docs[0]._id]);
      }
    } catch (err) {
      console.error('Failed to load documents for analysis:', err);
    }
  };

  useEffect(() => {
    loadDocuments();

    const handleDataChanged = () => loadDocuments();
    window.addEventListener('govverify:data-changed', handleDataChanged);
    return () => window.removeEventListener('govverify:data-changed', handleDataChanged);
  }, []);

  const pipelineSteps = [
    {
      step: '01',
      title: 'Upload Documents',
      subtitle: 'Ingesting Multi-Format Government Orders & Policies (PDF, DOCX, TXT)',
      icon: FileText,
    },
    {
      step: '02',
      title: 'OCR / Text Extraction',
      subtitle: 'Extracting text and layout structure while preserving sections & pages',
      icon: Search,
    },
    {
      step: '03',
      title: 'Statement Extraction',
      subtitle: 'Deconstructing atomic claims, numerical values, dates & conditional rules',
      icon: Layers,
    },
    {
      step: '04',
      title: 'Semantic Matching',
      subtitle: 'Cross-document topic alignment and semantic similarity mapping',
      icon: Brain,
    },
    {
      step: '05',
      title: 'Conflict Detection',
      subtitle: 'Evaluating contradictions: bifurcating into Consistent vs Conflicting',
      icon: Scale,
    },
    {
      step: '06',
      title: 'Side-by-Side View & Source Citations',
      subtitle: 'Grounding divergences to verbatim quotes, exact document name & page number',
      icon: ShieldCheck,
    },
    {
      step: '07',
      title: 'User Verification & Dossier',
      subtitle: 'Human-in-the-loop audit adjudication and exportable compliance dossier',
      icon: FileCheck2,
    },
  ];

  const toggleDocSelection = (id: string) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSelectFirstTwo = () => {
    if (documents.length >= 2) {
      setSelectedDocs([documents[0]._id, documents[1]._id]);
    } else if (documents.length === 1) {
      setSelectedDocs([documents[0]._id]);
    }
  };

  const runSimulation = async () => {
    if (selectedDocs.length === 0) {
      setErrorMessage('Please select at least one document to analyze.');
      return;
    }

    setErrorMessage(null);
    setIsSimulating(true);
    setAnalysisResult(null);
    setActiveStepIndex(0);
    setProgressPercent(10);
    setSimulationLogs([]);

    const selectedDocTitles = documents
      .filter((d) => selectedDocs.includes(d._id))
      .map((d) => `"${d.title}"`)
      .join(' & ');

    const addLog = (msg: string) => {
      const time = new Date().toLocaleTimeString();
      setSimulationLogs((prev) => [...prev, `[${time}] ${msg}`]);
    };

    addLog(`Initiated analysis simulation with ${selectedDocs.length} documents: ${selectedDocTitles}`);

    try {
      // Step 1: Ingestion
      setActiveStepIndex(0);
      setProgressPercent(15);
      await new Promise((r) => setTimeout(r, 600));
      addLog('Document streams ingested and validated against MIME constraints.');

      // Step 2: Extraction
      setActiveStepIndex(1);
      setProgressPercent(30);
      await new Promise((r) => setTimeout(r, 600));
      addLog('Segmented document text into 24 clauses, section headings, and footnotes.');

      // Step 3: Statements
      setActiveStepIndex(2);
      setProgressPercent(45);
      await new Promise((r) => setTimeout(r, 600));
      addLog('Extracted atomic structured claims: Minimum Age thresholds, Family Income ceilings, and Institution criteria.');

      // Step 4: Semantic Matching
      setActiveStepIndex(3);
      setProgressPercent(60);
      await new Promise((r) => setTimeout(r, 650));
      addLog('Semantic matching engine aligned 4 parallel regulatory statements across documents.');

      // Step 5: Conflict Engine
      setActiveStepIndex(4);
      setProgressPercent(75);
      await new Promise((r) => setTimeout(r, 650));
      addLog('Conflict engine flagged NUMERIC CONFLICT (18 vs 21 years) and POLICY CHANGE (Income ceilings).');

      // Step 6: Evidence Grounding
      setActiveStepIndex(5);
      setProgressPercent(90);
      await new Promise((r) => setTimeout(r, 600));
      addLog('Grounded 4 verbatim evidence citations with exact page numbers and clause headers.');

      // Step 7: API Call & Report Save
      setActiveStepIndex(6);
      setProgressPercent(95);

      const titleToUse = analysisTitle.trim() || `Cross-Audit: ${selectedDocTitles}`;
      const response = await api.simulateAnalysis(selectedDocs, titleToUse);

      setProgressPercent(100);
      setActiveStepIndex(7); // All completed
      addLog(`Simulation completed! Saved analysis dossier with ID: ${response.analysis._id.substring(0, 10)}...`);
      setAnalysisResult(response);

      // Dispatch global event so Dashboard and Counters update immediately
      window.dispatchEvent(new CustomEvent('govverify:data-changed'));
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Simulation encountered an unexpected error.';
      setErrorMessage(msg);
      addLog(`ERROR: ${msg}`);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gov-dark font-heading">
            Document Analysis Pipeline
          </h1>
          <p className="text-xs text-gov-muted mt-1">
            End-to-end processing pipeline for extracting claims, finding semantic matches, and exposing discrepancies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gov-navy bg-white border border-gov-border hover:bg-slate-50 rounded-lg shadow-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Document</span>
          </button>
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Section 1: Document Selection for Analysis */}
      <div className="gov-card p-6 bg-white border border-gov-border rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-gov-border">
          <div>
            <h2 className="text-sm font-bold text-gov-dark font-heading">
              1. Select Documents for Cross-Comparison
            </h2>
            <p className="text-xs text-gov-muted">
              Choose two or more official orders, circulars, or policy documents to compare.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectFirstTwo}
              className="text-[11px] font-semibold text-gov-teal hover:underline"
            >
              Select Top 2
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setSelectedDocs([])}
              className="text-[11px] font-semibold text-slate-500 hover:underline"
            >
              Clear
            </button>
          </div>
        </div>

        {documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            {documents.map((doc) => {
              const isSelected = selectedDocs.includes(doc._id);
              return (
                <div
                  key={doc._id}
                  onClick={() => toggleDocSelection(doc._id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all select-none ${
                    isSelected
                      ? 'border-gov-teal bg-teal-50/40 shadow-xs ring-1 ring-gov-teal'
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="text-xs font-bold text-gov-dark line-clamp-1">
                      {doc.title}
                    </div>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-gov-teal border-gov-teal text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <div className="text-[11px] text-gov-muted font-medium truncate">{doc.department}</div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                    <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-medium">
                      {doc.documentType}
                    </span>
                    <span>{doc.documentDate || '2025'}</span>
                    {doc.isDemo && (
                      <span className="ml-auto font-bold text-[9px] text-amber-800 bg-amber-100 px-1 rounded">
                        DEMO
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center mb-4">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-gov-dark mb-1">
              No documents found in the repository.
            </div>
            <p className="text-[11px] text-gov-muted mb-3 max-w-sm mx-auto">
              Upload documents using the button above or click "Load Scholarship Demo" in the sidebar to populate test documents.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-gov-navy hover:bg-slate-900 rounded-lg shadow-xs"
            >
              Upload Document Now
            </button>
          </div>
        )}

        {/* Custom Title Input & Run Trigger Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gov-border">
          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Optional: Custom analysis title..."
              value={analysisTitle}
              onChange={(e) => setAnalysisTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-teal/20 focus:border-gov-teal"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs text-gov-muted">
              Selected: <strong className="text-gov-dark">{selectedDocs.length}</strong> {selectedDocs.length === 1 ? 'document' : 'documents'}
            </span>

            <button
              disabled={isSimulating || selectedDocs.length === 0}
              onClick={runSimulation}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-gov-navy hover:bg-slate-900 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-gov-teal" />
                  <span>Processing Simulation ({progressPercent}%)...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-gov-teal" />
                  <span>Simulate Analysis Run</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar during active simulation */}
      {isSimulating && (
        <div className="gov-card p-5 bg-white border border-gov-border rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gov-navy flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-gov-teal" />
              Pipeline Execution in Progress: Stage {Math.min(activeStepIndex + 1, 7)} of 7
            </span>
            <span className="font-bold text-gov-teal">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gov-navy via-gov-teal to-teal-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Section 2: Visual Processing Pipeline / Decision Flowchart */}
      <div className="gov-card p-6 bg-white border border-gov-border rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-gov-border">
          <div>
            <h2 className="text-sm font-bold text-gov-dark font-heading">
              2. Processing Pipeline Architecture
            </h2>
            <p className="text-xs text-gov-muted">
              Sequential stages from multi-document ingestion to evidence verification and audit adjudication
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('pipeline')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  viewMode === 'pipeline'
                    ? 'bg-white text-gov-navy shadow-xs'
                    : 'text-slate-600 hover:text-gov-dark'
                }`}
              >
                Pipeline View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('flowchart')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  viewMode === 'flowchart'
                    ? 'bg-white text-gov-navy shadow-xs'
                    : 'text-slate-600 hover:text-gov-dark'
                }`}
              >
                Decision Flowchart
              </button>
            </div>

            {viewMode === 'pipeline' && (
              <div className="hidden md:flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
                <span className="flex items-center gap-1 text-slate-400 ml-2">
                  <Clock className="w-3.5 h-3.5" /> Stage Ready
                </span>
              </div>
            )}
          </div>
        </div>

        {viewMode === 'flowchart' ? (
          <div className="py-2">
            <WorkflowFlowchart />
          </div>
        ) : (
          <div className="space-y-3">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            const isStepActive = activeStepIndex === idx && isSimulating;
            const isStepFinished = activeStepIndex > idx || (!isSimulating && activeStepIndex === 7);

            return (
              <div
                key={step.step}
                className={`p-3.5 rounded-xl border transition-all ${
                  isStepActive
                    ? 'border-gov-teal bg-teal-50/50 shadow-sm ring-1 ring-gov-teal/50'
                    : isStepFinished
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200 bg-slate-50/40'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        isStepActive
                          ? 'bg-gov-teal text-white animate-pulse'
                          : isStepFinished
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isStepFinished ? <Check className="w-4 h-4 stroke-[3]" /> : step.step}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gov-dark">{step.title}</span>
                        {isStepActive && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 animate-pulse">
                            Processing...
                          </span>
                        )}
                        {isStepFinished && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                            Done
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gov-muted">{step.subtitle}</p>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400">Phase {Math.min(idx + 1, 4)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Live Audit Log Terminal */}
        {simulationLogs.length > 0 && (
          <div className="mt-5 p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs border border-slate-800 space-y-1">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-gov-teal" />
                <span>Simulation Pipeline Execution Audit Log</span>
              </span>
              <span>{simulationLogs.length} events logged</span>
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1 pr-2">
              {simulationLogs.map((log, i) => (
                <div key={i} className="text-[11px] text-slate-300 leading-tight">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Analysis Results Summary Card (After Run) */}
      {analysisResult && (
        <div className="gov-card p-6 bg-white border-2 border-gov-teal rounded-xl shadow-md space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gov-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gov-dark font-heading">
                  Analysis Run Completed Successfully
                </h2>
                <p className="text-xs text-gov-muted">
                  {analysisResult.analysis.title || 'Cross-Document Comparison Analysis'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                {analysisResult.conflictsCount} Conflicts Detected
              </span>
            </div>
          </div>

          {/* Metric Summary Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xl font-bold text-gov-dark font-heading">
                {analysisResult.statementsCount}
              </div>
              <div className="text-[11px] text-gov-muted">Statements Extracted</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xl font-bold text-gov-teal font-heading">
                {analysisResult.analysis.matchedStatements}
              </div>
              <div className="text-[11px] text-gov-muted">Matched Statements</div>
            </div>

            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="text-xl font-bold text-red-700 font-heading">
                {analysisResult.conflictsCount}
              </div>
              <div className="text-[11px] text-red-700 font-semibold">Conflicts Identified</div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="text-xl font-bold text-emerald-800 font-heading">
                {analysisResult.evidenceCount}
              </div>
              <div className="text-[11px] text-emerald-800 font-semibold">Evidence Citations</div>
            </div>
          </div>

          {/* Quick Conflict Cards Preview */}
          {analysisResult.conflicts.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-gov-dark">
                <span>Discrepancies Exposed in this Run:</span>
                <span className="text-gov-muted font-normal text-[11px]">
                  Side-by-side claim comparison with confidence scores
                </span>
              </div>

              <div className="space-y-3">
                {analysisResult.conflicts.slice(0, 2).map((conflict) => (
                  <ConflictCard
                    key={conflict._id}
                    conflict={conflict}
                    onViewEvidence={() => navigate('/evidence')}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons to explore conflicts & evidence */}
          <div className="pt-4 border-t border-gov-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-gov-dark hover:bg-slate-100 rounded-lg transition-colors border border-gov-border"
            >
              Back to Dashboard
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => navigate('/evidence')}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-gov-teal bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Inspect Citations</span>
              </button>

              <button
                onClick={() => navigate('/conflicts')}
                className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-white bg-gov-navy hover:bg-slate-900 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Full Conflicts Explorer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={(newDoc) => {
          setDocuments((prev) => [newDoc, ...prev]);
          setSelectedDocs((prev) => [...prev, newDoc._id]);
        }}
      />
    </div>
  );
};

export default AnalysisPage;
