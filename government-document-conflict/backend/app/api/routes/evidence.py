from typing import List, Optional
from fastapi import APIRouter
from app.database.mongodb import db_manager
from app.schemas.evidence import EvidenceResponse
from app.api.routes.seed import _in_memory_evidence

router = APIRouter(prefix="/api/evidence", tags=["Evidence"])


@router.get("", response_model=List[EvidenceResponse])
async def list_evidence(conflict_id: Optional[str] = None):
    """Retrieve evidence items, optionally filtered by conflict ID."""
    evidence_list = []
    coll = db_manager.evidence_collection
    if coll is not None and db_manager.is_connected:
        try:
            query = {}
            if conflict_id:
                query["conflictId"] = conflict_id
            for item in coll.find(query):
                item["_id"] = str(item["_id"])
                evidence_list.append(item)
            if evidence_list:
                return evidence_list
        except Exception:
            pass

    # Fallback to memory
    items = list(_in_memory_evidence.values())
    if conflict_id:
        items = [e for e in items if e.get("conflictId") == conflict_id]
    return items
