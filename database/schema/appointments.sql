-- Appointments Table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_no VARCHAR(50) NOT NULL UNIQUE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  token_number INT,
  status VARCHAR(50) DEFAULT 'Scheduled',
  visit_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointment_doctor_date ON appointments(doctor_id, appointment_date);
CREATE INDEX idx_appointment_status ON appointments(status);
CREATE INDEX idx_appointment_patient ON appointments(patient_id);
