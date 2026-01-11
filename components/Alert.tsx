
import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

interface AlertOptions {
  title: string;
  message: string;
  variant?: AlertVariant;
  confirmText?: string;
  cancelText?: string;
}

interface AlertContextType {
  showConfirm: (options: AlertOptions) => Promise<boolean>;
  showAlert: (title: string, message: string) => Promise<void>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<AlertOptions>({ title: '', message: '' });
  const [isConfirmType, setIsConfirmType] = useState(true);
  
  // We use a ref to store the resolve function of the Promise
  const awaiter = useRef<(value: boolean) => void>(() => {});

  const showConfirm = useCallback((options: AlertOptions) => {
    setConfig({
      variant: 'warning',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      ...options,
    });
    setIsConfirmType(true);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      awaiter.current = resolve;
    });
  }, []);

  const showAlert = useCallback((title: string, message: string) => {
    setConfig({
      title,
      message,
      variant: 'info',
      confirmText: 'OK',
    });
    setIsConfirmType(false);
    setIsOpen(true);
    return new Promise<void>((resolve) => {
      awaiter.current = () => resolve();
    });
  }, []);

  const handleClose = (result: boolean) => {
    setIsOpen(false);
    if (awaiter.current) {
      awaiter.current(result);
    }
  };

  const icons = {
    info: <Info size={32} className="text-blue-500" />,
    success: <CheckCircle2 size={32} className="text-emerald-500" />,
    warning: <AlertTriangle size={32} className="text-amber-500" />,
    danger: <XCircle size={32} className="text-red-500" />,
  };

  const bgColors = {
    info: 'bg-blue-500/10 border-blue-500/20',
    success: 'bg-emerald-500/10 border-emerald-500/20',
    warning: 'bg-amber-500/10 border-amber-500/20',
    danger: 'bg-red-500/10 border-red-500/20',
  };

  const buttonColors = {
    info: 'bg-blue-500 hover:bg-blue-600',
    success: 'bg-emerald-500 hover:bg-emerald-600',
    warning: 'bg-amber-500 hover:bg-amber-600',
    danger: 'bg-red-500 hover:bg-red-600',
  };

  return (
    <AlertContext.Provider value={{ showConfirm, showAlert }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/10 animate-scale-in">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl border shrink-0 ${bgColors[config.variant || 'info']}`}>
                  {icons[config.variant || 'info']}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                    {config.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {config.message}
                  </p>
                </div>
                {!isConfirmType && (
                    <button onClick={() => handleClose(true)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X size={20} />
                    </button>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5 flex gap-3 justify-end">
              {isConfirmType && (
                <button
                  onClick={() => handleClose(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-sm"
                >
                  {config.cancelText}
                </button>
              )}
              <button
                onClick={() => handleClose(true)}
                className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 text-sm ${buttonColors[config.variant || 'info']}`}
              >
                {config.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
