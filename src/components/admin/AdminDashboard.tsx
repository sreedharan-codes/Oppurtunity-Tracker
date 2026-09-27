import React, { useState } from 'react';
import { Opportunity } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { GlassBadge } from '../ui/GlassBadge';
import { StatCard } from '../ui/StatCard';
import { SearchBar } from '../opportunities/SearchBar';
import { AdminOpportunityForm } from './AdminOpportunityForm';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { opportunityService } from '../../firebase/services';
import { OrgLogo } from '../ui/OrgLogo';
import {
  Layers,
  Globe,
  CheckCircle2,
  Bookmark,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Database,
} from 'lucide-react';
import { getDaysRemaining } from '../../utils/dateUtils';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  opportunities: Opportunity[];
  totalApplicationsCount: number;
  totalBookmarksCount: number;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  opportunities,
  totalApplicationsCount,
  totalBookmarksCount,
  onRefreshData,
}) => {
  const { success, error } = useToast();
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [oppToDelete, setOppToDelete] = useState<Opportunity | null>(null);
  const [seeding, setSeeding] = useState(false);

  // Filtered opportunities
  const filtered = opportunities.filter(opp => {
    const q = search.toLowerCase();
    return (
      opp.title.toLowerCase().includes(q) ||
      opp.organization.toLowerCase().includes(q) ||
      opp.type.toLowerCase().includes(q) ||
      opp.skills.some(s => s.toLowerCase().includes(q))
    );
  });

  const publishedCount = opportunities.filter(o => o.status === 'published').length;
  const upcomingDeadlinesCount = opportunities.filter(o => {
    const days = getDaysRemaining(o.deadline);
    return days >= 0 && days <= 7;
  }).length;

  const handleCreate = () => {
    setEditingOpp(null);
    setIsFormOpen(true);
  };

  const handleEdit = (opp: Opportunity) => {
    setEditingOpp(opp);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!oppToDelete) return;
    try {
      await opportunityService.deleteOpportunity(oppToDelete.id);
      success('Deleted', `"${oppToDelete.title}" has been deleted.`);
      onRefreshData();
    } catch (err: any) {
      error('Delete failed', err?.message || 'Could not delete opportunity.');
    } finally {
      setOppToDelete(null);
    }
  };

  const handleTogglePublish = async (opp: Opportunity) => {
    const nextStatus = opp.status === 'published' ? 'draft' : 'published';
    try {
      await opportunityService.updateOpportunity(opp.id, { status: nextStatus });
      success('Status Changed', `Status updated to ${nextStatus}.`);
      onRefreshData();
    } catch (err: any) {
      error('Failed to update status', err?.message);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const count = await opportunityService.seedOpportunitiesToFirestore();
      success('Seeded sample data', `Successfully loaded ${count} verified opportunities.`);
      confetti({ particleCount: 40, spread: 60 });
      onRefreshData();
    } catch (err: any) {
      error('Seeding error', err?.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Title and Action buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Admin Platform Console
            </h2>
            <GlassBadge variant="accent" size="sm">
              Administrator
            </GlassBadge>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Manage opportunities, monitor application velocity, and publish verified programs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={handleSeed}
            loading={seeding}
            icon={<Database className="w-3.5 h-3.5 text-accent" />}
          >
            Seed 22 Demo Opps
          </GlassButton>

          <GlassButton
            variant="primary"
            size="md"
            onClick={handleCreate}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Opportunity
          </GlassButton>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <StatCard
          label="Total Opportunities"
          value={opportunities.length}
          subtext="In database"
          icon={<Layers className="w-5 h-5 text-accent" />}
        />
        <StatCard
          label="Published"
          value={publishedCount}
          subtext="Visible to students"
          icon={<Globe className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          label="Applications"
          value={totalApplicationsCount}
          subtext="Total trackings"
          icon={<CheckCircle2 className="w-5 h-5 text-indigo-500" />}
        />
        <StatCard
          label="Bookmarks"
          value={totalBookmarksCount}
          subtext="Saved by students"
          icon={<Bookmark className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          label="Due This Week"
          value={upcomingDeadlinesCount}
          subtext="Next 7 days"
          icon={<Clock className="w-5 h-5 text-rose-500" />}
        />
      </div>

      {/* Search and Opportunity Management Table */}
      <GlassCard className="p-6 rounded-3xl border border-black/5 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            Program Inventory ({filtered.length})
          </h3>
          <div className="w-full sm:w-72">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Filter by title, company, skills..."
            />
          </div>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-300">
            <thead className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 border-b border-black/5 dark:border-white/10">
              <tr>
                <th className="py-3 px-3">Opportunity</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Format</th>
                <th className="py-3 px-3">Deadline</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {filtered.map(opp => (
                <tr key={opp.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <OrgLogo
                        name={opp.organization}
                        logoUrl={opp.organizationLogo}
                        size="sm"
                      />
                      <div className="min-w-0 max-w-xs">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100 truncate block">
                          {opp.title}
                        </span>
                        <span className="text-neutral-400 text-[11px]">
                          {opp.organization}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium">
                    <GlassBadge variant="default" size="sm">
                      {opp.type}
                    </GlassBadge>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                      {opp.mode}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-neutral-700 dark:text-neutral-300">
                    {opp.deadline}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleTogglePublish(opp)}
                      className="cursor-pointer"
                      title="Click to toggle status"
                    >
                      <GlassBadge
                        variant={opp.status === 'published' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {opp.status}
                      </GlassBadge>
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEdit(opp)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-accent hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        title="Edit opportunity"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setOppToDelete(opp)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Delete opportunity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Modal Form for Create/Edit */}
      <AdminOpportunityForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        opportunityToEdit={editingOpp}
        onSaved={() => {
          onRefreshData();
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!oppToDelete}
        onClose={() => setOppToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Opportunity"
        message={`Are you sure you want to permanently delete "${oppToDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
};
