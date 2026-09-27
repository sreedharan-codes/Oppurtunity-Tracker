import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Shield,
  LogOut,
  LogIn,
  CheckCircle2,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface FluxTopbarProps {
  onOpenAuth: () => void;
  onSelectTab: (tab: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onToggleMobileMenu?: () => void;
}

export const FluxTopbar: React.FC<FluxTopbarProps> = ({
  onOpenAuth: _onOpenAuth,
  onSelectTab,
  searchQuery = '',
  onSearchChange,
  onToggleMobileMenu,
}) => {
  const { user, isAdmin, loginAsDemoStudent, loginAsDemoAdmin, logout } = useAuth();
  const { info, success } = useToast();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'Google STEP Internship Deadline',
      time: '2 hours ago',
      unread: true,
      category: 'Deadlines',
    },
    {
      id: '2',
      title: '98% Match: DeepMind Research Fellow',
      time: '5 hours ago',
      unread: true,
      category: 'Matches',
    },
  ];

  const handleRoleChange = async (newRole: 'student' | 'admin') => {
    if (newRole === 'admin') {
      await loginAsDemoAdmin();
      success('Console Switched', 'Active workspace set to ADMIN console.');
    } else {
      await loginAsDemoStudent();
      success('Workspace Switched', 'Active workspace set to STUDENT profile.');
    }
    setIsProfileDropdownOpen(false);
  };

  const displayName = user ? (user.name || 'Student User') : 'Guest Explorer';
  const displayEmail = user ? user.email : 'guest@flux.network';
  const avatarUrl =
    user?.photoURL ||
    (user
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');

  return (
    <header className="w-full flex items-center justify-between gap-4 py-2 mb-6 relative z-30 select-none">
      {/* Left: User Profile Dropdown Pill */}
      <div className="relative">
        <button
          onClick={() => {
            setIsProfileDropdownOpen(!isProfileDropdownOpen);
            setIsNotificationsOpen(false);
          }}
          className="flex items-center gap-3 py-1.5 px-2 rounded-2xl hover:bg-black/5 transition-colors focus:outline-none group text-left"
        >
          {/* Avatar with status dot */}
          <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden ring-2 ring-white shadow-sm shrink-0 bg-gray-200">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          {/* User Name & Email */}
          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-gray-900 tracking-tight leading-tight group-hover:text-black">
                {displayName}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                  isProfileDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
            <span className="text-xs text-gray-500 font-medium leading-tight">
              {displayEmail}
            </span>
          </div>
        </button>

        {/* Profile Dropdown Menu */}
        {isProfileDropdownOpen && (
          <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white shadow-xl border border-gray-100 p-2 z-50 animate-scale-in">
            <div className="p-3 border-b border-gray-100 flex items-center gap-3">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-gray-900 truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    user ? 'bg-[#d8ff3e]/40 text-black' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {user ? (isAdmin ? 'ADMIN' : 'STUDENT') : 'GUEST'} Account
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="py-2 text-xs font-semibold text-gray-500 px-3 uppercase tracking-wider">
              Switch Workspace Mode
            </div>

            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleRoleChange('student')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  !isAdmin
                    ? 'bg-gray-100 text-black'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span>Student Workspace</span>
                </div>
                {!isAdmin && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </button>

              <button
                onClick={() => handleRoleChange('admin')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isAdmin
                    ? 'bg-gray-100 text-black'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <span>Admin Console</span>
                </div>
                {isAdmin && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            </div>

            <div className="my-1 border-t border-gray-100" />

            <button
              onClick={() => {
                setIsProfileDropdownOpen(false);
                onSelectTab('profile');
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <span>Edit Account Preferences</span>
            </button>

            {user ? (
              <button
                onClick={() => {
                  logout();
                  setIsProfileDropdownOpen(false);
                  onSelectTab('login');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsProfileDropdownOpen(false);
                  onSelectTab('login');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <LogIn className="w-4 h-4 text-black" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right: Search Pill & Notification Bell */}
      <div className="flex items-center gap-3">
        {/* Search Input Pill */}
        <div className="relative flex items-center">
          <div className="absolute left-4 pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSelectTab('explore');
                info('Catalog Search', `Searching catalog for "${searchQuery}"`);
              }
            }}
            placeholder="Search..."
            className="w-44 sm:w-60 md:w-72 pl-11 pr-4 py-2.5 rounded-full bg-white text-sm font-medium text-gray-800 placeholder-gray-400 shadow-sm border border-transparent focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d8ff3e] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange?.('')}
              className="absolute right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Notifications Pill Button */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileDropdownOpen(false);
            }}
            aria-label="Notifications"
            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 shadow-sm transition-colors relative focus:outline-none"
          >
            <Bell className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            {/* Neon Lime notification counter */}
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#d8ff3e] text-black text-[10px] font-black flex items-center justify-center ring-2 ring-[#eaebef] shadow-sm">
              2
            </span>
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-xl border border-gray-100 p-3 z-50 animate-scale-in">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                <span className="font-bold text-sm text-gray-900">Notifications</span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  2 New
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      onSelectTab('explore');
                    }}
                    className="p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors flex items-start justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-800 leading-snug">
                        {n.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400 font-medium">
                          {n.time}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.2 rounded">
                          {n.category}
                        </span>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-[#d8ff3e] shrink-0 mt-1" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
