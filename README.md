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
└── main.py               # Backend entry point
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

**Frontend:**
- React 18
- React Router
- Tailwind CSS
- Axios
- Vite

## 📄 License

MIT
