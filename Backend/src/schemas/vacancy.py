from typing import List, Optional
from src.schemas.company import CompanyRead
from src.models.vacancy import SalaryPeriod
from datetime import date
from pydantic import BaseModel

class VacancyRead(BaseModel):
    id: int
    title: str
    desc: str
    location: str = "Dublin 1"
    company_id: int
    company: CompanyRead
    creation_date: date
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    salary_period: SalaryPeriod = SalaryPeriod.HOUR

    model_config = {
        "from_attributes": True
    }

class VacancyWithoutCompanyRead(BaseModel):
    id: int
    title: str
    desc: str
    location: str = "Dublin 1"
    creation_date: date
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    salary_period: SalaryPeriod = SalaryPeriod.HOUR

    model_config = {
        "from_attributes": True
    }

class VacancyCreate(BaseModel):
    title: str
    desc: str
    location: str = "Dublin 1"
    company_id: int
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    salary_period: SalaryPeriod = SalaryPeriod.HOUR

class VacanciesResponse(BaseModel):
    vacancies: Optional[List[VacancyRead]] = None
    company: CompanyRead