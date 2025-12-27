# Troubleshooting Network Error

## Issue: "Network Error" when trying to login

### Common Causes:

1. **CORS Middleware Order** ✅ FIXED
   - CORS middleware must be added BEFORE other middleware and routers
   - Fixed in `app/app.py`

2. **Missing Environment Variable**
   - Check that `VITE_API_URL` is set in Render frontend service
   - Should be: `https://e-commerce-api-b9zy.onrender.com`
   - Go to: Render Dashboard → Frontend Service → Environment → Add `VITE_API_URL`

3. **Backend Not Running**
   - Check if backend service is running in Render
   - Check backend logs for errors
   - Verify backend URL is accessible: `https://e-commerce-api-b9zy.onrender.com`

4. **CORS Configuration**
   - Backend now uses `allow_origin_regex=r".*"` to allow all origins
   - CORS middleware is now at the top of the middleware stack

### Steps to Fix:

1. **Verify Environment Variable in Render:**
   ```
   Frontend Service → Environment Variables
   VITE_API_URL = https://e-commerce-api-b9zy.onrender.com
   ```

2. **Redeploy Frontend:**
   - After setting environment variable, redeploy the frontend service
   - Or wait for auto-deploy if enabled

3. **Check Browser Console:**
   - Open browser DevTools → Console
   - Look for "API Base URL:" log message
   - Verify it shows the correct backend URL

4. **Test Backend Directly:**
   - Open: `https://e-commerce-api-b9zy.onrender.com/`
   - Should return: `{"message": "Hello World"}`
   - If this fails, backend is not running

5. **Check Network Tab:**
   - Open browser DevTools → Network tab
   - Try login again
   - Check the failed request:
     - What URL is it trying to reach?
     - What's the error status?
     - Is it a CORS error or connection error?

### Debug Information:

The frontend now logs:
- API Base URL on initialization
- Network error details including:
  - Request URL
  - Base URL
  - Full URL
  - Error code

Check browser console for these logs to help identify the issue.

