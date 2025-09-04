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
from typing import Optional
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
async def run_backend(file: UploadFile = File(...), lang: Optional[str] = Form(None)):   # lang is optional now
    if lang is None:
        lang = "English"
    try:
        # Read file content
        print("File uploaded successfully")
        content = await file.read()
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

    except Exception as e:
        # Print detailed error to console
        print(f"Error: {str(e)}")
        print(traceback.format_exc())
        # Optionally log the error or take other actions
        raise HTTPException(
            status_code=500,
            detail=f"Processing error: {str(e)}"
        )

@app.get("/")
async def root():
    return {"message": "SEBI Hack Backend API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Server is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)