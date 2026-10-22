import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, KeyRound, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { authService, UserRole } from '../services/authService';
import { isSupabaseConfigured } from '../services/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialRole = 'owner',
}) => {
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  if (!isOpen) return null;

  const isConnected = isSupabaseConfigured();

  const handleQuickDemoFill = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'owner') {
      setEmail('director@aurumsalonflow.co.ke');
      setPassword('AdminPass2026!');
    } else if (role === 'employee') {
      setEmail('mwangi.barber@aurumsalonflow.co.ke');
      setPassword('BarberPass2026!');
    } else {
      setEmail('esther.wairimu@kyu.ac.ke');
      setPassword('ClientPass2026!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      if (tab === 'signin') {
        const res = await authService.signInWithEmail(email, password);
        if (!res.success) {
          setFeedback({ type: 'error', text: res.error || 'Invalid credentials' });
        } else {
          setFeedback({ type: 'success', text: 'Authentication successful. Loading your workspace...' });
          setTimeout(() => {
            onSuccess(res.profile?.role || selectedRole);
            onClose();
          }, 600);
        }
      } else if (tab === 'signup') {
        if (!fullName.trim()) {
          setFeedback({ type: 'error', text: 'Full name is required' });
          setLoading(false);
          return;
        }
        const res = await authService.signUp(email, password, fullName, selectedRole);
        if (!res.success) {
          setFeedback({ type: 'error', text: res.error || 'Registration failed' });
        } else {
          setFeedback({ type: 'success', text: res.message || 'Account created successfully.' });
          setTimeout(() => {
            onSuccess(selectedRole);
            onClose();
          }, 1000);
        }
      } else if (tab === 'forgot') {
        const res = await authService.resetPasswordForEmail(email);
        if (!res.success) {
          setFeedback({ type: 'error', text: res.error || 'Failed to send reset email' });
        } else {
          setFeedback({ type: 'success', text: res.message || 'Reset instructions sent.' });
        }
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err?.message || 'Authentication error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0F281E]/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#FAF8F5] border border-[#E8E2D9] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header with deep forest green brand bar */}
        <div className="bg-[#0F281E] text-[#FAF8F5] px-6 py-5 border-b border-[#1E4333] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880]">
              SalonFlow Kenya · Secure Gate
            </div>
            <h2 className="font-serif text-xl font-bold text-white mt-0.5">
              {tab === 'signin' && 'Access Business Console'}
              {tab === 'signup' && 'Register New Account'}
              {tab === 'forgot' && 'Reset Account Password'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#C5A880]/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Indicator */}
        <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] border-b border-[#E8E2D9]/60 bg-[#F4EFEA]">
          <span className="text-[#52525B]">Engine:</span>
          <span className="flex items-center gap-1.5 font-mono">
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            <span className={isConnected ? 'text-emerald-800 font-semibold' : 'text-amber-800'}>
              {isConnected ? 'Supabase Auth' : 'Demo Local Auth'}
            </span>
          </span>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-[#E8E2D9] bg-white text-xs">
          <button
            onClick={() => { setTab('signin'); setFeedback(null); }}
            className={`flex-1 py-3 text-center font-medium transition-colors cursor-pointer ${
              tab === 'signin'
                ? 'border-b-2 border-[#0F281E] text-[#0F281E] font-semibold bg-[#FAF8F5]'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('signup'); setFeedback(null); }}
            className={`flex-1 py-3 text-center font-medium transition-colors cursor-pointer ${
              tab === 'signup'
                ? 'border-b-2 border-[#0F281E] text-[#0F281E] font-semibold bg-[#FAF8F5]'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => { setTab('forgot'); setFeedback(null); }}
            className={`flex-1 py-3 text-center font-medium transition-colors cursor-pointer ${
              tab === 'forgot'
                ? 'border-b-2 border-[#0F281E] text-[#0F281E] font-semibold bg-[#FAF8F5]'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Recovery
          </button>
        </div>

        {/* Quick Demo Credentials Fill */}
        {tab === 'signin' && (
          <div className="px-6 pt-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A] mb-2">
              Quick Preview Credentials:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('owner')}
                className="p-2 text-left rounded border border-[#E8E2D9] bg-white hover:border-[#0F281E] transition-colors cursor-pointer"
              >
                <div className="font-semibold text-[#18181B]">Owner Profile</div>
                <div className="text-[10px] text-[#71717A] truncate">director@aurum...</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('employee')}
                className="p-2 text-left rounded border border-[#E8E2D9] bg-white hover:border-[#0F281E] transition-colors cursor-pointer"
              >
                <div className="font-semibold text-[#18181B]">Master Stylist</div>
                <div className="text-[10px] text-[#71717A] truncate">mwangi.barber@...</div>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {feedback && (
            <div
              className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                feedback.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {feedback.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#71717A] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Grace Wambui"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8E2D9] rounded-lg text-xs text-[#18181B] focus:outline-none focus:border-[#0F281E]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#18181B] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#71717A] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@business.co.ke"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8E2D9] rounded-lg text-xs text-[#18181B] focus:outline-none focus:border-[#0F281E]"
              />
            </div>
          </div>

          {tab !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#18181B]">
                  Password
                </label>
                {tab === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-[11px] text-[#9A7B50] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#71717A] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8E2D9] rounded-lg text-xs text-[#18181B] focus:outline-none focus:border-[#0F281E]"
                />
              </div>
            </div>
          )}

          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedRole('owner')}
                  className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                    selectedRole === 'owner'
                      ? 'border-[#0F281E] bg-[#0F281E] text-white font-semibold'
                      : 'border-[#E8E2D9] bg-white text-[#18181B]'
                  }`}
                >
                  Salon Owner
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('employee')}
                  className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                    selectedRole === 'employee'
                      ? 'border-[#0F281E] bg-[#0F281E] text-white font-semibold'
                      : 'border-[#E8E2D9] bg-white text-[#18181B]'
                  }`}
                >
                  Artisan / Stylist
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0F281E] hover:bg-[#15382B] text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 shadow-xs"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>
                  {tab === 'signin' && 'Sign In to Workspace'}
                  {tab === 'signup' && 'Create Account'}
                  {tab === 'forgot' && 'Send Reset Link'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
