import { Users, CreditCard, TrendingUp, DollarSign, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useTransactions } from '../hooks/useTransactions';
import { useOrganization } from '../hooks/useOrganization';

export default function Dashboard() {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { organization } = useOrganization();

  const loading = statsLoading || transactionsLoading;

  // Transaction data by month
  const transactionData = [
    { month: 'Oct', amount: stats.totalVolume },
  ];

  const completedCount = transactions.filter(t => t.status === 'disbursed').length;
  const pendingCount = transactions.filter(t => t.status === 'pending').length;
  const rejectedCount = transactions.filter(t => t.status === 'rejected').length;

  const statusData = [
    { name: 'Completed', value: completedCount, color: '#4CAF50' },
    { name: 'Pending', value: pendingCount, color: '#FF9800' },
    { name: 'Rejected', value: rejectedCount, color: '#F44336' },
  ];

  const dashboardStats = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees.toString(),
      change: '+0%',
      isPositive: true,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Active Advances',
      value: stats.activeAdvances.toString(),
      change: '+0%',
      isPositive: true,
      icon: CreditCard,
      gradient: 'from-liberty-accent to-green-500',
    },
    {
      title: 'Total Volume',
      value: `${stats.totalVolume.toLocaleString()} Dhs`,
      change: '+0%',
      isPositive: true,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Avg. Advance',
      value: `${stats.avgAdvance.toLocaleString()} Dhs`,
      change: '+0%',
      isPositive: true,
      icon: DollarSign,
      gradient: 'from-orange-500 to-orange-600',
    },
  ];

  const recentTransactions = transactions.slice(0, 5).map(t => ({
    id: t.id,
    employee: t.employeeName,
    amount: `${t.amount.toLocaleString()} Dhs`,
    status: t.status,
    date: new Date(t.requested_at).toLocaleDateString('en-GB'),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-liberty-teal" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        {organization && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-liberty-accent flex items-center justify-center text-white text-xl font-bold">
                {organization.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{organization.name}</h3>
                <p className="text-sm text-gray-600">{organization.code}</p>
              </div>
            </div>
            {(organization.contact_email || organization.contact_phone) && (
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
                {organization.contact_email && (
                  <p className="text-sm text-gray-600">📧 {organization.contact_email}</p>
                )}
                {organization.contact_phone && (
                  <p className="text-sm text-gray-600">📞 {organization.contact_phone}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Volume Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Transaction Volume</h2>
          <p className="text-sm text-gray-600 mb-4">Monthly salary advances</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="amount" fill="#00C48C" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Status Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Transaction Status</h2>
          <p className="text-sm text-gray-600 mb-4">Distribution by status</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {statusData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm text-gray-600">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
          <a href="/transactions" className="text-liberty-teal hover:text-liberty-mint text-sm font-semibold">
            View All →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No transactions yet
                  </td>
                </tr>
              ) : (
                recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">SA-{tx.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{tx.employee}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{tx.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        tx.status === 'disbursed' || tx.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : tx.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{tx.date}</td>
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
