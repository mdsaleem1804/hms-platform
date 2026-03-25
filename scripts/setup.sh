#!/bin/bash

# HMS Platform - Setup Script

echo "🏥 HMS Platform Setup"
echo "===================="

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p backend/src/HMS.API/logs

# Frontend Setup
echo "📦 Setting up Frontend..."
cd frontend
npm install
cp .env.example .env.local
echo "✅ Frontend setup complete"

# Backend Setup (if .NET CLI available)
echo "📦 Setting up Backend..."
cd ../backend
if command -v dotnet &> /dev/null; then
    dotnet restore
    echo "✅ Backend setup complete"
else
    echo "⚠️  dotnet CLI not found. Please install .NET 8 SDK"
fi

# Database Setup
echo "🗄️ Database Setup Instructions:"
echo "   1. Ensure PostgreSQL is running"
echo "   2. Run: psql -U postgres"
echo "   3. CREATE DATABASE hms_platform;"
echo "   4. Exit psql (\\q)"
echo "   5. Run schema files from database/schema/"
echo "   6. Seed data: psql -U postgres -d hms_platform -f database/seed/seed_data.sql"

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Frontend: cd frontend && npm run dev"
echo "2. Backend:  cd backend/src/HMS.API && dotnet run"
echo "3. Or use:   docker-compose up"
