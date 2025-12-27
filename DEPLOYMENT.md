# Deployment Guide

This guide will help you deploy the E-Commerce API backend to Render and the frontend to Vercel.

## Backend Deployment on Render

### Prerequisites
- A GitHub account with this repository
- A Render account (sign up at https://render.com)

### Steps

1. **Create a PostgreSQL Database on Render**
   - Go to your Render dashboard
   - Click "New +" → "PostgreSQL"
   - Choose a name and region
   - Click "Create Database"
   - Copy the **Internal Database URL** (you'll need this)

2. **Deploy the Web Service**
   - Go to your Render dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select this repository
   - Render will auto-detect the `render.yaml` file
   - Or manually configure:
     - **Name**: e-commerce-api (or your preferred name)
     - **Environment**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn app.app:app --host 0.0.0.0 --port $PORT`
     - **Plan**: Free (or choose a paid plan)

3. **Set Environment Variables**
   In the Render dashboard, go to your service → Environment tab and add:
   - `DATABASE_URL`: Your PostgreSQL database URL from step 1
   - `SECRET_KEY`: Generate a strong secret key (you can use: `openssl rand -hex 32`)
   - `ACCESS_TOKEN_EXPIRE_MINS`: 30
   - `REFRESH_TOKEN_EXPIRE_DAYS`: 7
   - `ALGORITHM`: HS256
   - `PYTHON_VERSION`: 3.11.0

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your application
   - Wait for the deployment to complete
   - Your API will be available at: `https://your-app-name.onrender.com`

5. **Run Database Migrations**
   - After deployment, you may need to run migrations
   - You can do this via Render's shell or by adding a one-time script
   - Command: `alembic upgrade head`

### Important Notes
- Free tier services on Render spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to a paid plan for production use

---

## Frontend Deployment on Vercel

### Prerequisites
- A Vercel account (sign up at https://vercel.com)
- Your backend API URL from Render

### Steps

1. **Install Vercel CLI (Optional)**
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**
   - Go to https://vercel.com
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the repository
   - **Important**: Set the **Root Directory** to `frontend`
   - Vercel will auto-detect the `vercel.json` configuration

3. **Set Environment Variables**
   In the Vercel project settings → Environment Variables, add:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://your-app-name.onrender.com`)
   - Make sure to add this for **Production**, **Preview**, and **Development** environments

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Your frontend will be available at: `https://your-project.vercel.app`

### Alternative: Deploy via CLI

```bash
cd frontend
vercel
```

Follow the prompts and set the environment variable when asked.

---

## Post-Deployment Checklist

- [ ] Backend is accessible at Render URL
- [ ] Frontend is accessible at Vercel URL
- [ ] Frontend can connect to backend API
- [ ] Database migrations are run
- [ ] CORS is configured correctly (already set to allow all origins)
- [ ] Environment variables are set correctly
- [ ] Test authentication flow
- [ ] Test product creation/management
- [ ] Test order creation and payment

---

## Troubleshooting

### Backend Issues

**Database Connection Error**
- Verify `DATABASE_URL` is set correctly in Render
- Make sure you're using the **Internal Database URL** if database and web service are in the same region
- Check that the database is running

**Import Errors**
- Ensure all dependencies are in `requirements.txt`
- Check Python version matches (3.11.0)

**Static Files Not Serving**
- Verify the `images` directory structure
- Check file permissions

### Frontend Issues

**API Connection Failed**
- Verify `VITE_API_URL` is set correctly in Vercel
- Check that the backend URL is accessible
- Ensure CORS is configured on the backend (already done)

**Build Errors**
- Check Node.js version (should be >= 18.0.0)
- Run `npm install` locally to check for dependency issues
- Review build logs in Vercel dashboard

---

## Environment Variables Summary

### Backend (Render)
```
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINS=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ALGORITHM=HS256
PYTHON_VERSION=3.11.0
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-app-name.onrender.com
```

---

## Updating Deployments

### Backend
- Push changes to your GitHub repository
- Render will automatically redeploy (if auto-deploy is enabled)
- Or manually trigger deployment from Render dashboard

### Frontend
- Push changes to your GitHub repository
- Vercel will automatically redeploy
- Or manually trigger deployment from Vercel dashboard

---

## Security Notes

- Never commit `.env` files to Git
- Use strong, randomly generated `SECRET_KEY`
- Consider using Render's environment variable encryption
- For production, restrict CORS origins instead of allowing all (`*`)
- Use HTTPS (both Render and Vercel provide this by default)

