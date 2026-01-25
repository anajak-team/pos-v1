
import React, { useState } from 'react';
import { Store, ArrowRight, AlertCircle, Loader2, UserPlus, ChevronLeft, User, Phone, Mail, Lock } from 'lucide-react';
import { User as UserType, StoreSettings } from '../types';
import { registerCustomer } from '../services/storageService';
import { TRANSLATIONS } from '../translations';

interface SignUpViewProps {
  onSignUpSuccess: () => void;
  onBack: () => void;
  settings: StoreSettings | null;
}

export const SignUpView: React.FC<SignUpViewProps> = ({ onSignUpSuccess, onBack, settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Translation Helper
  const t = (key: keyof typeof TRANSLATIONS.en) => {
    const lang = settings?.language || 'en';
    // @ts-ignore
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
    }

    setLoading(true);

    try {
        await registerCustomer({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
        });
        
        setLoading(false);
        onSignUpSuccess();
    } catch (err: any) {
        setLoading(false);
        setError(err.message || 'Failed to create account');
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/30 dark:bg-black/40 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/20 dark:border-white/10 relative flex flex-col overflow-hidden my-auto shrink-0">
        
        {/* Header */}
        <div className="p-8 text-center bg-gradient-to-br from-emerald-600/80 to-teal-700/80 text-white shrink-0 backdrop-blur-md relative">
          <button 
            onClick={onBack}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Back to Login"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg border border-white/20">
            <UserPlus size={32} className="text-white drop-shadow-md" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight drop-shadow-sm">{t('CREATE_ACCOUNT')}</h1>
          <p className="text-emerald-100 text-sm mt-1 font-medium">{t('JOIN_REWARDS')}</p>
        </div>

        {/* Form Content */}
        <div className="p-8 flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
               <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase ml-2">{t('FULL_NAME')}</label>
               <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 transition-colors group-focus-within:text-emerald-500" size={18} />
                  <input 
                    name="name"
                    type="text" 
                    required
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white/70 dark:focus:bg-black/40 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all backdrop-blur-sm shadow-inner"
                    value={formData.name}
                    onChange={handleChange}
                  />
               </div>
            </div>

            <div className="space-y-1">
               <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase ml-2">{t('PHONE')}</label>
               <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 transition-colors group-focus-within:text-emerald-500" size={18} />
                  <input 
                    name="phone"
                    type="tel" 
                    required
                    placeholder="012 345 678"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white/70 dark:focus:bg-black/40 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all backdrop-blur-sm shadow-inner"
                    value={formData.phone}
                    onChange={handleChange}
                  />
               </div>
            </div>

            <div className="space-y-1">
               <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase ml-2">{t('EMAIL')}</label>
               <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 transition-colors group-focus-within:text-emerald-500" size={18} />
                  <input 
                    name="email"
                    type="email" 
                    required
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white/70 dark:focus:bg-black/40 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all backdrop-blur-sm shadow-inner"
                    value={formData.email}
                    onChange={handleChange}
                  />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase ml-2">{t('PASSWORD')}</label>
                   <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 transition-colors group-focus-within:text-emerald-500" size={18} />
                      <input 
                        name="password"
                        type="password" 
                        required
                        placeholder="••••••"
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white/70 dark:focus:bg-black/40 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all backdrop-blur-sm shadow-inner"
                        value={formData.password}
                        onChange={handleChange}
                      />
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase ml-2">{t('CONFIRM')}</label>
                   <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 transition-colors group-focus-within:text-emerald-500" size={18} />
                      <input 
                        name="confirmPassword"
                        type="password" 
                        required
                        placeholder="••••••"
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white/70 dark:focus:bg-black/40 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all backdrop-blur-sm shadow-inner"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                   </div>
                </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-300 text-sm animate-fade-in backdrop-blur-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 backdrop-blur-md"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : (
                <>
                  <span>{t('CREATE_ACCOUNT')}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
