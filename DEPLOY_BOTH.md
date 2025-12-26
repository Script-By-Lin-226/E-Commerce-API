# Deploy Backend (Render) + Frontend (Vercel)

Complete guide to deploy your full-stack application.

## 📋 Overview

- **Backend:** Render (Python/FastAPI)
- **Frontend:** Vercel (React/Vite)
- **Database:** Render PostgreSQL (free tier available)

## 🚀 Part 1: Deploy Backend to Render

### Step 1: Prepare Repository

```bash
# Make sure all files are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Render Account

1. Go to: https://render.com
2. Sign up with GitHub
3. Connect your repository

### Step 3: Create PostgreSQL Database

1. **Dashboard** → **New +** → **PostgreSQL**
2. **Settings:**
   - Name: `e-commerce-db`
   - Region: Choose closest
   - Plan: Free (or paid)
3. **Click Create Database**
4. **Copy Internal Database URL** (save this!)

### Step 4: Create Web Service

1. **Dashboard** → **New +** → **Web Service**
2. **Connect Repository:**
   - Select your GitHub repo
   - Click **Connect**

3. **Basic Settings:**
   - **Name:** `e-commerce-api`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Root Directory:** Leave empty

4. **Build & Deploy:**
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.app:app --host 0.0.0.0 --port $PORT`

5. **Environment Variables:**
   Add these:
   ```
   DATABASE_URL=postgresql://... (from Step 3)
   SECRET_KEY=your_random_secret_key_here
   ACCESS_TOKEN_EXPIRE_MINS=30
   REFRESH_TOKEN_EXPIRE_DAYS=7
   ALGORITHM=HS256
   ```

6. **Click Create Web Service**

### Step 5: Run Database Migrations

After first deployment:

**Option A: Render Shell**
1. Go to your web service
2. Click **Shell** tab
3. Run:
   ```bash
   alembic upgrade head
   ```

**Option B: Local Machine**
```bash
export DATABASE_URL=postgresql://... (Render database URL)
alembic upgrade head
```

### Step 6: Get Backend URL

After deployment, your backend URL will be:
- `https://e-commerce-api.onrender.com` (or your service name)

**Save this URL!** You'll need it for frontend.

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Environment Variable

1. Go to: https://vercel.com/dashboard
2. Select your project: `e-commerce-api-test-seven`
3. **Settings** → **Environment Variables**
4. Update `VITE_API_URL`:
   - **Value:** `https://e-commerce-api.onrender.com` (your Render backend URL)
   - **Environments:** ✅ Production ✅ Preview ✅ Development
5. Click **Save**

### Step 2: Redeploy Frontend

1. Go to **Deployments** tab
2. Click **⋯** → **Redeploy**
3. Wait for deployment to complete

### Step 3: Verify Connection

1. Visit your Vercel frontend
2. Try to login/register
3. Check browser console for errors
4. Test API calls

## 🔧 Part 3: Update Backend CORS

After both are deployed, update backend CORS:

1. **Edit `app/app.py`:**
   ```python
   CORS_ORIGINS = [
       # ... existing origins ...
       "https://e-commerce-api-test-seven.vercel.app",  # Your Vercel URL
   ]
   ```

2. **Commit and push:**
   ```bash
   git add app/app.py
   git commit -m "Update CORS for Vercel frontend"
   git push
   ```

3. **Render will auto-deploy** (or manually redeploy)

## ✅ Final Checklist

- [ ] Backend deployed on Render
- [ ] Database created and connected
- [ ] Migrations run successfully
- [ ] Backend URL obtained
- [ ] Frontend `VITE_API_URL` updated in Vercel
- [ ] Frontend redeployed
- [ ] Backend CORS updated
- [ ] Backend redeployed
- [ ] Tested login/register
- [ ] Tested API calls

## 🔗 Your URLs

After deployment:

- **Backend:** `https://e-commerce-api.onrender.com`
- **Frontend:** `https://e-commerce-api-test-seven.vercel.app`
- **API Docs:** `https://e-commerce-api.onrender.com/docs`

## 🐛 Common Issues

### Backend Not Starting
- Check start command: `uvicorn app.app:app --host 0.0.0.0 --port $PORT`
- Verify all environment variables are set
- Check Render logs

### Database Connection Failed
- Verify `DATABASE_URL` is correct
- Check database is running
- Ensure using Internal Database URL (not public)

### CORS Errors
- Update CORS in `app/app.py`
- Add Vercel URL to `CORS_ORIGINS`
- Redeploy backend

### Frontend Can't Connect
- Verify `VITE_API_URL` is set correctly
- Check backend is running
- Test backend URL directly: `https://e-commerce-api.onrender.com/docs`

## 💡 Tips

1. **Free Tier Limits:**
   - Render: Services spin down after 15 min inactivity
   - First request may be slow (cold start)
   - Database has size limitations

2. **Upgrade Options:**
   - Render paid plans: No spin-down, faster
   - Vercel Pro: Better performance

3. **Monitoring:**
   - Check Render logs regularly
   - Monitor database usage
   - Set up alerts if needed

## 🎉 Success!

Once both are deployed and connected:
- Your app is live and accessible worldwide!
- No more ngrok URL changes
- Permanent URLs
- Better performance

