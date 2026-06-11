"""
Pydantic models for job matching functionality.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class JobDescription(BaseModel):
    """Job description model for matching."""
    title: str = Field(..., description="Job title")
    description: str = Field(..., description="Job description")
    required_skills: List[str] = Field(..., description="Required skills")
    required_experience_years: int = Field(default=0, description="Required years of experience")
    preferred_certifications: List[str] = Field(default=[], description="Preferred certifications")
    required_languages: List[str] = Field(default=[], description="Required languages")


class MatchRequest(BaseModel):
    """Request model for job matching."""
    candidate: dict = Field(..., description="Extracted candidate profile")
    job: JobDescription = Field(..., description="Job description")


class MatchResponse(BaseModel):
    """Response model for job matching."""
    match_score: int = Field(..., ge=0, le=100, description="Final match score 0-100")
    recommendation: str = Field(..., description="Recommendation level")
    
    matched_skills: List[str] = Field(default=[], description="Skills that match")
    missing_skills: List[str] = Field(default=[], description="Missing required skills")
    
    matched_certifications: List[str] = Field(default=[], description="Matched certifications")
    missing_certifications: List[str] = Field(default=[], description="Missing certifications")
    
    matched_languages: List[str] = Field(default=[], description="Matched languages")
    missing_languages: List[str] = Field(default=[], description="Missing languages")
    
    strengths: List[str] = Field(default=[], description="Candidate strengths for this role")
    weaknesses: List[str] = Field(default=[], description="Candidate weaknesses for this role")


class DetailedMatchScore(BaseModel):
    """Detailed breakdown of match scores."""
    skills_score: float = Field(..., ge=0, le=1, description="Skills match score 0-1")
    experience_score: float = Field(..., ge=0, le=1, description="Experience match score 0-1")
    projects_score: float = Field(..., ge=0, le=1, description="Projects match score 0-1")
    certificate_score: float = Field(..., ge=0, le=1, description="Certificate match score 0-1")
    language_score: float = Field(..., ge=0, le=1, description="Language match score 0-1")
