import React, { useState, useMemo } from 'react';
import type { Opportunity, FilterState, ApplicationStatus } from '../types';
import { SearchBar } from '../components/opportunities/SearchBar';
import { FilterPanel } from '../components/opportunities/FilterPanel';
import { OpportunityGrid } from '../components/opportunities/OpportunityGrid';
import { GlassButton } from '../components/ui/GlassButton';
import { GlassModal } from '../components/ui/GlassModal';
import { SlidersHorizontal } from 'lucide-react';
import { getDaysRemaining } from '../utils/dateUtils';
import { calculateMatchScore } from '../utils/matchingEngine';
import { useAuth } from '../context/AuthContext';

interface ExplorePageProps {
  opportunities: Opportunity[];
  loading: boolean;
  bookmarkedIds: Set<string>;
  applicationStatusMap: Map<string, ApplicationStatus>;
  onToggleBookmark: (opportunityId: string) => void;
  onViewDetails: (opportunity: Opportunity) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  opportunities,
  loading,
  bookmarkedIds,
  applicationStatusMap,
  onToggleBookmark,
  onViewDetails,
}) => {
  const { user } = useAuth();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    types: [],
    skills: [],
    deadlineRange: 'all',
    mode: 'all',
    difficulty: 'all',
    sortBy: 'recommended',
  });

  // Collect all unique skills across opportunities
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach(o => o.skills.forEach((s: string) => set.add(s)));
    return Array.from(set).slice(0, 15);
  }, [opportunities]);

  // Filter & Sort opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter(opp => {
        // Only show published in explore
        if (opp.status && opp.status !== 'published') return false;

        // 1. Search Query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          const matchTitle = opp.title.toLowerCase().includes(q);
          const matchOrg = opp.organization.toLowerCase().includes(q);
          const matchDesc = opp.description.toLowerCase().includes(q);
          const matchSkill = opp.skills.some((s: string) => s.toLowerCase().includes(q));
          const matchType = opp.type.toLowerCase().includes(q);
          if (!matchTitle && !matchOrg && !matchDesc && !matchSkill && !matchType) {
            return false;
          }
        }

        // 2. Type Filter
        if (filters.types.length > 0 && !filters.types.includes(opp.type)) {
          return false;
        }

        // 3. Skills Filter
        if (filters.skills.length > 0) {
          const hasMatchingSkill = filters.skills.some((skill: string) =>
            opp.skills.some((s: string) => s.toLowerCase() === skill.toLowerCase())
          );
          if (!hasMatchingSkill) return false;
        }

        // 4. Mode
        if (filters.mode !== 'all' && opp.mode !== filters.mode) {
          return false;
        }

        // 5. Difficulty
        if (filters.difficulty !== 'all' && opp.difficulty !== filters.difficulty) {
          return false;
        }

        // 6. Deadline Range
        if (filters.deadlineRange !== 'all') {
          const days = getDaysRemaining(opp.deadline);
          if (filters.deadlineRange === 'today' && days !== 0) return false;
          if (filters.deadlineRange === 'this_week' && (days < 0 || days > 7)) return false;
          if (filters.deadlineRange === 'this_month' && (days < 0 || days > 30)) return false;
          if (filters.deadlineRange === 'later' && days <= 30) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'deadline') {
          return getDaysRemaining(a.deadline) - getDaysRemaining(b.deadline);
        }
        if (filters.sortBy === 'newest') {
          return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
        }
        if (filters.sortBy === 'bookmarked') {
          return (b.bookmarkCount || 0) - (a.bookmarkCount || 0);
        }
        // Recommended by default
        const matchA = calculateMatchScore(a, user).percentage;
        const matchB = calculateMatchScore(b, user).percentage;
        return matchB - matchA;
      });
  }, [opportunities, filters, user]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-sans">
            Explore Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Search and filter internships, hackathons, certifications, and workshops.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
            {filteredOpportunities.length} Available
          </span>

          {/* Mobile Filter Button */}
          <div className="md:hidden">
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={() => setIsMobileFilterOpen(true)}
              icon={<SlidersHorizontal className="w-4 h-4" />}
            >
              Filters
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        value={filters.searchQuery}
        onChange={val => setFilters({ ...filters, searchQuery: val })}
        placeholder="Search internships, hackathons, certifications, or skills (e.g. AI, Python, React)..."
      />

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Desktop Sticky Filters Sidebar */}
        <aside className="hidden md:block md:col-span-4 lg:col-span-3">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            availableSkills={allSkills}
          />
        </aside>

        {/* Opportunities Results Grid */}
        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          {/* Active Filter Chips Bar */}
          {(filters.types.length > 0 || filters.skills.length > 0 || filters.deadlineRange !== 'all' || filters.mode !== 'all' || filters.difficulty !== 'all' || filters.searchQuery) && (
            <div className="flex items-center gap-1.5 flex-wrap p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs">
              <span className="text-neutral-400 font-medium mr-1">Active:</span>
              {filters.searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent/15 text-accent font-medium">
                  "{filters.searchQuery}"
                  <button onClick={() => setFilters({ ...filters, searchQuery: '' })} className="hover:opacity-75 text-[10px]">✕</button>
                </span>
              )}
              {filters.types.map(t => (
                <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent/15 text-accent font-medium">
                  {t}
                  <button onClick={() => setFilters({ ...filters, types: filters.types.filter(item => item !== t) })} className="hover:opacity-75 text-[10px]">✕</button>
                </span>
              ))}
              {filters.skills.map(s => (
                <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 font-medium">
                  {s}
                  <button onClick={() => setFilters({ ...filters, skills: filters.skills.filter(item => item !== s) })} className="hover:opacity-75 text-[10px]">✕</button>
                </span>
              ))}
              {filters.deadlineRange !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-medium capitalize">
                  {filters.deadlineRange.replace('_', ' ')}
                  <button onClick={() => setFilters({ ...filters, deadlineRange: 'all' })} className="hover:opacity-75 text-[10px]">✕</button>
                </span>
              )}
              {filters.mode !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-medium">
                  {filters.mode}
                  <button onClick={() => setFilters({ ...filters, mode: 'all' })} className="hover:opacity-75 text-[10px]">✕</button>
                </span>
              )}
              <button
                onClick={() =>
                  setFilters({
                    searchQuery: '',
                    types: [],
                    skills: [],
                    deadlineRange: 'all',
                    mode: 'all',
                    difficulty: 'all',
                    sortBy: 'recommended',
                  })
                }
                className="text-[11px] text-neutral-400 hover:text-rose-500 underline ml-auto cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
          <OpportunityGrid
            opportunities={filteredOpportunities}
            loading={loading}
            bookmarkedIds={bookmarkedIds}
            applicationStatusMap={applicationStatusMap}
            onToggleBookmark={onToggleBookmark}
            onViewDetails={onViewDetails}
            onResetFilters={() =>
              setFilters({
                searchQuery: '',
                types: [],
                skills: [],
                deadlineRange: 'all',
                mode: 'all',
                difficulty: 'all',
                sortBy: 'recommended',
              })
            }
          />
        </div>
      </div>

      {/* Mobile Filter Bottom-Sheet Modal */}
      <GlassModal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="Filter Opportunities"
      >
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          availableSkills={allSkills}
          isMobileModal
          onCloseMobileModal={() => setIsMobileFilterOpen(false)}
        />
      </GlassModal>
    </div>
  );
};
