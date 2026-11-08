import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { AuthUser, RoleType } from '../types';
import { playSuccessBeep } from '../utils/audio';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToLanding }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<RoleType>('Security Administrator');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please provide a valid enterprise email address.');
      return;
    }

    if (!password || password.length < 4) {
      setError('Password must contain at least 4 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      playSuccessBeep();
      onLoginSuccess({
        email: email.trim(),
        name: isSignUp ? name.trim() || 'Enterprise User' : 'Security Commander',
        role,
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
      });
    }, 600);
  };

  const handleQuickDemoLogin = (demoRole: RoleType) => {
    playSuccessBeep();
    onLoginSuccess({
      email: demoRole === 'Security Administrator' ? 'admin@faceguard.enterprise.io' : 'chief@faceguard.enterprise.io',
      name: demoRole === 'Security Administrator' ? 'Dr. Elena Rostova' : 'Aiden Patel',
      role: demoRole,
      avatarUrl:
        demoRole === 'Security Administrator'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face'
          : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background ambient gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Back to landing button */}
      <button
        onClick={onBackToLanding}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Homepage</span>
      </button>

      {/* Main Container Card: Split layout on large screens */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Side: Brand & Visual Highlights */}
        <div className="md:col-span-5 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg">
              <Shield className="w-6 h-6" />
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white/80">Enterprise Authentication</div>
              <h2 className="text-2xl font-black text-white mt-1">FaceGuard AI</h2>
              <p className="text-xs text-white/90 mt-2 leading-relaxed">
                Autonomous real-time face detection, anti-spoofing verification, and attendance intelligence.
              </p>
            </div>
          </div>

          {/* Quick value props list */}
          <div className="space-y-3 text-xs text-white/95">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Sub-40ms vector distance matching</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Anti-spoofing ocular blink filter</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>100% private local edge processing</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/20 text-[11px] text-white/80 flex items-center justify-between">
            <span>Security Status</span>
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE &amp; ARMED
            </span>
          </div>
        </div>

        {/* Right Side: Login / Register Form */}
        <div className="md:col-span-7 p-8 sm:p-10 space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {isSignUp ? 'Create Enterprise Account' : 'Sign in to FaceGuard AI'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {isSignUp
                ? 'Provision biometric credentials and surveillance edge nodes'
                : 'Enter your credentials to access the biometric command portal'}
            </p>
          </div>

          {/* Error Callout */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Jordan Hayes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Enterprise Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@faceguard.enterprise.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-700 font-bold">Password</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => alert('Demo system: Click "One-Click Quick Access" below or enter any demo password.')}
                    className="text-[11px] text-indigo-600 font-semibold hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Access Clearance Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as RoleType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
              >
                <option value="Security Administrator">Security Administrator (Full System Control)</option>
                <option value="Chief Security Officer">Chief Security Officer (Threat Sentinel)</option>
                <option value="HR Director">HR Director (Attendance &amp; Morale)</option>
                <option value="Kiosk Terminal">Kiosk Terminal (Reception Mode)</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
                <span>Remember this session</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold text-xs hover:shadow-lg hover:shadow-indigo-500/25 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Authenticating Biometric Session...</span>
              ) : (
                <>
                  <span>{isSignUp ? 'Create & Initialize Portal' : 'Authenticate & Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider relative z-10">
              or 1-click evaluation
            </span>
          </div>

          {/* Quick Demo Logins */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Security Administrator')}
              className="p-3 rounded-xl bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/80 text-left transition-all cursor-pointer group"
            >
              <div className="text-indigo-900 font-bold text-xs group-hover:text-indigo-700">
                Demo Admin
              </div>
              <div className="text-[10px] text-indigo-600 mt-0.5 font-medium">Full System Access</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Chief Security Officer')}
              className="p-3 rounded-xl bg-purple-50/70 hover:bg-purple-100/70 border border-purple-200/80 text-left transition-all cursor-pointer group"
            >
              <div className="text-purple-900 font-bold text-xs group-hover:text-purple-700">
                Demo Security
              </div>
              <div className="text-[10px] text-purple-600 mt-0.5 font-medium">Sentinel Mode</div>
            </button>
          </div>

          {/* Social Authentication */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Security Administrator')}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer text-center"
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Security Administrator')}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer text-center"
            >
              Microsoft
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Security Administrator')}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer text-center"
            >
              GitHub
            </button>
          </div>

          {/* Toggle Sign Up / Sign In */}
          <div className="text-center pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-xs text-slate-500 hover:text-indigo-600 font-semibold transition-colors cursor-pointer"
            >
              {isSignUp
                ? 'Already registered? Sign in here'
                : "Don't have an enterprise license? Create account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
