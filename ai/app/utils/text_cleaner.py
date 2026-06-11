"""
Utility functions for text cleaning and normalization.
"""

import re
from typing import List


def clean_text(text: str) -> str:
    """
    Clean and normalize text.
    
    Args:
        text: Raw text to clean
        
    Returns:
        Cleaned text
    """
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters but keep necessary ones
    text = re.sub(r'[^\w\s\-.,/@#]', '', text)
    return text.strip()


def normalize_skills(skills: List[str]) -> List[str]:
    """
    Normalize skill names for comparison.
    
    Args:
        skills: List of skill names
        
    Returns:
        Normalized skill list
    """
    normalized = []
    for skill in skills:
        # Convert to lowercase and strip whitespace
        normalized_skill = skill.lower().strip()
        if normalized_skill and normalized_skill not in normalized:
            normalized.append(normalized_skill)
    return normalized


def calculate_skill_similarity(skill1: str, skill2: str) -> float:
    """
    Calculate similarity between two skills.
    
    Args:
        skill1: First skill
        skill2: Second skill
        
    Returns:
        Similarity score 0-1
    """
    s1 = skill1.lower().strip()
    s2 = skill2.lower().strip()
    
    # Exact match
    if s1 == s2:
        return 1.0
    
    # Partial match (e.g., "python" in "python 3.11")
    if s1 in s2 or s2 in s1:
        return 0.8
    
    # Check for common abbreviations and variations
    variations = {
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'sql': 'database',
        'rest': 'restful api',
        'api': 'apis'
    }
    
    if s1 in variations and variations[s1] == s2:
        return 0.8
    if s2 in variations and variations[s2] == s1:
        return 0.8
    
    return 0.0


def find_matching_skills(
    required_skills: List[str],
    candidate_skills: List[str],
    threshold: float = 0.8
) -> tuple[List[str], List[str]]:
    """
    Find matching skills between required and candidate skills.
    
    Args:
        required_skills: List of required skills
        candidate_skills: List of candidate's skills
        threshold: Similarity threshold for matching
        
    Returns:
        Tuple of (matched_skills, missing_skills)
    """
    normalized_required = normalize_skills(required_skills)
    normalized_candidate = normalize_skills(candidate_skills)
    
    matched = []
    missing = []
    
    for required in normalized_required:
        best_match = None
        best_score = 0
        
        for candidate in normalized_candidate:
            score = calculate_skill_similarity(required, candidate)
            if score > best_score:
                best_score = score
                best_match = candidate
        
        if best_score >= threshold:
            matched.append(required)
        else:
            missing.append(required)
    
    return matched, missing


def extract_years_from_text(text: str) -> int:
    """
    Extract years from duration text.
    
    Args:
        text: Duration text (e.g., "2 years 3 months", "3+ years")
        
    Returns:
        Number of years as integer
    """
    # Look for year patterns
    patterns = [
        r'(\d+)\+?\s*years?',
        r'(\d+)\s*-\s*(\d+)\s*years?'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            if len(match.groups()) == 2:
                # Range format: return the first number
                return int(match.group(1))
            else:
                return int(match.group(1))
    
    return 0
