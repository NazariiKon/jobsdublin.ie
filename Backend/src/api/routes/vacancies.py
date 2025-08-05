from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from src.schemas.pagination import VacancyResponse
from src.services.vacancy_service import VacancyService
from src.api.dependencies import SessionDep
from src.schemas.vacancy import VacancyRead

router = APIRouter(prefix="/vacancies", tags=["Vacancies"])

@router.get("/", summary="Get all tasks", response_model=VacancyResponse)
async def read_vacancies(page: Optional[int], limit: Optional[int], session: SessionDep):
    vs = VacancyService(session)
    vacancies, total = await vs.get_vacancies(page - 1, limit)
    print(vacancies)
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