from pydantic import BaseModel, EmailStr

class UserSchema(BaseModel):
    email: EmailStr
    password: str
    authType: str = "local"
    disabled: bool = False
