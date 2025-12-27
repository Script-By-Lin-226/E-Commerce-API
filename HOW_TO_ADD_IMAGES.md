# How to Add Product Images

This guide explains how to add images to products in the E-Commerce application.

## 📁 Image Directory Structure

Images are stored in the `images/products/` directory:
```
E_Commerce_API/
└── images/
    └── products/
        ├── product_1.jpg
        ├── product_2.png
        └── ...
```

## 🖼️ Method 1: Using Image URLs (Recommended for Development)

### Step 1: Get an Image URL
- Use images from the internet (e.g., Unsplash, Pexels)
- Or use a CDN service
- Example: `https://images.unsplash.com/photo-1234567890`

### Step 2: Add Product with Image URL
1. Go to **Admin** → **Product Management**
2. Click **"Add Product"**
3. Fill in product details:
   - Name
   - Description
   - Price
   - Stock
4. In **"Image URL"** field, enter:
   ```
   https://images.unsplash.com/photo-1234567890
   ```
5. You'll see a preview of the image
6. Click **"Create"**

### Step 3: Verify
- The image will appear in:
  - Products list page
  - Product detail page
  - Admin products page

## 📂 Method 2: Using Local Images

### Step 1: Add Image File
1. Place your image file in `images/products/` directory
2. Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
3. Example: `images/products/product_1.jpg`

### Step 2: Reference in Product
1. When adding/editing a product
2. In **"Image URL"** field, enter the relative path:
   ```
   /images/products/product_1.jpg
   ```
   Or absolute path:
   ```
   http://localhost:8000/images/products/product_1.jpg
   ```

### Step 3: Serve Static Files (Backend)
To serve local images, you need to configure FastAPI to serve static files:

**Update `app/app.py`:**
```python
from fastapi.staticfiles import StaticFiles

# Add this after creating the app
app.mount("/images", StaticFiles(directory="images"), name="images")
```

## 🔧 Backend Configuration (For Local Images)

### Option A: Serve Static Files with FastAPI

1. **Update `app/app.py`:**
```python
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="E-Commerce API", lifespan=life_cycle)

# Mount static files directory
app.mount("/images", StaticFiles(directory="images"), name="images")

# ... rest of your code
```

2. **Restart your backend server**

3. **Access images at:**
   ```
   http://localhost:8000/images/products/product_1.jpg
   ```

### Option B: Use Frontend Public Directory

1. **Move images to frontend public directory:**
   ```
   frontend/public/images/products/
   ```

2. **Reference in product:**
   ```
   /images/products/product_1.jpg
   ```

3. **Vite will serve these automatically**

## 📝 Adding Images to Existing Products

1. Go to **Admin** → **Product Management**
2. Click **"Edit"** on the product
3. Enter image URL in **"Image URL"** field
4. Click **"Update"**

## ✅ Best Practices

### Image URLs
- ✅ Use HTTPS URLs for production
- ✅ Use relative paths for local development
- ✅ Keep image file sizes reasonable (< 2MB)
- ✅ Use common formats: JPG, PNG, WebP

### Image Dimensions
- ✅ Recommended: 800x800px or 1000x1000px (square)
- ✅ Minimum: 400x400px
- ✅ Aspect ratio: 1:1 (square) works best

### File Naming
- ✅ Use descriptive names: `product_laptop_1.jpg`
- ✅ Use lowercase and underscores
- ✅ Include product ID: `product_123.jpg`

## 🐛 Troubleshooting

### Image Not Showing
1. **Check URL is correct:**
   - Verify the URL is accessible
   - Test in browser directly

2. **Check CORS (for external URLs):**
   - Some image hosts block cross-origin requests
   - Use images from CORS-enabled sources

3. **Check file path (for local images):**
   - Verify file exists in `images/products/`
   - Check file permissions

4. **Check browser console:**
   - Look for 404 errors
   - Check network tab

### Image Preview Not Working
- The preview in the form uses the same URL
- If preview doesn't work, the image won't show on the site
- Try a different image URL

## 📸 Example Image URLs

### Free Image Sources:
- **Unsplash:** `https://images.unsplash.com/photo-1234567890`
- **Pexels:** `https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg`
- **Placeholder:** `https://via.placeholder.com/800`

### Local Development:
- **Relative path:** `/images/products/product_1.jpg`
- **Absolute path:** `http://localhost:8000/images/products/product_1.jpg`

## 🎨 Image Display

Images are automatically displayed in:
- ✅ Products list page (grid view)
- ✅ Product detail page (large view)
- ✅ Admin products page (with edit option)
- ✅ Cart (if product has image)

If no image is provided, a default placeholder icon is shown.

## 📋 Quick Checklist

- [ ] Image file added to `images/products/` OR image URL ready
- [ ] Backend configured to serve static files (if using local images)
- [ ] Product created/updated with image URL
- [ ] Image preview working in form
- [ ] Image displaying correctly on product pages

---

**Need Help?** Check the browser console for errors or verify your image URL is accessible.

