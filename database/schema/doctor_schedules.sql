-- Doctor Schedules Table
CREATE TABLE doctor_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT check_day_of_week CHECK (day_of_week BETWEEN 0 AND 6)
);

CREATE INDEX idx_doctor_schedule ON doctor_schedules(doctor_id, day_of_week);
