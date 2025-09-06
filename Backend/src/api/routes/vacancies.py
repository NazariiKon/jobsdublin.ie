from typing import List, Optional
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse

from src.schemas.user_vacancy import StatusUpdate, UserVacancy
from src.models.vacancy import Vacancy
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

async def get_vacancy_for_user(
    id: int,
    current_user: UserRead = Depends(get_current_active_user),
    vs: VacancyService = Depends(get_vacancy_service),
    us: UserService = Depends(get_user_service),
    cs: CompanyService = Depends(get_company_service)
):
    vacancy = await vs.check_vacancy_owner(current_user.id, id, us, cs)
    return vacancy


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
    vacancy: Vacancy = Depends(get_vacancy_for_user)
):
    result = await vs.delete_vacancy_by_id(vacancy.id)
    if not result:
        raise HTTPException(status_code=400, detail="Error deleting vacancy")
    
    return {"result": True}

@router.put("/{id}", summary="Edit the vacancy")
async def edit_vacancy(id: int, data: VacancyCreate, vacancy: Vacancy = Depends(get_vacancy_for_user),
                       vs: VacancyService = Depends(get_vacancy_service)):
    result = await vs.update_vacancy_full(vacancy.id, data)
    if not result:
        raise HTTPException(status_code=400, detail="Error editing vacancy")
    return {"result": True}

@router.post("/apply/{id}", summary="Apply CV to vacancy")
async def apply_cv(
    id: int,
    file: UploadFile = File(...),
    current_user: UserRead = Depends(get_current_active_user),
    vs: VacancyService = Depends(get_vacancy_service),
    us: UserService = Depends(get_user_service)
):  
    employer = await us.get_employer_by_user_id(current_user.id)
    if employer:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employer can't apply on CV's")
    
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
    
@router.get("/uploads/{filename}")
async def get_upload(filename: str):
    file_path = f"uploads/{filename}"
    return FileResponse(file_path)
    
@router.get("/applcations/{id}", summary="Get users applications by vacancy's ID", response_model=List[UserVacancy])
async def get_users_applications_by_vacancy(id: int, vacancy: Vacancy = Depends(get_vacancy_for_user), 
                                            vs: VacancyService = Depends(get_vacancy_service)):
    result = await vs.get_users_applications_by_vacancy_id(vacancy.id)
    if result:
        return [UserVacancy.model_validate(uv) for uv in result]
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="This vacancy doesn't have any applications"
    )

@router.patch("/applcations/{id}", summary="Change user application status")
async def change_status_user_applications_by_id(id: int, payload: StatusUpdate, vs: VacancyService = Depends(get_vacancy_service),
                                            current_user: UserRead = Depends(get_current_active_user),
                                            us: UserService = Depends(get_user_service),
                                            cs: CompanyService = Depends(get_company_service)):
    
    result = await vs.get_user_applications_by_id(id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="This vacancy doesn't have any applications")

    # check is this user is owner of this vacancy
    await vs.check_vacancy_owner(current_user.id, result.vacancy_id, us, cs)
    # and remove
    updated = await vs.change_status_user_applications_by_id(result.id, payload.status)
    if not updated:
        raise HTTPException(status_code=400, detail="Error deleting application")
    return {"result": True}

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