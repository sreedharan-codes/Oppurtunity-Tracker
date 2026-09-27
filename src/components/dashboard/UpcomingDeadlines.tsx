import React from 'react';
import { Opportunity } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { OrgLogo } from '../ui/OrgLogo';
import { DeadlineBadge } from '../opportunities/DeadlineBadge';
import { MatchBadge } from '../opportunities/MatchBadge';
import { calculateMatchScore } from '../../utils/matchingEngine';
import { useAuth } from '../../context/AuthContext';
import { getDaysRemaining } from '../../utils/dateUtils';
import { Clock, ArrowRight } from 'lucide-react';

interface UpcomingDeadlinesProps {
  opportunities: Opportunity[];
  onViewDetails: (opportunity: Opportunity) => void;
  onExploreMore: () => void;
}

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({
  opportunities,
  onViewDetails,
  onExploreMore,
}) => {
  const { user } = useAuth();

  // Filter only active published deadlines, sorted chronologically ascending
  const upcoming = [...opportunities]
    .filter(o => (o.status ? o.status === 'published' : true) && getDaysRemaining(o.deadline) >= 0)
    .sort((a, b) => getDaysRemaining(a.deadline) - getDaysRemaining(b.deadline))
    .slice(0, 4);

  return (
    <GlassCard className="p-6 rounded-3xl border border-black/5 dark:border-white/10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Upcoming Deadlines
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Chronologically prioritized applications
            </p>
          </div>
        </div>

        <button
          onClick={onExploreMore}
          className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {upcoming.length === 0 ? (
          <p className="text-xs text-neutral-400 py-4 text-center">
            No upcoming deadlines recorded.
          </p>
        ) : (
          upcoming.map(opp => {
            const match = calculateMatchScore(opp, user);
            return (
              <div
                key={opp.id}
                onClick={() => onViewDetails(opp)}
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-black/5 dark:hover:border-white/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <OrgLogo
                    name={opp.organization}
                    logoUrl={opp.organizationLogo}
                    size="md"
                  />
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 block truncate">
                      {opp.organization}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                      {opp.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <DeadlineBadge deadline={opp.deadline} />
                  <div className="hidden sm:block">
                    <MatchBadge match={match} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </GlassCard>
  );
};
