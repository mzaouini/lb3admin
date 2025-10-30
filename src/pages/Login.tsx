import { useState } from 'react';
import { LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Demo login with role-based access
    setTimeout(() => {
      let user = null;
      
      if (email === 'maker@libertypay.ma' && password === 'admin123') {
        user = { email, name: 'Operations Maker', role: 'maker' };
      } else if (email === 'checker@libertypay.ma' && password === 'admin123') {
        user = { email, name: 'Admin Checker', role: 'checker' };
      } else if (email === 'support@libertypay.ma' && password === 'admin123') {
        user = { email, name: 'Support Agent', role: 'support' };
      }
      
      if (user) {
        localStorage.setItem('admin_token', 'demo-token-' + Date.now());
        localStorage.setItem('admin_user', JSON.stringify(user));
        onLogin();
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-liberty-navy via-liberty-teal to-liberty-navy flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-liberty-navy">LibertyPay</h1>
          <p className="text-gray-600 mt-2">Admin Panel</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberty-teal focus:border-transparent outline-none"
              placeholder="admin@libertypay.ma"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberty-teal focus:border-transparent outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-liberty-teal hover:bg-liberty-mint text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              'Signing in...'
            ) : (
              <>
                <LogIn size={20} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-semibold mb-2">Demo Credentials (Password: admin123):</p>
          <p className="text-xs text-gray-600">Maker: maker@libertypay.ma</p>
          <p className="text-xs text-gray-600">Checker: checker@libertypay.ma</p>
          <p className="text-xs text-gray-600">Support: support@libertypay.ma</p>
        </div>
      </div>
    </div>
  );
}
