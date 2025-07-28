from datetime import datetime, timedelta, timezone
import bcrypt
import jwt
from .config import settings

def encode_jwt(
        payload: dict,
        private_key: str = settings.auth_jwt.private_key_path.read_text(),
        algorithm: str = settings.auth_jwt.algorithm,
        expire_minutes: int = settings.auth_jwt.access_token_expire_minutes,
        expire_timedelta: timedelta | None = None
        ):
    to_encode = payload.copy()
    # Give my JWT token some time, and after it this token won't work
    now = datetime.now(timezone.utc)
    if expire_timedelta:
        expire = now + expire_timedelta
    else:
        expire = now + timedelta(minutes=expire_minutes)
    
    # update my information with expire and createing time information 
    to_encode.update(exp=expire, iat=now)
    encode = jwt.encode(to_encode, private_key, algorithm=algorithm)
    return encode
    
def decode_jwt(
        token: str | bytes,
        public_key: str = settings.auth_jwt.public_key_path.read_text(),
        algorithm: str = settings.auth_jwt.algorithm
):
    return jwt.decode(token, public_key, algorithms=[algorithm])

def get_password_hash(password: str) -> bytes:
    salt = bcrypt.gensalt()
    # convert password to bytes and then salt it
    pwd_bytes: bytes = password.encode()
    return bcrypt.hashpw(pwd_bytes, salt)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        password=plain_password.encode(),
        hashed_password=hashed_password,
        )
