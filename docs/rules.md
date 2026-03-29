# HMS Project Rules (Global Standards)

## 1. Core Principles

* Build for real hospital usage (fast, simple, reliable)
* Avoid unnecessary complexity
* Prioritize usability for receptionist and doctors
* Every feature must reduce manual work

---

## 2. Architecture Guidelines

* Follow modular structure:

  * patients
  * appointments
  * billing
  * doctors
  * master data

* Each module must be independent but connected via IDs

* Use layered architecture:

  * UI (frontend)
  * API (backend)
  * Database (storage)

---

## 3. Naming Conventions

### Database:

* Use snake_case
* Example:

  * patient_id
  * created_at

### API:

* Use RESTful naming
* Example:

  * POST /patients
  * GET /patients/:id

### Frontend:

* Use camelCase
* Example:

  * firstName
  * mobileNumber

---

## 4. Database Rules

* Use separate tables for:

  * patients
  * visits
  * appointments
  * billing

* Avoid storing everything in one table

* Always use foreign keys:

  * patient_id
  * doctor_id

* Add timestamps:

  * created_at
  * updated_at

---

## 5. Form Design Rules

* Use section-based forms
* Keep forms short and fast
* Required fields must be minimal
* Use dropdowns instead of free text where possible
* Group related fields together

---

## 6. UI/UX Rules

* Follow clean and minimal design (Zoho/Odoo style)

* Use consistent spacing and alignment

* Use 2-column layout for desktop

* Use single column for mobile

* Buttons:

  * Primary → Save
  * Secondary → Cancel

* Avoid clutter and excessive colors

---

## 7. Validation Rules

* Validate on both frontend and backend
* Show clear error messages
* Avoid blocking user unnecessarily
* Use inline validation

---

## 8. Performance Rules

* Avoid unnecessary API calls
* Use pagination for large lists
* Optimize queries
* Lazy load heavy components

---

## 9. Data Integrity Rules

* Prevent duplicate patients (mobile number)
* Use unique identifiers (UHID)
* Maintain referential integrity

---

## 10. Audit & Logging

* Track important actions:

  * patient created
  * appointment booked
  * bill generated

* Store:

  * user_id
  * timestamp
  * action

---

## 11. Security Rules

* Validate all inputs
* Do not expose sensitive data
* Use authentication and authorization
* Protect APIs

---

## 12. Error Handling

* Do not show raw errors to users
* Show friendly messages
* Log detailed errors internally

---

## 13. Reusability

* Create reusable components:

  * Input
  * Select
  * Table
  * Modal

* Avoid duplicate code

---

## 14. Responsiveness

* Must work on:

  * Desktop
  * Tablet
  * Mobile

* No horizontal scrolling

---

## 15. Development Workflow

* Build UI first (with structure)

* Then connect API

* Then integrate database

* Test each module independently

---

## 16. Scalability

* Design for future expansion:

  * Multi-doctor
  * Multi-branch
  * Reports

* Avoid hardcoding values

---

## 17. Documentation

* Maintain docs for each module:

  * patients.md
  * appointments.md
  * billing.md

* Keep documentation simple and updated

---

## 18. Final Rule

Every feature must answer:

"Does this make hospital work faster and easier?"

If not, rethink the design.

## 19. Modular Architecture Rule

* The system must support modular deployment
* Each module must be independently usable

### Core Module:

* patients
* users
* doctors

### Feature Modules:

* opd
* ipd
* lab
* pharmacy
* billing

### Rules:

* Modules must not directly depend on each other
* Communication only via IDs (e.g., patient_id)
* Each module must have its own database tables
* UI must hide disabled modules
* Routes must be modular (/opd, /lab, etc.)

### Goal:

System should allow selling modules independently or bundled

## 20. Layout & Spacing Rules

* Sidebar and content must be tightly aligned (no large gaps)

* Avoid excessive padding (no p-10, no mx-auto for main layout)

* Use:

  * p-4 or p-6 for containers
  * gap-4 for grids
  * space-y-4 for sections

* Forms must not look floating

* Use full-width layout inside content area

---

## 21. Edit Window Rule

* Editing is allowed only for records created today
* This rule must be enforced in backend update logic for security
* Frontend must disable edit actions for records outside the allowed window
* Frontend edit pages must block direct URL access for records outside the allowed window
* Admin and Super Admin exception will be implemented in a later phase

---

## 22. Sidebar Rules

* Sidebar must support collapse/expand

* Expanded width: ~240px (w-60 or w-64)

* Collapsed width: ~64px (w-16)

* When collapsed:

  * Show icons only
  * Show tooltip on hover

* Must have smooth transition

---

## 23. File Upload Rules

* Patient form must support profile photo upload
* Show image preview instantly
* Use circular preview (rounded-full)
* File upload is optional

---

## 24. Form Density Rule

* Forms must be compact and efficient
* Avoid excessive spacing between fields
* Aim for fast data entry (<30 seconds)

---

## 25. Mode of Arrival UX Rule

* Do NOT replicate paper form UI directly

* Use:

  * Dropdown for type
  * Dynamic fields

* Keep UI minimal and fast

* Avoid multiple checkboxes

---

## 26. Layout Consistency

* All pages must follow same layout:

  * Sidebar + Content (flex)
  * No centered narrow containers
  * Use full available width

* Maintain consistent padding across pages
