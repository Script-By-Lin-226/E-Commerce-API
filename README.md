# E-Commerce API & Frontend

A full-stack e-commerce application with FastAPI backend and React frontend.

## 🚀 Quick Start

### Backend Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Set up environment variables (.env file)
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url
JWT_SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_MINS=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Run migrations
alembic upgrade head

# Start backend
python main.py
```

Backend runs on: `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:3000`

## 📁 Project Structure

```
E_Commerce_API/
├── app/                    # Backend application
│   ├── config/            # Configuration
│   ├── core/              # Database & dependencies
│   ├── middleware/        # Auth, logging, token rotation
│   ├── models/            # SQLAlchemy models
│   ├── routes/            # API routes
│   ├── schemas/           # Pydantic schemas
│   ├── security/          # Password hashing, brute force protection
│   └── services/          # Business logic
├── frontend/              # React frontend
│   └── src/
│       ├── components/    # Reusable components
│       ├── context/       # React contexts (Auth, Cart)
│       ├── pages/         # Page components
│       └── services/      # API service layer
├── migrations/            # Database migrations
├── Dockerfile            # Docker configuration
└── main.py               # Backend entry point
```

## 🌐 Deployment

### Backend Deployment

#### Option 1: Railway (Recommended)

1. Go to https://railway.app and sign up
2. New Project → Deploy from GitHub
3. Select your repository
4. Railway auto-detects Dockerfile
5. Add environment variables:
   - `DATABASE_URL`
   - `REDIS_URL`
   - `JWT_SECRET_KEY`
   - `ACCESS_TOKEN_EXPIRE_MINS=30`
   - `REFRESH_TOKEN_EXPIRE_DAYS=7`
6. Railway automatically sets `PORT` variable

**Note:** The `railway.json` and `railway.toml` are configured to use Dockerfile's ENTRYPOINT.

#### Option 2: Fly.io

1. Install Fly.io CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Launch: `fly launch --name e-commerce-api-backend`
4. Set secrets: `fly secrets set DATABASE_URL="..." JWT_SECRET_KEY="..."`
5. Deploy: `fly deploy`

**Note:** `fly.toml` is pre-configured.

#### Option 3: Koyeb

1. Go to https://www.koyeb.com and sign up
2. Create App → Connect GitHub
3. Select repository
4. Build settings auto-detected from Dockerfile
5. Set environment variables in dashboard
6. Provision PostgreSQL database in Koyeb dashboard
7. Deploy

### Frontend Deployment

#### Option 1: Netlify (Recommended)

1. Go to https://www.netlify.com and sign up
2. Add new site → Import from Git
3. Connect GitHub and select repository
4. Build settings auto-detected from `frontend/netlify.toml`:
   - Base directory: `frontend`
   - Build command: `npm install --legacy-peer-deps && npm run build`
   - Publish directory: `frontend/dist`
5. Add environment variable: `VITE_API_URL=https://your-backend-url.com`
6. Deploy

#### Option 2: Vercel

1. Go to https://vercel.com and sign up
2. Import project from GitHub
3. Root directory: `frontend`
4. Build command: `npm install --legacy-peer-deps && npm run build`
5. Output directory: `dist`
6. Add environment variable: `VITE_API_URL=https://your-backend-url.com`

### Update CORS After Deployment

After deploying backend, update `app/app.py`:

```python
allow_origins=[
    "http://localhost:3000",
    "https://your-frontend-url.netlify.app",  # Add your frontend URL
],
```

## 🔑 Features

- ✅ User authentication (JWT with refresh tokens)
- ✅ Product management (CRUD operations)
- ✅ Shopping cart
- ✅ Order management
- ✅ Payment processing (Cash, KBZ, AYA)
- ✅ Role-based access control
- ✅ Responsive design
- ✅ Token rotation
- ✅ Rate limiting

## 📝 API Documentation

Once backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🛠️ Tech Stack

**Backend:**
- FastAPI
- SQLAlchemy (Async)
- PostgreSQL
- Redis
- JWT Authentication
- Alembic (Migrations)
- Docker

**Frontend:**
- React 18
- React Router
- Tailwind CSS
- Axios
- Vite

## 📄 License

MIT
