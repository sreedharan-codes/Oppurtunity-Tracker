import React from 'react';
import { Opportunity } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { OrgLogo } from '../ui/OrgLogo';
import { MatchBadge } from '../opportunities/MatchBadge';
import { calculateMatchScore } from '../../utils/matchingEngine';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ArrowRight } from 'lucide-react';

interface RecommendedListProps {
  opportunities: Opportunity[];
  onViewDetails: (opportunity: Opportunity) => void;
  onExploreMore: () => void;
}

export const RecommendedList: React.FC<RecommendedListProps> = ({
  opportunities,
  onViewDetails,
  onExploreMore,
}) => {
  const { user } = useAuth();

  // Score only published opportunities and sort by highest match percentage
  const scored = [...opportunities]
    .filter(o => (o.status ? o.status === 'published' : true))
    .map(opp => ({
      opp,
      match: calculateMatchScore(opp, user),
    }))
    .sort((a, b) => b.match.percentage - a.match.percentage)
    .slice(0, 4);

  return (
    <GlassCard className="p-6 rounded-3xl border border-black/5 dark:border-white/10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Recommended For You
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Matched with your {user?.skills.slice(0, 2).join(' & ') || 'profile'} skills
            </p>
          </div>
        </div>

        <button
          onClick={onExploreMore}
          className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
        >
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {scored.map(({ opp, match }) => (
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
                  {opp.organization} · {opp.type}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                  {opp.title}
                </h4>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <MatchBadge match={match} />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
