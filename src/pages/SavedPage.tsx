import React, { useState, useMemo } from 'react';
import type { Opportunity, Bookmark, ApplicationStatus, OpportunityType } from '../types';
import { OpportunityGrid } from '../components/opportunities/OpportunityGrid';
import { EmptyState } from '../components/ui/EmptyState';
import { GlassButton } from '../components/ui/GlassButton';
import { Bookmark as BookmarkIcon, Compass, Search, Calendar, Award } from 'lucide-react';
import { getDaysRemaining } from '../utils/dateUtils';
import { calculateMatchScore } from '../utils/matchingEngine';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

interface SavedPageProps {
  opportunities: Opportunity[];
  bookmarks: Bookmark[];
  applicationStatusMap: Map<string, ApplicationStatus>;
  onToggleBookmark: (opportunityId: string) => void;
  onViewDetails: (opportunity: Opportunity) => void;
  onExplore: () => void;
}

const CATEGORIES: ('All' | OpportunityType)[] = [
  'All',
  'Internship',
  'Hackathon',
  'Workshop',
  'Certification',
  'Competition',
];

export const SavedPage: React.FC<SavedPageProps> = ({
  opportunities,
  bookmarks,
  applicationStatusMap,
  onToggleBookmark,
  onViewDetails,
  onExplore,
}) => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | OpportunityType>('All');

  const bookmarkedSet = useMemo(() => new Set(bookmarks.map(b => b.opportunityId)), [bookmarks]);
  const allSaved = useMemo(() => opportunities.filter(opp => bookmarkedSet.has(opp.id)), [opportunities, bookmarkedSet]);

  const filteredOpportunities = useMemo(() => {
    return allSaved.filter(opp => {
      if (selectedType !== 'All' && opp.type !== selectedType) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchTitle = opp.title.toLowerCase().includes(q);
        const matchOrg = opp.organization.toLowerCase().includes(q);
        const matchSkill = opp.skills.some(s => s.toLowerCase().includes(q));
        if (!matchTitle && !matchOrg && !matchSkill) return false;
      }
      return true;
    });
  }, [allSaved, search, selectedType]);

  // Quick stats
  const closingSoonCount = useMemo(() => {
    return allSaved.filter(o => {
      const days = getDaysRemaining(o.deadline);
      return days >= 0 && days <= 7;
    }).length;
  }, [allSaved]);

  const highMatchCount = useMemo(() => {
    return allSaved.filter(o => calculateMatchScore(o, user).percentage >= 85).length;
  }, [allSaved, user]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-sans">
              Saved Opportunities
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
              {allSaved.length} Bookmarked
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Keep track of programs you want to research, prepare for, and apply to.
          </p>
        </div>

        <GlassButton
          variant="secondary"
          size="sm"
          onClick={onExplore}
          icon={<Compass className="w-4 h-4" />}
        >
          Explore More
        </GlassButton>
      </div>

      {allSaved.length === 0 ? (
        <EmptyState
          icon={<BookmarkIcon className="w-8 h-8 text-accent" />}
          title="No saved opportunities yet."
          description="Click the bookmark icon on any opportunity card in Explore or the Dashboard to save it for quick review."
          actionLabel="Discover Opportunities"
          onAction={onExplore}
        />
      ) : (
        <div className="space-y-5">
          {/* Quick Metrics & Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            {/* Quick Stat Highlights */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-xl bg-accent/10 text-accent font-semibold">
                <BookmarkIcon className="w-3.5 h-3.5" />
                {allSaved.length} Saved
              </span>
              {closingSoonCount > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold border border-rose-500/20">
                  <Calendar className="w-3.5 h-3.5" />
                  {closingSoonCount} Closing Soon
                </span>
              )}
              {highMatchCount > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                  <Award className="w-3.5 h-3.5" />
                  {highMatchCount} Top Matches (≥85%)
                </span>
              )}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search saved..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white/70 dark:bg-white/10 border border-black/5 dark:border-white/10 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedType(cat)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap',
                  selectedType === cat
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-black/10 dark:hover:bg-white/10'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredOpportunities.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-black/10 dark:border-white/10">
              <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                No saved opportunities match your filter
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Try clearing your search or switching categories.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedType('All');
                }}
                className="text-xs font-semibold text-accent mt-3 hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <OpportunityGrid
              opportunities={filteredOpportunities}
              loading={false}
              bookmarkedIds={bookmarkedSet}
              applicationStatusMap={applicationStatusMap}
              onToggleBookmark={onToggleBookmark}
              onViewDetails={onViewDetails}
            />
          )}
        </div>
      )}
    </div>
  );
};
