from typing import Optional
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from src.services.company_service import CompanyService
from src.services.user_service import UserService
from src.api.dependencies import get_company_service, get_user_service, get_vacancy_service
from src.database import get_session
from src.utils.file_handler import save_cv
from src.schemas.user import UserRead
from src.api.routes.login import get_current_active_user
from src.schemas.pagination import VacancyResponse
from src.services.vacancy_service import VacancyService
from src.schemas.vacancy import VacancyCreate, VacancyRead, VacancyWithoutCompanyRead
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/vacancies", tags=["vacancies"])

@router.get("/", summary="Get all vacancies", response_model=VacancyResponse)
async def read_vacancies(page: Optional[int], limit: Optional[int], location: Optional[str] = "Dublin", key_words: Optional[str] = None, session: AsyncSession = Depends(get_session)):
    vs = VacancyService(session)
    vacancies, total = await vs.get_vacancies(page - 1, limit, location, key_words)
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

@router.post("/", summary="Create a vacancy", response_model=VacancyWithoutCompanyRead)
async def create_vacancy(
        vacancy: VacancyCreate, 
        vs: VacancyService = Depends(get_vacancy_service)
    ):
    new_vacancy = await vs.create_vacancy(vacancy)
    if not new_vacancy:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error creating vacancy")
    return VacancyWithoutCompanyRead.model_validate(new_vacancy)

@router.delete("/{id}", summary="Delete a vacancy by id")
async def delete_vacancy(
    id: int,
    vs: VacancyService = Depends(get_vacancy_service),
    us: UserService = Depends(get_user_service),
    cs: CompanyService = Depends(get_company_service),
    current_user: UserRead = Depends(get_current_active_user)
):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You need to be authorized"
        )

    employer = await us.get_employer_by_user_id(current_user.id)
    if not employer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This employer doesn't have any companies"
        )
    
    company = await cs.get_company_by_employer_id(employer.id)
    if company.creator_id != employer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="It's not your vacancy"
        )

    result = await vs.delete_vacancy_by_id(id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error deleting vacancy"
        )

    return {"result": True}
        

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
    
@router.get("/{id}", summary="Get a vacancy by id")
async def get_vacancy_by_id(id: int, session: AsyncSession = Depends(get_session)) -> VacancyRead:
    vs = VacancyService(session)
    vacancy = await vs.get_vacancy_by_id(id)
    if vacancy:
        return VacancyRead.model_validate(vacancy)
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This vacancy doesn't exist."
        )