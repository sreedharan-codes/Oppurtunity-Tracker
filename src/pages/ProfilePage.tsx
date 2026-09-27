import React from 'react';
import { ProfileEditor } from '../components/profile/ProfileEditor';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-sans">
          Student Profile & Skills
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Update your background and technical skills to power the deterministic matching engine.
        </p>
      </div>

      <ProfileEditor key={user?.id || 'guest'} />
    </div>
  );
};
