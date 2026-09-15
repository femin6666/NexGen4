import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Shield,
  Database,
  FileCheck,
  CheckCircle2,
  HelpCircle,
  Cpu
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [threshold, setThreshold] = useState('0.85');
  const [autoFlagPolicyChanges, setAutoFlagPolicyChanges] = useState(true);
  const [strictAgeVerification, setStrictAgeVerification] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('Preferences saved successfully for this session.');
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gov-dark font-heading">
          System Settings
        </h1>
        <p className="text-xs text-gov-muted mt-1">
          Configure analysis sensitivity, threshold parameters, and document audit policies.
        </p>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Application Settings */}
        <div className="gov-card p-6 bg-white border border-gov-border rounded-xl">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gov-border">
            <Settings className="w-4 h-4 text-gov-teal" />
            <h2 className="text-sm font-bold text-gov-dark font-heading">
              Application Settings
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gov-dark">Environment Deployment</div>
                <div className="text-gov-muted">Current running development phase mode</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-100 font-semibold text-slate-700 border border-slate-200">
                Phase 1 — Project Foundation
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <div className="font-semibold text-gov-dark">Audit Trail Logging</div>
                <div className="text-gov-muted">Track all user uploads and cross-comparisons in system logs</div>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-gov-teal focus:ring-gov-teal"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Analysis Preferences */}
        <div className="gov-card p-6 bg-white border border-gov-border rounded-xl">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gov-border">
            <Sliders className="w-4 h-4 text-gov-orange" />
            <h2 className="text-sm font-bold text-gov-dark font-heading">
              Analysis Preferences
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-gov-dark">
                  Semantic Similarity Threshold ({threshold})
                </label>
                <span className="text-slate-400">Default: 0.85</span>
              </div>
              <input
                type="range"
                min="0.50"
                max="0.99"
                step="0.01"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-teal"
              />
              <div className="text-[11px] text-gov-muted mt-1">
                Cosine cutoff for pairing claims across documents before NLI evaluation.
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <div className="font-semibold text-gov-dark">Auto-flag Temporal Policy Changes</div>
                <div className="text-gov-muted">Treat discrepancies between chronological document versions as policy updates</div>
              </div>
              <input
                type="checkbox"
                checked={autoFlagPolicyChanges}
                onChange={(e) => setAutoFlagPolicyChanges(e.target.checked)}
                className="w-4 h-4 rounded text-gov-teal focus:ring-gov-teal"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <div className="font-semibold text-gov-dark">Strict Numerical Threshold Comparison</div>
                <div className="text-gov-muted">Flag differing currency amounts and age criteria as High Severity</div>
              </div>
              <input
                type="checkbox"
                checked={strictAgeVerification}
                onChange={(e) => setStrictAgeVerification(e.target.checked)}
                className="w-4 h-4 rounded text-gov-teal focus:ring-gov-teal"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Document Settings */}
        <div className="gov-card p-6 bg-white border border-gov-border rounded-xl">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gov-border">
            <FileCheck className="w-4 h-4 text-gov-navy" />
            <h2 className="text-sm font-bold text-gov-dark font-heading">
              Document Settings
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gov-dark">Accepted Ingestion Formats</div>
                <div className="text-gov-muted">File types allowed in upload pipeline</div>
              </div>
              <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                .pdf, .docx, .txt
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <div className="font-semibold text-gov-dark">Maximum File Size Limit</div>
                <div className="text-gov-muted">Upper limit per document upload</div>
              </div>
              <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                25 Megabytes (MB)
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-gov-navy hover:bg-slate-900 rounded-lg shadow-xs transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
