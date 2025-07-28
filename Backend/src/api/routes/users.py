from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated, Any

from fastapi.security import OAuth2PasswordBearer
from src.api.dependencies import SessionDep
from src.services.user_service import UserService
from src.schemas.user import UserSchema
from src.models.user import User

router = APIRouter(prefix="/users", tags=["users"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/create_user")
async def create_user(data: UserSchema, session: SessionDep):
    user_service = UserService(session)
    user = await user_service.get_user_by_email(data.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this email already exists in the system."
        )
    user = await user_service.create_user(data)
    return user