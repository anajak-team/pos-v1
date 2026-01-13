
import React, { useState } from 'react';
import { ViewState, User } from '../types';
import { LayoutDashboard, ShoppingCart, Package, History, Settings, Truck, LogOut, Wallet, Receipt, BarChart3, Wrench, MoreHorizontal, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  storeName: string;
  onLogout: () => void;
  currentUser: User;
  onCloseShift: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, storeName, onLogout, currentUser, onCloseShift }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'POS', label: 'Register', icon: ShoppingCart },
    { id: 'DASHBOARD', label: 'Stats', icon: LayoutDashboard },
    { id: 'TRANSACTIONS', label: 'History', icon: History },
    { id: 'INVENTORY', label: 'Products', icon: Package },
    // Secondary Items
    { id: 'REPAIRS', label: 'Repairs', icon: Wrench },
    { id: 'PURCHASES', label: 'Stock In', icon: Truck },
    { id: 'EXPENSES', label: 'Expenses', icon: Receipt },
    { id: 'REPORTS', label: 'Reports', icon: BarChart3 },
  ];

  const primaryNavItems = navItems.slice(0, 4);
  const secondaryNavItems = navItems.slice(4);

  const handleNavigate = (view: ViewState) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen supports-[height:100dvh]:h-[100dvh] overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar for Desktop Only */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-20 transition-all duration-300">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
             <ShoppingCart className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate">{storeName}</h1>
        </div>
        
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentView === item.id
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-3 px-2">
             <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400">
                {currentUser.avatar || currentUser.name.charAt(0)}
             </div>
             <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{currentUser.name}</div>
                <div className="text-xs text-slate-500 truncate uppercase tracking-tighter font-bold">{currentUser.role}</div>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
             <button onClick={() => onNavigate('SETTINGS')} className="flex items-center justify-center p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                <Settings size={18} />
             </button>
             <button onClick={onLogout} className="flex items-center justify-center p-2.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                <LogOut size={18} />
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 h-16 pt-safe bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 z-30">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
                 <ShoppingCart className="text-white" size={16} />
             </div>
             <span className="font-bold text-slate-800 dark:text-slate-100 truncate">{storeName}</span>
           </div>
           <div className="flex items-center gap-2">
             <button onClick={onCloseShift} className="p-2 text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <Wallet size={20} />
             </button>
             <button onClick={() => onNavigate('SETTINGS')} className="p-2 text-slate-600 dark:text-slate-400">
               <Settings size={20} />
             </button>
           </div>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 no-scrollbar pb-24 md:pb-6 animate-view-fade-in relative z-0">
          {children}
        </div>

        {/* --- Android-style Bottom Navigation --- */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex justify-around items-center h-16 px-2">
            {primaryNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id as ViewState)}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all active:scale-90 ${
                  currentView === item.id 
                    ? 'text-primary' 
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${currentView === item.id ? 'bg-primary/10' : ''}`}>
                   <item.icon size={22} strokeWidth={currentView === item.id ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
              </button>
            ))}
            
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-400 dark:text-slate-500`}
            >
                <div className="p-1.5 rounded-xl">
                   <MoreHorizontal size={22} />
                </div>
                <span className="text-[10px] font-bold tracking-tight">More</span>
            </button>
          </div>
        </div>

        {/* Mobile More Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
            <div 
                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-[2.5rem] p-6 pb-safe border-t border-slate-200 dark:border-slate-800 shadow-2xl animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Quick Actions</h3>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        <X size={20} />
                    </button>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {secondaryNavItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigate(item.id as ViewState)}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                                currentView === item.id 
                                ? 'bg-primary text-white shadow-lg shadow-blue-500/20' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                                <item.icon size={24} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                {item.label}
                            </span>
                        </button>
                    ))}
                    <button
                        onClick={onLogout}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center">
                            <LogOut size={24} />
                        </div>
                        <span className="text-[10px] font-bold text-red-500">Log Out</span>
                    </button>
                </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
