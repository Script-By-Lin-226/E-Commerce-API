import uvicorn
import os

if __name__ == "__main__":
    # Get port from environment variable (for Render) or default to 8000
    uvicorn.run("app.app:app", host="0.0.0.0", port=8000, reload=True)