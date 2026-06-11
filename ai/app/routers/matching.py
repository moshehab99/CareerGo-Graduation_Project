"""
API routes for job matching functionality.
"""

import logging
from fastapi import APIRouter, HTTPException, status
from app.models.cv_models import CandidateProfile
from app.models.matching_models import MatchRequest, MatchResponse
from app.services.matching_service import MatchingService

router = APIRouter(prefix="/match", tags=["Job Matching"])
logger = logging.getLogger(__name__)


@router.post(
    "/job",
    response_model=MatchResponse,
    summary="Match candidate to job",
    description="Match a candidate profile to a job description and calculate compatibility score",
    responses={
        200: {
            "description": "Match result with score and recommendations",
            "content": {
                "application/json": {
                    "example": {
                        "match_score": 87,
                        "recommendation": "Recommended",
                        "matched_skills": ["Python", "FastAPI"],
                        "missing_skills": ["Docker"],
                        "matched_certifications": [],
                        "missing_certifications": [],
                        "matched_languages": ["English"],
                        "missing_languages": [],
                        "strengths": ["Has all core skills", "Exceeds experience requirement"],
                        "weaknesses": ["Missing Docker experience"]
                    }
                }
            }
        },
        400: {
            "description": "Invalid request data",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Invalid request data"
                    }
                }
            }
        }
    }
)
async def match_job(request: MatchRequest) -> MatchResponse:
    """
    Match a candidate to a job position.
    
    Scoring Algorithm:
    - Skills Match: 50% weight
    - Experience Match: 20% weight
    - Projects Match: 10% weight
    - Certifications Match: 10% weight
    - Languages Match: 10% weight
    
    Final score ranges from 0-100:
    - 90-100: Highly Recommended
    - 75-89: Recommended
    - 60-74: Consider
    - 0-59: Not Recommended
    
    Args:
        request: Match request with candidate profile and job description
        
    Returns:
        Match response with score, recommendation, and detailed analysis
        
    Raises:
        HTTPException: If request data is invalid or matching fails
    """
    try:
        # Validate request data
        if not request.candidate:
            raise ValueError("Candidate profile is required")
        
        if not request.job:
            raise ValueError("Job description is required")
        
        # Parse candidate profile
        try:
            candidate = CandidateProfile(**request.candidate)
        except Exception as e:
            logger.error(f"Error parsing candidate profile: {str(e)}")
            raise ValueError(f"Invalid candidate profile: {str(e)}")
        
        # Perform matching
        match_response = MatchingService.match_candidate_to_job(candidate, request.job)
        
        logger.info(
            f"Job matching completed: "
            f"Candidate: {candidate.full_name}, "
            f"Job: {request.job.title}, "
            f"Score: {match_response.match_score}"
        )
        
        return match_response
    
    except ValueError as e:
        logger.error(f"Validation error in job matching: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error in job matching: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing job match: {str(e)}"
        )


@router.get(
    "/health",
    summary="Health check",
    description="Check if the matching service is operational",
    responses={
        200: {
            "description": "Service is operational",
            "content": {
                "application/json": {
                    "example": {
                        "status": "ok",
                        "message": "Job matching service is operational"
                    }
                }
            }
        }
    }
)
async def health_check():
    """
    Health check endpoint for the matching service.
    
    Returns:
        Health status
    """
    return {
        "status": "ok",
        "message": "Job matching service is operational"
    }
