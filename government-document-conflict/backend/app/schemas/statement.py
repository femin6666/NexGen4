from typing import Optional, Any
from pydantic import BaseModel, Field


class StatementBase(BaseModel):
    documentId: str = Field(..., description="Referenced Document ID")
    pageNumber: int = Field(default=1, description="Source page number")
    section: str = Field(default="General", description="Section or clause heading")
    statementText: str = Field(..., description="Exact textual statement or claim")
    subject: Optional[str] = Field(default=None, description="Entity or subject of the claim")
    attribute: Optional[str] = Field(default=None, description="Attribute or criterion (e.g. Age, Income)")
    value: Optional[Any] = Field(default=None, description="Extracted numerical or categorical value")
    condition: Optional[str] = Field(default=None, description="Conditional qualifiers")


class StatementResponse(StatementBase):
    id: str = Field(..., alias="_id")
    createdAt: str
    isDemo: bool = False

    model_config = {
        "populate_by_name": True
    }
