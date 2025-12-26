# Railway Nixpacks Setup

## ✅ Configured for Nixpacks

Your project is now configured to use **Nixpacks** instead of Docker on Railway.

## What Changed

1. **`nixpacks.toml`** - Nixpacks configuration
   - Uses Python 3.11
   - Installs PostgreSQL client
   - Installs dependencies from `requirements.txt`
   - Uses `start.sh` to handle PORT variable

2. **`railway.json`** - Updated to use Nixpacks builder
   - Changed from `DOCKERFILE` to `NIXPACKS`

3. **`railway.toml`** - Updated to use Nixpacks builder
   - Changed from `dockerfile` to `nixpacks`

4. **`start.sh`** - Start script that handles PORT variable
   - Gets PORT from environment or defaults to 8000
   - Starts uvicorn with correct port

5. **`main.py`** - Updated to handle PORT variable
   - Reads PORT from environment variable

## How It Works

1. Railway detects `nixpacks.toml` and uses Nixpacks builder
2. Nixpacks installs Python 3.11 and dependencies
3. Makes `start.sh` executable during build
4. Runs `start.sh` which expands PORT variable correctly
5. Uvicorn starts with the correct port

## Deploy Steps

1. **Commit and push**:
   ```bash
   git add nixpacks.toml railway.json railway.toml start.sh main.py
   git commit -m "Switch to Nixpacks for Railway deployment"
   git push
   ```

2. **Railway will auto-detect Nixpacks** and rebuild

3. **Set environment variables** in Railway dashboard:
   - `DATABASE_URL`
   - `REDIS_URL`
   - `JWT_SECRET_KEY`
   - `ACCESS_TOKEN_EXPIRE_MINS=30`
   - `REFRESH_TOKEN_EXPIRE_DAYS=7`
   - `PORT` (Railway sets this automatically)

4. **Verify deployment** - Check logs for successful startup

## Why Nixpacks?

- ✅ Simpler than Docker for Python apps
- ✅ Automatic dependency detection
- ✅ Better PORT variable handling
- ✅ Faster builds
- ✅ Railway's native build system

The PORT variable issue should be resolved! 🎉

