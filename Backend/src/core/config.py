from pathlib import Path
from pydantic import BaseModel
from pydantic_settings import BaseSettings

import os

BASE_DIR = Path(__file__).parent.parent.parent

class DbSettings(BaseModel):
    url: str = os.getenv("DATABASE_URL")
    init_file_url: Path = Path(BASE_DIR / "src" / "generated_vacancies.json")
    echo: bool = True

class AuthJWT(BaseModel):
    private_key_path: Path = Path(BASE_DIR / "certs" / "private.key")
    public_key_path: Path = Path(BASE_DIR / "certs" / "public.key")
    algorithm: str = "PS256"
    access_token_expire_minutes: int = 15

class Settings(BaseSettings):
    db: DbSettings = DbSettings()
    auth_jwt: AuthJWT = AuthJWT()

settings = Settings()