from typing import List
from fastapi import APIRouter, HTTPException, status
from app.database.mongodb import db_manager
from app.schemas.analysis import AnalysisResponse, AnalysisRunRequest, AnalysisRunResponse
from app.api.routes.seed import _in_memory_analyses
from app.services.analysis_service import AnalysisService

router = APIRouter(prefix="/api/analysis", tags=["Analysis"])


@router.get("", response_model=List[AnalysisResponse])
async def list_analyses():
    """Retrieve history of document comparisons and analyses."""
    analyses = []
    coll = db_manager.analyses_collection
    if coll is not None and db_manager.is_connected:
        try:
            for item in coll.find({}).sort("createdAt", -1):
                item["_id"] = str(item["_id"])
                analyses.append(item)
            if analyses:
                return analyses
        except Exception:
            pass

    # Fallback to in-memory store
    items = list(_in_memory_analyses.values())
    items.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
    return items


@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(analysis_id: str):
    """Retrieve a single analysis record by ID."""
    coll = db_manager.analyses_collection
    if coll is not None and db_manager.is_connected:
        try:
            res = coll.find_one({"_id": analysis_id})
            if res:
                res["_id"] = str(res["_id"])
                return res
        except Exception:
            pass

    record = _in_memory_analyses.get(analysis_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis record with ID '{analysis_id}' not found."
        )
    return record


@router.post("/simulate", response_model=AnalysisRunResponse, status_code=status.HTTP_200_OK)
@router.post("/run", response_model=AnalysisRunResponse, status_code=status.HTTP_200_OK)
async def simulate_analysis(request: AnalysisRunRequest):
    """
    Simulate or run a cross-document conflict analysis pipeline across selected documents.
    Extracts statements, detects numeric and policy conflicts, verifies evidence citations,
    and stores an auditable record in MongoDB.
    """
    result = await AnalysisService.run_simulation(
        document_ids=request.documentIds,
        custom_title=request.title
    )
    return result
