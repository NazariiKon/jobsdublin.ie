from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.services.employer_service import EmployerService
from src.services.vacancy_service import VacancyService
from src.services.company_service import CompanyService
from src.services.user_service import UserService
from src.database import get_session

SessionDep = Annotated[AsyncSession, Depends(get_session)]

async def get_user_service(session: AsyncSession = Depends(get_session)):
    return UserService(session)

async def get_company_service(session: AsyncSession = Depends(get_session)):
    return CompanyService(session)

async def get_vacancy_service(session: AsyncSession = Depends(get_session)):
    return VacancyService(session)

async def get_employer_service(session: AsyncSession = Depends(get_session)):
    return EmployerService(session)