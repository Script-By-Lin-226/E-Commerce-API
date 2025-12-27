# API Endpoints Matching - Frontend vs Backend

This document verifies that all frontend API calls match the backend routes.

## ✅ Authentication Endpoints

| Frontend Call | Backend Route | Method | Status |
|--------------|---------------|--------|--------|
| `POST /auth/register` | `POST /auth/register` | POST | ✅ Match |
| `POST /auth/login` | `POST /auth/login` | POST | ✅ Match |
| `POST /auth/logout` | `POST /auth/logout` | POST | ✅ Match |

## ✅ Product Endpoints

| Frontend Call | Backend Route | Method | Status |
|--------------|---------------|--------|--------|
| `GET /product/` | `GET /product/` | GET | ✅ Match |
| `GET /product/search` | `GET /product/search` | GET | ✅ Match |
| `POST /product/` | `POST /product/` | POST | ✅ Match |
| `PATCH /product/{id}` (with query params) | `PATCH /product/{product_id}` (query params) | PATCH | ✅ Match |
| `DELETE /product/{id}` | `DELETE /product/{product_id}` | DELETE | ✅ Match |

**Note:** Product update uses query parameters in both frontend and backend.

## ✅ Upload Endpoints

| Frontend Call | Backend Route | Method | Status |
|--------------|---------------|--------|--------|
| `POST /upload/image` (multipart/form-data) | `POST /upload/image` | POST | ✅ Match |
| `DELETE /upload/image/{filename}` | `DELETE /upload/image/{filename}` | DELETE | ✅ Match |

## ✅ Order Endpoints

| Frontend Call | Backend Route | Method | Status |
|--------------|---------------|--------|--------|
| `POST /order/` | `POST /order/` | POST | ✅ Match |
| `GET /order/{id}` | `GET /order/{order_id}` | GET | ✅ Match |
| `GET /order/` | `GET /order/` | GET | ✅ Match |
| `POST /order/pay` | `POST /order/pay` | POST | ✅ Match |

## 🔧 Configuration

### Frontend API Configuration
- **Base URL**: Uses `VITE_API_URL` environment variable
- **Credentials**: `withCredentials: true` (for cookies)
- **Content-Type**: `application/json` (default)
- **Multipart**: Used for image uploads

### Backend CORS Configuration
- **Allow Origins**: All origins (`allow_origin_regex=r".*"`)
- **Allow Credentials**: `true`
- **Allow Methods**: All methods (`*`)
- **Allow Headers**: All headers (`*`)
- **Expose Headers**: All headers (`*`)

### Cookie Settings
- **Secure**: `true` (for HTTPS)
- **SameSite**: `none` (for cross-origin)
- **HttpOnly**: `true` (for security)

## ✅ All Endpoints Verified

All frontend API calls correctly match the backend routes. No mismatches found.

## Recent Fixes Applied

1. ✅ Fixed `_EXCLUDE_PATHS` in AuthMiddleware (removed invalid full URL)
2. ✅ Updated cookie settings in frontend response interceptor for cross-origin support
3. ✅ Verified all endpoint paths and methods match

