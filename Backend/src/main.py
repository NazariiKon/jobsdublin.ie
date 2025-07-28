from fastapi import FastAPI
from src.api.main import api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="jobsdublin.ie")
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)