from pydantic import BaseModel

# JSON payload containing access token
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
