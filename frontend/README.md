# VyaparSeth Frontend

A modern, stunning React UI for the **Smart Udhaar & Store Manager** - an intelligent credit tracking and inventory management system for Indian retail shops.

## 🎨 Design Features

### Neon Bazaar Theme
- **Dark Background**: Rich #0D0D0D with grain texture
- **Neon Colors**:
  - 🟠 Saffron Orange (#FF9500) - Primary accent
  - 🧊 Teal (#00FFD1) - Secondary accent
  - 💜 Purple (#BD5FFF) - Tertiary accent
  - 🔴 Crimson Pink (#FF2D55) - Danger/Alert
  - 🔵 Cyber Blue (#00D9FF) - Highlights

### Key UI Elements
- ✨ Glass morphism cards with blur effects
- 🎬 Smooth animations and transitions
- 📊 Interactive charts using Recharts
- 🎯 Modern icon system with Lucide React
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Ultra-fast with Vite

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running at `http://localhost:8000`

### Installation

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Loading.tsx
│   │   └── layout/           # Layout components
│   │       ├── Sidebar.tsx
│   │       ├── Topbar.tsx
│   │       └── MainLayout.tsx
│   ├── pages/                # Page components
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── CustomersPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── BillsPage.tsx
│   │   └── AIPage.tsx
│   ├── store/                # Zustand stores
│   │   ├── authStore.ts
│   │   ├── customerStore.ts
│   │   ├── productStore.ts
│   │   └── aiStore.ts
│   ├── lib/                  # Utilities
│   │   └── api.ts
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   ├── App.tsx               # Main app with routing
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

## 🎯 Pages & Features

### 🔐 Authentication
- **Login Page**: Beautiful login interface with email/password
- **Register Page**: Multi-field registration with form validation
- JWT token management with localStorage
- Auto-logout on token expiry

### 📊 Dashboard
- Welcome message with user's shop name
- Real-time statistics cards
- Sales & Revenue trends (Line chart)
- Sales distribution (Pie chart)
- Low stock items alert
- Top customers by credit
- AI-powered insights

### 👥 Customers
- Add new customers with contact info
- Search functionality (name, phone, email)
- Customer cards with credit tracking
- Transaction history count
- Contact information display
- Delete customer action

### 📦 Products
- Inventory management
- Product cards with SKU and pricing
- Stock level indicators with color coding
- Add, edit, delete products
- Low stock threshold alerts
- Category and description support
- Real-time inventory value calculation

### 📄 Bills & Transactions
- Create and manage bills
- Payment status tracking (Paid, Partial, Pending)
- Bill items breakdown
- Search bills by customer or bill ID
- Total revenue and udhaar calculations
- Payment method and notes

### 🤖 AI Assistant
- Powered by Groq AI
- Natural language questions
- Business insights and recommendations
- Suggested questions for quick access
- Real-time chat interface
- Analytics on low stock items, top customers, revenue

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite (ultra-fast)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React icons
- **Charts**: Recharts
- **Animations**: Framer Motion
- **HTTP Client**: Axios with JWT interceptors
- **Routing**: React Router v6

## 🔌 API Integration

All API calls are intercepted by Axios and automatically include JWT tokens:

```typescript
// Base URL configured in .env.local
VITE_API_BASE_URL=http://localhost:8000

// Endpoints integrated:
POST   /auth/login
POST   /auth/register
GET    /customers
POST   /customers
GET    /products
POST   /products
GET    /bills
POST   /bills
GET    /ai/insights
POST   /ai/ask
```

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to customize the Neon Bazaar color scheme:

```typescript
colors: {
  'neon-orange': '#FF9500',
  'neon-teal': '#00FFD1',
  'neon-pink': '#FF2D55',
  // ... more colors
}
```

### Typography
Fonts are from Google Fonts (Poppins, Space Grotesk)

### Animations
Custom animations defined in `tailwind.config.ts` and `index.css`

## 🚀 Build & Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

Output files are in the `dist/` folder.

## 📱 Responsive Design

- **Mobile**: Collapsible sidebar, touch-friendly buttons
- **Tablet**: Optimized grid layouts
- **Desktop**: Full featured UI with all columns visible

## 🔐 Security

- JWT tokens stored in localStorage
- Auto-logout on 401 responses
- Protected routes with auth checks
- Secure password handling
- CORS configured on backend

## 🐛 Troubleshooting

### Backend Connection Issues
```bash
# Ensure backend is running
# Check VITE_API_BASE_URL in .env.local
# Verify CORS settings on backend
```

### Styling Issues
```bash
# Rebuild Tailwind CSS
npm run dev

# Clear cache
rm -rf node_modules/.vite
npm run dev
```

### Type Errors
```bash
# Update types
npm install

# Type check
npx tsc --noEmit
```

## 📊 Used Images from Backend

Images from the `images/` folder can be integrated:
- `hero-bg.jpg` - Hero backgrounds
- `ai-avatar.jpg` - AI assistant avatar
- `empty-*.jpg` - Empty state illustrations
- `register-scene.jpg` - Registration page
- `onboarding-success.jpg` - Success screens
- `whatsapp-bg.jpg` - WhatsApp integration

## 📝 Environment Variables

Create `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=VyaparSeth
```

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [Recharts](https://recharts.org)
- [Framer Motion](https://www.framer.com/motion)

## 📈 Features Roadmap

- [ ] Export reports to PDF
- [ ] WhatsApp integration for reminders
- [ ] Multi-language support
- [ ] Offline mode
- [ ] Dark/Light theme toggle
- [ ] Advanced analytics
- [ ] Bulk operations
- [ ] Custom branding

## 🤝 Contributing

We welcome contributions! Please feel free to submit PRs for bug fixes, features, or improvements.

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

**Built with ❤️ for Indian RTSs (Retail Trade Shops)**

For backend API documentation, see `/backend/README.md`
