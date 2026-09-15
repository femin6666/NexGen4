from typing import Optional
from pydantic import BaseModel, Field


class EvidenceBase(BaseModel):
    conflictId: str = Field(..., description="Referenced Conflict ID")
    documentId: str = Field(..., description="Referenced Document ID")
    pageNumber: int = Field(default=1, description="Page number of the source text")
    section: str = Field(default="General", description="Section or clause identifier")
    sourceText: str = Field(..., description="Original verbatim extract from the document")
    relatedStatement: Optional[str] = Field(default=None, description="Contrasting statement")
    explanation: Optional[str] = Field(default=None, description="Contextual explanation")


class EvidenceResponse(EvidenceBase):
    id: str = Field(..., alias="_id")
    createdAt: str
    documentName: Optional[str] = None
    isDemo: bool = False

    model_config = {
        "populate_by_name": True
    }
