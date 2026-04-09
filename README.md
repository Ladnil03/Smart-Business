# VyaparSeth - Smart Retail Shop Manager

A comprehensive full-stack web application designed specifically for Indian retail shop owners to manage inventory, customers, billing, and credit tracking (Udhaar). Built with **FastAPI** backend and **React** frontend.

## 🎯 Features

### Core Functionality
- **📦 Product Management** - Add, update, and track product inventory with pricing and stock levels
- **👥 Customer Management** - Maintain customer profiles and contact information
- **🧾 Billing System** - Generate and manage bills with itemized products
- **💰 Credit Tracking (Udhaar)** - Track money owed by customers with payment history
- **📊 Dashboard** - Real-time insights on top customers, low stock items, and pending payments

### Advanced Features
- **🤖 AI Assistant** - Powered by Groq LLM for business recommendations and analytics
  - Ask questions about your business
  - Get insights on customer credit patterns
  - Receive inventory recommendations
- **👤 User Profiles** - Customize user profile with photo upload and shop information
- **⚙️ Settings** - Manage notifications, display preferences, and account settings
- **🔐 Authentication** - Secure JWT-based authentication with token management
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices

## 🏗️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework with async support
- **MongoDB** - NoSQL database for flexible data storage
- **Groq API** - LLM integration for AI capabilities
- **PyJWT** - JWT token generation and validation
- **Pydantic** - Data validation and settings management
- **Python 3.8+**

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Zustand** - Lightweight state management
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 16+ and npm
- MongoDB Atlas account (or local MongoDB)
- Groq API key (for AI features)
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Ladnil03/Smart-Business.git
cd Smart-Business
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1  # On Windows
# or
source venv/bin/activate     # On macOS/Linux
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the project root:
```env
# MongoDB
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=Cluster0
DB_NAME=udhaar_db

# JWT Configuration
SECRET_KEY=your_secret_key_here_generate_with_openssl_rand_hex_32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Groq API
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# CORS
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]

# Shop Info
SHOP_NAME=MyShop
```

#### Get API Keys
- **MongoDB**: Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster
- **Groq API**: Get your free API key from [Groq Console](https://console.groq.com)

#### Start Backend Server
```bash
python -m uvicorn backend.main:app --reload --port 8000
```
Backend runs on `http://localhost:8000`

### 3. Frontend Setup

#### Navigate to Frontend
```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment Variables
Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

#### Start Development Server
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## 📚 API Documentation

Once the backend is running, access the interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/logout` - Logout user

#### Products
- `GET /products` - List all products
- `POST /products` - Create new product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

#### Customers
- `GET /customers` - List all customers
- `POST /customers` - Create new customer
- `PUT /customers/{id}` - Update customer
- `DELETE /customers/{id}` - Delete customer

#### Bills
- `GET /bills` - List all bills
- `POST /bills` - Create new bill
- `GET /bills/{id}` - Get bill details

#### AI Assistant
- `POST /ai/ask` - Ask AI questions about your business
- `GET /ai/insights` - Get business insights from AI

## 📁 Project Structure

```
VyaparSeth/
├── backend/
│   ├── routes/              # API route handlers
│   ├── services/            # Business logic
│   ├── models/              # MongoDB models
│   ├── schemas/             # Pydantic schemas
│   ├── database/            # Database connection
│   ├── middleware/          # Custom middleware (rate limiting)
│   ├── utils/               # Utility functions
│   ├── config.py            # Configuration settings
│   └── main.py              # FastAPI app entry
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable UI components
│   │   ├── store/           # Zustand state stores
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # API client
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Main App component
│   │   └── main.tsx         # React entry point
│   ├── public/              # Static assets
│   ├── package.json         # Dependencies
│   └── vite.config.ts       # Vite configuration
│
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## 🔐 Authentication Flow

1. User registers with email, password, and shop details
2. Credentials validated and user stored in MongoDB
3. On login, JWT token generated (60-minute expiration)
4. Token stored in localStorage and Zustand store
5. All API requests include token in Authorization header
6. Token refreshed automatically on page reload
7. Expired tokens redirect to login page

## 🛡️ Rate Limiting

- Authentication endpoints: 5 requests per minute
- Prevents brute force attacks
- Implemented via custom middleware

## 🌐 Deployment

### Backend (Render/Heroku)
```bash
python -m uvicorn backend.main:app --host 0.0.0.0
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

## 🤖 AI Assistant Setup

The AI Assistant uses the Groq API with the `llama-3.3-70b-versatile` model. To enable AI features:

1. Sign up for free at [Groq Console](https://console.groq.com)
2. Generate an API key
3. Add to `.env` file as `GROQ_API_KEY`

The AI can answer questions about:
- Customer credit patterns
- Low stock alerts
- Top selling products
- Payment trends
- Business recommendations

## 🔍 Features in Detail

### Dashboard
- Overview of key metrics
- Top 5 customers by credit
- Low stock alerts
- Recent transactions
- AI-powered insights button

### Products
- Add/edit/delete products
- Set pricing and stock levels
- Track inventory status
- Search and filter products

### Customers
- Customer profiles with contact info
- Credit amount tracking
- Payment history
- Communication preferences

### Bills
- Generate itemized bills
- Set payment status (Paid/Credit)
- Print bills
- Bill history and tracking

### AI Assistant
- Ask natural language questions
- Get business insights
- Receive recommendations
- Analytics and trends

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version

# Verify venv is activated
pip list

# Check if port 8000 is in use
netstat -ano | findstr :8000
```

### API returns 401 Unauthorized
- Ensure `.env` has valid `SECRET_KEY`
- Check token is not expired
- Clear browser localStorage and re-login

### AI service returns error
- Verify `GROQ_API_KEY` is valid in `.env`
- Check API key quota at [Groq Console](https://console.groq.com)
- Ensure model `llama-3.3-70b-versatile` is available

### MongoDB connection fails
- Verify `MONGODB_URL` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database credentials are valid

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Support & Contact

For issues, questions, or suggestions:
- Open an issue on [GitHub Issues](https://github.com/Ladnil03/Smart-Business/issues)
- Email: your-email@example.com

## 🎉 Acknowledgments

- FastAPI community for the excellent web framework
- MongoDB for flexible data storage
- Groq for powerful AI capabilities
- React community for the amazing frontend ecosystem

---

**Happy Coding! Build amazing retail solutions with VyaparSeth.** 🚀
