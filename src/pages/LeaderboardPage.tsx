import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Application, Bookmark } from '../types';
import {
  INITIAL_STUDENT_LEADERBOARD,
  INITIAL_UNIVERSITY_LEADERBOARD,
  computeUserLeaderboardScore,
} from '../data/leaderboardData';
import {
  Trophy,
  Award,
  Medal,
  Sparkles,
  Building2,
  Users,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Star,
  CheckCircle2,
} from 'lucide-react';

interface LeaderboardPageProps {
  applications: Application[];
  bookmarks: Bookmark[];
  onNavigateTab: (tab: string) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  applications,
  bookmarks,
  onNavigateTab,
}) => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'students' | 'universities'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversityFilter, setSelectedUniversityFilter] = useState('All');

  // Compute live user score & breakdown
  const { score: currentUserScore, breakdown: scoreBreakdown } = useMemo(() => {
    return computeUserLeaderboardScore(user, applications, bookmarks);
  }, [user, applications, bookmarks]);

  // Combine currentUser into students leaderboard if user exists
  const combinedStudents = useMemo(() => {
    const list = [...INITIAL_STUDENT_LEADERBOARD];

    if (user) {
      // Check if user already exists
      const existingIdx = list.findIndex((s) => s.id === user.id || s.id === 'current-user');
      const userEntry = {
        id: user.id || 'current-user',
        name: `${user.name || 'You'} (You)`,
        photoURL: user.photoURL,
        college: user.college || 'Stanford University',
        course: user.course || 'Computer Science',
        year: user.year || '3rd Year',
        skills: user.skills && user.skills.length > 0 ? user.skills : ['Python', 'React', 'AI/ML'],
        achievements:
          user.achievements && user.achievements.length > 0
            ? user.achievements
            : ['Profile Verified Student', 'Fast-Track Career Applicant'],
        score: currentUserScore,
        badge: currentUserScore > 4000 ? 'Rising Vanguard ⭐' : 'Career Explorer 🚀',
        completedCount: applications.filter((a) => a.status === 'Completed').length,
        appliedCount: applications.length,
        isCurrentUser: true,
      };

      if (existingIdx >= 0) {
        list[existingIdx] = userEntry;
      } else {
        list.push(userEntry);
      }
    }

    // Sort descending by score
    list.sort((a, b) => b.score - a.score);

    // Assign rank
    return list.map((item, idx) => ({ ...item, rank: idx + 1, isCurrentUser: !!item.isCurrentUser }));
  }, [user, currentUserScore, applications]);

  // Dynamic University leaderboard with live student points added to their campus
  const combinedUniversities = useMemo(() => {
    const unis = INITIAL_UNIVERSITY_LEADERBOARD.map((u) => ({ ...u }));

    if (user && user.college) {
      const matched = unis.find(
        (u) =>
          u.university.toLowerCase().includes(user.college.toLowerCase()) ||
          user.college.toLowerCase().includes(u.university.toLowerCase())
      );
      if (matched) {
        matched.totalScore += Math.round(currentUserScore * 0.4); // contribution
        matched.activeStudents += 1;
        matched.totalAchievements += user.achievements?.length || 1;
      } else {
        // Add new university
        unis.push({
          rank: unis.length + 1,
          university: user.college,
          logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&auto=format&fit=crop&q=80',
          totalScore: currentUserScore,
          activeStudents: 1,
          topSkills: user.skills?.slice(0, 4) || ['React', 'Python'],
          totalAchievements: user.achievements?.length || 1,
        });
      }
    }

    unis.sort((a, b) => b.totalScore - a.totalScore);
    return unis.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [user, currentUserScore]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return combinedStudents.filter((s) => {
      if (selectedUniversityFilter !== 'All' && s.college !== selectedUniversityFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = s.name.toLowerCase().includes(q);
        const matchCollege = s.college.toLowerCase().includes(q);
        const matchSkill = s.skills.some((sk) => sk.toLowerCase().includes(q));
        if (!matchName && !matchCollege && !matchSkill) return false;
      }
      return true;
    });
  }, [combinedStudents, searchQuery, selectedUniversityFilter]);

  // Unique university list for filter
  const allUniversities = useMemo(() => {
    const set = new Set<string>();
    combinedStudents.forEach((s) => set.add(s.college));
    return ['All', ...Array.from(set)];
  }, [combinedStudents]);

  // Current user's standing
  const currentUserRank = useMemo(() => {
    const found = combinedStudents.find((s) => s.isCurrentUser);
    return found ? found.rank : 3;
  }, [combinedStudents]);

  const currentUserUniRank = useMemo(() => {
    if (!user?.college) return 1;
    const sameUni = combinedStudents.filter((s) => s.college === user.college);
    const pos = sameUni.findIndex((s) => s.isCurrentUser);
    return pos >= 0 ? pos + 1 : 1;
  }, [combinedStudents, user]);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-up select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-950 font-sans">
              Global & Campus Leaderboard
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d8ff3e]/40 text-black text-xs font-black">
              <Trophy className="w-3.5 h-3.5" />
              Cycle 2026
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Rankings calibrated by verified technical skills, verified awards, hackathon wins, and active pipeline velocity.
          </p>
        </div>

        {/* View Switcher Pill */}
        <div className="flex items-center p-1 bg-white rounded-full shadow-sm border border-gray-100 self-start sm:self-auto">
          <button
            onClick={() => setActiveView('students')}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all duration-200 flex items-center gap-1.5 ${
              activeView === 'students'
                ? 'bg-[#15161a] text-white shadow-sm'
                : 'text-gray-600 hover:text-black hover:bg-gray-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Students Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveView('universities')}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all duration-200 flex items-center gap-1.5 ${
              activeView === 'universities'
                ? 'bg-[#15161a] text-white shadow-sm'
                : 'text-gray-600 hover:text-black hover:bg-gray-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>University Leaderboard</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Your Worldwide Rank */}
        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Your Global Rank
            </span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-950">
              #{currentUserRank}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Top 2% Worldwide
            </span>
          </div>
          <p className="text-[11px] text-gray-400 font-medium mt-1">
            Out of 2,400+ active candidates
          </p>
        </div>

        {/* Stat 2: Your University Rank */}
        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Campus Rank
            </span>
            <Building2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-950">
              #{currentUserUniRank}
            </span>
            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[130px]">
              {user?.college || 'Stanford'}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 font-medium mt-1">
            Leading engineering applicant on campus
          </p>
        </div>

        {/* Stat 3: Total Leaderboard Score */}
        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Your Total Score
            </span>
            <Sparkles className="w-4 h-4 text-[#d8ff3e]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-950">
              {currentUserScore.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-black bg-[#d8ff3e] px-2 py-0.5 rounded-full">
              pts
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('profile')}
            className="text-[11px] text-gray-500 hover:text-black font-bold mt-1 text-left flex items-center gap-1"
          >
            <span>Add skills & awards to climb</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Stat 4: Top University Banner */}
        <div className="bg-[#17181c] text-white rounded-[28px] p-5 shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#d8ff3e]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider text-[#d8ff3e]">
              #1 Ranked Campus
            </span>
            <Medal className="w-4 h-4 text-[#d8ff3e]" />
          </div>
          <div className="mt-3">
            <span className="text-xl font-black text-white line-clamp-1">
              {combinedUniversities[0]?.university || 'Stanford University'}
            </span>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">
              {combinedUniversities[0]?.totalScore.toLocaleString()} Campus Points
            </p>
          </div>
          <p className="text-[10px] text-gray-400 font-medium mt-1">
            {combinedUniversities[0]?.activeStudents} student contributors active
          </p>
        </div>
      </div>

      {/* VIEW 1: STUDENTS LEADERBOARD */}
      {activeView === 'students' && (
        <div className="space-y-6">
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {filteredStudents.slice(0, 3).map((student, idx) => {
              const medalColors = [
                'from-amber-400/20 to-amber-500/5 border-amber-300', // Gold #1
                'from-gray-300/20 to-gray-400/5 border-gray-300', // Silver #2
                'from-amber-700/15 to-amber-800/5 border-amber-700/30', // Bronze #3
              ];
              const rankLabels = ['1st Place 🥇', '2nd Place 🥈', '3rd Place 🥉'];

              return (
                <div
                  key={student.id}
                  className={`bg-white rounded-[32px] p-6 shadow-sm border ${
                    student.isCurrentUser ? 'ring-2 ring-[#d8ff3e] border-black' : 'border-gray-100'
                  } flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300`}
                >
                  {/* Top Rank Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full bg-gradient-to-r ${medalColors[idx]} border font-sans`}
                    >
                      {rankLabels[idx]}
                    </span>
                    <span className="text-sm font-black text-gray-900 bg-gray-50 px-2.5 py-0.5 rounded-full">
                      {student.score.toLocaleString()} pts
                    </span>
                  </div>

                  {/* Student Info */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <img
                      src={
                        student.photoURL ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={student.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-100 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-base text-gray-950 leading-tight">
                          {student.name}
                        </h3>
                        {student.isCurrentUser && (
                          <span className="px-1.5 py-0.2 bg-[#d8ff3e] text-black text-[9px] font-black rounded">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-semibold truncate max-w-[200px] mt-0.5">
                        {student.college}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-extrabold text-[#7a7bf8] bg-[#eaebef] px-2 py-0.5 rounded-full">
                        {student.badge || 'Rising Star'}
                      </span>
                    </div>
                  </div>

                  {/* Skills Chips */}
                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {student.skills.slice(0, 4).map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#eaebef] text-gray-700"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    {/* Top Achievement */}
                    {student.achievements && student.achievements.length > 0 && (
                      <p className="text-[11px] font-medium text-gray-500 flex items-center gap-1 line-clamp-1 pt-1">
                        <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{student.achievements[0]}</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
            {/* Search Input */}
            <div className="relative flex items-center w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate, skill, or university..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 text-xs font-medium text-gray-900 placeholder-gray-400 border border-transparent focus:border-gray-200 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* University Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {allUniversities.slice(0, 5).map((uni) => (
                <button
                  key={uni}
                  onClick={() => setSelectedUniversityFilter(uni)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedUniversityFilter === uni
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {uni}
                </button>
              ))}
            </div>
          </div>

          {/* Full Leaderboard Table */}
          <div className="bg-white rounded-[32px] p-4 sm:p-6 shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-extrabold text-[10px]">
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Candidate</th>
                  <th className="py-3 px-3">University & Major</th>
                  <th className="py-3 px-3">Verified Skills</th>
                  <th className="py-3 px-3">Key Achievements</th>
                  <th className="py-3 px-3 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.map((st) => (
                  <tr
                    key={st.id}
                    className={`hover:bg-gray-50/80 transition-colors ${
                      st.isCurrentUser ? 'bg-[#d8ff3e]/10 font-bold' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                          st.rank === 1
                            ? 'bg-amber-400 text-black shadow-xs'
                            : st.rank === 2
                            ? 'bg-gray-200 text-black'
                            : st.rank === 3
                            ? 'bg-amber-700/20 text-amber-900'
                            : 'text-gray-500'
                        }`}
                      >
                        #{st.rank}
                      </span>
                    </td>

                    {/* Candidate */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            st.photoURL ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                          }
                          alt={st.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-gray-100"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-gray-900 text-sm">
                              {st.name}
                            </span>
                            {st.isCurrentUser && (
                              <span className="px-1.5 py-0.2 bg-[#d8ff3e] text-black text-[9px] font-black rounded">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400">{st.badge}</span>
                        </div>
                      </div>
                    </td>

                    {/* University */}
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-gray-900 truncate max-w-[200px]">{st.college}</p>
                      <p className="text-[10px] text-gray-500">{st.course}</p>
                    </td>

                    {/* Skills */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 flex-wrap max-w-xs">
                        {st.skills.slice(0, 3).map((sk) => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-semibold"
                          >
                            {sk}
                          </span>
                        ))}
                        {st.skills.length > 3 && (
                          <span className="text-[10px] text-gray-400 font-bold">
                            +{st.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Key Achievements */}
                    <td className="py-3.5 px-3">
                      {st.achievements && st.achievements.length > 0 ? (
                        <div className="flex items-center gap-1 text-gray-700 max-w-xs truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{st.achievements[0]}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Standard Profile</span>
                      )}
                    </td>

                    {/* Score */}
                    <td className="py-3.5 px-3 text-right">
                      <span className="text-sm font-black text-gray-950 font-sans">
                        {st.score.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400 ml-1">pts</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: UNIVERSITIES LEADERBOARD */}
      {activeView === 'universities' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {combinedUniversities.map((uni) => {
              const isUserCampus =
                user?.college &&
                (uni.university.toLowerCase().includes(user.college.toLowerCase()) ||
                  user.college.toLowerCase().includes(uni.university.toLowerCase()));

              return (
                <div
                  key={uni.university}
                  className={`bg-white rounded-[32px] p-6 shadow-sm border ${
                    isUserCampus ? 'ring-2 ring-[#d8ff3e] border-black' : 'border-gray-100'
                  } hover:shadow-lg transition-all duration-300 flex flex-col justify-between`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                            uni.rank === 1
                              ? 'bg-amber-400 text-black shadow-xs'
                              : uni.rank === 2
                              ? 'bg-gray-200 text-black'
                              : uni.rank === 3
                              ? 'bg-amber-700/20 text-amber-900'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          #{uni.rank}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-lg text-gray-950 leading-tight">
                              {uni.university}
                            </h3>
                            {isUserCampus && (
                              <span className="px-2 py-0.5 rounded-full bg-[#d8ff3e] text-black text-[10px] font-black">
                                Your Campus 🎓
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">
                            {uni.activeStudents} Verified Student Contributors
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-2xl font-black text-gray-950 font-sans block leading-none">
                          {uni.totalScore.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">Total Campus Pts</span>
                      </div>
                    </div>

                    {/* Progress Bar of total market share */}
                    <div className="my-3">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-1">
                        <span>Campus Pipeline Share</span>
                        <span>{Math.round((uni.totalScore / 30000) * 100)}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gray-900 to-[#141518] rounded-full"
                          style={{ width: `${Math.min(100, Math.round((uni.totalScore / 30000) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Top Skills Represented */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-gray-400 mr-1">Dominant Skills:</span>
                      {uni.topSkills.map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#eaebef] text-gray-800"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs font-extrabold text-gray-700 shrink-0">
                      {uni.totalAchievements} Awards 🏆
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
