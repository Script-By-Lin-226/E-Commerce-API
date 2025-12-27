from fastapi import APIRouter, UploadFile, File, Depends
from fastapi.responses import JSONResponse
from app.core.dependency import role_required
from typing import Optional
import os
import shutil
from pathlib import Path

router = APIRouter(prefix="/upload", tags=["Upload"])

# Ensure upload directory exists
UPLOAD_DIR = Path(__file__).parent.parent.parent / "images" / "products"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    role = Depends(role_required("admin", "sale", "hr"))
):
    """
    Upload a product image file.
    Returns the URL path to access the uploaded image.
    """
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        return JSONResponse(
            status_code=400,
            content={"detail": f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"}
        )
    
    # Check file size
    file_content = await file.read()
    if len(file_content) > MAX_FILE_SIZE:
        return JSONResponse(
            status_code=400,
            content={"detail": f"File too large. Maximum size: {MAX_FILE_SIZE / 1024 / 1024}MB"}
        )
    
    # Generate unique filename
    import uuid
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
        
        # Return the URL path
        image_url = f"/images/products/{unique_filename}"
        return JSONResponse(
            status_code=200,
            content={
                "message": "File uploaded successfully",
                "image_url": image_url,
                "filename": unique_filename
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Failed to save file: {str(e)}"}
        )

@router.delete("/image/{filename}")
async def delete_image(
    filename: str,
    role = Depends(role_required("admin", "sale", "hr"))
):
    """
    Delete an uploaded image file.
    """
    file_path = UPLOAD_DIR / filename
    
    # Security check: ensure file is in upload directory
    if not str(file_path).startswith(str(UPLOAD_DIR)):
        return JSONResponse(
            status_code=400,
            content={"detail": "Invalid file path"}
        )
    
    if not file_path.exists():
        return JSONResponse(
            status_code=404,
            content={"detail": "File not found"}
        )
    
    try:
        file_path.unlink()
        return JSONResponse(
            status_code=200,
            content={"message": "File deleted successfully"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Failed to delete file: {str(e)}"}
        )

