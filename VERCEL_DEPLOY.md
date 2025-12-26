# 🚀 Deploy to Vercel - Ready to Deploy!

## ✅ Configuration Complete

Your project is now configured for Vercel deployment with:
- ✅ `frontend/vercel.json` - Vercel configuration
- ✅ Build settings optimized
- ✅ SPA routing configured
- ✅ Environment variable support

## 📋 Deployment Steps

### Option 1: Deploy from Frontend Directory (Recommended)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install Vercel CLI (if not installed)
npm install -g vercel

# 3. Deploy
vercel

# 4. Follow prompts (just press Enter for defaults)
```

### Option 2: Deploy from Root Directory

```bash
# From project root
vercel

# When asked:
# - Root Directory? → frontend
# - Build Command? → npm run build
# - Output Directory? → dist
```

## ⚙️ After Deployment: Add Environment Variable

1. Go to: https://vercel.com/dashboard
2. Click your project
3. **Settings** → **Environment Variables**
4. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://0bc0ef6cc3e3.ngrok-free.app` (your backend ngrok URL)
   - **Environments:** ✅ Production ✅ Preview ✅ Development
5. Click **Save**
6. **Deployments** → **Redeploy** (to apply the variable)

## 🔧 Vercel Settings (Auto-detected)

- **Framework:** Vite (auto-detected)
- **Build Command:** `npm install --legacy-peer-deps && npm run build`
- **Output Directory:** `dist`
- **Node Version:** 18.x (from .nvmrc)

## 🐛 Fixing "vite: command not found" Error

If you still get this error, try:

### Solution 1: Deploy from Frontend Directory
```bash
cd frontend
vercel
```

### Solution 2: Manual Vercel Settings
1. Go to Vercel Dashboard → Your Project → Settings
2. **General** → **Root Directory:** `frontend`
3. **Build & Development Settings:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install --legacy-peer-deps`

### Solution 3: Check package.json
Ensure `vite` is in `devDependencies` (it is ✅)

## ✅ Verification

After deployment:
1. Visit your Vercel URL
2. Check browser console for errors
3. Test login/register
4. Test product browsing
5. Verify API calls work (check Network tab)

## 📝 Notes

- Vercel installs `devDependencies` by default, so `vite` will be available
- The `--legacy-peer-deps` flag helps with dependency conflicts
- SPA routing is configured (all routes → index.html)
- Environment variables must start with `VITE_` to be accessible in frontend

## 🎯 Quick Test Before Deploying

Test build locally:
```bash
cd frontend
npm install
npm run build
```

If this works, Vercel deployment will work too!
