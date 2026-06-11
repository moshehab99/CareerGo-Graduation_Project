# Smart Job Matching Platform - AI Microservice

A production-ready FastAPI microservice for intelligent CV validation, parsing, and job matching using Google's Gemini API.

## 🚀 Features

- **CV Validation**: Validate that uploaded files are legitimate CV/Resume documents using Gemini AI
- **CV Parsing**: Extract structured candidate information (skills, experience, education, etc.) from PDF/DOCX files
- **Job Matching**: Intelligent Python-based matching algorithm that calculates compatibility scores
- **Scoring Engine**: 
  - Skills Match: 50%
  - Experience Match: 20%
  - Projects Match: 10%
  - Certifications Match: 10%
  - Languages Match: 10%
- **Comprehensive API Documentation**: Interactive Swagger UI and ReDoc
- **CORS Support**: Ready for frontend integration
- **Error Handling**: Robust error handling and validation
- **Logging**: Complete request/response logging

## 📋 Tech Stack

- **Python**: 3.11+
- **FastAPI**: Modern async web framework
- **Google Gemini 2.5 Flash**: AI for CV validation and extraction
- **PyMuPDF**: PDF text extraction
- **python-docx**: DOCX text extraction
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server

## 📦 Installation

### Prerequisites

- Python 3.11 or higher
- Google Gemini API Key
- pip (Python package manager)

### Step 1: Clone and Navigate

```bash
cd ai_service
```

### Step 2: Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

Copy the example file and fill in your Gemini API key:

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_gemini_api_key
```

Get your Gemini API key from: https://ai.google.dev/

## 🏃 Running the Server

### Development Mode (with auto-reload)

```bash
python -m uvicorn app.main:app --reload
```

The server will start at: `http://localhost:8000`

### Production Mode

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📚 API Documentation

Once the server is running, visit:

- **Interactive Swagger UI**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc

## 🔌 API Endpoints

### 1. CV Validation

**POST** `/cv/upload-cv`

Validate if an uploaded file is a legitimate CV.

**Request:**
```bash
curl -X POST "http://localhost:8000/cv/upload-cv" \
  -H "accept: application/json" \
  -F "file=@resume.pdf"
```

**Response:**
```json
{
  "is_cv": true,
  "confidence": 95,
  "reason": "Professional CV with clear sections and content"
}
```

### 2. CV Extraction

**POST** `/cv/extract-cv`

Extract structured candidate information from CV.

**Request:**
```bash
curl -X POST "http://localhost:8000/cv/extract-cv" \
  -H "accept: application/json" \
  -F "file=@resume.pdf"
```

**Response:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "location": "New York, USA",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "github_url": "https://github.com/johndoe",
  "portfolio_url": "https://johndoe.com",
  "summary": "Experienced backend engineer with 5+ years...",
  "skills": ["Python", "FastAPI", "Docker", "PostgreSQL"],
  "languages": ["English", "Spanish"],
  "education": [
    {
      "degree": "BS Computer Science",
      "institution": "MIT",
      "graduation_year": "2020"
    }
  ],
  "experience": [
    {
      "job_title": "Senior Backend Engineer",
      "company": "Tech Company",
      "duration": "2 years",
      "description": "Led backend development and system architecture"
    }
  ],
  "projects": [
    {
      "name": "Real-time Chat System",
      "description": "Built scalable chat application",
      "technologies": ["Python", "FastAPI", "WebSocket"]
    }
  ],
  "certifications": [
    {
      "name": "AWS Certified Solutions Architect",
      "issuer": "Amazon",
      "date": "2023"
    }
  ],
  "total_experience_years": 5
}
```

### 3. Job Matching

**POST** `/match/job`

Match a candidate to a job position and calculate compatibility score.

**Request:**
```bash
curl -X POST "http://localhost:8000/match/job" \
  -H "Content-Type: application/json" \
  -d '{
    "candidate": {
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-555-0123",
      "location": "New York, USA",
      "skills": ["Python", "FastAPI", "Docker"],
      "experience": [],
      "education": [],
      "projects": [],
      "certifications": [],
      "total_experience_years": 5
    },
    "job": {
      "title": "Senior Backend Engineer",
      "description": "We are looking for an experienced backend engineer...",
      "required_skills": ["Python", "FastAPI", "Docker", "PostgreSQL"],
      "required_experience_years": 3,
      "preferred_certifications": ["AWS Certified"],
      "required_languages": ["English"]
    }
  }'
```

**Response:**
```json
{
  "match_score": 87,
  "recommendation": "Recommended",
  "matched_skills": ["Python", "FastAPI", "Docker"],
  "missing_skills": ["PostgreSQL"],
  "matched_certifications": [],
  "missing_certifications": ["AWS Certified"],
  "matched_languages": ["English"],
  "missing_languages": [],
  "strengths": [
    "Has 3/4 required skills",
    "Exceeds experience requirement (5 years vs 3 required)"
  ],
  "weaknesses": [
    "Missing PostgreSQL experience",
    "Missing AWS certification"
  ]
}
```

### 4. Health Check

**GET** `/health`

Check if the service is operational.

**Response:**
```json
{
  "status": "ok",
  "service": "Smart Job Matching Platform - AI Service",
  "version": "1.0.0"
}
```

## 🧮 Scoring Algorithm

The matching engine uses a weighted scoring system:

### Skills Score (50%)
- Formula: `matched_skills / required_skills`
- Example: If 2 out of 3 required skills are present: 2/3 = 0.67

### Experience Score (20%)
- If candidate experience >= required: `1.0`
- Otherwise: `candidate_years / required_years`
- Capped at 1.0

### Projects Score (10%)
- Percentage of projects mentioning required skills
- Helps identify practical experience

### Certifications Score (10%)
- Formula: `matched_certifications / preferred_certifications`
- Lower weight as certifications are preferred, not required

### Languages Score (10%)
- Formula: `matched_languages / required_languages`
- Ensures communication capability

### Final Score Calculation

```
final_score = (
  skills_score * 50 +
  experience_score * 20 +
  projects_score * 10 +
  certificate_score * 10 +
  language_score * 10
) / 100 * 100
```

Result: **0-100 integer**

### Recommendation Levels

- **90-100**: Highly Recommended
- **75-89**: Recommended
- **60-74**: Consider
- **0-59**: Not Recommended

## 📁 Project Structure

```
ai_service/
│
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application
│   │
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── cv.py               # CV upload/extraction endpoints
│   │   └── matching.py         # Job matching endpoint
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── gemini_service.py   # Gemini API interactions
│   │   ├── cv_parser.py        # PDF/DOCX parsing
│   │   └── matching_service.py # Matching algorithm
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── cv_models.py        # CV data models
│   │   └── matching_models.py  # Matching request/response models
│   │
│   └── utils/
│       ├── __init__.py
│       └── text_cleaner.py     # Text processing utilities
│
├── uploads/                    # Uploaded CV files directory
│
├── .env                        # Environment variables (create from .env.example)
├── .env.example                # Environment template
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## 🧪 Testing the Service

### Using Python Requests

```python
import requests

# Test CV Extraction
with open('resume.pdf', 'rb') as f:
    files = {'file': f}
    response = requests.post('http://localhost:8000/cv/extract-cv', files=files)
    candidate = response.json()

# Test Job Matching
match_request = {
    "candidate": candidate,
    "job": {
        "title": "Backend Engineer",
        "description": "Looking for a backend engineer",
        "required_skills": ["Python", "FastAPI"],
        "required_experience_years": 3,
        "preferred_certifications": [],
        "required_languages": ["English"]
    }
}

response = requests.post('http://localhost:8000/match/job', json=match_request)
match_result = response.json()
print(f"Match Score: {match_result['match_score']}")
print(f"Recommendation: {match_result['recommendation']}")
```

## 🔐 Security Considerations

1. **API Key Management**: Keep `GEMINI_API_KEY` in `.env` file (never commit to version control)
2. **File Upload**: Maximum file size set to 10 MB
3. **CORS**: Configure allowed origins in production
4. **Input Validation**: All inputs validated with Pydantic
5. **Rate Limiting**: Consider adding rate limiting for production
6. **Error Handling**: Generic error messages to avoid information leakage

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API Key |
| `SERVER_HOST` | No | Server host (default: 0.0.0.0) |
| `SERVER_PORT` | No | Server port (default: 8000) |
| `DEBUG` | No | Debug mode (default: False) |

## 🐛 Troubleshooting

### Issue: "GEMINI_API_KEY not found"
**Solution**: Make sure you've created `.env` file with valid `GEMINI_API_KEY`

### Issue: "Unsupported file format"
**Solution**: Only PDF and DOCX formats are supported. Ensure your file has correct extension.

### Issue: "ModuleNotFoundError"
**Solution**: Run `pip install -r requirements.txt` to install all dependencies

### Issue: Port 8000 already in use
**Solution**: Run on different port: `uvicorn app.main:app --port 8001`

## 🚀 Deployment

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t sjmp-ai-service .
docker run -p 8000:8000 -e GEMINI_API_KEY=your_key sjmp-ai-service
```

## 📄 License

This project is part of the Smart Job Matching Platform graduation project.

## 👥 Support

For issues or questions, refer to the API documentation at `/docs` or `/redoc`.

## 🔄 API Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (invalid format, not a CV) |
| 413 | File too large |
| 500 | Internal server error |

## 📈 Performance Tips

1. **File Size**: Keep CV files under 5 MB for faster processing
2. **Concurrent Requests**: Service can handle multiple concurrent requests
3. **Caching**: Consider caching extracted profiles if needed
4. **Database**: For production, integrate with a database for historical data

---

**Created for Smart Job Matching Platform Graduation Project**
