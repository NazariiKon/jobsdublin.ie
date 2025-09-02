from fastapi import APIRouter, Depends, HTTPException, status

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from src.services.employer_service import EmployerService
from src.api.dependencies import get_company_service, get_employer_service, get_user_service
from src.api.routes.login import create_token, login
from src.schemas.company import CompanyCreate
from src.api.routes.companies import create_company
from src.services.company_service import CompanyService
from src.database import get_session
from src.services.user_service import UserService
from src.schemas.user import EmployerSignup, UserCreate, UserRead
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/users", tags=["users"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/create_user", response_model=UserRead)
async def create_user(data: UserCreate, session: AsyncSession = Depends(get_session)):
    user_service = UserService(session)
    user = await user_service.get_user_by_email(data.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this email already exists in the system."
        )
    user = await user_service.create_user(data, auth_type=data.authType)
    return UserRead.model_validate(user)

@router.post("/create_employer")
async def create_employer(
    data: EmployerSignup,
    user_service: UserService = Depends(get_user_service),
    company_service: CompanyService = Depends(get_company_service),
    employer_service: EmployerService = Depends(get_employer_service)
):
    existing_user = await user_service.get_user_by_email(data.email)

    if existing_user:
        existing_user = await user_service.update_user(existing_user, data)
        employer = await employer_service.create_employer(existing_user.id)
        user_for_token = existing_user
    else:
        new_user = await user_service.create_employer(data)
        user_for_token = new_user
        employer = await user_service.get_employer_by_user_id(new_user.id)

    company = await company_service.create_company(
        CompanyCreate(title=data.cmp, phone_number=data.phone),
        employer.id
    )

    token = await create_token(UserRead.model_validate(user_for_token))

    return {"employer": employer, "company": company, "token": token}

