from typing import List
from fastapi import HTTPException, status
from sqlalchemy import delete, desc, func, or_, select, update

from src.models.user import User
from src.services.company_service import CompanyService
from src.services.user_service import UserService
from src.models.company import Company
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
    
    async def delete_vacancy_by_id(self, id: int):
        try:
            query = delete(Vacancy).where(Vacancy.id == id)
            await self.session.execute(query)
            await self.session.commit()
            return True
        except Exception as e:
            await self.session.rollback()
            return e
        
    async def check_vacancy_owner(self, user_id: int, vacancy_id: int, us: UserService, cs: CompanyService) -> Vacancy:
        employer = await us.get_employer_by_user_id(user_id)
        if not employer:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This employer doesn't have any companies")
        
        company = await cs.get_company_by_employer_id(employer.id)
        vacancy = await self.get_vacancy_by_id(vacancy_id)
        
        if vacancy.company_id != company.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="It's not your vacancy")

        return vacancy

        
    async def update_vacancy_full(self, id: int, data: VacancyCreate):
        try:
            update_data = data.model_dump()
            if "company_id" in update_data:
                del update_data["company_id"]

            query = (
                update(Vacancy)
                .where(Vacancy.id == id)
                .values(**update_data)
                .execution_options(synchronize_session="fetch")
            )
            await self.session.execute(query)
            await self.session.commit()
            return True
        except Exception as e:
            await self.session.rollback()
            return e


    async def get_vacancies_by_company(self, id: int) -> list[Vacancy]:
        query = select(Vacancy).options(selectinload(Vacancy.company)).where(Vacancy.company_id == id)
        result = await self.session.execute(query)
        return result.scalars().all()

    async def create_vacancy(self, vacancy: VacancyCreate) -> Vacancy:
        data = vacancy.model_dump()
        data["creation_date"] = date.today()
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
    
    async def get_users_applications_by_vacancy_id(self, id: int) -> List[UserVacancy]:
        query = select(UserVacancy).options(selectinload(UserVacancy.user)).where(UserVacancy.vacancy_id == id)
        result = await self.session.execute(query)
        return result.scalars().all()
