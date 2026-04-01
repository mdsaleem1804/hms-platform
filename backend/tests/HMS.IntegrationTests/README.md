# HMS Platform - Integration Testing Suite

## 📋 Overview

This comprehensive integration testing suite provides end-to-end testing for the Hospital Management System. It generates and validates 50+ realistic test records covering the complete flow: **Patient → Doctor → Appointment → Billing**.

### What's Tested

✅ **50+ Realistic Test Records**
- 8 Doctors with different specializations
- 25 Unique patients with complete profiles
- 56+ Appointments with varied dates and statuses
- 56+ Billing entries with payment variations

✅ **Complete Integration Flows**
- Doctor-specific consultation rates
- Appointment creation and validation
- Billing generation and calculations
- Payment status tracking
- Service rate management

✅ **Data Integrity Validation**
- Foreign key relationships
- Unique constraints (UHID, Mobile, Bill Numbers)
- Amount calculations (discount, tax, net amount)
- Payment status variations

---

## 🚀 Getting Started

### Prerequisites

```
- .NET 8.0 SDK
- PostgreSQL database running
- xUnit test framework (included in `.csproj`)
```

### Step 1: Update Connection String (Optional)

Edit `appsettings.test.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=hms_test_db;Username=postgres;Password=Hana#2017"
  }
}
```

### Step 2: Run Tests

#### **Option A: Using .NET CLI (Recommended)**

```bash
# Run all integration tests with verbose output
dotnet test HMS.IntegrationTests.csproj -v detailed

# Run specific test class
dotnet test HMS.IntegrationTests.csproj -k "AppointmentIntegrationTests"

# Run specific test
dotnet test HMS.IntegrationTests.csproj -k "Should_Have_At_Least_50_Appointments"

# Run with logging
dotnet test HMS.IntegrationTests.csproj --logger "console;verbosity=detailed"
```

#### **Option B: Using Visual Studio Test Explorer**

1. Open `HMS.IntegrationTests.csproj` in Visual Studio
2. Build the project
3. Open Test Explorer (Test → Test Explorer)
4. Click "Run All Tests"

#### **Option C: Using Docker (For CI/CD)**

```bash
# From the project root
docker-compose up -d

# Run tests in container
dotnet test HMS.IntegrationTests.csproj --no-build
```

---

## 📊 Test Classes & Coverage

### 1. **AppointmentIntegrationTests** (8 tests)

Tests appointment creation, validation, and data quality:

- ✅ Create appointment successfully
- ✅ Get 50+ appointments
- ✅ Varied appointment dates (past, current, future)
- ✅ Different visit types (OPD, Emergency, Follow-up, Teleconsultation)
- ✅ Different appointment statuses
- ✅ Valid doctor references
- ✅ Valid patient references
- ✅ Unique appointment numbers
- ✅ Valid time slots

### 2. **BillingIntegrationTests** (11 tests)

Tests billing generation, doctor-specific pricing, and payment validation:

- ✅ Billing count matches appointment count
- ✅ Valid patient references
- ✅ Valid doctor references
- ✅ Unique bill numbers
- ✅ Correct net amount calculations
- ✅ Valid payment statuses (Paid, Unpaid, Partial)
- ✅ Different visit types
- ✅ **Doctor-specific pricing variations by specialization**
- ✅ Service rates proportional to consultation fees
- ✅ Billing amounts within valid range
- ✅ 18% GST tax calculation accuracy

### 3. **DataIntegrityIntegrationTests** (13 tests)

Validates overall data consistency and business requirements:

- ✅ At least 50 appointments generated
- ✅ 5-10 doctors with different specializations
- ✅ 20-30 patients
- ✅ Unique mobile numbers
- ✅ Unique UHIDs
- ✅ Valid patient profile data
- ✅ Valid doctor department references
- ✅ Even department-doctor distribution
- ✅ Valid appointment relationships
- ✅ Fair appointment-doctor distribution
- ✅ Valid doctor service rates
- ✅ **Foreign key integrity**
- ✅ **Comprehensive data consistency summary**

---

## 🧪 Sample Test Output

```
====================================================
🔧 Initializing integration test environment...
   ✓ Database initialized
🔄 Starting test data generation...
Parameters: Doctors=8, Patients=25, Appointments/Doctor=7

📌 Generating departments...
   ✓ Generated 10 departments
👨‍⚕️ Generating doctors...
   ✓ Generated 8 doctors across 8 specializations
💰 Generating doctor service rates...
   ✓ Generated 64 service rates
🏥 Generating patients...
   ✓ Generated 25 patients with unique UHIDs
📅 Generating appointments...
   ✓ Generated 56 appointments
💳 Generating billing records...
   ✓ Generated 56 billing records

═══════════════════════════════════════════════════
📊 TEST DATA GENERATION SUMMARY
═══════════════════════════════════════════════════
Total Departments:        10
Total Doctors:            8
Total Service Rates:      64
Total Patients:           25
Total Appointments:       56
Total Billing Records:    56
─────────────────────────────────────────────────
TOTAL RECORDS GENERATED:  219
═══════════════════════════════════════════════════

====================================================
Running Tests: AppointmentIntegrationTests
...
✓ All 56 appointments have unique appointment numbers
✓ All 56 appointments reference valid doctors
✓ All 56 appointments reference valid patients

Doctor consultation rates by specialization:
  Cardiology: Avg=₹800.00, Min=₹800.00, Max=₹800.00, Count=1
  Orthopedics: Avg=₹600.00, Min=₹600.00, Max=₹600.00, Count=1
  Neurology: Avg=₹750.00, Min=₹750.00, Max=₹750.00, Count=1
  ...

Payment status distribution:
  Paid:     33 (58.9%)
  Unpaid:   11 (19.6%)
  Partial:  12 (21.4%)

═══════════════════════════════════════════════════
📊 DATA CONSISTENCY SUMMARY
═══════════════════════════════════════════════════

DATABASE RECORD COUNTS:
  Departments:       10
  Doctors:           8
  Patients:          25
  Appointments:      56
  Billings:          56
  Service Rates:     64

APPOINTMENT BREAKDOWN:
  OPD: 18
  Emergency: 15
  Follow-up: 12
  Teleconsultation: 11

APPOINTMENT STATUS:
  Scheduled: 22
  Completed: 18
  Cancelled: 10
  No-Show: 6

FINANCIAL SUMMARY:
  Total Billing Amount:  ₹34,855.67
  Paid Amount:           ₹20,503.29
  Pending Amount:        ₹14,352.38
  Collection Rate:       58.9%
═══════════════════════════════════════════════════

Test Run Summary:
  Total Tests: 32
  Passed: 32
  Failed: 0
  Skipped: 0
  Duration: 2.45 seconds
```

---

## 💾 Database Seeding Options

### Option 1: Automatic Seeding (During Test Run)

The integration tests automatically:
1. Create test database
2. Apply migrations
3. Generate and insert test data
4. Clean up after tests

**No manual database setup needed!**

### Option 2: Direct SQL Seeding

For manual database setup or populating the main database:

```bash
# PostgreSQL
psql -U postgres -d hms_db -f seed_integration_test_data.sql

# Or via pgAdmin:
# 1. Open pgAdmin
# 2. Select your database
# 3. Right-click → Query Tool
# 4. Copy-paste contents of seed_integration_test_data.sql
# 5. Execute
```

The SQL script generates:
- ✅ 10 departments
- ✅ 8 doctors with specializations
- ✅ 64 doctor service rates
- ✅ 25 patients
- ✅ 56 appointments
- ✅ 56 billing records

**Verify with SQL:**

```sql
-- Check record counts
SELECT 
  COUNT(*) FILTER (WHERE 1=1) as total,
  (SELECT COUNT(*) FROM departments) as departments,
  (SELECT COUNT(*) FROM doctors) as doctors,
  (SELECT COUNT(*) FROM patients) as patients,
  (SELECT COUNT(*) FROM appointments) as appointments,
  (SELECT COUNT(*) FROM billings) as billings;
```

---

## 📝 Test Data Generation Classes

### TestDataGenerator
Main orchestrator for complete data generation

```csharp
var generator = new TestDataGenerator(
    doctorCount: 8,
    patientCount: 25,
    appointmentsPerDoctor: 7);

var dataset = generator.GenerateCompleteTestDataSet();
// Returns: Departments, Doctors, Patients, Appointments, Billings
```

### Specialized Generators

```csharp
// Departments
var depts = DepartmentDataGenerator.GenerateDepartments(10);

// Doctors with specializations
var doctors = DoctorDataGenerator.GenerateDoctorsWithSpecializations(
    new Dictionary<string, int>
    {
        { "Cardiology", 1 },
        { "Orthopedics", 1 },
        { "Neurology", 1 }
    });

// Patients
var patients = PatientDataGenerator.GeneratePatients(25);

// Appointments
var appointments = AppointmentDataGenerator.GenerateAppointments(
    patientIds, doctorIds, appointmentsPerDoctor: 7);

// Billing
var billings = BillingDataGenerator.GenerateBillingsForAppointments(
    appointments, doctorConsultationRates);
```

---

## 🔍 Key Test Scenarios

### Scenario 1: Doctor-Specific Pricing Validation

**Tests that different doctors have different rates based on specialization:**

```csharp
[Fact]
public async Task Doctor_Specific_Pricing_Should_Vary_By_Specialization()
{
    // Senior specializations (Cardiology, Oncology) charge more
    // Junior specializations (Pediatrics, ENT) charge less
    
    // Cardiology: ₹800/consultation
    // Pediatrics: ₹400/consultation
    // Orthopedics: ₹600/consultation
    
    Assert.True(cardiology_rate > pediatrics_rate);
    Assert.True(cardiology_rate > orthopedics_rate);
}
```

### Scenario 2: Payment Status Distribution

**Realistic payment patterns:**
- 60% Paid (Full payment)
- 20% Unpaid (Awaiting payment)
- 20% Partial (Partial payment)

### Scenario 3: Appointment Scheduling

**Diverse appointment dates:**
- Past appointments: -90 days to -1 day
- Current appointments: ±5 days
- Future appointments: +1 to +90 days

### Scenario 4: Complete Appointment Lifecycle

```
Appointment Created (Status: Scheduled)
    ↓
Consultation occurs (Status: Completed)
    ↓
Billing generated automatically
    ↓
Payment collected (Status: Paid/Unpaid/Partial)
```

---

## 🛠 Troubleshooting

### Issue: "Database connection failed"

**Solution:** 
```bash
# Ensure PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Update connection string in appsettings.test.json
```

### Issue: "Migration pending"

**Solution:**
```bash
# Run migrations from API project
cd ../HMS.API
dotnet ef database update

# Then run tests
cd ../../tests/HMS.IntegrationTests
dotnet test
```

### Issue: "Port already in use"

**Solution:**
```bash
# Close other instances using the port, or configure alternate port
# In appsettings.test.json, update connection string database name
```

### Issue: "Foreign key constraint violation"

**Solution:**
Tests automatically handle this by:
1. Generating doctors before appointments
2. Generating patients before appointments
3. Maintaining referential integrity

---

## 📈 Performance & Scale

| Metric | Value |
|--------|-------|
| Test Data Generation | ~2-3 seconds |
| Database Setup | ~1-2 seconds |
| All Tests Execution | ~5-10 seconds |
| Total Test Records | 219+ |
| Appointments | 56 |
| Billings | 56 |
| Service Rates | 64 |

---

## ✨ Best Practices

### 1. **Run Tests Before Deployment**
```bash
dotnet test --configuration Release
```

### 2. **Use Continuous Integration**
Integrate with GitHub Actions, Azure DevOps, or Jenkins

### 3. **Generate Fresh Data Each Run**
Tests automatically clean up after completion

### 4. **Validate Database Integrity**
Review the comprehensive summary output after each run

### 5. **Monitor Collection Rates**
Review billing payment status distribution for business insights

---

## 📚 API Endpoints to Test (Manual)

Once tests populate the database, test these endpoints manually:

```bash
# Get patients
curl http://localhost:7000/api/patients

# Get appointments
curl http://localhost:7000/api/appointments

# Get doctors
curl http://localhost:7000/api/doctors

# Get billing
curl http://localhost:7000/api/billings

# Create new appointment
curl -X POST http://localhost:7000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": 1,
    "doctorId": "doctor-uuid",
    "appointmentDate": "2025-04-15",
    "startTime": "10:00:00",
    "endTime": "11:00:00",
    "visitType": "OPD"
  }'
```

---

## 📞 Support

For issues or questions:

1. Check log files in `logs/` folder
2. Review test output for detailed error messages
3. Refer to individual test assertions
4. Consult [README.md](../../README.md) for project setup

---

## 📄 Files Included

```
HMS.IntegrationTests/
├── HMS.IntegrationTests.csproj
├── appsettings.test.json
├── seed_integration_test_data.sql          # SQL seed script
├── TestData/
│   ├── DepartmentDataGenerator.cs
│   ├── DoctorDataGenerator.cs
│   ├── DoctorServiceRateDataGenerator.cs
│   ├── PatientDataGenerator.cs
│   ├── AppointmentDataGenerator.cs
│   ├── BillingDataGenerator.cs
│   └── TestDataGenerator.cs                # Main orchestrator
├── Fixtures/
│   ├── HmsWebApplicationFactory.cs         # Test server setup
│   └── IntegrationTestFixture.cs           # Shared test fixture
└── Tests/
    ├── IntegrationTestBase.cs
    ├── AppointmentIntegrationTests.cs      # 9 test cases
    ├── BillingIntegrationTests.cs          # 11 test cases
    └── DataIntegrityIntegrationTests.cs    # 13 test cases
```

---

## ✅ Checklist Before Deployment

- [ ] All tests passing (32/32)
- [ ] Database contains 50+ appointments
- [ ] Billing matches appointment counts
- [ ] Foreign key integrity verified
- [ ] Payment status distribution realistic
- [ ] Doctor-specific pricing validated
- [ ] No data anomalies detected
- [ ] Collection rate reviewed

---

**Last Updated:** March 31, 2025  
**Test Framework:** xUnit + WebApplicationFactory  
**Database:** PostgreSQL 14+  
**ORM:** Entity Framework Core 8.0
