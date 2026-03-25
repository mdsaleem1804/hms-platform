-- Seed Patients
INSERT INTO patients (uhid, first_name, last_name, mobile, date_of_birth, gender)
VALUES
  ('P001', 'Rajesh', 'Kumar', '9876543210', '1985-05-15', 'M'),
  ('P002', 'Priya', 'Singh', '9876543211', '1990-08-22', 'F'),
  ('P003', 'Amit', 'Patel', '9876543212', '1988-12-10', 'M'),
  ('P004', 'Neha', 'Sharma', '9876543213', '1992-03-18', 'F'),
  ('P005', 'Vikram', 'Desai', '9876543214', '1980-07-25', 'M')
ON CONFLICT DO NOTHING;

-- Seed Doctors
INSERT INTO doctors (name, specialization, consultation_fee, is_active)
VALUES
  ('Dr. Sandeep Gupta', 'Cardiology', 500.00, TRUE),
  ('Dr. Anjali Verma', 'Pediatrics', 400.00, TRUE),
  ('Dr. Rohit Sharma', 'Orthopedics', 450.00, TRUE),
  ('Dr. Priya Mishra', 'Neurology', 550.00, TRUE),
  ('Dr. Arun Kumar', 'Dermatology', 350.00, TRUE)
ON CONFLICT DO NOTHING;

-- Seed Doctor Schedules
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration)
SELECT d.id, dow, st, et, 30
FROM doctors d
CROSS JOIN (
  VALUES
    (1, '09:00:00'::TIME, '17:00:00'::TIME),
    (2, '09:00:00'::TIME, '17:00:00'::TIME),
    (3, '09:00:00'::TIME, '17:00:00'::TIME),
    (4, '09:00:00'::TIME, '17:00:00'::TIME),
    (5, '09:00:00'::TIME, '17:00:00'::TIME)
) AS schedule(dow, st, et)
ON CONFLICT DO NOTHING;

-- Seed Appointments
INSERT INTO appointments (appointment_no, patient_id, doctor_id, appointment_date, start_time, end_time, token_number, status, visit_type)
SELECT 
  'APT' || TO_CHAR(NOW(), 'YYYYMM') || LPAD(CAST(ROW_NUMBER() OVER () AS TEXT), 4, '0'),
  p.id,
  d.id,
  CURRENT_DATE + INTERVAL '1 day' * (ROW_NUMBER() OVER () % 7),
  '09:00:00'::TIME + INTERVAL '30 minutes' * (ROW_NUMBER() OVER () % 16),
  '09:30:00'::TIME + INTERVAL '30 minutes' * (ROW_NUMBER() OVER () % 16),
  ROW_NUMBER() OVER (),
  'Scheduled',
  'Consultation'
FROM patients p
CROSS JOIN doctors d
LIMIT 10
ON CONFLICT DO NOTHING;
