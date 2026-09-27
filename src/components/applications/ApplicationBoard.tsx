import React, { useState } from 'react';
import type { Application, ApplicationStatus, Opportunity } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { OrgLogo } from '../ui/OrgLogo';
import { DeadlineBadge } from '../opportunities/DeadlineBadge';
import { MatchBadge } from '../opportunities/MatchBadge';
import { calculateMatchScore } from '../../utils/matchingEngine';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { applicationService } from '../../firebase/services';
import {
  Sparkles,
  Clock,
  Star,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Trash2,
  FileEdit,
  Check,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import confetti from 'canvas-confetti';

interface ApplicationBoardProps {
  applications: Application[];
  opportunities: Opportunity[];
  onStatusChange: (opportunityId: string, newStatus: ApplicationStatus, notes?: string) => void;
  onRemoveApplication: (opportunityId: string) => void;
  onViewDetails: (opportunity: Opportunity) => void;
}

const COLUMNS: { id: ApplicationStatus; label: string; subtitle: string; icon: any; color: string }[] = [
  { id: 'Interested', label: 'Interested', subtitle: 'Exploring & Preparing', icon: Sparkles, color: 'sky' },
  { id: 'Applied', label: 'Applied', subtitle: 'Submissions In Review', icon: Clock, color: 'indigo' },
  { id: 'Shortlisted', label: 'Shortlisted', subtitle: 'Interviews & Next Steps', icon: Star, color: 'amber' },
  { id: 'Completed', label: 'Completed', subtitle: 'Offers & Milestones', icon: CheckCircle2, color: 'emerald' },
];

export const ApplicationBoard: React.FC<ApplicationBoardProps> = ({
  applications,
  opportunities,
  onStatusChange,
  onRemoveApplication,
  onViewDetails,
}) => {
  const { user } = useAuth();
  const { success, info } = useToast();
  const [activeMobileColumn, setActiveMobileColumn] = useState<ApplicationStatus>('Applied');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  // Map opportunityId to opportunity object
  const oppMap = new Map<string, Opportunity>();
  opportunities.forEach(o => oppMap.set(o.id, o));

  const moveStatus = async (
    opportunityId: string,
    currentStatus: ApplicationStatus,
    direction: 'next' | 'prev'
  ) => {
    if (!user) return;
    const statusOrder: ApplicationStatus[] = ['Interested', 'Applied', 'Shortlisted', 'Completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex >= 0 && targetIndex < statusOrder.length) {
      const nextStatus = statusOrder[targetIndex];
      try {
        await applicationService.setStatus(user.id, opportunityId, nextStatus);
        onStatusChange(opportunityId, nextStatus);

        if (nextStatus === 'Applied') {
          success('Application Recorded! 🚀', 'Your submission is now tracked in review.');
        } else if (nextStatus === 'Shortlisted') {
          success('Shortlisted! 🌟', 'Congratulations on moving forward to the interview phase!');
          confetti({ particleCount: 50, spread: 60, colors: ['#f59e0b', '#0071e3', '#10b981'] });
        } else if (nextStatus === 'Completed') {
          success('Milestone Completed! 🏆', 'Great job finishing this career milestone.');
          confetti({ particleCount: 60, spread: 70, colors: ['#10b981', '#388bfd', '#ffffff'] });
        } else {
          info('Status Updated', `Moved to ${nextStatus}`);
        }
      } catch {
        info('Notice', 'Status updated in tracker');
        onStatusChange(opportunityId, nextStatus);
      }
    }
  };

  const handleSaveNote = async (opportunityId: string, currentStatus: ApplicationStatus) => {
    if (!user) return;
    try {
      await applicationService.setStatus(user.id, opportunityId, currentStatus, noteText);
      onStatusChange(opportunityId, currentStatus, noteText);
      success('Note Saved', 'Your personal application note was updated.');
      setEditingNoteId(null);
    } catch {
      onStatusChange(opportunityId, currentStatus, noteText);
      setEditingNoteId(null);
    }
  };

  const handleRemove = async (opportunityId: string) => {
    if (!user) return;
    try {
      await applicationService.deleteApplication(user.id, opportunityId);
      onRemoveApplication(opportunityId);
      info('Application removed', 'Removed from your application tracker.');
    } catch {
      onRemoveApplication(opportunityId);
    }
  };

  const renderColumnContent = (colId: ApplicationStatus) => {
    const colApps = applications.filter(a => a.status === colId);

    if (colApps.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-black/10 dark:border-white/10 text-center my-2">
          <p className="text-xs text-neutral-400">No opportunities in {colId}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3.5">
        {colApps.map(app => {
          const opp = oppMap.get(app.opportunityId);
          if (!opp) return null;
          const match = calculateMatchScore(opp, user);

          const canMovePrev = colId !== 'Interested';
          const canMoveNext = colId !== 'Completed';
          const isEditingNote = editingNoteId === app.id;

          return (
            <GlassCard
              key={app.id}
              hoverEffect
              className="p-4 rounded-2xl border border-black/5 dark:border-white/10 bg-white/75 dark:bg-[#151824]/80 group shadow-sm transition-all text-left"
              onClick={() => onViewDetails(opp)}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <OrgLogo
                    name={opp.organization}
                    logoUrl={opp.organizationLogo}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 truncate block">
                      {opp.organization}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-accent transition-colors">
                      {opp.title}
                    </h4>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemove(opp.id);
                  }}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                  title="Remove from tracker"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Deadlines & Match */}
              <div className="flex items-center justify-between gap-1.5 mb-2.5">
                <DeadlineBadge deadline={opp.deadline} />
                <MatchBadge match={match} />
              </div>

              {/* Humanized Student Note Section */}
              <div
                onClick={e => e.stopPropagation()}
                className="mb-2.5 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5"
              >
                {isEditingNote ? (
                  <div className="space-y-1.5">
                    <textarea
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                      placeholder="e.g. Spoke to recruiter; interview on Thursday..."
                      className="w-full p-1.5 text-xs bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none resize-none"
                      rows={2}
                      autoFocus
                    />
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="text-[10px] text-neutral-400 px-2 py-0.5 rounded hover:text-neutral-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNote(opp.id, colId)}
                        className="text-[10px] font-semibold bg-accent text-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm"
                      >
                        <Check className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setEditingNoteId(app.id);
                      setNoteText(app.notes || '');
                    }}
                    className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    <span className="truncate italic">
                      {app.notes || '📝 Click to add personal student note...'}
                    </span>
                    <FileEdit className="w-3 h-3 shrink-0 ml-1 opacity-60" />
                  </div>
                )}
              </div>

              {/* Stage Progression Buttons */}
              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-1">
                <div>
                  {canMovePrev && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        moveStatus(opp.id, colId, 'prev');
                      }}
                      className="px-2 py-1 rounded-lg text-[11px] font-medium text-neutral-500 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-0.5"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      <span>Back</span>
                    </button>
                  )}
                </div>

                <div>
                  {canMoveNext && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        moveStatus(opp.id, colId, 'next');
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-accent/10 text-accent hover:bg-accent hover:text-white flex items-center gap-0.5 transition-colors"
                    >
                      <span>Advance</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Mobile Column Tabs */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {COLUMNS.map(col => {
          const count = applications.filter(a => a.status === col.id).length;
          const isActive = activeMobileColumn === col.id;
          return (
            <button
              key={col.id}
              onClick={() => setActiveMobileColumn(col.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border',
                isActive
                  ? 'bg-accent text-white border-accent shadow-glow'
                  : 'bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 border-transparent'
              )}
            >
              <span>{col.label}</span>
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px]',
                  isActive ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile Single Column View */}
      <div className="md:hidden">
        {renderColumnContent(activeMobileColumn)}
      </div>

      {/* Desktop 4-Column Kanban View */}
      <div className="hidden md:grid grid-cols-4 gap-4 items-start">
        {COLUMNS.map(col => {
          const colApps = applications.filter(a => a.status === col.id);
          const Icon = col.icon;
          return (
            <div
              key={col.id}
              className="p-3.5 rounded-3xl glass-surface border border-black/5 dark:border-white/5 min-h-[500px] flex flex-col"
            >
              {/* Column Header */}
              <div className="pb-3 mb-3 border-b border-black/5 dark:border-white/5 px-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      {col.label}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-neutral-400">
                    {colApps.length}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 mt-1 pl-8">
                  {col.subtitle}
                </p>
              </div>

              {/* Cards in Column */}
              <div className="flex-1">
                {renderColumnContent(col.id)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
