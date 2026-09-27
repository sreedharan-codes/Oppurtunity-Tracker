import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ExplorePage } from './pages/ExplorePage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { SavedPage } from './pages/SavedPage';
import { ProfilePage } from './pages/ProfilePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { LearningPage } from './pages/LearningPage';
import { AdminPage } from './pages/AdminPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { OpportunityDetailsModal } from './components/opportunities/OpportunityDetailsModal';
import { AuthModal } from './components/auth/AuthModal';
import { IntroAnimation } from './components/intro/IntroAnimation';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import type {
  Opportunity,
  Application,
  Bookmark,
  ApplicationStatus,
} from './types';
import {
  opportunityService,
  applicationService,
  bookmarkService,
} from './firebase/services';

const MainApplication: React.FC = () => {
  const { user } = useAuth();
  const { error, success, info } = useToast();

  // Start with Sign In page by default as requested
  const [activeTab, setActiveTab] = useState<string>('login');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Intro animation state: only when explicitly triggered
  const [showIntro, setShowIntro] = useState<boolean>(false);

  // Modals
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // When user signs in, transition to main overview dashboard
  useEffect(() => {
    if (user && (activeTab === 'login' || activeTab === 'signin' || activeTab === 'register' || activeTab === 'signup')) {
      setActiveTab('overview');
    }
  }, [user, activeTab]);

  // Load Data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const opps = await opportunityService.getAllOpportunities();
      setOpportunities(opps);

      if (user) {
        const [apps, bms] = await Promise.all([
          applicationService.getUserApplications(user.id),
          bookmarkService.getUserBookmarks(user.id),
        ]);
        setApplications(apps);
        setBookmarks(bms);
      } else {
        setApplications([]);
        setBookmarks([]);
      }
    } catch (err: any) {
      console.error('Failed to load application data:', err);
      error('Data Load Error', 'Could not refresh platform opportunities.');
    } finally {
      setLoading(false);
    }
  }, [user, error]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Application status lookup map
  const applicationStatusMap = useMemo(() => {
    const map = new Map<string, ApplicationStatus>();
    applications.forEach(a => map.set(a.opportunityId, a.status));
    return map;
  }, [applications]);

  // Bookmarked IDs set
  const bookmarkedIds = useMemo(() => {
    return new Set(bookmarks.map(b => b.opportunityId));
  }, [bookmarks]);

  // Handlers
  const handleToggleBookmark = async (opportunityId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const isNowBookmarked = await bookmarkService.toggleBookmark(user.id, opportunityId);
      if (isNowBookmarked) {
        setBookmarks(prev => [
          ...prev,
          {
            id: `${user.id}_${opportunityId}`,
            userId: user.id,
            opportunityId,
            createdAt: new Date().toISOString(),
          },
        ]);
        success('Saved to Collection ⭐', 'Opportunity added to your saved bookmarks.');
      } else {
        setBookmarks(prev => prev.filter(b => b.opportunityId !== opportunityId));
        info('Removed from Saved', 'Opportunity removed from bookmarks.');
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleStatusChange = async (
    opportunityId: string,
    newStatus: ApplicationStatus,
    notes?: string
  ) => {
    const now = new Date().toISOString();
    setApplications(prev => {
      const existing = prev.find(a => a.opportunityId === opportunityId);
      if (existing) {
        return prev.map(a =>
          a.opportunityId === opportunityId
            ? {
                ...a,
                status: newStatus,
                notes: notes !== undefined ? notes : a.notes,
                updatedAt: now,
                appliedDate: newStatus === 'Applied' && !a.appliedDate ? now : a.appliedDate,
              }
            : a
        );
      } else {
        return [
          ...prev,
          {
            id: `${user?.id || 'demo'}_${opportunityId}`,
            userId: user?.id || 'demo',
            opportunityId,
            status: newStatus,
            notes: notes || '',
            appliedDate: newStatus === 'Applied' ? now : undefined,
            createdAt: now,
            updatedAt: now,
          },
        ];
      }
    });

    if (user) {
      try {
        await applicationService.setStatus(user.id, opportunityId, newStatus, notes);
      } catch (e) {
        console.warn('Error persisting application status:', e);
      }
    }
  };

  const handleRemoveApplication = async (opportunityId: string) => {
    setApplications(prev => prev.filter(a => a.opportunityId !== opportunityId));
    if (user) {
      try {
        await applicationService.deleteApplication(user.id, opportunityId);
        info('Removed', 'Removed from your application tracker.');
      } catch (e) {
        console.warn('Error deleting application:', e);
      }
    }
  };

  const handleViewDetails = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('opportunity_intro_shown_v1', 'true');
  };

  const isAuthTab =
    activeTab === 'login' ||
    activeTab === 'signin' ||
    activeTab === 'register' ||
    activeTab === 'signup' ||
    activeTab === 'auth';

  // Dedicated standalone Auth Workflow (Sign In / Sign Up) - NO left sidebar
  if (isAuthTab) {
    return (
      <>
        {/* Intro Reveal Animation */}
        {showIntro && (
          <IntroAnimation onComplete={handleIntroComplete} />
        )}

        <div className="min-h-screen bg-[#141518] text-white flex items-center justify-center p-3 sm:p-6 md:p-8 font-sans antialiased selection:bg-[#d8ff3e] selection:text-black">
          <div className="w-full max-w-6xl bg-[#eaebef] rounded-[28px] md:rounded-[40px] p-4 sm:p-8 md:p-10 shadow-2xl relative my-auto animate-fade-in">
            {activeTab === 'register' || activeTab === 'signup' ? (
              <SignUpPage
                onSuccess={() => setActiveTab('overview')}
                onNavigateToSignIn={() => setActiveTab('login')}
                onExploreAsGuest={() => setActiveTab('overview')}
              />
            ) : (
              <SignInPage
                onSuccess={() => setActiveTab('overview')}
                onNavigateToSignUp={() => setActiveTab('register')}
                onExploreAsGuest={() => setActiveTab('overview')}
              />
            )}
          </div>
        </div>
      </>
    );
  }

  // Main Platform Workflow (with Left Sidebar Navigation)
  return (
    <>
      {/* Intro Reveal Animation */}
      {showIntro && (
        <IntroAnimation onComplete={handleIntroComplete} />
      )}

      <AppLayout
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAuth={() => setActiveTab('login')}
        onReplayIntro={() => setShowIntro(true)}
        savedCount={bookmarks.length}
        applicationsCount={applications.length}
      >
        {/* Dynamic Tab Views */}
        {activeTab === 'landing' && (
          <LandingPage
            onExplore={() => setActiveTab('explore')}
            onGetStarted={() => {
              if (user) setActiveTab('overview');
              else setActiveTab('login');
            }}
          />
        )}

        {activeTab === 'overview' && (
          <DashboardPage
            opportunities={opportunities}
            applications={applications}
            bookmarks={bookmarks}
            onNavigateTab={setActiveTab}
            onViewDetails={handleViewDetails}
          />
        )}

        {activeTab === 'explore' && (
          <ExplorePage
            opportunities={opportunities}
            loading={loading}
            bookmarkedIds={bookmarkedIds}
            applicationStatusMap={applicationStatusMap}
            onToggleBookmark={handleToggleBookmark}
            onViewDetails={handleViewDetails}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardPage
            applications={applications}
            bookmarks={bookmarks}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'learning' && (
          <LearningPage onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'applications' && (
          <ApplicationsPage
            applications={applications}
            opportunities={opportunities}
            onStatusChange={handleStatusChange}
            onRemoveApplication={handleRemoveApplication}
            onViewDetails={handleViewDetails}
            onExplore={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'saved' && (
          <SavedPage
            opportunities={opportunities}
            bookmarks={bookmarks}
            applicationStatusMap={applicationStatusMap}
            onToggleBookmark={handleToggleBookmark}
            onViewDetails={handleViewDetails}
            onExplore={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'profile' && <ProfilePage />}

        {activeTab === 'admin' && (
          <AdminPage
            opportunities={opportunities}
            totalApplicationsCount={applications.length}
            totalBookmarksCount={bookmarks.length}
            onRefreshData={loadData}
          />
        )}

        {/* Opportunity Details Modal */}
        <OpportunityDetailsModal
          opportunity={selectedOpportunity}
          isOpen={!!selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
          isBookmarked={selectedOpportunity ? bookmarkedIds.has(selectedOpportunity.id) : false}
          applicationStatus={selectedOpportunity ? applicationStatusMap.get(selectedOpportunity.id) : undefined}
          onStatusChange={handleStatusChange}
          onToggleBookmark={handleToggleBookmark}
        />

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </AppLayout>
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <MainApplication />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
