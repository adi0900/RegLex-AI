#!/usr/bin/env python
"""
SEBI Compliance Backend Server
Startup script with proper signal handling and graceful shutdown
"""

import sys
import os
import signal
import asyncio
from pathlib import Path

# Add the src directory to Python path
backend_root = Path(__file__).parent
src_path = backend_root / "src"
sys.path.insert(0, str(backend_root))
sys.path.insert(0, str(src_path))

# Global server instance for graceful shutdown
server = None

def signal_handler(signum, frame):
    """Handle shutdown signals gracefully"""
    print(f"\n🛑 Received signal {signum}. Initiating graceful shutdown...")
    if server:
        server.should_exit = True
    sys.exit(0)

async def shutdown_handler():
    """Handle async shutdown"""
    print("[CLEANUP] Performing cleanup tasks...")
    # Add any cleanup tasks here (close database connections, etc.)
    print("[OK] Cleanup completed")

def main():
    """Main server startup function"""
    global server

    # Register signal handlers for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)   # Ctrl+C
    signal.signal(signal.SIGTERM, signal_handler)  # Termination signal

    # Verify the path setup
    print("[START] SEBI Compliance Backend Server")
    print(f"[PATH] Backend root: {backend_root}")
    print(f"[PATH] Source path: {src_path}")
    print(f"[PYTHON] Python path includes: {[p for p in sys.path if 'Sebi-Hack' in p]}")

    try:
        from src.pipeline.run_pipeline import app
        print("[OK] Successfully imported FastAPI app")

        # Import uvicorn
        import uvicorn
        from uvicorn.config import Config

        print("[START] STARTING: SEBI Compliance Backend Server...")
        print("[SERVER] Server will be available at: http://127.0.0.1:8000")
        print("[HEALTH] Health check: http://127.0.0.1:8000/health")
        print("[UPLOAD] Upload endpoint: http://127.0.0.1:8000/upload-pdf/")
        print("[STOP] Press Ctrl+C to stop the server gracefully")

        # Create uvicorn config with proper settings
        config = Config(
            app=app,
            host="127.0.0.1",
            port=8000,
            reload=True,
            reload_dirs=[str(src_path)],
            access_log=True,
            log_level="info",
            # Add lifespan events for better shutdown handling
            lifespan="auto"
        )

        # Create and start server
        server = uvicorn.Server(config)

        # Run server with proper event loop handling
        try:
            server.run()
        except KeyboardInterrupt:
            print("\n[INTERRUPT] Keyboard interrupt received")
        except Exception as e:
            print(f"\n[ERROR] Server error: {e}")
        finally:
            print("[SHUTDOWN] Initiating shutdown sequence...")
            # Perform any cleanup tasks
            asyncio.run(shutdown_handler())
            print("[COMPLETE] Server shutdown complete")

    except ImportError as e:
        print("[ERROR] Import error:", str(e))
        print("\n[HELP] Troubleshooting:")
        print("1. Ensure all dependencies are installed: pip install -r requirements.txt")
        print("2. Check that all required modules exist in the src directory")
        print("3. Verify that __init__.py files exist in all package directories")
        print("4. Activate the virtual environment: venv\\Scripts\\activate")
        sys.exit(1)
    except Exception as e:
        print("[ERROR] Startup error:", str(e))
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()