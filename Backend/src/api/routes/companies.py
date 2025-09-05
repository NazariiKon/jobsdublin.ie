from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from src.schemas.employer import EmployerRead
from src.schemas.vacancy import VacanciesResponse, VacancyRead
from src.services.vacancy_service import VacancyService
from src.api.dependencies import get_company_service, get_user_service, get_vacancy_service
from src.models.user import User
from src.services.user_service import UserService
from src.api.routes.login import get_current_active_user
from src.schemas.company import CompanyCreate, CompanyRead
from src.services.company_service import CompanyService
from src.database import get_session
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/companies", tags=["companies"])

@router.post("/", summary="Create a company", response_model=CompanyRead)
async def create_company(data: CompanyCreate, session: AsyncSession = Depends(get_session),
        current_user: User = Depends(get_current_active_user)):
    company_service = CompanyService(session)
    company = await company_service.get_company_by_title(data.title)
    if company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The company with this title already exists in the system."
        )
    user_service = UserService(session)
    employer_id = user_service.get_employer_by_user_id(current_user.id)
    company = await company_service.create_company(data, employer_id)
    return CompanyRead.model_validate(company)

@router.get("/{id}", summary="Get a company by id", response_model=CompanyRead)
async def get_company_by_id(id: int, company_service: CompanyService = Depends(get_company_service)):
    company = await company_service.get_company_by_id(id)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The company doesn't exists."
        )
   
    company_dict = company.__dict__.copy()
    company_dict["creator_user"] = company.creator.user
    return CompanyRead.model_validate(company_dict)

@router.put("/{id}", summary="Edit the company")
async def edit_vacancy(id: int, data: CompanyCreate,
                       company_service: CompanyService = Depends(get_company_service)):
    
    company = await company_service.get_company_by_id(id)
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="The company doesn't exists.")
    
    result = await company_service.update_company(company.id, data)

    if not result:
        raise HTTPException(status_code=400, detail="Error editing vacancy")
    
    return {"result": True}



@router.get("/employer/{employer_id}", summary="Get a company by employer id", response_model=CompanyRead)
async def get_company_by_employer_id(employer_id: int, company_service: CompanyService = Depends(get_company_service)):
    company = await company_service.get_company_by_employer_id(employer_id)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The company doesn't exists."
        )
   
    return CompanyRead.model_validate(company)

@router.get("/user/{user_id}/vacancies", summary="Get vacancies by user id", response_model=VacanciesResponse)
async def get_vacancies_by_user(user_id: int, vacancy_service: VacancyService = Depends(get_vacancy_service), 
                                 user_service: UserService = Depends(get_user_service),
                                 company_service: CompanyService = Depends(get_company_service)):
    employer = await user_service.get_employer_by_user_id(user_id)
    if not employer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This user doesn't exist."
        )
    employer = EmployerRead.model_validate(employer)
    print(employer)
    print(employer.id)
    company = await company_service.get_company_by_employer_id(employer.id)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This company doesn't exist."
        )
    company = CompanyRead.model_validate(company)
    vacancies = await vacancy_service.get_vacancies_by_company(company.id)
    if not vacancies:
        return {"company": company}
    
    return {"vacancies": [VacancyRead.model_validate(v) for v in vacancies], "company": company}


@router.get("/{id}/vacancies", summary="Get vacancies by company", response_model=List[VacancyRead])
async def get_vacancies_by_company(id: int, vacancy_service: VacancyService = Depends(get_vacancy_service)):
    vacancies = await vacancy_service.get_vacancies_by_company(id)
    if not vacancies:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No vacancies found for this company."
        )
    
    return [VacancyRead.model_validate(v) for v in vacancies]
