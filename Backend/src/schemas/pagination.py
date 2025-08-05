from pydantic import BaseModel
from typing import List

from src.schemas.vacancy import VacancyRead

class Pagination(BaseModel):
    page: int
    limit: int
    total: int
    total_pages: int
    has_next: bool
    has_prev: bool

class VacancyResponse(BaseModel):
    data: List[VacancyRead]
    pagination: Pagination