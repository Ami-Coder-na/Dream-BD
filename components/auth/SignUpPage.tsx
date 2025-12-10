import React, { useState } from 'react';
import { Mail, Lock, User, Briefcase, ArrowLeft, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { UserRole } from '../../types';

interface SignUpPageProps {
  onSignUpSuccess: (user: any) => void;
  onNavigateToLogin: () => void;
  onBack: () => void;
  isBangla: boolean;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ 
  onSignUpSuccess, 
  onNavigateToLogin, 
  onBack,
  isBangla 
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CITIZEN);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay and account creation
    setTimeout(() => {
      onSignUpSuccess({
        id: `u${Date.now()}`,
        name: name,
        role: role,
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        email: email
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300 cursor-pointer">
          D
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          {isBangla ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isBangla ? 'ড্রিম বিডি প্ল্যাটফর্মে যোগ দিন' : 'Join the Dream BD platform today'}
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

          <form className="space-y-5 mt-6" onSubmit={handleSignUp}>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                {isBangla ? 'আপনার নাম' : 'Full Name'}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 sm:text-sm"
                  placeholder="e.g. Rahim Uddin"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                {isBangla ? 'পেশা নির্বাচন করুন' : 'Account Type'}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Briefcase size={18} className="text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                </div>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 sm:text-sm appearance-none cursor-pointer"
                >
                  <option value={UserRole.CITIZEN}>{isBangla ? 'নাগরিক (Citizen)' : 'Citizen'}</option>
                  <option value={UserRole.FARMER}>{isBangla ? 'কৃষক (Farmer)' : 'Farmer'}</option>
                  <option value={UserRole.VENDOR}>{isBangla ? 'উদ্যোক্তা (Vendor)' : 'Vendor/Artisan'}</option>
                  <option value={UserRole.TEACHER}>{isBangla ? 'শিক্ষক (Teacher)' : 'Teacher'}</option>
                  <option value={UserRole.DOCTOR}>{isBangla ? 'ডাক্তার (Doctor)' : 'Doctor'}</option>
                  <option value={UserRole.TRANSPORT_OP}>{isBangla ? 'পরিবহন চালক (Transport)' : 'Transport Operator'}</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            {/* Email Field */}
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

            {/* Password Field */}
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

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-500/30 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200 hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? (isBangla ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'Creating Account...') : (isBangla ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account')}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              {isBangla ? 'ইতোমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?'} {' '}
              <button onClick={onNavigateToLogin} className="font-bold text-brand-600 hover:text-brand-500 transition-colors">
                {isBangla ? 'লগইন করুন' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};