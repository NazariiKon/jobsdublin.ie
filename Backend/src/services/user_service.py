from sqlalchemy import select
from src.schemas.google_login import GoogleLoginSchema
from src.schemas.user import UserSchema
from src.core.security import get_password_hash
from src.models.user import User

class UserService:
    def __init__(self, session):
        self.session = session

    async def create_user(self, data: UserSchema) -> User:
        new_user = User (
            email = data.email,
            password = get_password_hash(data.password)
        )
        self.session.add(new_user)
        await self.session.commit()
        return new_user
    
    async def create_google_user(self, data: GoogleLoginSchema) -> User:
        new_user = User (
            email = data.email,
            name = data.family_name,
            surname = data.given_name,
            picture = data.picture,
            authType = "google",
        )
        self.session.add(new_user)
        await self.session.commit()
        return new_user
    
    async def get_user_by_id(self, user_id: int) -> User:
        query = select(User).where(User.id == user_id)
        result = await self.session.execute(query)
        return result.scalars().first()

    async def get_user_by_email(self, email: str) -> User:
        query = select(User).where(User.email == email)
        result = await self.session.execute(query)
        return result.scalars().first()