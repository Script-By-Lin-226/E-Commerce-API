# Railway Deployment Guide

This guide will help you deploy both the E-Commerce API backend and frontend to Railway.

## Prerequisites
- A GitHub account with this repository
- A Railway account (sign up at https://railway.app)
- Railway CLI (optional): `npm i -g @railway/cli`

---

## Backend Deployment on Railway

### Step 1: Create a New Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### Step 2: Add PostgreSQL Database
1. In your Railway project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create a PostgreSQL database
4. Copy the connection URL from the database service (you'll need this)

### Step 3: Configure Backend Service
1. Railway should auto-detect your Python backend
2. If not, click "+ New" → "GitHub Repo" → Select your repo
3. Set the **Root Directory** to `/` (root of repository)
4. Railway will use the `Procfile` or detect it's a Python project

### Step 4: Set Environment Variables
Go to your backend service → Variables tab and add:

```
DATABASE_URL=postgresql://... (from PostgreSQL service)
SECRET_KEY=your-secret-key-here (generate with: openssl rand -hex 32)
ACCESS_TOKEN_EXPIRE_MINS=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ALGORITHM=HS256
PORT=8000 (Railway sets this automatically, but you can specify)
```

**Important**: Railway automatically provides `DATABASE_URL` if you link the PostgreSQL service. You can use the "Reference Variable" feature to link it.

### Step 5: Configure Build Settings
Railway will auto-detect:
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: From `Procfile` or `uvicorn app.app:app --host 0.0.0.0 --port $PORT`

### Step 6: Deploy
- Railway will automatically deploy on every push to your main branch
- Or click "Deploy" to trigger a manual deployment
- Your API will be available at: `https://your-app-name.up.railway.app`

### Step 7: Run Database Migrations
1. Go to your backend service → Settings → "Generate Domain"
2. Get your service URL
3. Use Railway's CLI or connect via SSH:
   ```bash
   railway run alembic upgrade head
   ```

---

## Frontend Deployment on Railway

### Step 1: Add Frontend Service
1. In the same Railway project, click "+ New"
2. Select "GitHub Repo" → Select your repository again
3. This creates a new service for the frontend

### Step 2: Configure Frontend Service
1. Go to the frontend service → Settings
2. Set **Root Directory** to `frontend`
3. Railway will auto-detect it's a Node.js project

### Step 3: Set Environment Variables
Go to frontend service → Variables tab and add:

```
VITE_API_URL=https://your-backend-service.up.railway.app
NODE_ENV=production
PORT=3000 (Railway sets this automatically)
```

**Important**: Replace `your-backend-service` with your actual backend service URL from Railway.

### Step 4: Configure Build Settings
Railway will auto-detect:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start` (from package.json)

### Step 5: Deploy
- Railway will automatically deploy on every push
- Your frontend will be available at: `https://your-frontend-service.up.railway.app`

---

## Railway-Specific Features

### 1. Service Linking
- Railway can automatically link services
- Use "Reference Variable" to share environment variables between services
- For example, you can reference the backend URL in the frontend service

### 2. Custom Domains
1. Go to service → Settings → "Generate Domain"
2. Or add a custom domain in the "Domains" section

### Step 3: Environment Variables Reference
Instead of hardcoding the backend URL, you can use Railway's variable reference:
```
VITE_API_URL=${{backend.RAILWAY_PUBLIC_DOMAIN}}
```
(Replace `backend` with your backend service name)

---

## Post-Deployment Checklist

- [ ] Backend is accessible at Railway URL
- [ ] Frontend is accessible at Railway URL
- [ ] Frontend can connect to backend API
- [ ] Database migrations are run
- [ ] CORS is configured correctly (already set to allow all origins)
- [ ] Environment variables are set correctly
- [ ] `VITE_API_URL` points to the correct backend URL
- [ ] Test authentication flow
- [ ] Test product creation/management
- [ ] Test order creation and payment

---

## Troubleshooting

### Backend Issues

**Database Connection Error**
- Verify `DATABASE_URL` is set correctly
- Make sure PostgreSQL service is linked to your backend service
- Check that the database is running (Railway shows status)
- **SSL Connection**: Railway PostgreSQL requires SSL. The code automatically adds SSL parameters, but if you see connection errors:
  - Ensure `DATABASE_URL` from Railway includes SSL parameters
  - Check Railway logs for specific connection error messages
  - Verify the database service is accessible from your backend service
- **Connection Pool**: The app uses connection pooling with `pool_pre_ping=True` to verify connections
- If connection fails on startup, it will retry on first request

**Build Errors**
- Check build logs in Railway dashboard
- Ensure all dependencies are in `requirements.txt`
- Verify Python version (Railway uses Python 3.11 by default)

**Port Issues**
- Railway automatically sets `$PORT` environment variable
- Make sure your app listens on `0.0.0.0` and uses `$PORT`

### Frontend Issues

**Build Errors**
- Check build logs in Railway dashboard
- Ensure `VITE_API_URL` is set correctly
- Verify Node.js version (should be >= 18.0.0)

**API Connection Failed**
- Verify `VITE_API_URL` is set correctly
- Check that backend URL is accessible
- Ensure CORS is configured on the backend
- Make sure `VITE_API_URL` includes `https://` protocol

**Static Files Not Serving**
- Verify `serve` package is in dependencies
- Check that build output directory `dist` exists

---

## Environment Variables Summary

### Backend (Railway)
```
DATABASE_URL=postgresql://... (auto-provided if linked)
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINS=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ALGORITHM=HS256
PORT=8000 (auto-set by Railway)
```

### Frontend (Railway)
```
VITE_API_URL=https://your-backend-service.up.railway.app
NODE_ENV=production
PORT=3000 (auto-set by Railway)
```

---

## Railway CLI Commands (Optional)

If you install Railway CLI:

```bash
# Login
railway login

# Link to project
railway link

# View logs
railway logs

# Run commands
railway run alembic upgrade head
railway run python manage.py migrate

# Set environment variables
railway variables set DATABASE_URL=postgresql://...
```

---

## Updating Deployments

### Automatic Deployments
- Railway automatically deploys on every push to your main branch
- You can configure which branch to deploy from in service settings

### Manual Deployments
- Go to service → Deployments
- Click "Redeploy" on any previous deployment
- Or trigger a new deployment from the dashboard

---

## Cost Considerations

- Railway offers a **free tier** with $5 credit per month
- Free tier includes:
  - 500 hours of usage
  - 1GB RAM per service
  - 1GB disk space
- Paid plans start at $5/month for more resources

---

## Security Notes

- Never commit `.env` files to Git
- Use strong, randomly generated `SECRET_KEY`
- Railway encrypts environment variables
- For production, restrict CORS origins instead of allowing all (`*`)
- Use HTTPS (Railway provides this by default)

---

## Quick Start Commands

### Deploy Backend
1. Create new project on Railway
2. Add PostgreSQL database
3. Add service from GitHub repo
4. Set environment variables
5. Deploy

### Deploy Frontend
1. Add new service in same project
2. Set root directory to `frontend`
3. Set `VITE_API_URL` environment variable
4. Deploy

Both services will be automatically deployed and Railway will provide URLs for each.

