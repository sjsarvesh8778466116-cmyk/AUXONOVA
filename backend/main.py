"""
AXONOVA Backend Entry Point
Serves the FastAPI application with real AI inference architecture,
modular task pipelines, condition catalog, and PACS radiological reporting.
"""

from app.main import app

__all__ = ["app"]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
