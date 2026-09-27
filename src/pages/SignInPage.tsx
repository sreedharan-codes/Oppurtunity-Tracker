import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SignInPageProps {
  onSuccess: () => void;
  onNavigateToSignUp: () => void;
  onExploreAsGuest?: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onSuccess,
  onNavigateToSignUp,
  onExploreAsGuest,
}) => {
  const { login, loginAsDemoStudent, loginAsDemoAdmin } = useAuth();
  const { success, error, info } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      error('Required Fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      success('Welcome back!', 'Successfully signed in to Flux Opportunity.');
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      onSuccess();
    } catch (err: any) {
      let msg = err?.message || 'Authentication error. Please check your credentials.';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        msg = 'Invalid email or password. Please try again.';
      } else if (msg.includes('auth/user-not-found')) {
        msg = 'No account found with this email. Please register first.';
      }
      error('Sign In Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudent = async () => {
    setLoading(true);
    try {
      await loginAsDemoStudent();
      success('Welcome, Alex!', 'Signed in with Student Demo Profile (Stanford University).');
      confetti({ particleCount: 50, spread: 60 });
      onSuccess();
    } catch {
      error('Error', 'Could not load demo student profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    try {
      await loginAsDemoAdmin();
      success('Admin Access Granted', 'Signed in with Administrator Privileges.');
      onSuccess();
    } catch {
      error('Error', 'Could not load demo admin profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-2 sm:py-6 animate-fade-up select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Dedicated Sign In Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[32px] p-6 sm:p-10 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            {/* Header Brand */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center">
                  <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    className="w-9 h-9 text-[#d8ff3e] drop-shadow-[0_0_8px_rgba(216,255,62,0.5)]"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <ellipse cx="10" cy="10" rx="5" ry="7" fill="#d8ff3e" transform="rotate(-30 10 10)" />
                    <ellipse cx="22" cy="10" rx="5" ry="7" fill="#d8ff3e" transform="rotate(30 22 10)" />
                    <ellipse cx="10" cy="22" rx="5" ry="7" fill="#d8ff3e" transform="rotate(30 10 22)" />
                    <ellipse cx="22" cy="22" rx="5" ry="7" fill="#d8ff3e" transform="rotate(-30 22 22)" />
                    <circle cx="16" cy="16" r="3" fill="#141518" />
                  </svg>
                </div>
                <div>
                  <span className="text-xl font-black text-gray-900 tracking-tight block leading-none lowercase">
                    flux
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#d8ff3e] bg-black px-2 py-0.5 rounded-full inline-block mt-0.5">
                    Sign In
                  </span>
                </div>
              </div>

              {/* Direct Link to Register Page */}
              <button
                type="button"
                onClick={onNavigateToSignUp}
                className="px-4 py-2 rounded-full bg-[#eaebef] hover:bg-gray-200 text-xs font-black text-gray-800 transition-all duration-200 hover:shadow-sm"
              >
                Create Account →
              </button>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-950 font-sans">
                Sign In to Flux
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                Enter your registered student credentials to launch your career dashboard.
              </p>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-full bg-[#eaebef]/50 hover:bg-[#eaebef]/80 focus:bg-white text-sm font-medium text-gray-900 placeholder-gray-400 border border-transparent focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d8ff3e] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5 ml-1">
                  <label className="block text-xs font-bold text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => info('Password Reset', 'Password recovery instructions have been sent to demo inbox.')}
                    className="text-xs font-semibold text-gray-500 hover:text-black transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-11 pr-11 py-3 rounded-full bg-[#eaebef]/50 hover:bg-[#eaebef]/80 focus:bg-white text-sm font-medium text-gray-900 placeholder-gray-400 border border-transparent focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d8ff3e] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2 pt-1 ml-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-black focus:ring-[#d8ff3e] border-gray-300"
                />
                <label htmlFor="remember" className="text-xs font-bold text-gray-600 cursor-pointer">
                  Keep me signed in on this device
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-full bg-[#15161a] hover:bg-black text-white text-sm font-black tracking-wide flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 group"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Flux</span>
                      <ArrowRight className="w-4 h-4 text-[#d8ff3e] transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Demo Switcher Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center mb-3">
              Instant 1-Click Demo Profiles (No Password Required):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDemoStudent}
                disabled={loading}
                className="py-2.5 px-4 rounded-2xl bg-[#eaebef]/70 hover:bg-[#eaebef] text-gray-900 text-xs font-black flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 border border-transparent hover:border-gray-200"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#d8ff3e] shadow-[0_0_8px_rgba(216,255,62,0.9)]" />
                <span>Alex Chen (Student Demo)</span>
              </button>

              <button
                type="button"
                onClick={handleDemoAdmin}
                disabled={loading}
                className="py-2.5 px-4 rounded-2xl bg-[#eaebef]/70 hover:bg-[#eaebef] text-gray-900 text-xs font-black flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 border border-transparent hover:border-gray-200"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#b5b6ff] shadow-[0_0_8px_rgba(181,182,255,0.9)]" />
                <span>Admin Console (Demo)</span>
              </button>
            </div>

            {/* Bottom Secondary Links */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={onNavigateToSignUp}
                  className="font-black text-black hover:underline"
                >
                  Register here
                </button>
              </p>

              {onExploreAsGuest && (
                <button
                  type="button"
                  onClick={onExploreAsGuest}
                  className="font-bold text-gray-400 hover:text-black transition-colors"
                >
                  Continue as Guest →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Flux Visual Showcase Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#17181c] text-white rounded-[32px] p-6 sm:p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden h-full min-h-[460px]">
          {/* Subtle Ambient Decorative Glows */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#d8ff3e]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-[#b5b6ff]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Info */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#d8ff3e] text-xs font-black mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flux AI Matching</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Start Your Career Pipeline Today
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-2 leading-relaxed">
              Log in to track your internships, hackathons, and research opportunities in real time.
            </p>
          </div>

          {/* Visual Showcase: Overlapping Flux Bubbles */}
          <div className="relative my-8 h-44 flex items-center justify-center z-10">
            {/* Circle 1 */}
            <div className="absolute left-6 top-1 w-28 h-28 rounded-full bg-[#b5b6ff] flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-105 z-10">
              <span className="text-xl font-black text-gray-950 leading-tight">2,4k</span>
              <span className="text-[11px] font-bold text-gray-700">Internships</span>
            </div>

            {/* Circle 2 */}
            <div className="absolute right-8 top-6 w-24 h-24 rounded-full bg-[#252824] flex flex-col items-center justify-center shadow-xl transition-transform hover:scale-105 z-20 border border-white/5">
              <span className="text-base font-black text-white leading-tight">1,2k</span>
              <span className="text-[10px] font-bold text-gray-300">Hackathons</span>
            </div>

            {/* Circle 3 */}
            <div className="absolute bottom-1 left-20 w-20 h-20 rounded-full bg-[#d8ff3e] flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-105 z-30">
              <span className="text-base font-black text-black leading-tight">94%</span>
              <span className="text-[9px] font-extrabold text-gray-800">Match Rate</span>
            </div>
          </div>

          {/* Key Advantages */}
          <div className="relative z-10 pt-4 border-t border-white/10 space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs text-gray-300">
              <div className="w-4 h-4 rounded-full bg-[#d8ff3e] text-black flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="font-medium">Direct recruiter channels & verified postings</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-gray-300">
              <div className="w-4 h-4 rounded-full bg-[#b5b6ff] text-black flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="font-medium">Automated deadline tracking & calendar sync</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
