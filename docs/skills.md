# HMS Platform - Coding Standards & Skills

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: ShadCN UI (optional)
- **HTTP Client**: Axios
- **Build Tool**: Turbopack (Next.js default)

### Backend
- **Framework**: ASP.NET Core 8
- **Architecture**: Clean Architecture
- **Database**: PostgreSQL
- **ORM**: Entity Framework Core 8
- **Logging**: Serilog
- **API Documentation**: Swagger/OpenAPI

### Database
- **Engine**: PostgreSQL
- **Migration Strategy**: EF Core + Versioned SQL Scripts
- **Key Distribution**: UUID (Gen Random)

---

## Coding Standards

### General Principles

1. **Single Responsibility**: Each module/component does one thing well
2. **Modularity**: Features are independent and loosely coupled
3. **Extensibility**: Design for future modules (Billing, Notifications)
4. **Clean Code**: Self-documenting, meaningful names, DRY principle
5. **Separation of Concerns**: Strict layer boundaries
6. **No Business Logic in UI**: All decisions in backend
7. **No Database Access in Controllers**: Always use service/repository layer

---

### Naming Conventions

#### C# / .NET
- **Types**: `PascalCase` (Patient, IPatientService)
- **Methods**: `PascalCase` (GetPatientById, CreateAppointment)
- **Properties**: `PascalCase` (FirstName, IsActive)
- **Private Fields**: `_camelCase` (_logger, _repository)
- **Constants**: `UPPERCASE` (DEFAULT_TIMEOUT)

#### TypeScript / JavaScript
- **Variables**: `camelCase` (firstName, isActive)
- **Functions**: `camelCase` (getPatients, handleSubmit)
- **Constants**: `UPPER_SNAKE_CASE` (API_URL, MAX_RETRIES)
- **React Components**: `PascalCase` (PatientTable, Header)
- **Hooks**: `camelCase` with `use` prefix (usePatients, useAppointments)

#### SQL
- **Tables**: `snake_case` (patients, doctor_schedules)
- **Columns**: `snake_case` (first_name, appointment_date)
- **Indexes**: `idx_[table_columns]` (idx_patient_mobile)
- **Constraints**: `constraint_[description]`

---

### Clean Architecture (Backend)

#### Layer Responsibilities

```
HMS.Domain (Core)
├── Entities: Patient, Appointment, Doctor
├── Enums: AppointmentStatus
└── No external dependencies

HMS.Application (Business Logic)
├── Services: IPatientService, IAppointmentService
├── DTOs: PatientDto, AppointmentDto
└── Depends only on HMS.Domain

HMS.Infrastructure (Data Access)
├── Repositories: PatientRepository
├── DbContext: AppDbContext
└── Depends on HMS.Domain and EF Core

HMS.API (Presentation)
├── Controllers: PatientsController
├── Extensions: ServiceExtensions, MiddlewareExtensions
└── Program.cs: Entry point with DI setup
```

#### Key Rules

1. **Controllers**: Thin, delegate to services
2. **Services**: Business logic, data validation, orchestration
3. **Repositories**: Data access only, no business logic
4. **DTOs**: Transfer data between layers (never expose entities)
5. **Entities**: Domain models, no external dependencies
6. **Dependency Injection**: Configure in ServiceExtensions.cs

---

### Frontend Architecture

#### Feature-Based Structure

```
frontend/
├── app/(dashboard)/
│   ├── dashboard/
│   ├── patients/
│   └── appointments/
├── components/
│   ├── ui/ (Input, Button, Card)
│   ├── forms/ (PatientForm, AppointmentForm)
│   ├── tables/ (PatientsTable, AppointmentsTable)
│   └── layout/ (Sidebar, Header)
├── services/ (api.ts)
├── hooks/ (usePatients, useAppointments)
└── lib/ (utils, constants)
```

#### Component Rules

1. **Page Components**: Route handlers, compose features
2. **Feature Components**: Business context, standalone
3. **UI Components**: Reusable, presentation-only
4. **Custom Hooks**: Data fetching logic decoupled from components
5. **Services**: API calls centralized
6. **No Business Logic**: Components only render and delegate

---

### API Response Format

**Success Response**
```json
{
  "success": true,
  "data": { /* entity or list */ },
  "message": "Operation successful"
}
```

**Error Response**
```json
{
  "success": false,
  "data": null,
  "message": "Descriptive error message"
}
```

---

### Database Design Principles

1. **Audit Fields**: Every table has `created_at`, `updated_at`, `is_deleted`
2. **UUIDs**: Use UUID for primary keys (microservice-friendly)
3. **Indexes**: Index columns used in WHERE/JOIN/ORDER BY
4. **Relationships**: Use foreign keys with proper cascading
5. **Not Time Slots as Strings**: Store `start_time` and `end_time` separately
6. **Soft Deletes**: Use `is_deleted` flag for data retention
7. **Constraints**: Enforce data integrity at database level

---

## Feature-Based Structure

### Patient Module
- **Domain**: Patient entity with UPI, name, contact, demographics
- **Services**: Create, read, update, soft delete
- **API**: `/api/patients` endpoints (GET, POST, PUT, DELETE)

### Appointment Module
- **Domain**: Appointment entity with doctor, time slots, status
- **Services**: Schedule, reschedule, cancel, fetch available slots
- **API**: `/api/appointments` endpoints
- **Future**: Slot availability calculation

### Visit/Encounter Module
- **Domain**: Visit entity liking to appointment or standalone
- **Services**: Create visit record during registration
- **Future**: Store encounter notes, vitals, prescriptions

### Billing Module (Future)
- **Domain**: Invoice, payment, transaction records
- **Services**: Generate invoice, process payments
- **API**: Billing endpoints

### Notification Module (Future)
- **Domain**: Notification preferences, message templates
- **Services**: Send WhatsApp, SMS, Email
- **Integration**: Third-party APIs (Twilio, AWS SNS)

---

## AI & Code Generation Guidelines

1. **Use AI for**: Boilerplate, configuration, documentation, test cases
2. **You decide**: Architecture, business logic, critical decisions
3. **Review Always**: Generated code before committing
4. **Consistency**: Maintain patterns established in the codebase
5. **Comments**: Add comments for complex business logic

---

## Code Quality

1. **Type Safety**: Strict TypeScript, nullable reference types in C#
2. **Error Handling**: Try-catch with logging at service/repository level
3. **Validation**: Validate DTOs before processing
4. **Logging**: Log errors and key operations (use Serilog)
5. **Testing**: Unit tests for business logic, integration tests for repositories

---

## Workflow

1. **Feature Branch**: Create from `main`, name: `feature/[module-name]`
2. **Commit**: Atomic commits with clear messages
3. **Code Review**: PR before merging to main
4. **Testing**: Run tests locally; CI pipeline validates
5. **Deployment**: Deploy to staging, then production

---

