from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base

if TYPE_CHECKING:
    from src.models import Vacancy, Employer

class Company(Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(unique=True)
    size: Mapped[Optional[str]] = mapped_column(nullable=True)
    industry: Mapped[Optional[str]] = mapped_column(nullable=True)
    desc: Mapped[Optional[str]] = mapped_column(nullable=True)
    phone_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    website: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    creator_id: Mapped[int] = mapped_column(ForeignKey("employers.id"))

    creator: Mapped["Employer"] = relationship("Employer")
    vacancies: Mapped[List["Vacancy"]] = relationship(back_populates="company")