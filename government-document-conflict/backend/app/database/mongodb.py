import logging
import time
from typing import Optional, Dict, Any
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection
from pymongo.errors import PyMongoError, ServerSelectionTimeoutError

from app.config import settings

logger = logging.getLogger("govverify.database")

class MongoDBManager:
    client: Optional[MongoClient] = None
    db: Optional[Database] = None
    is_connected: bool = False
    last_error: Optional[str] = None

    def connect(self):
        """Initializes MongoDB client with a fast timeout for health checks."""
        try:
            logger.info("Connecting to MongoDB at configured URI...")
            self.client = MongoClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=2500,
                connectTimeoutMS=2500,
                socketTimeoutMS=2500,
            )
            self.db = self.client[settings.DATABASE_NAME]
            # Quick ping to verify connectivity
            self.client.admin.command("ping")
            self.is_connected = True
            self.last_error = None
            logger.info(f"Connected to MongoDB database: {settings.DATABASE_NAME}")
        except (ServerSelectionTimeoutError, PyMongoError) as e:
            self.is_connected = False
            self.last_error = str(e)
            logger.warning(
                f"MongoDB connection could not be established: {e}. "
                "Ensure local MongoDB or Atlas URI is configured in .env."
            )
        except Exception as e:
            self.is_connected = False
            self.last_error = str(e)
            logger.error(f"Unexpected error connecting to MongoDB: {e}")

    def close(self):
        """Closes the MongoDB connection."""
        if self.client:
            self.client.close()
            self.is_connected = False
            logger.info("MongoDB connection closed.")

    _last_check_time: float = 0
    _cached_health: Optional[Dict[str, Any]] = None

    def check_health(self) -> Dict[str, Any]:
        """Performs a live ping test to verify MongoDB status with 5-second result caching."""
        now = time.time()
        if self._cached_health and (now - self._last_check_time < 5.0):
            return self._cached_health

        if not self.client:
            self.connect()

        if not self.client:
            res = {
                "status": "disconnected",
                "database": settings.DATABASE_NAME,
                "error": self.last_error or "Client not initialized",
            }
            self._last_check_time = now
            self._cached_health = res
            return res

        start = time.time()
        try:
            self.client.admin.command("ping")
            latency_ms = round((time.time() - start) * 1000, 2)
            self.is_connected = True
            self.last_error = None
            res = {
                "status": "connected",
                "database": settings.DATABASE_NAME,
                "latency_ms": latency_ms,
            }
        except Exception as e:
            self.is_connected = False
            self.last_error = str(e)
            res = {
                "status": "disconnected",
                "database": settings.DATABASE_NAME,
                "error": str(e),
            }

        self._last_check_time = now
        self._cached_health = res
        return res

    # Collection accessors
    @property
    def users_collection(self) -> Optional[Collection]:
        return self.db["users"] if self.db is not None else None

    @property
    def documents_collection(self) -> Optional[Collection]:
        return self.db["documents"] if self.db is not None else None

    @property
    def statements_collection(self) -> Optional[Collection]:
        return self.db["statements"] if self.db is not None else None

    @property
    def conflicts_collection(self) -> Optional[Collection]:
        return self.db["conflicts"] if self.db is not None else None

    @property
    def evidence_collection(self) -> Optional[Collection]:
        return self.db["evidence"] if self.db is not None else None

    @property
    def analyses_collection(self) -> Optional[Collection]:
        return self.db["analyses"] if self.db is not None else None


db_manager = MongoDBManager()
