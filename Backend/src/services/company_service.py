from sqlalchemy import select
from src.models.employer import Employer
from src.schemas.company import CompanyCreate
from src.models.company import Company
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

class CompanyService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_company(self, data: CompanyCreate,  employer_id: int) -> Company:
        data = data.model_dump()
        data["creator_id"] = employer_id
        new_company = Company(**data)
        self.session.add(new_company)
        await self.session.commit()
        await self.session.refresh(new_company)
        return new_company
    
    async def get_company_by_title(self, title: str) -> Company:
        query = select(Company).where(Company.title == title)
        result = await self.session.execute(query)
        return result.scalars().first()
    

    async def get_company_by_id(self, id: int) -> Company:
        query = (
            select(Company)
            .where(Company.id == id)
            .options(
                selectinload(Company.creator).selectinload(Employer.user)
            )
        )
        result = await self.session.execute(query)
        return result.scalars().first()
    
    async def get_company_by_employer_id(self, id: int) -> Company:
        query = select(Company).where(Company.creator_id == id)
        result = await self.session.execute(query)
        return result.scalars().first()
