from typing import Optional
from sqlalchemy import select
from src.schemas.google_login import GoogleLoginSchema
from src.core.security import get_password_hash
from src.schemas.user import UserCreate
from src.models.user import User
from src.api.dependencies import SessionDep

class UserService:
    def __init__(self, session: SessionDep):
        self.session = session

    async def create_user(self, data: UserCreate | GoogleLoginSchema, auth_type: str = "local") -> User:
        if auth_type == "local":
            new_user = User(
                email=data.email,
                password=get_password_hash(data.password),
                name=data.name,
                surname=data.surname,
                picture=data.picture,
                authType=auth_type
            )
        elif auth_type == "google":
            new_user = User(
                email=data.email,
                name=data.given_name,
                surname=data.family_name,
                picture=data.picture,
                authType=auth_type
            )
        else:
            raise ValueError("Unsupported auth_type")

        self.session.add(new_user)
        await self.session.commit()
        await self.session.refresh(new_user)
        return new_user

    
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        query = select(User).where(User.id == user_id)
        result = await self.session.execute(query)
        return result.scalars().first()

    async def get_user_by_email(self, email: str) -> Optional[User]:
        query = select(User).where(User.email == email)
        result = await self.session.execute(query)
        return result.scalars().first()