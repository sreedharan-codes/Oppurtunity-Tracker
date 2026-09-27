import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Mail,
  Lock,
  User,
  GraduationCap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SignUpPageProps {
  onSuccess: () => void;
  onNavigateToSignIn: () => void;
  onExploreAsGuest?: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onSuccess,
  onNavigateToSignIn,
  onExploreAsGuest,
}) => {
  const { register, loginAsDemoStudent } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('Computer Science');
  const [year, setYear] = useState('3rd Year');
  const [skills, setSkills] = useState('React, Python, TypeScript');
  const [interests, setInterests] = useState('AI/ML, Web3, Cloud');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      error('Required Fields', 'Please complete your name, email, and password.');
      return;
    }

    setLoading(true);
    try {
      const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
      const interestsArray = interests.split(',').map((i) => i.trim()).filter(Boolean);

      await register(name, email, password, {
        college: college || 'University Student',
        course,
        year,
        skills: skillsArray,
        interests: interestsArray,
      });

      success('Account Created!', 'Welcome to Flux Opportunity! Your profile has been initialized.');
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      onSuccess();
    } catch (err: any) {
      let msg = err?.message || 'Registration failed. Please try again.';
      if (msg.includes('auth/email-already-in-use')) {
        msg = 'An account with this email already exists. Please sign in instead.';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'Password should be at least 6 characters.';
      }
      error('Registration Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudent = async () => {
    setLoading(true);
    try {
      await loginAsDemoStudent();
      success('Demo Loaded', 'Loaded student profile: Alex Chen (Stanford University).');
      confetti({ particleCount: 40, spread: 50 });
      onSuccess();
    } catch {
      error('Error', 'Could not load demo student profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-2 sm:py-6 animate-fade-up select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Dedicated Sign Up / Register Card (7 cols) */}
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
                    Register
                  </span>
                </div>
              </div>

              {/* Direct Link to Sign In Page */}
              <button
                type="button"
                onClick={onNavigateToSignIn}
                className="px-4 py-2 rounded-full bg-[#eaebef] hover:bg-gray-200 text-xs font-black text-gray-800 transition-all duration-200 hover:shadow-sm"
              >
                Sign In Instead →
              </button>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-950 font-sans">
                Create Your Account
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                Set up your student profile to unlock automated match scores and applications tracking.
              </p>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className="space-y-3.5">
              {/* Full Name */}
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

              {/* University & Degree */}
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

              {/* Skills & Interests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                    Key Technical Skills
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
                    Career Focus / Interests
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

              {/* Email Address */}
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

              {/* Password */}
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
                    placeholder="Minimum 6 characters"
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
                      <span>Create Free Account</span>
                      <ArrowRight className="w-4 h-4 text-[#d8ff3e] transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Demo Switcher Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onNavigateToSignIn}
                  className="font-black text-black hover:underline"
                >
                  Sign in here
                </button>
              </p>

              <button
                type="button"
                onClick={handleDemoStudent}
                className="font-bold text-xs text-gray-700 hover:text-black flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#d8ff3e]" />
                <span>Try Demo Profile</span>
              </button>
            </div>

            {onExploreAsGuest && (
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={onExploreAsGuest}
                  className="font-bold text-xs text-gray-400 hover:text-black transition-colors"
                >
                  Continue browsing opportunities as guest →
                </button>
              </div>
            )}
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
              <span>Full Member Perks</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Unlock Precision Career Matching
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-2 leading-relaxed">
              Join students landing internships at Google, Microsoft, Meta, and high-growth AI labs.
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
