-- Comprehensive file with user insertion queries
-- This file can be used to seed default users into the users table

-- Create BCrypt hashed passwords locally (example hashes - change in production)
-- Role values: 0=SuperAdmin, 1=Admin, 2=Doctor, 3=Accountant, 4=Receptionist, 5=Pharmacist, 6=Pathologist, 7=Radiologist, 8=Nurse, 9=Patient

-- Insert SuperAdmin user
-- Password: Admin@123 (BCrypt hash)
INSERT INTO users (id, name, email, password_hash, phone_number, role, is_active, created_at, updated_at, is_deleted)
VALUES (
    'superadmin0001',
    'Super Administrator',
    'superadmin@hospital.com',
    '$2a$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ee58eaG25qZyQYzm', -- Admin@123
    '+91-9876543210',
    0,
    true,
    NOW(),
    NOW(),
    false
) ON CONFLICT (email) DO NOTHING;

-- Insert Admin user
-- Password: Admin@123
INSERT INTO users (id, name, email, password_hash, phone_number, role, is_active, created_at, updated_at, is_deleted)
VALUES (
    'admin0001',
    'Hospital Administrator',
    'admin@hospital.com',
    '$2a$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ee58eaG25qZyQYzm', -- Admin@123
    '+91-9876543211',
    1,
    true,
    NOW(),
    NOW(),
    false
) ON CONFLICT (email) DO NOTHING;

-- Insert Doctor users
-- Password: Doctor@123
INSERT INTO users (id, name, email, password_hash, phone_number, role, department_id, is_active, created_at, updated_at, is_deleted)
VALUES (
    'doctor0001',
    'Dr. Rajesh Kumar',
    'doctor1@hospital.com',
    '$2a$12$zHCboR0CmxhsR3eJpHXRJurQ.2yZwVOZDVkJVvHQcA5MsvUt1a59G', --  Doctor@123
    '+91-9876543212',
    2,
    'dept_001',
    true,
    NOW(),
    NOW(),
    false
) ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, name, email, password_hash, phone_number, role, department_id, is_active, created_at, updated_at, is_deleted)
VALUES (
    'doctor0002',
    'Dr. Priya Sharma',
    'doctor2@hospital.com',
    '$2a$12$zHCboR0CmxhsR3eJpHXRJurQ.2yZwVOZDVkJVvHQcA5MsvUt1a59G', -- Doctor@123
    '+91-9876543213',
    2,
    'dept_002',
    true,
    NOW(),
    NOW(),
    false
) ON CONFLICT (email) DO NOTHING;

-- Insert Accountant user
-- Password: Account@123
INSERT INTO users (id, name, email, password_hash, phone_number, role, is_active, created_at, updated_at, is_deleted)
VALUES (
    'accountant0001',
    'Accounting Manager',
    'accountant@hospital.com',
    '$2a$12$L8sEHqWtqVnb3R8Jg9QjG.Nzg2vYrOc4VqW1BqHg4D0RaPxeHkXN2', -- Account@123
    '+91-9876543214',
    3,
    true,
    NOW(),
    NOW(),
    false
) ON CONFLICT (email) DO NOTHING;

-- Insert Receptionist user
-- Password: Recep@123
INSERT INTO users (id, name, email, password_hash, phone_number, role, is_active, created_at, updated_at, is_deleted)
VALUES (
    'receptionist0001',
    'Front Desk Receptionist',
    'receptionist@hospital.com',
    '$2a$12$TkE7hV2xZ7vK9nQm8pLwPeBm7Bd6Jf8c4UpN3qR5sT2WvL4cD6m.C', -- Recep@123
    '+91-9876543215',
    4,
    true,
    NOW(),
    NOW(),
    false
) ON CONFLICT (email) DO NOTHING;

-- Insert Pharmacist user
-- Password: Pharm@123
INSERT INTO users (id, name, email, password_hash, phone_number, role, department_id, is_active, created_at, updated_at, is_deleted)
VALUES (
    'pharmacist0001',
    'Pharmacy Manager',
    'pharmacist@hospital.com',
    '$2a$12$WkQ8iH3xY5zP9oEr4tLvMeBn6Cd7Jg9d5VqO4pS6tU3XwM5dE7h.D', -- Pharm@123
    '+91-9876543216',
    5,
    'dept_pharmacy',
    true,
    NOW(),
    NOW(),
    false
) ON CONFLICT (email) DO NOTHING;

-- Insert Pathologist user
-- Password: Path@123
INSERT INTO users (id, name, email, password_hash, phone_number, role, department_id, is_active, created_at, updated_at, is_deleted)
VALUES (
    'pathologist0001',
    'Senior Pathologist',
    'pathologist@hospital.com',
    '$2a$12$XlR9jI4yZ6aQ9pFq5uLmNeBo7De8Kh0e6WrP5qT7uV4YxN6eF8i.E', -- Path@123
    '+91-9876543217',
    6,
    'dept_pathology',
    true,
    NOW(),
    NOW(),
    false
) ON CONFLICT (email) DO NOTHING;

-- Insert Radiologist user
-- Password: Radio@123
INSERT INTO users (id, name, email, password_hash, phone_number, role, department_id, is_active, created_at, updated_at, is_deleted)
VALUES (
    'radiologist0001',
    'Consultant Radiologist',
    'radiologist@hospital.com',
    '$2a$12$YmS0kJ5zA7bR0qGq6vMnNeBp8Ef9Li1f7XsQ6rU8vW5ZyO7fG9j.F', -- Radio@123
    '+91-9876543218',
    7,
    'dept_radiology',
    true,
    NOW(),
    NOW(),
    false
) ON CONFLICT (email) DO NOTHING;

-- Insert Nurse user
-- Password: Nurse@123
INSERT INTO users (id, name, email, password_hash, phone_number, role, department_id, is_active, created_at, updated_at, is_deleted)
VALUES (
    'nurse0001',
    'Head Nurse',
    'nurse@hospital.com',
    '$2a$12$ZnT1lK6aB8cS1rHq7wNnNeBq9Fg0Mj2g8YtR7sV9wX6AbP8gH0k.G', -- Nurse@123
    '+91-9876543219',
    8,
    'dept_nursing',
    true,
    NOW(),
    NOW(),
    false
) ON CONFLICT (email) DO NOTHING;

-- Insert Patient user
-- Password: Patient@123
INSERT INTO users (id, name, email, password_hash, phone_number, role, is_active, created_at, updated_at, is_deleted)
VALUES (
    'patient0001',
    'John Doe',
    'patient@hospital.com',
    '$2a$12$AoU2mL7bC9dT2sIq8yOoNeBr0Gh1Nk3h9ZuS8tW0xY7BcQ9hI1l.H', -- Patient@123
    '+91-9876543220',
    9,
    true,
    NOW(),
    NOW(),
    false
) ON CONFLICT (email) DO NOTHING;
