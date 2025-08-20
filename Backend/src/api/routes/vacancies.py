from typing import Optional
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from src.database import get_session
from src.utils.file_handler import save_cv
from src.schemas.user import UserRead
from src.api.routes.login import get_current_active_user
from src.schemas.pagination import VacancyResponse
from src.services.vacancy_service import VacancyService
from src.api.dependencies import SessionDep
from src.schemas.vacancy import VacancyCreate, VacancyRead
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/vacancies", tags=["Vacancies"])

@router.get("/", summary="Get all tasks", response_model=VacancyResponse)
async def read_vacancies(page: Optional[int], limit: Optional[int], session: AsyncSession = Depends(get_session)):
    vs = VacancyService(session)
    vacancies, total = await vs.get_vacancies(page - 1, limit)
    return { 
        "data": [VacancyRead.model_validate(v) for v in vacancies],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": (total + limit - 1) // limit,
            "has_next": (page * limit) < total,
            "has_prev": page > 1
        }
    }

@router.post("/", summary="Create a vacancy", response_model=VacancyRead)
async def create_vacancy(
        vacancy: VacancyCreate, 
        session: AsyncSession = Depends(get_session),
        current_user: UserRead = Depends(get_current_active_user)
    ):
    vs = VacancyService(session)
    new_vacancy = await vs.create_vacancy(vacancy, current_user.id)
    if not new_vacancy:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error creating vacancy")
    return VacancyRead.model_validate(new_vacancy)

@router.post("/apply/{id}", summary="Apply CV to vacancy")
async def apply_cv(
    id: int,
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_session),
    current_user: UserRead = Depends(get_current_active_user)
):
    vs = VacancyService(session)
    vacancy = await vs.get_vacancy_by_id(id)
    if vacancy:
        try:
            path = await save_cv(file)
        except Exception as e:
            print("Error saving CV:", e)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error saving CV")
        
        if path:
            result = await vs.apply_cv(vacancy_id=vacancy.id, user_id=current_user.id, path=path)
            if result:
                return {"result": "The resume is submitted", "status": status.HTTP_200_OK}
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This vacancy doesn't exist."
        ) 

    
