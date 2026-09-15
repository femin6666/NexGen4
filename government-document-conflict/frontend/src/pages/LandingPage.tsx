import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { WorkflowFlowchart } from '../components/WorkflowFlowchart';
import {
  FileText,
  Search,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Scale,
  Cpu,
  FileCheck2,
  Sparkles,
  GitBranch,
  Eye
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gov-bg flex flex-col selection:bg-teal-100 selection:text-teal-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-gov-border bg-gradient-to-b from-white to-[#F8F9F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            {/* System Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300/80 text-xs font-semibold text-gov-navy mb-6 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-gov-teal" />
              <span>Document Intelligence & Verification Platform</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gov-teal"></span>
              <span className="text-slate-500 font-normal">Phase 1 Foundation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gov-dark tracking-tight leading-[1.15] mb-6 font-heading">
              Detect Conflicts. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gov-navy via-gov-teal to-teal-700">
                Verify the Evidence.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Analyze multiple government documents, identify conflicting statements, and trace every discrepancy back to its verified page, section, and original source citation.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gov-navy text-white text-sm font-semibold hover:bg-slate-900 transition-all shadow-sm flex items-center justify-center gap-2 group"
              >
                <span>Analyze Documents</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white border border-gov-border text-gov-dark text-sm font-semibold hover:bg-slate-50 transition-colors shadow-xs"
              >
                See How It Works
              </a>
            </div>
          </div>

          {/* End-to-End System Architecture Flowchart (User Workflow Diagram) */}
          <div className="mt-10">
            <WorkflowFlowchart />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white border-b border-gov-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-gov-teal uppercase">Methodology</span>
            <h2 className="text-3xl font-extrabold text-gov-dark mt-2 mb-4 font-heading">
              Four Stages of Evidence Verification
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Designed for compliance officers, legal analysts, and administrative bodies to audit overlapping policy mandates with verifiable precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stage 1 */}
            <div className="p-6 rounded-xl border border-gov-border bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="text-3xl font-extrabold text-slate-300 font-heading mb-3">01</div>
              <h3 className="text-base font-bold text-gov-dark mb-2 font-heading">Upload Documents</h3>
              <p className="text-xs text-gov-muted leading-relaxed mb-4">
                Upload multiple official documents related to the same topic (PDF, DOCX, TXT) across departments or fiscal years.
              </p>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active in Phase 1</span>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="p-6 rounded-xl border border-gov-border bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="text-3xl font-extrabold text-slate-300 font-heading mb-3">02</div>
              <h3 className="text-base font-bold text-gov-dark mb-2 font-heading">Extract Statements</h3>
              <p className="text-xs text-gov-muted leading-relaxed mb-4">
                The system parses each section and extracts atomic claims, requirements, dates, amounts, and conditions.
              </p>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                <Sparkles className="w-3 h-3 text-slate-400" />
                <span>Phase 2 NLP Pipeline</span>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="p-6 rounded-xl border border-gov-border bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="text-3xl font-extrabold text-slate-300 font-heading mb-3">03</div>
              <h3 className="text-base font-bold text-gov-dark mb-2 font-heading">Detect Conflicts</h3>
              <p className="text-xs text-gov-muted leading-relaxed mb-4">
                Compares semantically related statements across documents to flag numerical, temporal, and conditional contradictions.
              </p>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                <Sparkles className="w-3 h-3 text-slate-400" />
                <span>Phase 3 Conflict Engine</span>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="p-6 rounded-xl border border-gov-border bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="text-3xl font-extrabold text-slate-300 font-heading mb-3">04</div>
              <h3 className="text-base font-bold text-gov-dark mb-2 font-heading">Verify Evidence</h3>
              <p className="text-xs text-gov-muted leading-relaxed mb-4">
                Every detected conflict links directly to both source documents with page numbers, exact sections, and verbatim quotes.
              </p>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                <Sparkles className="w-3 h-3 text-slate-400" />
                <span>Phase 4 Verification</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-[#F8F9F7] border-b border-gov-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-gov-teal uppercase">Capabilities</span>
            <h2 className="text-3xl font-extrabold text-gov-dark mt-2 mb-4 font-heading">
              Engineered for Legal & Regulatory Precision
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Exposing disagreements instead of smoothing them over, ensuring complete regulatory integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="gov-card p-6 bg-white border border-gov-border rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-gov-teal">
                  <GitBranch className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gov-dark font-heading">
                  Semantic Statement Matching
                </h3>
              </div>
              <p className="text-xs text-gov-muted leading-relaxed mb-4">
                Identifies statements discussing the same regulatory concept even when drafted with varying legal terminology, synonyms, or differing sentence structure.
              </p>
              <div className="text-xs text-slate-500 font-mono bg-slate-50 p-2.5 rounded border border-slate-200">
                Matches: "Gross annual income" ⟷ "Parental earnings ceiling"
              </div>
            </div>

            {/* Feature 2 */}
            <div className="gov-card p-6 bg-white border border-gov-border rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-gov-orange">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gov-dark font-heading">
                  Multi-Dimensional Conflict Detection
                </h3>
              </div>
              <p className="text-xs text-gov-muted leading-relaxed mb-4">
                Classifies and categorizes discrepancies with specific domain taxonomies:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span className="px-2 py-1 bg-slate-100 rounded text-slate-700">🔴 Numeric Conflicts</span>
                <span className="px-2 py-1 bg-slate-100 rounded text-slate-700">🔴 Date & Deadline Clashes</span>
                <span className="px-2 py-1 bg-slate-100 rounded text-slate-700">🟠 Conditional Differences</span>
                <span className="px-2 py-1 bg-slate-100 rounded text-slate-700">🔵 Policy Version Updates</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="gov-card p-6 bg-white border border-gov-border rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gov-dark font-heading">
                  Verifiable Evidence Citation
                </h3>
              </div>
              <p className="text-xs text-gov-muted leading-relaxed mb-4">
                Never produces an unverified summary statement. For every difference found, the interface displays:
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pl-4 list-disc">
                <li>Exact issuing department and document name</li>
                <li>Verified page number and specific section heading</li>
                <li>Verbatim statement text alongside opposing claim</li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="gov-card p-6 bg-white border border-gov-border rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-300 text-gov-navy">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gov-dark font-heading">
                  Explainable Verification Reports
                </h3>
              </div>
              <p className="text-xs text-gov-muted leading-relaxed mb-4">
                Provides concise, audited reasoning explaining why two statements were classified as contradictory, distinguishing between outright violations and conditional exceptions.
              </p>
              <div className="text-xs text-slate-500 font-mono bg-slate-50 p-2.5 rounded border border-slate-200">
                Confidence Score • Severity Rating • Explanatory Context
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gov-navy text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold mb-4 font-heading">
            Audit Government Documents with Traceability
          </h2>
          <p className="text-sm text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
            Begin by managing your official document repository and monitoring conflict detection benchmarks.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gov-teal text-white text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm"
          >
            <span>Open GovVerify Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
