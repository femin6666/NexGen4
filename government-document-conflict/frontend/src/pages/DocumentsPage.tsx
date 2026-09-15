import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Upload,
  Search,
  Filter,
  Trash2,
  Calendar,
  Building,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  GitCompare,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { DocumentItem } from '../types';
import { UploadModal } from '../components/UploadModal';

export const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();

    const handleDataChanged = () => fetchDocuments();
    window.addEventListener('govverify:data-changed', handleDataChanged);
    return () => window.removeEventListener('govverify:data-changed', handleDataChanged);
  }, []);

  const handleDeleteDocument = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await api.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d._id !== id));
      setActionFeedback(`Document "${title}" removed successfully.`);
      setTimeout(() => setActionFeedback(null), 3500);
    } catch (err) {
      alert('Failed to delete document.');
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || doc.documentType === selectedType;
    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'analyzed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'uploaded':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gov-dark font-heading">
            Government Documents
          </h1>
          <p className="text-xs text-gov-muted mt-1">
            Manage official gazettes, orders, policies, notifications, and circulars in the audit repository.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDocuments}
            title="Refresh list"
            className="p-2 text-xs font-semibold text-gov-muted hover:text-gov-dark bg-white border border-gov-border rounded-lg shadow-xs transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => navigate('/analysis')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gov-teal bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg shadow-xs transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Analyze in Pipeline</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gov-navy hover:bg-slate-900 rounded-lg shadow-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Documents</span>
          </button>
        </div>
      </div>

      {/* Feedback notice */}
      {actionFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="gov-card p-4 bg-white border border-gov-border rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title, department, or filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-teal/20 focus:border-gov-teal"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-gov-muted">Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-gov-border rounded-lg focus:outline-none focus:border-gov-teal bg-white"
          >
            <option value="ALL">All Categories</option>
            <option value="Government Order">Government Order</option>
            <option value="Government Policy">Government Policy</option>
            <option value="Government Notification">Government Notification</option>
            <option value="Government Circular">Government Circular</option>
            <option value="Government Guidelines">Government Guidelines</option>
            <option value="Rules and Regulations">Rules and Regulations</option>
          </select>
        </div>
      </div>

      {/* Document Table */}
      <div className="gov-card bg-white border border-gov-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-gov-muted">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gov-teal" />
            Loading repository documents...
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-gov-dark uppercase font-semibold border-b border-gov-border">
                <tr>
                  <th className="py-3 px-4">Document Name</th>
                  <th className="py-3 px-4">Document Type</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Document Date</th>
                  <th className="py-3 px-4 text-center">Pages</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Uploaded At</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-border">
                {filteredDocuments.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gov-dark">
                      <div className="flex items-start gap-2.5">
                        <FileText className="w-4 h-4 text-gov-navy shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold">{doc.title}</span>
                            {doc.isDemo && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                DEMO
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {doc.fileName} {doc.fileSize ? `(${Math.round(doc.fileSize / 1024)} KB)` : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gov-dark font-medium">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {doc.documentType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gov-muted font-medium">
                      {doc.department}
                    </td>
                    <td className="py-3.5 px-4 text-gov-muted whitespace-nowrap">
                      {doc.documentDate || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-gov-dark">
                      {doc.pageCount || 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border capitalize ${getStatusBadge(doc.status)}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gov-muted whitespace-nowrap">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/evidence?documentId=${doc._id}`)}
                          className="px-2.5 py-1 rounded bg-slate-100 text-gov-navy hover:bg-slate-200 border border-slate-200 text-xs font-semibold transition-colors flex items-center gap-1"
                          title="View Verified Evidence for this Document"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-gov-teal" />
                          <span>Evidence</span>
                        </button>
                        <button
                          onClick={() => navigate('/analysis')}
                          className="px-2.5 py-1 rounded bg-teal-50 text-gov-teal hover:bg-teal-100 border border-teal-200 text-xs font-semibold transition-colors flex items-center gap-1"
                          title="Compare in Analysis Pipeline"
                        >
                          <GitCompare className="w-3.5 h-3.5" />
                          <span>Compare</span>
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc._id, doc.title)}
                          className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty state */
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <div className="p-3.5 rounded-full bg-slate-100 text-slate-400 mb-3">
              <FileText className="w-8 h-8 text-gov-muted" />
            </div>
            <h3 className="text-sm font-semibold text-gov-dark mb-1">
              No government documents found.
            </h3>
            <p className="text-xs text-gov-muted max-w-sm mb-4 leading-relaxed">
              {searchQuery || selectedType !== 'ALL'
                ? 'No documents matched your current search filters.'
                : 'Upload PDF, DOCX, or TXT documents to start building the regulatory comparison corpus.'}
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-gov-navy hover:bg-slate-900 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={(newDoc) => {
          setDocuments((prev) => [newDoc, ...prev]);
          setActionFeedback(`Successfully uploaded "${newDoc.title}". Metadata stored.`);
          setTimeout(() => setActionFeedback(null), 4000);
        }}
      />
    </div>
  );
};

export default DocumentsPage;
