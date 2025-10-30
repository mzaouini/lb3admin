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
    <div className="min-h-screen bg-gradient-to-br from-liberty-navy via-liberty-teal to-liberty-navy flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Logo Section */}
        <div className="bg-gradient-to-r from-liberty-teal to-liberty-mint p-8 text-center">
          <div className="inline-block bg-white rounded-full p-4 mb-4">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Liberty Pay Logo - Stylized LP with payment card */}
              <circle cx="50" cy="50" r="45" fill="#00C48C" opacity="0.1"/>
              <path d="M25 30 L25 70 L45 70" stroke="#00C48C" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M55 40 C55 35 60 30 65 30 C70 30 75 35 75 40 L75 50 C75 55 70 60 65 60 L55 60" stroke="#1a2332" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="50" y="45" width="30" height="20" rx="3" fill="#00C48C" opacity="0.3"/>
              <line x1="55" y1="52" x2="75" y2="52" stroke="#00C48C" strokeWidth="2" strokeLinecap="round"/>
              <line x1="55" y1="58" x2="70" y2="58" stroke="#00C48C" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">LibertyPay</h1>
          <p className="text-white/90 text-sm">Admin Panel</p>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberty-teal focus:border-transparent outline-none transition-all"
                placeholder="admin@libertypay.ma"
                required
                autoComplete="email"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberty-teal focus:border-transparent outline-none transition-all"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-liberty-teal to-liberty-mint hover:from-liberty-mint hover:to-liberty-teal text-white font-semibold py-4 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-700 font-semibold mb-2">📋 Demo Credentials:</p>
            <div className="space-y-1">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Maker:</span> maker@libertypay.ma
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Checker:</span> checker@libertypay.ma
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Support:</span> support@libertypay.ma
              </p>
              <p className="text-xs text-gray-500 mt-2 italic">
                Password: <span className="font-mono bg-gray-200 px-1 rounded">admin123</span>
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-300">
              💡 Run SETUP_ADMIN_USERS.sql in Supabase first
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
