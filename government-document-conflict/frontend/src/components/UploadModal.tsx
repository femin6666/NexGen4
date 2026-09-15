import React, { useState, useRef } from 'react';
import { X, UploadCloud, File, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { DocumentItem } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (doc: DocumentItem) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('Government Order');
  const [department, setDepartment] = useState('Department of Higher Education');
  const [documentDate, setDocumentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const allowedExtensions = ['.pdf', '.docx', '.txt'];

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setErrorMessage(`Invalid file format '${ext}'. Only PDF, DOCX, and TXT files are accepted.`);
      return false;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 25MB limit.');
      return false;
    }

    setSelectedFile(file);
    if (!title) {
      const suggestedTitle = file.name.substring(0, file.name.lastIndexOf('.')).replace(/[_-]/g, ' ');
      setTitle(suggestedTitle);
    }
    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Please choose or drag a file to upload.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title.trim() || selectedFile.name);
    formData.append('documentType', documentType);
    formData.append('department', department.trim() || 'General Administration');
    if (documentDate) {
      formData.append('documentDate', documentDate);
    }

    try {
      const newDoc = await api.uploadDocument(formData);
      setIsUploading(false);
      onUploadSuccess(newDoc);
      onClose();
    } catch (err: any) {
      setIsUploading(false);
      let detail = err.response?.data?.detail;
      if (!detail) {
        if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
          detail = 'Backend Unavailable: Could not reach the API at http://localhost:8000. Please ensure the backend server is running.';
        } else {
          detail = err.message || 'Failed to upload document.';
        }
      }
      setErrorMessage(detail);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="bg-white border border-gov-border rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gov-border bg-slate-50/50">
          <div>
            <h3 className="font-semibold text-gov-dark font-heading text-lg">Upload Government Document</h3>
            <p className="text-xs text-gov-muted">Add official orders, circulars, or policy documents for comparison</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gov-muted hover:text-gov-dark hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error notification */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-gov-teal bg-teal-50/30'
                : selectedFile
                ? 'border-emerald-300 bg-emerald-50/20'
                : 'border-slate-300 hover:border-gov-navy bg-slate-50/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  validateAndSetFile(e.target.files[0]);
                }
              }}
            />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-2 text-emerald-800">
                <div className="p-2.5 rounded-full bg-emerald-100">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-sm font-semibold truncate max-w-xs">{selectedFile.name}</div>
                <div className="text-xs text-slate-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB — Click or drop another to replace
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-600">
                <div className="p-2.5 rounded-full bg-slate-100">
                  <UploadCloud className="w-6 h-6 text-gov-navy" />
                </div>
                <div className="text-sm font-medium">
                  <span className="font-semibold text-gov-teal">Click to browse</span> or drag & drop documents here
                </div>
                <div className="text-xs text-gov-muted">
                  Supported formats: <strong>PDF, DOCX, TXT</strong> (up to 25MB)
                </div>
              </div>
            )}
          </div>

          {/* Metadata Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gov-dark mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Government Order 2024 - Higher Education Grant"
                className="w-full text-xs px-3 py-2 border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-teal/20 focus:border-gov-teal bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gov-dark mb-1">
                  Document Type
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-teal/20 focus:border-gov-teal bg-white"
                >
                  <option value="Government Order">Government Order</option>
                  <option value="Government Policy">Government Policy</option>
                  <option value="Government Notification">Government Notification</option>
                  <option value="Government Circular">Government Circular</option>
                  <option value="Government Guidelines">Government Guidelines</option>
                  <option value="Government Reports">Government Reports</option>
                  <option value="Rules and Regulations">Rules and Regulations</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gov-dark mb-1">
                  Document Date
                </label>
                <input
                  type="date"
                  value={documentDate}
                  onChange={(e) => setDocumentDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-teal/20 focus:border-gov-teal bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gov-dark mb-1">
                Issuing Department / Ministry
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Ministry of Education, State Administration"
                className="w-full text-xs px-3 py-2 border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-teal/20 focus:border-gov-teal bg-white"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gov-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gov-muted hover:text-gov-dark rounded-lg border border-gov-border hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="px-4 py-2 text-xs font-semibold text-white bg-gov-navy hover:bg-slate-900 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving & Registering...
                </>
              ) : (
                'Upload & Save Metadata'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
