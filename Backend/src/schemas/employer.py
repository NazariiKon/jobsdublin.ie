from pydantic import BaseModel

class EmployerRead(BaseModel):
    id: int
    user_id: int

    model_config = {
        "from_attributes": True
    }