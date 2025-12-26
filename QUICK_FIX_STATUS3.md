# Quick Fix: "Exited with status 3" Error

## ✅ Fixes Applied

I've fixed the main issues that cause "Exited with status 3":

### 1. Database URL Format ✅
- **Problem:** Render uses `postgresql://` but SQLAlchemy async needs `postgresql+asyncpg://`
- **Fix:** Auto-converts in `app/core/db_init.py`

### 2. Redis Configuration ✅
- **Problem:** Hardcoded to localhost
- **Fix:** Now uses environment variables (`REDIS_URL`, `REDIS_HOST`, `REDIS_PORT`)

### 3. Missing Environment Variables ✅
- **Problem:** App crashes if `DATABASE_URL` is None
- **Fix:** Added validation and better error messages

## 🚀 Next Steps

### Step 1: Commit and Push Changes
```bash
git add .
git commit -m "Fix Render deployment - status 3 error"
git push
```

### Step 2: Verify Environment Variables in Render

Go to Render Dashboard → Your Service → Environment:

**Required:**
- ✅ `DATABASE_URL` - Use **Internal Database URL** from your PostgreSQL service
- ✅ `SECRET_KEY` - Generate with: `openssl rand -hex 32`
- ✅ `ACCESS_TOKEN_EXPIRE_MINS=30`
- ✅ `REFRESH_TOKEN_EXPIRE_DAYS=7`
- ✅ `ALGORITHM=HS256`

**Optional (for Redis):**
- `REDIS_URL` - If using Redis addon
- OR `REDIS_HOST` and `REDIS_PORT` - If Redis is available

### Step 3: Redeploy

Render will auto-deploy after you push, or:
1. Go to Render Dashboard
2. Click **Manual Deploy**
3. Select **Clear build cache & deploy**

### Step 4: Check Logs

1. Go to **Logs** tab in Render
2. Look for:
   - ✅ "Application startup complete"
   - ✅ "Uvicorn running on..."
   - ❌ Any error messages

## 🔍 If Still Failing

### Check These:

1. **Database URL Format:**
   - Should be: `postgresql://user:pass@host/dbname`
   - Code auto-converts to: `postgresql+asyncpg://...`

2. **Database Connection:**
   - Use **Internal Database URL** (not public)
   - Database must be in same region as web service

3. **Build Command:**
   - Should be: `pip install -r requirements.txt`

4. **Start Command:**
   - Should be: `uvicorn app.app:app --host 0.0.0.0 --port $PORT`

5. **Python Version:**
   - Check `runtime.txt` has: `python-3.11.0`

## 📋 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] `DATABASE_URL` set (Internal Database URL)
- [ ] `SECRET_KEY` set (random string)
- [ ] Other env vars set
- [ ] Build command correct
- [ ] Start command correct
- [ ] Redeployed after fixes
- [ ] Checked logs for errors

## 🐛 Common Error Messages

### "DATABASE_URL environment variable is not set"
→ Set `DATABASE_URL` in Render environment variables

### "Connection refused" or "Can't connect to database"
→ Check `DATABASE_URL` is correct (Internal Database URL)
→ Verify database is running

### "Module not found" or "Import error"
→ Check `requirements.txt` includes all dependencies
→ Verify build completed successfully

### "Port already in use"
→ Make sure start command uses `$PORT` (already fixed)

## ✅ Success Indicators

When it works, you'll see:
- ✅ Build completed successfully
- ✅ "Application startup complete"
- ✅ "Uvicorn running on http://0.0.0.0:XXXX"
- ✅ Service shows "Live" status
- ✅ Can access `/docs` endpoint

## 🎯 Test After Deployment

1. Visit: `https://your-service.onrender.com/docs`
2. Should see Swagger UI
3. Try a simple endpoint
4. Check logs for any errors

