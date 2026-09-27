import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-black/5 dark:border-white/5 py-12 px-6 relative z-10 text-xs text-neutral-500 dark:text-neutral-400">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">OPPORTUNITY</span>
          <span className="text-neutral-400">— Find what moves you forward.</span>
        </div>

        <div className="flex items-center gap-1.5 text-center">
          <span>Crafted for the Vision2Web Hackathon with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline-block" />
          <span>and Liquid Glass Design.</span>
        </div>

        <div className="text-neutral-400 text-[11px]">
          © {new Date().getFullYear()} OPPORTUNITY Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
