import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Building2, CreditCard, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { getEmployeeById } from '../services/database';
import type { Employee, SalaryAdvance, BankAccount } from '../lib/supabase';
import { supabase } from '../lib/supabase';

export default function EmployeeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [advances, setAdvances] = useState<SalaryAdvance[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployeeData() {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch employee
        const emp = await getEmployeeById(parseInt(id));
        setEmployee(emp);

        if (emp) {
          // Fetch salary advances
          const { data: advancesData } = await supabase
            .from('salary_advances')
            .select('*')
            .eq('user_id', emp.id)
            .order('requested_at', { ascending: false });
          setAdvances(advancesData || []);

          // Fetch bank accounts
          const { data: accountsData } = await supabase
            .from('bank_accounts')
            .select('*')
            .eq('user_id', emp.id);
          setBankAccounts(accountsData || []);
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployeeData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading employee details...</div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-lg mb-4">Employee not found</div>
        <button
          onClick={() => navigate('/employees')}
          className="px-4 py-2 bg-liberty-accent text-white rounded-lg hover:bg-opacity-90"
        >
          Back to Employees
        </button>
      </div>
    );
  }

  const totalAdvanced = advances.reduce((sum, adv) => sum + adv.amount, 0);
  const pendingAdvances = advances.filter(adv => adv.status === 'pending').length;
  const approvedAdvances = advances.filter(adv => adv.status === 'approved' || adv.status === 'disbursed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/employees')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Details</h1>
            <p className="text-gray-600">Complete information and transaction history</p>
          </div>
        </div>
      </div>

      {/* Employee Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-liberty-accent flex items-center justify-center text-white text-2xl font-bold">
            {employee.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{employee.name || 'Unknown'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={18} />
                <span>{employee.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={18} />
                <span>{employee.phone_number || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 size={18} />
                <span>{employee.company || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User size={18} />
                <span>CIN: {employee.national_id || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} />
                <span>{employee.city || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={18} />
                <span>Joined: {new Date(employee.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Monthly Salary</div>
            <div className="text-2xl font-bold text-liberty-accent">
              {employee.net_salary?.toLocaleString()} {employee.currency}
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
              employee.kyc_status === 'verified' ? 'bg-green-100 text-green-800' :
              employee.kyc_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {employee.kyc_status}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Advanced</span>
            <TrendingUp className="text-liberty-accent" size={24} />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalAdvanced.toLocaleString()} Dhs</div>
          <div className="text-sm text-gray-500 mt-1">{advances.length} total advances</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Pending Approvals</span>
            <Calendar className="text-yellow-500" size={24} />
          </div>
          <div className="text-2xl font-bold text-gray-900">{pendingAdvances}</div>
          <div className="text-sm text-gray-500 mt-1">Awaiting review</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Approved Advances</span>
            <CreditCard className="text-green-500" size={24} />
          </div>
          <div className="text-2xl font-bold text-gray-900">{approvedAdvances}</div>
          <div className="text-sm text-gray-500 mt-1">Successfully processed</div>
        </div>
      </div>

      {/* Bank Accounts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Accounts</h3>
        {bankAccounts.length === 0 ? (
          <p className="text-gray-500">No bank accounts registered</p>
        ) : (
          <div className="space-y-3">
            {bankAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="text-liberty-accent" size={24} />
                  <div>
                    <div className="font-medium text-gray-900">{account.account_title}</div>
                    <div className="text-sm text-gray-600">{account.bank_name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-gray-900">{account.account_number}</div>
                  {account.iban && <div className="text-sm text-gray-600">{account.iban}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Salary Advances History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Advances History</h3>
        {advances.length === 0 ? (
          <p className="text-gray-500">No salary advances yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Service Fee</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Disbursed</th>
                </tr>
              </thead>
              <tbody>
                {advances.map((advance) => (
                  <tr key={advance.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {new Date(advance.requested_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {advance.amount.toLocaleString()} Dhs
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {advance.service_fee.toLocaleString()} Dhs
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                      {advance.total_amount.toLocaleString()} Dhs
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        advance.status === 'disbursed' ? 'bg-green-100 text-green-800' :
                        advance.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        advance.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {advance.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {advance.disbursed_at ? new Date(advance.disbursed_at).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
