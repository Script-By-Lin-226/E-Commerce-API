# Railway Setup - Complete Guide

## ✅ Project is Ready for Railway!

All configuration files have been created. Follow these steps:

## 🚀 Step-by-Step Deployment

### Step 1: Push Code to GitHub

```bash
# Make sure all changes are committed
git add .
git commit -m "Setup for Railway deployment"
git push origin main
```

### Step 2: Sign Up for Railway

1. Go to: **https://railway.app**
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (recommended)
4. Authorize Railway to access your repositories

### Step 3: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select your repository: `E_Commerce_API`
4. Click **"Deploy Now"**

### Step 4: Railway Auto-Detection

Railway will automatically:
- ✅ Detect your Python/FastAPI backend
- ✅ Set up the service
- ✅ Start building

### Step 5: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway creates the database automatically
4. **Copy the DATABASE_URL** (you'll need it)

### Step 6: Configure Backend Environment Variables

1. Click on your **backend service**
2. Go to **"Variables"** tab
3. Click **"+ New Variable"** and add:

```
DATABASE_URL=postgresql://... (paste from database)
SECRET_KEY=your_random_secret_key_here
ACCESS_TOKEN_EXPIRE_MINS=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ALGORITHM=HS256
PORT=8000
```

**Generate SECRET_KEY:**
```bash
# Run this locally:
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 7: Update Backend Settings (if needed)

1. Go to **"Settings"** tab
2. **Root Directory:** Leave empty (or `./`)
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `uvicorn app.app:app --host 0.0.0.0 --port $PORT`

### Step 8: Run Database Migrations

After backend is deployed:

**Option A: Railway CLI**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run migrations
railway run alembic upgrade head
```

**Option B: Railway Dashboard**
1. Go to backend service
2. Click **"Deployments"** tab
3. Click **"View Logs"**
4. Or use **"Shell"** tab to run commands

### Step 9: Get Backend URL

1. Go to backend service
2. Click **"Settings"** tab
3. Under **"Domains"**, you'll see your URL:
   - Example: `https://e-commerce-api-production.up.railway.app`
4. **Copy this URL** - you'll need it for frontend

### Step 10: Deploy Frontend

1. In Railway project, click **"+ New"**
2. Select **"GitHub Repo"**
3. Select the **same repository**
4. Railway will create a new service

5. **Configure Frontend Service:**
   - **Settings** → **Root Directory:** `frontend`
   - **Settings** → **Build Command:** `npm install && npm run build`
   - **Settings** → **Start Command:** `npm run preview` (or use static hosting)

6. **Add Environment Variable:**
   - **Variables** tab → **"+ New Variable"**
   - **Key:** `VITE_API_URL`
   - **Value:** Your Railway backend URL (from Step 9)

### Step 11: Update CORS in Backend

After getting frontend URL, update CORS:

1. Edit `app/app.py`
2. Add Railway frontend URL to `allow_origins`:
   ```python
   allow_origins=[
       "https://e-commerce-api-test-seven.vercel.app",
       "http://localhost:3000",
       "https://e-commerce-api-1nn0.onrender.com",
       "https://your-frontend.up.railway.app",  # Add this
   ],
   ```
3. Commit and push:
   ```bash
   git add app/app.py
   git commit -m "Add Railway frontend to CORS"
   git push
   ```

### Step 12: Verify Deployment

1. **Backend:**
   - Visit: `https://your-backend.up.railway.app/docs`
   - Should see Swagger UI

2. **Frontend:**
   - Visit: `https://your-frontend.up.railway.app`
   - Should see your React app

3. **Test:**
   - Try to register/login
   - Test API calls
   - Check browser console for errors

## 📋 Configuration Files Created

✅ `railway.json` - Railway configuration
✅ `nixpacks.toml` - Build configuration
✅ `Procfile` - Process file (already exists)
✅ `requirements.txt` - Python dependencies (already exists)

## 🔧 Railway Service Structure

Your Railway project will have:

```
E_Commerce_API Project
├── Backend Service (FastAPI)
│   ├── Environment Variables
│   ├── PostgreSQL Database (linked)
│   └── Deployments
└── Frontend Service (React)
    ├── Environment Variables
    └── Deployments
```

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Railway dashboard
- Verify `requirements.txt` is correct
- Check Python version (should be 3.11+)

### Database Connection Error
- Verify `DATABASE_URL` is set correctly
- Check database is running
- Ensure using Railway's internal database URL

### Frontend Can't Connect
- Verify `VITE_API_URL` is set correctly
- Check backend is running
- Update CORS in backend

### Port Error
- Railway sets `$PORT` automatically
- Make sure start command uses `$PORT`
- Don't hardcode port numbers

## 💡 Pro Tips

1. **Use Railway CLI** for easier management
2. **Monitor Usage** - Check usage in dashboard
3. **Environment Variables** - Set in Railway, not in code
4. **Auto-Deploy** - Railway auto-deploys on git push
5. **Logs** - Check logs in dashboard for debugging

## 🎯 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Project created from GitHub
- [ ] PostgreSQL database added
- [ ] Backend environment variables set
- [ ] Backend deployed successfully
- [ ] Migrations run
- [ ] Backend URL obtained
- [ ] Frontend service created
- [ ] Frontend environment variables set
- [ ] Frontend deployed successfully
- [ ] CORS updated with frontend URL
- [ ] Tested both services

## 🎉 Success!

Once everything is deployed:
- ✅ Both services live on Railway
- ✅ Automatic deployments on git push
- ✅ Free tier covers your demo
- ✅ HTTPS included automatically

## 📚 Additional Resources

- Railway Docs: https://docs.railway.app
- Railway Dashboard: https://railway.app/dashboard
- Railway CLI: `npm i -g @railway/cli`

