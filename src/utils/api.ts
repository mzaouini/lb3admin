// API utilities for fetching data from the database
// In a real app, these would be API endpoints

export interface Employee {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  company: string;
  netSalary: number;
  kycStatus: string;
  createdAt: string;
}

export interface Transaction {
  id: number;
  userId: number;
  amount: number;
  serviceFee: number;
  totalAmount: number;
  status: string;
  requestedAt: string;
  approvedAt?: string;
  referenceNumber?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeAdvances: number;
  totalVolume: number;
  avgAdvance: number;
  pendingApprovals: number;
}

// Mock API functions - in production these would call real endpoints
export const api = {
  async getEmployees(): Promise<Employee[]> {
    // This would fetch from /api/employees
    return [];
  },

  async getTransactions(): Promise<Transaction[]> {
    // This would fetch from /api/transactions
    return [];
  },

  async getDashboardStats(): Promise<DashboardStats> {
    // This would fetch from /api/dashboard/stats
    return {
      totalEmployees: 0,
      activeAdvances: 0,
      totalVolume: 0,
      avgAdvance: 0,
      pendingApprovals: 0,
    };
  },

  async approveTransaction(id: number): Promise<void> {
    // This would POST to /api/transactions/:id/approve
    console.log('Approving transaction:', id);
  },

  async rejectTransaction(id: number): Promise<void> {
    // This would POST to /api/transactions/:id/reject
    console.log('Rejecting transaction:', id);
  },
};

// Helper to format currency
export const formatCurrency = (amount: number, currency: string = 'Dhs'): string => {
  return `${amount.toLocaleString()} ${currency}`;
};

// Helper to format date
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Helper to format datetime
export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
