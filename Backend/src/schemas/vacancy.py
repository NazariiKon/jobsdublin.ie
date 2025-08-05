from typing import Optional
from src.models.vacancy import SalaryPeriod
from datetime import date
from pydantic import BaseModel

class VacancyRead(BaseModel):
    id: int
    title: str
    desc: str
    location: str = "Dublin 1"
    company_name: str
    creation_date: date
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    salary_period: SalaryPeriod = SalaryPeriod.HOUR

    model_config = {
        "from_attributes": True
    }

class VacancyCreate(BaseModel):
    id: int
    title: str
    desc: str
    location: str = "Dublin 1"
    company_name: str
    creation_date: date
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    salary_period: SalaryPeriod = SalaryPeriod.HOUR