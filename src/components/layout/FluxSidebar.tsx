import React from 'react';
import {
  LayoutGrid,
  Compass,
  Trophy,
  GraduationCap,
  Briefcase,
  Bookmark,
  User,
  Shield,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface FluxSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  savedCount?: number;
  applicationsCount?: number;
}

export const FluxSidebar: React.FC<FluxSidebarProps> = ({
  activeTab,
  onSelectTab,
  savedCount = 0,
  applicationsCount = 0,
}) => {
  const navItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: LayoutGrid,
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: Compass,
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: Trophy,
    },
    {
      id: 'learning',
      label: 'Learning',
      icon: GraduationCap,
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: Briefcase,
      badge: applicationsCount > 0 ? applicationsCount : undefined,
      badgeColor: 'bg-[#d8ff3e] text-black',
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: Bookmark,
      badge: savedCount > 0 ? savedCount : undefined,
      badgeColor: 'bg-[#d8ff3e] text-black',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: Shield,
    },
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 flex flex-col justify-between shrink-0 p-4 md:p-6 bg-[#141518] text-white select-none transition-all duration-300">
      <div className="flex flex-col gap-8">
        {/* Brand Header */}
        <div
          onClick={() => onSelectTab('overview')}
          className="flex items-center gap-3 px-2 cursor-pointer group"
        >
          {/* Neon Lime 4-petal clover icon */}
          <div className="relative w-8 h-8 flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              className="w-8 h-8 text-[#d8ff3e] drop-shadow-[0_0_8px_rgba(216,255,62,0.5)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="10" cy="10" rx="5" ry="7" fill="#d8ff3e" transform="rotate(-30 10 10)" />
              <ellipse cx="22" cy="10" rx="5" ry="7" fill="#d8ff3e" transform="rotate(30 22 10)" />
              <ellipse cx="10" cy="22" rx="5" ry="7" fill="#d8ff3e" transform="rotate(30 10 22)" />
              <ellipse cx="22" cy="22" rx="5" ry="7" fill="#d8ff3e" transform="rotate(-30 22 22)" />
              <circle cx="16" cy="16" r="3" fill="#141518" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-white font-sans lowercase leading-none">
              flux
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#d8ff3e] opacity-80 mt-0.5">
              Opportunity
            </span>
          </div>
        </div>

        {/* Navigation Items with fluid animations */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`group relative flex items-center justify-between w-full px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ease-out active:scale-95 ${
                  isActive
                    ? 'bg-white text-black shadow-lg translate-x-1'
                    : 'text-[#8b8f9a] hover:text-white hover:bg-white/5 hover:translate-x-1'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isActive
                        ? 'text-black scale-105'
                        : 'text-[#8b8f9a] group-hover:text-white group-hover:scale-110'
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  <span className="tracking-tight">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-full flex items-center justify-center min-w-5 h-5 transition-all duration-300 group-hover:scale-110 ${
                      isActive
                        ? 'bg-[#d8ff3e] text-black shadow-sm'
                        : 'bg-[#d8ff3e] text-black'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sleek Minimalist Pipeline Status Card (Replacing Upgrade to Pro) */}
      <div className="mt-8 relative overflow-hidden bg-[#1c1d22] border border-white/5 rounded-[24px] p-4 text-white shadow-xl transition-all duration-300 hover:border-white/10 group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d8ff3e] animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-300">
              Fall 2026 Cycle
            </span>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-[#d8ff3e]" />
        </div>

        <p className="text-xs font-extrabold text-white mt-2 leading-tight">
          Peak Recruiting Season
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
          High volume of tech internships & fellowships active.
        </p>

        <button
          onClick={() => onSelectTab('explore')}
          className="mt-3 w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#d8ff3e] flex items-center justify-center gap-1.5 transition-all duration-200 group-hover:bg-[#d8ff3e] group-hover:text-black"
        >
          <span>Find Opportunities</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </aside>
  );
};
