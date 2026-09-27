import React, { useState } from 'react';
import { Opportunity, ApplicationStatus } from '../../types';
import { GlassModal } from '../ui/GlassModal';
import { GlassButton } from '../ui/GlassButton';
import { GlassBadge } from '../ui/GlassBadge';
import { GlassDropdown, DropdownOption } from '../ui/GlassDropdown';
import { OrgLogo } from '../ui/OrgLogo';
import { DeadlineBadge } from './DeadlineBadge';
import { MatchBadge } from './MatchBadge';
import { StatusBadge } from './StatusBadge';
import {
  Bookmark,
  ExternalLink,
  MapPin,
  Award,
  GraduationCap,
  DollarSign,
  Briefcase,
  Share2,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';
import { calculateMatchScore } from '../../utils/matchingEngine';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { applicationService } from '../../firebase/services';
import confetti from 'canvas-confetti';

interface OpportunityDetailsModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  applicationStatus?: ApplicationStatus;
  onStatusChange: (opportunityId: string, newStatus: ApplicationStatus) => void;
  onToggleBookmark: (opportunityId: string) => void;
}

const STATUS_OPTIONS: DropdownOption<ApplicationStatus>[] = [
  { value: 'Interested', label: 'Interested' },
  { value: 'Applied', label: 'Applied' },
  { value: 'Shortlisted', label: 'Shortlisted' },
  { value: 'Completed', label: 'Completed' },
];

const DEFAULT_CHECKLIST = [
  'Verify eligibility & graduation year requirements',
  'Tailor resume highlighting target skills',
  'Prepare project demo links / portfolio',
  'Submit application before deadline',
];

export const OpportunityDetailsModal: React.FC<OpportunityDetailsModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  isBookmarked,
  applicationStatus,
  onStatusChange,
  onToggleBookmark,
}) => {
  const { user } = useAuth();
  const { success, info } = useToast();
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  if (!opportunity) return null;

  const match = calculateMatchScore(opportunity, user);

  // Compute growth skills (skills required that are not yet matched)
  const matchedSet = new Set(match.matchedSkills.map(s => s.toLowerCase()));
  const growthSkills = opportunity.skills.filter(s => !matchedSet.has(s.toLowerCase()));

  const handleStatusSelect = async (newStatus: ApplicationStatus) => {
    if (!user) {
      info('Please sign in', 'Sign in to track applications on your dashboard.');
      return;
    }
    try {
      await applicationService.setStatus(user.id, opportunity.id, newStatus);
      onStatusChange(opportunity.id, newStatus);
      success('Application status updated', `Marked as "${newStatus}" in your tracker.`);

      if (newStatus === 'Applied' || newStatus === 'Shortlisted') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#0071e3', '#6366f1', '#10b981'],
        });
      }
    } catch {
      info('Notice', 'Status updated in session.');
      onStatusChange(opportunity.id, newStatus);
    }
  };

  const handleBookmark = () => {
    if (!user) {
      info('Please sign in', 'Sign in to bookmark opportunities to your account.');
      return;
    }
    onToggleBookmark(opportunity.id);
  };

  const handleShare = async () => {
    const text = `${opportunity.title} at ${opportunity.organization} — ${opportunity.applicationUrl || window.location.href}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        success('Copied to Clipboard! 📋', 'Opportunity details copied for easy sharing.');
      } else {
        info('Opportunity Info', text);
      }
    } catch {
      info('Opportunity Info', text);
    }
  };

  const toggleChecklistStep = (step: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [step]: !prev[step],
    }));
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-start gap-4">
          <OrgLogo
            name={opportunity.organization}
            logoUrl={opportunity.organizationLogo}
            size="xl"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-accent tracking-wider uppercase">
                {opportunity.organization}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <GlassBadge variant="default" size="sm">
                {opportunity.type}
              </GlassBadge>
              {applicationStatus && (
                <StatusBadge status={applicationStatus} size="sm" />
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight mt-1 leading-tight">
              {opportunity.title}
            </h2>
          </div>
        </div>

        {/* Highlights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
            <div className="truncate">
              <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Location</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate block">
                {opportunity.location || opportunity.mode}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Briefcase className="w-4 h-4 text-neutral-400 shrink-0" />
            <div className="truncate">
              <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Format</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                {opportunity.mode}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="truncate">
              <span className="text-neutral-400 block text-[10px] uppercase font-semibold mb-0.5">Deadline</span>
              <DeadlineBadge deadline={opportunity.deadline} />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <DollarSign className="w-4 h-4 text-neutral-400 shrink-0" />
            <div className="truncate">
              <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Reward/Stipend</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 block truncate">
                {opportunity.stipendOrPrize || 'Competitive'}
              </span>
            </div>
          </div>
        </div>

        {/* Recommendation Engine Match Breakdown */}
        <div className="p-4 rounded-2xl bg-accent/5 dark:bg-accent/10 border border-accent/20">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold text-accent tracking-wide uppercase">
                Student Compatibility Analysis
              </span>
            </div>
            <MatchBadge match={match} />
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {match.reason}
          </p>
          {match.matchedSkills.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
              <span className="text-[11px] font-semibold text-neutral-400">Matched Skills:</span>
              {match.matchedSkills.map(s => (
                <span
                  key={s}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-accent/20 text-accent font-medium"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          )}

          {growthSkills.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-[11px] font-semibold text-neutral-400">Skills You Can Develop:</span>
              {growthSkills.slice(0, 4).map(s => (
                <span
                  key={s}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 font-medium"
                >
                  + {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
            About the Opportunity
          </h4>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
            {opportunity.description}
          </p>
        </div>

        {/* Eligibility & Skills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-accent" />
              Eligibility
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">
              {opportunity.eligibility}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-accent" />
              Required & Relevant Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {opportunity.skills.map(skill => (
                <span
                  key={skill}
                  className="text-xs px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 font-medium border border-black/5 dark:border-white/5"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Application Readiness Checklist */}
        <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-accent" />
              Application Readiness Checklist
            </h4>
            <span className="text-[10px] text-neutral-400">
              {Object.values(completedSteps).filter(Boolean).length} / {DEFAULT_CHECKLIST.length} completed
            </span>
          </div>
          <div className="space-y-1.5">
            {DEFAULT_CHECKLIST.map(item => {
              const isChecked = !!completedSteps[item];
              return (
                <div
                  key={item}
                  onClick={() => toggleChecklistStep(item)}
                  className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer select-none hover:text-accent dark:hover:text-accent transition-colors"
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                  <span className={isChecked ? 'line-through opacity-60' : ''}>
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="pt-6 border-t border-black/5 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          {/* Status Tracker */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-neutral-500">Track Status:</span>
            <GlassDropdown
              options={STATUS_OPTIONS}
              value={applicationStatus || 'Interested'}
              onChange={handleStatusSelect}
              placeholder="Set Status"
            />
          </div>

          {/* Buttons: Share + Bookmark + Apply Now */}
          <div className="flex items-center gap-2 flex-wrap">
            <GlassButton
              variant="secondary"
              onClick={handleShare}
              title="Share or copy details"
              icon={<Share2 className="w-4 h-4" />}
            >
              Share
            </GlassButton>

            <GlassButton
              variant={isBookmarked ? 'primary' : 'secondary'}
              onClick={handleBookmark}
              icon={
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`}
                />
              }
            >
              {isBookmarked ? 'Saved' : 'Save'}
            </GlassButton>

            <a
              href={opportunity.applicationUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (applicationStatus !== 'Applied') {
                  handleStatusSelect('Applied');
                }
              }}
            >
              <GlassButton
                variant="primary"
                icon={<ExternalLink className="w-4 h-4" />}
              >
                Apply Now
              </GlassButton>
            </a>
          </div>
        </div>
      </div>
    </GlassModal>
  );
};
