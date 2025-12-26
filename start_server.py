#!/usr/bin/env python3
import os
import uvicorn

if __name__ == "__main__":
    # Get PORT from environment variable or default to 8000
    port = int(os.getenv("PORT", 8000))
    
    # Start uvicorn
    uvicorn.run(
        "app.app:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    )

