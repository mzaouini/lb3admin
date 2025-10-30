import { useState, useMemo } from 'react';
import { Search, Download, CheckCircle, XCircle, Clock, Loader2, Check, X, SlidersHorizontal } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useEmployees } from '../hooks/useEmployees';
import { approveSalaryAdvance, rejectSalaryAdvance } from '../services/database';
import { useAuth } from '../contexts/AuthContext';
import { getRolePermissions } from '../utils/permissions';

type SortField = 'date' | 'amount' | 'employee';
type SortOrder = 'asc' | 'desc';

export default function Transactions() {
  const { user } = useAuth();
  const permissions = user ? getRolePermissions(user.role) : null;
  const { transactions, pendingTransactions, loading, error, refetch } = useTransactions();
  const { employees } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  
  // Sorting
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const allTransactions = [...pendingTransactions, ...transactions];

  // Get unique companies for filter
  const companies = useMemo(() => {
    const uniqueCompanies = new Set(employees.map(emp => emp.company).filter(Boolean));
    return Array.from(uniqueCompanies).sort();
  }, [employees]);

  // Create employee lookup map
  const employeeMap = useMemo(() => {
    const map = new Map();
    employees.forEach(emp => map.set(emp.id, emp));
    return map;
  }, [employees]);

  // Apply filters and sorting
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = allTransactions.filter(tx => {
      // Search filter
      const matchesSearch = 
        tx.id.toString().includes(searchTerm) ||
        tx.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter !== 'all' && tx.status.toLowerCase() !== statusFilter.toLowerCase()) return false;

      // Company filter
      const employee = employeeMap.get(tx.user_id);
      if (companyFilter !== 'all' && employee?.company !== companyFilter) return false;

      // Date range filter
      const txDate = new Date(tx.requested_at);
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        if (txDate < fromDate) return false;
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999); // Include entire day
        if (txDate > toDate) return false;
      }

      // Amount range filter
      if (minAmount && tx.amount < parseInt(minAmount)) return false;
      if (maxAmount && tx.amount > parseInt(maxAmount)) return false;

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'date':
          aValue = new Date(a.requested_at).getTime();
          bValue = new Date(b.requested_at).getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'employee':
          aValue = a.employeeName.toLowerCase();
          bValue = b.employeeName.toLowerCase();
          break;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [allTransactions, searchTerm, statusFilter, companyFilter, dateFrom, dateTo, minAmount, maxAmount, sortField, sortOrder, employeeMap]);

  const handleApprove = async (id: number) => {
    if (!user) return;
    setProcessingId(id);
    const success = await approveSalaryAdvance(id, user.email);
    if (success) {
      await refetch();
    }
    setProcessingId(null);
  };

  const handleReject = async (id: number) => {
    if (!user) return;
    setProcessingId(id);
    const success = await rejectSalaryAdvance(id, user.email, 'Rejected by admin');
    if (success) {
      await refetch();
    }
    setProcessingId(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'disbursed':
        return <CheckCircle size={18} className="text-green-600" />;
      case 'pending':
        return <Clock size={18} className="text-yellow-600" />;
      case 'rejected':
        return <XCircle size={18} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'disbursed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalVolume = transactions
    .filter(tx => tx.status === 'disbursed')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalFees = transactions
    .filter(tx => tx.status === 'disbursed')
    .reduce((sum, tx) => sum + tx.service_fee, 0);

  const clearFilters = () => {
    setStatusFilter('all');
    setCompanyFilter('all');
    setDateFrom('');
    setDateTo('');
    setMinAmount('');
    setMaxAmount('');
  };

  const hasActiveFilters = 
    statusFilter !== 'all' || 
    companyFilter !== 'all' || 
    dateFrom || 
    dateTo || 
    minAmount || 
    maxAmount;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-liberty-teal" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">View and manage all salary advance transactions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Download size={18} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{allTransactions.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Pending Approval</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingTransactions.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Volume</p>
          <p className="text-2xl font-bold text-liberty-teal mt-1">{totalVolume.toLocaleString()} Dhs</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Fees</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalFees.toLocaleString()} Dhs</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by transaction ID or employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberty-teal focus:border-transparent outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-liberty-teal text-white border-liberty-teal'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal size={18} />
            <span>Filters</span>
            {hasActiveFilters && !showFilters && (
              <span className="bg-white text-liberty-teal rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                •
              </span>
            )}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberty-teal focus:border-transparent outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="disbursed">Disbursed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberty-teal focus:border-transparent outline-none"
                >
                  <option value="all">All Companies</option>
                  {companies.map(company => (
                    <option key={company || 'unknown'} value={company || ''}>{company}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberty-teal focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberty-teal focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount (Dhs)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberty-teal focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount (Dhs)</label>
                <input
                  type="number"
                  placeholder="5000"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberty-teal focus:border-transparent outline-none"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X size={18} />
                  <span>Clear Filters</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Sort Options */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (sortField === 'date') {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField('date');
                  setSortOrder('desc');
                }
              }}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                sortField === 'date'
                  ? 'bg-liberty-teal text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Date {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => {
                if (sortField === 'amount') {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField('amount');
                  setSortOrder('desc');
                }
              }}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                sortField === 'amount'
                  ? 'bg-liberty-teal text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Amount {sortField === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => {
                if (sortField === 'employee') {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField('employee');
                  setSortOrder('asc');
                }
              }}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                sortField === 'employee'
                  ? 'bg-liberty-teal text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Employee {sortField === 'employee' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
          <span className="text-sm text-gray-500 ml-auto">
            Showing {filteredAndSortedTransactions.length} of {allTransactions.length} transactions
          </span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm || hasActiveFilters ? 'No transactions found matching your criteria' : 'No transactions yet'}
                  </td>
                </tr>
              ) : (
                filteredAndSortedTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">SA-{tx.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tx.employeeName}</div>
                      <div className="text-sm text-gray-500">{tx.employeeId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{tx.amount.toLocaleString()} Dhs</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tx.service_fee} Dhs</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(tx.status)}
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(tx.requested_at).toLocaleDateString('en-GB')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(tx.requested_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {tx.status === 'pending' && permissions?.canApproveTransaction && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(tx.id)}
                            disabled={processingId === tx.id}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50"
                            title="Approve"
                          >
                            {processingId === tx.id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Check size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(tx.id)}
                            disabled={processingId === tx.id}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      )}
                      {tx.status === 'pending' && user?.role !== 'checker' && (
                        <span className="text-gray-400 text-xs">Awaiting approval</span>
                      )}
                      {tx.status !== 'pending' && (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
