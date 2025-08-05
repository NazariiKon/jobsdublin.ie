from datetime import datetime
from fastapi import APIRouter
from src.models.vacancy import Vacancy, SalaryPeriod
from src.api.dependencies import SessionDep
from src.database import Base, engine
from src.models.user import User
import json
from src.core.config import settings



router = APIRouter(prefix="/database", tags=["database"])

@router.post("/init")
async def init_database_with_fake_data(session: SessionDep):
    with open(settings.db.init_file_url, "r", encoding="utf-8") as file:
        vacancies = json.load(file)

    for vacancy in vacancies:
        vacancy["creation_date"] = datetime.fromisoformat(vacancy["creation_date"])
        vacancy["salary_period"] = SalaryPeriod(vacancy["salary_period"])
        new_vacancy = Vacancy(**vacancy)
        session.add(new_vacancy)

    await session.commit()
    return {"message": f"Inserted {len(vacancies)} vacancies."}

        
        

@router.post("/")
async def setup_database(session: SessionDep):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    return {"ok": True}
