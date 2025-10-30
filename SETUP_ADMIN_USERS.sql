-- ============================================
-- LibertyPay Admin Panel - Database Setup
-- Run this script in Supabase SQL Editor
-- ============================================

-- Step 1: Create admin_role enum
DO $$ BEGIN
  CREATE TYPE admin_role AS ENUM ('maker', 'checker', 'support', 'super_admin');
EXCEPTION
  WHEN duplicate_object THEN 
    RAISE NOTICE 'admin_role enum already exists, skipping...';
END $$;

-- Step 2: Create admin_users table
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

-- Step 3: Create audit_logs table
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

-- Step 4: Create organizations table
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

-- Step 5: Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  updated_by INTEGER REFERENCES admin_users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Step 6: Insert 3 admin users
-- Password for all users is 'admin123' (stored in plain text for demo - use bcrypt in production!)
INSERT INTO admin_users (email, name, password, role) VALUES
  ('maker@libertypay.ma', 'Operations Manager', 'admin123', 'maker'),
  ('checker@libertypay.ma', 'Finance Manager', 'admin123', 'checker'),
  ('support@libertypay.ma', 'Support Agent', 'admin123', 'support')
ON CONFLICT (email) DO UPDATE
SET 
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Step 7: Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
  ('service_fee_ht', '50', 'Service fee before tax (in Dhs)'),
  ('vat_rate', '20', 'VAT rate percentage'),
  ('service_fee_ttc', '60', 'Service fee including tax (in Dhs)'),
  ('min_advance_amount', '100', 'Minimum salary advance amount (in Dhs)'),
  ('max_advance_amount', '5000', 'Maximum salary advance amount (in Dhs)'),
  ('max_salary_percentage', '50', 'Maximum percentage of salary that can be advanced')
ON CONFLICT (key) DO UPDATE
SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Step 8: Verify setup
SELECT 'Admin users created:' as status;
SELECT id, email, name, role, is_active FROM admin_users ORDER BY id;

SELECT '' as separator;
SELECT 'System settings created:' as status;
SELECT key, value, description FROM system_settings ORDER BY id;

-- ============================================
-- Setup Complete!
-- ============================================
-- Login credentials for admin panel:
-- 
-- Maker:   maker@libertypay.ma   / admin123
-- Checker: checker@libertypay.ma / admin123  
-- Support: support@libertypay.ma / admin123
-- ============================================
