from pydantic import BaseModel, EmailStr

class GoogleLoginSchema(BaseModel):
    email: EmailStr
    family_name: str
    given_name: str
    name: str
    picture: str