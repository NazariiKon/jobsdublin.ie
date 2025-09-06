from datetime import datetime
from pydantic import BaseModel
from src.models.user_vacancy import Statuses

from src.schemas.user import UserRead

class UserVacancy(BaseModel):
    id: int
    user: UserRead
    created_at: datetime
    cv_path: str
    status: Statuses = Statuses.PENDING

    model_config = {
        "from_attributes": True
    }

class StatusUpdate(BaseModel):
    status: str