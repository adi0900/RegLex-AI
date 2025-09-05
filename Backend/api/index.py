import os
import sys

# Add the src directory to the path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

try:
    from src.pipeline.run_pipeline import app
    print("✅ Successfully imported FastAPI app")
except ImportError as e:
    print(f"❌ Import error: {e}")
    # Create a minimal app for debugging
    from fastapi import FastAPI
    app = FastAPI()

    @app.get("/")
    async def root():
        return {"message": "Minimal Vercel App", "error": str(e)}

    @app.get("/health")
    async def health():
        return {"status": "minimal", "error": str(e)}

# Export the FastAPI app for Vercel
print(f"🚀 Starting Vercel app with Python {sys.version}")
print(f"📁 Working directory: {os.getcwd()}")
print(f"🔧 Environment: {os.getenv('ENVIRONMENT', 'not_set')}")
