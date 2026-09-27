import React from 'react';
import {
  FilterState,
  OpportunityType,
  OpportunityMode,
  OpportunityDifficulty,
} from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { GlassBadge } from '../ui/GlassBadge';
import { cn } from '../../utils/cn';
import { RotateCcw, X } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableSkills?: string[];
  isMobileModal?: boolean;
  onCloseMobileModal?: () => void;
}

const ALL_TYPES: OpportunityType[] = [
  'Internship',
  'Hackathon',
  'Workshop',
  'Certification',
  'Competition',
];

const POPULAR_SKILLS = [
  'Python',
  'React',
  'AI/ML',
  'TypeScript',
  'Java',
  'SQL',
  'Cloud',
  'UI/UX',
  'Cybersecurity',
  'Docker',
  'Algorithms',
];

const MODES: OpportunityMode[] = ['Online', 'Offline', 'Hybrid'];
const DIFFICULTIES: OpportunityDifficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  availableSkills = POPULAR_SKILLS,
  isMobileModal = false,
  onCloseMobileModal,
}) => {
  const toggleType = (type: OpportunityType) => {
    const exists = filters.types.includes(type);
    const updated = exists
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    onChange({ ...filters, types: updated });
  };

  const toggleSkill = (skill: string) => {
    const exists = filters.skills.includes(skill);
    const updated = exists
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    onChange({ ...filters, skills: updated });
  };

  const resetFilters = () => {
    onChange({
      searchQuery: '',
      types: [],
      skills: [],
      deadlineRange: 'all',
      mode: 'all',
      difficulty: 'all',
      sortBy: 'recommended',
    });
  };

  const activeFiltersCount =
    filters.types.length +
    filters.skills.length +
    (filters.deadlineRange !== 'all' ? 1 : 0) +
    (filters.mode !== 'all' ? 1 : 0) +
    (filters.difficulty !== 'all' ? 1 : 0);

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Filters
          </span>
          {activeFiltersCount > 0 && (
            <GlassBadge variant="accent" size="sm">
              {activeFiltersCount}
            </GlassBadge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
          {isMobileModal && onCloseMobileModal && (
            <button
              onClick={onCloseMobileModal}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2.5">
          Sort by
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'recommended', label: 'Recommended' },
            { id: 'deadline', label: 'Deadline' },
            { id: 'newest', label: 'Newest' },
            { id: 'bookmarked', label: 'Most Bookmarked' },
          ].map(sort => {
            const isSelected = filters.sortBy === sort.id;
            return (
              <button
                key={sort.id}
                onClick={() => onChange({ ...filters, sortBy: sort.id as any })}
                className={cn(
                  'px-3 py-2 text-xs font-medium rounded-xl border text-center transition-all',
                  isSelected
                    ? 'bg-accent text-white border-accent shadow-glow'
                    : 'bg-black/5 dark:bg-white/5 border-transparent text-neutral-700 dark:text-neutral-300 hover:bg-black/10 dark:hover:bg-white/10'
                )}
              >
                {sort.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Opportunity Type */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2.5">
          Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TYPES.map(type => {
            const isSelected = filters.types.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-xl border transition-all select-none',
                  isSelected
                    ? 'bg-accent/15 text-accent-700 dark:text-accent-300 border-accent/40 shadow-sm font-semibold'
                    : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                )}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode (Online / Offline / Hybrid) */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2.5">
          Format & Location
        </label>
        <div className="grid grid-cols-4 gap-1">
          {['all', ...MODES].map(mode => {
            const isSelected = filters.mode === mode;
            return (
              <button
                key={mode}
                onClick={() => onChange({ ...filters, mode: mode as any })}
                className={cn(
                  'py-1.5 text-xs font-medium rounded-xl border text-center capitalize transition-all',
                  isSelected
                    ? 'bg-accent text-white border-accent shadow-glow'
                    : 'bg-black/5 dark:bg-white/5 border-transparent text-neutral-600 dark:text-neutral-400'
                )}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Deadline Range */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2.5">
          Deadline
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'all', label: 'Anytime' },
            { id: 'today', label: 'Today' },
            { id: 'this_week', label: 'This Week' },
            { id: 'this_month', label: 'This Month' },
          ].map(d => {
            const isSelected = filters.deadlineRange === d.id;
            return (
              <button
                key={d.id}
                onClick={() => onChange({ ...filters, deadlineRange: d.id as any })}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-xl border text-center transition-all',
                  isSelected
                    ? 'bg-accent text-white border-accent shadow-glow'
                    : 'bg-black/5 dark:bg-white/5 border-transparent text-neutral-600 dark:text-neutral-400'
                )}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty / Experience */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2.5">
          Experience Level
        </label>
        <div className="grid grid-cols-4 gap-1">
          {['all', ...DIFFICULTIES].map(diff => {
            const isSelected = filters.difficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => onChange({ ...filters, difficulty: diff as any })}
                className={cn(
                  'py-1.5 text-xs font-medium rounded-xl border text-center capitalize transition-all',
                  isSelected
                    ? 'bg-accent text-white border-accent shadow-glow'
                    : 'bg-black/5 dark:bg-white/5 border-transparent text-neutral-600 dark:text-neutral-400'
                )}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2.5">
          Target Skills
        </label>
        <div className="flex flex-wrap gap-1.5">
          {availableSkills.map(skill => {
            const isSelected = filters.skills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={cn(
                  'px-2.5 py-1 text-xs rounded-lg border transition-all select-none',
                  isSelected
                    ? 'bg-accent/20 text-accent-700 dark:text-accent-300 border-accent/40 font-semibold'
                    : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                )}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {isMobileModal && (
        <div className="pt-4">
          <GlassButton
            variant="primary"
            className="w-full"
            onClick={onCloseMobileModal}
          >
            Apply Filters ({activeFiltersCount})
          </GlassButton>
        </div>
      )}
    </div>
  );

  if (isMobileModal) {
    return content;
  }

  return (
    <GlassCard className="p-5 rounded-3xl sticky top-28 border border-black/5 dark:border-white/10">
      {content}
    </GlassCard>
  );
};
