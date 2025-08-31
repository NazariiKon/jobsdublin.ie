import re
from typing import Optional
from pydantic import BaseModel, field_validator

from src.schemas.user import UserRead
from src.schemas.employer import EmployerRead

class CompanyCreate(BaseModel):
    title: str
    phone_number: Optional[str] = None
    size: Optional[str] = None
    industry: Optional[str] = None
    desc: Optional[str] = None
    website: Optional[str] = None
    
    @field_validator("phone_number")
    def validate_phone(cls, v):
        if v is None:
            return v
        pattern = r'^\+?\d{7,15}$'
        if not re.match(pattern, v):
            raise ValueError("Invalid phone number format")
        return v
    
class CompanyRead(BaseModel):
    id: int
    title: str
    size: Optional[str] = None
    industry: Optional[str] = None
    desc: Optional[str] = None
    phone_number: Optional[str] = None
    website: Optional[str] = None
    creator_id: int
    creator: Optional[EmployerRead]
    creator_user: Optional[UserRead] 

    model_config = {
        "from_attributes": True
    }
