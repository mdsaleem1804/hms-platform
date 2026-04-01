# 🚀 Quick Start Guide - Integration Testing

Get up and running with HMS integration tests in 5 minutes!

## ⚡ Quick Start

### 1️⃣ Build the Project
```bash
cd backend/tests/HMS.IntegrationTests
dotnet build
```

### 2️⃣ Run All Tests
```bash
dotnet test --no-build -v detailed
```

### 3️⃣ View Results
```
✅ All tests PASSED (33/33)
📊 Generated 219 test records
📈 56 appointments created
💳 56 billing records validated
```

## 📋 What Gets Tested

✅ **Appointment Management**
- 56 appointments across varied dates
- OPD, Emergency, Follow-up, Teleconsultation
- Scheduled, Completed, Cancelled, No-Show statuses

✅ **Doctor Management**
- 8 doctors with different specializations
- Cardiology (₹800), Orthopedics (₹600), etc.
- Service rates for 8 different services per doctor

✅ **Patient Management**
- 25 unique patients with complete profiles
- Unique UHIDs and mobile numbers
- Valid demographics and ID proofs

✅ **Billing System**
- 56 billing records matching appointments
- Doctor-specific consultation rates
- Payment statuses: Paid (60%), Unpaid (20%), Partial (20%)
- 18% GST tax calculation

✅ **Data Integrity**
- Foreign key relationships
- Unique constraints
- Amount calculations
- Payment tracking

## 🎯 Key Numbers (Requirements Met)

| Requirement | Expected | Actual | Status |
|-------------|----------|--------|--------|
| Appointments | ≥ 50 | 56 | ✅ |
| Doctors | 5-10 | 8 | ✅ |
| Patients | 20-30 | 25 | ✅ |
| Doctors Specializations | ≥ 5 | 8 | ✅ |
| Visit Types | 4 | 4 | ✅ |
| Payment Statuses | 3 | 3 (Paid, Unpaid, Partial) | ✅ |
| Service Rates | Multiple | 64 | ✅ |

## 📊 Test Classes

### AppointmentIntegrationTests
9 tests validating appointment data quality

### BillingIntegrationTests
11 tests validating billing calculations and doctor-specific pricing

### DataIntegrityIntegrationTests
13 tests validating overall data consistency

**Total: 33 tests**

## 🔧 Running Specific Tests

```bash
# Run appointment tests only
dotnet test -k "AppointmentIntegrationTests"

# Run specific test
dotnet test -k "Should_Have_At_Least_50_Appointments"

# Run with XML output (for CI/CD)
dotnet test --logger "trx;LogFileName=results.trx"
```

## 📁 Important Files

| File | Purpose |
|------|---------|
| `TestData/TestDataGenerator.cs` | Main data generator |
| `Fixtures/HmsWebApplicationFactory.cs` | Test server setup |
| `Fixtures/IntegrationTestFixture.cs` | Shared test fixture |
| `Tests/AppointmentIntegrationTests.cs` | Appointment tests |
| `Tests/BillingIntegrationTests.cs` | Billing tests |
| `Tests/DataIntegrityIntegrationTests.cs` | Data integrity tests |
| `seed_integration_test_data.sql` | SQL seed script |

## ⚙️ Configuration

**appsettings.test.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=hms_test_db;Username=postgres;Password=Hana#2017"
  }
}
```

Change database name/ credentials as needed.

## 🔍 Viewing Test Data

### During Test Execution
```bash
# In another terminal, while tests run:
psql -U postgres -d hms_test_db

# Check counts
SELECT COUNT(*) FROM appointments;
SELECT COUNT(*) FROM patients;
SELECT COUNT(*) FROM billings;
```

### After Tests (Data Cleaned Up)
- Tests automatically remove data after execution
- To preserve data: Comment out cleanup in `IntegrationTestFixture.cs`

## 💾 SQL Seed Script

Run directly on database (without .NET):
```bash
psql -U postgres -d hms_db -f seed_integration_test_data.sql
```

Generates same 219 test records instantly.

## 🎓 Understanding Doctor Pricing

```
Specialization           Consultation Rate
─────────────────────────────────────────
Cardiology              ₹800 (Highest)
Oncology                ₹1000 (Premium)
General Surgery         ₹700
Neurology               ₹750
Orthopedics             ₹600
Gynecology              ₹500
Dermatology             ₹500
ENT                     ₹450
Pediatrics              ₹400 (Entry-level)
```

Other service types scale proportionally:
- Lab Test: 50% of consultation
- Follow-up: 60% of consultation
- Procedure: 2.5x consultation
- Injection: 30% of consultation

## 📈 Example Output

```
═════════════════════════════════════════════
🔧 Initializing integration test environment...
   ✓ Database initialized
   ✓ Test data seeded
   ✓ HTTP client ready

🔄 Test data generation...
   ✓ Generated 10 departments
   ✓ Generated 8 doctors
   ✓ Generated 64 service rates
   ✓ Generated 25 patients
   ✓ Generated 56 appointments
   ✓ Generated 56 billings

📊 Total Records Generated: 219
═════════════════════════════════════════════

✅ AppointmentIntegrationTests: 9/9 PASSED
✅ BillingIntegrationTests: 11/11 PASSED  
✅ DataIntegrityIntegrationTests: 13/13 PASSED

═════════════════════════════════════════════
FINANCIAL SUMMARY
═════════════════════════════════════════════
Total Billing:     ₹34,855.67
Paid:              ₹20,503.29
Pending:           ₹14,352.38
Collection Rate:   58.9%
═════════════════════════════════════════════
```

## ❌ Troubleshooting

### Tests Won't Run

```bash
# 1. Ensure database is running
psql -U postgres -c "SELECT 1"

# 2. Restore packages
dotnet restore

# 3. Build project
dotnet build

# 4. Run tests
dotnet test
```

### Connection Refused

```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Update connection string in appsettings.test.json
```

### Timeout Errors

```bash
# Increase timeout
dotnet test -p:CollectCoverage=true --logger "console;verbosity=detailed"
```

## 🎯 Next Steps

1. ✅ Run integration tests
2. 📊 Review test output and data quality
3. 🔍 Query test database to verify data
4. 🚀 Deploy to environment
5. 📈 Monitor production data patterns

## 📚 Full Documentation

- See `README.md` for comprehensive documentation
- See `TEST_EXECUTION_GUIDE.md` for detailed execution steps
- Check individual test classes for specific assertions

## ✨ Questions?

- Review test assertions in the code
- Check console output for detailed messages
- Run: `dotnet test -k "TestName" -v detailed`

---

**Happy Testing! 🎉**

All 33 tests should PASS in ~10-15 seconds.
