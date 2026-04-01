# Integration Testing Execution Guide

## 📋 Pre-Execution Checklist

Before running the integration tests, verify the following:

### Environment Setup
- [ ] PostgreSQL database is running
- [ ] Connection string in `appsettings.test.json` is correct
- [ ] .NET 8.0 SDK is installed (`dotnet --version`)
- [ ] Test project builds without errors (`dotnet build`)

### Database Preparation
- [ ] Database user has appropriate permissions
- [ ] Migrations can be applied successfully
- [ ] No existing conflicts with test database name

---

## 🚀 Execution Steps

### Step 1: Clean and Build

```bash
# Remove old test artifacts
dotnet clean HMS.IntegrationTests.csproj

# Build the test project
dotnet build HMS.IntegrationTests.csproj
```

**Expected Output:**
```
Build succeeded. 0 Warning(s) ↑
```

### Step 2: Run All Tests with Detailed Output

```bash
dotnet test HMS.IntegrationTests.csproj \
  --no-build \
  -v detailed \
  --logger "console;verbosity=detailed"
```

### Step 3: Monitor Test Execution

During execution, you should see:

```
====================================================
🔧 Initializing integration test environment...
   ✓ Database initialized
   ✓ Test data seeded
   ✓ HTTP client ready

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
```

---

## ✅ Expected Test Results

### Test Count: 33 tests total

#### AppointmentIntegrationTests (9 tests)
```
AppointmentIntegrationTests.CreateAppointment_Should_Successfully_Create_With_Valid_Data PASSED
AppointmentIntegrationTests.GetAppointments_Should_Return_50_Plus_Records PASSED
AppointmentIntegrationTests.Appointments_Should_Have_Varied_Dates PASSED
AppointmentIntegrationTests.Appointments_Should_Have_Different_Visit_Types PASSED
AppointmentIntegrationTests.Appointments_Should_Have_Different_Statuses PASSED
AppointmentIntegrationTests.Appointments_Should_Have_Valid_Doctor_References PASSED
AppointmentIntegrationTests.Appointments_Should_Have_Valid_Patient_References PASSED
AppointmentIntegrationTests.Appointments_Should_Have_Unique_Appointment_Numbers PASSED
AppointmentIntegrationTests.Appointments_Should_Have_Valid_Time_Slots PASSED
```

#### BillingIntegrationTests (11 tests)
```
BillingIntegrationTests.Billings_Count_Should_Match_Appointments PASSED
BillingIntegrationTests.Billings_Should_Have_Valid_Patient_References PASSED
BillingIntegrationTests.Billings_Should_Have_Valid_Doctor_References PASSED
BillingIntegrationTests.Billings_Should_Have_Unique_Bill_Numbers PASSED
BillingIntegrationTests.Billings_Should_Have_Correct_Net_Amount_Calculation PASSED
BillingIntegrationTests.Billings_Should_Have_Valid_Payment_Statuses PASSED
BillingIntegrationTests.Billings_Should_Have_Different_Visit_Types PASSED
BillingIntegrationTests.Doctor_Specific_Pricing_Should_Vary_By_Specialization PASSED
BillingIntegrationTests.Service_Rates_Should_Be_Proportional_To_Consultation PASSED
BillingIntegrationTests.Billings_Should_Have_Amounts_Within_Valid_Range PASSED
BillingIntegrationTests.TaxCalculation_Should_Follow_18_Percent_GST PASSED
```

#### DataIntegrityIntegrationTests (13 tests)
```
DataIntegrityIntegrationTests.Should_Have_At_Least_50_Appointments PASSED
DataIntegrityIntegrationTests.Should_Have_Multiple_Doctors_With_Different_Specializations PASSED
DataIntegrityIntegrationTests.Should_Have_Between_20_And_30_Patients PASSED
DataIntegrityIntegrationTests.All_Patients_Should_Have_Unique_Mobile_Numbers PASSED
DataIntegrityIntegrationTests.All_Patients_Should_Have_Unique_UHIDs PASSED
DataIntegrityIntegrationTests.All_Patients_Should_Have_Valid_Profile_Data PASSED
DataIntegrityIntegrationTests.All_Doctors_Should_Have_Valid_Department_References PASSED
DataIntegrityIntegrationTests.Department_Doctor_Distribution_Should_Be_Even PASSED
DataIntegrityIntegrationTests.All_Appointments_Should_Have_Valid_Relationships PASSED
DataIntegrityIntegrationTests.Appointment_Doctor_Distribution_Should_Be_Fair PASSED
DataIntegrityIntegrationTests.All_Doctor_Service_Rates_Should_Be_Valid PASSED
DataIntegrityIntegrationTests.Foreign_Key_Integrity_Should_Be_Maintained PASSED
DataIntegrityIntegrationTests.Data_Consistency_Summary PASSED
```

### Final Summary Output

```
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
  Total Tests: 33
  Passed: 33
  Failed: 0
  Skipped: 0
  Duration: 2.45 seconds

All tests PASSED ✅
```

---

## 📊 Key Metrics to Verify

### Appointments
- **Count:** ≥ 50 ✅
- **Date Distribution:** 
  - Past: 18-20 appointments
  - Current: 15-18 appointments
  - Future: 18-20 appointments
- **Visit Types:** OPD, Emergency, Follow-up, Teleconsultation (all present)
- **Statuses:** Scheduled, Completed, Cancelled, No-Show (all present)

### Patients
- **Count:** 20-30 (exactly 25) ✅
- **Unique UHIDs:** All unique ✅
- **Unique Mobile Numbers:** All unique ✅
- **Profile Completeness:** All required fields populated ✅

### Doctors
- **Count:** 5-10 (exactly 8) ✅
- **Specializations:** ≥ 5 different specialties ✅
- **Consultation Rates:**
  - Cardiology: ₹800
  - Oncology: ₹1000
  - General Surgery: ₹700
  - Orthopedics: ₹600
  - Neurology: ₹750
  - Gynecology: ₹500
  - ENT: ₹450
  - Pediatrics: ₹400
  - Dermatology: ₹500

### Billings
- **Count:** Matches appointments (56) ✅
- **Payment Status Distribution:**
  - Paid: ~60% (33-35 records)
  - Unpaid: ~20% (10-12 records)
  - Partial: ~20% (10-12 records)
- **Tax Calculation:** 18% GST (≥95% accuracy) ✅
- **Recovery Rate:** 55-65% ✅

### Data Integrity
- **Foreign Keys:** Zero violations ✅
- **Bill Numbers:** All unique ✅
- **Appointment Numbers:** All unique ✅
- **Time Slots:** All valid (EndTime > StartTime) ✅

---

## 🔍 Interpreting Test Results

### ✅ PASSED
- Test assertion succeeded
- Data is valid and consistent
- No action needed

### ❌ FAILED
- Test assertion failed
- Check the failure message for details
- Possible causes:
  - Database connection issue
  - Data generation failure
  - Missing migration
  - Incorrect configuration

**Troubleshooting failed tests:**

```bash
# Run specific failing test with verbose output
dotnet test HMS.IntegrationTests.csproj \
  -k "TestName" \
  -v detailed

# View detailed logs
tail -f logs/test-*.txt
```

### ⏭️ SKIPPED
- Test was skipped (check test attribute)
- Usually indicates optional test or test data not available

---

## 💾 Database State After Tests

After successful test execution:

1. **Test database is automatically cleaned up**
   - All test data is removed
   - Database is dropped or reset

2. **View generated data during test execution:**
   ```bash
   # While tests are running, check counts:
   psql -U postgres -d hms_test_db -c "SELECT COUNT(*) FROM appointments;"
   ```

3. **To preserve test data for inspection:**
   - Comment out cleanup code in `IntegrationTestFixture.cs`
   - Or export data before tests complete

---

## 📈 Performance Benchmarks

Expected execution times (first run includes migrations):

| Phase | Duration |
|-------|----------|
| Test Setup | 2-3 seconds |
| Data Generation | 1-2 seconds |
| Test Execution | 3-5 seconds |
| Cleanup | 1-2 seconds |
| **Total** | **7-12 seconds** |

If tests take significantly longer (>20 seconds):
- Check database performance
- Verify network latency
- Review CPU/memory availability

---

## 🎯 Success Criteria

All of the following must be TRUE:

- [ ] All 33 tests PASS
- [ ] At least 50 appointments generated
- [ ] 25 patients generated
- [ ] 8 doctors with specializations
- [ ] Billing count = Appointment count
- [ ] Zero foreign key violations
- [ ] All unique constraints respected
- [ ] Payment statuses properly distributed
- [ ] Tax calculations accurate (≥95%)
- [ ] Doctor-specific pricing implemented
- [ ] Test execution completes without errors

---

## 📝 Sample Commands & Expected Outputs

### Run Single Test Class
```bash
$ dotnet test HMS.IntegrationTests.csproj -k "AppointmentIntegrationTests"

Results:
  AppointmentIntegrationTests [9s]
    ✓ CreateAppointment_Should_Successfully_Create_With_Valid_Data (248ms)
    ✓ GetAppointments_Should_Return_50_Plus_Records (156ms)
    ✓ Appointments_Should_Have_Varied_Dates (182ms)
    ... (6 more tests)

Passed:  9
Failed:  0
Duration: 1.3s
```

### Run Single Test
```bash
$ dotnet test HMS.IntegrationTests.csproj \
  -k "Should_Have_At_Least_50_Appointments"

Starting test execution, please wait...
✓ Generated 56 appointments (minimum requirement: 50)

Passed:  1
Failed:  0
Duration: 1.8s
```

### Capture Full Output to File
```bash
dotnet test HMS.IntegrationTests.csproj -v detailed > test_results.txt 2>&1

# View results
cat test_results.txt | grep -E "PASSED|FAILED|Summary"
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Connection refused"
```
Error: Could not connect to server: Connection refused
```

**Solution:**
```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Verify connection
psql -U postgres -c "SELECT 1"

# Update connection string if needed
```

### Issue 2: "Timeout waiting for database"
```
Timeout waiting for server startup...
```

**Solution:**
```bash
# Increase timeout in Platform.Framework
# Create test database manually:
createdb hms_test_db
```

### Issue 3: "Foreign key constraint violation"
```
Error: new row for relation "appointments" violates foreign key constraint
```

**Solution:**
- Tests handle this automatically
- If manual seeding: ensure doctors exists before appointments

### Issue 4: "Build failed"
```
Error CS0234: The type or namespace name 'Application' does not exist
```

**Solution:**
```bash
# Restore NuGet packages
dotnet restore HMS.IntegrationTests.csproj

# Rebuild solution
dotnet build HMS.IntegrationTests.csproj
```

---

## 📞 Test Support Resources

1. **Test Output Logs:**
   ```bash
   # Check console output
   tail -100 logs/test-*.txt
   
   # View application logs
   tail -100 logs/HMS.API*.txt
   ```

2. **Database Inspection:**
   ```sql
   -- Check test data
   SELECT COUNT(*) FROM appointments WHERE created_at > NOW() - INTERVAL '5 minutes';
   
   -- Review failed billings
   SELECT * FROM billings WHERE net_amount <= 0;
   ```

3. **Debug Single Test:**
   ```bash
   # Run with detailed output
   dotnet test HMS.IntegrationTests.csproj \
     -k "TestName" \
     --diag diag.log
   ```

---

## ✨ Next Steps After Successful Tests

1. **Review Data Quality**
   - Check data in pgAdmin or DBeaver
   - Verify business logic is reflected

2. **Manual API Testing**
   - Test endpoints with generated data
   - Verify response structures

3. **Performance Testing**
   - Load test with scaled data (500+ appointments)
   - Monitor query performance

4. **Documentation**
   - Document API contracts
   - Create postman collections

---

**Document Version:** 1.0  
**Last Updated:** March 31, 2025  
**Test Framework:** xUnit + WebApplicationFactory  
**Status:** Ready for Production Testing
