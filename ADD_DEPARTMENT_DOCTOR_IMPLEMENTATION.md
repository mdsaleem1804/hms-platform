# Add Department & Doctor Modal Implementation

## Overview
Complete implementation of "Add Department" and "Add Doctor" modals in the Appointment screen with full backend and frontend integration.

---

## Backend Implementation

### 1. Domain Entities

#### **Department.cs** (`HMS.Domain/Entities/`)
```csharp
public class Department : BaseEntity
{
    public string Name { get; set; }
    public string? Description { get; set; }
    public string CreatedBy { get; set; }
    public string UpdatedBy { get; set; }
    public virtual ICollection<Doctor> Doctors { get; set; }
}
```

#### **Doctor.cs** (`HMS.Domain/Entities/`)
```csharp
public class Doctor : BaseEntity
{
    public string Name { get; set; }
    public string Specialization { get; set; }
    public string Mobile { get; set; }
    public string DepartmentId { get; set; }
    public string CreatedBy { get; set; }
    public string UpdatedBy { get; set; }
    public virtual Department? Department { get; set; }
    public virtual ICollection<Appointment> Appointments { get; set; }
}
```

#### **Appointment.cs** (Updated)
Added fields to track department and additional appointment info:
- `string Department` - Department name/code
- `string Priority` - Appointment priority level
- `string Notes` - Special instructions
- Navigation property: `Doctor? Doctor`

---

### 2. Data Transfer Objects (DTOs)

#### **DepartmentDto.cs** (`HMS.Application/Features/Departments/`)
```csharp
public class CreateDepartmentDto
{
    public string Name { get; set; }
    public string? Description { get; set; }
}

public class DepartmentDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public string CreatedBy { get; set; }
    public string UpdatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class DepartmentSummaryDto
{
    public string Id { get; set; }
    public string Name { get; set; }
}
```

#### **DoctorDto.cs** (`HMS.Application/Features/Doctors/`)
```csharp
public class CreateDoctorDto
{
    public string Name { get; set; }
    public string Specialization { get; set; }
    public string Mobile { get; set; }
    public string DepartmentId { get; set; }
}

public class DoctorDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Specialization { get; set; }
    public string Mobile { get; set; }
    public string DepartmentId { get; set; }
    public string CreatedBy { get; set; }
    public string UpdatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class DoctorSummaryDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Specialization { get; set; }
    public string DepartmentId { get; set; }
}
```

---

### 3. Repositories

#### **IDepartmentRepository.cs**
```csharp
public interface IDepartmentRepository
{
    Task<Department?> GetByIdAsync(string id);
    Task<IList<Department>> GetAllAsync();
    Task<Department> CreateAsync(Department department);
    Task UpdateAsync(Department department);
    Task DeleteAsync(string id);
}
```

#### **DepartmentRepository.cs** (`HMS.Infrastructure/Repositories/`)
- Implements CRUD operations for departments
- Soft delete support via `IsDeleted` flag
- Ordered by name for consistency

#### **IDoctorRepository.cs**
```csharp
public interface IDoctorRepository
{
    Task<Doctor?> GetByIdAsync(string id);
    Task<IList<Doctor>> GetAllAsync();
    Task<IList<Doctor>> GetByDepartmentIdAsync(string departmentId);
    Task<Doctor> CreateAsync(Doctor doctor);
    Task UpdateAsync(Doctor doctor);
    Task DeleteAsync(string id);
}
```

#### **DoctorRepository.cs** (`HMS.Infrastructure/Repositories/`)
- Includes `GetByDepartmentIdAsync()` for filtering by department
- Eager loads department relationship

---

### 4. Services

#### **IDepartmentService.cs**
```csharp
public interface IDepartmentService
{
    Task<DepartmentDto?> GetByIdAsync(string id);
    Task<IList<DepartmentSummaryDto>> GetAllAsync();
    Task<DepartmentDto> CreateAsync(CreateDepartmentDto createDto, string createdBy);
    Task UpdateAsync(string id, CreateDepartmentDto updateDto, string updatedBy);
    Task DeleteAsync(string id);
}
```

#### **DepartmentService.cs** (`HMS.Application/Features/Departments/`)
- Validates name is required
- Auto-generated GUID for department ID
- Audit field tracking (CreatedBy, UpdatedBy, CreatedAt, UpdatedAt)

#### **IDoctorService.cs**
```csharp
public interface IDoctorService
{
    Task<DoctorDto?> GetByIdAsync(string id);
    Task<IList<DoctorSummaryDto>> GetAllAsync();
    Task<IList<DoctorSummaryDto>> GetByDepartmentIdAsync(string departmentId);
    Task<DoctorDto> CreateAsync(CreateDoctorDto createDto, string createdBy);
    Task UpdateAsync(string id, CreateDoctorDto updateDto, string updatedBy);
    Task DeleteAsync(string id);
}
```

#### **DoctorService.cs** (`HMS.Application/Features/Doctors/`)
- **Validation:**
  - Doctor name required
  - Specialization required
  - Mobile number: exactly 10 digits (regex: `^\d{10}$`)
  - Department must exist
- Auto-generated GUID for doctor ID
- Audit field tracking

---

### 5. API Controllers

#### **DepartmentsController.cs** (`HMS.API/Controllers/`)
**Endpoints:**
- `GET /api/departments` - List all departments
- `GET /api/departments/{id}` - Get by ID
- `POST /api/departments` - Create new department
- `PUT /api/departments/{id}` - Update department
- `DELETE /api/departments/{id}` - Delete (soft delete)

#### **DoctorsController.cs** (`HMS.API/Controllers/`)
**Endpoints:**
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/{id}` - Get by ID
- `GET /api/doctors/by-department/{departmentId}` - Get doctors by department
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/{id}` - Update doctor
- `DELETE /api/doctors/{id}` - Delete (soft delete)

---

### 6. Database Configuration

#### **AppDbContext.cs** (Updated)
Added DbSets:
- `public DbSet<Department> Departments { get; set; }`
- `public DbSet<Doctor> Doctors { get; set; }`

Entity configurations:
- **Department Table:** `departments` table with automatic timestamp management
- **Doctor Table:** `doctors` table with foreign key to departments
  - Mobile indexed uniquely
  - Department NOT NULL with Restrict delete behavior
- **Relationships:**
  - Department → Doctors (one-to-many)
  - Doctor → Appointments (one-to-many, Restrict delete)

#### **Migration SQL Required**
```sql
-- Create departments table
CREATE TABLE departments (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_by VARCHAR(100) NOT NULL,
    updated_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Create doctors table
CREATE TABLE doctors (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    mobile VARCHAR(10) NOT NULL UNIQUE,
    department_id VARCHAR(36) NOT NULL,
    created_by VARCHAR(100) NOT NULL,
    updated_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    INDEX idx_department_id (department_id)
);

-- Add columns to appointments table
ALTER TABLE appointments ADD COLUMN department VARCHAR(100);
ALTER TABLE appointments ADD COLUMN priority VARCHAR(20) DEFAULT 'Normal';
ALTER TABLE appointments ADD COLUMN notes TEXT;
ALTER TABLE appointments ADD COLUMN doctor_id VARCHAR(36);
ALTER TABLE appointments ADD FOREIGN KEY (doctor_id) REFERENCES doctors(id);
```

---

## Frontend Implementation

### 1. Reusable Modal Component

#### **Modal.tsx** (`components/ui/`)
- Generic modal wrapper with backdrop
- Supports sm/md/lg sizes
- Optional footer for buttons
- Click-outside to close
- Close (X) button in header

### 2. Services

#### **departmentService.ts** (`services/`)
```typescript
- getAll(): Promise<DepartmentSummary[]>
- getById(id: string): Promise<Department>
- create(request: CreateDepartmentRequest): Promise<Department>
- update(id: string, request: CreateDepartmentRequest): Promise<void>
- delete(id: string): Promise<void>
```

#### **doctorService.ts** (`services/`)
```typescript
- getAll(): Promise<DoctorSummary[]>
- getById(id: string): Promise<Doctor>
- getByDepartmentId(departmentId: string): Promise<DoctorSummary[]>
- create(request: CreateDoctorRequest): Promise<Doctor>
- update(id: string, request: CreateDoctorRequest): Promise<void>
- delete(id: string): Promise<void>
```

### 3. Modal Components

#### **AddDepartmentModal.tsx** (`components/modals/`)
**Fields:**
- Department Name (required, text input)
- Description (optional, textarea)
- Auto-generated ID (note shown to user)
- Created By / Updated By (auto-filled server-side)

**Features:**
- Form validation
- Loading state during submission
- Error handling with toast notifications
- Reset form on success
- Close modal on submit

#### **AddDoctorModal.tsx** (`components/modals/`)
**Fields:**
- Doctor Name (required, text input)
- Specialization (required, text input)
- Mobile Number (required, 10-digit validation)
- Department Dropdown (required, dynamically loaded from API)
- Auto-generated ID (note shown to user)

**Features:**
- Form validation (including mobile format: `^\d{10}$`)
- Department loading on modal open
- Department pre-selection if passed as prop (`defaultDepartmentId`)
- Error handling with toast notifications
- Loading state during submission

### 4. Updated Appointment Form

#### **AppointmentDetailsSection.tsx** (Updated)
Added below Department and Doctor selectors:
- **"+ Add Department"** link → opens AddDepartmentModal
- **"+ Add Doctor"** link → opens AddDoctorModal

Modal state management:
- `isAddDepartmentOpen` state
- `isAddDoctorOpen` state
- Pass `defaultDepartmentId` to doctor modal for pre-selection

### 5. API Client Configuration

#### **lib/api.ts** (New)
Centralized Axios configuration:
```typescript
- Base URL: NEXT_PUBLIC_API_URL or http://localhost:7000
- Default headers: Content-Type: application/json
- Timeout: 30 seconds
- Error interceptor for logging
```

---

## Integration Points

### Backend Service Registration
**ServiceExtensions.cs** Updated:
```csharp
services.AddScoped<IDepartmentService, DepartmentService>();
services.AddScoped<IDepartmentRepository, DepartmentRepository>();
services.AddScoped<IDoctorService, DoctorService>();
services.AddScoped<IDoctorRepository, DoctorRepository>();
```

### Frontend Imports
- Modal component uses `lucide-react` icons (Plus, X, AlertCircle, Loader)
- Services use centralized `apiClient` from `lib/api.ts`
- Toast notifications via `react-hot-toast`

---

## API Response Examples

### Create Department
**Request:**
```http
POST /api/departments
Content-Type: application/json

{
  "name": "Cardiology",
  "description": "Heart and cardiovascular diseases"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Cardiology",
    "description": "Heart and cardiovascular diseases",
    "createdBy": "admin",
    "updatedBy": "admin",
    "createdAt": "2026-03-27T10:00:00Z",
    "updatedAt": "2026-03-27T10:00:00Z"
  },
  "message": "Department created successfully"
}
```

### Create Doctor
**Request:**
```http
POST /api/doctors
Content-Type: application/json

{
  "name": "Dr. Rajesh Kumar",
  "specialization": "Cardiology",
  "mobile": "9876543210",
  "departmentId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Dr. Rajesh Kumar",
    "specialization": "Cardiology",
    "mobile": "9876543210",
    "departmentId": "550e8400-e29b-41d4-a716-446655440000",
    "createdBy": "admin",
    "updatedBy": "admin",
    "createdAt": "2026-03-27T10:00:00Z",
    "updatedAt": "2026-03-27T10:00:00Z"
  },
  "message": "Doctor created successfully"
}
```

---

## Next Steps

1. **Run Database Migration**
   - Execute the SQL migration script to create/update tables
   - Or use EF Core migrations if available

2. **Test Backend APIs**
   ```bash
   # Backend
   cd backend/src/HMS.API
   dotnet run
   
   # Test endpoints using Postman/curl
   POST http://localhost:7000/api/departments
   POST http://localhost:7000/api/doctors
   ```

3. **Test Frontend**
   ```bash
   # Frontend
   cd frontend
   npm run dev
   
   # Navigate to Appointment booking screen
   # Click "Add Department" link to open modal
   # Click "Add Doctor" link to open modal
   ```

4. **Environment Configuration**
   - Ensure `NEXT_PUBLIC_API_URL` is set in `.env.local`
   - Default: `http://localhost:7000`

---

## File Summary

### Backend Files Created/Modified
- ✅ `HMS.Domain/Entities/Department.cs` (NEW)
- ✅ `HMS.Domain/Entities/Doctor.cs` (NEW)
- ✅ `HMS.Domain/Entities/Appointment.cs` (MODIFIED)
- ✅ `HMS.Application/Features/Departments/DepartmentDto.cs` (NEW)
- ✅ `HMS.Application/Features/Departments/IDepartmentService.cs` (NEW)
- ✅ `HMS.Application/Features/Departments/DepartmentService.cs` (NEW)
- ✅ `HMS.Application/Features/Doctors/DoctorDto.cs` (NEW)
- ✅ `HMS.Application/Features/Doctors/IDoctorService.cs` (NEW)
- ✅ `HMS.Application/Features/Doctors/DoctorService.cs` (NEW)
- ✅ `HMS.Application/Repositories/IDepartmentRepository.cs` (NEW)
- ✅ `HMS.Application/Repositories/IDoctorRepository.cs` (NEW)
- ✅ `HMS.Infrastructure/Repositories/DepartmentRepository.cs` (NEW)
- ✅ `HMS.Infrastructure/Repositories/DoctorRepository.cs` (NEW)
- ✅ `HMS.Infrastructure/Persistence/AppDbContext.cs` (MODIFIED)
- ✅ `HMS.API/Controllers/DepartmentsController.cs` (NEW)
- ✅ `HMS.API/Controllers/DoctorsController.cs` (NEW)
- ✅ `HMS.API/Extensions/ServiceExtensions.cs` (MODIFIED)

### Frontend Files Created/Modified
- ✅ `components/ui/Modal.tsx` (NEW)
- ✅ `components/modals/AddDepartmentModal.tsx` (NEW)
- ✅ `components/modals/AddDoctorModal.tsx` (NEW)
- ✅ `components/forms/appointment-sections/AppointmentDetailsSection.tsx` (MODIFIED)
- ✅ `services/departmentService.ts` (NEW)
- ✅ `services/doctorService.ts` (NEW)
- ✅ `lib/api.ts` (NEW)

