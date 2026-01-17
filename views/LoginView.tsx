
import React, { useState } from 'react';
import { Store, Mail, Lock, ArrowRight, AlertCircle, Loader2, ShieldCheck, ChevronLeft, Check } from 'lucide-react';
import { User } from '../types';
import { getUsers } from '../services/storageService';

interface LoginViewProps {
  onLogin: (user: User, rememberMe: boolean) => void;
  onBack?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingPermissions, setCheckingPermissions] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setCheckingPermissions(false);

    // 1. Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // FIX: Await the promise returned by getUsers()
    const users = await getUsers();
    const account = users.find(acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password);

    if (account) {
      // 2. Simulate Checking Permissions / Claims
      setLoading(false);
      setCheckingPermissions(true);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Success - remove password before passing to app
      const { password: _, ...userProfile } = account;
      onLogin(userProfile, rememberMe);
    } else {
      setLoading(false);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/30 dark:bg-black/40 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/20 dark:border-white/10 relative flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-8 text-center bg-gradient-to-br from-blue-600/80 to-indigo-700/80 text-white shrink-0 backdrop-blur-md relative">
          {onBack && (
            <button 
              onClick={onBack}
              className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Back to Home"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg border border-white/20">
            <Store size={32} className="text-white drop-shadow-md" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight drop-shadow-sm">ANAJAK POS</h1>
          <p className="text-blue-100 text-sm mt-1 font-medium">Next Gen Store Management</p>
        </div>

        {/* Form Content */}
        <div className="p-8 flex-1">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Sign In</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">Access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
               <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase ml-2">Email Address</label>
               <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 transition-colors group-focus-within:text-primary" size={20} />
                  <input 
                    type="email" 
                    required
                    autoComplete="email"
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white/70 dark:focus:bg-black/40 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all backdrop-blur-sm shadow-inner"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
               </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase ml-2">Password</label>
               <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 transition-colors group-focus-within:text-primary" size={20} />
                  <input 
                    type="password" 
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white/70 dark:focus:bg-black/40 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all backdrop-blur-sm shadow-inner"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
               </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pl-1">
                <div className="relative flex items-center">
                    <input 
                        type="checkbox" 
                        id="rememberMe" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-black/20 checked:border-primary checked:bg-primary transition-all"
                    />
                    <Check size={14} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
                </div>
                <label htmlFor="rememberMe" className="text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                    Remember me
                </label>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-300 text-sm animate-fade-in backdrop-blur-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading || checkingPermissions}
              className="w-full bg-primary/90 hover:bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 backdrop-blur-md"
            >
              {checkingPermissions ? (
                <>
                  <ShieldCheck size={20} className="animate-pulse" />
                  <span>Verifying...</span>
                </>
              ) : loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Footer hint */}
        <div className="p-4 bg-white/20 dark:bg-black/20 border-t border-white/10 text-center backdrop-blur-md">
           <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <p className="font-bold mb-1">Default Admin:</p>
              <p><span className="font-mono bg-white/40 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200">admin@anajak.com</span> / <span className="font-mono bg-white/40 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200">password</span></p>
           </div>
        </div>
      </div>
    </div>
  );
};
