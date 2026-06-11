"""
API routes for CV upload and validation.
"""

import os
import logging
from typing import Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.services.cv_parser import CVParser
from app.services.gemini_service import GeminiService
from app.models.cv_models import CVValidationResponse, CandidateProfile

router = APIRouter(prefix="/cv", tags=["CV Management"])
logger = logging.getLogger(__name__)


def get_upload_path(filename: str) -> str:
    """Get path for uploaded file."""
    uploads_dir = os.path.join(os.path.dirname(__file__), "../../uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    return os.path.join(uploads_dir, filename)


@router.post(
    "/upload-cv",
    response_model=CVValidationResponse,
    summary="Validate and upload CV",
    description="Upload a CV file (PDF or DOCX) and validate if it's a legitimate CV using Gemini",
    responses={
        200: {
            "description": "CV validation result",
            "content": {
                "application/json": {
                    "example": {
                        "is_cv": True,
                        "confidence": 95,
                        "reason": "Professional CV with clear sections and content"
                    }
                }
            }
        },
        400: {
            "description": "Invalid file format or document is not a CV",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Document is not a professional CV/Resume"
                    }
                }
            }
        },
        413: {
            "description": "File too large",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "File size exceeds maximum limit"
                    }
                }
            }
        }
    }
)
async def upload_cv(file: UploadFile = File(...)) -> CVValidationResponse:
    """
    Upload and validate a CV file.
    
    Process:
    1. Validate file format (PDF or DOCX)
    2. Save file to uploads directory
    3. Extract text from file
    4. Send to Gemini for validation
    5. Return validation result
    
    Args:
        file: CV file to upload
        
    Returns:
        Validation result
        
    Raises:
        HTTPException: If file format is invalid or validation fails
    """
    # Validate file size (max 10 MB)
    max_size = 10 * 1024 * 1024
    file_size = 0
    
    try:
        # Check file format
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        if file_ext not in {'.pdf', '.docx'}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file format: {file_ext}. Supported formats: .pdf, .docx"
            )
        
        # Read and save file
        file_path = get_upload_path(file.filename)
        contents = await file.read()
        file_size = len(contents)
        
        if file_size > max_size:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File size exceeds maximum limit of 10 MB"
            )
        
        with open(file_path, 'wb') as f:
            f.write(contents)
        
        # Extract text from file
        cv_text = CVParser.extract_text(file_path)
        
        if not cv_text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract text from the uploaded file"
            )
        
        # Validate with Gemini
        gemini_service = GeminiService()
        validation_result = gemini_service.validate_cv(cv_text)
        
        # Clean up file if not a valid CV
        if not validation_result.get("is_cv", False):
            try:
                os.remove(file_path)
            except Exception as e:
                logger.warning(f"Could not delete invalid CV file: {str(e)}")
            
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Document is not a professional CV/Resume: {validation_result.get('reason', 'Unknown reason')}"
            )
        
        logger.info(f"CV validated successfully: {file.filename}")
        
        return CVValidationResponse(**validation_result)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading CV: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing CV: {str(e)}"
        )


@router.post(
    "/extract-cv",
    response_model=CandidateProfile,
    summary="Extract CV information",
    description="Upload a CV file and extract structured candidate information using Gemini",
    responses={
        200: {
            "description": "Extracted candidate profile",
            "content": {
                "application/json": {
                    "example": {
                        "full_name": "John Doe",
                        "email": "john@example.com",
                        "phone": "+1234567890",
                        "location": "New York, USA",
                        "skills": ["Python", "FastAPI", "Docker"],
                        "experience": [],
                        "education": [],
                        "projects": [],
                        "certifications": [],
                        "total_experience_years": 5
                    }
                }
            }
        },
        400: {
            "description": "Invalid file format or extraction failed",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Error extracting CV data"
                    }
                }
            }
        }
    }
)
async def extract_cv(file: UploadFile = File(...)) -> CandidateProfile:
    """
    Extract structured information from CV.
    
    Process:
    1. Validate file format
    2. Extract text from file
    3. Send to Gemini for extraction
    4. Parse and validate with Pydantic
    5. Return candidate profile
    
    Args:
        file: CV file to extract from
        
    Returns:
        Candidate profile with extracted information
        
    Raises:
        HTTPException: If file format is invalid or extraction fails
    """
    try:
        # Check file format
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        if file_ext not in {'.pdf', '.docx'}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file format: {file_ext}. Supported formats: .pdf, .docx"
            )
        
        # Read file
        file_path = get_upload_path(file.filename)
        contents = await file.read()
        
        # Validate file size
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File size exceeds maximum limit of 10 MB"
            )
        
        with open(file_path, 'wb') as f:
            f.write(contents)
        
        # Extract text
        cv_text = CVParser.extract_text(file_path)
        
        if not cv_text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract text from the uploaded file"
            )
        
        # Extract with Gemini
        gemini_service = GeminiService()
        extracted_data = gemini_service.extract_cv_data(cv_text)
        
        # Validate and parse with Pydantic
        candidate_profile = CandidateProfile(**extracted_data)
        
        logger.info(f"CV extracted successfully: {file.filename}")
        
        return candidate_profile
    
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error extracting CV data: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Error extracting CV: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing CV: {str(e)}"
        )
