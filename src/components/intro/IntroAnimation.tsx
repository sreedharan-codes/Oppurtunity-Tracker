import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';

interface IntroAnimationProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({
  onComplete,
  forceShow = false,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Connecting to Opportunity Hub...');
  const startTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Exact 3-second preloader duration (3000ms)
  const TOTAL_DURATION = 3000;

  const handleSkip = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 250);
  }, [onComplete]);

  useEffect(() => {
    const updateProgress = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const pct = Math.min(100, Math.floor((elapsed / TOTAL_DURATION) * 100));

      setProgress(pct);

      // Evolve humanized status message across the 3 seconds
      if (pct < 32) {
        setStatusMessage('Connecting to Opportunity Hub...');
      } else if (pct < 68) {
        setStatusMessage('Curating internships, hackathons & programs...');
      } else if (pct < 94) {
        setStatusMessage('Calculating student compatibility scores...');
      } else {
        setStatusMessage('Ready to move forward.');
      }

      if (elapsed < TOTAL_DURATION) {
        animFrameRef.current = requestAnimationFrame(updateProgress);
      } else {
        // 3 seconds reached: trigger smooth fade out
        setProgress(100);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            setIsVisible(false);
            onComplete();
          }, 450); // 450ms smooth dissolve exit
        }, 150);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateProgress);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onComplete, handleSkip]);

  if (!isVisible && !forceShow) return null;

  return (
    <div
      onClick={handleSkip}
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center p-6 select-none cursor-pointer transition-all duration-500',
        'bg-[#08090e]/95 backdrop-blur-3xl',
        isFadingOut && 'opacity-0 scale-105 pointer-events-none'
      )}
    >
      {/* Ambient background light rays */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-accent/20 blur-[130px] pointer-events-none animate-pulse-subtle" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-indigo-500/15 blur-[95px] pointer-events-none" />

      {/* Skip button in top corner */}
      <button
        onClick={e => {
          e.stopPropagation();
          handleSkip();
        }}
        className="absolute top-6 right-6 px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all"
      >
        Skip (Esc)
      </button>

      {/* Center Icon & Branding Container */}
      <div className="relative flex flex-col items-center text-center space-y-6 max-w-md">
        {/* Glowing Apple-style Liquid Badge */}
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-accent-600 via-accent to-[#5e5ce6] p-0.5 shadow-2xl shadow-[0_0_50px_rgba(0,113,227,0.45)] transition-transform duration-500 hover:scale-105">
          <div className="w-full h-full rounded-[22px] bg-[#0c0e18]/85 backdrop-blur-xl flex items-center justify-center relative overflow-hidden">
            {/* Specular shimmer light sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            <svg
              className="w-10 h-10 text-white drop-shadow-md"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 23L23 9M23 9H13M23 9V19"
                stroke="white"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Brand Name Typography */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
            OPPORTUNITY
          </h1>

          {/* Tagline */}
          <p className="text-base sm:text-lg font-medium text-neutral-300">
            Find what moves you forward.
          </p>

          <p className="text-xs text-neutral-400 font-medium">
            Student Opportunity Tracker · Vision2Web
          </p>
        </div>

        {/* 3-Second Preloader Progress Bar and Counter */}
        <div className="w-56 sm:w-64 space-y-2 pt-2">
          {/* Progress bar container */}
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden relative backdrop-blur-sm border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-accent via-sky-400 to-[#5e5ce6] rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(0,113,227,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Percentage and live status text */}
          <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium px-0.5">
            <span className="truncate pr-2 text-neutral-300">{statusMessage}</span>
            <span className="font-mono text-accent font-semibold shrink-0">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
