from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from app.services.document_service import DocumentService
from app.schemas.document import DocumentResponse

router = APIRouter(prefix="/api/documents", tags=["Documents"])


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(..., description="PDF, DOCX, or TXT file"),
    title: Optional[str] = Form(None, description="Custom document title"),
    documentType: str = Form("Government Order", description="Document Category"),
    department: str = Form("General Administration", description="Issuing Department"),
    documentDate: Optional[str] = Form(None, description="Issuance Date (YYYY-MM-DD)")
):
    """
    Upload a government document.
    Validates file type (.pdf, .docx, .txt), limits file size, saves to uploads/,
    and stores metadata in the MongoDB 'documents' collection.
    """
    doc_dict = await DocumentService.save_uploaded_file(
        file=file,
        title=title,
        document_type=documentType,
        department=department,
        document_date=documentDate
    )
    return doc_dict


@router.get("", response_model=List[DocumentResponse])
async def list_documents():
    """Retrieve all uploaded documents and demo documents."""
    docs = DocumentService.list_documents()
    return docs


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str):
    """Retrieve metadata for a single document by its ID."""
    doc = DocumentService.get_document_by_id(document_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID '{document_id}' not found."
        )
    return doc


@router.delete("/{document_id}", status_code=status.HTTP_200_OK)
async def delete_document(document_id: str):
    """Delete a document from MongoDB and remove the stored file from disk."""
    success = DocumentService.delete_document(document_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID '{document_id}' not found or could not be deleted."
        )
    return {"message": "Document deleted successfully", "id": document_id}
