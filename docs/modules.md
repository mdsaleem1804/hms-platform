# HMS Platform - Module Overview

## Core Modules

### 1. Patient Module

**Purpose**: Manage patient records and demographics

**Features**:
- Create patient with UHID (Unique Hospital ID)
- Store personal details: Name, DOB, gender, mobile
- Soft delete capability (is_deleted flag)
- Search by UHID or mobile
- Audit trail (created_at, updated_at)

**API Endpoints**:
```
GET    /api/patients              # List all active patients
GET    /api/patients/{id}         # Get patient details
POST   /api/patients              # Create new patient
PUT    /api/patients/{id}         # Update patient info
DELETE /api/patients/{id}         # Soft delete patient
```

**Key Entities**:
- `Patient`: UHID, first name, last name, mobile, DOB, gender
- `PatientDto`: Transfer object for API

**Business Rules**:
- UHID must be unique
- Mobile number should be validated
- Cannot delete patient if appointments exist (referential integrity)

---

### 2. Appointment Module

**Purpose**: Schedule and manage patient appointments

**Features**:
- Schedule appointments with doctor and time slot
- Automatic appointment number generation
- Token number for queue management
- Status tracking (Scheduled, Confirmed, Completed, Cancelled)
- Reschedule/cancel appointments
- Check doctor availability

**API Endpoints**:
```
GET    /api/appointments                    # List all appointments
GET    /api/appointments/{id}               # Get appointment details
GET    /api/appointments/doctor/{docId}    # Appointments for specific doctor
POST   /api/appointments                    # Create appointment
PUT    /api/appointments/{id}               # Reschedule or update
DELETE /api/appointments/{id}               # Cancel appointment
```

**Key Entities**:
- `Appointment`: Appointment number, patient ID, doctor ID, date, time slot, status, visit type
- `AppointmentDto`: Transfer object for API
- `AppointmentStatus` Enum: Scheduled, Confirmed, InProgress, Completed, Cancelled, NoShow

**Business Rules**:
- Cannot book past appointments
- Cannot double-book a doctor's time slot
- Doctor must have availability for the selected date/time
- Appointment confirmation before 24 hours recommended
- Token number auto-increments per day per doctor

**Design Note**:
- Stores `start_time` and `end_time` (not time slot as string)
- Slot duration comes from `doctor_schedules` table
- Future: Implement slot availability calculation engine

---

### 3. Visit/Encounter Module (Future Enhancement)

**Purpose**: Record patient encounters and visits

**Features**:
- Create visit record at registration
- Link visit to appointment (if available)
- Store consultation notes
- Record vitals (future)
- Store prescriptions (future)

**Key Entities**:
- `Visit`: Appointment link, patient, doctor, visit date, status, notes
- `VisitDto`: Transfer object

**API Endpoints** (Future):
```
POST   /api/visits                      # Create new visit
GET    /api/visits/patient/{patientId}  # Patient visit history
PUT    /api/visits/{id}                 # Update visit notes
```

**Design Note**:
- Visit can exist without appointment (walk-ins)
- Multiple visits per appointment (follow-ups)

---

### 4. Billing Module (Future Enhancement)

**Purpose**: Manage invoices and payments

**Features**:
- Generate invoice after visit completion
- Track payment status
- Support multiple payment modes (Cash, Card, Insurance)
- Generate reports and analytics
- Handle refunds

**Key Entities**:
- `Invoice`: Appointment link, amount, payment status, dates
- `Payment`: Transaction record, mode, amount
- `InvoiceDto`: DTO for API

**API Endpoints** (Future):
```
POST   /api/invoices                    # Create invoice
GET    /api/invoices/{id}               # Get invoice details
POST   /api/payments                    # Record payment
GET    /api/invoices/patient/{patientId} # Patient invoices
```

**Business Rules**:
- Invoice copies consultation fee from doctor
- Can only invoice completed appointments
- Payment reconciliation for accounting

---

### 5. Notification Module (Future Enhancement)

**Purpose**: Send notifications to patients and doctors

**Features**:
- WhatsApp appointment confirmations/reminders
- SMS notifications
- Email digests
- In-app notifications
- Notification preferences management

**Key Entities**:
- `NotificationTemplate`: Message templates
- `NotificationLog`: History of sent notifications
- `NotificationPreference`: User preferences

**Business Rules**:
- Send appointment reminder 24 hours before
- Send WhatsApp confirmation after booking
- Respect user preferences (opt-in/opt-out)
- Track delivery status (sent, delivered, failed)

**Integration**:
- **WhatsApp API**: Twilio or AWS SNS
- **SMS API**: Twilio
- **Email**: SMTP or SendGrid

---

## Doctor Module (Supporting)

**Purpose**: Manage doctor profiles and availability

**Features**:
- Doctor master data (name, specialization, fees)
- Working hours and availability
- Activate/deactivate doctors
- Consultation fee management

**Key Entities**:
- `Doctor`: Name, specialization, consultation fee, is_active
- `DoctorSchedule`: Day of week, start/end time, slot duration

**API Endpoints** (Implied):
```
GET    /api/doctors                          # List active doctors
GET    /api/doctors/{id}                     # Get doctor details
GET    /api/doctors/{id}/availability/{date} # Check availability
```

---

## Data Model Relationships

```
Patient (1) ──────→ (N) Appointment
             └─── (1) ─→ Doctor
             └─── (1) ─→ DoctorSchedule

Appointment ──→ Visit (1:N relationships for follow-ups)
                └─→ Invoice (1:N for billing history)
                └─→ NotificationLog (1:N notifications sent)
```

---

## Future Modules

### 6. Prescription Module
- Store prescriptions created during visits
- Link to medications database
- Generate PDF prescriptions

### 7. Lab/Imaging Module
- Request lab tests or imaging
- Link to external lab systems
- Store results

### 8. Insurance Module
- Insurance claim management
- Integration with insurance providers
- Benefits verification

### 9. Analytics Module
- Dashboard for hospital KPIs
- Doctor performance metrics
- Patient demographics analysis
- Revenue reports

### 10. Administrator Module
- User management
- Role-based access control
- Audit logs
- System settings

---

## Module Dependencies

```
Patient (Independent)
    ↓
Appointment (Depends on Patient, Doctor)
    ↓
Visit (Depends on Appointment, Patient, Doctor)
    ↓
Billing (Depends on Visit, Appointment)
    ↓
Notification (Depends on Patient, Appointment, Visit)
```

---

## Design Principles Applied

✅ **Feature-Based Structure**: Each module is independent  
✅ **Separation of Concerns**: Controllers → Services → Repositories  
✅ **Microservice-Ready**: UUID keys, independent backends possible  
✅ **Scalable Database**: Proper normalization and indexing  
✅ **Extensible Architecture**: Easy to add new modules  
✅ **Clean Code**: Type-safe, well-documented, tested  

---

