from typing import Optional
from pydantic import BaseModel, Field


class ConflictBase(BaseModel):
    statementAId: str = Field(..., description="ID of first conflicting statement")
    statementBId: str = Field(..., description="ID of second conflicting statement")
    conflictType: str = Field(
        ...,
        description="Type: DIRECT_CONFLICT, NUMERIC_CONFLICT, DATE_CONFLICT, CONDITIONAL_DIFFERENCE, POLICY_CHANGE, POSSIBLE_CONFLICT"
    )
    confidence: float = Field(default=0.0, description="Confidence score 0.0 - 1.0")
    severity: str = Field(default="MEDIUM", description="Severity: HIGH, MEDIUM, LOW")
    reason: str = Field(default="", description="Explanatory text explaining the conflict")
    topic: Optional[str] = Field(default="General", description="Subject topic e.g. Eligibility, Grant Amount")


class ConflictResponse(ConflictBase):
    id: str = Field(..., alias="_id")
    createdAt: str
    isDemo: bool = False
    # Expanded fields for UI presentation
    statementAText: Optional[str] = None
    statementBText: Optional[str] = None
    documentAName: Optional[str] = None
    documentBName: Optional[str] = None

    model_config = {
        "populate_by_name": True
    }
