from fastapi import APIRouter

from src.api.routes import users, database, login, vacancies, companies

api_router = APIRouter()
api_router.include_router(users.router)
api_router.include_router(database.router)
api_router.include_router(login.router)
api_router.include_router(vacancies.router)
api_router.include_router(companies.router)