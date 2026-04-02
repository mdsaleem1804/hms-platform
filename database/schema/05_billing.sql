-- OPD Billing Table
CREATE TABLE billings (
  id VARCHAR(50) PRIMARY KEY,
  bill_number VARCHAR(50) NOT NULL UNIQUE,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  appointment_id VARCHAR(50) NULL REFERENCES appointments(id) ON DELETE SET NULL,
  visit_type VARCHAR(50) NOT NULL,
  doctor_id VARCHAR(50) NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
  date DATE NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  discount NUMERIC(12,2) NOT NULL,
  tax NUMERIC(12,2) NOT NULL,
  net_amount NUMERIC(12,2) NOT NULL,
  paid_amount NUMERIC(12,2) NOT NULL,
  payment_mode VARCHAR(20) NOT NULL,
  transaction_id VARCHAR(100) NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_billing_patient ON billings(patient_id);
CREATE INDEX idx_billing_doctor ON billings(doctor_id);
CREATE INDEX idx_billing_date ON billings(date);
