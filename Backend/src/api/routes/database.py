from fastapi import APIRouter
from src.api.dependencies import SessionDep
from src.database import Base, engine
from src.models.user import User

router = APIRouter(prefix="/database", tags=["database"])

@router.post("/")
async def setup_database(session: SessionDep):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    return {"ok": True}
