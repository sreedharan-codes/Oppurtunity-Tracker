import React from 'react';
import type { Opportunity } from '../types';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/ui/EmptyState';
import { ShieldAlert } from 'lucide-react';

interface AdminPageProps {
  opportunities: Opportunity[];
  totalApplicationsCount: number;
  totalBookmarksCount: number;
  onRefreshData: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  opportunities,
  totalApplicationsCount,
  totalBookmarksCount,
  onRefreshData,
}) => {
  const { isAdmin, loginAsDemoAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="py-12 animate-fade-in max-w-lg mx-auto">
        <EmptyState
          icon={<ShieldAlert className="w-8 h-8 text-rose-500" />}
          title="Admin Access Required"
          description="You are currently signed in as a student. Only authorized administrator roles can publish, update, and manage opportunities."
          actionLabel="Switch to Admin Demo Account"
          onAction={loginAsDemoAdmin}
        />
      </div>
    );
  }

  return (
    <AdminDashboard
      opportunities={opportunities}
      totalApplicationsCount={totalApplicationsCount}
      totalBookmarksCount={totalBookmarksCount}
      onRefreshData={onRefreshData}
    />
  );
};
