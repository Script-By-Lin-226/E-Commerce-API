# E-Commerce API & Frontend

A full-stack e-commerce application with FastAPI backend and React frontend.

## 🚀 Quick Start

### Backend Setup

```bash
# Install dependencies
pip install -r requirements.txt  # or use uv/pip based on your setup

# Set up environment variables (.env file)
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_MINS=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ALGORITHM=HS256

# Run migrations (if using Alembic)
alembic upgrade head

# Start backend
python main.py
```

Backend runs on: `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

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
└── main.py               # Backend entry point
```

## 🌐 Sharing/Deployment

### Deploy to Railway (Recommended - Both Frontend & Backend)

**Quick Deploy:**
1. Go to: https://railway.app
2. Sign up with GitHub
3. New Project → Deploy from GitHub repo
4. Select your repository
5. Railway auto-detects and deploys both services!

**See:** `RAILWAY_SETUP.md` for detailed guide

### Share Backend (Ngrok - Development Only)

```bash
# Install ngrok: https://ngrok.com/download
ngrok config add-authtoken YOUR_TOKEN

# Start ngrok
ngrok http 8000

# Get your public URL (e.g., https://abc123.ngrok-free.app)
# Update frontend/.env: VITE_API_URL=https://your-ngrok-url.ngrok-free.app
```

### Deploy Frontend Separately (Free Options)

**Vercel (Recommended):**
```bash
cd frontend
npm install -g vercel
vercel
# Add environment variable: VITE_API_URL=https://your-backend-url
```

**Netlify:**
```bash
cd frontend
npm run build
# Drag 'dist' folder to netlify.com
# Add environment variable: VITE_API_URL
```

**Render:**
- Dashboard → New + → Static Site
- Connect GitHub repo
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

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
- PostgreSQL/SQLite
- Redis
- JWT Authentication
- Alembic (Migrations)

**Frontend:**
- React 18
- React Router
- Tailwind CSS
- Axios
- Vite

## 📄 License

MIT

