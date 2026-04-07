# 🚀 Quick Start Guide

## Installation

```bash
# Navigate to frontend
cd d:\Project\VyaparSeth\frontend

# Install dependencies
npm install

# Create environment file
copy .env.example .env.local

# Start development server
npm run dev
```

## Access the Application

- **Frontend URL**: http://localhost:5173
- **Backend API**: http://localhost:8000

## Default Test Credentials

After registering a user:
- **Email**: your-email@example.com
- **Password**: (any password with 6+ characters)

## 🎨 Features at a Glance

### Dashboard
- Real-time statistics and KPIs
- Sales trends visualization
- Low stock alerts
- Top customers and products
- AI-powered insights

### Customers Management
- Add/View/Delete customers
- Track credit (Udhaar) balance
- Search functionality
- Contact information storage
- Transaction history

### Products Inventory
- Add/Manage products with SKU
- Stock level tracking
- Low stock alerts
- Cost and MRP tracking
- Category and description support
- Inventory value calculation

### Bills & Transactions
- Create and track bills
- Payment status management
- Udhaar/Credit tracking
- Multiple payment methods
- Bill items breakdown

### AI Assistant
- Chat with Groq AI
- Business insights and recommendations
- Low stock notifications
- Top customer analytics
- Revenue insights
- Natural language queries

## 🎨 UI/UX Highlights

### Neon Bazaar Design Theme
- 🟠 **Orange** (#FF9500) - Primary CTAs
- 🧊 **Teal** (#00FFD1) - Secondary accents
- 💜 **Purple** (#BD5FFF) - Tertiary elements
- 🔴 **Pink** (#FF2D55) - Alerts and danger
- ⚫ **Dark** (#0D0D0D) - Professional backdrop

### Modern Effects
- Glass morphism cards
- Smooth animations
- Responsive animations
- Loading states
- Gradient text effects
- Custom scrollbar styling

## 🔧 Backend Integration

All features integrate seamlessly with your FastAPI backend:

```
POST   /auth/login              → User authentication
POST   /auth/register           → New user registration
GET    /customers               → Fetch all customers
POST   /customers               → Add new customer
GET    /products                → Fetch products
POST   /products                → Add product
GET    /bills                   → Fetch bills
POST   /bills                   → Create bill
GET/POST /ai/...               → AI insights and Q&A
```

## 📦 Project Structure

```
frontend/
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page views
│   ├── store/        # Zustand state management
│   ├── lib/          # Utilities and API client
│   ├── types/        # TypeScript definitions
│   ├── App.tsx       # Main app with routing
│   └── index.css     # Global styles
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

## 🎯 Key Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Lucide React** - Icons

## 🚀 Build for Production

```bash
npm run build
npm run preview
```

Output will be in the `dist/` folder.

## 🐛 Troubleshooting

### Port already in use?
```bash
# Kill the process on port 5173
# MacOS/Linux:
lsof -ti:5173 | xargs kill -9

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Dependencies issues?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Backend connection issues?
- Ensure backend is running: `python -m uvicorn backend.main:app --reload`
- Check CORS is enabled in backend
- Verify VITE_API_BASE_URL in .env.local

## 📝 Environment Variables

```env
# .env.local
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=VyaparSeth
```

## 🤝 Support

For issues or feature requests, check:
1. Backend API documentation
2. TypeScript error messages
3. Browser console logs
4. Network requests in DevTools

---

**Happy Building! 🎉**

Built with ❤️ for Indian Retail Traders
