# How to Update VITE_API_URL in Vercel

## 🚀 Quick Steps

### Method 1: Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Login to your account

2. **Select Your Project**
   - Click on your project: `e-commerce-api-test-seven` (or your project name)

3. **Navigate to Settings**
   - Click **Settings** in the top menu
   - Click **Environment Variables** in the left sidebar

4. **Update the Variable**
   - Find `VITE_API_URL` in the list
   - Click the **pencil icon** (edit) or **three dots** → **Edit**
   - Update the **Value** field with your new backend URL
     - Example: `https://5cb9be367c0e.ngrok-free.app` (your current ngrok URL)
   - Make sure all environments are checked:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
   - Click **Save**

5. **Redeploy**
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on the latest deployment
   - Click **Redeploy**
   - Or click **Redeploy** button at the top

### Method 2: Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login
vercel login

# Set environment variable
vercel env add VITE_API_URL

# When prompted:
# - Value: https://your-backend-url.ngrok-free.app
# - Environment: Production, Preview, Development (select all)

# Redeploy
vercel --prod
```

### Method 3: Update via Vercel Dashboard URL

Direct link format:
```
https://vercel.com/[your-username]/[project-name]/settings/environment-variables
```

## 📝 Step-by-Step with Screenshots Guide

1. **Dashboard** → Your Project
2. **Settings** (top menu)
3. **Environment Variables** (left sidebar)
4. Find `VITE_API_URL` → Click **Edit**
5. Update **Value** → Click **Save**
6. **Deployments** tab → **Redeploy**

## ⚠️ Important Notes

### After Updating:

1. **Must Redeploy** - Environment variables only apply to new deployments
2. **Wait for Build** - Redeployment takes 1-2 minutes
3. **Clear Browser Cache** - Old cached values might persist

### Current Values:

- **Backend URL:** `https://5cb9be367c0e.ngrok-free.app`
- **Frontend URL:** `https://e-commerce-api-test-seven.vercel.app`

### When to Update:

- When ngrok URL changes (free tier gets new URL on restart)
- When you deploy backend to a permanent URL
- When switching between different backend environments

## 🔄 Automatic Updates (Future)

For automatic updates when ngrok URL changes, you could:
- Use ngrok webhook to update Vercel env vars
- Or use a script to sync ngrok URL to Vercel
- Or deploy backend to a permanent service (Railway, Render, etc.)

## ✅ Verification

After updating and redeploying:

1. Visit your Vercel frontend
2. Open browser DevTools → Network tab
3. Try to login
4. Check API calls - they should go to your new backend URL
5. Check console for any errors

## 🎯 Quick Command Reference

```bash
# View current env vars
vercel env ls

# Add/update env var
vercel env add VITE_API_URL

# Remove env var
vercel env rm VITE_API_URL

# Pull env vars locally
vercel env pull .env.local
```

