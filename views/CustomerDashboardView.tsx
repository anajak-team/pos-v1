
import React, { useState } from 'react';
import { Customer, Transaction, RepairTicket, StoreSettings, User } from '../types';
import { Crown, Package, History, Wrench, LogOut, Receipt, Calendar, Smartphone, ShoppingBag, Clock, Store, ChevronRight, User as UserIcon, Moon, Sun, Globe, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { TRANSLATIONS } from '../translations';
import { Invoice } from '../components/Invoice';

interface CustomerDashboardProps {
  customer: Customer;
  currentUser: User;
  transactions: Transaction[];
  repairs: RepairTicket[];
  settings: StoreSettings;
  onLogout: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  onToggleLanguage: () => void;
  currentLanguage: string;
}

export const CustomerDashboardView: React.FC<CustomerDashboardProps> = ({ 
    customer, 
    currentUser, 
    transactions, 
    repairs, 
    settings, 
    onLogout,
    onToggleTheme,
    isDarkMode,
    onToggleLanguage,
    currentLanguage
}) => {
  const [viewTransaction, setViewTransaction] = useState<Transaction | null>(null);

  // Translation Helper
  const t = (key: keyof typeof TRANSLATIONS.en) => {
    // @ts-ignore
    return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS.en[key];
  };

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case 'en': return '🇺🇸';
      case 'km': return '🇰🇭';
      case 'zh': return '🇨🇳';
      default: return '🇺🇸';
    }
  };

  // Filter data for this customer
  const myTransactions = transactions.filter(t => t.customerId === customer.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const myRepairs = repairs.filter(r => r.customerId === customer.id).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const totalSpent = customer.totalSpent || 0;
  const points = customer.points || 0;

  const statusColors: Record<string, string> = {
    'Received': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'In Progress': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    'Waiting for Parts': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    'Ready': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'Completed': 'bg-slate-500/10 text-slate-600 border-slate-500/20',
    'Cancelled': 'bg-red-500/10 text-red-600 border-red-500/20',
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
        
        {/* Navbar */}
        <nav className="fixed w-full z-50 px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-white/5 transition-all">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Store size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none">{settings.storeName}</h1>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Member Portal</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onToggleLanguage} className="p-2 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-colors border border-slate-200 dark:border-white/10 shadow-sm">
                        <span className="text-lg leading-none">{getLanguageFlag(currentLanguage)}</span>
                    </button>
                    <button onClick={onToggleTheme} className="p-2 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-colors border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 shadow-sm">
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button onClick={onLogout} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm transition-colors border border-red-500/20 flex items-center gap-2">
                        <LogOut size={16} /> <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </div>
        </nav>

        <main className="flex-1 pt-24 pb-20 space-y-20">
            
            {/* 1. Earn Point Section (Hero) */}
            <section className="px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01] duration-500">
                        {/* Abstract blobs */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left space-y-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-2">
                                    <Crown size={14} className="fill-yellow-400 text-yellow-400" />
                                    Gold Member
                                </div>
                                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Hello, {currentUser.name}</h2>
                                <p className="text-indigo-100 text-lg max-w-md">Thank you for being a loyal customer. Here is your reward status.</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl min-w-[280px] text-center shadow-lg">
                                <p className="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-1">Available Points</p>
                                <div className="text-5xl font-black mb-2 drop-shadow-sm">{points.toLocaleString()}</div>
                                <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-yellow-400 w-3/4 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.6)]"></div>
                                </div>
                                <p className="text-xs text-indigo-100">Earn {settings.currency}1.00 = {settings.loyaltyRate} Points</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col items-center justify-center text-center">
                            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-full mb-2"><ShoppingBag size={20}/></div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{myTransactions.length}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Orders</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col items-center justify-center text-center">
                            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-full mb-2"><Receipt size={20}/></div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{settings.currency}{totalSpent.toLocaleString()}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Spent</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col items-center justify-center text-center">
                            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-full mb-2"><Wrench size={20}/></div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{myRepairs.length}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Repairs</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col items-center justify-center text-center">
                            <div className="p-3 bg-purple-500/10 text-purple-600 rounded-full mb-2"><Calendar size={20}/></div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : '-'}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Last Visit</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Product Buy History Section */}
            <section className="px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                            <History size={24} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Purchase History</h2>
                    </div>

                    {myTransactions.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-white/5 border-dashed">
                            <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No purchases yet</h3>
                            <p className="text-slate-500 dark:text-slate-400">Your order history will appear here once you make a purchase.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {myTransactions.map((t, idx) => (
                                <div 
                                    key={t.id} 
                                    onClick={() => setViewTransaction(t)}
                                    className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-xs group-hover:bg-blue-500/10 group-hover:text-blue-600 transition-colors">
                                            {new Date(t.date).getDate()}
                                            <span className="text-[9px] uppercase block -mt-1">{new Date(t.date).toLocaleDateString(undefined, {month:'short'})}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">Order #{t.id.slice(-6)}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{t.items.length} Items • {new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-100 dark:border-white/5 pt-3 md:pt-0">
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white">{settings.currency}{t.total.toLocaleString()}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase">{t.paymentMethod}</div>
                                        </div>
                                        <div className="bg-slate-100 dark:bg-white/10 p-2 rounded-full text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* 3. Product Repair Section */}
            <section className="px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
                            <Wrench size={24} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Repair Services</h2>
                    </div>

                    {myRepairs.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-white/5 border-dashed">
                            <Wrench className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No service records</h3>
                            <p className="text-slate-500 dark:text-slate-400">Repair tickets for your devices will be tracked here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {myRepairs.map((r) => (
                                <div key={r.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
                                    {/* Status Badge */}
                                    <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold uppercase border ${statusColors[r.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                        {r.status}
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ticket #{r.id.slice(-6).toUpperCase()}</div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{r.deviceName}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{r.issueDescription}</p>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 dark:text-slate-400">Created</span>
                                            <span className="font-medium text-slate-900 dark:text-slate-200">{new Date(r.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {r.serialNumber && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500 dark:text-slate-400">Serial No.</span>
                                                <span className="font-mono text-slate-900 dark:text-slate-200">{r.serialNumber}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-end mt-2">
                                            <span className="text-xs font-bold text-slate-400 uppercase">Est. Cost</span>
                                            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{settings.currency}{r.estimatedCost.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Progress Bar Visual */}
                                    <div className="h-1 w-full bg-slate-100 dark:bg-white/5 mt-4 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${
                                                r.status === 'Completed' ? 'bg-slate-500 w-full' :
                                                r.status === 'Ready' ? 'bg-emerald-500 w-11/12' :
                                                r.status === 'In Progress' ? 'bg-amber-500 w-1/2' :
                                                r.status === 'Waiting for Parts' ? 'bg-purple-500 w-2/3' :
                                                'bg-blue-500 w-1/4'
                                            }`}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-10 text-slate-400 text-sm">
                <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
            </footer>
        </main>

        {/* Invoice Modal for History */}
        {viewTransaction && (
            <Invoice 
                transaction={viewTransaction} 
                settings={settings} 
                onClose={() => setViewTransaction(null)} 
            />
        )}
    </div>
  );
};
