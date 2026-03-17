from pathlib import Path
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv
import os

load_dotenv()

BASE_DIR = Path(__file__).parent.parent.parent

class AuthJWT(BaseModel):
    private_key_path: Path
    public_key_path: Path
    algorithm: str = "PS256"
    access_token_expire_minutes: int = 15

def _get_jwt_paths() -> tuple[Path, Path]:
    private_env = os.getenv("JWT_PRIVATE_KEY_PATH")
    public_env = os.getenv("JWT_PUBLIC_KEY_PATH")
    if private_env and public_env:
        return Path(private_env), Path(public_env)
    local_private = BASE_DIR / "certs" / "private.key"
    local_public = BASE_DIR / "certs" / "public.key"
    return local_private, local_public

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    database_url: str = Field(..., env="DATABASE_URL")
    db_echo: bool = Field(default=True)
    db_init_file_url: Path = Field(default_factory=lambda: BASE_DIR / "src" / "generated_vacancies.json")
    
    auth_jwt: AuthJWT = Field(default_factory=lambda: AuthJWT(
        private_key_path=_get_jwt_paths()[0],
        public_key_path=_get_jwt_paths()[1]
    ))

settings = Settings()
