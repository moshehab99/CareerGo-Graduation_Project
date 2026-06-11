"""
Pydantic models for CV data extraction and validation.
"""

from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


class Education(BaseModel):
    """Education model for CV."""
    degree: str = Field(..., description="Degree obtained")
    institution: str = Field(..., description="Educational institution")
    graduation_year: str = Field(..., description="Year of graduation")


class Experience(BaseModel):
    """Work experience model for CV."""
    job_title: str = Field(..., description="Job title")
    company: str = Field(..., description="Company name")
    duration: str = Field(..., description="Duration of employment")
    description: str = Field(..., description="Job responsibilities and achievements")


class Project(BaseModel):
    """Project model for CV."""
    name: str = Field(..., description="Project name")
    description: str = Field(..., description="Project description")
    technologies: List[str] = Field(default=[], description="Technologies used")


class Certification(BaseModel):
    """Certification model for CV."""
    name: str = Field(..., description="Certification name")
    issuer: str = Field(..., description="Certification issuer")
    date: str = Field(..., description="Date obtained")


class CandidateProfile(BaseModel):
    """Complete candidate profile extracted from CV."""
    full_name: str = Field(..., description="Candidate's full name")
    email: str = Field(..., description="Contact email")
    phone: str = Field(..., description="Contact phone number")
    location: str = Field(..., description="Current location")
    
    linkedin_url: Optional[str] = Field(default=None, description="LinkedIn profile URL")
    github_url: Optional[str] = Field(default=None, description="GitHub profile URL")
    portfolio_url: Optional[str] = Field(default=None, description="Portfolio website URL")
    
    summary: str = Field(..., description="Professional summary or objective")
    
    skills: List[str] = Field(default=[], description="List of skills")
    languages: List[str] = Field(default=[], description="Languages spoken")
    
    education: List[Education] = Field(default=[], description="Educational background")
    experience: List[Experience] = Field(default=[], description="Work experience")
    projects: List[Project] = Field(default=[], description="Projects")
    certifications: List[Certification] = Field(default=[], description="Certifications")
    
    total_experience_years: float = Field(default=0, description="Total years of experience")


class CVValidationResponse(BaseModel):
    """Response from CV validation."""
    is_cv: bool = Field(..., description="Whether the document is a CV")
    confidence: int = Field(..., description="Confidence score 0-100")
    reason: str = Field(..., description="Reason for validation result")
