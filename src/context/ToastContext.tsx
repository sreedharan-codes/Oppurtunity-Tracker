import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (title: string, message?: string, type?: ToastType) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((title: string, message?: string, type: ToastType = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    setToasts(prev => [...prev.slice(-3), { id, title, message, type }]); // Keep at most 4 toasts

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => addToast(title, message, 'success'), [addToast]);
  const error = useCallback((title: string, message?: string) => addToast(title, message, 'error'), [addToast]);
  const info = useCallback((title: string, message?: string) => addToast(title, message, 'info'), [addToast]);
  const warning = useCallback((title: string, message?: string) => addToast(title, message, 'warning'), [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info, warning }}>
      {children}
      {/* Toast container floating at top-right or bottom-right */}
      <aside aria-label="Notifications" className="fixed top-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map(t => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl glass-surface border border-white/10 shadow-2xl backdrop-blur-2xl animate-fade-up bg-white/80 dark:bg-[#151824]/90"
          >
            <div className="shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-accent-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{t.title}</h4>
              {t.message && (
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">{t.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </aside>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
