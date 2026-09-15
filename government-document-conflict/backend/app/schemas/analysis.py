from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.conflict import ConflictResponse
from app.schemas.evidence import EvidenceResponse


class AnalysisBase(BaseModel):
    documentIds: List[str] = Field(default_factory=list, description="IDs of documents being analyzed")
    status: str = Field(default="pending", description="Status: pending, processing, completed, failed")
    totalStatements: int = Field(default=0, description="Total statements extracted")
    matchedStatements: int = Field(default=0, description="Statements matched across docs")
    conflictsFound: int = Field(default=0, description="Total conflicts detected")
    possibleConflicts: int = Field(default=0, description="Uncertain or possible conflicts")
    startedAt: Optional[str] = None
    completedAt: Optional[str] = None


class AnalysisResponse(AnalysisBase):
    id: str = Field(..., alias="_id")
    createdAt: str
    title: Optional[str] = "Document Comparison Analysis"
    isDemo: bool = False

    model_config = {
        "populate_by_name": True
    }


class AnalysisRunRequest(BaseModel):
    documentIds: List[str] = Field(..., min_length=1, description="List of document IDs to analyze")
    title: Optional[str] = Field(None, description="Optional custom title for the analysis run")


class AnalysisRunResponse(BaseModel):
    analysis: AnalysisResponse
    statementsCount: int
    conflictsCount: int
    evidenceCount: int
    conflicts: List[ConflictResponse] = Field(default_factory=list)
    evidence: List[EvidenceResponse] = Field(default_factory=list)
    pipelineSteps: List[Dict[str, Any]] = Field(default_factory=list)
    message: str = "Analysis completed successfully"
