
import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, CheckCircle, Sparkles, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useData } from '../../contexts/DataContext';
import { supabase } from '../../services/supabaseClient';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
  onNavigateToSignUp: () => void;
  onBack: () => void;
  isBangla: boolean;
}

type AuthView = 'login' | 'forgot_password' | 'set_new_password';

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onLoginSuccess, 
  onNavigateToSignUp, 
  onBack,
  isBangla 
}) => {
  const { resetPassword } = useData(); 
  const [currentView, setCurrentView] = useState<AuthView>('login');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resetMessage, setResetMessage] = useState('');
  
  // Set New Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- LOGIN LOGIC ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    try {
      // Secure Login: Query DB directly for specific user match
      // This prevents downloading the entire user list to the client
      const { data: registeredUser, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('email', trimmedEmail)
        .eq('password', trimmedPassword)
        .maybeSingle();

      if (registeredUser) {
        if (registeredUser.status === 'Suspended') {
            setError(isBangla ? 'আপনার অ্যাকাউন্ট স্থগিত করা হয়েছে। প্রশাসকের সাথে যোগাযোগ করুন।' : 'Your account has been suspended. Please contact admin.');
        } else {
            onLoginSuccess(registeredUser);
        }
      } else {
        setError(isBangla ? 'ভুল ইমেইল বা পাসওয়ার্ড।' : 'Invalid email or password.');
      }
    } catch (err) {
      console.error(err);
      setError(isBangla ? 'লগইন করতে সমস্যা হচ্ছে।' : 'Login failed. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  // --- FORGOT PASSWORD: STEP 1 (VERIFY EMAIL) ---
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus('loading');
    setResetMessage('');

    const trimmedEmail = resetEmail.trim();

    try {
        const { data } = await supabase
          .from('users')
          .select('email')
          .eq('email', trimmedEmail)
          .maybeSingle();

        if (data) {
            setResetStatus('success');
            setCurrentView('set_new_password');
        } else {
            setResetStatus('error');
            setResetMessage(isBangla 
                ? 'এই ইমেইল ঠিকানাটি আমাদের সিস্টেমে নিবন্ধিত নয়।' 
                : 'This email address is not registered in our system.');
        }
    } catch (err) {
        setResetStatus('error');
        setResetMessage('Network error');
    }
  };

  // --- FORGOT PASSWORD: STEP 2 (SET NEW PASSWORD) ---
  const handleSetNewPassword = (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword.length < 6) {
          setResetMessage(isBangla ? 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
          return;
      }
      if (newPassword !== confirmPassword) {
          setResetMessage(isBangla ? 'পাসওয়ার্ড মিলছে না।' : 'Passwords do not match.');
          return;
      }

      setResetStatus('loading');
      
      setTimeout(() => {
          resetPassword(resetEmail, newPassword);
          setResetStatus('success');
          // Wait a moment then go back to login
          setTimeout(() => {
              setCurrentView('login');
              setResetStatus('idle');
              setResetEmail('');
              setNewPassword('');
              setConfirmPassword('');
              setEmail(resetEmail); // Auto fill login
              setResetMessage('');
          }, 2000);
      }, 1000);
  };

  // --- RENDER: SET NEW PASSWORD VIEW ---
  if (currentView === 'set_new_password') {
    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans animate-fade-in">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-gray-100 relative">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                            <Lock size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{isBangla ? 'নতুন পাসওয়ার্ড দিন' : 'Set New Password'}</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            {isBangla ? 'আপনার অ্যাকাউন্টের জন্য নতুন পাসওয়ার্ড সেট করুন।' : 'Create a new password for your account.'}
                        </p>
                    </div>

                    {resetStatus === 'success' ? (
                        <div className="text-center animate-fade-in">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{isBangla ? 'পাসওয়ার্ড পরিবর্তন সফল!' : 'Password Changed!'}</h3>
                            <p className="text-gray-500 text-sm mb-6">{isBangla ? 'আপনাকে লগইন পেজে নিয়ে যাওয়া হচ্ছে...' : 'Redirecting to login...'}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSetNewPassword} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {isBangla ? 'নতুন পাসওয়ার্ড' : 'New Password'}
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-black focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {isBangla ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-black focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            {resetMessage && (
                                <div className="text-red-600 text-sm font-medium text-center">
                                    {resetMessage}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={resetStatus === 'loading'}
                                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-500/20"
                            >
                                {resetStatus === 'loading' 
                                    ? (isBangla ? 'পরিবর্তন হচ্ছে...' : 'Updating...') 
                                    : (isBangla ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Update Password')}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
  }

  // --- RENDER: FORGOT PASSWORD VIEW (EMAIL ENTRY) ---
  if (currentView === 'forgot_password') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans animate-fade-in">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-gray-100 relative">
                    <button 
                        onClick={() => { setCurrentView('login'); setResetStatus('idle'); setResetEmail(''); setResetMessage(''); }}
                        className="absolute top-4 left-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="text-center mb-8">
                        <div className="mx-auto w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
                            <KeyRound size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{isBangla ? 'পাসওয়ার্ড পুনরুদ্ধার' : 'Reset Password'}</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            {isBangla 
                                ? 'আপনার নিবন্ধিত ইমেইল দিন। আমরা যাচাই করে পাসওয়ার্ড পরিবর্তনের সুযোগ দেব।' 
                                : 'Enter your registered email to verify and reset your password.'}
                        </p>
                    </div>

                    <form onSubmit={handleVerifyEmail} className="space-y-6">
                        <div>
                            <label htmlFor="reset-email" className="block text-sm font-semibold text-gray-700 mb-2">
                                {isBangla ? 'ইমেল ঠিকানা' : 'Email Address'}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                                </div>
                                <input
                                    id="reset-email"
                                    type="email"
                                    required
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 text-black focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 sm:text-sm"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        {resetStatus === 'error' && (
                            <div className="rounded-xl bg-red-50 p-3 border border-red-100 flex items-center gap-2 text-red-700 text-sm">
                                <AlertCircle size={16} />
                                {resetMessage}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={resetStatus === 'loading'}
                            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
                        >
                            {resetStatus === 'loading' 
                                ? (isBangla ? 'যাচাই করা হচ্ছে...' : 'Verifying...') 
                                : <>{isBangla ? 'পরবর্তী ধাপ' : 'Next Step'} <ArrowRight size={18} /></>}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
      );
  }

  // --- RENDER: LOGIN VIEW ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans animate-fade-in">
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 text-black focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 sm:text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    {isBangla ? 'পাসওয়ার্ড' : 'Password'}
                </label>
                <button 
                    type="button"
                    onClick={() => setCurrentView('forgot_password')}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
                >
                    {isBangla ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                </button>
              </div>
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
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 text-black focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 sm:text-sm"
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
              <div className="rounded-xl bg-red-50 p-4 border border-red-100 animate-fade-in flex items-start gap-3">
                <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
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