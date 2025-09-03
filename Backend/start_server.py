#!/usr/bin/env python
"""
SEBI Compliance Backend Server
Startup script that properly configures the Python path and starts the FastAPI server
"""

import sys
import os
from pathlib import Path

# Add the src directory to Python path
backend_root = Path(__file__).parent
src_path = backend_root / "src"
sys.path.insert(0, str(backend_root))
sys.path.insert(0, str(src_path))

# Verify the path setup
print(f"Backend root: {backend_root}")
print(f"Source path: {src_path}")
print(f"Python path includes: {[p for p in sys.path if 'Sebi-Hack' in p]}")

# Import and run the FastAPI application
try:
    from src.pipeline.run_pipeline import app
    print("SUCCESS: Successfully imported FastAPI app")
    
    # Start the server
    import uvicorn
    print("STARTING: SEBI Compliance Backend Server...")
    print("ENDPOINT: Server will be available at: http://127.0.0.1:8000")
    print("HEALTH: Health check: http://127.0.0.1:8000/health")
    print("UPLOAD: Upload endpoint: http://127.0.0.1:8000/upload-pdf/")
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        reload_dirs=[str(src_path)],
        access_log=True,
        log_level="info"
    )
    
except ImportError as e:
    print("ERROR: Import error:", str(e))
    print("\nTroubleshooting:")
    print("1. Ensure all dependencies are installed: pip install -r requirements.txt")
    print("2. Check that all required modules exist in the src directory")
    print("3. Verify that __init__.py files exist in all package directories")
    sys.exit(1)
except Exception as e:
    print("ERROR: Startup error:", str(e))
    import traceback
    traceback.print_exc()
    sys.exit(1)