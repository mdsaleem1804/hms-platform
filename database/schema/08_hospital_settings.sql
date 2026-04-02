-- Hospital Settings Table
CREATE TABLE IF NOT EXISTS hospital_settings (
    id CHARACTER VARYING(50) PRIMARY KEY,
    hospital_name CHARACTER VARYING(200) NOT NULL,
    address_line1 CHARACTER VARYING(300) NOT NULL,
    address_line2 CHARACTER VARYING(300) NOT NULL,
    city CHARACTER VARYING(120) NOT NULL,
    state CHARACTER VARYING(120) NOT NULL,
    postal_code CHARACTER VARYING(20) NOT NULL,
    country CHARACTER VARYING(120) NOT NULL,
    phone_number CHARACTER VARYING(30) NOT NULL,
    alternate_phone_number CHARACTER VARYING(30) NOT NULL,
    email CHARACTER VARYING(160) NOT NULL,
    website CHARACTER VARYING(160) NOT NULL,
    gst_number CHARACTER VARYING(60) NOT NULL,
    registration_number CHARACTER VARYING(100) NOT NULL,
    report_header_tagline CHARACTER VARYING(200) NOT NULL,
    report_footer_note CHARACTER VARYING(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create index on creation date for sorting
CREATE INDEX idx_hospital_settings_created_at ON hospital_settings(created_at DESC);
