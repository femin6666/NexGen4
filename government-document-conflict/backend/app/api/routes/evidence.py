from typing import List, Optional
from fastapi import APIRouter
from app.database.mongodb import db_manager
from app.schemas.evidence import EvidenceResponse
from app.api.routes.seed import _in_memory_evidence

router = APIRouter(prefix="/api/evidence", tags=["Evidence"])


@router.get("", response_model=List[EvidenceResponse])
async def list_evidence(
    conflict_id: Optional[str] = None,
    document_id: Optional[str] = None,
    analysis_id: Optional[str] = None,
    is_demo: Optional[bool] = None,
):
    """
    Retrieve evidence items, strictly filterable by:
    - document_id: only citations for a specific official document
    - analysis_id: only citations generated in a specific cross-document comparison
    - conflict_id: only citations belonging to a specific conflict
    - is_demo: filter demo records vs user-analyzed records
    """
    evidence_list = []
    coll = db_manager.evidence_collection
    if coll is not None and db_manager.is_connected:
        try:
            query = {}
            if conflict_id:
                query["conflictId"] = conflict_id
            if document_id:
                query["documentId"] = document_id
            if analysis_id:
                query["analysisId"] = analysis_id
            if is_demo is not None:
                query["isDemo"] = is_demo

            for item in coll.find(query).sort("createdAt", -1):
                item["_id"] = str(item["_id"])
                evidence_list.append(item)
            return evidence_list
        except Exception:
            pass

    # Fallback to memory
    items = list(_in_memory_evidence.values())
    if conflict_id:
        items = [e for e in items if e.get("conflictId") == conflict_id]
    if document_id:
        items = [e for e in items if e.get("documentId") == document_id]
    if analysis_id:
        items = [e for e in items if e.get("analysisId") == analysis_id]
    if is_demo is not None:
        items = [e for e in items if e.get("isDemo") == is_demo]
    items.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
    return items
