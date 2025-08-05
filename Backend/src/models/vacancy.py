from typing import Optional
from src.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Date, Enum as SqlEnum
import enum
from datetime import date

class SalaryPeriod(enum.Enum):
    HOUR = "hour"
    WEEK = "week"
    MONTH = "month"
    YEAR = "year"

class Vacancy(Base):
    __tablename__ = "vacancies"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column()
    desc: Mapped[str] = mapped_column()
    location: Mapped[str] = mapped_column(default="Dublin 1", server_default="Dublin 1")
    company_name: Mapped[str] = mapped_column()
    creation_date: Mapped[date] = mapped_column(Date)
    min_salary: Mapped[Optional[int]] = mapped_column(nullable=True)
    max_salary: Mapped[Optional[int]] = mapped_column(nullable=True)
    salary_period: Mapped[Optional[SalaryPeriod]] = mapped_column(
        SqlEnum(SalaryPeriod, name="salary_period_enum"), nullable=True
    )