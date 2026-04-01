-- =====================================================================
-- HMS Platform - Integration Test Data Seed Script
-- Generates 50+ realistic test records for E2E testing
-- =====================================================================
-- Database: hms_db (or hms_test_db)
-- Execution: psql -U postgres -d hms_db -f seed_integration_test_data.sql
-- =====================================================================

-- Clear existing test data (optional - comment out for incremental adding)
-- DELETE FROM billings;
-- DELETE FROM appointments;
-- DELETE FROM doctor_service_rates;
-- DELETE FROM doctors;
-- DELETE FROM patients;
-- DELETE FROM departments;

-- =====================================================================
-- 1. DEPARTMENTS (10 records)
-- =====================================================================
INSERT INTO departments (id, name, description, created_by, updated_by, created_at, updated_at, is_deleted)
VALUES
  (gen_random_uuid(), 'Cardiology', 'Heart and cardiac diseases', 'system', 'system', NOW(), NOW(), false),
  (gen_random_uuid(), 'Orthopedics', 'Bone and joint disorders', 'system', 'system', NOW(), NOW(), false),
  (gen_random_uuid(), 'Neurology', 'Nervous system disorders', 'system', 'system', NOW(), NOW(), false),
  (gen_random_uuid(), 'Pediatrics', 'Child health and development', 'system', 'system', NOW(), NOW(), false),
  (gen_random_uuid(), 'Gynecology', 'Womens health and reproductive system', 'system', 'system', NOW(), NOW(), false),
  (gen_random_uuid(), 'General Surgery', 'Surgical procedures and treatments', 'system', 'system', NOW(), NOW(), false),
  (gen_random_uuid(), 'ENT', 'Ear, Nose and Throat disorders', 'system', 'system', NOW(), NOW(), false),
  (gen_random_uuid(), 'Dermatology', 'Skin diseases and conditions', 'system', 'system', NOW(), NOW(), false),
  (gen_random_uuid(), 'Psychiatry', 'Mental health and behavioral disorders', 'system', 'system', NOW(), NOW(), false),
  (gen_random_uuid(), 'Oncology', 'Cancer treatment and research', 'system', 'system', NOW(), NOW(), false)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- 2. DOCTORS (8 records) - One per specialization (with some departments having multiple)
-- =====================================================================
INSERT INTO doctors (id, name, specialization, mobile, department_id, created_by, updated_by, created_at, updated_at, is_deleted)
SELECT 
  gen_random_uuid(),
  spec,
  spec,
  LPAD((RANDOM() * 8999999999 + 1000000000)::BIGINT::TEXT, 10, '0'),
  (SELECT id FROM departments WHERE name = spec LIMIT 1),
  'system',
  'system',
  NOW() - INTERVAL '30 days',
  NOW(),
  false
FROM (VALUES
  ('Dr. Rajesh Kumar', 'Cardiology'),
  ('Dr. Anjali Sharma', 'Orthopedics'),
  ('Dr. Vikram Singh', 'Neurology'),
  ('Dr. Priya Patel', 'Pediatrics'),
  ('Dr. Monica Gupta', 'Gynecology'),
  ('Dr. Arjun Desai', 'General Surgery'),
  ('Dr. Kavya Nair', 'ENT'),
  ('Dr. Suresh Reddy', 'Dermatology')
) AS doctors(name, spec)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- 3. DOCTOR SERVICE RATES (8 doctors × 8 services = 64 rates)
-- =====================================================================
INSERT INTO doctor_service_rates (id, doctor_id, service_name, service_description, rate, is_active, effective_from, created_at, updated_at, is_deleted)
SELECT
  gen_random_uuid(),
  d.id,
  service.name,
  service.name || ' service by ' || d.name,
  CASE 
    WHEN service.name = 'Consultation' THEN
      CASE d.specialization
        WHEN 'Cardiology' THEN 800
        WHEN 'Orthopedics' THEN 600
        WHEN 'Neurology' THEN 750
        WHEN 'Pediatrics' THEN 400
        WHEN 'Gynecology' THEN 500
        WHEN 'General Surgery' THEN 700
        WHEN 'ENT' THEN 450
        WHEN 'Dermatology' THEN 500
        ELSE 500
      END
    WHEN service.name = 'Lab Test' THEN (
      CASE d.specialization
        WHEN 'Cardiology' THEN 800
        WHEN 'Orthopedics' THEN 600
        WHEN 'Neurology' THEN 750
        WHEN 'Pediatrics' THEN 400
        WHEN 'Gynecology' THEN 500
        WHEN 'General Surgery' THEN 700
        WHEN 'ENT' THEN 450
        WHEN 'Dermatology' THEN 500
        ELSE 500
      END
    ) * 0.5
    WHEN service.name = 'X-Ray' THEN (
      CASE d.specialization
        WHEN 'Cardiology' THEN 800
        WHEN 'Orthopedics' THEN 600
        WHEN 'Neurology' THEN 750
        WHEN 'Pediatrics' THEN 400
        WHEN 'Gynecology' THEN 500
        WHEN 'General Surgery' THEN 700
        WHEN 'ENT' THEN 450
        WHEN 'Dermatology' THEN 500
        ELSE 500
      END
    ) * 0.8
    WHEN service.name = 'Ultrasound' THEN (
      CASE d.specialization
        WHEN 'Cardiology' THEN 800
        WHEN 'Orthopedics' THEN 600
        WHEN 'Neurology' THEN 750
        WHEN 'Pediatrics' THEN 400
        WHEN 'Gynecology' THEN 500
        WHEN 'General Surgery' THEN 700
        WHEN 'ENT' THEN 450
        WHEN 'Dermatology' THEN 500
        ELSE 500
      END
    ) * 0.9
    WHEN service.name = 'ECG' THEN (
      CASE d.specialization
        WHEN 'Cardiology' THEN 800
        WHEN 'Orthopedics' THEN 600
        WHEN 'Neurology' THEN 750
        WHEN 'Pediatrics' THEN 400
        WHEN 'Gynecology' THEN 500
        WHEN 'General Surgery' THEN 700
        WHEN 'ENT' THEN 450
        WHEN 'Dermatology' THEN 500
        ELSE 500
      END
    ) * 0.6
    WHEN service.name = 'Follow-up Consultation' THEN (
      CASE d.specialization
        WHEN 'Cardiology' THEN 800
        WHEN 'Orthopedics' THEN 600
        WHEN 'Neurology' THEN 750
        WHEN 'Pediatrics' THEN 400
        WHEN 'Gynecology' THEN 500
        WHEN 'General Surgery' THEN 700
        WHEN 'ENT' THEN 450
        WHEN 'Dermatology' THEN 500
        ELSE 500
      END
    ) * 0.6
    WHEN service.name = 'Procedure' THEN (
      CASE d.specialization
        WHEN 'Cardiology' THEN 800
        WHEN 'Orthopedics' THEN 600
        WHEN 'Neurology' THEN 750
        WHEN 'Pediatrics' THEN 400
        WHEN 'Gynecology' THEN 500
        WHEN 'General Surgery' THEN 700
        WHEN 'ENT' THEN 450
        WHEN 'Dermatology' THEN 500
        ELSE 500
      END
    ) * 2.5
    WHEN service.name = 'Injection' THEN (
      CASE d.specialization
        WHEN 'Cardiology' THEN 800
        WHEN 'Orthopedics' THEN 600
        WHEN 'Neurology' THEN 750
        WHEN 'Pediatrics' THEN 400
        WHEN 'Gynecology' THEN 500
        WHEN 'General Surgery' THEN 700
        WHEN 'ENT' THEN 450
        WHEN 'Dermatology' THEN 500
        ELSE 500
      END
    ) * 0.3
    ELSE 500
  END::NUMERIC(12,2) AS rate,
  d.id,
  service.name
FROM doctors d
CROSS JOIN (
  VALUES 
    ('Consultation'),
    ('Lab Test'),
    ('X-Ray'),
    ('Ultrasound'),
    ('ECG'),
    ('Follow-up Consultation'),
    ('Procedure'),
    ('Injection')
) service(name)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- 4. PATIENTS (25 records) - Unique UHIDs, Mobiles, and valid data
-- =====================================================================
INSERT INTO patients (id, uhid, patient_name, dob, gender, blood_group, mobile, email, address, postal_code, 
                     id_proof_type, id_proof_number, status, created_at, updated_at)
VALUES
  (1, 'UH-10001', 'Rajesh Kumar', '1960-05-15'::DATE, 'Male', 'O+', '9876543210', 'rajesh@example.com', '123 Main St, Mumbai', '400001', 'Aadhar', 'AAAA0000AA00A000', 'ACTIVE', NOW() - INTERVAL '40 days', NOW()),
  (2, 'UH-10002', 'Priya Singh', '1975-08-22'::DATE, 'Female', 'A-', '9876543211', 'priya@example.com', '456 Oak Ave, Delhi', '110001', 'Pan', 'ABCPD1234K', 'ACTIVE', NOW() - INTERVAL '35 days', NOW()),
  (3, 'UH-10003', 'Amit Patel', '1980-03-10'::DATE, 'Male', 'B+', '9876543212', 'amit@example.com', '789 Pine Road, Bangalore', '560001', 'Passport', 'K1234567', 'ACTIVE', NOW() - INTERVAL '30 days', NOW()),
  (4, 'UH-10004', 'Neha Sharma', '1988-11-05'::DATE, 'Female', 'AB+', '9876543213', 'neha@example.com', '321 Cedar Lane, Hyderabad', '500001', 'DL', 'DL1234567890123', 'ACTIVE', NOW() - INTERVAL '25 days', NOW()),
  (5, 'UH-10005', 'Vikram Desai', '1965-07-18'::DATE, 'Male', 'O-', '9876543214', 'vikram@example.com', '654 Birch St, Pune', '411001', 'VoterId', 'VID1234567890', 'ACTIVE', NOW() - INTERVAL '20 days', NOW()),
  (6, 'UH-10006', 'Kavya Nair', '1992-12-28'::DATE, 'Female', 'A+', '9876543215', 'kavya@example.com', '987 Elm Street, Chennai', '600001', 'Aadhar', 'BBBB0000BB00B000', 'ACTIVE', NOW() - INTERVAL '15 days', NOW()),
  (7, 'UH-10007', 'Arun Kumar', '1978-04-12'::DATE, 'Male', 'B-', '9876543216', 'arun@example.com', '159 Maple Drive, Kolkata', '700001', 'Pan', 'ABCPL1234K', 'ACTIVE', NOW() - INTERVAL '10 days', NOW()),
  (8, 'UH-10008', 'Anjali Gupta', '1985-09-30'::DATE, 'Female', 'AB-', '9876543217', 'anjali@example.com', '357 Spruce Way, Ahmedabad', '380001', 'Passport', 'M1234567', 'ACTIVE', NOW() - INTERVAL '5 days', NOW()),
  (9, 'UH-10009', 'Suresh Reddy', '1970-01-25'::DATE, 'Male', 'O+', '9876543218', 'suresh@example.com', '852 Ash Court, Jaipur', '302001', 'DL', 'DL2345678901234', 'ACTIVE', NOW(), NOW()),
  (10, 'UH-10010', 'Deepika Mehta', '1990-06-07'::DATE, 'Female', 'A-', '9876543219', 'deepika@example.com', '741 Oak Ridge, Surat', '395001', 'VoterId', 'VID2345678901', 'ACTIVE', NOW(), NOW()),
  (11, 'UH-10011', 'Rohan Singh', '1982-10-14'::DATE, 'Male', 'B+', '9876543220', 'rohan@example.com', '963 Willow Lane, Lucknow', '226001', 'Aadhar', 'CCCC0000CC00C000', 'ACTIVE', NOW(), NOW()),
  (12, 'UH-10012', 'Meera Chopra', '1987-02-19'::DATE, 'Female', 'AB+', '9876543221', 'meera@example.com', '147 Poplar Street, Chandigarh', '160001', 'Pan', 'ABCPM1234K', 'ACTIVE', NOW(), NOW()),
  (13, 'UH-10013', 'Nikhil Yadav', '1972-05-08'::DATE, 'Male', 'O-', '9876543222', 'nikhil@example.com', '258 Dogwood Drive, Nagpur', '440001', 'Passport', 'N1234567', 'ACTIVE', NOW(), NOW()),
  (14, 'UH-10014', 'Pooja Verma', '1989-08-16'::DATE, 'Female', 'A+', '9876543223', 'pooja@example.com', '369 Laurel Court, Indore', '452001', 'DL', 'DL3456789012345', 'ACTIVE', NOW(), NOW()),
  (15, 'UH-10015', 'Sanjay Kumar', '1973-11-22'::DATE, 'Male', 'B-', '9876543224', 'sanjay@example.com', '456 Mahogany Lane, Thane', '400601', 'VoterId', 'VID3456789012', 'ACTIVE', NOW(), NOW()),
  (16, 'UH-10016', 'Ritika Iyer', '1991-03-29'::DATE, 'Female', 'AB-', '9876543225', 'ritika@example.com', '567 Hickory Street, Bhopal', '462001', 'Aadhar', 'DDDD0000DD00D000', 'ACTIVE', NOW(), NOW()),
  (17, 'UH-10017', 'Harsh Trivedi', '1976-07-04'::DATE, 'Male', 'O+', '9876543226', 'harsh@example.com', '678 Sassafras Drive, Pune', '411043', 'Pan', 'ABCPH1234K', 'ACTIVE', NOW(), NOW()),
  (18, 'UH-10018', 'Shruti Mishra', '1993-09-11'::DATE, 'Female', 'A-', '9876543227', 'shruti@example.com', '789 Juniper Lane, Vashi', '400703', 'Passport', 'S1234567', 'ACTIVE', NOW(), NOW()),
  (19, 'UH-10019', 'Manish Jain', '1979-12-17'::DATE, 'Male', 'B+', '9876543228', 'manish@example.com', '890 Cypress Court, Mumbai', '400005', 'DL', 'DL4567890123456', 'ACTIVE', NOW(), NOW()),
  (20, 'UH-10020', 'Ananya Das', '1986-04-23'::DATE, 'Female', 'AB+', '9876543229', 'ananya@example.com', '901 Teakwood Street, Kolkata', '700064', 'VoterId', 'VID4567890123', 'ACTIVE', NOW(), NOW()),
  (21, 'UH-10021', 'Rajesh Singh', '1968-06-10'::DATE, 'Male', 'O-', '9876543230', 'rajeshsingh@example.com', '102 Myrtlewood Drive, Delhi', '110002', 'Aadhar', 'EEEE0000EE00E000', 'ACTIVE', NOW(), NOW()),
  (22, 'UH-10022', 'Divya Kapoor', '1994-01-31'::DATE, 'Female', 'A+', '9876543231', 'divya@example.com', '203 Sandalwood Lane, Bangalore', '560005', 'Pan', 'ABCPD5678K', 'ACTIVE', NOW(), NOW()),
  (23, 'UH-10023', 'Arjun Nair', '1981-08-27'::DATE, 'Male', 'B-', '9876543232', 'arjun@example.com', '304 Logwood Street, Hyderabad', '500005', 'Passport', 'A1234567', 'ACTIVE', NOW(), NOW()),
  (24, 'UH-10024', 'Sonya Pillai', '1988-10-12'::DATE, 'Female', 'AB-', '9876543233', 'sonya@example.com', '405 Rosewood Drive, Chennai', '600005', 'DL', 'DL5678901234567', 'ACTIVE', NOW(), NOW()),
  (25, 'UH-10025', 'Pratik Sharma', '1975-02-20'::DATE, 'Male', 'O+', '9876543234', 'pratik@example.com', '506 Boxwood Lane, Pune', '411044', 'VoterId', 'VID5678901234', 'ACTIVE', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 5. APPOINTMENTS (50+ records) - Varied dates, types, and statuses
-- =====================================================================
DO $$
DECLARE
  doc_id_var UUID;
  pat_id_var BIGINT;
  appt_date DATE;
  start_hr INT;
  counter INT := 1;
  visit_types TEXT[] := ARRAY['OPD', 'Emergency', 'Follow-up', 'Teleconsultation'];
  statuses TEXT[] := ARRAY['Scheduled', 'Completed', 'Cancelled', 'No-Show'];
BEGIN
  FOR i IN 1..56 LOOP
    -- Select a random doctor
    SELECT id INTO doc_id_var FROM doctors ORDER BY RANDOM() LIMIT 1;
    
    -- Select a random patient
    SELECT id INTO pat_id_var FROM patients ORDER BY RANDOM() LIMIT 1;
    
    -- Vary appointment dates: some in past, some in future
    IF i <= 18 THEN
      appt_date := CURRENT_DATE - (RANDOM() * 90)::INT;
    ELSIF i <= 37 THEN
      appt_date := CURRENT_DATE + (RANDOM() * 90)::INT;
    ELSE
      appt_date := CURRENT_DATE + (RANDOM() * 30)::INT;
    END IF;
    
    start_hr := 8 + (RANDOM() * 9)::INT;
    
    INSERT INTO appointments (
      id, appointment_no, patient_id, doctor_id, appointment_date,
      start_time, end_time, token_number, status, visit_type, department,
      priority, notes, created_at, updated_at, is_deleted
    ) VALUES (
      gen_random_uuid(),
      'APT-' || TO_CHAR(appt_date, 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 4, '0'),
      pat_id_var,
      doc_id_var,
      appt_date,
      (start_hr || ':00')::TIME,
      ((start_hr + 1) || ':00')::TIME,
      counter,
      visit_types[(i % 4) + 1],
      statuses[(i % 4) + 1],
      (SELECT name FROM departments LIMIT 1 OFFSET (RANDOM() * 10)::INT),
      CASE WHEN i % 5 = 0 THEN 'Urgent' ELSE 'Normal' END,
      'Routine checkup appointment',
      NOW() - INTERVAL '1 day',
      NOW(),
      false
    );
    
    counter := counter + 1;
  END LOOP;
END $$;

-- =====================================================================
-- 6. BILLINGS (Match appointments, with varied payment statuses)
-- =====================================================================
DO $$
DECLARE
  billing_counter INT := 9001;
  doctor_consultation_rate NUMERIC;
  doc_id_var UUID;
BEGIN
  FOR appt IN SELECT a.id, a.patient_id, a.doctor_id, a.appointment_date, a.visit_type 
              FROM appointments a ORDER BY a.created_at LOOP
    
    -- Get consultation rate for the doctor
    SELECT COALESCE(r.rate, 500::NUMERIC) INTO doctor_consultation_rate
    FROM doctor_service_rates r
    WHERE r.doctor_id = appt.doctor_id 
    AND r.service_name = 'Consultation'
    AND r.is_active = true
    LIMIT 1;
    
    IF doctor_consultation_rate IS NULL THEN
      doctor_consultation_rate := 500;
    END IF;
    
    INSERT INTO billings (
      id, bill_number, patient_id, appointment_id, visit_type, doctor_id,
      date, subtotal, discount, tax, net_amount, paid_amount,
      payment_mode, transaction_id, created_at, updated_at, is_deleted
    ) VALUES (
      gen_random_uuid(),
      'BILL-' || TO_CHAR(appt.appointment_date, 'YYYYMMDD') || '-' || billing_counter,
      appt.patient_id,
      appt.id,
      appt.visit_type,
      appt.doctor_id,
      appt.appointment_date,
      doctor_consultation_rate,
      ROUND(doctor_consultation_rate * (RANDOM() * 0.2), 2), -- 0-20% discount
      ROUND((doctor_consultation_rate - ROUND(doctor_consultation_rate * (RANDOM() * 0.2), 2)) * 0.18, 2), -- 18% GST
      ROUND(doctor_consultation_rate - ROUND(doctor_consultation_rate * (RANDOM() * 0.2), 2) + 
            ROUND((doctor_consultation_rate - ROUND(doctor_consultation_rate * (RANDOM() * 0.2), 2)) * 0.18, 2), 2),
      CASE
        WHEN RANDOM() < 0.6 THEN ROUND(doctor_consultation_rate - ROUND(doctor_consultation_rate * (RANDOM() * 0.2), 2) + 
                                       ROUND((doctor_consultation_rate - ROUND(doctor_consultation_rate * (RANDOM() * 0.2), 2)) * 0.18, 2), 2) -- Full payment (60%)
        WHEN RANDOM() < 0.8 THEN 0 -- Unpaid (20%)
        ELSE ROUND((doctor_consultation_rate - ROUND(doctor_consultation_rate * (RANDOM() * 0.2), 2) + 
                  ROUND((doctor_consultation_rate - ROUND(doctor_consultation_rate * (RANDOM() * 0.2), 2)) * 0.18, 2)) * 0.5, 2) -- Partial (20%)
      END,
      (ARRAY['Cash', 'Card', 'UPI', 'Cheque'])[1 + (RANDOM() * 3)::INT],
      CASE WHEN RANDOM() < 0.6 THEN 'TXN-' || LPAD((RANDOM() * 999999999)::BIGINT::TEXT, 12, '0') ELSE NULL END,
      NOW() - INTERVAL '1 day',
      NOW(),
      false
    );
    
    billing_counter := billing_counter + 1;
  END LOOP;
END $$;

-- =====================================================================
-- VERIFY DATA
-- =====================================================================
SELECT 
  (SELECT COUNT(*) FROM departments) as departments,
  (SELECT COUNT(*) FROM doctors) as doctors,
  (SELECT COUNT(*) FROM doctor_service_rates) as service_rates,
  (SELECT COUNT(*) FROM patients) as patients,
  (SELECT COUNT(*) FROM appointments) as appointments,
  (SELECT COUNT(*) FROM billings) as billings
AS seeding_summary;

-- Show summary statistics
SELECT 
  COUNT(*) as total_billings,
  SUM(net_amount) as total_revenue,
  SUM(paid_amount) as total_collected,
  ROUND(100.0 * SUM(paid_amount) / SUM(net_amount), 1) as collection_rate_percent
FROM billings;

-- Show appointment distribution
SELECT visit_type, COUNT(*) as count
FROM appointments
GROUP BY visit_type
ORDER BY count DESC;

-- Show appointment status distribution
SELECT status, COUNT(*) as count
FROM appointments
GROUP BY status
ORDER BY count DESC;

SELECT 'Data seeding completed successfully!' as message;
