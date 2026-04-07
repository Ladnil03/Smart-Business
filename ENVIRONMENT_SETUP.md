# 🔐 Environment Variables Setup Guide

This guide explains all the environment variables used in VyaparSeth and how to configure them.

## ✅ No Hardcoded Values

All sensitive information and environment-specific configuration is stored in `.env` files. This includes:
- ✅ API Keys (Groq, JWT Secret)
- ✅ Database URLs
- ✅ CORS origins
- ✅ Token expiration settings
- ✅ API base URLs
- ✅ Server ports

---

## Backend Configuration

### Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your values:**
   ```bash
   # Database
   MONGODB_URL=mongodb://your-mongodb-host:27017
   DB_NAME=udhaar_db
   
   # Security
   SECRET_KEY=your-secure-jwt-secret-here-change-this
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   
   # AI Service
   GROQ_API_KEY=your-groq-api-key-here
   
   # Application
   SHOP_NAME=MyShop
   
   # CORS - Frontend origin(s)
   CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
   ```

### Environment Variables Reference

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `MONGODB_URL` | None | ✅ Yes | MongoDB connection string |
| `DB_NAME` | None | ✅ Yes | Database name |
| `SECRET_KEY` | None | ✅ Yes | JWT signing secret (use strong random string) |
| `ALGORITHM` | HS256 | No | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | 60 | No | Token expiration time in minutes |
| `GROQ_API_KEY` | None | ✅ Yes | Groq API key for AI features |
| `SHOP_NAME` | MyShop | No | Default shop name |
| `CORS_ORIGINS` | `["http://localhost:5173","http://localhost:3000"]` | No | Allowed frontend origins (as JSON array string) |

### Important Notes

- **`SECRET_KEY`**: Use a strong random string (minimum 32 characters). Generate one with:
  ```bash
  python -c "import secrets; print(secrets.token_urlsafe(32))"
  ```
  
- **`CORS_ORIGINS`**: Must be a valid JSON array string. Examples:
  - Local dev: `["http://localhost:5173"]`
  - Production: `["https://yourdomain.com"]`
  - Multiple origins: `["https://app.com","https://www.app.com"]`

---

## Frontend Configuration

### Setup Instructions

1. **Copy the example file:**
   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. **Edit `frontend/.env.local` with your values:**
   ```bash
   # API Configuration
   VITE_API_BASE_URL=http://localhost:8000
   
   # App Configuration
   VITE_APP_NAME=VyaparSeth
   
   # Server Configuration
   VITE_PORT=5173
   ```

### Environment Variables Reference

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `VITE_API_BASE_URL` | http://localhost:8000 | No | Backend API base URL |
| `VITE_APP_NAME` | VyaparSeth | No | Application name (for display) |
| `VITE_PORT` | 5173 | No | Development server port |

### Important Notes

- **`VITE_API_BASE_URL`**: 
  - Local: `http://localhost:8000`
  - Production: `https://api.yourdomain.com`
  - Must NOT have trailing slash

- Variables must start with `VITE_` to be accessible in the application

---

## Environment-Specific Setup

### Local Development

#### Backend
```bash
MONGODB_URL=mongodb://localhost:27017
DB_NAME=udhaar_db
SECRET_KEY=dev-secret-key-change-this
GROQ_API_KEY=your-key
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

#### Frontend
```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=VyaparSeth
VITE_PORT=5173
```

### Production

#### Backend
```bash
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net
DB_NAME=udhaar_db
SECRET_KEY=<generate-strong-secret>
GROQ_API_KEY=<your-production-key>
CORS_ORIGINS=["https://yourdomain.com"]
ACCESS_TOKEN_EXPIRE_MINUTES=120
```

#### Frontend
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_NAME=VyaparSeth
VITE_PORT=3000
```

---

## Running the Application

### Backend
```bash
# Make sure .env file exists in project root
python -m uvicorn backend.main:app --reload
```

### Frontend
```bash
# Make sure .env.local exists in frontend directory
cd frontend
npm run dev
```

---

## Security Best Practices

1. ✅ **Never commit `.env` files** to Git
   - `.env` and `.env.local` are in `.gitignore`

2. ✅ **Use strong secrets**
   - `SECRET_KEY` should be cryptographically random
   - Minimum 32 characters

3. ✅ **Rotate secrets regularly**
   - Change `SECRET_KEY` periodically
   - Update `GROQ_API_KEY` if compromised

4. ✅ **Use different values per environment**
   - Development: localhost URLs
   - Production: secure HTTPS URLs

5. ✅ **Protect `.env` files**
   - Set appropriate file permissions: `chmod 600 .env`
   - Don't share with unauthorized users

6. ✅ **No API keys in code**
   - All validated in this codebase ✓
   - Uses environment variables throughout

---

## Troubleshooting

### Backend can't find .env
- **Issue**: `FileNotFoundError` or `ValidationError` on startup
- **Fix**: Ensure `.env` file exists in project root directory
  ```bash
  cd /path/to/VyaparSeth
  cp .env.example .env
  ```

### Frontend can't connect to API
- **Issue**: CORS errors or connection refused
- **Fix**: Verify `VITE_API_BASE_URL` matches backend URL
  - Check `frontend/.env.local`
  - Ensure backend is running on that URL

### CORS errors
- **Issue**: `Access to XMLHttpRequest blocked by CORS`
- **Fix**: Update `CORS_ORIGINS` in backend `.env`
  ```bash
  CORS_ORIGINS=["http://localhost:5173"]
  ```
  - Restart backend

### Token validation fails
- **Issue**: 401 errors on protected routes
- **Fix**: Ensure `SECRET_KEY` in `.env` is same as when token was created
  - Changing `SECRET_KEY` invalidates all existing tokens

---

## Verification Checklist

Before running the application:

- [ ] Backend `.env` file exists
- [ ] Backend `.env` has all required variables filled
- [ ] Frontend `.env.local` file exists
- [ ] Frontend `.env.local` has `VITE_API_BASE_URL` set correctly
- [ ] Database is running and accessible
- [ ] No `.env` files are tracked in Git
- [ ] All API keys are valid and properly configured
