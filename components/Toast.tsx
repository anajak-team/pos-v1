import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 md:right-8 z-[100] flex flex-col gap-3 pointer-events-none w-full md:w-auto px-4 md:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg border pointer-events-auto transition-all animate-slide-up backdrop-blur-xl
              ${toast.type === 'success' ? 'bg-white/80 dark:bg-slate-800/80 border-green-500/20 text-slate-800 dark:text-slate-100' : ''}
              ${toast.type === 'error' ? 'bg-white/80 dark:bg-slate-800/80 border-red-500/20 text-slate-800 dark:text-slate-100' : ''}
              ${toast.type === 'info' ? 'bg-slate-900/80 dark:bg-slate-700/80 border-slate-500/20 text-white' : ''}
            `}
          >
            <div className={`p-1 rounded-full ${
                toast.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                toast.type === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                'bg-blue-500/20 text-blue-300'
            }`}>
                {toast.type === 'success' && <CheckCircle size={20} />}
                {toast.type === 'error' && <AlertCircle size={20} />}
                {toast.type === 'info' && <Info size={20} />}
            </div>
            <span className="text-sm font-bold flex-1">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="opacity-50 hover:opacity-100 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};