-- ============================================================================
-- LIBERTYPAY ADMIN PANEL - COMPLETE SEED DATA
-- ============================================================================
-- This script creates 20 employees under ACME Corporation with:
-- - Diverse roles and salary ranges
-- - Multiple salary advances (completed and pending)
-- - Bank accounts and cards
-- - Realistic transaction history
-- - Proper idempotency using natural keys and subqueries
-- ============================================================================

-- ============================================================================
-- ENSURE REQUIRED CONSTRAINTS EXIST
-- ============================================================================

-- Ensure open_id is unique on users table (should already exist, but add if missing)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'users_open_id_key' AND conrelid = 'users'::regclass
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_open_id_key UNIQUE (open_id);
  END IF;
END $$;

-- Create unique index on IBAN for bank accounts
CREATE UNIQUE INDEX IF NOT EXISTS idx_bank_accounts_iban ON bank_accounts(iban);

-- ============================================================================
-- ORGANIZATIONS
-- ============================================================================

-- First, ensure the organization exists
-- Insert only if it doesn't exist (won't delete existing employees)
INSERT INTO organizations (name, code, contact_email, contact_phone, address, is_active, created_at, updated_at)
SELECT 'ACME Corporation', 'ACME001', 'contact@acme.ma', '+212 522 123 456', 'Twin Center, Boulevard Zerktouni, Casablanca', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM organizations WHERE code = 'ACME001');

-- ============================================================================
-- EMPLOYEES (20 total under ACME Corporation)
-- ============================================================================

-- Employee 1: Meryem Guezzour (Already exists, update if needed)
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('meryem_demo_openid_12345', 'Meryem Guezzour', 'meryem.guezzour@acme.ma', '+212 612345678', 'AB100900', 'ACME Corporation', 10000, 'MAD', 'verified', NOW() - INTERVAL '30 days', '123 Boulevard Mohammed V', 'Casablanca', '20000', 'Morocco', NOW() - INTERVAL '90 days', NOW(), NOW())
ON CONFLICT (open_id) DO UPDATE SET
  company = 'ACME Corporation',
  updated_at = NOW();

-- Employee 2: Ahmed Bennani - Senior Developer
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('ahmed_bennani_openid', 'Ahmed Bennani', 'ahmed.bennani@acme.ma', '+212 623456789', 'CD234567', 'ACME Corporation', 15000, 'MAD', 'verified', NOW() - INTERVAL '45 days', '45 Rue Hassan II', 'Casablanca', '20100', 'Morocco', NOW() - INTERVAL '120 days', NOW(), NOW() - INTERVAL '1 day')
ON CONFLICT (open_id) DO NOTHING;

-- Employee 3: Fatima Alami - Product Manager
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('fatima_alami_openid', 'Fatima Alami', 'fatima.alami@acme.ma', '+212 634567890', 'EF345678', 'ACME Corporation', 18000, 'MAD', 'verified', NOW() - INTERVAL '60 days', '78 Avenue des FAR', 'Casablanca', '20200', 'Morocco', NOW() - INTERVAL '150 days', NOW(), NOW() - INTERVAL '2 days')
ON CONFLICT (open_id) DO NOTHING;

-- Employee 4: Youssef Idrissi - Marketing Manager
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('youssef_idrissi_openid', 'Youssef Idrissi', 'youssef.idrissi@acme.ma', '+212 645678901', 'GH456789', 'ACME Corporation', 14000, 'MAD', 'verified', NOW() - INTERVAL '40 days', '12 Boulevard Zerktouni', 'Casablanca', '20300', 'Morocco', NOW() - INTERVAL '100 days', NOW(), NOW() - INTERVAL '3 days')
ON CONFLICT (open_id) DO NOTHING;

-- Employee 5: Sara Tazi - HR Manager
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('sara_tazi_openid', 'Sara Tazi', 'sara.tazi@acme.ma', '+212 656789012', 'IJ567890', 'ACME Corporation', 13000, 'MAD', 'verified', NOW() - INTERVAL '35 days', '89 Rue Abdelmoumen', 'Casablanca', '20400', 'Morocco', NOW() - INTERVAL '110 days', NOW(), NOW() - INTERVAL '1 day')
ON CONFLICT (open_id) DO NOTHING;

-- Employee 6: Karim El Fassi - Sales Director
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('karim_elfassi_openid', 'Karim El Fassi', 'karim.elfassi@acme.ma', '+212 667890123', 'KL678901', 'ACME Corporation', 20000, 'MAD', 'verified', NOW() - INTERVAL '50 days', '34 Boulevard Anfa', 'Casablanca', '20500', 'Morocco', NOW() - INTERVAL '180 days', NOW(), NOW() - INTERVAL '2 days')
ON CONFLICT (open_id) DO NOTHING;

-- Employee 7: Nadia Berrada - Finance Manager
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('nadia_berrada_openid', 'Nadia Berrada', 'nadia.berrada@acme.ma', '+212 678901234', 'MN789012', 'ACME Corporation', 16000, 'MAD', 'verified', NOW() - INTERVAL '55 days', '56 Rue Moulay Youssef', 'Casablanca', '20600', 'Morocco', NOW() - INTERVAL '140 days', NOW(), NOW() - INTERVAL '1 day')
ON CONFLICT (open_id) DO NOTHING;

-- Employee 8: Hassan Chakir - Junior Developer
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('hassan_chakir_openid', 'Hassan Chakir', 'hassan.chakir@acme.ma', '+212 689012345', 'OP890123', 'ACME Corporation', 9000, 'MAD', 'verified', NOW() - INTERVAL '25 days', '23 Rue Allal Ben Abdellah', 'Casablanca', '20700', 'Morocco', NOW() - INTERVAL '60 days', NOW(), NOW() - INTERVAL '4 days')
ON CONFLICT (open_id) DO NOTHING;

-- Employee 9: Leila Amrani - UX Designer
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('leila_amrani_openid', 'Leila Amrani', 'leila.amrani@acme.ma', '+212 690123456', 'QR901234', 'ACME Corporation', 12000, 'MAD', 'verified', NOW() - INTERVAL '30 days', '67 Avenue Mers Sultan', 'Casablanca', '20800', 'Morocco', NOW() - INTERVAL '80 days', NOW(), NOW() - INTERVAL '2 days')
ON CONFLICT (open_id) DO NOTHING;

-- Employee 10: Omar Lahlou - DevOps Engineer
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('omar_lahlou_openid', 'Omar Lahlou', 'omar.lahlou@acme.ma', '+212 601234567', 'ST012345', 'ACME Corporation', 14500, 'MAD', 'verified', NOW() - INTERVAL '40 days', '90 Boulevard Massira', 'Casablanca', '20900', 'Morocco', NOW() - INTERVAL '95 days', NOW(), NOW() - INTERVAL '1 day')
ON CONFLICT (open_id) DO NOTHING;

-- Employee 11: Zineb Mansouri - Content Writer
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('zineb_mansouri_openid', 'Zineb Mansouri', 'zineb.mansouri@acme.ma', '+212 612345670', 'UV123456', 'ACME Corporation', 8500, 'MAD', 'verified', NOW() - INTERVAL '20 days', '12 Rue Prince Moulay Abdellah', 'Casablanca', '21000', 'Morocco', NOW() - INTERVAL '50 days', NOW(), NOW() - INTERVAL '3 days')
ON CONFLICT (open_id) DO NOTHING;

-- Employee 12: Mehdi Ziani - Data Analyst
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('mehdi_ziani_openid', 'Mehdi Ziani', 'mehdi.ziani@acme.ma', '+212 623456781', 'WX234567', 'ACME Corporation', 11000, 'MAD', 'verified', NOW() - INTERVAL '35 days', '45 Avenue Lalla Yacout', 'Casablanca', '21100', 'Morocco', NOW() - INTERVAL '70 days', NOW(), NOW() - INTERVAL '2 days')
ON CONFLICT (open_id) DO NOTHING;

-- Employee 13: Amina Kabbaj - Customer Support
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('amina_kabbaj_openid', 'Amina Kabbaj', 'amina.kabbaj@acme.ma', '+212 634567892', 'YZ345678', 'ACME Corporation', 7500, 'MAD', 'verified', NOW() - INTERVAL '15 days', '78 Rue Tarik Ibn Ziad', 'Casablanca', '21200', 'Morocco', NOW() - INTERVAL '45 days', NOW(), NOW() - INTERVAL '1 day')
ON CONFLICT (open_id) DO NOTHING;

-- Employee 14: Rachid Ouazzani - QA Engineer
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('rachid_ouazzani_openid', 'Rachid Ouazzani', 'rachid.ouazzani@acme.ma', '+212 645678903', 'AB456789', 'ACME Corporation', 10500, 'MAD', 'verified', NOW() - INTERVAL '28 days', '34 Boulevard Bir Anzarane', 'Casablanca', '21300', 'Morocco', NOW() - INTERVAL '65 days', NOW(), NOW() - INTERVAL '4 days')
ON CONFLICT (open_id) DO NOTHING;

-- Employee 15: Salma Chraibi - Legal Counsel
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('salma_chraibi_openid', 'Salma Chraibi', 'salma.chraibi@acme.ma', '+212 656789014', 'CD567890', 'ACME Corporation', 17000, 'MAD', 'verified', NOW() - INTERVAL '50 days', '56 Rue Colbert', 'Casablanca', '21400', 'Morocco', NOW() - INTERVAL '130 days', NOW(), NOW() - INTERVAL '2 days')
ON CONFLICT (open_id) DO NOTHING;

-- Employee 16: Tarik Bensouda - Operations Manager
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('tarik_bensouda_openid', 'Tarik Bensouda', 'tarik.bensouda@acme.ma', '+212 667890125', 'EF678901', 'ACME Corporation', 15500, 'MAD', 'verified', NOW() - INTERVAL '42 days', '89 Avenue Moulay Hassan', 'Casablanca', '21500', 'Morocco', NOW() - INTERVAL '105 days', NOW(), NOW() - INTERVAL '1 day')
ON CONFLICT (open_id) DO NOTHING;

-- Employee 17: Hind Filali - Accountant
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('hind_filali_openid', 'Hind Filali', 'hind.filali@acme.ma', '+212 678901236', 'GH789012', 'ACME Corporation', 9500, 'MAD', 'verified', NOW() - INTERVAL '22 days', '23 Rue Abou Kacem Chabbi', 'Casablanca', '21600', 'Morocco', NOW() - INTERVAL '55 days', NOW(), NOW() - INTERVAL '3 days')
ON CONFLICT (open_id) DO NOTHING;

-- Employee 18: Amine Tounsi - Business Analyst
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('amine_tounsi_openid', 'Amine Tounsi', 'amine.tounsi@acme.ma', '+212 689012347', 'IJ890123', 'ACME Corporation', 12500, 'MAD', 'verified', NOW() - INTERVAL '32 days', '67 Boulevard Emile Zola', 'Casablanca', '21700', 'Morocco', NOW() - INTERVAL '75 days', NOW(), NOW() - INTERVAL '2 days')
ON CONFLICT (open_id) DO NOTHING;

-- Employee 19: Khadija Lamrani - Project Manager
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('khadija_lamrani_openid', 'Khadija Lamrani', 'khadija.lamrani@acme.ma', '+212 690123458', 'KL901234', 'ACME Corporation', 16500, 'MAD', 'verified', NOW() - INTERVAL '48 days', '90 Rue Oued Sebou', 'Casablanca', '21800', 'Morocco', NOW() - INTERVAL '125 days', NOW(), NOW() - INTERVAL '1 day')
ON CONFLICT (open_id) DO NOTHING;

-- Employee 20: Bilal Sefrioui - System Administrator
INSERT INTO users (open_id, name, email, phone_number, national_id, company, net_salary, currency, kyc_status, kyc_completed_at, address_line1, city, postal_code, country, created_at, updated_at, last_signed_in)
VALUES ('bilal_sefrioui_openid', 'Bilal Sefrioui', 'bilal.sefrioui@acme.ma', '+212 601234569', 'MN012345', 'ACME Corporation', 13500, 'MAD', 'verified', NOW() - INTERVAL '38 days', '12 Avenue Al Qods', 'Casablanca', '21900', 'Morocco', NOW() - INTERVAL '88 days', NOW(), NOW() - INTERVAL '2 days')
ON CONFLICT (open_id) DO NOTHING;

-- ============================================================================
-- BANK ACCOUNTS (1 per employee) - Using IBAN as natural key
-- ============================================================================

-- Use ON CONFLICT with IBAN to make it idempotent
INSERT INTO bank_accounts (user_id, account_title, account_number, bank_name, iban, is_default, created_at, updated_at)
VALUES
((SELECT id FROM users WHERE open_id = 'ahmed_bennani_openid'), 'Ahmed Bennani', 'XXXX XXXX XXXX 0402', 'Attijariwafa Bank', 'MA64011519000001234567890', 1, NOW() - INTERVAL '40 days', NOW()),
((SELECT id FROM users WHERE open_id = 'fatima_alami_openid'), 'Fatima Alami', 'XXXX XXXX XXXX 0403', 'BMCE Bank', 'MA64021519000001234567891', 1, NOW() - INTERVAL '55 days', NOW()),
((SELECT id FROM users WHERE open_id = 'youssef_idrissi_openid'), 'Youssef Idrissi', 'XXXX XXXX XXXX 0404', 'Banque Populaire', 'MA64031519000001234567892', 1, NOW() - INTERVAL '35 days', NOW()),
((SELECT id FROM users WHERE open_id = 'sara_tazi_openid'), 'Sara Tazi', 'XXXX XXXX XXXX 0405', 'CIH Bank', 'MA64041519000001234567893', 1, NOW() - INTERVAL '30 days', NOW()),
((SELECT id FROM users WHERE open_id = 'karim_elfassi_openid'), 'Karim El Fassi', 'XXXX XXXX XXXX 0406', 'Attijariwafa Bank', 'MA64051519000001234567894', 1, NOW() - INTERVAL '45 days', NOW()),
((SELECT id FROM users WHERE open_id = 'nadia_berrada_openid'), 'Nadia Berrada', 'XXXX XXXX XXXX 0407', 'BMCE Bank', 'MA64061519000001234567895', 1, NOW() - INTERVAL '50 days', NOW()),
((SELECT id FROM users WHERE open_id = 'hassan_chakir_openid'), 'Hassan Chakir', 'XXXX XXXX XXXX 0408', 'LibertyPay Nasp', 'MA64071519000001234567896', 1, NOW() - INTERVAL '20 days', NOW()),
((SELECT id FROM users WHERE open_id = 'leila_amrani_openid'), 'Leila Amrani', 'XXXX XXXX XXXX 0409', 'Banque Populaire', 'MA64081519000001234567897', 1, NOW() - INTERVAL '25 days', NOW()),
((SELECT id FROM users WHERE open_id = 'omar_lahlou_openid'), 'Omar Lahlou', 'XXXX XXXX XXXX 0410', 'CIH Bank', 'MA64091519000001234567898', 1, NOW() - INTERVAL '35 days', NOW()),
((SELECT id FROM users WHERE open_id = 'zineb_mansouri_openid'), 'Zineb Mansouri', 'XXXX XXXX XXXX 0411', 'Attijariwafa Bank', 'MA64101519000001234567899', 1, NOW() - INTERVAL '15 days', NOW()),
((SELECT id FROM users WHERE open_id = 'mehdi_ziani_openid'), 'Mehdi Ziani', 'XXXX XXXX XXXX 0412', 'BMCE Bank', 'MA64111519000001234567800', 1, NOW() - INTERVAL '30 days', NOW()),
((SELECT id FROM users WHERE open_id = 'amina_kabbaj_openid'), 'Amina Kabbaj', 'XXXX XXXX XXXX 0413', 'LibertyPay Nasp', 'MA64121519000001234567801', 1, NOW() - INTERVAL '10 days', NOW()),
((SELECT id FROM users WHERE open_id = 'rachid_ouazzani_openid'), 'Rachid Ouazzani', 'XXXX XXXX XXXX 0414', 'Banque Populaire', 'MA64131519000001234567802', 1, NOW() - INTERVAL '23 days', NOW()),
((SELECT id FROM users WHERE open_id = 'salma_chraibi_openid'), 'Salma Chraibi', 'XXXX XXXX XXXX 0415', 'CIH Bank', 'MA64141519000001234567803', 1, NOW() - INTERVAL '45 days', NOW()),
((SELECT id FROM users WHERE open_id = 'tarik_bensouda_openid'), 'Tarik Bensouda', 'XXXX XXXX XXXX 0416', 'Attijariwafa Bank', 'MA64151519000001234567804', 1, NOW() - INTERVAL '37 days', NOW()),
((SELECT id FROM users WHERE open_id = 'hind_filali_openid'), 'Hind Filali', 'XXXX XXXX XXXX 0417', 'BMCE Bank', 'MA64161519000001234567805', 1, NOW() - INTERVAL '18 days', NOW()),
((SELECT id FROM users WHERE open_id = 'amine_tounsi_openid'), 'Amine Tounsi', 'XXXX XXXX XXXX 0418', 'LibertyPay Nasp', 'MA64171519000001234567806', 1, NOW() - INTERVAL '27 days', NOW()),
((SELECT id FROM users WHERE open_id = 'khadija_lamrani_openid'), 'Khadija Lamrani', 'XXXX XXXX XXXX 0419', 'Banque Populaire', 'MA64181519000001234567807', 1, NOW() - INTERVAL '43 days', NOW()),
((SELECT id FROM users WHERE open_id = 'bilal_sefrioui_openid'), 'Bilal Sefrioui', 'XXXX XXXX XXXX 0420', 'CIH Bank', 'MA64191519000001234567808', 1, NOW() - INTERVAL '33 days', NOW())
ON CONFLICT (iban) DO NOTHING;

-- ============================================================================
-- SALARY ADVANCES (Mix of completed and pending) - Using subqueries for IDs
-- ============================================================================

-- Completed advances (disbursed) - Ahmed (3 advances)
INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id,
  2000,
  60,
  2060,
  'disbursed',
  ba.id,
  NOW() - INTERVAL '25 days',
  NOW() - INTERVAL '24 days',
  NOW() - INTERVAL '24 days',
  NOW() + INTERVAL '5 days',
  NOW() - INTERVAL '25 days',
  NOW() - INTERVAL '24 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64011519000001234567890'
WHERE u.open_id = 'ahmed_bennani_openid'
AND NOT EXISTS (
  SELECT 1 FROM salary_advances sa 
  WHERE sa.user_id = u.id 
  AND sa.amount = 2000 
  AND sa.requested_at::date = (NOW() - INTERVAL '25 days')::date
);

INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 1500, 60, 1560, 'disbursed', ba.id,
  NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days',
  NOW() + INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64011519000001234567890'
WHERE u.open_id = 'ahmed_bennani_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 1500 AND sa.requested_at::date = (NOW() - INTERVAL '15 days')::date);

INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 2500, 60, 2560, 'disbursed', ba.id,
  NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days',
  NOW() + INTERVAL '25 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64011519000001234567890'
WHERE u.open_id = 'ahmed_bennani_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 2500 AND sa.requested_at::date = (NOW() - INTERVAL '5 days')::date);

-- Fatima (2 advances)
INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 3000, 60, 3060, 'disbursed', ba.id,
  NOW() - INTERVAL '20 days', NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days',
  NOW() + INTERVAL '10 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '19 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64021519000001234567891'
WHERE u.open_id = 'fatima_alami_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 3000 AND sa.requested_at::date = (NOW() - INTERVAL '20 days')::date);

INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 2200, 60, 2260, 'disbursed', ba.id,
  NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days',
  NOW() + INTERVAL '22 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64021519000001234567891'
WHERE u.open_id = 'fatima_alami_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 2200 AND sa.requested_at::date = (NOW() - INTERVAL '8 days')::date);

-- Youssef (2 advances)
INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 1800, 60, 1860, 'disbursed', ba.id,
  NOW() - INTERVAL '18 days', NOW() - INTERVAL '17 days', NOW() - INTERVAL '17 days',
  NOW() + INTERVAL '12 days', NOW() - INTERVAL '18 days', NOW() - INTERVAL '17 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64031519000001234567892'
WHERE u.open_id = 'youssef_idrissi_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 1800 AND sa.requested_at::date = (NOW() - INTERVAL '18 days')::date);

INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 2100, 60, 2160, 'disbursed', ba.id,
  NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days',
  NOW() + INTERVAL '24 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64031519000001234567892'
WHERE u.open_id = 'youssef_idrissi_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 2100 AND sa.requested_at::date = (NOW() - INTERVAL '6 days')::date);

-- Sara (1 advance)
INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 1600, 60, 1660, 'disbursed', ba.id,
  NOW() - INTERVAL '12 days', NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days',
  NOW() + INTERVAL '18 days', NOW() - INTERVAL '12 days', NOW() - INTERVAL '11 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64041519000001234567893'
WHERE u.open_id = 'sara_tazi_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 1600 AND sa.requested_at::date = (NOW() - INTERVAL '12 days')::date);

-- Karim (3 advances - high earner)
INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 3500, 60, 3560, 'disbursed', ba.id,
  NOW() - INTERVAL '22 days', NOW() - INTERVAL '21 days', NOW() - INTERVAL '21 days',
  NOW() + INTERVAL '8 days', NOW() - INTERVAL '22 days', NOW() - INTERVAL '21 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64051519000001234567894'
WHERE u.open_id = 'karim_elfassi_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 3500 AND sa.requested_at::date = (NOW() - INTERVAL '22 days')::date);

INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 2800, 60, 2860, 'disbursed', ba.id,
  NOW() - INTERVAL '14 days', NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days',
  NOW() + INTERVAL '16 days', NOW() - INTERVAL '14 days', NOW() - INTERVAL '13 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64051519000001234567894'
WHERE u.open_id = 'karim_elfassi_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 2800 AND sa.requested_at::date = (NOW() - INTERVAL '14 days')::date);

INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 4000, 60, 4060, 'disbursed', ba.id,
  NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days',
  NOW() + INTERVAL '26 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64051519000001234567894'
WHERE u.open_id = 'karim_elfassi_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 4000 AND sa.requested_at::date = (NOW() - INTERVAL '4 days')::date);

-- Nadia (2 advances)
INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 2400, 60, 2460, 'disbursed', ba.id,
  NOW() - INTERVAL '16 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days',
  NOW() + INTERVAL '14 days', NOW() - INTERVAL '16 days', NOW() - INTERVAL '15 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64061519000001234567895'
WHERE u.open_id = 'nadia_berrada_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 2400 AND sa.requested_at::date = (NOW() - INTERVAL '16 days')::date);

INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 1900, 60, 1960, 'disbursed', ba.id,
  NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days',
  NOW() + INTERVAL '23 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64061519000001234567895'
WHERE u.open_id = 'nadia_berrada_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 1900 AND sa.requested_at::date = (NOW() - INTERVAL '7 days')::date);

-- Hassan (1 advance)
INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 1200, 60, 1260, 'disbursed', ba.id,
  NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days',
  NOW() + INTERVAL '20 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64071519000001234567896'
WHERE u.open_id = 'hassan_chakir_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 1200 AND sa.requested_at::date = (NOW() - INTERVAL '10 days')::date);

-- Leila (2 advances)
INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 1700, 60, 1760, 'disbursed', ba.id,
  NOW() - INTERVAL '13 days', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days',
  NOW() + INTERVAL '17 days', NOW() - INTERVAL '13 days', NOW() - INTERVAL '12 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64081519000001234567897'
WHERE u.open_id = 'leila_amrani_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 1700 AND sa.requested_at::date = (NOW() - INTERVAL '13 days')::date);

INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 2000, 60, 2060, 'disbursed', ba.id,
  NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days',
  NOW() + INTERVAL '27 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64081519000001234567897'
WHERE u.open_id = 'leila_amrani_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 2000 AND sa.requested_at::date = (NOW() - INTERVAL '3 days')::date);

-- Omar (2 advances)
INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 2300, 60, 2360, 'disbursed', ba.id,
  NOW() - INTERVAL '19 days', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days',
  NOW() + INTERVAL '11 days', NOW() - INTERVAL '19 days', NOW() - INTERVAL '18 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64091519000001234567898'
WHERE u.open_id = 'omar_lahlou_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 2300 AND sa.requested_at::date = (NOW() - INTERVAL '19 days')::date);

INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 1800, 60, 1860, 'disbursed', ba.id,
  NOW() - INTERVAL '9 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days',
  NOW() + INTERVAL '21 days', NOW() - INTERVAL '9 days', NOW() - INTERVAL '8 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64091519000001234567898'
WHERE u.open_id = 'omar_lahlou_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 1800 AND sa.requested_at::date = (NOW() - INTERVAL '9 days')::date);

-- Zineb (1 advance)
INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 1100, 60, 1160, 'disbursed', ba.id,
  NOW() - INTERVAL '11 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days',
  NOW() + INTERVAL '19 days', NOW() - INTERVAL '11 days', NOW() - INTERVAL '10 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64101519000001234567899'
WHERE u.open_id = 'zineb_mansouri_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 1100 AND sa.requested_at::date = (NOW() - INTERVAL '11 days')::date);

-- Mehdi (2 advances)
INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 1500, 60, 1560, 'disbursed', ba.id,
  NOW() - INTERVAL '17 days', NOW() - INTERVAL '16 days', NOW() - INTERVAL '16 days',
  NOW() + INTERVAL '13 days', NOW() - INTERVAL '17 days', NOW() - INTERVAL '16 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64111519000001234567800'
WHERE u.open_id = 'mehdi_ziani_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 1500 AND sa.requested_at::date = (NOW() - INTERVAL '17 days')::date);

INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, approved_at, disbursed_at, due_date, created_at, updated_at)
SELECT 
  u.id, 1900, 60, 1960, 'disbursed', ba.id,
  NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days',
  NOW() + INTERVAL '25 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64111519000001234567800'
WHERE u.open_id = 'mehdi_ziani_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 1900 AND sa.requested_at::date = (NOW() - INTERVAL '5 days')::date);

-- Pending advances (for Checker to approve)
INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, created_at, updated_at)
SELECT 
  u.id, 1000, 60, 1060, 'pending', ba.id,
  NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64121519000001234567801'
WHERE u.open_id = 'amina_kabbaj_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 1000 AND sa.status = 'pending');

INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, created_at, updated_at)
SELECT 
  u.id, 1400, 60, 1460, 'pending', ba.id,
  NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64131519000001234567802'
WHERE u.open_id = 'rachid_ouazzani_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 1400 AND sa.status = 'pending');

INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, created_at, updated_at)
SELECT 
  u.id, 2500, 60, 2560, 'pending', ba.id,
  NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64141519000001234567803'
WHERE u.open_id = 'salma_chraibi_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 2500 AND sa.status = 'pending');

INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, created_at, updated_at)
SELECT 
  u.id, 2000, 60, 2060, 'pending', ba.id,
  NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64151519000001234567804'
WHERE u.open_id = 'tarik_bensouda_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 2000 AND sa.status = 'pending');

INSERT INTO salary_advances (user_id, amount, service_fee, total_amount, status, bank_account_id, requested_at, created_at, updated_at)
SELECT 
  u.id, 1300, 60, 1360, 'pending', ba.id,
  NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
FROM users u
JOIN bank_accounts ba ON ba.user_id = u.id AND ba.iban = 'MA64161519000001234567805'
WHERE u.open_id = 'hind_filali_openid'
AND NOT EXISTS (SELECT 1 FROM salary_advances sa WHERE sa.user_id = u.id AND sa.amount = 1300 AND sa.status = 'pending');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check results
SELECT '=== VERIFICATION RESULTS ===' as info;

SELECT 'Organizations:' as category, COUNT(*) as count FROM organizations;
SELECT 'Employees:' as category, COUNT(*) as count FROM users;
SELECT 'Bank Accounts:' as category, COUNT(*) as count FROM bank_accounts;
SELECT 'Salary Advances:' as category, COUNT(*) as count FROM salary_advances;
SELECT 'Pending Advances:' as category, COUNT(*) as count FROM salary_advances WHERE status = 'pending';
SELECT 'Disbursed Advances:' as category, COUNT(*) as count FROM salary_advances WHERE status = 'disbursed';

-- Summary by employee
SELECT 
  u.name,
  u.net_salary,
  COUNT(sa.id) as total_advances,
  SUM(CASE WHEN sa.status = 'disbursed' THEN sa.amount ELSE 0 END) as total_disbursed,
  SUM(CASE WHEN sa.status = 'pending' THEN sa.amount ELSE 0 END) as total_pending
FROM users u
LEFT JOIN salary_advances sa ON u.id = sa.user_id
WHERE u.company = 'ACME Corporation'
GROUP BY u.id, u.name, u.net_salary
ORDER BY u.name;
