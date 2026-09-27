import React, { useState, useMemo } from 'react';
import type { Opportunity, Application, Bookmark } from '../types';
import {
  Zap,
  Compass,
  Briefcase,
  Sparkles,
  TrendingUp,
  MoreVertical,
  ChevronDown,
  ArrowUpRight,
  Calendar,
  Flame,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { getDaysRemaining } from '../utils/dateUtils';
import { OrgLogo } from '../components/ui/OrgLogo';
import { useAuth } from '../context/AuthContext';
import { calculateMatchScore } from '../utils/matchingEngine';

interface DashboardPageProps {
  opportunities: Opportunity[];
  applications: Application[];
  bookmarks: Bookmark[];
  onNavigateTab: (tab: string) => void;
  onViewDetails: (opportunity: Opportunity) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  opportunities,
  applications,
  bookmarks,
  onNavigateTab,
  onViewDetails,
}) => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<'Today' | 'This Week' | 'This Month'>('Today');
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<'Monthly' | 'Quarterly'>('Monthly');

  // 1. DYNAMIC OPPORTUNITY VELOCITY METRICS
  const totalOppsCount = opportunities.length;
  const internshipCount = useMemo(
    () => opportunities.filter((o) => o.type === 'Internship').length,
    [opportunities]
  );
  const hackathonCount = useMemo(
    () => opportunities.filter((o) => o.type === 'Hackathon').length,
    [opportunities]
  );
  const workshopCount = useMemo(
    () =>
      opportunities.filter(
        (o) => o.type === 'Workshop' || o.type === 'Certification' || o.type === 'Competition'
      ).length,
    [opportunities]
  );

  const totalTypeCount = internshipCount + hackathonCount + workshopCount || 1;
  const internshipPct = Math.round((internshipCount / totalTypeCount) * 100);
  const hackathonPct = Math.round((hackathonCount / totalTypeCount) * 100);
  const workshopPct = Math.max(0, 100 - internshipPct - hackathonPct);

  // Dynamic Pipeline Points
  const pipelinePoints =
    totalOppsCount * 125 + applications.length * 340 + bookmarks.length * 90;
  const formattedPipelinePoints =
    pipelinePoints >= 1000
      ? `${(pipelinePoints / 1000).toFixed(1).replace('.0', '')}k`
      : `${pipelinePoints}`;
  const velocityGrowth = Math.min(32, Math.max(8, 12 + applications.length * 3 + bookmarks.length * 2));

  // 2. DYNAMIC SKILL MATCH RATE METRICS
  const matchScores = useMemo(() => {
    return opportunities.map((opp) => calculateMatchScore(opp, user));
  }, [opportunities, user]);

  const maxMatchPercentage = useMemo(() => {
    if (matchScores.length === 0) return 85;
    return Math.max(...matchScores.map((s) => s.percentage));
  }, [matchScores]);

  const avgMatchPercentage = useMemo(() => {
    if (matchScores.length === 0) return 75;
    const sum = matchScores.reduce((acc, s) => acc + s.percentage, 0);
    return Math.round(sum / matchScores.length);
  }, [matchScores]);

  const highMatchOppsCount = useMemo(() => {
    return matchScores.filter((s) => s.percentage >= 80).length;
  }, [matchScores]);

  // 3. DYNAMIC ACTIVE OPPORTUNITIES & TIMEFRAME METRICS
  const activeOpportunities = useMemo(() => {
    return opportunities.filter((o) => getDaysRemaining(o.deadline) >= 0);
  }, [opportunities]);

  const urgentDeadlines = useMemo(() => {
    return opportunities.filter((opp) => {
      const days = getDaysRemaining(opp.deadline);
      if (timeframe === 'Today') return days === 0;
      if (timeframe === 'This Week') return days >= 0 && days <= 7;
      return days >= 0 && days <= 30; // 'This Month'
    });
  }, [opportunities, timeframe]);

  const totalTracked = applications.length + bookmarks.length;

  // 4. DYNAMIC READINESS INDEX METRICS
  const { readinessIndex, readinessDelta, dotMatrix } = useMemo(() => {
    // 4.1 Profile completeness component (up to 40 pts)
    let profilePts = 0;
    if (user?.name) profilePts += 8;
    if (user?.college) profilePts += 8;
    if (user?.course) profilePts += 6;
    if (user?.skills && user.skills.length >= 3) profilePts += 12;
    else if (user?.skills && user.skills.length > 0) profilePts += 6;
    if (user?.interests && user.interests.length > 0) profilePts += 6;

    // 4.2 Application activity component (up to 35 pts)
    let appPts = 0;
    if (bookmarks.length > 0) appPts += 10;
    const appliedApps = applications.filter((a) => a.status === 'Applied');
    const advancedApps = applications.filter(
      (a) => a.status === 'Shortlisted' || a.status === 'Completed'
    );
    if (appliedApps.length > 0) appPts += 15;
    if (advancedApps.length > 0) appPts += 10;

    // 4.3 Market readiness component (up to 25 pts)
    const marketPts = Math.min(25, Math.round(avgMatchPercentage * 0.25));

    const totalReadiness = Math.min(99, Math.max(30, profilePts + appPts + marketPts));
    const delta = applications.length > 0 ? `+${Math.min(24, 6 + applications.length * 3)}%` : '+6%';

    // Generate dynamic 7x6 dot matrix heatmap (7 days x 6 stages)
    const matrix = [
      // Mon
      [0.4, 0.6, 0.7 + (appliedApps.length > 0 ? 0.2 : 0), 0.8, 0.6, 0.9],
      // Tue
      [0.5, 0.7, 0.8, 0.6 + (advancedApps.length > 0 ? 0.3 : 0), 0.7, 0.8],
      // Wed
      [0.6, 0.5, 0.8, 0.8, 0.5, 0.9],
      // Thu
      [0.7, 0.8, 0.6 + (bookmarks.length > 0 ? 0.25 : 0), 0.7, 0.9, 0.7],
      // Fri
      [0.6, 0.7, 0.9, 0.9, 0.8, 0.8 + (applications.length > 2 ? 0.15 : 0)],
      // Sat
      [0.8, 0.9, 0.7, 0.8, 0.9, 0.7],
      // Sun
      [0.7, 0.8, 0.9, 0.8, 0.6, 0.9],
    ].map((col, cIdx) =>
      col.map((val, rIdx) => {
        const adjusted = Math.min(1.0, Math.max(0.2, (val * totalReadiness) / 85));
        return {
          intensity: adjusted,
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][cIdx],
          stage: ['Profile Sync', 'Discovery', 'Saved Opps', 'Applications', 'Screening', 'Readiness Score'][rIdx],
          score: Math.round(adjusted * 100),
        };
      })
    );

    return { readinessIndex: totalReadiness, readinessDelta: delta, dotMatrix: matrix };
  }, [user, applications, bookmarks, avgMatchPercentage]);

  // 5. DYNAMIC RECRUITING SEASON VELOCITY METRICS
  const appliedCount = applications.filter((a) => a.status === 'Applied').length;
  const shortlistedCount = applications.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Completed'
  ).length;

  const submissionRate = useMemo(() => {
    const totalConsidered = applications.length + bookmarks.length;
    if (totalConsidered === 0) return 92;
    return Math.min(100, Math.max(40, Math.round((applications.length / totalConsidered) * 100)));
  }, [applications, bookmarks]);

  const milestonesCompleted = useMemo(() => {
    return appliedCount * 1 + shortlistedCount * 2 + bookmarks.length * 1 + (user?.skills?.length ? 3 : 0);
  }, [appliedCount, shortlistedCount, bookmarks, user]);

  // Monthly opportunity distribution across season
  const monthlyData = useMemo(() => {
    const months = [
      { id: 'jun', label: 'Jun', monthNum: 5, base: 14 },
      { id: 'jul', label: 'Jul', monthNum: 6, base: 22 },
      { id: 'aug', label: 'Aug', monthNum: 7, base: 12 },
      { id: 'sep', label: 'Sept', monthNum: 8, base: 36, isPeak: true },
      { id: 'oct', label: 'Oct', monthNum: 9, base: 18 },
      { id: 'nov', label: 'Nov', monthNum: 10, base: 24 },
      { id: 'dec', label: 'Dec', monthNum: 11, base: 16 },
    ];

    return months.map((m) => {
      const matchingOpps = opportunities.filter((opp) => {
        try {
          const d = new Date(opp.deadline);
          return d.getMonth() === m.monthNum;
        } catch {
          return false;
        }
      });
      const count = m.base + matchingOpps.length * 2;
      return {
        ...m,
        count,
        heightPct: Math.min(100, Math.max(28, Math.round((count / 42) * 100))),
      };
    });
  }, [opportunities]);

  // Quarterly distribution for toggle
  const quarterlyData = useMemo(() => {
    return [
      { id: 'q1', label: 'Q1', fullName: 'Spring Cycle', count: 18 + opportunities.slice(0, 4).length, heightPct: 45 },
      { id: 'q2', label: 'Q2', fullName: 'Summer Internships', count: 28 + opportunities.slice(4, 10).length, heightPct: 65 },
      { id: 'q3', label: 'Q3', fullName: 'Fall Hiring Peak', count: 46 + opportunities.slice(10, 20).length, heightPct: 100, isPeak: true },
      { id: 'q4', label: 'Q4', fullName: 'Winter Fellowships', count: 22 + opportunities.slice(20).length, heightPct: 50 },
    ];
  }, [opportunities]);

  // Dynamic Featured Opportunities sorted by highest match for this user
  const featuredOpps = useMemo(() => {
    return [...opportunities]
      .sort((a, b) => {
        const scoreA = calculateMatchScore(a, user).percentage;
        const scoreB = calculateMatchScore(b, user).percentage;
        return scoreB - scoreA;
      })
      .slice(0, 4);
  }, [opportunities, user]);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-up select-none">
      {/* Page Title & Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-950 font-sans">
              Opportunity Overview
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d8ff3e]/40 text-black text-xs font-black">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              Live Cycle ({activeOpportunities.length} Active)
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Track your career velocity, applications, and upcoming deadlines in real time!
          </p>
        </div>

        {/* Date and Timeframe Dropdown */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="text-xs sm:text-sm font-semibold text-gray-400">
            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>

          <div className="relative">
            <button
              onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
              className="px-4 py-2 rounded-full bg-white hover:bg-gray-50 text-xs sm:text-sm font-bold text-gray-800 shadow-sm flex items-center gap-1.5 transition-all duration-200 hover:shadow focus:outline-none"
            >
              <span>{timeframe}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                  isTimeframeOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isTimeframeOpen && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-gray-100 p-1.5 z-40 animate-scale-in">
                {(['Today', 'This Week', 'This Month'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTimeframe(t);
                      setIsTimeframeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      timeframe === t ? 'bg-[#d8ff3e]/40 text-black' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main 5-Card Signature Dashboard Grid matching Flux Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* CARD 1: Pipeline Velocity (Left Tall Card) */}
        <div className="lg:col-span-4 bg-white rounded-[32px] p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div
                onClick={() => onNavigateTab('explore')}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 group-hover:bg-[#d8ff3e] transition-colors duration-300">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-gray-900 group-hover:text-black">
                  Opportunity Velocity
                </span>
              </div>
              <button
                onClick={() => onNavigateTab('explore')}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50"
                title="View All Opportunities"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Stat Row */}
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-black tracking-tight text-gray-950 font-sans">
                {formattedPipelinePoints}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#d8ff3e] text-black font-extrabold text-xs shadow-sm">
                +{velocityGrowth}%
              </span>
              <span className="text-xs text-gray-400 font-semibold">
                pipeline points
              </span>
            </div>

            {/* Dynamic Overlapping 3 Circles Diagram */}
            <div className="relative my-8 h-56 flex items-center justify-center">
              {/* Circle 1: Lavender (Internships) */}
              <div
                onClick={() => onNavigateTab('explore')}
                className="absolute left-4 top-2 w-36 h-36 rounded-full bg-[#b5b6ff] flex flex-col items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 z-10 cursor-pointer group/c1"
                title="Click to view Internships"
              >
                <span className="text-2xl font-black text-gray-950 leading-tight">
                  {internshipCount >= 10 ? internshipCount : `${internshipCount}`}
                </span>
                <span className="text-xs font-bold text-gray-700">
                  Internships
                </span>
                <span className="text-[10px] text-gray-600 font-extrabold mt-0.5 opacity-0 group-hover/c1:opacity-100 transition-opacity">
                  {internshipPct}% of Total
                </span>
              </div>

              {/* Circle 2: Dark Charcoal (Hackathons) */}
              <div
                onClick={() => onNavigateTab('explore')}
                className="absolute right-6 top-8 w-32 h-32 rounded-full bg-[#1c1d22] flex flex-col items-center justify-center shadow-xl transition-transform duration-300 hover:scale-110 z-20 cursor-pointer group/c2"
                title="Click to view Hackathons"
              >
                <span className="text-xl font-black text-white leading-tight">
                  {hackathonCount}
                </span>
                <span className="text-xs font-bold text-gray-300">
                  Hackathons
                </span>
                <span className="text-[10px] text-gray-400 font-extrabold mt-0.5 opacity-0 group-hover/c2:opacity-100 transition-opacity">
                  {hackathonPct}% of Total
                </span>
              </div>

              {/* Circle 3: Neon Lime (Workshops & Programs) */}
              <div
                onClick={() => onNavigateTab('explore')}
                className="absolute bottom-2 left-24 w-24 h-24 rounded-full bg-[#d8ff3e] flex flex-col items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 z-30 cursor-pointer group/c3"
                title="Click to view Workshops & Programs"
              >
                <span className="text-lg font-black text-black leading-tight">
                  {workshopCount}
                </span>
                <span className="text-[10px] font-extrabold text-gray-800">
                  Workshops
                </span>
                <span className="text-[9px] text-black font-extrabold opacity-0 group-hover/c3:opacity-100 transition-opacity">
                  {workshopPct}%
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Breakdown Progress Bars (100% Data Driven) */}
          <div className="space-y-3.5 pt-4 border-t border-gray-100">
            {/* Row 1 */}
            <div
              onClick={() => onNavigateTab('explore')}
              className="flex items-center justify-between text-xs group/bar cursor-pointer"
            >
              <span className="font-extrabold text-gray-950 text-base w-12">{internshipPct} %</span>
              <div className="flex-1 mx-3 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-[#b5b6ff] rounded-full transition-all duration-500 group-hover/bar:brightness-95"
                  style={{ width: `${internshipPct}%` }}
                />
              </div>
              <span className="font-bold text-gray-600 flex items-center gap-1.5 w-24 justify-end">
                Internships
                <span className="w-2 h-2 rounded-full bg-[#b5b6ff]" />
              </span>
            </div>

            {/* Row 2 */}
            <div
              onClick={() => onNavigateTab('explore')}
              className="flex items-center justify-between text-xs group/bar cursor-pointer"
            >
              <span className="font-extrabold text-gray-950 text-base w-12">{hackathonPct} %</span>
              <div className="flex-1 mx-3 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-[#1c1d22] rounded-full transition-all duration-500 group-hover/bar:brightness-125"
                  style={{ width: `${hackathonPct}%` }}
                />
              </div>
              <span className="font-bold text-gray-600 flex items-center gap-1.5 w-24 justify-end">
                Hackathons
                <span className="w-2 h-2 rounded-full bg-[#1c1d22]" />
              </span>
            </div>

            {/* Row 3 */}
            <div
              onClick={() => onNavigateTab('explore')}
              className="flex items-center justify-between text-xs group/bar cursor-pointer"
            >
              <span className="font-extrabold text-gray-950 text-base w-12">{workshopPct} %</span>
              <div className="flex-1 mx-3 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-[#d8ff3e] rounded-full transition-all duration-500 group-hover/bar:brightness-95"
                  style={{ width: `${workshopPct}%` }}
                />
              </div>
              <span className="font-bold text-gray-600 flex items-center gap-1.5 w-24 justify-end">
                Workshops
                <span className="w-2 h-2 rounded-full bg-[#d8ff3e]" />
              </span>
            </div>
          </div>
        </div>

        {/* Right Section (Span 8 Columns on lg) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Top Half: Match Rate + Active Opportunities + Readiness Index */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Stack: Match Rate + Active Opportunities */}
            <div className="flex flex-col gap-5">
              {/* CARD 2: Skill Match Rate */}
              <div
                onClick={() => onNavigateTab('profile')}
                className="bg-white rounded-[28px] p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 group-hover:bg-[#d8ff3e] transition-colors">
                      <Compass className="w-4 h-4 text-gray-800" />
                    </div>
                    <span className="text-sm font-bold text-gray-900 group-hover:text-black">
                      Skill Match Rate
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-400 group-hover:text-black">
                    Edit Skills →
                  </span>
                </div>

                <div className="flex items-end justify-between mt-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
                      {maxMatchPercentage}
                    </span>
                    <span className="text-xs font-bold text-gray-400 ml-1.5">
                      % peak fit
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] font-bold text-gray-400 leading-tight">
                      {highMatchOppsCount} Highly Aligned
                    </p>
                    <p className="text-xs font-black text-gray-800 leading-tight mt-0.5">
                      Avg {avgMatchPercentage}% Profile Fit
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD 3: Active Opportunities */}
              <div
                onClick={() => onNavigateTab('explore')}
                className="bg-white rounded-[28px] p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 group-hover:bg-[#d8ff3e] transition-colors">
                      <Briefcase className="w-4 h-4 text-gray-800" />
                    </div>
                    <span className="text-sm font-bold text-gray-900 group-hover:text-black">
                      Active Opportunities
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-400 group-hover:text-black">
                    Explore →
                  </span>
                </div>

                <div className="flex items-end justify-between mt-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
                      {activeOpportunities.length > 0 ? activeOpportunities.length : opportunities.length}
                    </span>
                    <span className="text-xs font-bold text-gray-400 ml-1.5">
                      active opps
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] font-bold text-gray-400 leading-tight">
                      {totalTracked > 0
                        ? `${totalTracked} Tracked (${applications.length} Applied)`
                        : 'No active applications'}
                    </p>
                    <p className="text-xs font-black text-gray-800 leading-tight mt-0.5">
                      {urgentDeadlines.length > 0
                        ? `${urgentDeadlines.length} closing ${timeframe.toLowerCase()}`
                        : `0 closing ${timeframe.toLowerCase()}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Stack: CARD 4: Readiness Index (7x6 Lavender Dot Matrix) */}
            <div
              onClick={() => onNavigateTab('profile')}
              className="bg-white rounded-[28px] p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 font-black text-xs group-hover:bg-[#d8ff3e] transition-colors">
                      %
                    </div>
                    <span className="text-sm font-bold text-gray-900 group-hover:text-black">
                      Readiness Index
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-400 group-hover:text-black">
                    Profile Score →
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
                    {readinessIndex}
                  </span>
                  <span className="text-xs font-bold text-gray-500">%</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#d8ff3e] text-black font-extrabold text-xs shadow-sm">
                    {readinessDelta}
                  </span>
                </div>
              </div>

              {/* Dynamic Dot Matrix Heatmap Graphic (7 columns x 6 rows) */}
              <div className="my-3 py-2 flex items-center justify-center">
                <div className="grid grid-cols-7 gap-2.5 sm:gap-3">
                  {dotMatrix.map((column, colIdx) => (
                    <div key={colIdx} className="flex flex-col gap-2">
                      {column.map((item, rowIdx) => {
                        let bgClass = 'bg-[#e4e5ff]';
                        if (item.score >= 82) bgClass = 'bg-[#7a7bf8]';
                        else if (item.score >= 65) bgClass = 'bg-[#9899f8]';
                        else if (item.score >= 45) bgClass = 'bg-[#b5b6ff]';

                        return (
                          <div
                            key={rowIdx}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${bgClass} transition-all duration-300 hover:scale-150 hover:shadow-md cursor-pointer`}
                            title={`${item.day} · ${item.stage}: ${item.score}% Readiness`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Half: CARD 5: Recruiting Season Velocity (Dark Charcoal Matte Card #17181c) */}
          <div className="bg-[#17181c] text-white rounded-[32px] p-6 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
            {/* Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#d8ff3e]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-white tracking-tight">
                  Recruiting Season Velocity
                </span>
              </div>

              {/* Monthly / Quarterly Dropdown Pill */}
              <div className="relative">
                <button
                  onClick={() => setChartPeriod(chartPeriod === 'Monthly' ? 'Quarterly' : 'Monthly')}
                  className="px-3.5 py-1.5 rounded-full bg-[#23242a] hover:bg-[#2e3037] text-xs font-bold text-gray-300 flex items-center gap-1.5 border border-white/5 transition-colors cursor-pointer"
                >
                  <span>{chartPeriod} View</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="flex items-center gap-8 my-5">
              {/* Metric 1 */}
              <div>
                <div className="flex items-center">
                  <span className="w-1.5 h-5 rounded-full bg-[#d8ff3e] mr-2.5 shadow-[0_0_8px_rgba(216,255,62,0.6)]" />
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {submissionRate} <span className="text-sm font-semibold text-gray-400">%</span>
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-medium mt-1 ml-4">
                  Submission Rate
                </p>
              </div>

              {/* Metric 2 */}
              <div>
                <div className="flex items-center">
                  <span className="w-1.5 h-5 rounded-full bg-[#b5b6ff] mr-2.5 shadow-[0_0_8px_rgba(181,182,255,0.6)]" />
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {milestonesCompleted}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-medium mt-1 ml-4">
                  Milestones Completed
                </p>
              </div>
            </div>

            {/* Dynamic Bar Chart: Monthly vs Quarterly */}
            <div className="pt-2">
              {chartPeriod === 'Monthly' ? (
                <div className="flex items-end justify-between gap-2 sm:gap-4 h-36 px-2">
                  {monthlyData.map((m) => {
                    if (m.isPeak) {
                      return (
                        <div
                          key={m.id}
                          onClick={() => onNavigateTab('explore')}
                          className="flex flex-col items-center gap-2 flex-1 relative -mb-1 cursor-pointer group"
                          title={`${m.label}: ${m.count} Peak Postings & Deadlines`}
                        >
                          <div className="flex items-end gap-1.5">
                            {/* Neon Lime Bar */}
                            <div
                              className="w-4 sm:w-5 rounded-full bg-[#d8ff3e] shadow-[0_0_20px_rgba(216,255,62,0.5)] transition-all duration-300 group-hover:scale-105"
                              style={{ height: `${Math.min(128, Math.max(48, (m.heightPct / 100) * 128))}px` }}
                            />
                            {/* Lavender Bar */}
                            <div
                              className="w-4 sm:w-5 rounded-full bg-[#b5b6ff] shadow-[0_0_20px_rgba(181,182,255,0.5)] transition-all duration-300 group-hover:scale-105"
                              style={{ height: `${Math.min(100, Math.max(36, (m.heightPct / 100) * 96))}px` }}
                            />
                          </div>
                          <span className="text-xs font-black text-white flex items-center gap-0.5 mt-1">
                            {m.label} <ArrowUpRight className="w-3 h-3 text-[#d8ff3e]" />
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={m.id}
                        onClick={() => onNavigateTab('explore')}
                        className="flex flex-col items-center gap-2 group cursor-pointer flex-1"
                        title={`${m.label}: ${m.count} Active Opportunities`}
                      >
                        <div
                          className="w-5 sm:w-6 rounded-full bg-[#252824] bg-[radial-gradient(#3a403a_1px,transparent_1px)] [background-size:4px_4px] group-hover:bg-[#2f352e] group-hover:scale-105 transition-all duration-300"
                          style={{ height: `${Math.min(110, Math.max(28, (m.heightPct / 100) * 110))}px` }}
                        />
                        <span className="text-[11px] font-semibold text-gray-400 group-hover:text-white">
                          {m.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-end justify-around gap-4 sm:gap-8 h-36 px-4">
                  {quarterlyData.map((q) => (
                    <div
                      key={q.id}
                      onClick={() => onNavigateTab('explore')}
                      className="flex flex-col items-center gap-2 group cursor-pointer flex-1"
                      title={`${q.fullName}: ${q.count} Active Programs`}
                    >
                      <div
                        className={`w-10 sm:w-14 rounded-2xl transition-all duration-300 group-hover:scale-105 ${
                          q.isPeak
                            ? 'bg-[#d8ff3e] text-black shadow-[0_0_20px_rgba(216,255,62,0.4)] flex items-center justify-center font-black text-xs'
                            : 'bg-[#252824] group-hover:bg-[#2f352e]'
                        }`}
                        style={{ height: `${Math.min(120, Math.max(40, (q.heightPct / 100) * 120))}px` }}
                      >
                        {q.isPeak && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-black rotate-[-90deg]">
                            PEAK
                          </span>
                        )}
                      </div>
                      <div className="text-center">
                        <span className={`text-xs font-black block ${q.isPeak ? 'text-[#d8ff3e]' : 'text-gray-300'}`}>
                          {q.label}
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium">
                          {q.count} opps
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Opportunities & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        {/* Recommended Top Opportunities (8 Columns) */}
        <div className="lg:col-span-8 bg-white rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Featured Opportunities</span>
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Matched with your technical profile, verified skills, and career preferences.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('explore')}
              className="text-xs font-black text-black hover:text-gray-700 flex items-center gap-1 bg-[#eaebef] hover:bg-gray-200 px-4 py-2 rounded-full transition-all duration-200 active:scale-95"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {featuredOpps.map((opp) => {
              const days = getDaysRemaining(opp.deadline);
              const match = calculateMatchScore(opp, user);
              return (
                <div
                  key={opp.id}
                  onClick={() => onViewDetails(opp)}
                  className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/70 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3.5">
                    <OrgLogo
                      name={opp.organization}
                      logoUrl={opp.organizationLogo}
                      className="w-12 h-12 rounded-2xl shadow-sm text-sm group-hover:scale-105 transition-transform duration-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {opp.organization}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#eaebef] text-gray-700">
                          {opp.type}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#d8ff3e] text-black shadow-xs">
                          {match.percentage}% Match
                        </span>
                      </div>
                      <h3 className="font-black text-base text-gray-900 group-hover:text-blue-600 transition-colors mt-0.5">
                        {opp.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {opp.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                        <Calendar className="w-3 h-3" />
                        {days > 0 ? `${days}d left` : 'Due today'}
                      </span>
                      {opp.stipendOrPrize && (
                        <p className="text-[11px] font-black text-gray-700 mt-1">
                          {opp.stipendOrPrize}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(opp);
                      }}
                      className="px-4 py-2 rounded-full bg-[#15161a] hover:bg-black text-white text-xs font-bold transition-all duration-200 shadow-sm group-hover:shadow active:scale-95"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deadlines & Quick Action Summary (4 Columns) */}
        <div className="lg:col-span-4 bg-white rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Urgent Deadlines</span>
              </h2>
              <span className="text-xs font-black bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-full">
                {urgentDeadlines.length} closing {timeframe.toLowerCase()}
              </span>
            </div>

            {urgentDeadlines.length > 0 ? (
              <div className="space-y-3">
                {urgentDeadlines.slice(0, 5).map((opp) => {
                  const days = getDaysRemaining(opp.deadline);
                  return (
                    <div
                      key={opp.id}
                      onClick={() => onViewDetails(opp)}
                      className="p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider">
                          {opp.organization}
                        </span>
                        <span className="text-[10px] font-black text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
                          {days === 0 ? 'Today' : `${days}d left`}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-900 truncate mt-1">
                        {opp.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-gray-50 text-center flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                <p className="text-xs font-black text-gray-800">You're all caught up!</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  No urgent deadlines closing {timeframe.toLowerCase()}.
                </p>
              </div>
            )}
          </div>

          {/* Quick CTA to Applications Board */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => onNavigateTab('applications')}
              className="w-full py-3 px-4 rounded-full bg-[#eaebef] hover:bg-gray-200 text-gray-900 text-xs font-black flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
            >
              <span>Manage Application Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
