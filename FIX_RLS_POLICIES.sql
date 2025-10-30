-- ============================================================================
-- FIX RLS POLICIES FOR ADMIN PANEL
-- ============================================================================
-- This script disables RLS or adds permissive policies so the admin panel
-- can read data using the anon key
-- ============================================================================

-- Option 1: Disable RLS entirely (simplest for admin panel)
-- Uncomment these if you want to completely disable RLS

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE salary_advances DISABLE ROW LEVEL SECURITY;
ALTER TABLE cards DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE card_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings DISABLE ROW LEVEL SECURITY;

-- Option 2: Enable RLS with permissive policies (more secure)
-- Comment out Option 1 and uncomment these if you want RLS with policies

/*
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_advances ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create permissive SELECT policies for anon role
CREATE POLICY "Allow anon to read users" ON users FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon to read bank_accounts" ON bank_accounts FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon to read salary_advances" ON salary_advances FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon to read cards" ON cards FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon to read transactions" ON transactions FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon to read card_transactions" ON card_transactions FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon to read admin_users" ON admin_users FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon to read organizations" ON organizations FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon to read audit_logs" ON audit_logs FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon to read system_settings" ON system_settings FOR SELECT TO anon USING (true);

-- Allow anon to UPDATE salary_advances (for approve/reject)
CREATE POLICY "Allow anon to update salary_advances" ON salary_advances FOR UPDATE TO anon USING (true);

-- Allow anon to INSERT audit_logs
CREATE POLICY "Allow anon to insert audit_logs" ON audit_logs FOR INSERT TO anon WITH CHECK (true);
*/

-- Verify RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('users', 'bank_accounts', 'salary_advances', 'admin_users', 'organizations')
ORDER BY tablename;
