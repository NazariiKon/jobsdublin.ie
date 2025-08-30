from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated, Any

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt import InvalidTokenError
from src.models.user import User
from src.database import get_session
from src.schemas.google_login import GoogleLoginSchema
from src.core.security import decode_jwt, encode_jwt, get_password_hash, verify_password
from src.api.dependencies import SessionDep
from src.services.user_service import UserService
from src.schemas.user import UserRead
from src.models.token import Token
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/login", tags=["login"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/token")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], session: AsyncSession = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        user_service = UserService(session)
        payload = decode_jwt(token)
        user_id = int(payload.get("sub"))
        if not user_id: 
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception

    user = await user_service.get_user_by_id(user_id)
    if not user:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: Annotated[UserRead, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user")
    return current_user

async def create_token(user: UserRead) -> Token:
    jwt_payload = {
        "sub": str(user.id),
        "email": user.email
    }
    token = encode_jwt(jwt_payload)
    return Token(access_token=token)

@router.post("/token", response_model=Token)
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
                session: AsyncSession = Depends(get_session)):
    unauthed_exc = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_service = UserService(session)
    user = await user_service.get_user_by_email(form_data.username)
    if not user:
        raise unauthed_exc
    if not verify_password(form_data.password, user.password):
        raise unauthed_exc
    
    return await create_token(UserRead.model_validate(user))

@router.get("/users/me")
async def read_users_me(
    current_user: Annotated[UserRead, Depends(get_current_active_user)],
):
    return UserRead.model_validate(current_user)

@router.post("/google", response_model=Token)
async def google_login(payload: GoogleLoginSchema, session: AsyncSession = Depends(get_session)):
    user_service = UserService(session)
    user = await user_service.get_user_by_email(payload.email)
    if user:
        return await create_token(UserRead.model_validate(user))
    else:
        user = await user_service.create_user(payload, auth_type="google")
        return await create_token(UserRead.model_validate(user))
