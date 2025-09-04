from datetime import datetime
from typing import Optional
from pydantic import BaseModel

from src.schemas.user import UserRead

class UserVacancy(BaseModel):
    id: int
    user: UserRead
    created_at: datetime
    cv_path: str

    model_config = {
        "from_attributes": True
    }