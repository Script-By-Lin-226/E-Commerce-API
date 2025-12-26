#!/bin/bash
set -e

# Use PORT from environment or default to 8000
# Fly.io uses 8080, but we'll use whatever PORT is set
PORT=${PORT:-8000}

# Start uvicorn
exec uvicorn app.app:app --host 0.0.0.0 --port "$PORT"



