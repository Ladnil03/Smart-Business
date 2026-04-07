#!/bin/bash

# VyaparSeth Frontend Setup Script

echo "🚀 Setting up VyaparSeth Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local file
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local..."
    cp .env.example .env.local
    echo "✅ .env.local created. Please update with your API URL if needed."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure your backend is running on http://localhost:8000"
echo "2. Run: npm run dev"
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "🎨 Default theme: Neon Bazaar (Dark mode with orange/teal/purple accents)"
echo "🤖 AI features: Powered by Groq AI"
echo ""
