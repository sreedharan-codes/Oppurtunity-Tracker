import React from 'react';
import type { Opportunity, ApplicationStatus } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { GlassBadge } from '../ui/GlassBadge';
import { GlassButton } from '../ui/GlassButton';
import { OrgLogo } from '../ui/OrgLogo';
import { DeadlineBadge } from './DeadlineBadge';
import { MatchBadge } from './MatchBadge';
import { StatusBadge } from './StatusBadge';
import { Bookmark, MapPin, ArrowUpRight, DollarSign } from 'lucide-react';
import { calculateMatchScore } from '../../utils/matchingEngine';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import confetti from 'canvas-confetti';

interface OpportunityCardProps {
  opportunity: Opportunity;
  isBookmarked: boolean;
  applicationStatus?: ApplicationStatus;
  onToggleBookmark: (opportunityId: string) => void;
  onViewDetails: (opportunity: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  isBookmarked,
  applicationStatus,
  onToggleBookmark,
  onViewDetails,
}) => {
  const { user } = useAuth();
  const match = calculateMatchScore(opportunity, user);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark(opportunity.id);
    if (!isBookmarked) {
      // Trigger subtle mini confetti burst on bookmarking
      confetti({
        particleCount: 28,
        spread: 45,
        origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
        colors: ['#0071e3', '#388bfd', '#ffffff'],
        ticks: 80,
      });
    }
  };

  return (
    <GlassCard
      hoverEffect
      onClick={() => onViewDetails(opportunity)}
      className="flex flex-col justify-between p-5 sm:p-6 rounded-card border border-black/5 dark:border-white/10 group cursor-pointer text-left"
    >
      <div>
        {/* Top bar: Organization + Logo + Bookmark button */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <OrgLogo
              name={opportunity.organization}
              logoUrl={opportunity.organizationLogo}
              size="lg"
            />

            <div className="min-w-0">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 tracking-wide uppercase truncate block">
                {opportunity.organization}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-snug line-clamp-1 group-hover:text-accent transition-colors">
                {opportunity.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBookmarkClick}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark opportunity'}
            className={cn(
              'p-2.5 rounded-full transition-all duration-200 select-none shrink-0',
              isBookmarked
                ? 'bg-accent/15 text-accent border border-accent/30 shadow-glow'
                : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
            )}
          >
            <Bookmark
              className={cn(
                'w-4 h-4 transition-transform active:scale-125',
                isBookmarked && 'fill-accent text-accent'
              )}
            />
          </button>
        </div>

        {/* Badges: Type & Location + Stipend */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <GlassBadge variant="default" size="sm">
            {opportunity.type}
          </GlassBadge>
          <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span>{opportunity.location || opportunity.mode}</span>
            <span className="text-neutral-300 dark:text-neutral-600">·</span>
            <span className="text-[11px] font-semibold">{opportunity.mode}</span>
          </div>

          {opportunity.stipendOrPrize && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/20">
              <DollarSign className="w-3 h-3" />
              <span>{opportunity.stipendOrPrize}</span>
            </span>
          )}

          {applicationStatus && (
            <StatusBadge status={applicationStatus} size="sm" className="ml-auto" />
          )}
        </div>

        {/* Skills Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {opportunity.skills.slice(0, 3).map(skill => (
            <span
              key={skill}
              className="text-[11px] px-2.5 py-0.5 rounded-lg bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 font-medium border border-black/5 dark:border-white/5"
            >
              {skill}
            </span>
          ))}
          {opportunity.skills.length > 3 && (
            <span className="text-[11px] px-2 py-0.5 rounded-lg text-neutral-400 font-medium">
              +{opportunity.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Bar: Deadline + Match Score + Action */}
      <div className="pt-3.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <DeadlineBadge deadline={opportunity.deadline} />
        </div>

        <div className="flex items-center gap-2">
          <MatchBadge match={match} />
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(opportunity);
            }}
            className="group-hover:bg-accent group-hover:text-white transition-colors"
          >
            <span>View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </GlassButton>
        </div>
      </div>
    </GlassCard>
  );
};
