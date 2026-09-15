from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "GovVerify"
    APP_VERSION: str = "1.0.0-phase1"
    DEBUG: bool = True

    # Database
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "govverify"

    # CORS & Security
    FRONTEND_URL: str = "http://localhost:5173"
    SECRET_KEY: str = "govverify-default-secret-phase1"

    # Uploads
    UPLOAD_DIR: str = "../../uploads"
    MAX_FILE_SIZE_MB: int = 25
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".docx", ".txt"]

    # Resolve absolute upload path
    @property
    def resolved_upload_dir(self) -> Path:
        base_dir = Path(__file__).resolve().parent.parent.parent
        upload_path = base_dir / "uploads"
        upload_path.mkdir(parents=True, exist_ok=True)
        return upload_path

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
