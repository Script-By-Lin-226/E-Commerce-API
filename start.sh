#!/bin/bash
set -e

# Get PORT from environment variable or default to 8000
PORT=${PORT:-8000}

# Start uvicorn
exec uvicorn app.app:app --host 0.0.0.0 --port "$PORT"

