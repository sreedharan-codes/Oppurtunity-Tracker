import React, { useState } from 'react';
import { OpportunityType, OpportunityMode } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { GlassInput } from '../ui/GlassInput';
import { GlassBadge } from '../ui/GlassBadge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Plus,
  X,
  Camera,
  Layers,
  Building2,
  Target,
  Trophy,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ALL_TYPES: OpportunityType[] = [
  'Internship',
  'Hackathon',
  'Workshop',
  'Certification',
  'Competition',
];

const MODES: (OpportunityMode | 'Any')[] = ['Online', 'Offline', 'Hybrid', 'Any'];

const POPULAR_UNIVERSITIES = [
  'Stanford University',
  'Massachusetts Institute of Technology (MIT)',
  'UC Berkeley',
  'Carnegie Mellon University',
  'Harvard University',
  'Georgia Tech',
  'IIT Bombay',
  'University of Washington',
];

const SUGGESTED_TARGET_SKILLS = [
  'Next.js',
  'System Design',
  'Generative AI',
  'Kubernetes',
  'PyTorch',
  'GraphQL',
  'Rust',
  'DevOps',
  'AWS',
  'Microservices',
];

const SUGGESTED_ACHIEVEMENTS = [
  '1st Place Hackathon Winner',
  'AWS Certified Solutions Architect',
  'Google Cloud Associate',
  "Dean's Honor List",
  'Open Source Contributor',
  'LeetCode Knight 2100+',
  'Published IEEE Conference Paper',
];

export const ProfileEditor: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    photoURL: user?.photoURL || '',
    college: user?.college || '',
    course: user?.course || '',
    year: user?.year || '3rd Year',
    preferredMode: user?.preferredMode || 'Hybrid',
  });

  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const [targetSkills, setTargetSkills] = useState<string[]>(
    user?.targetSkills || ['Next.js', 'System Design', 'Generative AI', 'Kubernetes']
  );
  const [newTargetSkill, setNewTargetSkill] = useState('');

  const [achievements, setAchievements] = useState<string[]>(
    user?.achievements || ['1st Place Hackathon Winner', "Dean's Honor List"]
  );
  const [newAchievement, setNewAchievement] = useState('');

  const [interests, setInterests] = useState<string[]>(user?.interests || []);
  const [newInterest, setNewInterest] = useState('');

  const [preferredTypes, setPreferredTypes] = useState<OpportunityType[]>(
    user?.preferredTypes || ['Internship', 'Hackathon']
  );

  const [saving, setSaving] = useState(false);

  // Calculate Profile Completion %
  const calculateCompletion = (): number => {
    let score = 0;
    if (formData.name) score += 10;
    if (formData.photoURL) score += 10;
    if (formData.college) score += 15;
    if (formData.course) score += 10;
    if (formData.year) score += 10;
    if (skills.length >= 3) score += 15;
    else if (skills.length > 0) score += 10;
    if (targetSkills.length > 0) score += 15;
    if (achievements.length > 0) score += 10;
    if (interests.length > 0) score += 5;
    return Math.min(100, score);
  };

  const completionRate = calculateCompletion();

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleAddTargetSkill = (e?: React.FormEvent, customValue?: string) => {
    if (e) e.preventDefault();
    const val = (customValue || newTargetSkill).trim();
    if (val && !targetSkills.includes(val)) {
      setTargetSkills([...targetSkills, val]);
      if (!customValue) setNewTargetSkill('');
    }
  };

  const handleRemoveTargetSkill = (skill: string) => {
    setTargetSkills(targetSkills.filter(s => s !== skill));
  };

  const handleAddAchievement = (e?: React.FormEvent, customValue?: string) => {
    if (e) e.preventDefault();
    const val = (customValue || newAchievement).trim();
    if (val && !achievements.includes(val)) {
      setAchievements([...achievements, val]);
      if (!customValue) setNewAchievement('');
    }
  };

  const handleRemoveAchievement = (item: string) => {
    setAchievements(achievements.filter(a => a !== item));
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const toggleType = (type: OpportunityType) => {
    if (preferredTypes.includes(type)) {
      setPreferredTypes(preferredTypes.filter(t => t !== type));
    } else {
      setPreferredTypes([...preferredTypes, type]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        ...formData,
        skills,
        targetSkills,
        achievements,
        interests,
        preferredTypes,
      });
      success('Profile updated', 'Your university, skills, and target goals are saved.');
      confetti({ particleCount: 35, spread: 60 });
    } catch (err: any) {
      error('Failed to update profile', err?.message || 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Profile Header & Completion Gauge */}
      <GlassCard className="p-6 sm:p-8 rounded-3xl border border-black/5 dark:border-white/10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group shrink-0">
            <img
              src={
                formData.photoURL ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name || 'User')}`
              }
              alt={formData.name}
              className="w-24 h-24 rounded-3xl object-cover border-2 border-accent/40 shadow-glow"
            />
            <div className="absolute inset-0 rounded-3xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
                {formData.name || 'Your Profile'}
              </h2>
              <GlassBadge variant="accent" size="sm" className="capitalize">
                {user?.role || 'Student'}
              </GlassBadge>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {formData.college ? `${formData.college} · ` : ''}
              {formData.course || 'Complete your student details'}
            </p>

            {/* Profile Completion Bar */}
            <div className="mt-4 max-w-md">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  Profile Completeness
                </span>
                <span className="text-accent">{completionRate}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500 shadow-glow"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Academic Info */}
        <GlassCard className="p-6 rounded-3xl border border-black/5 dark:border-white/10 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-accent" />
            Academic Background
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassInput
              label="Full Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <GlassInput
              label="Profile Photo URL"
              value={formData.photoURL}
              onChange={e => setFormData({ ...formData, photoURL: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <GlassInput
                label="College / Institution (University)"
                value={formData.college}
                onChange={e => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. Stanford University"
              />
              {/* Quick Select Top Universities for Leaderboard */}
              <div className="mt-2">
                <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1 mb-1.5">
                  <Building2 className="w-3 h-3 text-accent" />
                  Select your campus (classified into University Leaderboard):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_UNIVERSITIES.map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setFormData({ ...formData, college: u })}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                        formData.college === u
                          ? 'bg-accent text-white shadow-sm font-bold'
                          : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <GlassInput
                label="Course / Degree"
                value={formData.course}
                onChange={e => setFormData({ ...formData, course: e.target.value })}
                placeholder="e.g. B.S. Computer Science"
              />
              <div className="flex flex-col gap-1.5 mt-4">
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  Current Year
                </label>
                <select
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: e.target.value })}
                  className="glass-input w-full px-4 py-2.5 text-sm rounded-xl text-neutral-900 dark:text-neutral-100"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="Final Year">Final Year</option>
                  <option value="Graduate / Post-Grad">Graduate / Post-Grad</option>
                </select>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Existing Technical & Core Skills */}
        <GlassCard className="p-6 rounded-3xl border border-black/5 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Technical & Core Skills (Current)
            </h3>
            <span className="text-xs text-neutral-400">Used for opportunity match %</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-accent/15 text-accent border border-accent/30 shadow-sm"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-sm">
            <GlassInput
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              placeholder="Add skill (e.g. PyTorch, Next.js)"
              className="text-xs"
            />
            <GlassButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddSkill}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add
            </GlassButton>
          </div>

          {/* Quick-add suggested skills */}
          <div className="pt-1">
            <span className="text-[11px] text-neutral-400 font-medium block mb-1.5">
              Quick add popular skills:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['Python', 'React', 'AI/ML', 'TypeScript', 'Node.js', 'SQL', 'Docker', 'Git', 'Cloud', 'Figma']
                .filter(s => !skills.includes(s))
                .slice(0, 7)
                .map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSkills([...skills, s])}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-accent/15 hover:text-accent text-neutral-600 dark:text-neutral-400 font-medium transition-colors cursor-pointer border border-black/5 dark:border-white/5"
                  >
                    + {s}
                  </button>
                ))}
            </div>
          </div>
        </GlassCard>

        {/* Skills Willing to Learn New (Target Skills) */}
        <GlassCard className="p-6 rounded-3xl border border-black/5 dark:border-white/10 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#b5b6ff]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#8a8dff]" />
                Skills You Are Willing to Learn Next
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Curates personalized courses in the <strong className="text-neutral-700 dark:text-neutral-200">Learning tab</strong> & adds growth index points.
              </p>
            </div>
            <GlassBadge variant="purple" size="sm">
              {targetSkills.length} Goals Active
            </GlassBadge>
          </div>

          <div className="flex flex-wrap gap-2">
            {targetSkills.map(skill => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#b5b6ff]/20 text-[#6064f5] dark:text-[#b5b6ff] border border-[#b5b6ff]/40 shadow-sm"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTargetSkill(skill)}
                  className="hover:text-rose-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {targetSkills.length === 0 && (
              <p className="text-xs text-neutral-400 italic">No target skills added yet. Select from below to get course recommendations!</p>
            )}
          </div>

          <div className="flex items-center gap-2 max-w-sm">
            <GlassInput
              value={newTargetSkill}
              onChange={e => setNewTargetSkill(e.target.value)}
              placeholder="e.g. Generative AI, Rust, DevOps"
              className="text-xs"
            />
            <GlassButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleAddTargetSkill()}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Goal
            </GlassButton>
          </div>

          {/* Quick-add suggested target skills */}
          <div className="pt-1">
            <span className="text-[11px] text-neutral-400 font-medium block mb-1.5">
              Suggested next skills to learn:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TARGET_SKILLS.filter(s => !targetSkills.includes(s)).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddTargetSkill(undefined, s)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-[#b5b6ff]/25 hover:text-[#6064f5] dark:hover:text-[#b5b6ff] text-neutral-600 dark:text-neutral-400 font-medium transition-colors cursor-pointer border border-black/5 dark:border-white/5"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Achievements & Accolades */}
        <GlassCard className="p-6 rounded-3xl border border-black/5 dark:border-white/10 space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Achievements, Hackathons & Honors
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Each verified achievement awards <strong className="text-amber-500">+300 points</strong> towards your global & university Leaderboard ranking!
              </p>
            </div>
            <GlassBadge variant="warning" size="sm">
              +{achievements.length * 300} Leaderboard Pts
            </GlassBadge>
          </div>

          <div className="flex flex-wrap gap-2">
            {achievements.map(ach => (
              <span
                key={ach}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-sm"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{ach}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAchievement(ach)}
                  className="hover:text-rose-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-md">
            <GlassInput
              value={newAchievement}
              onChange={e => setNewAchievement(e.target.value)}
              placeholder="e.g. 1st Place Hackathon, Dean's Honor List"
              className="text-xs"
            />
            <GlassButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleAddAchievement()}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Award
            </GlassButton>
          </div>

          {/* Quick-add suggested achievements */}
          <div className="pt-1">
            <span className="text-[11px] text-neutral-400 font-medium block mb-1.5">
              Quick add common achievements:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_ACHIEVEMENTS.filter(a => !achievements.includes(a)).map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => handleAddAchievement(undefined, a)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-amber-500/15 hover:text-amber-600 dark:hover:text-amber-400 text-neutral-600 dark:text-neutral-400 font-medium transition-colors cursor-pointer border border-black/5 dark:border-white/5"
                >
                  + {a}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Interests & Opportunities Preferences */}
        <GlassCard className="p-6 rounded-3xl border border-black/5 dark:border-white/10 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent" />
            Preferences & Target Categories
          </h3>

          <div>
            <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block mb-2">
              Target Opportunity Types
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_TYPES.map(type => {
                const isSelected = preferredTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-accent text-white border-accent shadow-glow'
                        : 'bg-black/5 dark:bg-white/5 border-transparent text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block mb-2">
              Preferred Format
            </label>
            <div className="grid grid-cols-4 gap-2 max-w-md">
              {MODES.map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFormData({ ...formData, preferredMode: mode as any })}
                  className={`py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                    formData.preferredMode === mode
                      ? 'bg-accent text-white border-accent shadow-glow'
                      : 'bg-black/5 dark:bg-white/5 border-transparent text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block mb-2">
              Interests & Industry Fields
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {interests.map(interest => (
                <span
                  key={interest}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-black/5 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 border border-black/5 dark:border-white/5"
                >
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="hover:text-rose-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 max-w-sm">
              <GlassInput
                value={newInterest}
                onChange={e => setNewInterest(e.target.value)}
                placeholder="Add interest (e.g. Generative AI)"
                className="text-xs"
              />
              <GlassButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddInterest}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add
              </GlassButton>
            </div>
          </div>
        </GlassCard>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <GlassButton
            type="submit"
            variant="primary"
            size="lg"
            loading={saving}
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            Save Profile Changes
          </GlassButton>
        </div>
      </form>
    </div>
  );
};
