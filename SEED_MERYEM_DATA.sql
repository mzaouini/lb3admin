-- =====================================================
-- LibertyPay Admin Panel - Seed Data for Meryem
-- =====================================================
-- This script populates the database with Meryem's data
-- Run this in Supabase SQL Editor after SETUP_ADMIN_USERS.sql
-- =====================================================

-- Step 1: Insert Organization (ACME Corporation)
INSERT INTO organizations (id, name, code, address, contact_phone, contact_email, is_active, created_at, updated_at)
VALUES (
  1,
  'ACME Corporation',
  'ACME',
  'Anfa Place, Casablanca, Morocco',
  '+212 522 123 456',
  'hr@acme.ma',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  address = EXCLUDED.address,
  contact_phone = EXCLUDED.contact_phone,
  contact_email = EXCLUDED.contact_email,
  updated_at = NOW();

-- Step 2: Insert User (Meryem Guezzour)
-- Using a fixed open_id for demo purposes
INSERT INTO users (
  id,
  open_id,
  name,
  email,
  phone_number,
  national_id,
  company,
  net_salary,
  currency,
  kyc_status,
  kyc_completed_at,
  pin,
  address_line1,
  address_line2,
  city,
  postal_code,
  country,
  role,
  created_at,
  updated_at,
  last_signed_in
) VALUES (
  1,
  'meryem_demo_openid_12345',
  'Meryem Guezzour',
  'meryem.guezzour@acme.ma',
  '+212 612345678',
  'AB100900',
  'ACME Corporation',
  10000,
  'MAD',
  'verified',
  NOW() - INTERVAL '30 days',
  '1234',
  'Anfa Place, Boulevard de la Corniche',
  'Apartment 5B',
  'Casablanca',
  '20250',
  'Morocco',
  'user',
  NOW() - INTERVAL '6 months',
  NOW(),
  NOW() - INTERVAL '1 day'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone_number = EXCLUDED.phone_number,
  national_id = EXCLUDED.national_id,
  company = EXCLUDED.company,
  net_salary = EXCLUDED.net_salary,
  kyc_status = EXCLUDED.kyc_status,
  kyc_completed_at = EXCLUDED.kyc_completed_at,
  address_line1 = EXCLUDED.address_line1,
  address_line2 = EXCLUDED.address_line2,
  city = EXCLUDED.city,
  postal_code = EXCLUDED.postal_code,
  updated_at = NOW();

-- Step 3: Insert Bank Account (LibertyPay Nasp Account)
INSERT INTO bank_accounts (
  id,
  user_id,
  account_title,
  account_number,
  bank_name,
  iban,
  is_default,
  created_at,
  updated_at
) VALUES (
  1,
  1,
  'Meryem Guezzour',
  'XXXX XXXX XXXX 0401',
  'LibertyPay Nasp account',
  'MA64011519000001205000000141',
  1,
  NOW() - INTERVAL '6 months',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  account_title = EXCLUDED.account_title,
  account_number = EXCLUDED.account_number,
  bank_name = EXCLUDED.bank_name,
  iban = EXCLUDED.iban,
  updated_at = NOW();

-- Step 4: Insert Virtual Card
INSERT INTO cards (
  id,
  user_id,
  card_number,
  cardholder_name,
  expiry_month,
  expiry_year,
  cvv,
  card_type,
  status,
  balance,
  daily_limit,
  monthly_limit,
  created_at,
  updated_at
) VALUES (
  1,
  1,
  '5335 7600 0000 1983',
  'MERYEM GUEZZOUR',
  12,
  2027,
  '123',
  'virtual',
  'active',
  233333,
  500000,
  800000,
  NOW() - INTERVAL '5 months',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  cardholder_name = EXCLUDED.cardholder_name,
  balance = EXCLUDED.balance,
  updated_at = NOW();

-- Step 5: Insert Salary Advances (5 completed + 1 pending)

-- Advance 1: 2,000 Dhs (Completed - October 15)
INSERT INTO salary_advances (
  id,
  user_id,
  amount,
  service_fee,
  total_amount,
  status,
  bank_account_id,
  requested_at,
  approved_at,
  disbursed_at,
  due_date,
  created_at,
  updated_at
) VALUES (
  1,
  1,
  2000,
  60,
  2060,
  'disbursed',
  1,
  '2025-10-15 10:30:00',
  '2025-10-15 10:45:00',
  '2025-10-15 11:00:00',
  '2025-10-31 23:59:59',
  '2025-10-15 10:30:00',
  '2025-10-15 11:00:00'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  approved_at = EXCLUDED.approved_at,
  disbursed_at = EXCLUDED.disbursed_at,
  updated_at = NOW();

-- Advance 2: 1,000 Dhs (Completed - October 10)
INSERT INTO salary_advances (
  id,
  user_id,
  amount,
  service_fee,
  total_amount,
  status,
  bank_account_id,
  requested_at,
  approved_at,
  disbursed_at,
  due_date,
  created_at,
  updated_at
) VALUES (
  2,
  1,
  1000,
  60,
  1060,
  'disbursed',
  1,
  '2025-10-10 14:20:00',
  '2025-10-10 14:35:00',
  '2025-10-10 14:50:00',
  '2025-10-31 23:59:59',
  '2025-10-10 14:20:00',
  '2025-10-10 14:50:00'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  approved_at = EXCLUDED.approved_at,
  disbursed_at = EXCLUDED.disbursed_at,
  updated_at = NOW();

-- Advance 3: 500 Dhs (Completed - October 5)
INSERT INTO salary_advances (
  id,
  user_id,
  amount,
  service_fee,
  total_amount,
  status,
  bank_account_id,
  requested_at,
  approved_at,
  disbursed_at,
  due_date,
  created_at,
  updated_at
) VALUES (
  3,
  1,
  500,
  60,
  560,
  'disbursed',
  1,
  '2025-10-05 09:15:00',
  '2025-10-05 09:30:00',
  '2025-10-05 09:45:00',
  '2025-10-31 23:59:59',
  '2025-10-05 09:15:00',
  '2025-10-05 09:45:00'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  approved_at = EXCLUDED.approved_at,
  disbursed_at = EXCLUDED.disbursed_at,
  updated_at = NOW();

-- Advance 4: 1,500 Dhs (Completed - September 20)
INSERT INTO salary_advances (
  id,
  user_id,
  amount,
  service_fee,
  total_amount,
  status,
  bank_account_id,
  requested_at,
  approved_at,
  disbursed_at,
  repaid_at,
  due_date,
  created_at,
  updated_at
) VALUES (
  4,
  1,
  1500,
  60,
  1560,
  'repaid',
  1,
  '2025-09-20 11:00:00',
  '2025-09-20 11:15:00',
  '2025-09-20 11:30:00',
  '2025-09-30 23:59:59',
  '2025-09-30 23:59:59',
  '2025-09-20 11:00:00',
  '2025-09-30 23:59:59'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  approved_at = EXCLUDED.approved_at,
  disbursed_at = EXCLUDED.disbursed_at,
  repaid_at = EXCLUDED.repaid_at,
  updated_at = NOW();

-- Advance 5: 2,000 Dhs (Completed - September 10)
INSERT INTO salary_advances (
  id,
  user_id,
  amount,
  service_fee,
  total_amount,
  status,
  bank_account_id,
  requested_at,
  approved_at,
  disbursed_at,
  repaid_at,
  due_date,
  created_at,
  updated_at
) VALUES (
  5,
  1,
  2000,
  60,
  2060,
  'repaid',
  1,
  '2025-09-10 16:45:00',
  '2025-09-10 17:00:00',
  '2025-09-10 17:15:00',
  '2025-09-30 23:59:59',
  '2025-09-30 23:59:59',
  '2025-09-10 16:45:00',
  '2025-09-30 23:59:59'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  approved_at = EXCLUDED.approved_at,
  disbursed_at = EXCLUDED.disbursed_at,
  repaid_at = EXCLUDED.repaid_at,
  updated_at = NOW();

-- Advance 6: 800 Dhs (PENDING - for Checker to approve)
INSERT INTO salary_advances (
  id,
  user_id,
  amount,
  service_fee,
  total_amount,
  status,
  bank_account_id,
  requested_at,
  due_date,
  created_at,
  updated_at
) VALUES (
  6,
  1,
  800,
  60,
  860,
  'pending',
  1,
  NOW() - INTERVAL '2 hours',
  '2025-10-31 23:59:59',
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '2 hours'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  updated_at = NOW();

-- Step 6: Insert Transactions for each advance

-- Transaction 1: Salary Advance +2,000 Dhs (Oct 15)
INSERT INTO transactions (
  id,
  user_id,
  salary_advance_id,
  type,
  amount,
  status,
  description,
  reference_number,
  created_at,
  completed_at
) VALUES (
  1,
  1,
  1,
  'salary_advance',
  2000,
  'completed',
  'Salary Advance - Meryem - ACME',
  'SA-20251015-0001',
  '2025-10-15 10:30:00',
  '2025-10-15 11:00:00'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  completed_at = EXCLUDED.completed_at;

-- Transaction 2: Service Fee -60 Dhs (Oct 15)
INSERT INTO transactions (
  id,
  user_id,
  salary_advance_id,
  type,
  amount,
  status,
  description,
  reference_number,
  created_at,
  completed_at
) VALUES (
  2,
  1,
  1,
  'fee',
  60,
  'completed',
  'Service Fee (HT: 50 Dhs + VAT 20%: 10 Dhs)',
  'FEE-20251015-0001',
  '2025-10-15 10:30:00',
  '2025-10-15 11:00:00'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  completed_at = EXCLUDED.completed_at;

-- Transaction 3: Salary Advance +1,000 Dhs (Oct 10)
INSERT INTO transactions (
  id,
  user_id,
  salary_advance_id,
  type,
  amount,
  status,
  description,
  reference_number,
  created_at,
  completed_at
) VALUES (
  3,
  1,
  2,
  'salary_advance',
  1000,
  'completed',
  'Salary Advance - Meryem - ACME',
  'SA-20251010-0002',
  '2025-10-10 14:20:00',
  '2025-10-10 14:50:00'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  completed_at = EXCLUDED.completed_at;

-- Transaction 4: Service Fee -60 Dhs (Oct 10)
INSERT INTO transactions (
  id,
  user_id,
  salary_advance_id,
  type,
  amount,
  status,
  description,
  reference_number,
  created_at,
  completed_at
) VALUES (
  4,
  1,
  2,
  'fee',
  60,
  'completed',
  'Service Fee (HT: 50 Dhs + VAT 20%: 10 Dhs)',
  'FEE-20251010-0002',
  '2025-10-10 14:20:00',
  '2025-10-10 14:50:00'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  completed_at = EXCLUDED.completed_at;

-- Transaction 5: Salary Advance +500 Dhs (Oct 5)
INSERT INTO transactions (
  id,
  user_id,
  salary_advance_id,
  type,
  amount,
  status,
  description,
  reference_number,
  created_at,
  completed_at
) VALUES (
  5,
  1,
  3,
  'salary_advance',
  500,
  'completed',
  'Salary Advance - Meryem - ACME',
  'SA-20251005-0003',
  '2025-10-05 09:15:00',
  '2025-10-05 09:45:00'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  completed_at = EXCLUDED.completed_at;

-- Transaction 6: Service Fee -60 Dhs (Oct 5)
INSERT INTO transactions (
  id,
  user_id,
  salary_advance_id,
  type,
  amount,
  status,
  description,
  reference_number,
  created_at,
  completed_at
) VALUES (
  6,
  1,
  3,
  'fee',
  60,
  'completed',
  'Service Fee (HT: 50 Dhs + VAT 20%: 10 Dhs)',
  'FEE-20251005-0003',
  '2025-10-05 09:15:00',
  '2025-10-05 09:45:00'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  completed_at = EXCLUDED.completed_at;

-- Transaction 7: Salary Advance +1,500 Dhs (Sep 20)
INSERT INTO transactions (
  id,
  user_id,
  salary_advance_id,
  type,
  amount,
  status,
  description,
  reference_number,
  created_at,
  completed_at
) VALUES (
  7,
  1,
  4,
  'salary_advance',
  1500,
  'completed',
  'Salary Advance - Meryem - ACME',
  'SA-20250920-0004',
  '2025-09-20 11:00:00',
  '2025-09-20 11:30:00'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  completed_at = EXCLUDED.completed_at;

-- Transaction 8: Service Fee -60 Dhs (Sep 20)
INSERT INTO transactions (
  id,
  user_id,
  salary_advance_id,
  type,
  amount,
  status,
  description,
  reference_number,
  created_at,
  completed_at
) VALUES (
  8,
  1,
  4,
  'fee',
  60,
  'completed',
  'Service Fee (HT: 50 Dhs + VAT 20%: 10 Dhs)',
  'FEE-20250920-0004',
  '2025-09-20 11:00:00',
  '2025-09-20 11:30:00'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  completed_at = EXCLUDED.completed_at;

-- Transaction 9: Salary Advance +2,000 Dhs (Sep 10)
INSERT INTO transactions (
  id,
  user_id,
  salary_advance_id,
  type,
  amount,
  status,
  description,
  reference_number,
  created_at,
  completed_at
) VALUES (
  9,
  1,
  5,
  'salary_advance',
  2000,
  'completed',
  'Salary Advance - Meryem - ACME',
  'SA-20250910-0005',
  '2025-09-10 16:45:00',
  '2025-09-10 17:15:00'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  completed_at = EXCLUDED.completed_at;

-- Transaction 10: Service Fee -60 Dhs (Sep 10)
INSERT INTO transactions (
  id,
  user_id,
  salary_advance_id,
  type,
  amount,
  status,
  description,
  reference_number,
  created_at,
  completed_at
) VALUES (
  10,
  1,
  5,
  'fee',
  60,
  'completed',
  'Service Fee (HT: 50 Dhs + VAT 20%: 10 Dhs)',
  'FEE-20250910-0005',
  '2025-09-10 16:45:00',
  '2025-09-10 17:15:00'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  completed_at = EXCLUDED.completed_at;

-- Step 7: Insert Card Transactions (5 realistic transactions)
INSERT INTO card_transactions (
  id,
  card_id,
  amount,
  merchant,
  category,
  status,
  transaction_date,
  created_at
) VALUES
  (1, 1, -4500, 'Café Casablanca', 'Food & Dining', 'completed', '2025-10-28 08:30:00', '2025-10-28 08:30:00'),
  (2, 1, -32000, 'Marjane Supermarket', 'Groceries', 'completed', '2025-10-26 18:15:00', '2025-10-26 18:15:00'),
  (3, 1, -85000, 'Zara Morocco Mall', 'Shopping', 'completed', '2025-10-24 14:45:00', '2025-10-24 14:45:00'),
  (4, 1, -18000, 'Pizza Hut', 'Food & Dining', 'completed', '2025-10-22 19:30:00', '2025-10-22 19:30:00'),
  (5, 1, -40000, 'Afriquia Gas Station', 'Transportation', 'completed', '2025-10-20 07:00:00', '2025-10-20 07:00:00')
ON CONFLICT (id) DO UPDATE SET
  amount = EXCLUDED.amount,
  merchant = EXCLUDED.merchant,
  category = EXCLUDED.category;

-- Step 8: Reset sequences to continue from next ID
SELECT setval('organizations_id_seq', (SELECT MAX(id) FROM organizations), true);
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users), true);
SELECT setval('bank_accounts_id_seq', (SELECT MAX(id) FROM bank_accounts), true);
SELECT setval('cards_id_seq', (SELECT MAX(id) FROM cards), true);
SELECT setval('salary_advances_id_seq', (SELECT MAX(id) FROM salary_advances), true);
SELECT setval('transactions_id_seq', (SELECT MAX(id) FROM transactions), true);
SELECT setval('card_transactions_id_seq', (SELECT MAX(id) FROM card_transactions), true);

-- =====================================================
-- Verification Queries
-- =====================================================

SELECT '✅ Organization created:' as status;
SELECT id, name, code, contact_email FROM organizations WHERE id = 1;

SELECT '' as separator;
SELECT '✅ User created:' as status;
SELECT id, name, phone_number, company, net_salary, kyc_status FROM users WHERE id = 1;

SELECT '' as separator;
SELECT '✅ Bank account created:' as status;
SELECT id, account_title, bank_name, account_number FROM bank_accounts WHERE user_id = 1;

SELECT '' as separator;
SELECT '✅ Card created:' as status;
SELECT id, card_number, cardholder_name, balance FROM cards WHERE user_id = 1;

SELECT '' as separator;
SELECT '✅ Salary advances created:' as status;
SELECT id, amount, service_fee, status, requested_at FROM salary_advances WHERE user_id = 1 ORDER BY id;

SELECT '' as separator;
SELECT '✅ Transactions created:' as status;
SELECT id, type, amount, description, status FROM transactions WHERE user_id = 1 ORDER BY id;

SELECT '' as separator;
SELECT '✅ Card transactions created:' as status;
SELECT id, merchant, amount, category FROM card_transactions WHERE card_id = 1 ORDER BY transaction_date DESC;

-- =====================================================
-- Setup Complete!
-- =====================================================
-- Summary:
-- - 1 Organization (ACME Corporation)
-- - 1 User (Meryem Guezzour)
-- - 1 Bank Account (LibertyPay Nasp account)
-- - 1 Virtual Card
-- - 6 Salary Advances (5 completed, 1 pending approval)
-- - 10 Transactions (5 advances + 5 fees)
-- - 5 Card Transactions
--
-- The admin panel can now:
-- - View Meryem's employee details
-- - See her transaction history
-- - Approve the pending 800 Dhs advance (Checker role)
-- =====================================================
