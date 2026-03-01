from fastapi import FastAPI, Response, status
from src.api.main import api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="jobsdublin.ie")
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://jobsdublin.onrender.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

@app.head("/")
async def root():
    return { "message": "JobsDublin.ie API. Add /docs to the link at the top. 🚀" }

@app.head("/")
async def root_head():
    return Response(status_code=status.HTTP_200_OK) 