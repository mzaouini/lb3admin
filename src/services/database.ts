import { supabase } from '../lib/supabase';
import type { Employee, SalaryAdvance, Transaction, BankAccount, AdminUser } from '../lib/supabase';

// ==================== ADMIN USERS ====================

export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('password', password) // In production, use bcrypt hashing
      .eq('is_active', true)
      .single();

    if (error || !data) {
      console.error('Authentication failed:', error);
      return null;
    }

    // Update last login
    await supabase
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', data.id);

    return data as AdminUser;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function getAllAdminUsers(): Promise<AdminUser[]> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin users:', error);
      return [];
    }

    return data as AdminUser[];
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }
}

// ==================== EMPLOYEES ====================

export async function getAllEmployees(): Promise<Employee[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching employees:', error);
      return [];
    }

    return data as Employee[];
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

export async function getEmployeeById(id: number): Promise<Employee | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching employee:', error);
      return null;
    }

    return data as Employee;
  } catch (error) {
    console.error('Error fetching employee:', error);
    return null;
  }
}

// ==================== SALARY ADVANCES ====================

export async function getAllSalaryAdvances(): Promise<SalaryAdvance[]> {
  try {
    const { data, error } = await supabase
      .from('salary_advances')
      .select('*')
      .order('requested_at', { ascending: false });

    if (error) {
      console.error('Error fetching salary advances:', error);
      return [];
    }

    return data as SalaryAdvance[];
  } catch (error) {
    console.error('Error fetching salary advances:', error);
    return [];
  }
}

export async function getPendingSalaryAdvances(): Promise<SalaryAdvance[]> {
  try {
    const { data, error } = await supabase
      .from('salary_advances')
      .select('*')
      .eq('status', 'pending')
      .order('requested_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending advances:', error);
      return [];
    }

    return data as SalaryAdvance[];
  } catch (error) {
    console.error('Error fetching pending advances:', error);
    return [];
  }
}

export async function approveSalaryAdvance(id: number, approvedBy: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('salary_advances')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error approving salary advance:', error);
      return false;
    }

    // Log audit trail
    await logAuditAction('approve_salary_advance', 'salary_advance', id, approvedBy);

    return true;
  } catch (error) {
    console.error('Error approving salary advance:', error);
    return false;
  }
}

export async function rejectSalaryAdvance(id: number, rejectedBy: string, reason?: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('salary_advances')
      .update({
        status: 'rejected',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error rejecting salary advance:', error);
      return false;
    }

    // Log audit trail
    await logAuditAction('reject_salary_advance', 'salary_advance', id, rejectedBy, reason);

    return true;
  } catch (error) {
    console.error('Error rejecting salary advance:', error);
    return false;
  }
}

// ==================== TRANSACTIONS ====================

export async function getAllTransactions(): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    return data as Transaction[];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function getTransactionsByUserId(userId: number): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user transactions:', error);
      return [];
    }

    return data as Transaction[];
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    return [];
  }
}

// ==================== BANK ACCOUNTS ====================

export async function getBankAccountsByUserId(userId: number): Promise<BankAccount[]> {
  try {
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) {
      console.error('Error fetching bank accounts:', error);
      return [];
    }

    return data as BankAccount[];
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    return [];
  }
}

// ==================== AUDIT LOGS ====================

async function logAuditAction(
  action: string,
  entityType: string,
  entityId: number,
  adminEmail: string,
  details?: string
): Promise<void> {
  try {
    // Get admin user ID from email
    const { data: admin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', adminEmail)
      .single();

    if (!admin) return;

    await supabase.from('audit_logs').insert({
      admin_user_id: admin.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error logging audit action:', error);
  }
}

// ==================== DASHBOARD STATS ====================

export async function getDashboardStats() {
  try {
    // Get total employees
    const { count: totalEmployees } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get active advances (pending, approved, disbursed)
    const { count: activeAdvances } = await supabase
      .from('salary_advances')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'approved', 'disbursed']);

    // Get total volume (sum of all completed advances)
    const { data: completedAdvances } = await supabase
      .from('salary_advances')
      .select('amount')
      .eq('status', 'disbursed');

    const totalVolume = completedAdvances?.reduce((sum, adv) => sum + adv.amount, 0) || 0;

    // Calculate average advance
    const avgAdvance = completedAdvances && completedAdvances.length > 0
      ? Math.round(totalVolume / completedAdvances.length)
      : 0;

    return {
      totalEmployees: totalEmployees || 0,
      activeAdvances: activeAdvances || 0,
      totalVolume,
      avgAdvance,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalEmployees: 0,
      activeAdvances: 0,
      totalVolume: 0,
      avgAdvance: 0,
    };
  }
}

// ==================== SYSTEM SETTINGS ====================

export async function getSystemSettings() {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('key');

    if (error) {
      console.error('Error fetching system settings:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching system settings:', error);
    return [];
  }
}

export async function updateSystemSetting(key: string, value: string, updatedBy: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('system_settings')
      .update({
        value,
        updated_by: updatedBy,
        updated_at: new Date().toISOString(),
      })
      .eq('key', key);

    if (error) {
      console.error('Error updating system setting:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating system setting:', error);
    return false;
  }
}
