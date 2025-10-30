-- Create admin role enum
DO $$ BEGIN
  CREATE TYPE admin_role AS ENUM ('maker', 'checker', 'support', 'super_admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role admin_role NOT NULL DEFAULT 'support',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  admin_user_id INTEGER REFERENCES admin_users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id INTEGER,
  details TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE,
  parent_organization_id INTEGER REFERENCES organizations(id),
  contact_email VARCHAR(320),
  contact_phone VARCHAR(20),
  address TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  updated_by INTEGER REFERENCES admin_users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert 3 admin users (passwords are hashed 'admin123')
-- In production, use proper password hashing like bcrypt
INSERT INTO admin_users (email, name, password, role) VALUES
  ('maker@libertypay.ma', 'Operations Manager', '$2a$10$rXKvZpjzuFN.e1UxFa7HEO5Y7lZJ8qKqX7.mK9L8vZ0wQ1xK2yH3e', 'maker'),
  ('checker@libertypay.ma', 'Finance Manager', '$2a$10$rXKvZpjzuFN.e1UxFa7HEO5Y7lZJ8qKqX7.mK9L8vZ0wQ1xK2yH3e', 'checker'),
  ('support@libertypay.ma', 'Support Agent', '$2a$10$rXKvZpjzuFN.e1UxFa7HEO5Y7lZJ8qKqX7.mK9L8vZ0wQ1xK2yH3e', 'support')
ON CONFLICT (email) DO NOTHING;

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
  ('service_fee_ht', '50', 'Service fee before tax (in Dhs)'),
  ('vat_rate', '20', 'VAT rate percentage'),
  ('min_advance_amount', '100', 'Minimum salary advance amount (in Dhs)'),
  ('max_advance_amount', '5000', 'Maximum salary advance amount (in Dhs)'),
  ('max_salary_percentage', '50', 'Maximum percentage of salary that can be advanced')
ON CONFLICT (key) DO NOTHING;
