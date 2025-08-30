from datetime import datetime
from fastapi import APIRouter, Depends
from src.schemas.employer import EmployerCreate
from src.services.employer_service import EmployerService
from src.schemas.company import CompanyCreate
from src.services.company_service import CompanyService
from src.models.employer import Employer
from src.schemas.user import UserCreate
from src.services.user_service import UserService
from src.models.vacancy import Vacancy, SalaryPeriod
from src.database import Base, engine, get_session
from src.models.user import User
import json
from src.core.config import settings
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/database", tags=["database"])

@router.post("/init")
async def init_database_with_fake_data(session: AsyncSession = Depends(get_session)):
    with open(settings.db.init_file_url, "r", encoding="utf-8") as file:
        vacancies = json.load(file)
    user_service = UserService(session)
    user = await user_service.create_user(UserCreate(email="admin@gmail.com", password="admin@gmail.com", name="Volodymyr", surname="Zelenskiy",
                                        picture="https://upload.wikimedia.org/wikipedia/commons/5/5c/Volodymyr_Zelenskyy_in_2022.jpg"))
    employer_service = EmployerService(session)
    employer = await employer_service.create_employer(user_id=user.id)
    company_service = CompanyService(session)
    company_cache = {}

    for vacancy in vacancies:
        company_name = vacancy.pop("company_name")
        
        if company_name in company_cache:
            company = company_cache[company_name]
        else:
            company = await company_service.get_company_by_title(company_name)
            if not company:
                company_data = CompanyCreate(title=company_name)
                company = await company_service.create_company(company_data, employer.id)
            company_cache[company_name] = company

        vacancy["creation_date"] = datetime.fromisoformat(vacancy["creation_date"])
        vacancy["salary_period"] = SalaryPeriod(vacancy["salary_period"])
        vacancy["company_id"] = company.id
        new_vacancy = Vacancy(**vacancy)
        session.add(new_vacancy)


    await session.commit()
    return {"message": f"Inserted {len(vacancies)} vacancies."}

from sqlalchemy import text

@router.post("/")
async def setup_database(session: AsyncSession = Depends(get_session)):
    async with engine.begin() as conn:
        await conn.execute(text("DROP TABLE IF EXISTS users_vacancies CASCADE;"))
        await conn.execute(text("DROP TABLE IF EXISTS vacancies CASCADE;"))
        await conn.execute(text("DROP TABLE IF EXISTS employers CASCADE;"))
        await conn.execute(text("DROP TABLE IF EXISTS companies CASCADE;"))
        await conn.execute(text("DROP TABLE IF EXISTS users CASCADE;"))

        await conn.run_sync(Base.metadata.create_all)
    return {"ok": True}

