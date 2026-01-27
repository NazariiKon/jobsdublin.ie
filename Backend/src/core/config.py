from pathlib import Path
from pydantic import BaseModel
from pydantic_settings import BaseSettings
import os


BASE_DIR = Path(__file__).parent.parent.parent

class DbSettings(BaseModel):
    url: str = os.getenv("DATABASE_URL")
    init_file_url: Path = BASE_DIR / "src" / "generated_vacancies.json"
    echo: bool = True

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
    db: DbSettings = DbSettings()
    auth_jwt: AuthJWT = AuthJWT(
        private_key_path=_get_jwt_paths()[0],
        public_key_path=_get_jwt_paths()[1],
    )


settings = Settings()
