from typing import List, Optional
from fastapi import APIRouter
from app.database.mongodb import db_manager
from app.schemas.statement import StatementResponse
from app.api.routes.seed import _in_memory_statements

router = APIRouter(prefix="/api/statements", tags=["Statements"])


@router.get("", response_model=List[StatementResponse])
async def list_statements(document_id: Optional[str] = None):
    """Retrieve extracted statements, optionally filtered by document ID."""
    statements = []
    coll = db_manager.statements_collection
    if coll is not None and db_manager.is_connected:
        try:
            query = {}
            if document_id:
                query["documentId"] = document_id
            for item in coll.find(query):
                item["_id"] = str(item["_id"])
                statements.append(item)
            if statements:
                return statements
        except Exception:
            pass

    items = list(_in_memory_statements.values())
    if document_id:
        items = [s for s in items if s.get("documentId") == document_id]
    return items
