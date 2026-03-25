# HMS Platform - Complete Directory Structure

```
hms-platform/                                    # Root project directory
│
├─ 📄 README.md                                  # Main project documentation
├─ 📄 PROJECT_SUMMARY.md                         # Complete project summary
├─ 📄 SETUP_CHECKLIST.md                         # Setup and deployment checklist
├─ 📄 API_RESPONSES.md                           # API response examples
├─ 📄 .env.example                               # Environment template
├─ 📄 .gitignore                                 # Git ignore rules
├─ 📄 docker-compose.yml                         # Docker Compose configuration
│
│
├─ 📁 frontend/                                  # Next.js Frontend Application
│  │
│  ├─ 📄 package.json                            # Dependencies & scripts
│  ├─ 📄 tsconfig.json                           # TypeScript configuration
│  ├─ 📄 next.config.js                          # Next.js configuration
│  ├─ 📄 tailwind.config.js                      # Tailwind CSS configuration
│  ├─ 📄 postcss.config.js                       # PostCSS configuration
│  ├─ 📄 .env.example                            # Frontend env template
│  ├─ 📄 .env.local                              # Local environment
│  ├─ 📄 Dockerfile                              # Container image
│  │
│  ├─ 📁 app/                                    # App Router Pages
│  │  │
│  │  ├─ 📄 layout.tsx                           # Root layout
│  │  ├─ 📄 globals.css                          # Global styles
│  │  │
│  │  └─ 📁 (dashboard)/                         # Dashboard route group
│  │     │
│  │     ├─ 📄 layout.tsx                        # Dashboard layout (Sidebar + Header)
│  │     │
│  │     ├─ 📁 dashboard/
│  │     │  └─ 📄 page.tsx                       # Dashboard home page
│  │     │
│  │     ├─ 📁 patients/
│  │     │  └─ 📄 page.tsx                       # Patients list page
│  │     │
│  │     └─ 📁 appointments/
│  │        └─ 📄 page.tsx                       # Appointments list page
│  │
│  ├─ 📁 components/                             # React Components
│  │  │
│  │  ├─ 📁 layout/
│  │  │  ├─ 📄 Sidebar.tsx                       # Navigation sidebar
│  │  │  └─ 📄 Header.tsx                        # Top header bar
│  │  │
│  │  ├─ 📁 ui/
│  │  │  └─ 📄 Button.tsx                        # Reusable button
│  │  │
│  │  ├─ 📁 forms/                               # Form components (extensible)
│  │  │  └─ .gitkeep
│  │  │
│  │  └─ 📁 tables/
│  │     ├─ 📄 PatientsTable.tsx                 # Patients data table
│  │     └─ 📄 AppointmentsTable.tsx             # Appointments data table
│  │
│  ├─ 📁 services/                               # API Services
│  │  └─ 📄 api.ts                               # Centralized Axios client
│  │
│  ├─ 📁 hooks/                                  # Custom React Hooks
│  │  ├─ 📄 usePatients.ts                       # Fetch patients data
│  │  └─ 📄 useAppointments.ts                   # Fetch appointments data
│  │
│  └─ 📁 lib/                                    # Utilities
│     └─ 📄 utils.ts                             # Helper functions
│
│
├─ 📁 backend/                                   # ASP.NET Core Backend
│  │
│  ├─ 📄 Dockerfile                              # Container image
│  │
│  ├─ 📁 src/                                    # Source code
│  │  │
│  │  ├─ 📁 HMS.API/                             # API Layer (Controllers & Setup)
│  │  │  │
│  │  │  ├─ 📄 HMS.API.csproj                    # Project file
│  │  │  ├─ 📄 Program.cs                        # Application entry point
│  │  │  │
│  │  │  ├─ 📁 Controllers/                      # API Endpoints
│  │  │  │  ├─ 📄 PatientsController.cs          # GET/POST/PUT/DELETE patients
│  │  │  │  └─ 📄 AppointmentsController.cs      # GET/POST/PUT/DELETE appointments
│  │  │  │
│  │  │  └─ 📁 Extensions/                       # DI & Middleware
│  │  │     ├─ 📄 ServiceExtensions.cs           # Dependency injection setup
│  │  │     └─ 📄 MiddlewareExtensions.cs        # Global exception middleware
│  │  │
│  │  ├─ 📁 HMS.Application/                    # Business Logic Layer
│  │  │  │
│  │  │  ├─ 📄 HMS.Application.csproj            # Project file
│  │  │  │
│  │  │  └─ 📁 Features/                         # Feature-based services
│  │  │     │
│  │  │     ├─ 📁 Patients/
│  │  │     │  ├─ 📄 IPatientService.cs          # Service interface
│  │  │     │  ├─ 📄 PatientService.cs           # Service implementation
│  │  │     │  ├─ 📄 PatientDto.cs               # Data transfer object
│  │  │     │  └─ 📄 CreatePatientDto.cs         # Create request DTO
│  │  │     │
│  │  │     └─ 📁 Appointments/
│  │  │        ├─ 📄 IAppointmentService.cs      # Service interface
│  │  │        ├─ 📄 AppointmentService.cs       # Service implementation
│  │  │        ├─ 📄 AppointmentDto.cs           # Data transfer object
│  │  │        └─ 📄 CreateAppointmentDto.cs     # Create request DTO
│  │  │
│  │  ├─ 📁 HMS.Domain/                         # Core Business Logic & Entities
│  │  │  │
│  │  │  ├─ 📄 HMS.Domain.csproj                 # Project file
│  │  │  │
│  │  │  ├─ 📁 Entities/                         # Domain models
│  │  │  │  ├─ 📄 BaseEntity.cs                  # Base class (Id, audit fields)
│  │  │  │  ├─ 📄 Patient.cs                     # Patient entity
│  │  │  │  └─ 📄 Appointment.cs                 # Appointment entity
│  │  │  │
│  │  │  └─ 📁 Enums/                            # Enumerations
│  │  │     └─ 📄 AppointmentStatus.cs           # Status enum
│  │  │
│  │  └─ 📁 HMS.Infrastructure/                 # Data Access Layer
│  │     │
│  │     ├─ 📄 HMS.Infrastructure.csproj         # Project file
│  │     │
│  │     ├─ 📁 Persistence/
│  │     │  └─ 📄 AppDbContext.cs                # Entity Framework DbContext
│  │     │
│  │     └─ 📁 Repositories/                     # Data access implementations
│  │        └─ 📄 PatientRepository.cs           # Patient data access
│  │
│  └─ 📁 tests/                                  # Test Projects
│     │
│     ├─ 📁 HMS.UnitTests/                       # Unit tests
│     │  └─ .gitkeep
│     │
│     └─ 📁 HMS.IntegrationTests/                # Integration tests
│        └─ .gitkeep
│
│
├─ 📁 database/                                  # Database Configuration
│  │
│  ├─ 📁 schema/                                 # SQL Table Definitions
│  │  ├─ 📄 patients.sql                         # UHID, name, contact, demographics
│  │  ├─ 📄 doctors.sql                          # Doctor profiles
│  │  ├─ 📄 doctor_schedules.sql                 # Availability per day/time
│  │  ├─ 📄 appointments.sql                     # Scheduled appointments
│  │  └─ 📄 visits.sql                           # Encounter records
│  │
│  ├─ 📁 migrations/                             # Versioned migrations
│  │  └─ 📄 V1__init.sql                         # Initial schema migration
│  │
│  └─ 📁 seed/                                   # Sample Data
│     └─ 📄 seed_data.sql                        # Sample patients, doctors, appointments
│
│
├─ 📁 docs/                                      # Documentation
│  │
│  ├─ 📄 skills.md                               # Coding standards & best practices
│  │                                             # - Naming conventions (PascalCase, camelCase, snake_case)
│  │                                             # - Layer responsibilities
│  │                                             # - Feature-based structure
│  │                                             # - API response format
│  │                                             # - Database principles
│  │
│  ├─ 📄 architecture.md                         # System design & architecture
│  │                                             # - High-level overview (3-tier)
│  │                                             # - Frontend architecture
│  │                                             # - Backend Clean Architecture
│  │                                             # - Database design
│  │                                             # - Communication protocols (REST API)
│  │
│  └─ 📄 modules.md                              # Module descriptions & features
│                                                # - Patient module
│                                                # - Appointment module
│                                                # - Visit module (future)
│                                                # - Billing module (future)
│                                                # - Notification module (future)
│
│
└─ 📁 scripts/                                   # Automation Scripts
   │
   ├─ 📄 setup.sh                                # Setup automation script
   └─ 📄 commands.md                             # Development commands reference
```

---

## 📊 File Statistics

| Component | Directories | Files | Purpose |
|-----------|------------|-------|---------|
| **Frontend** | 9 | 22 | Next.js pages, components, hooks |
| **Backend** | 11 | 15 | Controllers, services, entities, repositories |
| **Database** | 3 | 7 | Schemas, migrations, seed data |
| **Documentation** | 1 | 5 | Architecture, standards, API docs |
| **Configuration** | 0 | 8 | Docker, environment, git config |
| **Total** | **24** | **57** | Production-ready monorepo |

---

## 🗂️ Layer Overview

### Frontend Structure
```
App Router               → Pages (Dashboard, Patients, Appointments)
  ↓
Components             → Reusable UI (Tables, Forms, Layout)
  ↓
Custom Hooks           → Data fetching logic
  ↓
API Services           → HTTP client (Axios)
```

### Backend Structure
```
Controllers            → HTTP endpoints
  ↓
Services              → Business logic (Patients, Appointments)
  ↓
Repositories          → Data access from DbContext
  ↓
Entities              → Domain models (Patient, Appointment)
```

### Database Structure
```
Schema Files          → Table definitions (Patients, Doctors, Appointments)
  ↓
Migrations            → Versioned schema changes (V1__init.sql)
  ↓
Seed Data             → Sample records for testing
```

---

## 🎯 Key Directories

**Frontend App Pages**: `frontend/app/(dashboard)/`
- Dashboard, Patients, Appointments pages ready to use

**Backend Services**: `backend/src/HMS.Application/Features/`
- Organized by feature (Patients, Appointments)

**Database Schemas**: `database/schema/`
- All tables with proper constraints and indexes

**Documentation**: `docs/`
- Complete architecture and coding standards

---

## 🔗 File Dependencies

```
Components
  ↓ Use
Hooks
  ↓ Use
API Services
  ↓ Call
Backend Controllers
  ↓ Delegate to
Services
  ↓ Use
Repositories
  ↓ Query
Database
```

---

## ✨ What's Ready

- ✅ **Immediate**: Run `npm install` in frontend, `dotnet build` in backend
- ✅ **Database**: All schemas ready, just run SQL files
- ✅ **API**: All endpoints defined and ready for implementation
- ✅ **Frontend**: Pages and components structure complete
- ✅ **Documentation**: Full architecture and standards documented

---

