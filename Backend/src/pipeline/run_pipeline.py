import sys
import os
from pathlib import Path

# Add the backend root to Python path
backend_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(backend_root))

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
load_dotenv()
# Add project root to path

app = FastAPI()

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

@app.post("/upload-pdf/")
async def run_backend(file: UploadFile = File(...), lang: str = Form("en")):
    try:
        print(f"=== UPLOAD REQUEST RECEIVED ===")
        print(f"File object: {file}")
        print(f"Lang parameter: {lang}")
        
        # Validate file
        if not file:
            print("ERROR: No file object provided")
            raise HTTPException(status_code=422, detail="No file provided")
        
        if not hasattr(file, 'filename') or not file.filename:
            print("ERROR: File has no filename")
            raise HTTPException(status_code=422, detail="File missing filename")
            
        print(f"File uploaded: {file.filename} (content-type: {getattr(file, 'content_type', 'unknown')})")
        
        # Check file extension
        if not file.filename.lower().endswith('.pdf'):
            print(f"ERROR: Invalid file type. Expected PDF, got: {file.filename}")
            raise HTTPException(status_code=422, detail=f"Only PDF files are supported. Received: {file.filename}")
            
        # Read file content
        content = await file.read()
        
        if not content:
            print("ERROR: File content is empty")
            raise HTTPException(status_code=422, detail="Empty file received")
            
        print(f"File content read successfully: {len(content)} bytes")
        text = _extract_text_from_pdf(content)
        summary = generate_summary(text, lang)
        print(f"Summary type: {type(summary)}")
        print(f"Summary length: {len(summary)}")
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

    except HTTPException as he:
        # Log HTTP exceptions for debugging but re-raise as-is
        print(f"HTTP Exception {he.status_code}: {he.detail}")
        raise
    except Exception as e:
        # Print detailed error to console for debugging
        error_msg = str(e)
        print(f"Unexpected error during document processing: {error_msg}")
        print(f"File: {getattr(file, 'filename', 'Unknown') if file else 'None'}")
        print(traceback.format_exc())
        
        # Return user-friendly error
        raise HTTPException(
            status_code=500,
            detail=f"Processing error: {error_msg}"
        )

@app.get("/")
async def root():
    return {"message": "SEBI Hack Backend API", "status": "running", "endpoints": ["/upload-pdf/", "/health"]}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Server is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("run_pipeline:app", host="127.0.0.1", port=8000, reload=True)