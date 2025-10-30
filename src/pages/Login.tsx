import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        onLogin();
      } else {
        setError('Invalid email or password. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-liberty-teal via-liberty-mint to-liberty-teal flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Logo Section with Green Gradient */}
        <div className="bg-gradient-to-br from-liberty-teal to-liberty-mint p-10 text-center relative">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          
          <div className="relative">
            {/* Logo */}
            <div className="inline-block bg-white rounded-2xl p-5 mb-4 shadow-lg">
              <img src="/libertypay-logo.png" alt="LibertyPay Logo" className="w-20 h-20 object-contain" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">LibertyPay</h1>
            <p className="text-white/95 text-base font-medium">Admin Panel</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Welcome Back</h2>
          <p className="text-gray-600 text-sm text-center mb-6">Sign in to access your admin dashboard</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-liberty-error text-red-700 px-4 py-3 rounded-r-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-liberty-teal focus:border-liberty-teal outline-none transition-all"
                placeholder="admin@libertypay.ma"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-liberty-teal focus:border-liberty-teal outline-none transition-all"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-liberty-teal to-liberty-mint hover:from-liberty-mint hover:to-liberty-teal text-white font-bold py-4 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={22} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-700 font-bold mb-3 flex items-center gap-2">
              <span className="text-lg">🔑</span>
              Demo Credentials
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Maker:</span>
                <span className="text-gray-800 font-mono bg-white px-2 py-1 rounded">maker@libertypay.ma</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Checker:</span>
                <span className="text-gray-800 font-mono bg-white px-2 py-1 rounded">checker@libertypay.ma</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Support:</span>
                <span className="text-gray-800 font-mono bg-white px-2 py-1 rounded">support@libertypay.ma</span>
              </div>
              <div className="pt-2 mt-2 border-t border-gray-300">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">Password:</span>
                  <span className="text-gray-800 font-mono bg-white px-2 py-1 rounded font-bold">admin123</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
