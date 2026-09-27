import React from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  LogOut,
  LogIn,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';

interface GlassNavbarProps {
  onSelectTab: (tab: string) => void;
  onOpenAuth: () => void;
  onReplayIntro?: () => void;
}

export const GlassNavbar: React.FC<GlassNavbarProps> = ({
  onSelectTab,
  onOpenAuth,
  onReplayIntro,
}) => {
  const { user, isAdmin, logout, loginAsDemoStudent, loginAsDemoAdmin, isFirebaseActive } = useAuth();
  const { effectiveTheme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-3 left-0 right-0 z-40 px-4 sm:px-6 pointer-events-none flex justify-center">
      <div className="pointer-events-auto flex items-center justify-between gap-4 px-4 py-2 rounded-full glass-surface shadow-sm border border-white/20 dark:border-white/10 max-w-5xl w-full backdrop-blur-2xl bg-white/75 dark:bg-[#10131e]/80">
        {/* Brand / Logo */}
        <div
          onClick={() => onSelectTab(user ? 'overview' : 'landing')}
          className="flex items-center gap-2.5 cursor-pointer pl-1 select-none group"
        >
          <div className="w-7 h-7 rounded-xl bg-accent flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-3.5 h-3.5 fill-white/20" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold tracking-tight text-sm text-neutral-900 dark:text-neutral-100 font-sans">
              OPPORTUNITY
            </span>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 hidden sm:inline-block font-normal">
              Find what moves you forward
            </span>
          </div>
          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent dark:bg-accent/20 border border-accent/20 hidden md:inline-block ml-1">
            {isFirebaseActive ? 'Live Firebase' : 'Demo Sandbox'}
          </span>
        </div>

        {/* Right side utility controls */}
        <div className="flex items-center gap-2">
          {/* Replay Intro Animation Button */}
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              title="Replay Intro Animation"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-accent" />
              <span>Intro</span>
            </button>
          )}

          {/* Quick Demo Role Switcher for hackathon evaluators */}
          {user && (
            <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-full p-0.5 text-[11px] font-medium border border-black/5 dark:border-white/5">
              <button
                onClick={loginAsDemoStudent}
                className={cn(
                  'px-2.5 py-0.5 rounded-full transition-all',
                  !isAdmin
                    ? 'bg-white dark:bg-white/20 text-neutral-900 dark:text-white shadow-sm font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                )}
              >
                Student
              </button>
              <button
                onClick={loginAsDemoAdmin}
                className={cn(
                  'px-2.5 py-0.5 rounded-full transition-all',
                  isAdmin
                    ? 'bg-white dark:bg-white/20 text-neutral-900 dark:text-white shadow-sm font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                )}
              >
                Admin
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {effectiveTheme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-neutral-700" />
            )}
          </button>

          {/* User Profile / Auth Button */}
          {user ? (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => onSelectTab('profile')}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                title={`${user.name} (${user.role})`}
              >
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover border border-white/20 shadow-sm"
                />
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 hidden md:inline-block max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>
              <button
                onClick={logout}
                aria-label="Log out"
                title="Log out"
                className="w-6 h-6 rounded-full flex items-center justify-center text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-accent text-white hover:bg-accent-600 shadow-glow transition-all"
            >
              <LogIn className="w-3 h-3" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
