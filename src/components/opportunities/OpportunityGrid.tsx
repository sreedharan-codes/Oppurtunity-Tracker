import React from 'react';
import { Opportunity, ApplicationStatus } from '../../types';
import { OpportunityCard } from './OpportunityCard';
import { OpportunityCardSkeleton } from '../ui/LoadingSkeleton';
import { EmptyState } from '../ui/EmptyState';
import { SearchX } from 'lucide-react';

interface OpportunityGridProps {
  opportunities: Opportunity[];
  loading: boolean;
  bookmarkedIds: Set<string>;
  applicationStatusMap: Map<string, ApplicationStatus>;
  onToggleBookmark: (opportunityId: string) => void;
  onViewDetails: (opportunity: Opportunity) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  onResetFilters?: () => void;
}

export const OpportunityGrid: React.FC<OpportunityGridProps> = ({
  opportunities,
  loading,
  bookmarkedIds,
  applicationStatusMap,
  onToggleBookmark,
  onViewDetails,
  emptyTitle = 'No opportunities found',
  emptyDescription = 'Try adjusting your search criteria or clearing active filters to discover more matching programs.',
  onResetFilters,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <OpportunityCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="w-8 h-8 text-neutral-400" />}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={onResetFilters ? 'Clear Filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {opportunities.map(opp => (
        <OpportunityCard
          key={opp.id}
          opportunity={opp}
          isBookmarked={bookmarkedIds.has(opp.id)}
          applicationStatus={applicationStatusMap.get(opp.id)}
          onToggleBookmark={onToggleBookmark}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
