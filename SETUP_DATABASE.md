# Database URL Setup for Render

## ✅ Your Database URL

```
postgresql://ecommerce_ayqk_user:IkuTxGrhcvBQ09vG3xqJtu19YFElKzVk@dpg-d57bob6uk2gs73cv11n0-a/ecommerce_ayqk
```

## 🔧 How to Set in Render

### Step 1: Go to Your Web Service

1. Render Dashboard → Your Web Service
2. Click **Environment** tab

### Step 2: Add/Update DATABASE_URL

1. Click **Add Environment Variable** (or edit existing)
2. **Key:** `DATABASE_URL`
3. **Value:** Paste your database URL:
   ```
   postgresql://ecommerce_ayqk_user:IkuTxGrhcvBQ09vG3xqJtu19YFElKzVk@dpg-d57bob6uk2gs73cv11n0-a/ecommerce_ayqk
   ```
4. Click **Save Changes**

### Step 3: Verify Other Environment Variables

Make sure these are also set:

- ✅ `DATABASE_URL` - (you just set this)
- ✅ `SECRET_KEY` - Generate with: `openssl rand -hex 32`
- ✅ `ACCESS_TOKEN_EXPIRE_MINS=30`
- ✅ `REFRESH_TOKEN_EXPIRE_DAYS=7`
- ✅ `ALGORITHM=HS256`

### Step 4: Redeploy

After setting environment variables:
1. Go to **Manual Deploy**
2. Click **Clear build cache & deploy**
3. Wait for deployment

## ✅ Auto-Conversion

The code automatically converts:
- `postgresql://...` → `postgresql+asyncpg://...`

So your URL will work correctly with SQLAlchemy async!

## 🔒 Security Notes

⚠️ **Important:**
- Never commit this URL to Git
- It's already in `.gitignore`
- Keep it secure
- Only use in Render environment variables

## 🧪 Test Connection

After deployment, test the connection:

1. Go to Render Shell
2. Run:
   ```python
   import os
   from sqlalchemy import create_engine
   engine = create_engine(os.getenv("DATABASE_URL"))
   conn = engine.connect()
   print("✅ Database connected!")
   conn.close()
   ```

## 📋 Quick Checklist

- [ ] `DATABASE_URL` set in Render environment variables
- [ ] `SECRET_KEY` set (random string)
- [ ] Other env vars set
- [ ] Service redeployed
- [ ] Checked logs for errors
- [ ] Database connection working

## 🐛 If Connection Fails

1. **Check URL format:**
   - Should start with `postgresql://`
   - Should include user, password, host, and database

2. **Verify database is running:**
   - Go to Render Dashboard → Your Database
   - Check status is "Available"

3. **Check region:**
   - Database and web service should be in same region

4. **Check logs:**
   - Look for connection errors
   - Verify DATABASE_URL is being read correctly

## ✅ Next Steps

After setting DATABASE_URL:

1. **Run migrations:**
   ```bash
   # In Render Shell
   alembic upgrade head
   ```

2. **Test API:**
   - Visit: `https://your-service.onrender.com/docs`
   - Should see Swagger UI

3. **Test endpoints:**
   - Try `/auth/register`
   - Try `/product/`

