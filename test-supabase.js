import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ublpcmzsdgccxrqgiign.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVibHBjbXpzZGdjY3hycWdpaWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NDIzODcsImV4cCI6MjA3NzMxODM4N30.8y-1rpTAatEYw6_RQTbuKrEuEzszW8sU2KIeNbCzKVo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection...\n');

  // Test 1: Fetch users
  console.log('1. Testing users table:');
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')
    .limit(5);
  
  if (usersError) {
    console.error('❌ Error fetching users:', usersError);
  } else {
    console.log(`✅ Successfully fetched ${users?.length || 0} users`);
    if (users && users.length > 0) {
      console.log('   First user:', users[0].name);
    }
  }

  // Test 2: Fetch salary advances
  console.log('\n2. Testing salary_advances table:');
  const { data: advances, error: advancesError } = await supabase
    .from('salary_advances')
    .select('*')
    .limit(5);
  
  if (advancesError) {
    console.error('❌ Error fetching salary advances:', advancesError);
  } else {
    console.log(`✅ Successfully fetched ${advances?.length || 0} salary advances`);
  }

  // Test 3: Fetch admin users
  console.log('\n3. Testing admin_users table:');
  const { data: admins, error: adminsError } = await supabase
    .from('admin_users')
    .select('*')
    .limit(5);
  
  if (adminsError) {
    console.error('❌ Error fetching admin users:', adminsError);
  } else {
    console.log(`✅ Successfully fetched ${admins?.length || 0} admin users`);
  }

  // Test 4: Fetch bank accounts
  console.log('\n4. Testing bank_accounts table:');
  const { data: accounts, error: accountsError } = await supabase
    .from('bank_accounts')
    .select('*')
    .limit(5);
  
  if (accountsError) {
    console.error('❌ Error fetching bank accounts:', accountsError);
  } else {
    console.log(`✅ Successfully fetched ${accounts?.length || 0} bank accounts`);
  }

  console.log('\n=== Test Complete ===');
}

testConnection();
