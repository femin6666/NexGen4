from typing import List, Dict, Any
from fastapi import APIRouter

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("", response_model=List[Dict[str, Any]])
async def list_reports():
    """Retrieve generated verification reports (Phase 1 empty list)."""
    return []
