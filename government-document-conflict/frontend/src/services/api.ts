import axios from 'axios';
import {
  HealthStatus,
  DocumentItem,
  ConflictItem,
  EvidenceItem,
  StatementItem,
  AnalysisItem,
  AnalysisRunResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
  },
});

export const api = {
  // Health
  getHealth: async (): Promise<HealthStatus> => {
    try {
      const res = await client.get<HealthStatus>('/api/health');
      return res.data;
    } catch (err: any) {
      return {
        status: 'error',
        database: 'disconnected',
        details: { error: err.message || 'Network error' },
      };
    }
  },

  // Documents
  getDocuments: async (): Promise<DocumentItem[]> => {
    const res = await client.get<DocumentItem[]>('/api/documents');
    return res.data;
  },

  getDocument: async (id: string): Promise<DocumentItem> => {
    const res = await client.get<DocumentItem>(`/api/documents/${id}`);
    return res.data;
  },

  uploadDocument: async (formData: FormData): Promise<DocumentItem> => {
    const res = await client.post<DocumentItem>('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  deleteDocument: async (id: string): Promise<{ message: string; id: string }> => {
    const res = await client.delete(`/api/documents/${id}`);
    return res.data;
  },

  // Conflicts
  getConflicts: async (conflictType?: string): Promise<ConflictItem[]> => {
    const params = conflictType && conflictType !== 'ALL' ? { conflict_type: conflictType } : {};
    const res = await client.get<ConflictItem[]>('/api/conflicts', { params });
    return res.data;
  },

  // Evidence
  getEvidence: async (filters?: {
    conflictId?: string;
    documentId?: string;
    analysisId?: string;
    isDemo?: boolean;
  } | string): Promise<EvidenceItem[]> => {
    const params: Record<string, any> = {};
    if (typeof filters === 'string') {
      params.conflict_id = filters;
    } else if (filters) {
      if (filters.conflictId) params.conflict_id = filters.conflictId;
      if (filters.documentId) params.document_id = filters.documentId;
      if (filters.analysisId) params.analysis_id = filters.analysisId;
      if (filters.isDemo !== undefined) params.is_demo = filters.isDemo;
    }
    const res = await client.get<EvidenceItem[]>('/api/evidence', { params });
    return res.data;
  },

  // Statements
  getStatements: async (documentId?: string): Promise<StatementItem[]> => {
    const params = documentId ? { document_id: documentId } : {};
    const res = await client.get<StatementItem[]>('/api/statements', { params });
    return res.data;
  },

  // Analyses
  getAnalyses: async (): Promise<AnalysisItem[]> => {
    const res = await client.get<AnalysisItem[]>('/api/analysis');
    return res.data;
  },

  simulateAnalysis: async (documentIds: string[], title?: string): Promise<AnalysisRunResponse> => {
    const res = await client.post<AnalysisRunResponse>('/api/analysis/simulate', {
      documentIds,
      title
    });
    return res.data;
  },

  // Demo Seed Controls
  seedDemoData: async () => {
    const res = await client.post('/api/seed/demo');
    return res.data;
  },

  clearDemoData: async () => {
    const res = await client.post('/api/seed/clear');
    return res.data;
  },

  getSeedStatus: async () => {
    const res = await client.get('/api/seed/status');
    return res.data;
  },
};

export default api;
