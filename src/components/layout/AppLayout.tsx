import React, { useState } from 'react';
import { FluxSidebar } from './FluxSidebar';
import { FluxTopbar } from './FluxTopbar';
import { X } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: () => void;
  onReplayIntro?: () => void;
  savedCount?: number;
  applicationsCount?: number;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  activeTab,
  onSelectTab,
  onOpenAuth,
  savedCount = 0,
  applicationsCount = 0,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#141518] text-white flex flex-col md:flex-row p-2 md:p-3.5 gap-3 md:gap-4 font-sans select-none antialiased">
      {/* Desktop Flux Left Sidebar */}
      <div className="hidden md:flex">
        <FluxSidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          savedCount={savedCount}
          applicationsCount={applicationsCount}
        />
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-md flex flex-col animate-fade-in">
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <span className="font-extrabold text-xl tracking-tight text-white">Navigation</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <FluxSidebar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                onSelectTab(tab);
                setIsMobileMenuOpen(false);
              }}
              savedCount={savedCount}
              applicationsCount={applicationsCount}
            />
          </div>
        </div>
      )}

      {/* Right Canvas Main Frame */}
      <div className="flex-1 bg-[#eaebef] rounded-[28px] md:rounded-[36px] flex flex-col min-h-[calc(100vh-1.75rem)] overflow-x-hidden p-4 sm:p-6 md:p-8 text-gray-900 shadow-2xl relative transition-all duration-300">
        {/* Top Header inside the light canvas */}
        <FluxTopbar
          onOpenAuth={onOpenAuth}
          onSelectTab={onSelectTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Dynamic Page Content with fluid transition */}
        <main className="flex-1 w-full max-w-7xl mx-auto pb-8 animate-fade-up">
          {children}
        </main>
      </div>
    </div>
  );
};
