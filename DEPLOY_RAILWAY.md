# Deploy to Railway - Full Stack (Frontend + Backend)

## 🚀 Quick Deploy Guide

Railway is the easiest way to deploy both frontend and backend together!

## Step 1: Prepare Your Code

```bash
# Make sure everything is committed
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

## Step 2: Sign Up for Railway

1. Go to: https://railway.app
2. Click **Start a New Project**
3. Sign up with **GitHub** (recommended)
4. Authorize Railway to access your repositories

## Step 3: Deploy Your Project

1. **New Project** → **Deploy from GitHub repo**
2. Select your repository: `E_Commerce_API`
3. Railway will auto-detect your services!

## Step 4: Configure Backend Service

Railway should auto-detect your FastAPI backend:

1. **Service Settings:**
   - Name: `e-commerce-backend` (or auto-generated)
   - Root Directory: Leave empty (or `./`)

2. **Environment Variables:**
   Click **Variables** tab and add:
   ```
   DATABASE_URL=postgresql://... (Railway will provide)
   SECRET_KEY=your_secret_key_here
   ACCESS_TOKEN_EXPIRE_MINS=30
   REFRESH_TOKEN_EXPIRE_DAYS=7
   ALGORITHM=HS256
   PORT=8000 (auto-set by Railway)
   ```

3. **Build Settings:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.app:app --host 0.0.0.0 --port $PORT`

## Step 5: Add PostgreSQL Database

1. Click **+ New** → **Database** → **PostgreSQL**
2. Railway creates database automatically
3. Copy **DATABASE_URL** from database settings
4. Add to backend environment variables

## Step 6: Configure Frontend Service

1. Click **+ New** → **GitHub Repo**
2. Select same repository
3. **Service Settings:**
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview` (or use static hosting)

4. **Environment Variables:**
   - `VITE_API_URL` = Your Railway backend URL
     - Example: `https://e-commerce-backend-production.up.railway.app`

## Step 7: Run Migrations

After backend is deployed:

1. Go to backend service
2. Click **Deployments** → **View Logs**
3. Or use Railway CLI:
   ```bash
   railway run alembic upgrade head
   ```

## Step 8: Get Your URLs

After deployment:
- **Backend:** `https://your-backend.up.railway.app`
- **Frontend:** `https://your-frontend.up.railway.app`

## 🔧 Railway Configuration (Optional)

Create `railway.json` in project root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  }
}
```

## 📋 Environment Variables Checklist

### Backend:
- [ ] `DATABASE_URL` (from Railway PostgreSQL)
- [ ] `SECRET_KEY` (generate random string)
- [ ] `ACCESS_TOKEN_EXPIRE_MINS=30`
- [ ] `REFRESH_TOKEN_EXPIRE_DAYS=7`
- [ ] `ALGORITHM=HS256`

### Frontend:
- [ ] `VITE_API_URL` (Railway backend URL)

## 🎯 Benefits of Railway

- ✅ **Auto-detection** - Detects your stack automatically
- ✅ **Easy setup** - Minimal configuration needed
- ✅ **Both services** - Frontend + Backend in one place
- ✅ **Database included** - PostgreSQL available
- ✅ **Free tier** - $5 credit/month
- ✅ **HTTPS** - Automatic SSL certificates
- ✅ **GitHub integration** - Auto-deploy on push

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Railway dashboard
- Verify `requirements.txt` is correct
- Check Python version

### Database Connection Error
- Verify `DATABASE_URL` is set correctly
- Check database is running
- Ensure using Railway's internal database URL

### Frontend Can't Connect to Backend
- Verify `VITE_API_URL` is set correctly
- Check backend is running
- Update CORS in backend to allow Railway frontend URL

## 💡 Pro Tips

1. **Use Railway CLI** for easier management:
   ```bash
   npm i -g @railway/cli
   railway login
   railway link
   ```

2. **Monitor Usage** - Check usage in dashboard to stay within free tier

3. **Custom Domains** - Railway supports custom domains (paid feature)

4. **Environment Variables** - Set them in Railway dashboard, not in code

## 🎉 Success!

Once deployed:
- Your app is live on Railway!
- Both frontend and backend in one place
- Automatic deployments on git push
- Free tier covers small projects

