# Deploy Frontend on Vercel

## ✅ Configured for Vercel

Your frontend is now configured to deploy on Vercel with your Railway backend.

## Backend URL

Your Railway backend is running at:
```
https://web-production-c55ff.up.railway.app/
```

## What's Configured

1. **`frontend/vercel.json`** - Vercel configuration
   - Build command: `npm install --legacy-peer-deps && npm run build`
   - Output directory: `dist`
   - React Router rewrites (all routes → `/index.html`)

2. **Backend CORS** - Updated in `app/app.py`
   - Added regex pattern to allow all Vercel domains: `https://.*\.vercel\.app`

## Deployment Steps

### 1. Push to GitHub

Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Configure Vercel deployment"
git push
```

### 2. Deploy on Vercel

1. **Go to https://vercel.com** and sign up/login
2. **Click "Add New Project"**
3. **Import your GitHub repository**
   - Select your `E_Commerce_API` repository
   - Authorize Vercel if needed

4. **Configure Project Settings**:
   - **Framework Preset**: Vite (or leave as "Other")
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install --legacy-peer-deps`

5. **Environment Variables**:
   Click "Environment Variables" and add:
   ```
   VITE_API_URL=https://web-production-c55ff.up.railway.app
   ```
   **Important**: Don't include the trailing slash `/`

6. **Click "Deploy"**

### 3. Get Your Frontend URL

After deployment, Vercel will provide a URL like:
```
https://your-project-name.vercel.app
```

### 4. Update Backend CORS (If Needed)

The backend CORS is already configured with a regex pattern to allow all Vercel domains. However, if you want to add your specific Vercel URL, you can update `app/app.py`:

```python
allow_origins=[
    "http://localhost:3000",
    "https://your-project-name.vercel.app",  # Your specific Vercel URL
],
allow_origin_regex=r"https://.*\.vercel\.app",  # Or use regex for all Vercel
```

## Environment Variables

**Required in Vercel:**
- `VITE_API_URL=https://web-production-c55ff.up.railway.app`

**Note**: Vercel automatically rebuilds when you push to your main branch!

## How It Works

1. Vercel detects `frontend/vercel.json`
2. Installs dependencies: `npm install --legacy-peer-deps`
3. Builds the app: `npm run build` → creates `dist/` folder
4. Serves static files from `dist/`
5. React Router rewrites all routes to `index.html` (SPA mode)
6. Frontend makes API calls to Railway backend using `VITE_API_URL`

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure `VITE_API_URL` is set correctly (no trailing slash)
- Verify Node.js version (should be 18+)

### CORS Errors
- Backend CORS is configured with regex for Vercel domains
- If issues persist, add your specific Vercel URL to `allow_origins` in `app/app.py`
- Ensure backend is running and accessible

### API Calls Fail
- Verify `VITE_API_URL` is set correctly in Vercel
- Check that backend URL is accessible: https://web-production-c55ff.up.railway.app/
- Ensure backend CORS allows your Vercel domain

### Routes Not Working (404)
- The `vercel.json` has rewrites configured
- All routes should redirect to `index.html` for React Router

## Custom Domain

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Follow DNS instructions
4. Vercel provides free SSL certificates

## Auto-Deploy

Vercel automatically deploys when you:
- Push to `main` branch (production)
- Create a pull request (preview deployment)
- Push to other branches (preview deployment)

Your frontend is ready to deploy on Vercel! 🚀

**Backend URL**: https://web-production-c55ff.up.railway.app/
**Frontend will be at**: https://your-project-name.vercel.app

