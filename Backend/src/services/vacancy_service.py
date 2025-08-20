from typing import List
from fastapi import UploadFile
from sqlalchemy import func, select
from src.utils.file_handler import save_cv
from src.models.user_vacancy import UserVacancy
from src.schemas.vacancy import VacancyCreate, VacancyRead
from src.models.vacancy import Vacancy
from src.api.dependencies import SessionDep
from datetime import date


class VacancyService:
    def __init__(self, session: SessionDep):
        self.session = session
    
    async def get_vacancies(self, page, limit ) -> List[Vacancy]:
        offset = limit * page
        query = select(Vacancy).offset(offset).limit(limit)
        result = await self.session.execute(query)
        vacancies = result.scalars().all()

        query = select(func.count()).select_from(Vacancy)
        result = await self.session.execute(query)
        total = result.scalar_one()
        return vacancies, total
    
    async def get_vacancy_by_id(self, id: int) -> Vacancy:
        query = select(Vacancy).where(Vacancy.id == id)
        result = await self.session.execute(query)
        vacancy = result.scalar_one_or_none()
        return vacancy

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


