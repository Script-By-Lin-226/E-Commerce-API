# Render Deployment Troubleshooting

## 🔴 Error: "Exited with status 3"

This error means the application failed to start. Common causes and solutions:

## ✅ Fixes Applied

### 1. Database URL Format
- **Issue:** Render provides `postgresql://` but SQLAlchemy async needs `postgresql+asyncpg://`
- **Fix:** Automatically converts in `app/core/db_init.py`

### 2. Redis Configuration
- **Issue:** Redis hardcoded to localhost
- **Fix:** Now uses environment variables or Redis URL

### 3. Missing Environment Variables
- **Issue:** App crashes if variables are None
- **Fix:** Added default values

## 🔧 Required Environment Variables

Make sure these are set in Render:

```
DATABASE_URL=postgresql://user:pass@host/dbname
SECRET_KEY=your_secret_key_here
ACCESS_TOKEN_EXPIRE_MINS=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ALGORITHM=HS256
```

**Optional (for Redis):**
```
REDIS_URL=redis://host:port
# OR
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 🐛 Common Issues & Solutions

### Issue 1: Database Connection Failed

**Symptoms:**
- Error about database connection
- "DATABASE_URL" not found

**Solution:**
1. Check `DATABASE_URL` is set in Render environment variables
2. Use **Internal Database URL** (not public URL)
3. Format should be: `postgresql://user:pass@host/dbname`
4. The code now auto-converts to `postgresql+asyncpg://`

### Issue 2: Missing Dependencies

**Symptoms:**
- Import errors
- Module not found

**Solution:**
1. Check `requirements.txt` includes all dependencies
2. Verify build command: `pip install -r requirements.txt`
3. Check build logs in Render dashboard

### Issue 3: Port Binding Error

**Symptoms:**
- "Address already in use"
- Port errors

**Solution:**
1. Use `$PORT` environment variable (already configured)
2. Start command: `uvicorn app.app:app --host 0.0.0.0 --port $PORT`
3. Don't hardcode port number

### Issue 4: Redis Connection Failed

**Symptoms:**
- Redis connection errors
- Timeout errors

**Solution:**
1. **Option A:** Add Redis addon in Render
   - Dashboard → New + → Redis
   - Copy Redis URL
   - Add `REDIS_URL` environment variable

2. **Option B:** Make Redis optional (if not critical)
   - The app will work without Redis (some features may be limited)

3. **Option C:** Use localhost Redis (for testing)
   - Set `REDIS_HOST` and `REDIS_PORT` if Redis is on same network

### Issue 5: Migration Errors

**Symptoms:**
- Database schema errors
- Table not found

**Solution:**
1. Run migrations after first deployment:
   ```bash
   # In Render Shell
   alembic upgrade head
   ```

2. Or run locally:
   ```bash
   export DATABASE_URL=postgresql://...
   alembic upgrade head
   ```

## 📋 Deployment Checklist

Before deploying, verify:

- [ ] All code is committed and pushed to GitHub
- [ ] `requirements.txt` is up to date
- [ ] `Procfile` exists with correct start command
- [ ] Database is created in Render
- [ ] `DATABASE_URL` is set (Internal Database URL)
- [ ] `SECRET_KEY` is set (generate random string)
- [ ] Other environment variables are set
- [ ] Build command is correct: `pip install -r requirements.txt`
- [ ] Start command is correct: `uvicorn app.app:app --host 0.0.0.0 --port $PORT`

## 🔍 Debugging Steps

### Step 1: Check Build Logs
1. Go to Render Dashboard
2. Click your service
3. Check **Logs** tab
4. Look for error messages

### Step 2: Check Environment Variables
1. Go to **Environment** tab
2. Verify all required variables are set
3. Check values are correct (no extra spaces)

### Step 3: Test Database Connection
1. Use Render Shell
2. Test connection:
   ```python
   import os
   from sqlalchemy import create_engine
   engine = create_engine(os.getenv("DATABASE_URL"))
   engine.connect()
   ```

### Step 4: Test Locally
1. Set environment variables locally
2. Run: `python main.py`
3. Check for errors

## 🚀 Quick Fix Commands

### Update Environment Variables
```bash
# In Render Dashboard → Environment
# Add/update variables as needed
```

### Redeploy
```bash
# In Render Dashboard
# Click Manual Deploy → Clear build cache & deploy
```

### Check Logs
```bash
# In Render Dashboard → Logs tab
# Look for specific error messages
```

## 📝 After Fixes

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Fix Render deployment issues"
   git push
   ```

2. **Render will auto-deploy** (or manually trigger)

3. **Check logs** to verify it's working

4. **Test API:**
   - Visit: `https://your-service.onrender.com/docs`
   - Should see Swagger UI

## 💡 Pro Tips

1. **Use Internal Database URL** - More secure and faster
2. **Generate Strong SECRET_KEY** - Use: `openssl rand -hex 32`
3. **Check Logs Regularly** - Monitor for errors
4. **Test After Each Deploy** - Verify everything works
5. **Keep Dependencies Updated** - Update `requirements.txt` regularly

## 🆘 Still Having Issues?

1. Check Render status page: https://status.render.com
2. Review Render documentation: https://render.com/docs
3. Check application logs for specific error messages
4. Verify all environment variables are set correctly
5. Test database connection separately

