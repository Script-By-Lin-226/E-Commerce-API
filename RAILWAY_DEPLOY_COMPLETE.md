# Complete Railway Deployment Guide - Frontend + Backend + Database

## 🚀 Complete Setup in 10 Steps

### Step 1: Push Code to GitHub

```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for Railway deployment"
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
3. Find and select: `E_Commerce_API`
4. Click **"Deploy Now"**

Railway will start auto-detecting your services.

---

## 🗄️ Step 4: Set Up PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway creates the database automatically
4. Wait for it to be ready (green status)

5. **Get Database URL:**
   - Click on the **PostgreSQL** service
   - Go to **"Variables"** tab
   - Find **"DATABASE_URL"**
   - **Copy the entire URL** (you'll need it)
   - Format: `postgresql://user:password@host:port/database`

---

## 🔧 Step 5: Configure Backend Service

Railway should have auto-detected your FastAPI backend. Configure it:

1. **Click on your backend service** (usually named after your repo)

2. **Go to "Settings" tab:**
   - **Root Directory:** Leave empty (or `./`)
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.app:app --host 0.0.0.0 --port $PORT`

3. **Go to "Variables" tab:**
   Click **"+ New Variable"** and add each:

   ```
   DATABASE_URL=postgresql://... (paste from Step 4)
   SECRET_KEY=your_secret_key_here
   ACCESS_TOKEN_EXPIRE_MINS=30
   REFRESH_TOKEN_EXPIRE_DAYS=7
   ALGORITHM=HS256
   ```

   **Generate SECRET_KEY:**
   ```bash
   # Run locally:
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```
   Copy the output and paste as `SECRET_KEY` value.

4. **Link Database to Backend:**
   - In backend service, go to **"Settings"**
   - Under **"Service Connections"**, click **"+ Connect"**
   - Select your **PostgreSQL** database
   - Railway will automatically add `DATABASE_URL` variable

---

## 🗃️ Step 6: Run Database Migrations

After backend is deployed:

**Option A: Railway CLI (Recommended)**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run alembic upgrade head
```

**Option B: Railway Dashboard**
1. Go to backend service
2. Click **"Deployments"** tab
3. Click on latest deployment
4. Click **"View Logs"** to see if migrations ran
5. Or use **"Shell"** tab to run commands manually

**Option C: Local Machine**
```bash
# Set DATABASE_URL to Railway database URL
export DATABASE_URL=postgresql://... (from Railway)

# Run migrations
alembic upgrade head
```

---

## 🌐 Step 7: Get Backend URL

1. Go to **backend service**
2. Click **"Settings"** tab
3. Scroll to **"Domains"** section
4. You'll see your backend URL:
   - Example: `https://e-commerce-api-production.up.railway.app`
5. **Copy this URL** - you'll need it for frontend

---

## 🎨 Step 8: Deploy Frontend

1. In Railway project, click **"+ New"**
2. Select **"GitHub Repo"**
3. Select the **same repository** (`E_Commerce_API`)
4. Railway will create a new service

5. **Configure Frontend Service:**
   - Click on the new **frontend service**
   - Go to **"Settings"** tab:
     - **Root Directory:** `frontend`
     - **Build Command:** `npm install && npm run build`
     - **Start Command:** `npm run preview` (or leave empty for static)

6. **Add Environment Variable:**
   - Go to **"Variables"** tab
   - Click **"+ New Variable"**
   - **Key:** `VITE_API_URL`
   - **Value:** Your Railway backend URL (from Step 7)
     - Example: `https://e-commerce-api-production.up.railway.app`

7. **Save and Deploy:**
   - Railway will automatically start building
   - Wait for deployment to complete

---

## 🔗 Step 9: Update CORS in Backend

After frontend is deployed, get its URL and update CORS:

1. **Get Frontend URL:**
   - Go to **frontend service**
   - **Settings** → **Domains**
   - Copy the URL

2. **Update Backend CORS:**
   - Edit `app/app.py` locally
   - Add Railway frontend URL to `allow_origins`:
   ```python
   allow_origins=[
       "https://e-commerce-api-test-seven.vercel.app",
       "http://localhost:3000",
       "https://e-commerce-api-1nn0.onrender.com",
       "https://your-frontend.up.railway.app",  # Add Railway frontend URL
   ],
   ```

3. **Commit and Push:**
   ```bash
   git add app/app.py
   git commit -m "Add Railway frontend to CORS"
   git push
   ```
   Railway will auto-deploy the backend with updated CORS.

---

## ✅ Step 10: Verify Everything Works

### Test Backend:
1. Visit: `https://your-backend.up.railway.app/docs`
2. Should see Swagger UI
3. Try a simple endpoint

### Test Frontend:
1. Visit: `https://your-frontend.up.railway.app`
2. Should see your React app
3. Try to register/login
4. Check browser console for errors

### Test Database:
1. Try to register a new user
2. Check if data is saved
3. Try to login with that user

---

## 📋 Complete Checklist

### Database:
- [ ] PostgreSQL database created
- [ ] Database URL copied
- [ ] Database linked to backend service

### Backend:
- [ ] Backend service created
- [ ] Environment variables set:
  - [ ] `DATABASE_URL`
  - [ ] `SECRET_KEY`
  - [ ] `ACCESS_TOKEN_EXPIRE_MINS=30`
  - [ ] `REFRESH_TOKEN_EXPIRE_DAYS=7`
  - [ ] `ALGORITHM=HS256`
- [ ] Build command set: `pip install -r requirements.txt`
- [ ] Start command set: `uvicorn app.app:app --host 0.0.0.0 --port $PORT`
- [ ] Backend deployed successfully
- [ ] Migrations run: `alembic upgrade head`
- [ ] Backend URL obtained

### Frontend:
- [ ] Frontend service created
- [ ] Root directory set: `frontend`
- [ ] Build command set: `npm install && npm run build`
- [ ] Environment variable set: `VITE_API_URL`
- [ ] Frontend deployed successfully
- [ ] Frontend URL obtained

### CORS:
- [ ] Frontend URL added to backend CORS
- [ ] Backend redeployed with updated CORS
- [ ] CORS errors resolved

### Testing:
- [ ] Backend API accessible
- [ ] Frontend loads correctly
- [ ] Can register new user
- [ ] Can login
- [ ] API calls work
- [ ] Database operations work

---

## 🐛 Troubleshooting

### Database Connection Error
**Problem:** Backend can't connect to database
**Solution:**
- Verify `DATABASE_URL` is set correctly
- Check database is running (green status)
- Ensure database is linked to backend service
- Use Railway's internal database URL (not public URL)

### Build Fails
**Problem:** Build command fails
**Solution:**
- Check build logs in Railway dashboard
- Verify `requirements.txt` is correct
- Check Python version (should be 3.11+)
- Verify all dependencies are listed

### Frontend Can't Connect to Backend
**Problem:** CORS errors or network errors
**Solution:**
- Verify `VITE_API_URL` is set correctly in frontend
- Check backend is running
- Update CORS in backend to include frontend URL
- Check browser console for specific errors

### Migrations Not Running
**Problem:** Database schema not created
**Solution:**
- Run migrations manually: `railway run alembic upgrade head`
- Check migration files exist in `migrations/versions/`
- Verify `DATABASE_URL` is correct
- Check migration logs

### Port Error
**Problem:** Port already in use
**Solution:**
- Railway sets `$PORT` automatically
- Make sure start command uses `$PORT`
- Don't hardcode port numbers
- Check start command: `uvicorn app.app:app --host 0.0.0.0 --port $PORT`

---

## 💡 Pro Tips

1. **Use Railway CLI** for easier management:
   ```bash
   npm i -g @railway/cli
   railway login
   railway link
   railway status
   ```

2. **Monitor Usage:**
   - Check usage in Railway dashboard
   - Free tier: $5 credit/month
   - Monitor to stay within limits

3. **Environment Variables:**
   - Set in Railway dashboard, not in code
   - Never commit secrets to git
   - Use Railway's variable management

4. **Auto-Deploy:**
   - Railway auto-deploys on git push
   - Check deployment logs if issues occur
   - Can manually trigger deployments

5. **Database Backups:**
   - Railway provides automatic backups
   - Check database settings for backup options
   - Consider manual backups for important data

---

## 🎯 Your Railway Project Structure

```
E_Commerce_API Project
├── PostgreSQL Database
│   ├── DATABASE_URL (auto-generated)
│   └── Status: Running
├── Backend Service (FastAPI)
│   ├── Environment Variables
│   ├── Connected to: PostgreSQL
│   ├── URL: https://your-backend.up.railway.app
│   └── Status: Running
└── Frontend Service (React)
    ├── Environment Variables
    ├── VITE_API_URL: https://your-backend.up.railway.app
    ├── URL: https://your-frontend.up.railway.app
    └── Status: Running
```

---

## 🎉 Success!

Once everything is deployed:
- ✅ Database running on Railway
- ✅ Backend deployed and connected to database
- ✅ Frontend deployed and connected to backend
- ✅ All services accessible via HTTPS
- ✅ Automatic deployments on git push
- ✅ Free tier covers your demo

## 📚 Additional Resources

- Railway Docs: https://docs.railway.app
- Railway Dashboard: https://railway.app/dashboard
- Railway CLI: https://docs.railway.app/develop/cli
- Support: https://railway.app/support

---

## 🚀 Quick Commands Reference

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs

# Run command
railway run <command>

# Run migrations
railway run alembic upgrade head

# Check status
railway status
```

