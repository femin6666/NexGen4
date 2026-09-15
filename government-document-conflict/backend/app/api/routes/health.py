from datetime import datetime
from fastapi import APIRouter
from app.database.mongodb import db_manager
from app.config import settings

router = APIRouter(tags=["Health & Status"])


@router.get("/")
async def root():
    """Root endpoint verifying API operational status."""
    return {
        "message": "GovVerify API is running",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "phase": "Phase 1 - Project Foundation"
    }


@router.get("/api/health")
async def health_check():
    """Health check endpoint checking application and MongoDB connection."""
    db_health = db_manager.check_health()
    db_status = db_health.get("status", "disconnected")

    is_overall_healthy = (db_status == "connected")

    return {
        "status": "healthy" if is_overall_healthy else "degraded",
        "database": db_status,
        "database_name": settings.DATABASE_NAME,
        "version": settings.APP_VERSION,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "details": db_health
    }
