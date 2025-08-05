from typing import Optional
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: Optional[str] = None
    authType: str = "local"
    disabled: bool = False
    name: Optional[str] = None
    surname: Optional[str] = None
    picture: Optional[str] = None

class UserRead(BaseModel):
    id: int
    email: EmailStr
    disabled: bool = False
    name: Optional[str] = None
    surname: Optional[str] = None
    picture: Optional[str] = None

    model_config = {
        "from_attributes": True
    }