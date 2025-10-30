import { Users, CreditCard, TrendingUp, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockTransactions, mockCompany, mockPendingTransactions } from '../data/mockData';

// Calculate real data from Meryem's transactions
const totalVolume = mockTransactions.reduce((sum, t) => sum + t.amount, 0);
const avgAdvance = Math.round(totalVolume / mockTransactions.length);
const activeAdvances = mockTransactions.filter(t => t.status === 'completed').length;

// Transaction data by month (based on Meryem's transactions)
const transactionData = [
  { month: 'Oct', amount: totalVolume },
];

const statusData = [
  { name: 'Completed', value: mockTransactions.length, color: '#4CAF50' },
  { name: 'Pending', value: mockPendingTransactions.length, color: '#FF9800' },
  { name: 'Rejected', value: 0, color: '#F44336' },
];

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Employees',
      value: mockCompany.totalEmployees.toString(),
      change: '+0%',
      isPositive: true,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Active Advances',
      value: activeAdvances.toString(),
      change: '+0%',
      isPositive: true,
      icon: CreditCard,
      gradient: 'from-liberty-accent to-green-500',
    },
    {
      title: 'Total Volume',
      value: `${totalVolume.toLocaleString()} Dhs`,
      change: '+0%',
      isPositive: true,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Avg. Advance',
      value: `${avgAdvance.toLocaleString()} Dhs`,
      change: '+0%',
      isPositive: true,
      icon: DollarSign,
      gradient: 'from-orange-500 to-orange-600',
    },
  ];

  const recentTransactions = mockTransactions.slice(0, 5).map(t => ({
    id: t.id,
    employee: t.employeeName,
    amount: `${t.amount.toLocaleString()} Dhs`,
    status: t.status,
    date: new Date(t.requestedAt).toLocaleDateString('en-GB'),
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="amount" fill="#00C48C" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Transaction Status</h2>
          <p className="text-sm text-gray-600 mb-4">Distribution by status</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
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
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Transaction ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Employee</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{transaction.id}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-liberty-primary to-liberty-accent flex items-center justify-center text-white font-semibold text-sm">
                        {transaction.employee.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{transaction.employee}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-gray-900">{transaction.amount}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
