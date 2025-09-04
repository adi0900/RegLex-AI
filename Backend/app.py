#!/usr/bin/env python3
"""
SEBI Compliance Backend - Main Application Entry Point
FastAPI application server for document compliance checking and analysis
"""

import sys
import os
from pathlib import Path

# Add the project root and src directory to Python path
backend_root = Path(__file__).parent
src_path = backend_root / "src"
sys.path.insert(0, str(backend_root))
sys.path.insert(0, str(src_path))

print("SEBI Compliance Backend Starting...")
print(f"Backend root: {backend_root}")
print(f"Source path: {src_path}")
print(f"Python path: {[p for p in sys.path if 'Sebi-Hack' in p]}")

# Import and configure environment
try:
    from dotenv import load_dotenv
    
    # Load environment variables
    env_file = backend_root / ".env"
    if env_file.exists():
        load_dotenv(env_file)
        print(f"Environment loaded from: {env_file}")
    else:
        load_dotenv()
        print("Environment loaded from system")
        
except ImportError:
    print("WARNING: python-dotenv not installed, skipping .env file loading")

# Import the FastAPI application
try:
    from src.pipeline.run_pipeline import app
    print("Successfully imported FastAPI application")
    
    # Application configuration
    APP_CONFIG = {
        "title": "SEBI Compliance Backend API",
        "description": "FastAPI backend for document compliance checking and analysis",
        "version": "1.0.0",
        "host": "127.0.0.1",
        "port": 8000,
        "reload": True,
        "access_log": True,
        "log_level": "info"
    }
    
    print("Application Configuration:")
    for key, value in APP_CONFIG.items():
        print(f"   {key}: {value}")
    
except ImportError as e:
    print(f"ERROR: Failed to import FastAPI application: {str(e)}")
    print("\nTroubleshooting:")
    print("1. Ensure all dependencies are installed: pip install -r requirements.txt")
    print("2. Check that all required modules exist in the src directory")
    print("3. Verify that __init__.py files exist in all package directories")
    print("4. Check for import errors in the pipeline modules")
    sys.exit(1)

# Enhanced FastAPI app configuration
try:
    # Add metadata to the app if not already set
    if not hasattr(app, 'title') or not app.title:
        app.title = APP_CONFIG["title"]
        app.description = APP_CONFIG["description"]
        app.version = APP_CONFIG["version"]
    
    # Add CORS middleware for frontend integration
    try:
        from fastapi.middleware.cors import CORSMiddleware
        
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
        print("CORS middleware configured for frontend integration")
        
    except ImportError:
        print("WARNING: CORS middleware not available, frontend may have connectivity issues")

    # Add startup event
    @app.on_event("startup")
    async def startup_event():
        print("SEBI Compliance Backend is ready!")
        print("Available endpoints:")
        print("   - Health Check: GET /health")
        print("   - Document Upload: POST /upload-pdf/")
        print("   - API Root: GET /")
        print(f"Server URL: http://{APP_CONFIG['host']}:{APP_CONFIG['port']}")
        
    @app.on_event("shutdown")
    async def shutdown_event():
        print("SEBI Compliance Backend shutting down...")

    print("FastAPI application configured successfully")
    
except Exception as e:
    print(f"WARNING: Could not configure FastAPI app metadata: {str(e)}")

# Main execution function
def run_server():
    """Run the FastAPI server with uvicorn"""
    try:
        import uvicorn
        
        print(f"\nStarting SEBI Compliance Backend Server...")
        print(f"Server will be available at: http://{APP_CONFIG['host']}:{APP_CONFIG['port']}")
        print(f"Health check: http://{APP_CONFIG['host']}:{APP_CONFIG['port']}/health")
        print(f"Upload endpoint: http://{APP_CONFIG['host']}:{APP_CONFIG['port']}/upload-pdf/")
        print(f"API docs: http://{APP_CONFIG['host']}:{APP_CONFIG['port']}/docs")
        print(f"OpenAPI schema: http://{APP_CONFIG['host']}:{APP_CONFIG['port']}/openapi.json")
        
        # Run the server
        uvicorn.run(
            "app:app",  # Use the app instance from this file
            host=APP_CONFIG["host"],
            port=APP_CONFIG["port"],
            reload=APP_CONFIG["reload"],
            reload_dirs=[str(src_path), str(backend_root)],
            access_log=APP_CONFIG["access_log"],
            log_level=APP_CONFIG["log_level"],
            # Additional uvicorn configuration
            reload_includes=["*.py"],
            reload_excludes=["*.pyc", "__pycache__/*", "venv/*", "*.log"],
        )
        
    except ImportError:
        print("ERROR: uvicorn not installed. Please install it with: pip install uvicorn")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: Failed to start server: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

def check_dependencies():
    """Check if required dependencies are installed"""
    required_packages = [
        'fastapi',
        'uvicorn',
        'python-multipart',
        'python-dotenv'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == 'python-dotenv':
                import dotenv
            elif package == 'python-multipart':
                import multipart
            else:
                __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"ERROR: Missing required packages: {', '.join(missing_packages)}")
        print(f"Install them with: pip install {' '.join(missing_packages)}")
        return False
    
    print("All required dependencies are available")
    return True

# Command line interface
if __name__ == "__main__":
    print("=" * 60)
    print("SEBI COMPLIANCE BACKEND API")
    print("=" * 60)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Handle command line arguments
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "check":
            print("Application check completed successfully")
            sys.exit(0)
        elif command == "dev":
            APP_CONFIG["reload"] = True
            APP_CONFIG["log_level"] = "debug"
            print("Development mode enabled")
        elif command == "prod":
            APP_CONFIG["reload"] = False
            APP_CONFIG["log_level"] = "warning"
            print("Production mode enabled")
        elif command in ["help", "-h", "--help"]:
            print("Usage: python app.py [command]")
            print("Commands:")
            print("  (none)  - Start the server with default settings")
            print("  dev     - Start in development mode with auto-reload")
            print("  prod    - Start in production mode")
            print("  check   - Check dependencies and configuration")
            print("  help    - Show this help message")
            sys.exit(0)
        else:
            print(f"WARNING: Unknown command: {command}")
            print("Use 'python app.py help' for usage information")
    
    # Start the server
    try:
        run_server()
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"\nERROR: Server crashed: {str(e)}")
        sys.exit(1)