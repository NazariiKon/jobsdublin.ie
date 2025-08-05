
from typing import List
from sqlalchemy import func, select
from src.schemas.vacancy import VacancyRead
from src.models.vacancy import Vacancy
from src.api.dependencies import SessionDep


class VacancyService:
    def __init__(self, session: SessionDep):
        self.session = session
    
    async def get_vacancies(self, page, limit ) -> List[VacancyRead]:
        offset = limit * page
        query = select(Vacancy).offset(offset).limit(limit)
        result = await self.session.execute(query)
        vacancies = result.scalars().all()

        query = select(func.count()).select_from(Vacancy)
        result = await self.session.execute(query)
        total = result.scalar_one()
        return vacancies, total
