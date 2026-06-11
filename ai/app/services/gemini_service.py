"""
Service for interacting with Google Gemini API.
"""

import os
import json
import logging
from typing import Dict, Any
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)


class GeminiService:
    """Service for Gemini API interactions."""
    
    def __init__(self):
        """Initialize Gemini service with API key."""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-2.5-flash")
    
    def validate_cv(self, cv_text: str) -> Dict[str, Any]:
        """
        Validate if the provided text is a professional CV/Resume.
        
        Args:
            cv_text: Extracted text from CV file
            
        Returns:
            Validation result with is_cv, confidence, and reason
        """
        prompt = f"""Determine if the following document is a professional CV/Resume.

Document:
{cv_text}

Return ONLY valid JSON in this exact format:
{{
  "is_cv": true,
  "confidence": 95,
  "reason": "..."
}}

If document is not a CV:
{{
  "is_cv": false,
  "confidence": 20,
  "reason": "..."
}}"""
        
        try:
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Try to extract JSON from response
            json_match = self._extract_json(response_text)
            if json_match:
                result = json.loads(json_match)
                return result
            else:
                logger.error(f"Failed to parse Gemini response: {response_text}")
                return {
                    "is_cv": False,
                    "confidence": 0,
                    "reason": "Failed to validate document"
                }
        
        except Exception as e:
            logger.error(f"Error validating CV with Gemini: {str(e)}")
            raise
    
    def extract_cv_data(self, cv_text: str) -> Dict[str, Any]:
        """
        Extract structured candidate information from CV text using Gemini.
        
        Args:
            cv_text: Extracted text from CV file
            
        Returns:
            Structured candidate profile
        """
        #cv_text = cv_text[:5000]
        prompt = f"""Extract structured information from the following CV/Resume.

CV Text:
{cv_text}

Return ONLY valid JSON in this exact format (fill with extracted data or empty strings/arrays if not found):
{{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "location": "New York, USA",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "github_url": "https://github.com/johndoe",
  "portfolio_url": "https://johndoe.com",
  "summary": "Professional summary here",
  "skills": ["Python", "FastAPI", "Docker"],
  "languages": ["English", "Spanish"],
  "education": [
    {{
      "degree": "BS in Computer Science",
      "institution": "MIT",
      "graduation_year": "2020"
    }}
  ],
  "experience": [
    {{
      "job_title": "Senior Backend Engineer",
      "company": "Tech Company",
      "duration": "2 years",
      "description": "Developed and maintained APIs"
    }}
  ],
  "projects": [
    {{
      "name": "Project Name",
      "description": "Project description",
      "technologies": ["Python", "FastAPI"]
    }}
  ],
  "certifications": [
    {{
      "name": "AWS Certified",
      "issuer": "Amazon",
      "date": "2023"
    }}
  ],
  "total_experience_years": 5
}}

IMPORTANT:
- Extract exactly what's in the CV
- If information is not found, use empty strings or empty arrays
- For total_experience_years, calculate from the experience entries
- Ensure all URLs start with http:// or https://
- Return ONLY JSON, no other text"""
        
        try:
            print("Before Gemini")
            response = self.model.generate_content(prompt)
            print("After Gemini")
            response_text = response.text.strip()
            
            # Try to extract JSON from response
            json_match = self._extract_json(response_text)
            if json_match:
                result = json.loads(json_match)
                return result
            else:
                logger.error(f"Failed to parse Gemini response: {response_text}")
                raise ValueError("Failed to parse Gemini response as JSON")
        
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {str(e)}")
            raise ValueError(f"Invalid JSON response from Gemini: {str(e)}")
        except Exception as e:
            logger.error(f"Error extracting CV data with Gemini: {str(e)}")
            raise
    
    @staticmethod
    def _extract_json(text: str) -> str:
        """
        Extract JSON from text that may contain other content.
        
        Args:
            text: Text that may contain JSON
            
        Returns:
            JSON string or None
        """
        # Try to find JSON object in the text
        start_idx = text.find('{')
        if start_idx == -1:
            return None
        
        # Find the matching closing brace
        brace_count = 0
        for i in range(start_idx, len(text)):
            if text[i] == '{':
                brace_count += 1
            elif text[i] == '}':
                brace_count -= 1
                if brace_count == 0:
                    return text[start_idx:i+1]
        
        return None
