from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime
from src.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone

if TYPE_CHECKING:
    from src.models.user import User
    from src.models.vacancy import Vacancy

class UserVacancy(Base):
    __tablename__ = "users_vacancies"
    id: Mapped[int] = mapped_column(primary_key=True)
    vacancy_id: Mapped[int] = mapped_column(ForeignKey("vacancies.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    cv_path: Mapped[str] = mapped_column()
    vacancy: Mapped["Vacancy"] = relationship("Vacancy", back_populates="applications")
    user: Mapped["User"] = relationship("User", back_populates="applications")