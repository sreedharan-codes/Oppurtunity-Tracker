import React from 'react';
import {
  Compass,
  LayoutDashboard,
  Bookmark,
  KanbanSquare,
  User,
  ShieldCheck,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

interface FloatingDockProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: () => void;
  savedCount?: number;
  applicationsCount?: number;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  activeTab,
  onSelectTab,
  onOpenAuth,
  savedCount = 0,
  applicationsCount = 0,
}) => {
  const { user, isAdmin } = useAuth();

  const dockItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: undefined },
    { id: 'explore', label: 'Explore', icon: Compass, badge: undefined },
    { id: 'saved', label: 'Saved', icon: Bookmark, badge: savedCount > 0 ? savedCount : undefined },
    { id: 'applications', label: 'Applications', icon: KanbanSquare, badge: applicationsCount > 0 ? applicationsCount : undefined },
    { id: 'profile', label: 'Profile', icon: User, badge: undefined },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: ShieldCheck, badge: undefined }] : []),
  ];

  return (
    <div className="fixed bottom-5 sm:bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-3">
      {!user ? (
        /* Guest Dock */
        <nav
          aria-label="Floating Navigation Dock"
          className="pointer-events-auto flex items-center gap-2 p-1.5 sm:p-2 rounded-full glass-dock shadow-dock dark:shadow-dock border border-white/20 dark:border-white/10 backdrop-blur-3xl animate-fade-up bg-white/80 dark:bg-[#10131e]/85"
        >
          <button
            onClick={() => onSelectTab('landing')}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-semibold transition-all',
              activeTab === 'landing'
                ? 'bg-accent text-white shadow-glow'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10'
            )}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('explore')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all',
              activeTab === 'explore'
                ? 'bg-accent text-white shadow-glow'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10'
            )}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Opportunities</span>
          </button>
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-4.5 py-2 rounded-full text-xs font-semibold bg-accent text-white shadow-glow hover:bg-accent-600 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </nav>
      ) : (
        /* Authenticated Student/Admin Floating Dock */
        <nav
          aria-label="Floating Navigation Dock"
          className="pointer-events-auto flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-full glass-dock shadow-dock dark:shadow-dock border border-white/25 dark:border-white/10 backdrop-blur-3xl animate-fade-up bg-white/85 dark:bg-[#10131e]/90 transition-all duration-300 hover:shadow-2xl"
        >
          {dockItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={cn(
                  'relative group flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 select-none',
                  isActive
                    ? 'text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 active:scale-95'
                )}
                title={item.label}
              >
                {/* Active Apple Pill Background */}
                {isActive && (
                  <span className="absolute inset-0 bg-accent rounded-full shadow-glow -z-10 animate-fade-in" />
                )}

                <div className="relative">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-transform duration-200 group-hover:scale-110',
                      isActive ? 'text-white' : 'text-current'
                    )}
                  />
                  {item.badge !== undefined && !isActive && (
                    <span className="absolute -top-1.5 -right-2 px-1 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Text Label on desktop and tablet */}
                <span className="hidden sm:inline-block tracking-tight font-medium">
                  {item.label}
                </span>

                {/* Subtle active dot on mobile */}
                {isActive && (
                  <span className="sm:hidden w-1 h-1 bg-white rounded-full ml-0.5" />
                )}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
};
