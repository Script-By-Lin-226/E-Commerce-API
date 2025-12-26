# Deploy Frontend on Railway

## ✅ Configured for Railway

Your frontend is now configured to deploy on Railway using Nixpacks, just like your backend.

## What's Configured

1. **`frontend/nixpacks.toml`** - Nixpacks configuration
   - Uses Node.js 18 and Python 3.11
   - Installs dependencies with `--legacy-peer-deps`
   - Builds the React app
   - Uses Python script to serve static files

2. **`frontend/railway.json`** - Railway configuration
   - Uses Nixpacks builder
   - Start command: `python3 start_server.py`

3. **`frontend/start_server.py`** - Python server script
   - Handles PORT variable correctly
   - Serves `dist/` folder
   - Supports SPA routing (all routes → `index.html`)

4. **Backend CORS** - Updated in `app/app.py`
   - Added regex pattern to allow Railway domains: `https://.*\.(railway\.app|up\.railway\.app)`

## Deployment Steps

### 1. Commit and Push Changes

```bash
git add frontend/nixpacks.toml frontend/railway.json frontend/start_server.py app/app.py
git commit -m "Configure frontend for Railway deployment"
git push
```

### 2. Deploy Frontend on Railway

1. **In Railway Dashboard**:
   - Go to your project (where your backend is deployed)
   - Click **"New"** → **"GitHub Repo"**
   - Select your repository again

2. **Configure the Service**:
   - **Root Directory**: Set to `frontend`
   - Railway will auto-detect `frontend/nixpacks.toml`
   - Or manually set builder to **Nixpacks**

3. **Set Environment Variables**:
   - `VITE_API_URL=https://web-production-c55ff.up.railway.app`
   - **Important**: Use your backend Railway URL (no trailing slash)
   - Railway automatically sets `PORT`

4. **Deploy**:
   - Railway will build and deploy automatically
   - Your frontend will be available at Railway's provided URL

### 3. Get Your URLs

After deployment:
- **Backend**: `https://web-production-c55ff.up.railway.app/`
- **Frontend**: `https://your-frontend-service.railway.app` (Railway will provide this)

### 4. Update Backend CORS (Already Done)

The backend CORS is already updated to allow Railway domains. If you need to add your specific frontend URL:

```python
allow_origins=[
    "http://localhost:3000",
    "https://your-frontend-service.railway.app",  # Your specific frontend URL
],
allow_origin_regex=r"https://.*\.(railway\.app|up\.railway\.app)",  # Or use regex
```

## How It Works

1. Railway detects `frontend/nixpacks.toml`
2. Nixpacks installs Node.js 18, npm, and Python 3.11
3. Installs dependencies: `npm install --legacy-peer-deps`
4. Builds the app: `npm run build` (creates `dist/` folder)
5. Runs `start_server.py` which:
   - Reads PORT from environment (or defaults to 3000)
   - Serves the `dist/` folder
   - Handles SPA routing (all routes serve `index.html`)

## Environment Variables

**Required:**
- `VITE_API_URL` - Your backend API URL (e.g., `https://web-production-c55ff.up.railway.app`)

**Auto-set by Railway:**
- `PORT` - Railway sets this automatically

## Troubleshooting

### Build Fails
- Check Railway logs
- Ensure `VITE_API_URL` is set correctly (no trailing slash)
- Verify Node.js version (should be 18+)

### PORT Variable Error
- The `start_server.py` script handles PORT correctly using Python's `os.getenv()`
- Should work the same way as your backend

### CORS Errors
- Backend CORS is configured with regex for Railway domains
- If issues persist, add your specific frontend URL to `allow_origins` in `app/app.py`
- Ensure backend is running and accessible

### Static Files Not Loading
- Verify `dist/` folder is built correctly
- Check Railway build logs
- Ensure `start_server.py` is in the `frontend/` directory

### Routes Not Working (404)
- The `start_server.py` handles SPA routing
- All routes should serve `index.html` for React Router

## Project Structure on Railway

Your Railway project will have:
- **Backend Service**: Root directory (uses root `nixpacks.toml`)
- **Frontend Service**: Root directory `frontend` (uses `frontend/nixpacks.toml`)

Both services can be in the same Railway project!

## Notes

- Frontend is served as static files (SPA)
- React Router will work with the SPA handler in `start_server.py`
- Both frontend and backend use the same Nixpacks approach
- Both handle PORT variable correctly using Python scripts

Your frontend is ready to deploy on Railway! 🚀

**Backend URL**: https://web-production-c55ff.up.railway.app/
**Frontend will be at**: Railway will provide the URL after deployment

