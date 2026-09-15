from typing import List, Optional
from fastapi import APIRouter
from app.database.mongodb import db_manager
from app.schemas.conflict import ConflictResponse
from app.api.routes.seed import _in_memory_conflicts

router = APIRouter(prefix="/api/conflicts", tags=["Conflicts"])


@router.get("", response_model=List[ConflictResponse])
async def list_conflicts(conflict_type: Optional[str] = None):
    """Retrieve detected conflicts, with optional filter by conflict type."""
    conflicts = []
    coll = db_manager.conflicts_collection
    if coll is not None and db_manager.is_connected:
        try:
            query = {}
            if conflict_type and conflict_type != "ALL":
                query["conflictType"] = conflict_type
            for item in coll.find(query):
                item["_id"] = str(item["_id"])
                conflicts.append(item)
            if conflicts:
                return conflicts
        except Exception:
            pass

    # Fallback to in-memory store
    items = list(_in_memory_conflicts.values())
    if conflict_type and conflict_type != "ALL":
        items = [c for c in items if c.get("conflictType") == conflict_type]
    return items
