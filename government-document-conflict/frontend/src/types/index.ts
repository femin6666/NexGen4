export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'error';
  database: 'connected' | 'disconnected';
  database_name?: string;
  version?: string;
  timestamp?: string;
  details?: {
    status?: string;
    database?: string;
    latency_ms?: number;
    error?: string;
  };
}

export type DocumentType =
  | 'Government Order'
  | 'Government Policy'
  | 'Government Notification'
  | 'Government Circular'
  | 'Government Guidelines'
  | 'Government Reports'
  | 'Rules and Regulations';

export type DocumentStatus = 'uploaded' | 'processing' | 'analyzed' | 'failed';

export interface DocumentItem {
  _id: string;
  title: string;
  fileName: string;
  documentType: DocumentType | string;
  department: string;
  documentDate?: string;
  filePath: string;
  fileSize?: number;
  pageCount?: number;
  status: DocumentStatus;
  createdAt: string;
  isDemo?: boolean;
}

export interface StatementItem {
  _id: string;
  documentId: string;
  pageNumber: number;
  section: string;
  statementText: string;
  subject?: string;
  attribute?: string;
  value?: any;
  condition?: string | null;
  createdAt: string;
  isDemo?: boolean;
}

export type ConflictType =
  | 'DIRECT_CONFLICT'
  | 'NUMERIC_CONFLICT'
  | 'DATE_CONFLICT'
  | 'CONDITIONAL_DIFFERENCE'
  | 'POLICY_CHANGE'
  | 'POSSIBLE_CONFLICT';

export type ConflictSeverity = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ConflictItem {
  _id: string;
  statementAId: string;
  statementBId: string;
  conflictType: ConflictType;
  confidence: number;
  severity: ConflictSeverity;
  topic?: string;
  reason: string;
  statementAText?: string;
  statementBText?: string;
  documentAName?: string;
  documentBName?: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface EvidenceItem {
  _id: string;
  conflictId: string;
  documentId: string;
  pageNumber: number;
  section: string;
  sourceText: string;
  relatedStatement?: string;
  documentName?: string;
  explanation?: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface AnalysisItem {
  _id: string;
  title?: string;
  documentIds: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalStatements: number;
  matchedStatements: number;
  conflictsFound: number;
  possibleConflicts: number;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  isDemo?: boolean;
}

export interface PipelineStep {
  step: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  detail?: string;
}

export interface AnalysisRunResponse {
  analysis: AnalysisItem;
  statementsCount: number;
  conflictsCount: number;
  evidenceCount: number;
  conflicts: ConflictItem[];
  evidence: EvidenceItem[];
  pipelineSteps: PipelineStep[];
  message: string;
}

export interface ReportItem {
  id: string;
  reportName: string;
  documents: string[];
  conflicts: number;
  createdDate: string;
  status: 'Generated' | 'Draft';
}
