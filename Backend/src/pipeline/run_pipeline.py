from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.extraction.extract_pipeline import _extract_text_from_pdf
from src.summerizer.llm_client import generate_summary
# from src.anomaly_detector.ano_detector_agent import anomaly_detection_pipeline
# from src.compliance_checker.compliance_agent import ComplianceAgent
import traceback
import re
import json
import numpy as np
from fastapi.encoders import jsonable_encoder
from dotenv import load_dotenv
from typing import Optional, List, Dict, Any
import logging
from datetime import datetime, timedelta
import os
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add project root to path

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application startup and shutdown events"""
    logger.info("[START] Starting SEBI Compliance Backend Server")
    print("[APP] FastAPI application starting...")

    # Startup tasks
    try:
        # Initialize any resources here
        logger.info("[OK] Application startup complete")
        yield
    except Exception as e:
        logger.error(f"[ERROR] Startup error: {e}")
        raise
    finally:
        # Shutdown tasks
        logger.info("[SHUTDOWN] Application shutting down...")
        print("[STOP] FastAPI application shutting down...")

        # Cleanup tasks
        try:
            # Close any connections, cleanup resources here
            logger.info("[OK] Cleanup completed")
        except Exception as e:
            logger.error(f"[ERROR] Cleanup error: {e}")

app = FastAPI(
    title="SEBI Compliance API",
    description="FastAPI backend for SEBI compliance document analysis",
    version="1.0.0",
    lifespan=lifespan,
    # Increase timeout for long-running document processing
    timeout=600,  # 10 minutes timeout
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "SEBI Compliance API is running",
        "status": "healthy",
        "version": "1.0.0",
        "endpoints": [
            {"path": "/", "method": "GET", "description": "API information"},
            {"path": "/health", "method": "GET", "description": "Health check"},
            {"path": "/upload-pdf/", "method": "POST", "description": "Upload PDF for analysis"}
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "SEBI Compliance Backend is operational",
        "timestamp": "2024-01-01T00:00:00Z",  # Could be made dynamic
        "version": "1.0.0"
    }

@app.post("/upload-pdf/")
async def run_backend(file: UploadFile = File(...), lang: Optional[str] = Form(None)):   # lang is optional now
    logger.info(f"[UPLOAD] Upload request received: file={file.filename}, size={file.size if hasattr(file, 'size') else 'unknown'}, lang={lang}")

    if lang is None:
        lang = "English"
        logger.info(f"[LANG] Using default language: {lang}")
    try:
        # Read file content
        logger.info("[OK] File uploaded successfully")
        content = await file.read()
        logger.info(f"[EXTRACT] Extracting text from PDF ({len(content)} bytes)")
        text = _extract_text_from_pdf(content)
        logger.info(f"[SUMMARY] Generating summary in {lang}")
        summary = generate_summary(text, lang)
        logger.info(f"[RESULT] Summary type: {type(summary)}, length: {len(summary)}")
        if isinstance(summary, dict):
            data = summary
            with open("debug_summary.json", "w") as f:
                json.dump(summary, f, indent=2)

        # Case 2: summary is string with JSON content
        elif isinstance(summary, str):
            with open("debug_summary.json", "w") as f:
                f.write(summary)

            clean_json = summary.replace("```json", "").replace("```", "").strip()

            try:
                data = json.loads(clean_json)
            except json.JSONDecodeError as e:
                print("JSON parsing failed:", e)
                raise
            
        else:
            raise TypeError(f"Unexpected summary type: {type(summary)}")
        clauses = data.get("Clauses", [])
        print(clauses)
        # anomalies = anomaly_detection_pipeline(clauses)
        # compliance_agent = ComplianceAgent()
        # compliance_results = compliance_agent.ensure_compliance(clauses)
        compliance_results = {"status": "Compliance checking temporarily disabled"}

        custom_encoders = {
            np.bool_: bool,
            np.int64: int,
            np.float64: float
        }

        results =  {
            "summary": data.get("summary", ""),
            "timelines": data.get("Timelines", {}),
            "clauses": clauses,
            # "anomalies": anomalies,
            "compliance_results": compliance_results
        }
        with open("debug_results.json", "w") as f:
            json.dump(results, f, indent=2)

        return jsonable_encoder(results, custom_encoder=custom_encoders)

    except Exception as e:
        # Print detailed error to console
        print(f"[ERROR] Error processing upload: {str(e)}")
        print("[TRACE] Full traceback:")
        print(traceback.format_exc())

        # Check for specific error types
        if "JSON" in str(e):
            print("[JSON] JSON parsing error - check LLM response format")
        elif "file" in str(e).lower():
            print("[FILE] File processing error - check file format and content")

        # Return more detailed error information
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Processing error",
                "message": str(e),
                "type": type(e).__name__,
                "file_info": {
                    "filename": file.filename,
                    "content_type": file.content_type,
                    "size": len(content) if 'content' in locals() else "unknown"
                }
            }
        )

# ============================================================================
# DASHBOARD ENDPOINTS
# ============================================================================

@app.get("/api/dashboard/overview")
async def get_dashboard_overview():
    """Get dashboard overview statistics"""
    return {
        "status": "success",
        "data": {
            "totalDocuments": 15,
            "processedDocuments": 12,
            "complianceRate": 87.5,
            "averageScore": 82.3,
            "highRiskItems": 3,
            "processingTime": 2450,
            "backendHealth": "healthy",
            "lastUpdated": datetime.now().isoformat()
        }
    }

@app.get("/api/dashboard/documents")
async def get_documents():
    """Get all processed documents"""
    documents = [
        {
            "id": "doc_001",
            "fileName": "Loan_Agreement.pdf",
            "fileSize": "2.4 MB",
            "uploadedAt": (datetime.now() - timedelta(days=1)).isoformat(),
            "processedAt": (datetime.now() - timedelta(hours=1)).isoformat(),
            "summary": "Personal Power Loan agreement with Axis Bank Ltd. Contains 8 clauses with compliance analysis.",
            "overallScore": 85,
            "riskLevel": "medium",
            "totalClauses": 8,
            "compliantClauses": 7,
            "nonCompliantClauses": 1,
            "highRiskClauses": 1,
            "status": "completed"
        },
        {
            "id": "doc_002",
            "fileName": "Compliance_Report.pdf",
            "fileSize": "1.8 MB",
            "uploadedAt": (datetime.now() - timedelta(days=2)).isoformat(),
            "processedAt": (datetime.now() - timedelta(hours=2)).isoformat(),
            "summary": "Quarterly compliance report for regulatory requirements.",
            "overallScore": 92,
            "riskLevel": "low",
            "totalClauses": 12,
            "compliantClauses": 11,
            "nonCompliantClauses": 1,
            "highRiskClauses": 0,
            "status": "completed"
        }
    ]
    return {
        "status": "success",
        "data": documents,
        "total": len(documents)
    }

@app.get("/api/dashboard/analysis/{document_id}")
async def get_document_analysis(document_id: str):
    """Get detailed analysis for a specific document"""
    # Mock analysis data - in real implementation, this would fetch from database
    analysis_data = {
        "id": document_id,
        "fileName": "Loan_Agreement.pdf",
        "fileSize": "2.4 MB",
        "uploadedAt": (datetime.now() - timedelta(days=1)).isoformat(),
        "processedAt": (datetime.now() - timedelta(hours=1)).isoformat(),
        "summary": "Comprehensive analysis of Personal Power Loan agreement with Axis Bank Ltd. The document contains 8 clauses with 7 compliant and 1 non-compliant clause. Key areas of concern include interest rate calculations and foreclosure charges.",
        "overallScore": 85,
        "riskLevel": "medium",
        "totalClauses": 8,
        "compliantClauses": 7,
        "nonCompliantClauses": 1,
        "highRiskClauses": 1,
        "status": "completed",
        "complianceAreas": [
            {
                "area": "Legal Compliance",
                "total": 3,
                "compliant": 3,
                "nonCompliant": 0,
                "score": 100
            },
            {
                "area": "Financial Terms",
                "total": 3,
                "compliant": 2,
                "nonCompliant": 1,
                "score": 67
            },
            {
                "area": "Risk Disclosure",
                "total": 2,
                "compliant": 2,
                "nonCompliant": 0,
                "score": 100
            }
        ],
        "keyFindings": [
            {
                "type": "success",
                "title": "High Overall Compliance",
                "description": "Document achieves 85% compliance with SEBI regulations",
                "priority": "low"
            },
            {
                "type": "warning",
                "title": "Interest Calculation Issue",
                "description": "Non-compliant interest calculation methodology requires attention",
                "priority": "high"
            },
            {
                "type": "error",
                "title": "Missing Risk Disclosure",
                "description": "Several risk factors not adequately disclosed",
                "priority": "medium"
            }
        ],
        "clauses": [
            {
                "id": "clause_1",
                "text": "Loan agreement terms and conditions",
                "isCompliant": True,
                "confidenceScore": 0.95,
                "riskLevel": "low",
                "category": "Legal",
                "explanation": "Fully compliant with regulatory requirements"
            },
            {
                "id": "clause_2",
                "text": "Interest calculation methodology",
                "isCompliant": False,
                "confidenceScore": 0.78,
                "riskLevel": "high",
                "category": "Financial",
                "explanation": "Does not comply with RBI interest calculation guidelines"
            }
        ]
    }

    return {
        "status": "success",
        "data": analysis_data
    }

@app.get("/api/dashboard/reports")
async def get_reports():
    """Get compliance reports"""
    reports = [
        {
            "id": "report_001",
            "title": "Monthly Compliance Report",
            "type": "compliance",
            "description": "Comprehensive compliance analysis for the month",
            "generatedAt": datetime.now().isoformat(),
            "status": "completed",
            "downloadUrl": "/api/reports/download/report_001"
        },
        {
            "id": "report_002",
            "title": "Risk Assessment Report",
            "type": "risk",
            "description": "High-risk clauses and mitigation recommendations",
            "generatedAt": (datetime.now() - timedelta(hours=1)).isoformat(),
            "status": "completed",
            "downloadUrl": "/api/reports/download/report_002"
        }
    ]

    return {
        "status": "success",
        "data": reports,
        "total": len(reports)
    }

@app.post("/api/dashboard/reports/generate")
async def generate_report(report_type: str = "compliance"):
    """Generate a new compliance report"""
    # Mock report generation - in real implementation, this would trigger actual report generation
    report_id = f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

    return {
        "status": "success",
        "message": f"{report_type.title()} report generation started",
        "reportId": report_id,
        "estimatedTime": "30 seconds"
    }

@app.get("/api/dashboard/notifications")
async def get_notifications():
    """Get user notifications"""
    notifications = [
        {
            "id": "notif_001",
            "type": "warning",
            "title": "High Risk Clause Detected",
            "message": "Clause 3 in Loan_Agreement.pdf requires immediate attention",
            "timestamp": (datetime.now() - timedelta(hours=1)).isoformat(),
            "read": False,
            "priority": "high"
        },
        {
            "id": "notif_002",
            "type": "success",
            "title": "Document Processing Complete",
            "message": "Loan_Agreement.pdf has been successfully analyzed with 85% compliance score",
            "timestamp": (datetime.now() - timedelta(hours=2)).isoformat(),
            "read": True,
            "priority": "medium"
        },
        {
            "id": "notif_003",
            "type": "info",
            "title": "System Update",
            "message": "Compliance engine updated with latest SEBI regulations",
            "timestamp": (datetime.now() - timedelta(days=1)).isoformat(),
            "read": False,
            "priority": "low"
        }
    ]

    unread_count = len([n for n in notifications if not n["read"]])

    return {
        "status": "success",
        "data": notifications,
        "unreadCount": unread_count,
        "total": len(notifications)
    }

@app.put("/api/dashboard/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str):
    """Mark a notification as read"""
    # Mock implementation - in real implementation, this would update database
    return {
        "status": "success",
        "message": f"Notification {notification_id} marked as read"
    }

@app.get("/api/dashboard/timeline")
async def get_timeline():
    """Get processing timeline events"""
    timeline_events = [
        {
            "id": "event_001",
            "type": "upload",
            "title": "Document Uploaded",
            "description": "Loan_Agreement.pdf uploaded for processing",
            "timestamp": (datetime.now() - timedelta(days=1)).isoformat(),
            "documentId": "doc_001",
            "status": "completed"
        },
        {
            "id": "event_002",
            "type": "processing",
            "title": "Text Extraction Started",
            "description": "FastAPI backend extracting text from PDF document",
            "timestamp": (datetime.now() - timedelta(hours=23)).isoformat(),
            "documentId": "doc_001",
            "status": "completed"
        },
        {
            "id": "event_003",
            "type": "processing",
            "title": "Compliance Analysis",
            "description": "LLM analyzing document for SEBI compliance requirements",
            "timestamp": (datetime.now() - timedelta(hours=22)).isoformat(),
            "documentId": "doc_001",
            "status": "completed"
        },
        {
            "id": "event_004",
            "type": "completed",
            "title": "Analysis Complete",
            "description": "Compliance analysis finished with 85% score",
            "timestamp": (datetime.now() - timedelta(hours=1)).isoformat(),
            "documentId": "doc_001",
            "status": "completed"
        },
        {
            "id": "event_005",
            "type": "upload",
            "title": "Document Uploaded",
            "description": "Compliance_Report.pdf uploaded for processing",
            "timestamp": (datetime.now() - timedelta(days=2)).isoformat(),
            "documentId": "doc_002",
            "status": "completed"
        }
    ]

    return {
        "status": "success",
        "data": timeline_events,
        "total": len(timeline_events)
    }

@app.get("/api/dashboard/analytics")
async def get_analytics():
    """Get analytics data for charts and metrics"""
    analytics_data = {
        "complianceTrend": [
            {"date": (datetime.now() - timedelta(days=6)).strftime("%Y-%m-%d"), "score": 82},
            {"date": (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d"), "score": 85},
            {"date": (datetime.now() - timedelta(days=4)).strftime("%Y-%m-%d"), "score": 83},
            {"date": (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d"), "score": 87},
            {"date": (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d"), "score": 86},
            {"date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"), "score": 88},
            {"date": datetime.now().strftime("%Y-%m-%d"), "score": 87}
        ],
        "riskDistribution": {
            "low": 12,
            "medium": 3,
            "high": 2
        },
        "processingStats": {
            "averageTime": 2450,  # milliseconds
            "successRate": 96.7,
            "totalProcessed": 156
        },
        "complianceAreas": {
            "Legal Compliance": 92,
            "Financial Terms": 85,
            "Risk Disclosure": 88,
            "Regulatory Requirements": 91
        }
    }

    return {
        "status": "success",
        "data": analytics_data
    }

# ============================================================================
# LEGACY ENDPOINTS (for backward compatibility)
# ============================================================================

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "SEBI Compliance API is running",
        "status": "healthy",
        "version": "1.0.0",
        "endpoints": [
            {"path": "/", "method": "GET", "description": "API information"},
            {"path": "/health", "method": "GET", "description": "Health check"},
            {"path": "/upload-pdf/", "method": "POST", "description": "Upload PDF for analysis"},
            {"path": "/api/dashboard/overview", "method": "GET", "description": "Dashboard overview"},
            {"path": "/api/dashboard/documents", "method": "GET", "description": "Document list"},
            {"path": "/api/dashboard/analysis/{id}", "method": "GET", "description": "Document analysis"},
            {"path": "/api/dashboard/reports", "method": "GET", "description": "Reports list"},
            {"path": "/api/dashboard/reports/generate", "method": "POST", "description": "Generate new report"},
            {"path": "/api/dashboard/notifications", "method": "GET", "description": "Notifications"},
            {"path": "/api/dashboard/notifications/{id}/read", "method": "PUT", "description": "Mark notification as read"},
            {"path": "/api/dashboard/timeline", "method": "GET", "description": "Timeline events"},
            {"path": "/api/dashboard/analytics", "method": "GET", "description": "Analytics data"}
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "SEBI Compliance Backend is operational",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "uptime": "Service running normally"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)