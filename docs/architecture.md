# HMS Platform - System Architecture

## High-Level Overview

The HMS Platform follows a **three-tier clean architecture** with strict separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                   │
│  - React Components, Pages, Routes                      │
│  - Hooks for Data Fetching                              │
│  - Reusable UI Components                               │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTP/REST API
                  ↓
┌─────────────────────────────────────────────────────────┐
│               BACKEND (ASP.NET Core)                    │
│  ┌─────────────────────────────────────────────────────┐
│  │ API Layer (Controllers)                             │
│  │ - PatientsController, AppointmentsController        │
│  │ - Route handling, request validation                │
│  └──────────────────┬──────────────────────────────────┘
│                     │ Dependency Injection
│  ┌──────────────────▼──────────────────────────────────┐
│  │ Application Layer (Services)                        │
│  │ - PatientService, AppointmentService                │
│  │ - Business logic, orchestration                     │
│  └──────────────────┬──────────────────────────────────┘
│                     │ Uses Repositories
│  ┌──────────────────▼──────────────────────────────────┐
│  │ Infrastructure Layer (Repositories)                 │
│  │ - PatientRepository, AppointmentRepository          │
│  │ - Data access via EF Core                           │
│  └──────────────────┬──────────────────────────────────┘
│                     │ DbContext
│  ┌──────────────────▼──────────────────────────────────┐
│  │ Domain Layer (Entities)                             │
│  │ - Patient, Appointment, Doctor                      │
│  │ - Business rules, enums                             │
│  └─────────────────────────────────────────────────────┘
└─────────────────┬───────────────────────────────────────┘
                  │ SQL Protocol
                  ↓
┌─────────────────────────────────────────────────────────┐
│           DATABASE (PostgreSQL)                         │
│  - Normalized schema with audit fields                  │
│  - UUID primary keys for microservice readiness         │
│  - Proper indexing for performance                      │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

### Directory Structure
```
frontend/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   └── (dashboard)/
│       ├── layout.tsx       # Dashboard layout (sidebar + header)
│       ├── dashboard/
│       │   └── page.tsx     # Dashboard home
│       ├── patients/
│       │   └── page.tsx     # Patients list
│       └── appointments/
│           └── page.tsx     # Appointments list
├── components/
│   ├── layout/              # Sidebar, Header
│   ├── ui/                  # Button, Input, Card
│   ├── forms/               # PatientForm, AppointmentForm
│   └── tables/              # PatientsTable, AppointmentsTable
├── services/
│   └── api.ts               # Centralized API client
├── hooks/
│   ├── usePatients.ts       # Fetch patients
│   └── useAppointments.ts   # Fetch appointments
├── lib/
│   └── utils.ts             # Helper functions
└── .env.local               # Environment variables
```

### Data Flow

1. **Pages** (Route handlers) display data
2. **Hooks** (usePatients, useAppointments) fetch data
3. **Services** (api.ts) make HTTP calls
4. **Components** (Tables, Forms) render UI

### State Management
- Use **React Hooks** (useState, useEffect) for component state
- Use **Custom Hooks** for data fetching logic
- Future: Consider Zustand or Redux for complex global state

---

## Backend Architecture (Clean Architecture)

### Layer Breakdown

#### 1. **Domain Layer** (HMS.Domain)
- **Purpose**: Core business entities and rules
- **Contains**: 
  - Entities (Patient, Appointment, Doctor)
  - Enums (AppointmentStatus)
  - Interfaces (repository contracts)
- **Key Rule**: No external dependencies, no DB access

**Example: Patient Entity**
```csharp
public class Patient : BaseEntity
{
    public string UHID { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Mobile { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; }
    public ICollection<Appointment> Appointments { get; set; }
}
```

#### 2. **Application Layer** (HMS.Application)
- **Purpose**: Business logic and use cases
- **Contains**:
  - Services (PatientService, AppointmentService)
  - DTOs (PatientDto, AppointmentDto)
  - Use case orchestration
- **Key Rule**: Services are NOT controllers; they implement business rules

**Example: PatientService**
```csharp
public class PatientService : IPatientService
{
    private readonly IPatientRepository _repository;
    
    public async Task<PatientDto> CreatePatientAsync(CreatePatientDto dto)
    {
        // Validation
        // Business logic
        // Call repository
        // Return DTO
    }
}
```

#### 3. **Infrastructure Layer** (HMS.Infrastructure)
- **Purpose**: Data persistence and external integrations
- **Contains**:
  - AppDbContext (EF Core DbContext)
  - Repositories (PatientRepository, AppointmentRepository)
  - Database migrations
- **Key Rule**: Repositories abstract data access

**Example: PatientRepository**
```csharp
public class PatientRepository : IPatientRepository
{
    private readonly AppDbContext _context;
    
    public async Task<Patient?> GetByIdAsync(string id)
    {
        return await _context.Patients
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);
    }
}
```

#### 4. **API Layer** (HMS.API)
- **Purpose**: HTTP endpoints and request/response handling
- **Contains**:
  - Controllers (PatientsController, AppointmentsController)
  - Extensions (ServiceExtensions, MiddlewareExtensions)
  - Middleware (GlobalExceptionMiddleware)
  - Program.cs (DI configuration)
- **Key Rule**: Controllers stay thin; delegate to services

**Example: PatientsController**
```csharp
[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IPatientService _patientService;
    
    [HttpGet]
    public async Task<ApiResponse<List<PatientDto>>> GetAll()
    {
        var patients = await _patientService.GetAllPatientsAsync();
        return ApiResponse<List<PatientDto>>.Success(patients);
    }
}
```

---

### Dependency Injection Flow

```
Program.cs
  │
  ├── ServiceExtensions.AddApplicationServices()
  │   ├── services.AddScoped<IPatientService, PatientService>();
  │   ├── services.AddScoped<IAppointmentService, AppointmentService>();
  │   └── ...
  │
  └── Controller Receives Services
      └── PatientsController(IPatientService patientService)
```

---

## Database Architecture

### Key Design Principles

1. **UUID Primary Keys**: `gen_random_uuid()` enables microservice scalability
2. **Audit Columns**: Every table has `created_at`, `updated_at`, `is_deleted`
3. **Soft Deletes**: Use `is_deleted` flag; no actual record deletion
4. **Normalized Schema**: Avoid redundancy, maintain referential integrity
5. **Proper Indexing**: Index frequently queried columns

### Entity-Relationship Diagram

```
┌──────────────┐
│   patients   │
├──────────────┤
│ id (UUID)    │◇─────────┐
│ uhid (UNIQUE)│          │ (1:N)
│ first_name   │          │
│ last_name    │          │
│ mobile (IDX) │          │
│ dob          │          │
│ gender       │          │
│ created_at   │          │
│ updated_at   │          │
│ is_deleted   │          │
└──────────────┘          │
                          │
                    ┌──────────────────┐
                    │  appointments    │
                    ├──────────────────┤
                    │ id (UUID)        │
                    │ appointment_no   │
                    │ patient_id (FK)  │◇─ (this side)
                    │ doctor_id (FK)   │
                    │ appointment_date │
                    │ start_time       │
                    │ end_time         │
                    │ token_number     │
                    │ status (IDX)     │
                    │ visit_type       │
                    │ created_at       │
                    │ updated_at       │
                    └──────────────────┘
```

### Core Tables

1. **patients**: Patient master records
2. **doctors**: Doctor profiles
3. **doctor_schedules**: Availability per doctor per day
4. **appointments**: Scheduled appointments
5. **visits**: Encounter/visit records (future)

---

## Communication Protocols

### REST API Standards

**Endpoint Pattern**
```
/api/<resource-plural>

GET    /api/patients          - List all
GET    /api/patients/{id}     - Get single
POST   /api/patients          - Create
PUT    /api/patients/{id}     - Update
DELETE /api/patients/{id}     - Delete (soft delete)
```

**Response Format**
```json
{
  "success": true,
  "data": { /* payload */ },
  "message": "Human-readable message"
}
```

**Error Handling**
```
- 400 Bad Request: Validation errors
- 401 Unauthorized: Auth required
- 403 Forbidden: Permission denied
- 404 Not Found: Resource doesn't exist
- 500 Internal Server Error: Server fault
```

---

## Deployment Architecture

```
┌─────────────┐
│   GitHub    │
│  Repository │
└──────┬──────┘
       │ Push
       ▼
┌─────────────────┐
│  CI/CD Pipeline │ (GitHub Actions)
│  - Build        │
│  - Test         │
│  - Container    │
└──────┬──────────┘
       │
       ├──────────────────┐
       ▼                  ▼
   ┌────────┐        ┌──────────┐
   │ Staging│        │Production│
   └────────┘        └──────────┘
```

### Docker Compose
- **frontend**: Next.js container (port 3000)
- **backend**: ASP.NET Core container (port 7000)
- **database**: PostgreSQL container (port 5432)

---

## Security Considerations

1. **API Authentication**: To be implemented (JWT recommended)
2. **CORS**: Configure appropriately for production
3. **Input Validation**: Validate on frontend and backend
4. **SQL Injection Prevention**: Use parameterized queries (EF Core handles)
5. **Secrets Management**: Environment variables for sensitive config

---

## Scalability Roadmap

### Phase 1 (Current)
- Monolithic backend
- Single PostgreSQL database
- REST API

### Phase 2 (Future)
- API Gateway
- Microservices: Patient, Appointment, Doctor, Billing, Notification
- Message Queue (RabbitMQ)
- Cache (Redis)

### Phase 3 (Future)
- Separate read/write databases (CQRS)
- Search Engine (Elasticsearch)
- Analytics (BI tools)
- Mobile apps (React Native/Flutter)

---

