# HMS Database Rules (Global Standards)

## 1. Core Principle

* Database must support modular architecture
* Each module must have its own tables
* Shared data must be in core tables

---

## 2. Table Structure Rules

* Use snake_case for all table and column names

* Table names must be plural:

  * patients
  * appointments
  * lab_orders

* Each table must include:

  * id (primary key)
  * created_at
  * updated_at

Optional:

* created_by
* updated_by

---

## 3. Primary Key Rule

* Use UUID or auto-increment integer
* Prefer UUID for scalable systems

Example:

* id (UUID)

---

## 4. Foreign Key Rules

* Use standard naming:

  * patient_id
  * doctor_id
  * user_id

* Always define relationships clearly

* Avoid orphan records

---

## 5. Core Tables (Shared Across Modules)

These tables must always exist:

* patients
* users
* doctors
* departments
* master_data (optional for dropdowns)

Rules:

* These tables must NOT depend on feature modules
* All modules can reference these tables

---

## 6. Module-Based Tables

Each module must have separate tables:

### OPD Module:

* visits
* consultations

### Appointment Module:

* appointments

### Billing Module:

* bills
* bill_items

### Lab Module:

* lab_orders
* lab_results

### Pharmacy Module:

* prescriptions
* pharmacy_sales

Rules:

* Do NOT mix module data in one table
* Each module owns its tables

---

## 7. Data Separation Rule

* Do not store unrelated data in same table

* Avoid columns like:

  * opd_status
  * lab_status
    in patients table

* Keep patient table clean

---

## 8. JSON Usage Rule

* Avoid storing structured data in JSON unless necessary
* Use JSON only for:

  * logs
  * flexible metadata

---

## 9. Indexing Rules

* Add indexes for:

  * mobile (patients)
  * patient_id (all module tables)
  * created_at (for sorting)

* Use unique index for:

  * patient mobile number

---

## 10. Duplicate Prevention

* Prevent duplicate patients:

  * Unique constraint on mobile
  * Optional: name + dob combination

---

## 11. UHID Rule

* Each patient must ha
