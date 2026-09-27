import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRecommendedCourses } from '../data/learningCoursesData';
import {
  PlayCircle,
  Award,
  Sparkles,
  Search,
  Star,
  Clock,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LearningPageProps {
  onNavigateTab: (tab: string) => void;
}

export const LearningPage: React.FC<LearningPageProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<'all' | 'target' | 'youtube' | 'certified' | 'free' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('All');

  // Track completed course IDs in localStorage
  const [completedCourses, setCompletedCourses] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('flux_completed_courses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleCourseCompleted = (courseId: string) => {
    setCompletedCourses((prev) => {
      const isDone = prev.includes(courseId);
      const updated = isDone ? prev.filter((id) => id !== courseId) : [...prev, courseId];
      try {
        localStorage.setItem('flux_completed_courses', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      if (!isDone) {
        confetti({ particleCount: 35, spread: 60 });
      }
      return updated;
    });
  };

  // User skills
  const userSkills = useMemo(() => user?.skills || ['Python', 'React', 'Machine Learning'], [user]);
  const userTargetSkills = useMemo(
    () => user?.targetSkills || ['Next.js', 'System Design', 'Generative AI', 'Kubernetes'],
    [user]
  );

  // Recommendations
  const { courses } = useMemo(() => {
    return getRecommendedCourses(userSkills, userTargetSkills);
  }, [userSkills, userTargetSkills]);

  // Unique skills across courses for quick filter chips
  const allCourseSkills = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => c.skillsCovered.forEach((s) => set.add(s)));
    return ['All', ...Array.from(set).slice(0, 10)];
  }, [courses]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Type filter
      if (filterType === 'target' && course.matchType !== 'target') return false;
      if (filterType === 'youtube' && course.type !== 'youtube') return false;
      if (filterType === 'certified' && course.type !== 'certified') return false;
      if (filterType === 'free' && !course.free) return false;
      if (filterType === 'completed' && !completedCourses.includes(course.id)) return false;

      // Skill filter
      if (selectedSkillFilter !== 'All') {
        const hasSkill = course.skillsCovered.some(
          (s) => s.toLowerCase() === selectedSkillFilter.toLowerCase()
        );
        if (!hasSkill) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = course.title.toLowerCase().includes(q);
        const matchProvider = course.provider.toLowerCase().includes(q);
        const matchDesc = course.description.toLowerCase().includes(q);
        const matchSkill = course.skillsCovered.some((s) => s.toLowerCase().includes(q));
        if (!matchTitle && !matchProvider && !matchDesc && !matchSkill) return false;
      }

      return true;
    });
  }, [courses, filterType, selectedSkillFilter, searchQuery, completedCourses]);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-up select-none">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-950 font-sans">
              Personalized Learning Pathways
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d8ff3e]/40 text-black text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              Skill-Matched
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Curated YouTube video courses and certified professional credentials calibrated to skills you have and want to learn next.
          </p>
        </div>

        {/* Action Button: Edit Target Skills */}
        <button
          onClick={() => onNavigateTab('profile')}
          className="px-4 py-2.5 rounded-full bg-[#15161a] hover:bg-black text-white text-xs font-bold transition-all duration-200 shadow-sm flex items-center gap-2 self-start sm:self-auto active:scale-95"
        >
          <span>Update Target Skills in Profile</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#d8ff3e]" />
        </button>
      </div>

      {/* Target Skills Banner */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d8ff3e] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-gray-500">
              Your Target Skills to Learn Next
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {userTargetSkills.map((ts) => (
              <span
                key={ts}
                className="px-3 py-1 rounded-full bg-[#d8ff3e]/30 text-black text-xs font-black border border-[#d8ff3e]"
              >
                ⭐ {ts}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 font-medium pt-1">
            Courses matching these skills are highlighted first with high-velocity priority badges.
          </p>
        </div>

        {/* Secondary: Mastered Skills */}
        <div className="md:border-l md:border-gray-100 md:pl-6 space-y-2 shrink-0">
          <span className="text-xs font-black uppercase tracking-wider text-gray-400 block">
            Skills You Already Have
          </span>
          <div className="flex items-center gap-1.5 flex-wrap max-w-sm">
            {userSkills.slice(0, 5).map((sk) => (
              <span
                key={sk}
                className="px-2.5 py-0.5 rounded-md bg-[#eaebef] text-gray-700 text-xs font-bold"
              >
                {sk}
              </span>
            ))}
            {userSkills.length > 5 && (
              <span className="text-xs font-bold text-gray-400">+{userSkills.length - 5}</span>
            )}
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
          {[
            { id: 'all', label: 'All Courses' },
            { id: 'target', label: '🎯 Target Skill Match' },
            { id: 'youtube', label: '🎥 YouTube Videos' },
            { id: 'certified', label: '🎓 Certified Credentials' },
            { id: 'completed', label: `✅ Completed (${completedCourses.length})` },
            { id: 'free', label: '100% Free' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 ${
                filterType === tab.id
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Skill Dropdown */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto">
          <div className="relative flex items-center flex-1 lg:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course title or instructor..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-xs font-medium text-gray-900 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d8ff3e] transition-all"
            />
          </div>

          <select
            value={selectedSkillFilter}
            onChange={(e) => setSelectedSkillFilter(e.target.value)}
            className="px-3.5 py-2 rounded-full bg-white text-xs font-bold text-gray-700 border border-gray-200 focus:outline-none"
          >
            {allCourseSkills.map((sk) => (
              <option key={sk} value={sk}>
                Skill: {sk}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isTargetMatch = course.matchType === 'target';

          return (
            <div
              key={course.id}
              className={`bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border ${
                isTargetMatch ? 'border-2 border-black/80 ring-2 ring-[#d8ff3e]/50' : 'border-gray-100'
              } group`}
            >
              <div>
                {/* Course Thumbnail Image */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {course.type === 'youtube' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black shadow-md">
                          <PlayCircle className="w-3 h-3" />
                          YouTube Course
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7a7bf8] text-white text-[10px] font-black shadow-md">
                          <Award className="w-3 h-3" />
                          Official Certificate
                        </span>
                      )}

                      {completedCourses.includes(course.id) && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-md">
                          <CheckCircle2 className="w-3 h-3" />
                          Done +150 pts
                        </span>
                      )}
                    </div>

                    {course.free ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-md">
                        FREE
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-white/90 text-gray-900 text-[10px] font-black backdrop-blur-sm shadow-md">
                        Accredited
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Overlay Info */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">
                      {course.provider}
                    </span>
                    <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-200 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1 text-amber-300">
                        <Star className="w-3 h-3 fill-amber-300" />
                        {course.rating} ({course.reviewCount.toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5 space-y-3">
                  {/* Recommendation Reason Pill */}
                  {isTargetMatch && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d8ff3e] text-black text-[10px] font-black">
                      <Sparkles className="w-3 h-3" />
                      <span>Target Skill: {course.targetSkillMatch?.toUpperCase()}</span>
                    </div>
                  )}

                  <h3 className="font-black text-base text-gray-950 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Instructor */}
                  {course.instructor && (
                    <p className="text-[11px] text-gray-400 font-semibold truncate">
                      Instructor: <span className="text-gray-700">{course.instructor}</span>
                    </p>
                  )}

                  {/* Skills Covered Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {course.skillsCovered.map((sk) => (
                      <span
                        key={sk}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          userTargetSkills.includes(sk)
                            ? 'bg-[#d8ff3e] text-black ring-1 ring-black'
                            : 'bg-[#eaebef] text-gray-700'
                        }`}
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-full bg-[#15161a] hover:bg-black text-white text-xs font-black flex items-center justify-center gap-2 transition-all duration-200 shadow-sm group-hover:shadow active:scale-95"
                >
                  <span className="truncate">
                    {course.type === 'youtube' ? 'Watch Course' : 'Enroll Credential'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#d8ff3e] shrink-0" />
                </a>

                <button
                  type="button"
                  onClick={() => toggleCourseCompleted(course.id)}
                  title={completedCourses.includes(course.id) ? 'Mark as incomplete' : 'Mark as completed (+150 pts)'}
                  className={`px-3 py-3 rounded-full text-xs font-bold transition-all duration-200 shrink-0 flex items-center justify-center ${
                    completedCourses.includes(course.id)
                      ? 'bg-emerald-500 text-white shadow-sm hover:bg-emerald-600'
                      : 'bg-gray-100 hover:bg-[#d8ff3e] text-gray-700 hover:text-black border border-gray-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
