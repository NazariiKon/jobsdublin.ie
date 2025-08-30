from sqlalchemy import select
from src.models.employer import Employer
from sqlalchemy.ext.asyncio import AsyncSession

class EmployerService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_employer(self,  user_id: int) -> Employer:
        new_employer = Employer(
            user_id=user_id
        )
        self.session.add(new_employer)
        await self.session.commit()
        await self.session.refresh(new_employer)
        return new_employer
