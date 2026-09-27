import React from 'react';
import { GlassButton } from '../components/ui/GlassButton';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassBadge } from '../components/ui/GlassBadge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  Compass,
  KanbanSquare,
  Award,
  TrendingUp,
  ShieldCheck,
  User,
} from 'lucide-react';

interface LandingPageProps {
  onExplore: () => void;
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExplore,
  onGetStarted,
}) => {
  const { loginAsDemoStudent, loginAsDemoAdmin, user } = useAuth();
  const { success } = useToast();

  const handleStudentDemo = async () => {
    await loginAsDemoStudent();
    success('Welcome Alex!', 'Loaded Student Demo profile with active applications.');
  };

  const handleAdminDemo = async () => {
    await loginAsDemoAdmin();
    success('Welcome Admin!', 'Loaded Platform Administrator console.');
  };

  return (
    <div className="space-y-24 sm:space-y-32 pt-8 pb-16 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-surface border border-white/20 dark:border-white/10 shadow-sm animate-fade-up">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-subtle" />
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            Vision2Web Hackathon · Student Opportunity Tracker
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.08] font-sans">
          Your next opportunity <br />
          <span className="bg-gradient-to-r from-accent to-[#5e5ce6] bg-clip-text text-transparent">
            starts here.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Discover internships, hackathons, certifications, and experiences built around where you want to go.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <GlassButton
            variant="primary"
            size="lg"
            onClick={onGetStarted}
            className="w-full sm:w-auto shadow-glow px-8"
            icon={<Sparkles className="w-4 h-4" />}
          >
            Get Started
          </GlassButton>

          <GlassButton
            variant="secondary"
            size="lg"
            onClick={onExplore}
            className="w-full sm:w-auto px-8"
            icon={<Compass className="w-4 h-4" />}
          >
            Explore Opportunities
          </GlassButton>
        </div>

        {/* Frictionless 1-Click Evaluation Buttons for Evaluators */}
        {!user && (
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs">
            <span className="text-neutral-400 font-medium">Quick Evaluator Sign-In:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStudentDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 hover:bg-accent/20 text-accent font-semibold border border-accent/20 transition-all active:scale-95 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Alex (Student Demo)</span>
              </button>
              <button
                type="button"
                onClick={handleAdminDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-semibold border border-purple-500/20 transition-all active:scale-95 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sarah (Admin Console)</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Metrics Ticker Bar */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-center">
          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <div className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white">22+</div>
            <div className="text-[11px] text-neutral-400 font-medium mt-0.5">Top Tech Programs</div>
          </div>
          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <div className="text-xl sm:text-2xl font-extrabold text-accent">92%</div>
            <div className="text-[11px] text-neutral-400 font-medium mt-0.5">Match Precision</div>
          </div>
          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-500">4 Stages</div>
            <div className="text-[11px] text-neutral-400 font-medium mt-0.5">Kanban Pipeline</div>
          </div>
          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <div className="text-xl sm:text-2xl font-extrabold text-amber-500">0 Config</div>
            <div className="text-[11px] text-neutral-400 font-medium mt-0.5">Sync Sandbox</div>
          </div>
        </div>

        {/* Floating Glass Opportunity Dashboard Preview */}
        <div className="pt-6 sm:pt-10 relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-accent/15 blur-3xl -z-10 rounded-full" />
          <GlassCard className="p-6 sm:p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-2xl bg-white/70 dark:bg-[#10131e]/80 overflow-hidden text-left">
            {/* Mock Window Controls */}
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-xs font-semibold text-neutral-400 ml-2">
                  OPPORTUNITY Preview · Live Student Hub
                </span>
              </div>
              <GlassBadge variant="accent" size="sm">
                92% AI Compatibility
              </GlassBadge>
            </div>

            {/* Preview Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1 */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                      G
                    </div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">Google</span>
                  </div>
                  <span className="text-[10px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                    3 days left
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    AI/ML Research Internship
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Python · PyTorch · Deep Learning
                  </p>
                </div>
                <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-500">92% Match</span>
                  <span className="text-[10px] font-medium text-neutral-400">Applied</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold">
                      GH
                    </div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">GitHub</span>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    5 days left
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    Global Open Source Hackathon
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    React · TypeScript · Git
                  </p>
                </div>
                <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-accent">88% Match</span>
                  <span className="text-[10px] font-medium text-amber-400">Shortlisted</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                      NV
                    </div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">NVIDIA</span>
                  </div>
                  <span className="text-[10px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                    Tomorrow
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    Deep Learning & GPU Workshop
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    CUDA · C++ · Accelerated Compute
                  </p>
                </div>
                <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-500">95% Match</span>
                  <span className="text-[10px] font-medium text-sky-400">Interested</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Feature Pillar Sections: Discover · Track · Match · Grow */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        <GlassCard className="p-6 rounded-3xl border border-black/5 dark:border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-accent/15 flex items-center justify-center text-accent">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            Discover
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Curated internships, hackathons, certifications, and workshops from world-class tech organizations.
          </p>
        </GlassCard>

        <GlassCard className="p-6 rounded-3xl border border-black/5 dark:border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-500">
            <KanbanSquare className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            Track
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Visual Kanban board moving opportunities across Interested, Applied, Shortlisted, and Completed.
          </p>
        </GlassCard>

        <GlassCard className="p-6 rounded-3xl border border-black/5 dark:border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-500">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            Match
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Intelligent compatibility scoring comparing your skills and course preferences with exact requirements.
          </p>
        </GlassCard>

        <GlassCard className="p-6 rounded-3xl border border-black/5 dark:border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-500">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            Grow
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Never miss a closing date with active countdowns and an upcoming deadline timeline.
          </p>
        </GlassCard>
      </section>
    </div>
  );
};
