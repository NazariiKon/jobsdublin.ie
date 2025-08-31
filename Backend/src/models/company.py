from typing import TYPE_CHECKING, ClassVar, List, Optional
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models.user import User
from src.database import Base

if TYPE_CHECKING:
    from src.models import Vacancy, Employer

class Company(Base):
    __tablename__ = "companies"
    __allow_unmapped__ = True

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(unique=True)
    size: Mapped[Optional[str]] = mapped_column(nullable=True)
    industry: Mapped[Optional[str]] = mapped_column(nullable=True)
    desc: Mapped[Optional[str]] = mapped_column(nullable=True)
    phone_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    website: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    creator_id: Mapped[int] = mapped_column(ForeignKey("employers.id"))
    creator_user: ClassVar[Optional["User"]] = None
    creator: Mapped["Employer"] = relationship("Employer", lazy="selectin")
    vacancies: Mapped[List["Vacancy"]] = relationship(back_populates="company")
    