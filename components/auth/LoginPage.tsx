import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
  onNavigateToSignUp: () => void;
  onBack: () => void;
  isBangla: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onLoginSuccess, 
  onNavigateToSignUp, 
  onBack,
  isBangla 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      if (email === 'demo@dreambd.com' && password === '123456') {
        onLoginSuccess({
          id: 'u1',
          name: 'Rahim Uddin',
          role: 'Citizen',
          avatar: 'https://i.pravatar.cc/150?u=rahim',
          email: email
        });
      } else {
        setError(isBangla ? 'ইমেল বা পাসওয়ার্ড ভুল' : 'Invalid email or password');
        setLoading(false);
      }
    }, 1000);
  };

  const fillDemoCredentials = () => {
    setEmail('demo@dreambd.com');
    setPassword('123456');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300 cursor-pointer">
          D
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          {isBangla ? 'স্বাগতম' : 'Welcome Back'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isBangla ? 'আপনার অ্যাকাউন্টে প্রবেশ করুন' : 'Sign in to access your account'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-gray-100 relative">
          <button 
            onClick={onBack}
            className="absolute top-4 left-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>

          <form className="space-y-6 mt-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                {isBangla ? 'ইমেল ঠিকানা' : 'Email Address'}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 sm:text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                {isBangla ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 sm:text-sm"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-100 animate-fade-in">
                <div className="flex">
                  <div className="ml-1">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-500/30 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200 hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? (isBangla ? 'লগইন হচ্ছে...' : 'Signing in...') : (isBangla ? 'লগইন করুন' : 'Sign in')}
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-medium">
                  {isBangla ? 'সহজ এক্সেস' : 'Quick Access'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={fillDemoCredentials}
                className="w-full flex items-center justify-center px-4 py-3 border border-brand-200 rounded-xl shadow-sm bg-brand-50/50 text-sm font-medium text-brand-700 hover:bg-brand-50 hover:border-brand-300 transition-all duration-200 group"
              >
                <Sparkles size={18} className="mr-2 text-brand-600 group-hover:text-brand-700" />
                {isBangla ? 'ডেমো ক্রেডেনশিয়াল ব্যবহার করুন' : 'Use Demo Credentials'}
              </button>
              <div className="mt-3 text-center">
                 <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-500 font-mono">
                   demo@dreambd.com
                 </span>
                 <span className="mx-2 text-gray-300">|</span>
                 <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-500 font-mono">
                   123456
                 </span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              {isBangla ? 'অ্যাকাউন্ট নেই?' : "Don't have an account?"} {' '}
              <button onClick={onNavigateToSignUp} className="font-bold text-brand-600 hover:text-brand-500 transition-colors">
                {isBangla ? 'রেজিস্ট্রেশন করুন' : 'Sign up now'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};