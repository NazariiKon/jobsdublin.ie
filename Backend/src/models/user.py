from sqlalchemy import Boolean
from src.database import Base
from sqlalchemy.orm import Mapped, mapped_column

class User(Base):
    __tablename__ = "tblUser"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True)
    password: Mapped[bytes]
    disabled: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
