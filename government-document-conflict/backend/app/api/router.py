from fastapi import APIRouter
from app.api.routes import health, documents, seed, conflicts, evidence, statements, analysis, reports

api_router = APIRouter()

# Register routes
api_router.include_router(health.router)
api_router.include_router(documents.router)
api_router.include_router(seed.router)
api_router.include_router(conflicts.router)
api_router.include_router(evidence.router)
api_router.include_router(statements.router)
api_router.include_router(analysis.router)
api_router.include_router(reports.router)
