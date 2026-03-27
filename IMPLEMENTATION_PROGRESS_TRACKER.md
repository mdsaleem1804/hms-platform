# HMS Platform - Implementation Progress Tracker

## Purpose
This document provides a high-level progress summary of what has been implemented so far across screens, field coverage, and end-to-end user functionality.

## Overall Delivery Snapshot
- Core patient management flow: Completed
- Core appointment management flow: Completed
- Department and doctor quick-add flow inside appointment booking: Completed
- Unified create/edit appointment experience: Completed
- Human-friendly appointment edit URL (number-based): Completed
- Real-time hospital dashboard with metrics and charts: Completed
- Admin-configurable revenue rates (database-backed): Completed
- Additional hospital modules shown in navigation (future scope): Not yet implemented

## Screens Completed

### 1. Dashboard
- Summary cards: Today's Patients, Today's Appointments, Revenue Today
- Appointment status breakdown chart (Scheduled, Completed, Cancelled, etc.)
- Daily trends chart (patients and appointments over configurable day range)
- Revenue Today calculated from appointment visit types × admin-set rates
- Revenue Rate Settings panel — edit per-visit-type rates inline and save without code deployment
- Auto-refresh every 60 seconds
- Responsive layout (cards stack on mobile)

### 2. Patient List Screen
- Search patients
- Filter by gender and status
- Paginated results
- Add patient action
- Row actions:
  - View patient profile
  - Edit patient record
  - Start appointment booking for a selected patient
- Export options:
  - CSV export
  - PDF export
  - Print-friendly output

### 3. Patient Registration Screen
- Full multi-section patient intake form
- Tab-based sections for better data entry flow
- Save and cancel actions

### 4. Patient Edit Screen
- Loads existing patient details
- Uses the same unified form as registration
- Supports full updates of all patient sections

### 5. Patient Detail Screen
- Readable patient profile view
- Quick actions to edit patient
- Quick action to start booking an appointment for that patient

### 6. Appointments List Screen
- Appointment listing with core details
- Shows patient, department/doctor, date, and status/priority
- Edit action from each row
- Recently streamlined to hide unnecessary time/token columns in list view

### 7. Book Appointment Screen
- Unified appointment form experience
- Patient prefill supported when launched from patient context
- Department and doctor selection flow
- Reminder setup support

### 8. Edit Appointment Screen
- Uses the same unified appointment form as booking
- Existing appointment values prefilled
- Doctor loading behavior corrected for edit flow
- Uses number-based URL for easier readability

## Field Coverage Implemented

### Patient Form Field Groups

#### Patient Information
- Patient name
- Date of birth
- Auto-calculated age
- Gender
- Blood group
- Mobile number
- Email
- Address
- Postal code
- Profile photo
- Active/Inactive status
- ID proof type
- ID proof number

#### Emergency Contact
- Contact name
- Relationship
- Contact number

#### Attender Details
- Name
- Phone
- Address
- ID proof type
- ID proof number

#### Mode of Arrival / Referral Source
- Doctor referral details
- Patient/relative referral options
- Online source options
- Offline source options
- Marketing/referral channel capture (with optional notes)

### Appointment Form Field Groups

#### Appointment Details
- Patient search and selection
- Auto-filled patient ID
- Visit type
- Department selection
- Doctor selection (department-linked)
- Appointment date

#### Status & Priority
- Appointment status
- Priority selection
- Token display (read-only)
- Notes / special instructions

#### Reminder Management
- Add multiple reminders
- Reminder channel selection
- Reminder timing selection
- Remove reminder option

### Quick-Add Modal Fields

#### Add Department
- Department name
- Description

#### Add Doctor
- Doctor name
- Specialization
- Mobile number
- Department

## Functional Capabilities Delivered

### Dashboard & Analytics
- Real-time summary metrics (patients, appointments, revenue) for the current day
- Appointment status breakdown with percentage bars
- Daily patient and appointment trend view (1–30 day window, default 7 days)
- Visit-type-weighted revenue calculation
- Admin-configurable revenue rates per visit type stored in the database
- Seed-on-first-use defaults (Consultation, Follow-up, Check-up, Procedure, Emergency)
- Revenue rates editable via the dashboard UI or `PUT /api/dashboard/revenue-rates`

### Patient Management
- Create patient
- View patient
- Edit patient
- Browse patients with filtering and pagination
- Export and print patient lists

### Appointment Management
- Create appointment
- Edit appointment
- Browse appointments
- Assign doctor by department
- Set status and priority
- Manage appointment reminders
- Date-focused booking flow (without visible start/end time controls)

### Cross-Screen Workflow Enhancements
- Start booking from patient list/details with patient prefill
- Unified create/edit appointment form to reduce maintenance effort
- Improved appointment edit route readability through number-based URLs

## UX and Data Entry Improvements Implemented
- Reusable and consistent form components
- Tabbed forms for large data sets
- Inline validation and user-friendly messages
- Loading and empty-state handling
- Success and failure feedback notifications
- Quick actions available directly in list screens

## Current Scope Boundary
The left navigation includes many additional hospital modules (for example OPD, IPD, Pharmacy, Lab, Radiology, Billing, Reports, etc.), but these are currently navigation placeholders and are not yet built as active functional screens.

## Recent Milestones (Latest Updates)
- Appointment date timezone bug fixed — centralized safe date helpers (`lib/appointmentDate.ts`)
- Dashboard rebuilt with live backend metrics: summary cards, status chart, daily trends chart
- Revenue Today calculated dynamically from visit-type appointment counts × configurable rates
- Admin revenue rate editor added to dashboard — rates persisted in `revenue_rates` DB table
- `RevenueRate` domain entity, repository, EF Core migration (`AddRevenueRates`) created
- Dashboard API concurrent DbContext query bug fixed (replaced `Task.WhenAll` with sequential `await`)
- Appointment create and edit flows merged into one reusable form experience
- Appointment list simplified by hiding non-essential columns
- Appointment edit URL switched from internal long identifier to number-based route
- Department/doctor linkage and edit-time doctor loading behavior stabilized

## API Endpoints

### Dashboard
- `GET  /api/dashboard/metrics?days=7` — summary, status breakdown, daily trends
- `GET  /api/dashboard/revenue-rates` — current per-visit-type rates
- `PUT  /api/dashboard/revenue-rates` — update rates (body: `{ rates: [{ visitType, rate }] }`)

### Appointments
- `GET  /api/appointments`
- `POST /api/appointments`
- `GET  /api/appointments/{id}`
- `PUT  /api/appointments/{id}`
- `DELETE /api/appointments/{id}`
- `GET  /api/appointments/by-number/{displayId}`

### Patients
- `POST /api/patients`
- `GET  /api/patients`
- `GET  /api/patients/search`
- `GET  /api/patients/{id}`
- `PUT  /api/patients/{id}`
- `DELETE /api/patients/{id}`

### Departments
- `GET  /api/departments`
- `POST /api/departments`
- `GET  /api/departments/{id}`
- `PUT  /api/departments/{id}`
- `DELETE /api/departments/{id}`

### Doctors
- `GET  /api/doctors`
- `POST /api/doctors`
- `GET  /api/doctors/{id}`
- `PUT  /api/doctors/{id}`
- `DELETE /api/doctors/{id}`
- `GET  /api/doctors/by-department/{departmentId}`

## Progress Status Summary
- Patient module: Ready for active use
- Appointment module: Ready for active use
- Department/doctor quick-add in appointment workflow: Ready for active use
- Dashboard with real-time metrics and revenue tracking: Ready for active use
- Admin-configurable revenue rates: Ready for active use
- Remaining hospital modules in sidebar: Pending implementation
