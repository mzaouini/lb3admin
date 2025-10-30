import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://ublpcmzsdgccxrqgiign.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVibHBjbXpzZGdjY3hycWdpaWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NDIzODcsImV4cCI6MjA3NzMxODM4N30.8y-1rpTAatEYw6_RQTbuKrEuEzszW8sU2KIeNbCzKVo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Employee {
  id: number;
  open_id: string;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  national_id: string | null;
  company: string | null;
  net_salary: number | null;
  currency: string;
  kyc_status: string;
  kyc_completed_at: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
  last_signed_in: string;
}

export interface SalaryAdvance {
  id: number;
  user_id: number;
  amount: number;
  service_fee: number;
  total_amount: number;
  status: string;
  bank_account_id: number | null;
  requested_at: string;
  approved_at: string | null;
  disbursed_at: string | null;
  repaid_at: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  salary_advance_id: number | null;
  type: string;
  amount: number;
  status: string;
  description: string | null;
  reference_number: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface BankAccount {
  id: number;
  user_id: number;
  account_title: string;
  account_number: string;
  bank_name: string;
  iban: string | null;
  is_default: number;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  password: string;
  role: 'maker' | 'checker' | 'support' | 'super_admin';
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}
