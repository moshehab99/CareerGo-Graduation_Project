"""
Smart Job Matching Platform - AI Microservice
Main FastAPI application
"""

import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from app.routers import cv, matching

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Smart Job Matching Platform - AI Service",
    description="AI microservice for CV validation, extraction, and job matching",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(cv.router)
app.include_router(matching.router)


@app.get(
    "/",
    summary="Root endpoint",
    tags=["Health Check"]
)
async def root():
    """
    Root endpoint providing basic service information.
    
    Returns:
        Service information
    """
    return {
        "service": "Smart Job Matching Platform - AI Microservice",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
        "endpoints": {
            "cv": {
                "upload": "POST /cv/upload-cv",
                "extract": "POST /cv/extract-cv"
            },
            "matching": {
                "match": "POST /match/job",
                "health": "GET /match/health"
            }
        }
    }


@app.get(
    "/health",
    summary="Health check",
    tags=["Health Check"]
)
async def health_check():
    """
    Health check endpoint.
    
    Returns:
        Health status
    """
    return {
        "status": "ok",
        "service": "Smart Job Matching Platform - AI Service",
        "version": "1.0.0"
    }


def custom_openapi():
    """
    Customize OpenAPI schema.
    
    Returns:
        Custom OpenAPI schema
    """
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="Smart Job Matching Platform - AI Service",
        version="1.0.0",
        description="AI microservice for CV validation, extraction, and job matching using Gemini API",
        routes=app.routes,
    )
    
    openapi_schema["info"]["x-logo"] = {
        "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
    }
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


@app.on_event("startup")
async def startup_event():
    """Handle startup event."""
    logger.info("Smart Job Matching Platform - AI Service starting up...")
    logger.info("Gemini API configured and ready")
    logger.info("Service ready to accept requests")


@app.on_event("shutdown")
async def shutdown_event():
    """Handle shutdown event."""
    logger.info("Smart Job Matching Platform - AI Service shutting down...")


if __name__ == "__main__":
    import uvicorn
    
    # Run with: python -m uvicorn app.main:app --reload
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
