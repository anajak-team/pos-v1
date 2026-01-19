
import React, { useState } from 'react';
import { ViewState, User } from '../types';
import { LayoutDashboard, ShoppingCart, Package, History, Settings, Truck, LogOut, Wallet, Receipt, BarChart3, Wrench, MoreHorizontal, X, Moon, Sun, Globe } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  storeName: string;
  onLogout: () => void;
  currentUser: User;
  onWalletClick: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  currentLanguage: string;
  onToggleLanguage: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, storeName, onLogout, currentUser, onWalletClick, isDarkMode, onToggleTheme, currentLanguage, onToggleLanguage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        DASHBOARD: 'Dashboard',
        POS: 'Register',
        TRANSACTIONS: 'History',
        INVENTORY: 'Products',
        REPAIRS: 'Repairs',
        PURCHASES: 'Purchases',
        EXPENSES: 'Expenses',
        REPORTS: 'Reports',
        SETTINGS: 'Settings',
        MORE: 'More',
        SHIFT_OPEN: 'Shift Open',
        LOGOUT: 'Logout'
      },
      km: {
        DASHBOARD: 'ផ្ទាំងគ្រប់គ្រង',
        POS: 'ការលក់',
        TRANSACTIONS: 'ប្រវត្តិ',
        INVENTORY: 'ទំនិញ',
        REPAIRS: 'ជួសជុល',
        PURCHASES: 'ការទិញចូល',
        EXPENSES: 'ចំណាយ',
        REPORTS: 'របាយការណ៍',
        SETTINGS: 'ការកំណត់',
        MORE: 'បន្ថែម',
        SHIFT_OPEN: 'បើកវេន',
        LOGOUT: 'ចាកចេញ'
      },
      zh: {
        DASHBOARD: '仪表板',
        POS: '收银台',
        TRANSACTIONS: '历史记录',
        INVENTORY: '库存',
        REPAIRS: '维修',
        PURCHASES: '采购',
        EXPENSES: '费用',
        REPORTS: '报表',
        SETTINGS: '设置',
        MORE: '更多',
        SHIFT_OPEN: '开班',
        LOGOUT: '退出'
      }
    };
    return translations[currentLanguage]?.[key] || translations['en'][key];
  };

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case 'en': return '🇺🇸';
      case 'km': return '🇰🇭';
      case 'zh': return '🇨🇳';
      default: return '🇺🇸';
    }
  };

  // Reordered for Priority: Top 4 go to bottom bar, rest go to "More" menu
  const navItems = [
    { id: 'DASHBOARD', label: t('DASHBOARD'), icon: LayoutDashboard },
    { id: 'POS', label: t('POS'), icon: ShoppingCart },
    { id: 'TRANSACTIONS', label: t('TRANSACTIONS'), icon: History },
    { id: 'INVENTORY', label: t('INVENTORY'), icon: Package },
    // Secondary Items
    { id: 'REPAIRS', label: t('REPAIRS'), icon: Wrench },
    { id: 'PURCHASES', label: t('PURCHASES'), icon: Truck },
    { id: 'EXPENSES', label: t('EXPENSES'), icon: Receipt },
    { id: 'REPORTS', label: t('REPORTS'), icon: BarChart3 },
  ];

  const primaryNavItems = navItems.slice(0, 4);
  const secondaryNavItems = navItems.slice(4);

  const isSecondaryActive = secondaryNavItems.some(item => item.id === currentView);

  const handleNavigate = (view: ViewState) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen supports-[height:100dvh]:h-[100dvh] overflow-hidden bg-transparent">
      {/* Sidebar for Desktop - Glass Effect - COMPACT WIDTH w-60 */}
      <aside className="hidden md:flex flex-col w-60 bg-white/40 dark:bg-slate-900/60 backdrop-blur-2xl border-r border-white/20 dark:border-white/5 z-20 transition-all duration-300">
        <div className="p-5 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/90 backdrop-blur-md rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
             <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight truncate drop-shadow-sm" title={storeName}>{storeName}</h1>
        </div>
        
        <nav className="flex-1 px-2 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm ${
                currentView === item.id
                  ? 'bg-white/60 dark:bg-white/10 text-primary font-bold shadow-md border border-white/40 dark:border-white/10 backdrop-blur-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <item.icon size={18} strokeWidth={currentView === item.id ? 2.5 : 2} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/20 dark:border-white/5 space-y-3 bg-white/10 dark:bg-black/20 backdrop-blur-md">
          {/* User Profile */}
          <div className="flex items-center gap-2 px-1 justify-between">
             <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                    {currentUser.avatar || currentUser.name.charAt(0)}
                </div>
                <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
                    {t('SHIFT_OPEN')}
                    </div>
                </div>
             </div>
             <button 
                onClick={onToggleLanguage}
                className="p-1.5 rounded-lg bg-white/20 dark:bg-white/5 hover:bg-white/30 transition-colors border border-white/10 w-8 h-8 flex items-center justify-center shadow-sm"
                title="Switch Language"
             >
                <span className="text-lg leading-none">{getLanguageFlag(currentLanguage)}</span>
             </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button 
              onClick={onToggleTheme}
              className="col-span-1 flex flex-col items-center justify-center p-2 rounded-lg bg-white/20 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-white/30 transition-colors border border-white/10"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button 
              onClick={onWalletClick}
              className="col-span-1 flex flex-col items-center justify-center p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors border border-amber-500/20"
              title="Shift Wallet"
            >
              <Wallet size={16} />
            </button>
            <button 
              onClick={() => onNavigate('SETTINGS')}
              className={`col-span-1 flex flex-col items-center justify-center p-2 rounded-lg transition-colors border ${
                currentView === 'SETTINGS' 
                  ? 'bg-white/50 dark:bg-white/10 text-slate-900 dark:text-slate-100 border-white/40' 
                  : 'bg-white/20 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-white/10 hover:bg-white/30'
              }`}
              title={t('SETTINGS')}
            >
              <Settings size={16} />
            </button>
            <button 
              onClick={onLogout}
              className="col-span-1 flex flex-col items-center justify-center p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors border border-red-500/20"
              title={t('LOGOUT')}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header - Glass - SUPER COMPACT */}
        <div className="md:hidden h-auto min-h-12 pt-[env(safe-area-inset-top)] flex items-center justify-between px-3 py-1.5 shrink-0 z-30 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/20 dark:border-white/10">
           <div className="flex items-center gap-2 overflow-hidden">
             <div className="w-7 h-7 bg-primary/90 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0 shadow-lg">
                 <span className="text-white font-bold text-sm">A</span>
             </div>
             <span className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate drop-shadow-sm">{storeName}</span>
           </div>
           <div className="flex items-center gap-1.5">
             <button onClick={onToggleLanguage} className="p-1.5 bg-white/30 dark:bg-white/10 hover:bg-white/40 rounded-lg transition-colors border border-white/20 w-8 h-8 flex items-center justify-center shadow-sm">
               <span className="text-lg leading-none">{getLanguageFlag(currentLanguage)}</span>
             </button>
             <button onClick={onToggleTheme} className="p-1.5 text-slate-600 dark:text-slate-300 bg-white/30 dark:bg-white/10 hover:bg-white/40 rounded-lg transition-colors border border-white/20">
               {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
             </button>
             <button onClick={onWalletClick} className="p-1.5 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors border border-amber-500/10">
                <Wallet size={16} />
             </button>
             <button onClick={() => onNavigate('SETTINGS')} className="p-1.5 text-slate-600 dark:text-slate-400 bg-white/30 dark:bg-white/10 hover:bg-white/40 rounded-lg transition-colors border border-white/20">
               <Settings size={16} />
             </button>
             <button onClick={onLogout} className="p-1.5 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/10">
               <LogOut size={16} />
             </button>
           </div>
        </div>

        {/* Content Scroll Area - COMPACT PADDING */}
        <div key={currentView} className="flex-1 overflow-y-auto overflow-x-hidden p-2 md:p-4 no-scrollbar pb-24 md:pb-4 animate-view-fade-in relative z-0">
          {children}
        </div>

        {/* --- Mobile Navigation --- */}
        
        {/* "More" Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute inset-0 z-40 flex flex-col justify-end bg-black/20 backdrop-blur-[2px]" onClick={() => setIsMobileMenuOpen(false)}>
            <div 
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-t-[2rem] p-6 pb-28 border-t border-white/20 dark:border-white/10 shadow-2xl animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{t('MORE')}</h3>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500">
                        <X size={18} />
                    </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {secondaryNavItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigate(item.id as ViewState)}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className={`p-4 rounded-2xl transition-all ${
                                currentView === item.id 
                                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                                : 'bg-white/50 dark:bg-white/5 text-slate-600 dark:text-slate-300 group-active:scale-95'
                            }`}>
                                <item.icon size={24} />
                            </div>
                            <span className={`text-[10px] font-bold ${currentView === item.id ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
          </div>
        )}

        {/* Mobile Bottom Bar */}
        <div className="md:hidden absolute bottom-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-t border-white/30 dark:border-white/10 pb-[env(safe-area-inset-bottom)]">
          <div className="flex justify-around items-center h-[60px] px-2 relative">
            {primaryNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id as ViewState)}
                className={`flex flex-col items-center justify-center w-full h-full rounded-xl transition-all active:scale-95 ${
                  currentView === item.id 
                    ? 'text-primary' 
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <div className={`p-1.5 rounded-xl mb-0.5 transition-all duration-300 ${currentView === item.id ? 'bg-white/80 dark:bg-white/10 shadow-sm translate-y-[-2px]' : ''}`}>
                   <item.icon size={20} className={currentView === item.id ? "fill-current opacity-100" : ""} strokeWidth={2.5} />
                </div>
                <span className={`text-[9px] font-bold leading-none ${currentView === item.id ? 'opacity-100' : 'opacity-70'}`}>{item.label}</span>
              </button>
            ))}
            
            {/* More Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`flex flex-col items-center justify-center w-full h-full rounded-xl transition-all active:scale-95 ${
                  isSecondaryActive || isMobileMenuOpen
                    ? 'text-primary' 
                    : 'text-slate-400 dark:text-slate-500'
                }`}
            >
                <div className={`p-1.5 rounded-xl mb-0.5 transition-all duration-300 ${isSecondaryActive || isMobileMenuOpen ? 'bg-white/80 dark:bg-white/10 shadow-sm translate-y-[-2px]' : ''}`}>
                   <MoreHorizontal size={20} strokeWidth={2.5} />
                </div>
                <span className={`text-[9px] font-bold leading-none ${isSecondaryActive || isMobileMenuOpen ? 'opacity-100' : 'opacity-70'}`}>{t('MORE')}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
