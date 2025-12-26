# CORS Fix - Complete Steps

## ✅ Changes Made

### 1. Frontend (`frontend/src/services/api.js`)
- Added `ngrok-skip-browser-warning` header to bypass ngrok warning page

### 2. Backend (`app/app.py`)
- Updated CORS to allow Vercel and ngrok origins
- Added ngrok header to allowed headers
- Improved OPTIONS handler

## 🔄 Required Actions

### Step 1: Restart Backend Server
```bash
# Stop current server (Ctrl+C)
# Then restart:
python main.py
```

**IMPORTANT:** CORS changes only take effect after restart!

### Step 2: Redeploy Frontend to Vercel

The frontend changes need to be deployed:

```bash
cd frontend
git add .
git commit -m "Add ngrok skip browser warning header"
git push

# Or redeploy via Vercel dashboard
```

Then in Vercel:
1. Go to Deployments
2. Click Redeploy on latest deployment

## 🧪 Test After Changes

1. **Restart backend** (required!)
2. **Redeploy frontend** (if you made changes)
3. **Visit frontend:** `https://e-commerce-api-test-seven.vercel.app`
4. **Try to login**
5. **Check browser console** - CORS errors should be gone

## 🔍 Current Configuration

- **Backend URL:** `https://f4dccd72c1a6.ngrok-free.app`
- **Frontend URL:** `https://e-commerce-api-test-seven.vercel.app`
- **CORS:** Configured to allow both

## ⚠️ If Still Getting CORS Errors

1. **Verify backend is restarted** - Check if new CORS config is active
2. **Check ngrok is running** - Visit `https://f4dccd72c1a6.ngrok-free.app/docs`
3. **Clear browser cache** - Hard refresh (Ctrl+Shift+R)
4. **Check browser console** - Look for specific error messages
5. **Verify VITE_API_URL** - Make sure it's set correctly in Vercel

## 🐛 Debugging

### Check CORS Headers
```bash
# Test OPTIONS request
curl -X OPTIONS https://f4dccd72c1a6.ngrok-free.app/auth/login \
  -H "Origin: https://e-commerce-api-test-seven.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Should return:
- `Access-Control-Allow-Origin: https://e-commerce-api-test-seven.vercel.app`
- `Access-Control-Allow-Credentials: true`

### Check Backend Logs
Look for CORS-related errors in backend console.

