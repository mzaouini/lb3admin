import { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Search, 
  Unlock, 
  Ban, 
  RotateCcw, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  Snowflake,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Activity,
  Grid3x3,
  List,
  MoreVertical
} from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { useAuth } from '../contexts/AuthContext';
import { getRolePermissions } from '../utils/permissions';

interface Card {
  id: number;
  cardNumber: string;
  cardHolderName: string;
  userId: number;
  status: 'active' | 'frozen' | 'blocked' | 'pending';
  balance: number;
  expiryDate: string;
  cvv: string;
  issueDate: string;
  lastTransaction: string | null;
  transactionCount: number;
  monthlySpend: number;
}

// Mock card data generator based on existing users
function generateMockCards(employees: any[]): Card[] {
  const cardStatuses: Card['status'][] = ['active', 'active', 'active', 'frozen', 'blocked', 'pending'];
  
  return employees.slice(0, 15).map((emp, index) => {
    const cardNumber = `5335 7600 ${String(index).padStart(4, '0')} ${String(1000 + index).slice(-4)}`;
    const issueDate = new Date(2024, Math.floor(Math.random() * 12), 1);
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 3);
    
    return {
      id: index + 1,
      cardNumber,
      cardHolderName: emp.name || 'Unknown',
      userId: emp.id,
      status: cardStatuses[index % cardStatuses.length],
      balance: Math.floor(Math.random() * 5000) + 500,
      expiryDate: `${String(expiryDate.getMonth() + 1).padStart(2, '0')}/${expiryDate.getFullYear().toString().slice(-2)}`,
      cvv: String(Math.floor(Math.random() * 900) + 100),
      issueDate: issueDate.toISOString(),
      lastTransaction: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
      transactionCount: Math.floor(Math.random() * 50) + 5,
      monthlySpend: Math.floor(Math.random() * 3000) + 200,
    };
  });
}

export default function CardManagement() {
  const { user } = useAuth();
  const permissions = user ? getRolePermissions(user.role) : null;
  const { employees } = useEmployees();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('cardViewMode') as 'grid' | 'list') || 'grid';
  });

  // Toggle view mode and persist to localStorage
  const toggleViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('cardViewMode', mode);
  };

  // Generate mock cards from employees
  const cards = useMemo(() => generateMockCards(employees), [employees]);

  // Create employee lookup map
  const employeeMap = useMemo(() => {
    const map = new Map();
    employees.forEach(emp => map.set(emp.id, emp));
    return map;
  }, [employees]);

  // Filter cards with enhanced employee details search
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const employee = employeeMap.get(card.userId);
      
      // Enhanced search: card number (full + last 4), cardholder name, employee details
      const last4Digits = card.cardNumber.slice(-4);
      const matchesSearch = searchTerm === '' || 
        card.cardHolderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.cardNumber.includes(searchTerm) ||
        last4Digits.includes(searchTerm) ||
        employee?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee?.phone_number?.includes(searchTerm) ||
        employee?.company?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || card.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [cards, searchTerm, statusFilter, employeeMap]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: cards.length,
      active: cards.filter(c => c.status === 'active').length,
      frozen: cards.filter(c => c.status === 'frozen').length,
      blocked: cards.filter(c => c.status === 'blocked').length,
      totalBalance: cards.reduce((sum, c) => sum + c.balance, 0),
      monthlyVolume: cards.reduce((sum, c) => sum + c.monthlySpend, 0),
    };
  }, [cards]);

  const getStatusIcon = (status: Card['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'frozen':
        return <Snowflake size={16} className="text-blue-600" />;
      case 'blocked':
        return <Ban size={16} className="text-red-600" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status: Card['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'frozen':
        return 'bg-blue-100 text-blue-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleActivateCard = (card: Card) => {
    if (!permissions?.canActivateCard) return;
    // TODO: API call to activate card
    alert(`Activating card ${card.cardNumber.slice(-4)} for ${card.cardHolderName}`);
  };

  const handleFreezeCard = (card: Card) => {
    if (!permissions?.canActivateCard) return;
    // TODO: API call to freeze card
    alert(`Freezing card ${card.cardNumber.slice(-4)} for ${card.cardHolderName}`);
  };

  const handleUnfreezeCard = (card: Card) => {
    if (!permissions?.canActivateCard) return;
    // TODO: API call to unfreeze card
    alert(`Unfreezing card ${card.cardNumber.slice(-4)} for ${card.cardHolderName}`);
  };

  const handleBlockCard = (card: Card) => {
    if (!permissions?.canBlockCard) return;
    if (confirm(`Are you sure you want to PERMANENTLY BLOCK this card? This action cannot be undone.\n\nCard: ${card.cardNumber}\nHolder: ${card.cardHolderName}`)) {
      // TODO: API call to block card
      alert(`Card ${card.cardNumber.slice(-4)} has been permanently blocked`);
    }
  };

  const handleResetPin = (card: Card) => {
    if (!permissions?.canActivateCard) return;
    setSelectedCard(card);
    setShowPinModal(true);
  };

  const handleViewDetails = (card: Card) => {
    setSelectedCard(card);
    setShowCardDetails(true);
    setShowCVV(false);
  };

  const confirmPinReset = () => {
    if (!selectedCard) return;
    // TODO: API call to reset PIN (will integrate with NAPS)
    alert(`PIN reset initiated for card ${selectedCard.cardNumber.slice(-4)}. New PIN will be sent to cardholder via SMS.`);
    setShowPinModal(false);
    setSelectedCard(null);
  };

  if (!permissions?.canViewCards) {
    return (
      <div className="text-center py-12">
        <AlertTriangle size={48} className="mx-auto text-yellow-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to view card management.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Card Management</h1>
          <p className="text-gray-600 mt-1">Manage user cards, balances, and NAPS integration</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <Activity size={18} className="text-blue-600" />
          <span className="text-sm font-medium text-blue-900">NAPS Integration Ready</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cards</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Cards</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {stats.frozen} frozen, {stats.blocked} blocked
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-liberty-teal mt-1">{stats.totalBalance.toLocaleString()} Dhs</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-teal-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Volume</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.monthlyVolume.toLocaleString()} Dhs</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, card number, email, phone, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberty-teal focus:border-transparent outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberty-teal focus:border-transparent outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="frozen">Frozen</option>
            <option value="blocked">Blocked</option>
            <option value="pending">Pending</option>
          </select>
          
          {/* View Toggle */}
          <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => toggleViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-liberty-teal text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Grid View"
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => toggleViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-liberty-teal text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCards.map((card) => (
          <div key={card.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Card Visual */}
            <div className="bg-gradient-to-br from-[#00C48C] via-[#00D9A3] to-[#00E5B8] p-6 text-white relative overflow-hidden rounded-t-2xl">
              {/* Curved wave pattern */}
              <div className="absolute top-0 right-0 w-full h-full opacity-20">
                <svg viewBox="0 0 400 250" className="w-full h-full">
                  <path d="M0,100 Q100,50 200,100 T400,100 L400,0 L0,0 Z" fill="white" opacity="0.3"/>
                  <path d="M0,140 Q100,90 200,140 T400,140 L400,0 L0,0 Z" fill="white" opacity="0.2"/>
                  <path d="M0,180 Q100,130 200,180 T400,180 L400,0 L0,0 Z" fill="white" opacity="0.1"/>
                </svg>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  {/* NAPS logo and LibertyPay branding */}
                  <div className="flex items-center gap-3">
                    <span className="text-[#FF9800] font-bold text-xl">naps</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-0.5">
                      <div className="w-8 h-1 bg-[#FF9800] rounded"></div>
                      <div className="w-8 h-1 bg-[#FF9800] rounded"></div>
                      <div className="w-8 h-1 bg-[#FF9800] rounded"></div>
                    </div>
                    <span className="font-bold text-lg">LibertyPay</span>
                  </div>
                </div>
                
                {/* Chip icon */}
                <div className="mb-8">
                  <div className="w-12 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-0.5">
                      <div className="w-1 h-1 bg-yellow-800 rounded-full"></div>
                      <div className="w-1 h-1 bg-yellow-800 rounded-full"></div>
                      <div className="w-1 h-1 bg-yellow-800 rounded-full"></div>
                      <div className="w-1 h-1 bg-yellow-800 rounded-full"></div>
                      <div className="w-1 h-1 bg-yellow-800 rounded-full"></div>
                      <div className="w-1 h-1 bg-yellow-800 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <CreditCard size={16} />
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(card.status)}
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(card.status)}`}>
                      {card.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="font-mono text-lg tracking-wider">
                    {card.cardNumber}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/80 mb-1">© Client - {card.userId.toString().padStart(9, '0')}</p>
                      <p className="font-bold text-base uppercase">{card.cardHolderName}</p>
                    </div>
                    <div className="text-right">
                      {/* Mastercard logo */}
                      <div className="flex items-center gap-0.5">
                        <div className="w-8 h-8 bg-[#EB001B] rounded-full opacity-90"></div>
                        <div className="w-8 h-8 bg-[#FF9800] rounded-full opacity-90 -ml-4"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right mt-2">
                    <p className="text-xs text-white/70">Expires</p>
                    <p className="font-semibold">{card.expiryDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Info */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Balance</span>
                <span className="text-lg font-bold text-liberty-teal">{card.balance.toLocaleString()} Dhs</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Transactions</span>
                <span className="font-semibold text-gray-900">{card.transactionCount}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Monthly Spend</span>
                <span className="font-semibold text-gray-900">{card.monthlySpend.toLocaleString()} Dhs</span>
              </div>

              {card.lastTransaction && (
                <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                  Last transaction: {new Date(card.lastTransaction).toLocaleDateString('en-GB')}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleViewDetails(card)}
                  className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye size={16} className="mx-auto" />
                </button>

                {card.status === 'pending' && permissions?.canActivateCard && (
                  <button
                    onClick={() => handleActivateCard(card)}
                    className="flex-1 px-3 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                    title="Activate Card"
                  >
                    <CheckCircle size={16} className="mx-auto" />
                  </button>
                )}

                {card.status === 'active' && permissions?.canActivateCard && (
                  <button
                    onClick={() => handleFreezeCard(card)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                    title="Freeze Card"
                  >
                    <Snowflake size={16} className="mx-auto" />
                  </button>
                )}

                {card.status === 'frozen' && permissions?.canActivateCard && (
                  <button
                    onClick={() => handleUnfreezeCard(card)}
                    className="flex-1 px-3 py-2 text-sm bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg transition-colors"
                    title="Unfreeze Card"
                  >
                    <Unlock size={16} className="mx-auto" />
                  </button>
                )}

                {card.status !== 'blocked' && permissions?.canActivateCard && (
                  <button
                    onClick={() => handleResetPin(card)}
                    className="flex-1 px-3 py-2 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
                    title="Reset PIN"
                  >
                    <RotateCcw size={16} className="mx-auto" />
                  </button>
                )}

                {card.status !== 'blocked' && permissions?.canBlockCard && (
                  <button
                    onClick={() => handleBlockCard(card)}
                    className="flex-1 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                    title="Block Card"
                  >
                    <Ban size={16} className="mx-auto" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Card (Last 4)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cardholder
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Spend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCards.map((card) => {
                const employee = employeeMap.get(card.userId);
                const last4 = card.cardNumber.slice(-4);
                
                return (
                  <tr key={card.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-gray-400" />
                        <span className="font-mono font-semibold text-gray-900">**** {last4}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{card.cardHolderName}</div>
                      <div className="text-sm text-gray-500">ID: {card.userId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{employee?.email || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{employee?.phone_number || 'N/A'}</div>
                      {employee?.company && (
                        <div className="text-xs text-gray-400 mt-1">{employee.company}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(card.status)}
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(card.status)}`}>
                          {card.status.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-liberty-teal">{card.balance.toLocaleString()} Dhs</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{card.monthlySpend.toLocaleString()} Dhs</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{card.expiryDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(card)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {permissions?.canActivateCard && card.status !== 'blocked' && (
                          <div className="relative group">
                            <button
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="More Actions"
                            >
                              <MoreVertical size={16} />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-10">
                              {card.status === 'pending' && (
                                <button
                                  onClick={() => handleActivateCard(card)}
                                  className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center gap-2"
                                >
                                  <CheckCircle size={16} /> Activate
                                </button>
                              )}
                              {card.status === 'active' && (
                                <button
                                  onClick={() => handleFreezeCard(card)}
                                  className="w-full px-4 py-2 text-left text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                                >
                                  <Snowflake size={16} /> Freeze
                                </button>
                              )}
                              {card.status === 'frozen' && (
                                <button
                                  onClick={() => handleUnfreezeCard(card)}
                                  className="w-full px-4 py-2 text-left text-sm text-teal-700 hover:bg-teal-50 flex items-center gap-2"
                                >
                                  <Unlock size={16} /> Unfreeze
                                </button>
                              )}
                              <button
                                onClick={() => handleResetPin(card)}
                                className="w-full px-4 py-2 text-left text-sm text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                              >
                                <RotateCcw size={16} /> Reset PIN
                              </button>
                              {permissions?.canBlockCard && (
                                <button
                                  onClick={() => handleBlockCard(card)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                                >
                                  <Ban size={16} /> Block Card
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {filteredCards.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
          <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No cards found matching your criteria</p>
        </div>
      )}

      {/* PIN Reset Modal */}
      {showPinModal && selectedCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <RotateCcw size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Reset PIN</h3>
                <p className="text-sm text-gray-600">Card ending in {selectedCard.cardNumber.slice(-4)}</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex gap-2">
                <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-900">
                  <p className="font-semibold mb-1">Security Notice</p>
                  <p>A new 4-digit PIN will be generated and sent to the cardholder via SMS. The old PIN will be immediately invalidated.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cardholder:</span>
                <span className="font-semibold text-gray-900">{selectedCard.cardHolderName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Card Number:</span>
                <span className="font-mono font-semibold text-gray-900">{selectedCard.cardNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(selectedCard.status)}`}>
                  {selectedCard.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setSelectedCard(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPinReset}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Details Modal */}
      {showCardDetails && selectedCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Card Details</h3>
              <button
                onClick={() => {
                  setShowCardDetails(false);
                  setSelectedCard(null);
                  setShowCVV(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Card Visual */}
              <div className="bg-gradient-to-br from-[#00C48C] via-[#00D9A3] to-[#00E5B8] p-6 text-white rounded-2xl relative overflow-hidden">
                {/* Curved wave pattern */}
                <div className="absolute top-0 right-0 w-full h-full opacity-20">
                  <svg viewBox="0 0 400 250" className="w-full h-full">
                    <path d="M0,100 Q100,50 200,100 T400,100 L400,0 L0,0 Z" fill="white" opacity="0.3"/>
                    <path d="M0,140 Q100,90 200,140 T400,140 L400,0 L0,0 Z" fill="white" opacity="0.2"/>
                    <path d="M0,180 Q100,130 200,180 T400,180 L400,0 L0,0 Z" fill="white" opacity="0.1"/>
                  </svg>
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    {/* NAPS logo and LibertyPay branding */}
                    <div className="flex items-center gap-3">
                      <span className="text-[#FF9800] font-bold text-xl">naps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <div className="w-8 h-1 bg-[#FF9800] rounded"></div>
                        <div className="w-8 h-1 bg-[#FF9800] rounded"></div>
                        <div className="w-8 h-1 bg-[#FF9800] rounded"></div>
                      </div>
                      <span className="font-bold text-lg">LibertyPay</span>
                    </div>
                  </div>
                  
                  {/* Chip icon */}
                  <div className="mb-4">
                    <div className="w-12 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-0.5">
                        <div className="w-1 h-1 bg-yellow-800 rounded-full"></div>
                        <div className="w-1 h-1 bg-yellow-800 rounded-full"></div>
                        <div className="w-1 h-1 bg-yellow-800 rounded-full"></div>
                        <div className="w-1 h-1 bg-yellow-800 rounded-full"></div>
                        <div className="w-1 h-1 bg-yellow-800 rounded-full"></div>
                        <div className="w-1 h-1 bg-yellow-800 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="font-mono text-xl tracking-wider">{selectedCard.cardNumber}</div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/80 mb-1">© Client - {selectedCard.userId.toString().padStart(9, '0')}</p>
                      <p className="font-bold text-base uppercase">{selectedCard.cardHolderName}</p>
                    </div>
                    <div className="text-right">
                      {/* Mastercard logo */}
                      <div className="flex items-center gap-0.5">
                        <div className="w-8 h-8 bg-[#EB001B] rounded-full opacity-90"></div>
                        <div className="w-8 h-8 bg-[#FF9800] rounded-full opacity-90 -ml-4"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/70">Expires</p>
                      <p className="font-semibold">{selectedCard.expiryDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/70">CVV</p>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold font-mono">{showCVV ? selectedCard.cvv : '***'}</p>
                        <button
                          onClick={() => setShowCVV(!showCVV)}
                          className="p-1 hover:bg-white/20 rounded"
                        >
                          {showCVV ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded ${getStatusColor(selectedCard.status)}`}>
                      {selectedCard.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                  <p className="text-2xl font-bold text-liberty-teal">{selectedCard.balance.toLocaleString()} Dhs</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Monthly Spend</p>
                  <p className="text-2xl font-bold text-orange-600">{selectedCard.monthlySpend.toLocaleString()} Dhs</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedCard.transactionCount}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Issue Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(selectedCard.issueDate).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>

              {/* NAPS Integration Status */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={20} className="text-blue-600" />
                  <span className="font-semibold text-blue-900">NAPS Platform Status</span>
                </div>
                <p className="text-sm text-blue-800">
                  This card is ready for NAPS platform integration. All operations (PIN reset, freeze, block) will be synchronized with NAPS in real-time.
                </p>
              </div>

              {/* Recent Transactions Preview */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Recent Transactions</h4>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Transaction #{selectedCard.id}00{i}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                      <span className="font-bold text-gray-900">-{(Math.random() * 500 + 50).toFixed(2)} Dhs</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
