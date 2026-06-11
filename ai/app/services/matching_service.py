"""
Service for job matching and scoring logic.
"""

import logging
from typing import List, Tuple
from app.models.cv_models import CandidateProfile
from app.models.matching_models import JobDescription, MatchResponse, DetailedMatchScore
from app.utils.text_cleaner import (
    normalize_skills,
    find_matching_skills,
    extract_years_from_text
)

logger = logging.getLogger(__name__)


class MatchingService:
    """Service for matching candidates to jobs and calculating match scores."""
    
    # Scoring weights
    SKILLS_WEIGHT = 0.50
    EXPERIENCE_WEIGHT = 0.20
    PROJECTS_WEIGHT = 0.10
    CERTIFICATE_WEIGHT = 0.10
    LANGUAGE_WEIGHT = 0.10
    
    @staticmethod
    def calculate_skills_score(
        required_skills: List[str],
        candidate_skills: List[str]
    ) -> Tuple[float, List[str], List[str]]:
        """
        Calculate skills match score.
        
        Score = matched_skills / required_skills
        
        Args:
            required_skills: List of required skills
            candidate_skills: List of candidate's skills
            
        Returns:
            Tuple of (score, matched_skills, missing_skills)
        """
        if not required_skills:
            return 1.0, candidate_skills, []
        
        matched, missing = find_matching_skills(required_skills, candidate_skills)
        score = len(matched) / len(required_skills)
        
        return score, matched, missing
    
    @staticmethod
    def calculate_experience_score(
        required_experience_years: int,
        candidate_experience_years: int
    ) -> float:
        """
        Calculate experience match score.
        
        If candidate experience >= required: score = 1.0
        Otherwise: score = candidate / required
        
        Args:
            required_experience_years: Required years of experience
            candidate_experience_years: Candidate's years of experience
            
        Returns:
            Experience match score
        """
        if required_experience_years == 0:
            return 1.0
        
        if candidate_experience_years >= required_experience_years:
            return 1.0
        
        score = candidate_experience_years / required_experience_years
        return min(score, 1.0)
    
    @staticmethod
    def calculate_projects_score(
        required_skills: List[str],
        candidate_projects: List[dict]
    ) -> float:
        """
        Calculate projects match score.
        
        Check if project names/descriptions contain required skills/keywords.
        
        Args:
            required_skills: List of required skills
            candidate_projects: List of candidate's projects
            
        Returns:
            Projects match score
        """
        if not required_skills or not candidate_projects:
            return 0.0
        
        normalized_skills = normalize_skills(required_skills)
        matched_count = 0
        
        for project in candidate_projects:
            project_text = (
                f"{project.get('name', '')} {project.get('description', '')} "
                f"{' '.join(project.get('technologies', []))}"
            ).lower()
            
            for skill in normalized_skills:
                if skill in project_text:
                    matched_count += 1
                    break  # Count each project only once
        
        # Score based on percentage of projects that mention skills
        score = matched_count / len(candidate_projects) if candidate_projects else 0.0
        return min(score, 1.0)
    
    @staticmethod
    def calculate_certificate_score(
        preferred_certifications: List[str],
        candidate_certifications: List[dict]
    ) -> Tuple[float, List[str], List[str]]:
        """
        Calculate certification match score.
        
        Args:
            preferred_certifications: List of preferred certifications
            candidate_certifications: List of candidate's certifications
            
        Returns:
            Tuple of (score, matched_certs, missing_certs)
        """
        if not preferred_certifications:
            return 1.0, [], []
        
        candidate_cert_names = [cert.get('name', '').lower() for cert in candidate_certifications]
        matched = []
        missing = []
        
        for preferred in preferred_certifications:
            preferred_lower = preferred.lower()
            found = any(preferred_lower in cert_name for cert_name in candidate_cert_names)
            
            if found:
                matched.append(preferred)
            else:
                missing.append(preferred)
        
        score = len(matched) / len(preferred_certifications) if preferred_certifications else 0.0
        return min(score, 1.0), matched, missing
    
    @staticmethod
    def calculate_language_score(
        required_languages: List[str],
        candidate_languages: List[str]
    ) -> Tuple[float, List[str], List[str]]:
        """
        Calculate language match score.
        
        Args:
            required_languages: List of required languages
            candidate_languages: List of candidate's languages
            
        Returns:
            Tuple of (score, matched_languages, missing_languages)
        """
        if not required_languages:
            return 1.0, candidate_languages, []
        
        normalized_candidate_langs = normalize_skills(candidate_languages)
        matched = []
        missing = []
        
        for required in required_languages:
            required_lower = required.lower().strip()
            found = any(required_lower in lang for lang in normalized_candidate_langs)
            
            if found:
                matched.append(required)
            else:
                missing.append(required)
        
        score = len(matched) / len(required_languages) if required_languages else 0.0
        return min(score, 1.0), matched, missing
    
    @staticmethod
    def calculate_final_score(detailed_scores: DetailedMatchScore) -> int:
        """
        Calculate final match score.
        
        final_score = (
            skills_score * 50 +
            experience_score * 20 +
            projects_score * 10 +
            certificate_score * 10 +
            language_score * 10
        )
        
        Args:
            detailed_scores: Detailed match scores
            
        Returns:
            Final score 0-100
        """
        final = (
            detailed_scores.skills_score * MatchingService.SKILLS_WEIGHT * 100 +
            detailed_scores.experience_score * MatchingService.EXPERIENCE_WEIGHT * 100 +
            detailed_scores.projects_score * MatchingService.PROJECTS_WEIGHT * 100 +
            detailed_scores.certificate_score * MatchingService.CERTIFICATE_WEIGHT * 100 +
            detailed_scores.language_score * MatchingService.LANGUAGE_WEIGHT * 100
        )
        
        return int(round(final))
    
    @staticmethod
    def get_recommendation(score: int) -> str:
        """
        Get recommendation based on match score.
        
        Args:
            score: Match score 0-100
            
        Returns:
            Recommendation level
        """
        if score >= 90:
            return "Highly Recommended"
        elif score >= 75:
            return "Recommended"
        elif score >= 60:
            return "Consider"
        else:
            return "Not Recommended"
    
    @staticmethod
    def generate_strengths_weaknesses(
        candidate: CandidateProfile,
        job: JobDescription,
        matched_skills: List[str],
        missing_skills: List[str],
        experience_score: float
    ) -> Tuple[List[str], List[str]]:
        """
        Generate strengths and weaknesses for the match.
        
        Args:
            candidate: Candidate profile
            job: Job description
            matched_skills: Matched skills
            missing_skills: Missing skills
            experience_score: Experience match score
            
        Returns:
            Tuple of (strengths, weaknesses)
        """
        strengths = []
        weaknesses = []
        
        # Skills-based strengths
        if len(matched_skills) == len(job.required_skills):
            strengths.append("Has all required skills")
        elif matched_skills:
            strengths.append(f"Has {len(matched_skills)}/{len(job.required_skills)} required skills")
        
        # Experience strengths
        if experience_score == 1.0:
            if candidate.total_experience_years > job.required_experience_years:
                strengths.append(
                    f"Has {candidate.total_experience_years} years of experience "
                    f"(exceeds requirement of {job.required_experience_years})"
                )
            else:
                strengths.append(f"Meets experience requirement of {job.required_experience_years} years")
        
        # Education strengths
        if candidate.education:
            strengths.append(f"Has {len(candidate.education)} degree(s)")
        
        # Projects strengths
        if candidate.projects:
            strengths.append(f"Has {len(candidate.projects)} relevant projects")
        
        # Skills-based weaknesses
        if missing_skills:
            skills_str = ", ".join(missing_skills[:3])
            if len(missing_skills) > 3:
                skills_str += f" and {len(missing_skills) - 3} more"
            weaknesses.append(f"Missing required skills: {skills_str}")
        
        # Experience weaknesses
        if experience_score < 1.0:
            weaknesses.append(
                f"Has {candidate.total_experience_years} years of experience "
                f"(requires {job.required_experience_years} years)"
            )
        
        return strengths, weaknesses
    
    @classmethod
    def match_candidate_to_job(
        cls,
        candidate: CandidateProfile,
        job: JobDescription
    ) -> MatchResponse:
        """
        Match a candidate to a job and generate match response.
        
        Args:
            candidate: Candidate profile
            job: Job description
            
        Returns:
            Match response with scores and recommendations
        """
        # Calculate individual scores
        skills_score, matched_skills, missing_skills = cls.calculate_skills_score(
            job.required_skills,
            candidate.skills
        )
        
        experience_score = cls.calculate_experience_score(
            job.required_experience_years,
            candidate.total_experience_years
        )
        
        projects_score = cls.calculate_projects_score(
            job.required_skills,
            [p.dict() for p in candidate.projects]
        )
        
        certificate_score, matched_certs, missing_certs = cls.calculate_certificate_score(
            job.preferred_certifications,
            [c.dict() for c in candidate.certifications]
        )
        
        language_score, matched_langs, missing_langs = cls.calculate_language_score(
            job.required_languages,
            candidate.languages
        )
        
        # Create detailed score object
        detailed_scores = DetailedMatchScore(
            skills_score=skills_score,
            experience_score=experience_score,
            projects_score=projects_score,
            certificate_score=certificate_score,
            language_score=language_score
        )
        
        # Calculate final score
        final_score = cls.calculate_final_score(detailed_scores)
        recommendation = cls.get_recommendation(final_score)
        
        # Generate strengths and weaknesses
        strengths, weaknesses = cls.generate_strengths_weaknesses(
            candidate,
            job,
            matched_skills,
            missing_skills,
            experience_score
        )
        
        # Build response
        return MatchResponse(
            match_score=final_score,
            recommendation=recommendation,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            matched_certifications=matched_certs,
            missing_certifications=missing_certs,
            matched_languages=matched_langs,
            missing_languages=missing_langs,
            strengths=strengths,
            weaknesses=weaknesses
        )
