import { Users, CreditCard, TrendingUp, DollarSign, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data
const transactionData = [
  { month: 'Jan', amount: 45000 },
  { month: 'Feb', amount: 52000 },
  { month: 'Mar', amount: 48000 },
  { month: 'Apr', amount: 61000 },
  { month: 'May', amount: 55000 },
  { month: 'Jun', amount: 67000 },
];

const statusData = [
  { name: 'Approved', value: 65, color: '#4CAF50' },
  { name: 'Pending', value: 20, color: '#FF9800' },
  { name: 'Rejected', value: 15, color: '#F44336' },
];

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Employees',
      value: '1,234',
      change: '+12.5%',
      isPositive: true,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Active Advances',
      value: '456',
      change: '+8.2%',
      isPositive: true,
      icon: CreditCard,
      gradient: 'from-liberty-accent to-green-500',
    },
    {
      title: 'Total Volume',
      value: '67,000 Dhs',
      change: '+15.3%',
      isPositive: true,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Avg. Advance',
      value: '2,450 Dhs',
      change: '-2.1%',
      isPositive: false,
      icon: DollarSign,
      gradient: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg ${stat.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Volume Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Transaction Volume</h2>
              <p className="text-sm text-gray-500 mt-1">Monthly salary advances</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-liberty-accent focus:border-transparent outline-none">
              <option>Last 6 months</option>
              <option>Last year</option>
              <option>All time</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#999" style={{ fontSize: '12px' }} />
              <YAxis stroke="#999" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="amount" fill="#00C48C" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Request Status</h2>
            <p className="text-sm text-gray-500 mt-1">Current distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-3">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600 font-medium">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <p className="text-sm text-gray-500 mt-1">Latest salary advance requests</p>
          </div>
          <button className="text-sm text-liberty-accent hover:text-liberty-accent/80 font-semibold">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {[
                { name: 'Ahmed El Mansouri', amount: '2,500 Dhs', status: 'Approved', date: '2025-10-30', time: '14:23' },
                { name: 'Fatima Zahra', amount: '1,800 Dhs', status: 'Pending', date: '2025-10-30', time: '15:45' },
                { name: 'Mohammed Alami', amount: '3,200 Dhs', status: 'Approved', date: '2025-10-29', time: '10:12' },
                { name: 'Sara Bennani', amount: '2,100 Dhs', status: 'Approved', date: '2025-10-29', time: '11:30' },
                { name: 'Youssef Idrissi', amount: '1,500 Dhs', status: 'Rejected', date: '2025-10-28', time: '16:20' },
              ].map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-liberty-primary to-liberty-accent flex items-center justify-center text-white font-semibold text-sm">
                        {transaction.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-semibold text-gray-900">{transaction.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-gray-900">{transaction.amount}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg ${
                      transaction.status === 'Approved' ? 'bg-green-50 text-green-700' :
                      transaction.status === 'Pending' ? 'bg-orange-50 text-orange-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        transaction.status === 'Approved' ? 'bg-green-500' :
                        transaction.status === 'Pending' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}></div>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Clock size={14} />
                      <span>{transaction.date} {transaction.time}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
