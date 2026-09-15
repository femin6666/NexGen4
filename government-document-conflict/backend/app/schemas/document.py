from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class DocumentBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Document title or official designation")
    fileName: str = Field(..., description="Original file name")
    documentType: str = Field(
        default="Government Order",
        description="Type: Government Order, Policy, Notification, Circular, Guideline, Report, Rules and Regulations"
    )
    department: str = Field(default="General Administration", description="Issuing Department or Ministry")
    documentDate: Optional[str] = Field(default=None, description="Official date of document issuance (YYYY-MM-DD)")
    filePath: str = Field(..., description="Relative or absolute storage path")
    fileSize: int = Field(default=0, description="File size in bytes")
    pageCount: int = Field(default=1, description="Number of pages")
    status: str = Field(
        default="uploaded",
        description="Current processing status: uploaded, processing, analyzed, failed"
    )


class DocumentCreate(BaseModel):
    title: str
    documentType: Optional[str] = "Government Order"
    department: Optional[str] = "General Administration"
    documentDate: Optional[str] = None


class DocumentResponse(DocumentBase):
    id: str = Field(..., alias="_id")
    createdAt: str
    isDemo: bool = False

    model_config = {
        "populate_by_name": True
    }
