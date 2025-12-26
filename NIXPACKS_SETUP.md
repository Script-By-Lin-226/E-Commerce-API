# Railway Nixpacks Setup

## ✅ Configured for Nixpacks

Your project is now configured to use **Nixpacks** instead of Docker on Railway.

## What Changed

1. **`nixpacks.toml`** - Nixpacks configuration
   - Uses Python 3.11
   - Installs PostgreSQL client
   - Installs dependencies from `requirements.txt`
   - Uses `start_server.py` to handle PORT variable

2. **`railway.json`** - Updated to use Nixpacks builder
   - Changed from `DOCKERFILE` to `NIXPACKS`
   - Added explicit `startCommand`: `python start_server.py`

3. **`railway.toml`** - Updated to use Nixpacks builder
   - Changed from `dockerfile` to `nixpacks`
   - Added explicit `startCommand`: `python start_server.py`

4. **`start_server.py`** - Python script that handles PORT variable
   - Reads PORT from environment using `os.getenv()`
   - Converts to integer (no string issues)
   - Starts uvicorn with correct port

5. **`main.py`** - Updated to handle PORT variable
   - Reads PORT from environment variable

## How It Works

1. Railway detects `nixpacks.toml` and uses Nixpacks builder
2. Nixpacks installs Python 3.11 and dependencies
3. Railway sets `PORT` environment variable automatically
4. `start_server.py` reads PORT using `os.getenv("PORT", 8000)`
5. Converts to integer: `int(os.getenv("PORT", 8000))`
6. Passes integer port to `uvicorn.run()` - **no string issues!**
7. Uvicorn starts successfully with the correct port

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

## Why This Approach Works

- ✅ **Python script** reads PORT directly from environment
- ✅ **Integer conversion** ensures no string issues
- ✅ **Explicit startCommand** in Railway config ensures it's used
- ✅ **No bash variable expansion** - Python handles it natively

## Why Nixpacks?

- ✅ Simpler than Docker for Python apps
- ✅ Automatic dependency detection
- ✅ Better PORT variable handling
- ✅ Faster builds
- ✅ Railway's native build system

The PORT variable issue should be **completely resolved** now! 🎉

The key fix: Using a **Python script** instead of bash commands ensures PORT is read and converted to an integer before passing to uvicorn.

