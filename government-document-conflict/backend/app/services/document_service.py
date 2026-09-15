import os
import re
import uuid
import logging
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Dict, Any
from bson import ObjectId
from fastapi import UploadFile, HTTPException

from app.config import settings
from app.database.mongodb import db_manager

logger = logging.getLogger("govverify.services.document")

# In-memory storage cache used as a fallback if MongoDB is offline or in development
_in_memory_docs: Dict[str, Dict[str, Any]] = {}

class DocumentService:
    @staticmethod
    def _sanitize_filename(filename: str) -> str:
        # Keep alphanumeric, underscores, hyphens, and dots
        clean = re.sub(r"[^a-zA-Z0-9_.-]", "_", filename)
        return clean[:100]

    @classmethod
    async def save_uploaded_file(
        cls,
        file: UploadFile,
        title: Optional[str] = None,
        document_type: str = "Government Order",
        department: str = "General Administration",
        document_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """Validates, safely saves file to uploads/, and stores metadata in MongoDB."""
        if not file.filename:
            raise HTTPException(status_code=400, detail="Uploaded file must have a valid filename.")

        # Check extension
        ext = Path(file.filename).suffix.lower()
        if ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file extension '{ext}'. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
            )

        # Read file contents and check size
        contents = await file.read()
        file_size = len(contents)
        max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024

        if file_size > max_bytes:
            raise HTTPException(
                status_code=400,
                detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB."
            )

        if file_size == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty (0 bytes).")

        # Generate unique safe file name
        unique_prefix = uuid.uuid4().hex[:10]
        safe_orig_name = cls._sanitize_filename(file.filename)
        saved_filename = f"{unique_prefix}_{safe_orig_name}"
        save_path = settings.resolved_upload_dir / saved_filename

        try:
            with open(save_path, "wb") as f:
                f.write(contents)
        except Exception as e:
            logger.error(f"Failed to write file to disk: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to save file to disk: {str(e)}")

        now_iso = datetime.utcnow().isoformat() + "Z"
        doc_title = title.strip() if title and title.strip() else Path(file.filename).stem.replace("_", " ").title()

        doc_dict = {
            "title": doc_title,
            "fileName": file.filename,
            "documentType": document_type,
            "department": department,
            "documentDate": document_date or datetime.utcnow().strftime("%Y-%m-%d"),
            "filePath": str(save_path.relative_to(settings.resolved_upload_dir.parent.parent)),
            "fileSize": file_size,
            "pageCount": 1,  # In Phase 1 placeholder; will be determined during Phase 2 text extraction
            "status": "uploaded",
            "createdAt": now_iso,
            "isDemo": False
        }

        # Store in MongoDB if connected
        coll = db_manager.documents_collection
        if coll is not None and db_manager.is_connected:
            try:
                result = coll.insert_one(doc_dict)
                doc_dict["_id"] = str(result.inserted_id)
                logger.info(f"Document saved to MongoDB with ID {doc_dict['_id']}")
            except Exception as e:
                logger.warning(f"MongoDB insert failed ({e}), falling back to in-memory store.")
                doc_id = str(ObjectId())
                doc_dict["_id"] = doc_id
                _in_memory_docs[doc_id] = doc_dict
        else:
            doc_id = str(ObjectId())
            doc_dict["_id"] = doc_id
            _in_memory_docs[doc_id] = doc_dict
            logger.info(f"Document stored in fallback cache with ID {doc_id}")

        return doc_dict

    @classmethod
    def list_documents(cls) -> List[Dict[str, Any]]:
        """Lists all uploaded and demo documents."""
        docs = []
        coll = db_manager.documents_collection
        if coll is not None and db_manager.is_connected:
            try:
                cursor = coll.find({}).sort("createdAt", -1)
                for item in cursor:
                    item["_id"] = str(item["_id"])
                    docs.append(item)
                return docs
            except Exception as e:
                logger.warning(f"Failed to fetch from MongoDB ({e}), using in-memory store.")

        # Fallback
        items = list(_in_memory_docs.values())
        items.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
        return items

    @classmethod
    def get_document_by_id(cls, doc_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single document by ID."""
        coll = db_manager.documents_collection
        if coll is not None and db_manager.is_connected:
            try:
                if ObjectId.is_valid(doc_id):
                    res = coll.find_one({"_id": ObjectId(doc_id)})
                    if res:
                        res["_id"] = str(res["_id"])
                        return res
                res = coll.find_one({"_id": doc_id})
                if res:
                    res["_id"] = str(res["_id"])
                    return res
            except Exception as e:
                logger.warning(f"Error querying document from MongoDB: {e}")

        return _in_memory_docs.get(doc_id)

    @classmethod
    def delete_document(cls, doc_id: str) -> bool:
        """Deletes a document from MongoDB and disk."""
        doc = cls.get_document_by_id(doc_id)
        if not doc:
            return False

        # Attempt to delete file from disk if present
        try:
            raw_path = doc.get("filePath")
            if raw_path:
                full_path = settings.resolved_upload_dir.parent.parent / raw_path
                if full_path.exists() and full_path.is_file():
                    os.remove(full_path)
        except Exception as e:
            logger.warning(f"Could not remove physical file for doc {doc_id}: {e}")

        # Delete from MongoDB
        coll = db_manager.documents_collection
        if coll is not None and db_manager.is_connected:
            try:
                if ObjectId.is_valid(doc_id):
                    coll.delete_one({"_id": ObjectId(doc_id)})
                else:
                    coll.delete_one({"_id": doc_id})
            except Exception as e:
                logger.warning(f"Error deleting from MongoDB: {e}")

        # Remove from in-memory fallback
        _in_memory_docs.pop(doc_id, None)
        return True
