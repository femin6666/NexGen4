import React, { useState } from 'react';
import {
  UploadCloud,
  FileSearch,
  ListTree,
  GitMerge,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Columns,
  BookOpen,
  UserCheck,
  ArrowDown,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface NodeInfo {
  id: string;
  title: string;
  subtitle: string;
  details: string;
  stage: string;
}

export const WorkflowFlowchart: React.FC<{ interactive?: boolean; className?: string }> = ({
  interactive = true,
  className = ''
}) => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodeDescriptions: Record<string, NodeInfo> = {
    upload: {
      id: 'upload',
      title: 'UPLOAD DOCUMENTS',
      subtitle: 'Multi-Format Ingestion',
      details: 'Ingests multiple government orders, notifications, circulars, and policies (PDF, DOCX, TXT) across departments and fiscal dates.',
      stage: 'Stage 1 — Ingestion'
    },
    ocr: {
      id: 'ocr',
      title: 'OCR / TEXT EXTRACTION',
      subtitle: 'Layout & Text Parsing',
      details: 'Extracts full textual layers and structural clauses while preserving legal formatting, section numbers, and page mappings.',
      stage: 'Stage 2 — Text Extraction'
    },
    statement: {
      id: 'statement',
      title: 'STATEMENT EXTRACTION',
      subtitle: 'Atomic Claim Deconstruction',
      details: 'Isolates distinct regulatory assertions into structured triples (Subject, Attribute, Value, Condition) such as eligibility ages or fund allocations.',
      stage: 'Stage 3 — Knowledge Formulation'
    },
    semantic: {
      id: 'semantic',
      title: 'SEMANTIC MATCHING',
      subtitle: 'Cross-Document Topic Alignment',
      details: 'Identifies statements across different official documents that address the exact same policy subject, even with differing phrasing.',
      stage: 'Stage 4 — Alignment'
    },
    conflict: {
      id: 'conflict',
      title: 'CONFLICT DETECTION',
      subtitle: 'Contradiction & Divergence Engine',
      details: 'Evaluates aligned claims for direct contradictions, numeric divergence, conflicting dates, or altered policy conditions.',
      stage: 'Stage 5 — Comparison Decision'
    },
    consistent: {
      id: 'consistent',
      title: 'CONSISTENT',
      subtitle: 'Concordant Policy Clause',
      details: 'Statements are harmonious and share identical mandates. No legal or procedural tension detected between documents.',
      stage: 'Branch A — Concordance'
    },
    verified: {
      id: 'verified',
      title: 'Verified',
      subtitle: 'Policy Harmonization Audit Passed',
      details: 'Document pair confirmed consistent on this subject. Logged into audit records as verified without manual intervention required.',
      stage: 'Terminal State A'
    },
    conflict_branch: {
      id: 'conflict_branch',
      title: 'CONFLICT',
      subtitle: 'Contradiction Detected',
      details: 'Discrepancy confirmed between official mandates (e.g. conflicting age limits, differing scholarship caps, or contradictory deadlines).',
      stage: 'Branch B — Divergence'
    },
    side_by_side: {
      id: 'side_by_side',
      title: 'Side-by-Side View',
      subtitle: 'Comparative Visual Analysis',
      details: 'Renders both conflicting official statements juxtaposed side-by-side with semantic divergence highlights and severity meters.',
      stage: 'Stage 6 — Resolution UI'
    },
    source_page: {
      id: 'source_page',
      title: 'Source + Page',
      subtitle: 'Strict Evidentiary Grounding',
      details: 'Extracts exact source document title, published gazette date, page number, and verbatim clause citation for total legal auditability.',
      stage: 'Stage 7 — Evidence Grounding'
    },
    user_verification: {
      id: 'user_verification',
      title: 'User Verification',
      subtitle: 'Human-in-the-Loop Adjudication',
      details: 'Compliance officers and legal analysts inspect verified evidence, adjudicate prevailing authority, and export explainable audit dossiers.',
      stage: 'Final Milestone — Audit Dossier'
    }
  };

  const currentInfo = activeNode ? nodeDescriptions[activeNode] : null;

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      <div className="bg-white border border-gov-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-gov-border pb-4 mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-gov-teal">System Architecture</span>
            <h3 className="text-lg font-bold text-gov-dark font-heading">
              End-to-End Verification Pipeline
            </h3>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gov-muted bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Info className="w-3.5 h-3.5 text-gov-teal" />
            <span>Hover or tap any step for details</span>
          </div>
        </div>

        {/* Vertical Pipeline Flow */}
        <div className="flex flex-col items-center select-none">
          {/* 1. UPLOAD DOCUMENTS */}
          <div
            onMouseEnter={() => interactive && setActiveNode('upload')}
            onClick={() => interactive && setActiveNode('upload')}
            className={`cursor-pointer transition-all duration-200 w-64 px-4 py-3 rounded-xl border text-center font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-xs ${
              activeNode === 'upload'
                ? 'bg-gov-navy text-white border-gov-navy ring-2 ring-gov-navy/20 scale-102'
                : 'bg-slate-50 hover:bg-slate-100 text-gov-dark border-slate-300'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-gov-teal" />
            <span>UPLOAD DOCUMENTS</span>
          </div>

          <div className="flex flex-col items-center my-1 text-slate-400">
            <div className="w-0.5 h-4 bg-slate-300"></div>
            <ArrowDown className="w-3.5 h-3.5 -mt-1 text-slate-400" />
          </div>

          {/* 2. OCR / TEXT EXTRACTION */}
          <div
            onMouseEnter={() => interactive && setActiveNode('ocr')}
            onClick={() => interactive && setActiveNode('ocr')}
            className={`cursor-pointer transition-all duration-200 w-64 px-4 py-3 rounded-xl border text-center font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-xs ${
              activeNode === 'ocr'
                ? 'bg-gov-navy text-white border-gov-navy ring-2 ring-gov-navy/20 scale-102'
                : 'bg-slate-50 hover:bg-slate-100 text-gov-dark border-slate-300'
            }`}
          >
            <FileSearch className="w-4 h-4 text-indigo-500" />
            <span>OCR / TEXT EXTRACTION</span>
          </div>

          <div className="flex flex-col items-center my-1 text-slate-400">
            <div className="w-0.5 h-4 bg-slate-300"></div>
            <ArrowDown className="w-3.5 h-3.5 -mt-1 text-slate-400" />
          </div>

          {/* 3. STATEMENT EXTRACTION */}
          <div
            onMouseEnter={() => interactive && setActiveNode('statement')}
            onClick={() => interactive && setActiveNode('statement')}
            className={`cursor-pointer transition-all duration-200 w-64 px-4 py-3 rounded-xl border text-center font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-xs ${
              activeNode === 'statement'
                ? 'bg-gov-navy text-white border-gov-navy ring-2 ring-gov-navy/20 scale-102'
                : 'bg-slate-50 hover:bg-slate-100 text-gov-dark border-slate-300'
            }`}
          >
            <ListTree className="w-4 h-4 text-sky-500" />
            <span>STATEMENT EXTRACTION</span>
          </div>

          <div className="flex flex-col items-center my-1 text-slate-400">
            <div className="w-0.5 h-4 bg-slate-300"></div>
            <ArrowDown className="w-3.5 h-3.5 -mt-1 text-slate-400" />
          </div>

          {/* 4. SEMANTIC MATCHING */}
          <div
            onMouseEnter={() => interactive && setActiveNode('semantic')}
            onClick={() => interactive && setActiveNode('semantic')}
            className={`cursor-pointer transition-all duration-200 w-64 px-4 py-3 rounded-xl border text-center font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-xs ${
              activeNode === 'semantic'
                ? 'bg-gov-navy text-white border-gov-navy ring-2 ring-gov-navy/20 scale-102'
                : 'bg-slate-50 hover:bg-slate-100 text-gov-dark border-slate-300'
            }`}
          >
            <GitMerge className="w-4 h-4 text-gov-teal" />
            <span>SEMANTIC MATCHING</span>
          </div>

          <div className="flex flex-col items-center my-1 text-slate-400">
            <div className="w-0.5 h-4 bg-slate-300"></div>
            <ArrowDown className="w-3.5 h-3.5 -mt-1 text-slate-400" />
          </div>

          {/* 5. CONFLICT DETECTION */}
          <div
            onMouseEnter={() => interactive && setActiveNode('conflict')}
            onClick={() => interactive && setActiveNode('conflict')}
            className={`cursor-pointer transition-all duration-200 w-64 px-4 py-3 rounded-xl border text-center font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-xs ${
              activeNode === 'conflict'
                ? 'bg-gov-navy text-white border-gov-navy ring-2 ring-gov-navy/20 scale-102'
                : 'bg-amber-50 hover:bg-amber-100/70 text-amber-900 border-amber-300'
            }`}
          >
            <Scale className="w-4 h-4 text-amber-600" />
            <span>CONFLICT DETECTION</span>
          </div>

          {/* Branching Connector Fork */}
          <div className="w-full max-w-md flex flex-col items-center my-2">
            {/* Center stem down */}
            <div className="w-0.5 h-4 bg-slate-300"></div>
            {/* Horizontal bar spanning both branches */}
            <div className="w-[70%] sm:w-[65%] h-0.5 bg-slate-300 relative">
              {/* Left drop */}
              <div className="absolute left-0 top-0 w-0.5 h-4 bg-slate-300"></div>
              {/* Right drop */}
              <div className="absolute right-0 top-0 w-0.5 h-4 bg-slate-300"></div>
            </div>
          </div>

          {/* Two Branches: CONSISTENT vs CONFLICT */}
          <div className="w-full max-w-lg grid grid-cols-2 gap-4 sm:gap-10 pt-1">
            {/* LEFT BRANCH: CONSISTENT */}
            <div className="flex flex-col items-center">
              <div
                onMouseEnter={() => interactive && setActiveNode('consistent')}
                onClick={() => interactive && setActiveNode('consistent')}
                className={`cursor-pointer transition-all duration-200 w-full max-w-[170px] px-3 py-2.5 rounded-xl border text-center font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-xs ${
                  activeNode === 'consistent'
                    ? 'bg-emerald-700 text-white border-emerald-700 ring-2 ring-emerald-600/20 scale-102'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>CONSISTENT</span>
              </div>

              <div className="flex flex-col items-center my-1 text-slate-400">
                <div className="w-0.5 h-4 bg-slate-300"></div>
                <ArrowDown className="w-3.5 h-3.5 -mt-1 text-slate-400" />
              </div>

              {/* Verified Terminal */}
              <div
                onMouseEnter={() => interactive && setActiveNode('verified')}
                onClick={() => interactive && setActiveNode('verified')}
                className={`cursor-pointer transition-all duration-200 w-full max-w-[170px] px-3 py-2.5 rounded-xl border text-center font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs ${
                  activeNode === 'verified'
                    ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified</span>
              </div>
            </div>

            {/* RIGHT BRANCH: CONFLICT */}
            <div className="flex flex-col items-center">
              <div
                onMouseEnter={() => interactive && setActiveNode('conflict_branch')}
                onClick={() => interactive && setActiveNode('conflict_branch')}
                className={`cursor-pointer transition-all duration-200 w-full max-w-[170px] px-3 py-2.5 rounded-xl border text-center font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-xs ${
                  activeNode === 'conflict_branch'
                    ? 'bg-red-700 text-white border-red-700 ring-2 ring-red-600/20 scale-102'
                    : 'bg-red-50 hover:bg-red-100 text-red-800 border-red-300'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>CONFLICT</span>
              </div>

              <div className="flex flex-col items-center my-1 text-slate-400">
                <div className="w-0.5 h-4 bg-slate-300"></div>
                <ArrowDown className="w-3.5 h-3.5 -mt-1 text-slate-400" />
              </div>

              {/* Side-by-Side View */}
              <div
                onMouseEnter={() => interactive && setActiveNode('side_by_side')}
                onClick={() => interactive && setActiveNode('side_by_side')}
                className={`cursor-pointer transition-all duration-200 w-full max-w-[170px] px-3 py-2.5 rounded-xl border text-center font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs ${
                  activeNode === 'side_by_side'
                    ? 'bg-gov-navy text-white border-gov-navy ring-2 ring-gov-navy/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-gov-dark border-slate-300'
                }`}
              >
                <Columns className="w-3.5 h-3.5 text-gov-teal" />
                <span>Side-by-Side View</span>
              </div>

              <div className="flex flex-col items-center my-1 text-slate-400">
                <div className="w-0.5 h-4 bg-slate-300"></div>
                <ArrowDown className="w-3.5 h-3.5 -mt-1 text-slate-400" />
              </div>

              {/* Source + Page */}
              <div
                onMouseEnter={() => interactive && setActiveNode('source_page')}
                onClick={() => interactive && setActiveNode('source_page')}
                className={`cursor-pointer transition-all duration-200 w-full max-w-[170px] px-3 py-2.5 rounded-xl border text-center font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs ${
                  activeNode === 'source_page'
                    ? 'bg-gov-navy text-white border-gov-navy ring-2 ring-gov-navy/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-gov-dark border-slate-300'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>Source + Page</span>
              </div>

              <div className="flex flex-col items-center my-1 text-slate-400">
                <div className="w-0.5 h-4 bg-slate-300"></div>
                <ArrowDown className="w-3.5 h-3.5 -mt-1 text-slate-400" />
              </div>

              {/* User Verification */}
              <div
                onMouseEnter={() => interactive && setActiveNode('user_verification')}
                onClick={() => interactive && setActiveNode('user_verification')}
                className={`cursor-pointer transition-all duration-200 w-full max-w-[170px] px-3 py-2.5 rounded-xl border text-center font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs ${
                  activeNode === 'user_verification'
                    ? 'bg-gov-navy text-white border-gov-navy ring-2 ring-gov-navy/20'
                    : 'bg-teal-50 hover:bg-teal-100 text-gov-teal border-teal-300 font-bold'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-gov-teal" />
                <span>User Verification</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Info Card */}
        <div className="mt-8 pt-6 border-t border-gov-border">
          {currentInfo ? (
            <div className="bg-slate-50 border border-gov-border rounded-xl p-4 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-gov-teal uppercase tracking-wider">
                  {currentInfo.stage}
                </span>
                <span className="text-[11px] font-semibold text-gov-muted">
                  {currentInfo.subtitle}
                </span>
              </div>
              <h4 className="text-sm font-bold text-gov-dark mb-1 font-heading">
                {currentInfo.title}
              </h4>
              <p className="text-xs text-gov-muted leading-relaxed">
                {currentInfo.details}
              </p>
            </div>
          ) : (
            <div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-gov-navy">Interactive Architecture:</span> Select or hover any stage above to inspect how GovVerify processes government documents and verifies evidence.
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link
              to="/analysis"
              className="inline-flex items-center gap-1.5 font-semibold text-gov-navy hover:text-gov-teal transition-colors"
            >
              <span>Explore Analysis Pipeline</span>
              <span>&rarr;</span>
            </Link>
            <span className="text-slate-300">&bull;</span>
            <Link
              to="/conflicts"
              className="inline-flex items-center gap-1.5 font-semibold text-gov-navy hover:text-gov-teal transition-colors"
            >
              <span>Inspect Side-by-Side Conflicts</span>
              <span>&rarr;</span>
            </Link>
            <span className="text-slate-300">&bull;</span>
            <Link
              to="/evidence"
              className="inline-flex items-center gap-1.5 font-semibold text-gov-navy hover:text-gov-teal transition-colors"
            >
              <span>Verify Source Citations</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
