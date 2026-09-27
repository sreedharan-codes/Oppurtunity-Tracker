import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  X,
  Mail,
  Lock,
  User,
  GraduationCap,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const { login, register, loginAsDemoStudent, loginAsDemoAdmin } = useAuth();
  const { success, error } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('3rd Year');
  const [skills, setSkills] = useState('React, Python, TypeScript');
  const [interests, setInterests] = useState('AI/ML, Web Development');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password.trim()) {
          error('Missing Fields', 'Please enter email and password.');
          setLoading(false);
          return;
        }
        await login(email, password);
        success('Welcome back!', 'Successfully signed in to Flux Opportunity.');
      } else {
        if (!name.trim() || !email.trim() || !password.trim()) {
          error('Missing Fields', 'Please complete the required fields.');
          setLoading(false);
          return;
        }
        const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
        const interestsArray = interests.split(',').map((i) => i.trim()).filter(Boolean);

        await register(name, email, password, {
          college: college || 'University Student',
          course: course || 'Computer Science',
          year,
          skills: skillsArray,
          interests: interestsArray,
        });
        success('Account created!', 'Welcome to Flux Opportunity.');
        confetti({ particleCount: 50, spread: 60 });
      }
      onClose();
    } catch (err: any) {
      let msg = err?.message || 'Authentication error. Please check credentials.';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        msg = 'Invalid email or password. Please try again.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'An account with this email already exists.';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'Password should be at least 6 characters.';
      }
      error('Authentication Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudent = async () => {
    setLoading(true);
    try {
      await loginAsDemoStudent();
      success('Signed in as Student Demo', 'Loaded student profile: Alex Chen (Stanford University)');
      confetti({ particleCount: 30, spread: 45 });
      onClose();
    } catch {
      error('Error', 'Could not load demo profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    try {
      await loginAsDemoAdmin();
      success('Signed in as Admin Demo', 'Administrator privileges activated.');
      onClose();
    } catch {
      error('Error', 'Could not load admin profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-gray-100 overflow-hidden animate-scale-in max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              className="w-8 h-8 text-[#d8ff3e]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="10" cy="10" rx="5" ry="7" fill="#d8ff3e" transform="rotate(-30 10 10)" />
              <ellipse cx="22" cy="10" rx="5" ry="7" fill="#d8ff3e" transform="rotate(30 22 10)" />
              <ellipse cx="10" cy="22" rx="5" ry="7" fill="#d8ff3e" transform="rotate(30 10 22)" />
              <ellipse cx="22" cy="22" rx="5" ry="7" fill="#d8ff3e" transform="rotate(-30 22 22)" />
              <circle cx="16" cy="16" r="3" fill="#141518" />
            </svg>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight lowercase">
            flux
          </span>
        </div>

        {/* Mode Switcher Pill */}
        <div className="bg-[#eaebef] p-1 rounded-full flex items-center mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-full text-xs font-black transition-all duration-200 ${
              mode === 'login'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-full text-xs font-black transition-all duration-200 ${
              mode === 'register'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="mb-5">
          <h2 className="text-2xl font-black tracking-tight text-gray-950 font-sans">
            {mode === 'login' ? 'Welcome Back' : 'Get Started with Flux'}
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-1">
            {mode === 'login'
              ? 'Sign in to access your matched opportunities and pipeline.'
              : 'Create your student profile and unlock AI-powered opportunity matching.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div className="space-y-3.5 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Chen"
                    required
                    className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#eaebef]/50 hover:bg-[#eaebef]/80 focus:bg-white text-sm font-medium text-gray-900 placeholder-gray-400 border border-transparent focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d8ff3e] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                    College / University
                  </label>
                  <div className="relative flex items-center">
                    <GraduationCap className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. Stanford University"
                      className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#eaebef]/50 hover:bg-[#eaebef]/80 focus:bg-white text-sm font-medium text-gray-900 placeholder-gray-400 border border-transparent focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d8ff3e] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                    Course & Year
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="e.g. B.Tech CS"
                      className="flex-1 px-3 py-2.5 rounded-full bg-[#eaebef]/50 hover:bg-[#eaebef]/80 focus:bg-white text-xs font-medium text-gray-900 border border-transparent focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d8ff3e] transition-all"
                    />
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="px-2.5 py-2.5 rounded-full bg-[#eaebef]/50 hover:bg-[#eaebef]/80 focus:bg-white text-xs font-bold text-gray-900 border border-transparent focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d8ff3e] transition-all"
                    >
                      <option value="1st Year">1st Yr</option>
                      <option value="2nd Year">2nd Yr</option>
                      <option value="3rd Year">3rd Yr</option>
                      <option value="4th Year">4th Yr</option>
                      <option value="Graduate">Grad</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Python, TypeScript"
                    className="w-full px-4 py-2.5 rounded-full bg-[#eaebef]/50 hover:bg-[#eaebef]/80 focus:bg-white text-xs font-medium text-gray-900 placeholder-gray-400 border border-transparent focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d8ff3e] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                    Interests
                  </label>
                  <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="AI/ML, Web3, Cloud"
                    className="w-full px-4 py-2.5 rounded-full bg-[#eaebef]/50 hover:bg-[#eaebef]/80 focus:bg-white text-xs font-medium text-gray-900 placeholder-gray-400 border border-transparent focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d8ff3e] transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
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
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#eaebef]/50 hover:bg-[#eaebef]/80 focus:bg-white text-sm font-medium text-gray-900 placeholder-gray-400 border border-transparent focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d8ff3e] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full pl-11 pr-11 py-2.5 rounded-full bg-[#eaebef]/50 hover:bg-[#eaebef]/80 focus:bg-white text-sm font-medium text-gray-900 placeholder-gray-400 border border-transparent focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d8ff3e] transition-all"
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-full bg-[#15161a] hover:bg-black text-white text-sm font-black tracking-wide flex items-center justify-center gap-2 transition-all duration-200 shadow-md active:scale-95 disabled:opacity-50 group"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Flux' : 'Create Free Account'}</span>
                  <ArrowRight className="w-4 h-4 text-[#d8ff3e] transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo Switcher */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center mb-2.5">
            Instant Demo Profiles:
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoStudent}
              disabled={loading}
              className="py-2 px-3 rounded-xl bg-[#eaebef]/70 hover:bg-[#eaebef] text-gray-900 text-xs font-black flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[#d8ff3e]" />
              <span>Student Demo</span>
            </button>

            <button
              type="button"
              onClick={handleDemoAdmin}
              disabled={loading}
              className="py-2 px-3 rounded-xl bg-[#eaebef]/70 hover:bg-[#eaebef] text-gray-900 text-xs font-black flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[#b5b6ff]" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
