import { useState, useMemo } from 'react';
import { Plus, Search, Download, Upload, Eye, Loader2, SlidersHorizontal, X } from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';

type SortField = 'name' | 'salary' | 'created_at';
type SortOrder = 'asc' | 'desc';

export default function Employees() {
  const { employees, loading, error } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [companyFilter, setCompanyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  
  // Sorting
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Get unique companies for filter dropdown
  const companies = useMemo(() => {
    const uniqueCompanies = new Set(employees.map(emp => emp.company).filter(Boolean));
    return Array.from(uniqueCompanies).sort();
  }, [employees]);

  // Apply filters and sorting
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter(emp => {
      // Search filter
      const matchesSearch = 
        (emp.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (emp.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (emp.company?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      // Company filter
      if (companyFilter !== 'all' && emp.company !== companyFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && emp.kyc_status !== statusFilter) return false;

      // Salary range filter
      if (minSalary && emp.net_salary && emp.net_salary < parseInt(minSalary)) return false;
      if (maxSalary && emp.net_salary && emp.net_salary > parseInt(maxSalary)) return false;

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'salary':
          aValue = a.net_salary || 0;
          bValue = b.net_salary || 0;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [employees, searchTerm, companyFilter, statusFilter, minSalary, maxSalary, sortField, sortOrder]);

  const activeEmployees = employees.filter(emp => emp.kyc_status === 'verified').length;
  const totalSalary = employees.reduce((sum, emp) => sum + (emp.net_salary || 0), 0);
  const avgSalary = employees.length > 0 ? Math.round(totalSalary / employees.length) : 0;

  const clearFilters = () => {
    setCompanyFilter('all');
    setStatusFilter('all');
    setMinSalary('');
    setMaxSalary('');
  };

  const hasActiveFilters = companyFilter !== 'all' || statusFilter !== 'all' || minSalary || maxSalary;

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
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-1">Manage employee profiles and salary information</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload size={18} />
            <span>Import CSV</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={18} />
            <span>Export</span>
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-liberty-teal text-white rounded-lg hover:bg-liberty-mint transition-colors"
          >
            <Plus size={18} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Employees</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{employees.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{activeEmployees}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total Salary</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalSalary.toLocaleString()} Dhs</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Avg. Salary</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{avgSalary.toLocaleString()} Dhs</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberty-teal focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending KYC</option>
                <option value="in_progress">In Progress</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary (Dhs)</label>
              <input
                type="number"
                placeholder="0"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberty-teal focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Salary (Dhs)</label>
              <input
                type="number"
                placeholder="50000"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberty-teal focus:border-transparent outline-none"
              />
            </div>

            {hasActiveFilters && (
              <div className="md:col-span-4 flex justify-end">
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
                if (sortField === 'name') {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField('name');
                  setSortOrder('asc');
                }
              }}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                sortField === 'name'
                  ? 'bg-liberty-teal text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => {
                if (sortField === 'salary') {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField('salary');
                  setSortOrder('desc');
                }
              }}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                sortField === 'salary'
                  ? 'bg-liberty-teal text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Salary {sortField === 'salary' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => {
                if (sortField === 'created_at') {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField('created_at');
                  setSortOrder('desc');
                }
              }}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                sortField === 'created_at'
                  ? 'bg-liberty-teal text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Join Date {sortField === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
          <span className="text-sm text-gray-500 ml-auto">
            Showing {filteredAndSortedEmployees.length} of {employees.length} employees
          </span>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm || hasActiveFilters ? 'No employees found matching your criteria' : 'No employees yet'}
                  </td>
                </tr>
              ) : (
                filteredAndSortedEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-liberty-teal rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {employee.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">ID: {employee.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.email || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{employee.phone_number || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.company || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{employee.city || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {employee.net_salary?.toLocaleString() || '0'} Dhs
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        employee.kyc_status === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : employee.kyc_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.kyc_status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-liberty-teal hover:text-liberty-mint mr-3">
                        <Eye size={18} />
                      </button>
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
