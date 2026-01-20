
import React, { useState } from 'react';
import { User, StoreSettings } from '../types';
import { Coins, ArrowRight, Wallet, Store, LogOut } from 'lucide-react';
import { TRANSLATIONS } from '../translations';

interface ShiftEntryModalProps {
  currentUser: User;
  onStartShift: (amount: number) => void;
  settings: StoreSettings;
  onLogout: () => void;
}

export const ShiftEntryModal: React.FC<ShiftEntryModalProps> = ({ currentUser, onStartShift, settings, onLogout }) => {
  const [amount, setAmount] = useState<string>('');

  // Translation Helper
  const t = (key: keyof typeof TRANSLATIONS.en) => {
    const lang = settings?.language || 'en';
    // @ts-ignore
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const floatAmount = parseFloat(amount);
    if (!isNaN(floatAmount)) {
      onStartShift(floatAmount);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white/60 dark:bg-black/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/40 dark:border-white/10 relative flex flex-col">
        
        <div className="p-8 text-center bg-gradient-to-br from-emerald-500/80 to-teal-600/80 text-white shrink-0 backdrop-blur-md border-b border-white/10">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/20">
            <Store size={32} className="text-white drop-shadow-sm" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight drop-shadow-md">{t('OPEN_SHOP')}</h1>
          <p className="text-emerald-50 text-sm mt-1 font-medium opacity-90">{t('START_SHIFT_MSG')}</p>
        </div>

        <div className="p-8 flex-1">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-6 p-4 bg-white/40 dark:bg-white/5 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm backdrop-blur-sm">
               <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-lg shadow-inner">
                  {currentUser.avatar || currentUser.name.charAt(0)}
               </div>
               <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">{t('SHIFT_MANAGER')}</p>
                  <p className="font-bold text-lg text-slate-800 dark:text-slate-100">{currentUser.name}</p>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2 uppercase tracking-wide">
                     <Wallet size={18} />
                     {t('OPENING_FLOAT')}
                  </label>
                  <div className="relative group">
                     <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">{settings.currency}</span>
                     <input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        required
                        autoFocus
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-12 pr-4 py-5 text-3xl font-bold text-center rounded-3xl bg-white/50 dark:bg-black/30 border-2 border-white/30 dark:border-white/10 text-slate-800 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-inner backdrop-blur-sm"
                     />
                  </div>
               </div>

               <button 
                  type="submit"
                  disabled={!amount}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-3xl font-bold text-xl shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md"
               >
                  <span>{t('START_SHIFT')}</span>
                  <ArrowRight size={24} />
               </button>
               
               <button 
                  type="button"
                  onClick={onLogout}
                  className="w-full bg-slate-500/10 hover:bg-slate-500/20 text-slate-600 dark:text-slate-300 dark:hover:text-slate-100 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-slate-500/10"
                >
                  <LogOut size={16} />
                  {t('LOGOUT')}
               </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
