import os
from fastapi import HTTPException, UploadFile, status

UPLOAD_DIR = "uploads"

async def save_cv(file: UploadFile) -> str:
    path = os.path.join(UPLOAD_DIR, file.filename)
    with open(path, "wb") as f:
        f.write(await file.read())
    return path

def validate_file(file: UploadFile, allowed_extensions=("pdf", "docx", "doc", "rtf", "txt"), max_size_mb=5):
    if not file.filename.lower().endswith(tuple(allowed_extensions)):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file type")

    file.file.seek(0, 2)
    size = file.file.tell() / (1024*1024)
    file.file.seek(0)

    if size > max_size_mb:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File too large")