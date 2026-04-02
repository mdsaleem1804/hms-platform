-- OPD Billing Items Table
CREATE TABLE billing_items (
  id VARCHAR(50) PRIMARY KEY,
  billing_id VARCHAR(50) NOT NULL REFERENCES billings(id) ON DELETE CASCADE,
  service_name VARCHAR(150) NOT NULL,
  qty INT NOT NULL,
  rate NUMERIC(12,2) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_billing_items_billing_id ON billing_items(billing_id);
