from fastapi import APIRouter, Depends, HTTPException, status

from fastapi.security import OAuth2PasswordBearer
from src.database import get_session
from src.api.dependencies import SessionDep
from src.services.user_service import UserService
from src.schemas.user import UserCreate, UserRead
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/users", tags=["users"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/create_user", response_model=UserRead)
async def create_user(data: UserCreate, session: AsyncSession = Depends(get_session),):
    user_service = UserService(session)
    user = await user_service.get_user_by_email(data.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this email already exists in the system."
        )
    user = await user_service.create_user(data, auth_type="local")
    return UserRead.model_validate(user)