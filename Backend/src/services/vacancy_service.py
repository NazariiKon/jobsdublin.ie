from typing import List
from sqlalchemy import desc, func, or_, select
from src.models.company import Company
from src.utils.file_handler import save_cv
from src.models.user_vacancy import UserVacancy
from src.schemas.vacancy import VacancyCreate
from src.models.vacancy import Vacancy
from datetime import date
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession


class VacancyService:
    def __init__(self, session: AsyncSession):
            self.session = session
    
    async def get_vacancies(self, page, limit, location, key_words) -> List[Vacancy]:
        offset = limit * page
        conditions = []
        if location:
            conditions.append(Vacancy.location.ilike(f"%{location}%"))

        if key_words:
            conditions.append(or_(
                Vacancy.location.ilike(f"%{key_words}%"),
                Vacancy.title.ilike(f"%{key_words}%"),
                Company.title.ilike(f"%{key_words}%"),
                Vacancy.desc.ilike(f"%{key_words}%")
            ))

        query = select(Vacancy).join(Vacancy.company).options(selectinload(Vacancy.company)).limit(limit).offset(offset)
        if conditions:
            query = query.where(*conditions).order_by(
                desc(Vacancy.location == location)
            )
       
        result = await self.session.execute(query)
        vacancies = result.scalars().all()

        count_query = select(func.count()).select_from(Vacancy).join(Vacancy.company)
        if conditions:
            count_query = count_query.where(*conditions)
        result = await self.session.execute(count_query)
        total = result.scalar_one()
        return vacancies, total
    
    async def get_vacancy_by_id(self, id: int) -> Vacancy:
        query = select(Vacancy).where(Vacancy.id == id).options(selectinload(Vacancy.company))
        result = await self.session.execute(query)
        vacancy = result.scalar_one_or_none()
        return vacancy

    async def get_vacancies_by_company(self, id: int) -> list[Vacancy]:
        query = select(Vacancy).options(selectinload(Vacancy.company)).where(Vacancy.company_id == id)
        result = await self.session.execute(query)
        return result.scalars().all()

    async def create_vacancy(self, vacancy: VacancyCreate, user_id: int) -> Vacancy:
        data = vacancy.model_dump()
        data["creation_date"] = date.today()
        data["creator_id"] = user_id
        new_vacancy = Vacancy(**data)
        self.session.add(new_vacancy)
        await self.session.commit()
        await self.session.refresh(new_vacancy)
        return new_vacancy

    async def apply_cv(self, vacancy_id:int, user_id: int, path: str):
        new_apply = UserVacancy(
            vacancy_id=vacancy_id,
            user_id=user_id,
            cv_path=path
        )
        self.session.add(new_apply)
        await self.session.commit()
        await self.session.refresh(new_apply)
        return new_apply


