# Fix CORS for Render Backend + Vercel Frontend

## ✅ CORS Configuration Updated

I've updated the CORS configuration to allow your Vercel frontend to access your Render backend.

### Your URLs:
- **Backend:** `https://e-commerce-api-1nn0.onrender.com`
- **Frontend:** `https://e-commerce-api-test-seven.vercel.app`

## 🔄 Required Actions

### Step 1: Commit and Push Changes

```bash
git add app/app.py
git commit -m "Update CORS for Render backend and Vercel frontend"
git push
```

### Step 2: Render Will Auto-Deploy

Render will automatically detect the push and redeploy your service.

**OR manually redeploy:**
1. Go to Render Dashboard
2. Your Web Service
3. Click **Manual Deploy**
4. Select **Clear build cache & deploy**

### Step 3: Wait for Deployment

Wait 2-3 minutes for the deployment to complete.

### Step 4: Test

1. Visit your Vercel frontend: `https://e-commerce-api-test-seven.vercel.app`
2. Try to login
3. CORS errors should be gone!

## 🔍 Verify CORS is Working

### Test OPTIONS Request

```bash
curl -X OPTIONS https://e-commerce-api-1nn0.onrender.com/auth/login \
  -H "Origin: https://e-commerce-api-test-seven.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Should return:
- `Access-Control-Allow-Origin: https://e-commerce-api-test-seven.vercel.app`
- `Access-Control-Allow-Credentials: true`

### Check in Browser

1. Open DevTools → Network tab
2. Try to login
3. Check the request headers
4. Should see CORS headers in response

## 📋 Current CORS Configuration

The code now allows:
- ✅ Your Vercel frontend: `https://e-commerce-api-test-seven.vercel.app`
- ✅ Your Render backend: `https://e-commerce-api-1nn0.onrender.com`
- ✅ All `*.vercel.app` subdomains (via regex)
- ✅ All `*.onrender.com` subdomains (via regex)
- ✅ Localhost for development

## 🐛 If Still Getting CORS Errors

### 1. Verify Backend is Redeployed
- Check Render logs
- Look for "Application startup complete"
- Verify latest deployment is live

### 2. Clear Browser Cache
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or clear browser cache

### 3. Check CORS Headers
- Open DevTools → Network
- Click on the failed request
- Check Response Headers
- Should see `Access-Control-Allow-Origin`

### 4. Verify Environment
- Make sure you're testing on the deployed Vercel frontend
- Not localhost (unless testing locally)

## ✅ Success Indicators

When CORS is working:
- ✅ No CORS errors in browser console
- ✅ Login requests succeed
- ✅ API calls work from Vercel frontend
- ✅ Cookies are set correctly

## 🎯 Next Steps After Fix

1. **Test all features:**
   - Login
   - Register
   - View products
   - Add to cart
   - Create order
   - Process payment

2. **Monitor logs:**
   - Check Render logs for any errors
   - Check Vercel logs if needed

3. **Update documentation:**
   - Note your production URLs
   - Update any hardcoded URLs

