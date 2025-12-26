# Deploy Backend to Render

## 🚀 Quick Start

### Step 1: Prepare Your Code

1. **Push to GitHub** (if not already)
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

### Step 2: Create Render Account

1. Go to: https://render.com
2. Sign up with GitHub (recommended)
3. Connect your GitHub account

### Step 3: Create New Web Service

1. **Dashboard** → Click **New +** → **Web Service**
2. **Connect Repository:**
   - Select your GitHub repository
   - Click **Connect**

3. **Configure Service:**
   - **Name:** `e-commerce-api` (or your choice)
   - **Region:** Choose closest to you
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** Leave empty (or `./` if needed)
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.app:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables:**
   Click **Add Environment Variable** and add:
   
   ```
   DATABASE_URL=your_database_url_here
   SECRET_KEY=your_secret_key_here
   ACCESS_TOKEN_EXPIRE_MINS=30
   REFRESH_TOKEN_EXPIRE_DAYS=7
   ALGORITHM=HS256
   ```

5. **Click Create Web Service**

### Step 4: Set Up Database (PostgreSQL)

1. **Dashboard** → **New +** → **PostgreSQL**
2. **Configure:**
   - **Name:** `e-commerce-db`
   - **Database:** `ecommerce` (or auto-generated)
   - **User:** Auto-generated
   - **Region:** Same as web service
   - **Plan:** Free tier available
3. **Click Create Database**
4. **Copy Internal Database URL**
5. **Go to Web Service** → **Environment** → Add:
   - **Key:** `DATABASE_URL`
   - **Value:** Paste the database URL

### Step 5: Run Migrations

After deployment, run migrations:

**Option 1: Via Render Shell**
1. Go to your web service
2. Click **Shell** tab
3. Run:
   ```bash
   alembic upgrade head
   ```

**Option 2: Via Local Machine**
```bash
# Set DATABASE_URL to Render database URL
export DATABASE_URL=postgresql://...
alembic upgrade head
```

### Step 6: Get Your Backend URL

After deployment:
- Your backend URL: `https://e-commerce-api.onrender.com` (or your service name)
- Copy this URL for frontend configuration

## 🔧 Configuration Files

The project includes:
- ✅ `render.yaml` - Render configuration
- ✅ `Procfile` - Process file for Render
- ✅ `runtime.txt` - Python version specification
- ✅ `requirements.txt` - Python dependencies

## ⚙️ Environment Variables

Required environment variables in Render:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `SECRET_KEY` | JWT secret key | Generate a random string |
| `ACCESS_TOKEN_EXPIRE_MINS` | Access token expiry | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token expiry | `7` |
| `ALGORITHM` | JWT algorithm | `HS256` |

## 🐛 Troubleshooting

### Build Fails
- Check `requirements.txt` is correct
- Verify Python version in `runtime.txt`
- Check build logs in Render dashboard

### Database Connection Error
- Verify `DATABASE_URL` is set correctly
- Check database is running
- Ensure database and web service are in same region

### CORS Errors
- Update CORS in `app/app.py` to include Render URL
- Restart service after CORS changes

### Service Not Starting
- Check start command: `uvicorn app.app:app --host 0.0.0.0 --port $PORT`
- Verify `app/app.py` exists
- Check logs in Render dashboard

## 📝 Notes

- **Free Tier:** Services spin down after 15 minutes of inactivity
- **First Request:** May take 30-60 seconds (cold start)
- **Database:** Free tier PostgreSQL has limitations
- **HTTPS:** Automatically provided by Render

## 🔗 Next Steps

After backend is deployed:
1. Update frontend `VITE_API_URL` to Render backend URL
2. Update CORS in backend to allow Vercel frontend
3. Test the connection

