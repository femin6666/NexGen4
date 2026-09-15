import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database.mongodb import db_manager
from app.api.router import api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("govverify")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Initializing GovVerify backend...")
    db_manager.connect()
    yield
    # Shutdown
    logger.info("Shutting down GovVerify backend...")
    db_manager.close()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="GovVerify — Government Document Conflict Detection & Evidence Verification System (Phase 1 Foundation)",
    lifespan=lifespan
)

# CORS configuration
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

# Clean origins
allowed_origins = list(set([o.rstrip("/") for o in origins if o]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error processing request {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."}
    )

# Mount uploads static directory for viewing/downloading uploaded documents
app.mount("/uploads", StaticFiles(directory=str(settings.resolved_upload_dir)), name="uploads")

# Include API Router
app.include_router(api_router)
