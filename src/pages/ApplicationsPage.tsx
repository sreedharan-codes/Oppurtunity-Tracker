import React, { useState, useMemo } from 'react';
import type { Application, Opportunity, ApplicationStatus, OpportunityType } from '../types';
import { ApplicationBoard } from '../components/applications/ApplicationBoard';
import { GlassButton } from '../components/ui/GlassButton';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../context/ToastContext';
import { KanbanSquare, Compass, Download, Search } from 'lucide-react';
import { cn } from '../utils/cn';

interface ApplicationsPageProps {
  applications: Application[];
  opportunities: Opportunity[];
  onStatusChange: (opportunityId: string, newStatus: ApplicationStatus, notes?: string) => void;
  onRemoveApplication: (opportunityId: string) => void;
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

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  applications,
  opportunities,
  onStatusChange,
  onRemoveApplication,
  onViewDetails,
  onExplore,
}) => {
  const { success } = useToast();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | OpportunityType>('All');

  const oppMap = useMemo(() => {
    const map = new Map<string, Opportunity>();
    opportunities.forEach(o => map.set(o.id, o));
    return map;
  }, [opportunities]);

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const opp = oppMap.get(app.opportunityId);
      if (!opp) return false;

      if (selectedType !== 'All' && opp.type !== selectedType) {
        return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchTitle = opp.title.toLowerCase().includes(q);
        const matchOrg = opp.organization.toLowerCase().includes(q);
        const matchNotes = (app.notes || '').toLowerCase().includes(q);
        if (!matchTitle && !matchOrg && !matchNotes) return false;
      }

      return true;
    });
  }, [applications, oppMap, search, selectedType]);

  const handleExportCSV = () => {
    if (applications.length === 0) return;

    const headers = ['Title', 'Organization', 'Type', 'Status', 'Deadline', 'Notes', 'Applied Date'];
    const rows = applications.map(app => {
      const opp = oppMap.get(app.opportunityId);
      return [
        `"${opp?.title || 'Unknown'}"`,
        `"${opp?.organization || 'Unknown'}"`,
        `"${opp?.type || ''}"`,
        `"${app.status}"`,
        `"${opp?.deadline || ''}"`,
        `"${(app.notes || '').replace(/"/g, '""')}"`,
        `"${app.appliedDate || ''}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `opportunity_tracker_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success('Pipeline Exported! 📄', 'Downloaded your application tracker spreadsheet.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-sans">
              Application Tracker
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
              {applications.length} Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Organize your progress from discovery to interview and completion.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {applications.length > 0 && (
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={handleExportCSV}
              icon={<Download className="w-3.5 h-3.5" />}
              title="Download your tracker as CSV"
            >
              Export CSV
            </GlassButton>
          )}

          <GlassButton
            variant="primary"
            size="sm"
            onClick={onExplore}
            icon={<Compass className="w-4 h-4" />}
          >
            Discover More
          </GlassButton>
        </div>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={<KanbanSquare className="w-8 h-8 text-neutral-400" />}
          title="No applications tracked yet"
          description="Browse opportunities in the Explore tab and set their status to Interested or Applied to build your pipeline."
          actionLabel="Explore Opportunities"
          onAction={onExplore}
        />
      ) : (
        <div className="space-y-5">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tracked applications or notes..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white/70 dark:bg-white/10 border border-black/5 dark:border-white/10 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedType(cat)}
                  className={cn(
                    'text-xs px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap',
                    selectedType === cat
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/10'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <ApplicationBoard
            applications={filteredApplications}
            opportunities={opportunities}
            onStatusChange={onStatusChange}
            onRemoveApplication={onRemoveApplication}
            onViewDetails={onViewDetails}
          />
        </div>
      )}
    </div>
  );
};
