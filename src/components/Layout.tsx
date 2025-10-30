import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileText, 
  Settings, 
  UserCog,
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getRoleDisplayName, getRoleBadgeColor, getRolePermissions } from '../utils/permissions';

interface LayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

interface MenuItem {
  path: string;
  label: string;
  icon: any;
  requiresPermission?: keyof ReturnType<typeof getRolePermissions> | null;
}

const menuItems: MenuItem[] = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, requiresPermission: null },
  { path: '/employees', label: 'Employees', icon: Users, requiresPermission: 'canViewEmployees' },
  { path: '/transactions', label: 'Transactions', icon: CreditCard, requiresPermission: 'canViewTransactions' },
  { path: '/cards', label: 'Card Management', icon: CreditCard, requiresPermission: 'canViewCards' },
  { path: '/reports', label: 'Reports', icon: FileText, requiresPermission: 'canViewReports' },
  { path: '/settings', label: 'Settings', icon: Settings, requiresPermission: null },
  { path: '/admin-users', label: 'Admin Users', icon: UserCog, requiresPermission: 'canManageUsers' },
];

export default function Layout({ children, onLogout }: LayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  const permissions = user ? getRolePermissions(user.role) : null;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    onLogout();
  };

  // Filter menu items based on permissions
  const visibleMenuItems = menuItems.filter(item => {
    if (!item.requiresPermission) return true;
    if (!permissions) return false;
    return permissions[item.requiresPermission];
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-liberty-primary hidden lg:flex flex-col transition-all duration-300 fixed h-full z-30`}>
        {/* Logo */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <img src="/libertypay-logo.svg" alt="LibertyPay" className="w-24 h-10 object-contain" />
              <div>
                <h1 className="text-xl font-bold text-liberty-accent">LibertyPay</h1>
                <p className="text-xs text-liberty-text-secondary">Admin Portal</p>
              </div>
            </div>
          ) : (
            <img src="/libertypay-logo.svg" alt="LibertyPay" className="w-16 h-8 object-contain" />
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-liberty-accent text-white shadow-lg shadow-liberty-accent/30'
                    : 'text-liberty-text-secondary hover:bg-white/10 hover:text-white'
                }`}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <Icon size={20} />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User info and logout */}
        <div className="p-4 border-t border-white/10">
          {isSidebarOpen && user && (
            <div className="mb-3 px-4 py-2 bg-white/10 rounded-lg">
              <p className="text-xs text-liberty-text-secondary">Logged in as</p>
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded ${getRoleBadgeColor(user.role)}`}>
                {getRoleDisplayName(user.role)}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-liberty-text-secondary hover:bg-white/10 hover:text-white transition-all w-full"
            title={!isSidebarOpen ? 'Logout' : undefined}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Mobile Sidebar */}
      <aside className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-liberty-primary lg:hidden flex flex-col transition-transform duration-300 fixed h-full z-50`}>
        {/* Logo */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div>
            <h1 className="text-xl font-bold text-liberty-accent">LibertyPay</h1>
            <p className="text-xs text-liberty-text-secondary">Admin Portal</p>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-liberty-accent text-white shadow-lg shadow-liberty-accent/30'
                    : 'text-liberty-text-secondary hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info and logout */}
        <div className="p-4 border-t border-white/10">
          {user && (
            <div className="mb-3 px-4 py-2 bg-white/10 rounded-lg">
              <p className="text-xs text-liberty-text-secondary">Logged in as</p>
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded ${getRoleBadgeColor(user.role)}`}>
                {getRoleDisplayName(user.role)}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-liberty-text-secondary hover:bg-white/10 hover:text-white transition-all w-full"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300`}>
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            
            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search employees, transactions..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberty-accent focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 rounded-full bg-liberty-accent flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">{user ? getRoleDisplayName(user.role) : 'Admin'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
