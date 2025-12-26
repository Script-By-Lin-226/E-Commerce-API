# E-Commerce Frontend

A modern, professional React frontend for the E-Commerce API.

## Features

- 🎨 Clean and professional design with gradient color scheme
- 🔐 User authentication (Login/Register)
- 🛍️ Product browsing and search
- 🛒 Shopping cart functionality
- 📦 Order management
- 💳 Payment processing
- 👨‍💼 Admin product management
- 📱 Responsive design

## Tech Stack

- React 18
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React (Icons)
- React Hot Toast (Notifications)
- Vite (Build tool)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL:
```
VITE_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── services/      # API service layer
│   ├── context/       # React context providers
│   └── main.jsx       # Entry point
├── public/            # Static assets
└── package.json       # Dependencies
```

## Color Scheme

- Primary: Blue (#0ea5e9 to #0369a1)
- Secondary: Purple (#a855f7 to #7e22ce)
- Clean whites and grays for backgrounds

## API Integration

The frontend connects to the backend API running on `http://localhost:8000` by default. Make sure your backend server is running before using the frontend.

## Notes

- Cookies are used for authentication (withCredentials: true)
- The app automatically handles token refresh via interceptors
- Cart data is stored in localStorage
- All API calls include proper error handling

