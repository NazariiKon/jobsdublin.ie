from datetime import datetime
from fastapi import APIRouter, Depends
from src.schemas.user import UserCreate
from src.services.user_service import UserService
from src.models.vacancy import Vacancy, SalaryPeriod
from src.api.dependencies import SessionDep
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
    for vacancy in vacancies:
        vacancy["creation_date"] = datetime.fromisoformat(vacancy["creation_date"])
        vacancy["salary_period"] = SalaryPeriod(vacancy["salary_period"])
        vacancy["creator_id"] = user.id
        new_vacancy = Vacancy(**vacancy)
        session.add(new_vacancy)

    await session.commit()
    return {"message": f"Inserted {len(vacancies)} vacancies."}

@router.post("/")
async def setup_database(session: AsyncSession = Depends(get_session)):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    return {"ok": True}
