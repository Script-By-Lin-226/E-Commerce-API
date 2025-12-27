# Deployment Guide

This guide will help you deploy both the E-Commerce API backend and frontend to Render.

## Deployment on Render

### Prerequisites
- A GitHub account with this repository
- A Render account (sign up at https://render.com)

### Steps

1. **Create a PostgreSQL Database on Render**
   - Go to your Render dashboard
   - Click "New +" → "PostgreSQL"
   - Choose a name and region (Singapore recommended to match services)
   - Click "Create Database"
   - Copy the **Internal Database URL** (you'll need this)

2. **Deploy Both Services Using render.yaml**
   - Go to your Render dashboard
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select this repository
   - Render will auto-detect the `render.yaml` file and create both services automatically
   - **Backend Service (e-commerce-api)**:
     - Environment: Python 3
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `uvicorn app.app:app --host 0.0.0.0 --port $PORT`
   - **Frontend Service (e-commerce-frontend)**:
     - Environment: Node.js
     - Root Directory: `frontend`
     - Build Command: `npm install && npm run build`
     - Start Command: `npx serve -s dist -l $PORT`

3. **Set Environment Variables for Backend**
   In the Render dashboard, go to **e-commerce-api** service → Environment tab and add:
   - `DATABASE_URL`: Your PostgreSQL database URL from step 1
   - `SECRET_KEY`: Generate a strong secret key (you can use: `openssl rand -hex 32`)
   - `ACCESS_TOKEN_EXPIRE_MINS`: 30
   - `REFRESH_TOKEN_EXPIRE_DAYS`: 7
   - `ALGORITHM`: HS256
   - `PYTHON_VERSION`: 3.11.0

4. **Set Environment Variables for Frontend**
   In the Render dashboard, go to **e-commerce-frontend** service → Environment tab and add:
   - `VITE_API_URL`: Your backend service URL (e.g., `https://e-commerce-api.onrender.com`)
   - **Important**: Make sure to use the full URL including `https://`

5. **Deploy**
   - Click "Apply" in the Blueprint
   - Render will build and deploy both services
   - Wait for both deployments to complete
   - Your API will be available at: `https://e-commerce-api.onrender.com`
   - Your frontend will be available at: `https://e-commerce-frontend.onrender.com`

6. **Run Database Migrations**
   - After backend deployment, you may need to run migrations
   - Go to the backend service → Shell tab
   - Run: `alembic upgrade head`

### Important Notes
- Free tier services on Render spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to a paid plan for production use
- Both services are configured to use the Singapore region

---

## Post-Deployment Checklist

- [ ] Backend is accessible at Render URL
- [ ] Frontend is accessible at Render URL
- [ ] Frontend can connect to backend API
- [ ] Database migrations are run
- [ ] CORS is configured correctly (already set to allow all origins)
- [ ] Environment variables are set correctly for both services
- [ ] `VITE_API_URL` points to the correct backend URL
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
- Verify `VITE_API_URL` is set correctly in Render (should be your backend URL)
- Check that the backend URL is accessible
- Ensure CORS is configured on the backend (already done)
- Make sure `VITE_API_URL` includes `https://` protocol

**Build Errors**
- Check Node.js version (should be >= 18.0.0)
- Run `npm install` locally to check for dependency issues
- Review build logs in Render dashboard
- Ensure `serve` package is available (it's installed via npx, so no need to add to package.json)

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

### Frontend (Render)
```
VITE_API_URL=https://e-commerce-api.onrender.com
```

---

## Updating Deployments

### Backend
- Push changes to your GitHub repository
- Render will automatically redeploy (if auto-deploy is enabled)
- Or manually trigger deployment from Render dashboard

### Frontend
- Push changes to your GitHub repository
- Render will automatically redeploy (if auto-deploy is enabled)
- Or manually trigger deployment from Render dashboard

---

## Security Notes

- Never commit `.env` files to Git
- Use strong, randomly generated `SECRET_KEY`
- Consider using Render's environment variable encryption
- For production, restrict CORS origins instead of allowing all (`*`)
- Use HTTPS (Render provides this by default)

