import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Clock
} from 'lucide-react';
import { ReportItem } from '../types';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gov-dark font-heading">
            Analysis Reports
          </h1>
          <p className="text-xs text-gov-muted mt-1">
            Exportable compliance dossiers and verification audits documenting conflicting policy clauses.
          </p>
        </div>

        <button
          onClick={() => alert('Report generation will be active in upcoming Phase 4 with full evidence dossiers.')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gov-navy hover:bg-slate-900 rounded-lg shadow-xs transition-colors"
        >
          <FileBarChart className="w-3.5 h-3.5" />
          <span>Generate Audit Report</span>
        </button>
      </div>

      {/* Reports Table / Card */}
      <div className="gov-card bg-white border border-gov-border rounded-xl overflow-hidden">
        {reports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-gov-dark uppercase font-semibold border-b border-gov-border">
                <tr>
                  <th className="py-3 px-4">Report Name</th>
                  <th className="py-3 px-4">Documents Included</th>
                  <th className="py-3 px-4">Conflicts</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-border">
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3.5 px-4 font-semibold text-gov-dark">{r.reportName}</td>
                    <td className="py-3.5 px-4 text-gov-muted">{r.documents.join(', ')}</td>
                    <td className="py-3.5 px-4">{r.conflicts}</td>
                    <td className="py-3.5 px-4 text-gov-muted">{r.createdDate}</td>
                    <td className="py-3.5 px-4">{r.status}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-xs text-gov-teal font-semibold">Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State for Phase 1 */
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <div className="p-3.5 rounded-full bg-slate-100 text-slate-400 mb-3">
              <FileBarChart className="w-8 h-8 text-gov-muted" />
            </div>
            <h3 className="text-sm font-semibold text-gov-dark mb-1">
              No reports generated yet.
            </h3>
            <p className="text-xs text-gov-muted max-w-sm mb-4 leading-relaxed">
              Dossiers and official verification summaries will be automatically compiled once multi-document conflict analysis is executed.
            </p>
            <div className="text-[11px] text-slate-400 font-medium px-3 py-1 bg-slate-50 rounded border border-slate-200">
              Scheduled for Phase 4 Report Generator
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
