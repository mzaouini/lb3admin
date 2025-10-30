import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-liberty-teal via-liberty-mint to-liberty-teal relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating circles */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 border-4 border-white/20 rounded-2xl rotate-12 animate-spin-slow"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 border-4 border-white/20 rounded-full animate-bounce-slow"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          
          {/* Left side - Branding */}
          <div className="hidden md:block space-y-8 animate-slide-in-left">
            {/* Logo */}
            <div className="inline-block bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img src="/libertypay-logo.svg" alt="LibertyPay Logo" className="w-48 h-24 object-contain" />
            </div>
            
            {/* Tagline */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-white drop-shadow-lg animate-fade-in">
                Welcome to<br />
                <span className="text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  Admin Portal
                </span>
              </h1>
              <p className="text-xl text-white/90 font-medium animate-fade-in-delayed">
                Manage salary advances, employees, and transactions with ease
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-3 animate-fade-in-delayed-2">
              {[
                { icon: '📊', text: 'Real-time Analytics' },
                { icon: '👥', text: 'Employee Management' },
                { icon: '💳', text: 'Transaction Control' },
                { icon: '🔒', text: 'Secure & Compliant' }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 transform hover:translate-x-2 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-3xl">{feature.icon}</span>
                  <span className="text-white font-medium text-lg">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="animate-slide-in-right">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transform hover:shadow-3xl transition-all duration-300">
              {/* Form header */}
              <div className="bg-gradient-to-r from-liberty-primary to-liberty-primary/90 p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-50"></div>
                <div className="relative">
                  <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                  <p className="text-white/90">Sign in to access your admin dashboard</p>
                </div>
              </div>

              {/* Form body */}
              <div className="p-8 space-y-6">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email field */}
                  <div className="space-y-2 transform hover:scale-[1.01] transition-transform">
                    <label className="block text-sm font-semibold text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@libertypay.ma"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-liberty-teal focus:ring-4 focus:ring-liberty-teal/20 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  {/* Password field */}
                  <div className="space-y-2 transform hover:scale-[1.01] transition-transform">
                    <label className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-liberty-teal focus:ring-4 focus:ring-liberty-teal/20 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-liberty-teal to-liberty-mint hover:from-liberty-mint hover:to-liberty-teal text-white font-bold py-4 px-4 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg group"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Demo credentials */}
                <div className="mt-8 p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl space-y-3 transform hover:scale-[1.01] transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🔑</span>
                    <h3 className="font-bold text-gray-800">Demo Credentials</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
                      <span className="font-medium text-gray-600">Maker:</span>
                      <code className="text-liberty-primary font-mono">maker@libertypay.ma</code>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
                      <span className="font-medium text-gray-600">Checker:</span>
                      <code className="text-liberty-primary font-mono">checker@libertypay.ma</code>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
                      <span className="font-medium text-gray-600">Support:</span>
                      <code className="text-liberty-primary font-mono">support@libertypay.ma</code>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-amber-100 rounded-lg mt-3">
                      <span className="font-bold text-gray-700">Password:</span>
                      <code className="text-liberty-primary font-mono font-bold">admin123</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(20px) translateX(-20px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(12deg); }
          to { transform: rotate(372deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out 0.3s both;
        }
        
        .animate-fade-in-delayed {
          animation: fade-in 1s ease-out 0.6s both;
        }
        
        .animate-fade-in-delayed-2 {
          animation: fade-in 1s ease-out 0.9s both;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
