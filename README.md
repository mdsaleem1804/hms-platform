# HMS Platform 🏥

A **production-ready Hospital Management System** monorepo built with modern technologies following Clean Architecture principles.

## 📋 Project Overview

HMS Platform is a comprehensive hospital management solution designed for scalability, maintainability, and extensibility. It supports patient management, appointment scheduling, doctor availability, visits/encounters, and a foundation for billing and notifications.

**Tech Stack**:
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: ASP.NET Core 8 + Clean Architecture
- **Database**: PostgreSQL
- **Architecture**: Clean Architecture, Microservice-ready

---

## 🏗️ Project Structure

```
hms-platform/
├── frontend/                    # Next.js application
│   ├── app/                    # App Router pages
│   ├── components/             # Reusable components
│   ├── services/               # API client
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utilities
│   └── package.json
│
├── backend/                     # ASP.NET Core solution
│   └── src/
│       ├── HMS.API/            # API controllers
│       ├── HMS.Application/    # Business logic
│       ├── HMS.Domain/         # Entities & enums
│       └── HMS.Infrastructure/ # Data access
│   └── tests/
│       ├── HMS.UnitTests/      # Unit tests
│       └── HMS.IntegrationTests/ # Integration tests
│
├── database/                    # Database schemas & migrations
│   ├── schema/                 # SQL table definitions
│   ├── migrations/             # Versioned migrations
│   └── seed/                   # Sample data
│
├── docs/                        # Documentation
│   ├── skills.md               # Coding standards
│   ├── architecture.md         # System design
│   └── modules.md              # Module overview
│
├── scripts/                     # Automation scripts
├── .env.example                 # Environment template
├── docker-compose.yml           # Local development setup
└── README.md                    # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (Frontend)
- .NET 8 SDK (Backend)
- PostgreSQL 14+ (Database)
- Docker & Docker Compose (Optional)

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
# Navigate to http://localhost:3000
```

### Backend Setup

```bash
cd backend/src/HMS.API
dotnet build
dotnet run
# API runs on https://localhost:5134
```

### Database Setup

```bash
psql -U postgres
CREATE DATABASE hms_platform;
psql -U postgres -d hms_platform -f database/schema/patients.sql
psql -U postgres -d hms_platform -f database/seed/seed_data.sql
```

### Local Development (Docker Compose)

```bash
docker-compose up
# Frontend: http://localhost:3000
# Backend: http://localhost:5134
# Database: localhost:5432
```

---

## 📚 Core Modules

### Patient Module
Manage patient records with unique identifiers (UHID), demographics, and soft delete capability.

### Appointment Module
Schedule appointments with doctors, manage time slots, track status, and generate token numbers.

### Future Modules
- Visit/Encounter tracking
- Billing & Invoicing
- WhatsApp/SMS Notifications

---

## 🏛️ Architecture

### Clean Architecture Layers

```
API Layer (Controllers)
        ↓ Dependency Injection
Application Layer (Services)
        ↓ Uses Repositories
Infrastructure Layer (Repositories)
        ↓ DbContext
Domain Layer (Entities)
```

---

## 🗄️ Database Schema

**Core Tables**:
- **patients**: Patient records with UHID
- **doctors**: Doctor profiles
- **appointments**: Scheduled appointments
- **visits**: Encounter records

**Features**:
- UUID primary keys (microservice-friendly)
- Audit columns: `created_at`, `updated_at`, `is_deleted`
- Proper indexing on frequently queried columns

---

## 📖 Documentation

- [skills.md](docs/skills.md): Coding standards & best practices
- [architecture.md](docs/architecture.md): System design & layer responsibilities
- [modules.md](docs/modules.md): Module descriptions & features

---

## 🛠️ Development Workflow

1. Create feature branch: `git checkout -b feature/[module-name]`
2. Follow coding standards from docs/skills.md
3. Write tests for new features
4. Commit with clear messages
5. Submit PR for review

---

## 📊 Future Roadmap

**Phase 1** (Current)
- ✅ Patient Management
- ✅ Appointment Scheduling
- ✅ Doctor Management

**Phase 2**
- 🔲 Billing System
- 🔲 Notifications (WhatsApp/SMS)
- 🔲 Authentication

**Phase 3**
- 🔲 Microservices
- 🔲 API Gateway
- 🔲 Message Queue

---

## 📝 Key Rules

✅ No business logic in UI  
✅ No DB access in controllers  
✅ Controllers stay thin  
✅ Use service → repository pattern  
✅ DTOs for API communication  
✅ Clean Architecture principles  
✅ Production-ready code  

---

**Built with ❤️ for better healthcare**
