
import React, { useState } from 'react';
import { Store, ArrowRight, ShoppingCart, BarChart3, Wrench, ShieldCheck, Zap, Package, Globe, Gift, Search, Loader2, Check, ExternalLink, Play, Building, ArrowLeft, CreditCard, Lock, Mail, User as UserIcon, X, Tag, Box, Crown, LogOut, ChevronRight, Receipt, Calendar, ShoppingBag, History, Settings, Sliders, LayoutGrid, Rocket, QrCode, Languages } from 'lucide-react';
import { StoreSettings, LandingPageSection, Product, RepairTicket, User, Customer, Transaction } from '../types';
import { getRepairs } from '../services/storageService';
import { Invoice } from '../components/Invoice';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
  settings?: StoreSettings | null;
  products?: Product[];
  currentUser?: User;
  customerData?: Customer;
  transactions?: Transaction[];
  repairs?: RepairTicket[];
  onLogout?: () => void;
}

const ICON_MAP: Record<string, any> = {
    ShoppingCart,
    Package,
    BarChart3,
    Wrench,
    Zap,
    ShieldCheck,
    Globe,
    Store,
    Gift,
    Settings,
    Sliders,
    LayoutGrid,
    Rocket,
    QrCode,
    Languages
};

interface HeroSectionProps {
  content: any;
  onGetStarted: () => void;
  onViewDemo: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ content, onGetStarted, onViewDemo }) => {
    const layout = content.layout || 'centered';

    // Shared Button Group
    const Buttons = () => (
        <div className={`flex flex-col sm:flex-row gap-4 animate-fade-in-up ${layout === 'centered' ? 'justify-center' : 'justify-start'}`} style={{ animationDelay: '0.3s' }}>
            {content.ctaPrimaryLink ? (
              <a 
                href={content.ctaPrimaryLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {content.ctaPrimary} <ArrowRight size={20} />
              </a>
            ) : (
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {content.ctaPrimary} <ArrowRight size={20} />
              </button>
            )}
            
            {content.ctaSecondaryLink ? (
              <a 
                href={content.ctaSecondaryLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80 text-slate-800 dark:text-white rounded-2xl font-bold text-lg border border-white/40 dark:border-white/10 transition-all backdrop-blur-md flex items-center justify-center gap-2"
              >
                {content.ctaSecondary || 'Learn More'} <ExternalLink size={18} />
              </a>
            ) : (
              <button 
                onClick={onViewDemo}
                className="w-full sm:w-auto px-8 py-4 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80 text-slate-800 dark:text-white rounded-2xl font-bold text-lg border border-white/40 dark:border-white/10 transition-all backdrop-blur-md flex items-center justify-center gap-2"
              >
                {content.ctaSecondary || 'View Demo'} {!content.ctaSecondary && <Play size={18} fill="currentColor" className="opacity-80" />}
              </button>
            )}
        </div>
    );

    // Layout 1: Centered (Default)
    if (layout === 'centered') {
        return (
            <header className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                  {content.badge && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wide mb-6 border border-blue-500/20 animate-fade-in-up backdrop-blur-sm">
                        <Zap size={14} className="fill-current" />
                        {content.badge}
                    </div>
                  )}
                  
                  <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {content.title} <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{content.titleGradient}</span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {content.subtitle}
                  </p>
                  
                  <Buttons />
                </div>

                {/* Abstract Background Blobs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] -z-10 animate-blob mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] -z-10 animate-blob mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '2s' }}></div>
            </header>
        );
    }

    // Layout 2: Split (Text Left / Visual Right)
    if (layout === 'split') {
        return (
            <header className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        {content.badge && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wide mb-6 border border-blue-500/20 animate-fade-in-up backdrop-blur-sm">
                                <Zap size={14} className="fill-current" />
                                {content.badge}
                            </div>
                        )}
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            {content.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{content.titleGradient}</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            {content.subtitle}
                        </p>
                        <Buttons />
                    </div>
                    
                    {/* Visual Placeholder */}
                    <div className="relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-30 transform rotate-6 scale-90"></div>
                        <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-700">
                            {/* Mock UI */}
                            <div className="flex gap-4 mb-6">
                                <div className="w-1/3 h-24 bg-white/50 dark:bg-white/10 rounded-2xl animate-pulse"></div>
                                <div className="w-1/3 h-24 bg-white/50 dark:bg-white/10 rounded-2xl animate-pulse delay-75"></div>
                                <div className="w-1/3 h-24 bg-white/50 dark:bg-white/10 rounded-2xl animate-pulse delay-150"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-8 bg-white/50 dark:bg-white/10 rounded-xl w-3/4"></div>
                                <div className="h-4 bg-white/30 dark:bg-white/5 rounded-full w-full"></div>
                                <div className="h-4 bg-white/30 dark:bg-white/5 rounded-full w-5/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    // Layout 3: Minimal (No blobs, high contrast)
    if (layout === 'minimal') {
        return (
            <header className="relative pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                  <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-slate-900 dark:text-white animate-fade-in-up">
                    {content.title} <span className="text-slate-400 dark:text-slate-600">{content.titleGradient}</span>
                  </h1>
                  
                  <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto font-medium animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {content.subtitle}
                  </p>
                  
                  <Buttons />
                </div>
            </header>
        );
    }

    return null;
};

interface CustomerDashboardSectionProps {
  currentUser: User;
  customerData: Customer;
  settings: StoreSettings;
  transactions: Transaction[];
  repairs: RepairTicket[];
  content: any;
  onViewTransaction: (t: Transaction) => void;
}

const CustomerDashboardSection: React.FC<CustomerDashboardSectionProps> = ({ currentUser, customerData, settings, transactions, repairs, content, onViewTransaction }) => {
    const totalSpent = customerData.totalSpent || 0;
    const points = customerData.points || 0;
    const orderCount = transactions ? transactions.length : 0;
    
    // Filter repairs strictly for this customer
    const myRepairs = repairs ? repairs.filter(r => r.customerId === customerData.id) : [];
    
    // For dashboard view, generally show active ones or recently updated
    const activeRepairs = myRepairs.filter(r => r.status !== 'Completed' && r.status !== 'Cancelled');

    const statusColors: Record<string, string> = {
        'Received': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        'In Progress': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        'Waiting for Parts': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
        'Ready': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        'Completed': 'bg-slate-500/10 text-slate-600 border-slate-500/20',
        'Cancelled': 'bg-red-500/10 text-red-600 border-red-500/20',
    };

    return (
        <section className="py-12 px-6">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header / Points */}
                <div className="relative bg-gradient-to-r from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01] duration-500">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-2">
                                <Crown size={14} className="fill-yellow-400 text-yellow-400" />
                                {content.title || 'Your Dashboard'}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Welcome, {currentUser.name}</h2>
                            <p className="text-indigo-100 text-lg max-w-md">{content.subtitle || 'Track your points, orders, and repairs.'}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl min-w-[200px] text-center shadow-lg">
                                <p className="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-1">{content.pointsLabel || 'Loyalty Points'}</p>
                                <div className="text-4xl font-black mb-1 drop-shadow-sm flex items-center justify-center gap-2">
                                    <Crown size={28} className="text-yellow-400 fill-yellow-400"/>
                                    {points.toLocaleString()}
                                </div>
                                <p className="text-xs text-indigo-100">Worth {settings.currency}{(points * (1/100)).toFixed(2)}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl min-w-[200px] text-center shadow-lg">
                                <p className="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-1">{content.spentLabel || 'Lifetime Spent'}</p>
                                <div className="text-4xl font-black mb-1 drop-shadow-sm">{settings.currency}{totalSpent.toLocaleString()}</div>
                                <p className="text-xs text-indigo-100">{orderCount} Orders</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Purchase History */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                                <History size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{content.recentPurchasesTitle || 'Recent Purchases'}</h3>
                        </div>
                        {transactions.length === 0 ? (
                            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/40 dark:border-white/10 border-dashed">
                                <ShoppingBag className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600 mb-2" />
                                <p className="text-slate-500 dark:text-slate-400 text-sm">No purchase history yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {transactions.slice(0, 3).map((t) => (
                                    <div 
                                        key={t.id} 
                                        onClick={() => onViewTransaction(t)}
                                        className="group bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all cursor-pointer flex items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-xs group-hover:bg-blue-500/10 group-hover:text-blue-600 transition-colors">
                                                {new Date(t.date).getDate()}
                                                <span className="text-[9px] uppercase block -mt-1">{new Date(t.date).toLocaleDateString(undefined, {month:'short'})}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Order #{t.id.slice(-6)}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{t.items.length} Items • {new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-slate-900 dark:text-white">{settings.currency}{t.total.toLocaleString()}</span>
                                            <ChevronRight size={16} className="text-slate-400"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Repair Status */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
                                <Wrench size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{content.repairsTitle || 'My Repairs'}</h3>
                        </div>
                        {activeRepairs.length === 0 ? (
                            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/40 dark:border-white/10 border-dashed">
                                <Check size={40} className="mx-auto text-emerald-500 mb-2 opacity-50" />
                                <p className="text-slate-500 dark:text-slate-400 text-sm">No active repairs.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activeRepairs.map((r) => (
                                    <div key={r.id} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{r.deviceName}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Ticket #{r.id.slice(-6).toUpperCase()}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold border ${statusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>
                                                {r.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mb-2">{r.issueDescription}</p>
                                        <div className="h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
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
                </div>
            </div>
        </section>
    );
}

// Helper for Features
interface FeatureCardProps {
  iconName: string;
  title: string;
  desc: string;
  color: string;
  layout?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ iconName, title, desc, color, layout = 'grid' }) => {
  const Icon = ICON_MAP[iconName] || Package;
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-600',
    emerald: 'bg-emerald-500/10 text-emerald-600',
    purple: 'bg-purple-500/10 text-purple-600',
    amber: 'bg-amber-500/10 text-amber-600',
    red: 'bg-red-500/10 text-red-600',
  };

  if (layout === 'list') {
      return (
        <div className="flex gap-6 p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl shadow-sm border border-white/40 dark:border-white/10 hover:border-blue-500/30 transition-all items-start group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${colorClasses[color] || 'bg-red-50 text-red-600 border border-red-100'} group-hover:scale-110 transition-transform duration-300 shadow-sm backdrop-blur-sm bg-white/80 dark:bg-slate-800/80`}>
                <Icon size={28} strokeWidth={2} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
        </div>
      );
  }

  if (layout === 'minimal') {
      return (
        <div className="text-center p-4">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 text-slate-900 dark:text-white bg-white/20 dark:bg-white/5 backdrop-blur-sm shadow-sm`}>
                <Icon size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
        </div>
      );
  }

  // Grid (Default)
  return (
    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/40 dark:border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[color] || 'bg-red-50 text-red-600 border border-red-100'} group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm bg-white/80 dark:bg-slate-800/80`}>
        <Icon size={24} strokeWidth={2} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
};

// Updated FeaturesSection with Layouts
interface FeaturesSectionProps {
  content: any;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ content }) => {
    const layout = content.layout || 'grid';

    return (
        <section className="py-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {layout === 'list' ? (
                    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                        {(content.items || []).map((item: any, i: number) => (
                            <FeatureCard 
                                key={i}
                                iconName={item.icon} 
                                title={item.title} 
                                desc={item.desc}
                                color={item.color || 'red'}
                                layout="list"
                            />
                        ))}
                    </div>
                ) : layout === 'minimal' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
                        {(content.items || []).map((item: any, i: number) => (
                            <FeatureCard 
                                key={i}
                                iconName={item.icon} 
                                title={item.title} 
                                desc={item.desc}
                                color={item.color || 'red'}
                                layout="minimal"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-6">
                        {(content.items || []).map((item: any, i: number) => (
                            <div key={i} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] flex-grow-0">
                                <FeatureCard 
                                    iconName={item.icon} 
                                    title={item.title} 
                                    desc={item.desc}
                                    color={item.color || 'red'}
                                    layout="grid"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

// Updated VideoSection with Layout Options
interface VideoSectionProps {
    content: any;
}

const VideoSection: React.FC<VideoSectionProps> = ({ content }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    
    // Default to classic if undefined
    const layout = content.layout || 'classic'; 

    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        const youtubeWatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
        if (youtubeWatch && youtubeWatch[1]) return `https://www.youtube.com/embed/${youtubeWatch[1]}`;
        const vimeo = url.match(/vimeo\.com\/(\d+)/);
        if (vimeo && vimeo[1]) return `https://player.vimeo.com/video/${vimeo[1]}`;
        return url;
    };

    const embedUrl = getEmbedUrl(content.videoUrl);
    const videoId = embedUrl.split('/').pop()?.split('?')[0];

    const VideoPlayer = () => (
        <div className={`relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video group border border-white/20 dark:border-white/10 ${layout === 'minimal' ? 'w-full max-w-4xl mx-auto' : 'w-full'}`}>
            {!isPlaying ? (
                <div 
                    className="absolute inset-0 bg-cover bg-center cursor-pointer"
                    style={{ backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)` }}
                    onClick={() => setIsPlaying(true)}
                >
                    <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors flex flex-col justify-between p-6 md:p-10">
                        <div className="text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Red.Box Menu</div>
                            </div>
                            <h3 className="font-bold text-2xl md:text-3xl leading-tight mb-2 drop-shadow-md">{content.overlayTitle || 'What is Redbox Menu?'}</h3>
                            <p className="text-white/90 text-lg font-kantumruy leading-relaxed max-w-md drop-shadow-sm font-medium">
                                {content.overlaySubtitle}
                            </p>
                        </div>
                        
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-600/40 group-hover:scale-110 transition-transform duration-300">
                                <Play size={32} fill="white" className="text-white ml-1" />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <div className="bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold hover:bg-black transition-colors pointer-events-auto border border-white/10 shadow-lg">
                                <span className="opacity-80">Watch on</span> 
                                <div className="flex items-center gap-1"><Play size={12} fill="white"/> YouTube</div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <iframe 
                    src={`${embedUrl}?autoplay=1`} 
                    title="Video Showcase"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
            )}
        </div>
    );

    const renderFeature = (feature: any, idx: number, type: 'list' | 'grid' | 'row' | 'card') => {
        const Icon = ICON_MAP[feature.icon] || Settings;
        
        if (type === 'card') {
            return (
                <div key={idx} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/40 dark:border-white/10 hover:shadow-lg transition-all duration-300 flex flex-col items-start gap-4 h-full">
                    <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl w-fit backdrop-blur-sm">
                        <Icon size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{feature.title}</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                </div>
            )
        }

        if (type === 'list') {
            return (
                <div key={idx} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/40 dark:border-white/10 hover:shadow-lg transition-all duration-300 group">
                    <div className="w-12 h-12 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center justify-center mb-4 text-red-600 bg-white dark:bg-white/5 shadow-sm group-hover:scale-110 transition-transform backdrop-blur-sm">
                        <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">{feature.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
            );
        } else if (type === 'grid') {
            return (
                <div key={idx} className="flex flex-col gap-3 p-5 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/60 dark:hover:bg-slate-800 transition-colors">
                    <div className="p-3 bg-red-100/50 dark:bg-red-900/20 text-red-600 w-fit rounded-xl backdrop-blur-sm">
                        <Icon size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">{feature.title}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{feature.desc}</p>
                    </div>
                </div>
            );
        } else {
            // Row / Minimal
            return (
                <div key={idx} className="flex-1 min-w-[250px] p-4 text-center">
                    <div className="mx-auto w-10 h-10 bg-white/30 dark:bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 mb-3 border border-white/10">
                        <Icon size={18} />
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{feature.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{feature.desc}</p>
                </div>
            )
        }
    };

    return (
        <section className="py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    {content.title && <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">{content.title}</h2>}
                    {content.subtitle && <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">{content.subtitle}</p>}
                </div>

                {/* 1. Classic: Video Left (Large), List Right */}
                {layout === 'classic' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        <div className="lg:col-span-2"><VideoPlayer /></div>
                        <div className="flex flex-col gap-4">
                            {content.features?.map((f: any, i: number) => renderFeature(f, i, 'list'))}
                        </div>
                    </div>
                )}

                {/* 2. Reversed: Video Right (Large), List Left */}
                {layout === 'reversed' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        <div className="flex flex-col gap-4 lg:order-1 order-2">
                            {content.features?.map((f: any, i: number) => renderFeature(f, i, 'list'))}
                        </div>
                        <div className="lg:col-span-2 lg:order-2 order-1"><VideoPlayer /></div>
                    </div>
                )}

                {/* 3. Cinematic (Full): Video Top (Full), Grid Bottom */}
                {layout === 'full' && (
                    <div className="flex flex-col gap-12">
                        <VideoPlayer />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {content.features?.map((f: any, i: number) => renderFeature(f, i, 'grid'))}
                        </div>
                    </div>
                )}

                {/* 4. Modern: Video Left (50%), Grid Right (2 cols) */}
                {layout === 'modern' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div className="h-full"><VideoPlayer /></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {content.features?.map((f: any, i: number) => renderFeature(f, i, 'grid'))}
                        </div>
                    </div>
                )}

                {/* 5. Minimal: Video Centered, Row Bottom */}
                {layout === 'minimal' && (
                    <div className="flex flex-col gap-12 items-center">
                        <VideoPlayer />
                        <div className="flex flex-wrap justify-center gap-8 w-full border-t border-slate-100 dark:border-white/5 pt-8">
                            {content.features?.map((f: any, i: number) => renderFeature(f, i, 'row'))}
                        </div>
                    </div>
                )}

                {/* 6. Mixed: Video Left (2/3), 3 Features Right (1/3), Rest Bottom (2 features) */}
                {layout === 'mixed' && (
                    <div className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            <div className="lg:col-span-2"><VideoPlayer /></div>
                            <div className="flex flex-col gap-4 h-full justify-center">
                                {content.features?.slice(0, 3).map((f: any, i: number) => renderFeature(f, i, 'list'))}
                            </div>
                        </div>
                        {content.features?.length > 3 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                {content.features?.slice(3).map((f: any, i: number) => renderFeature(f, i + 3, 'grid'))}
                            </div>
                        )}
                    </div>
                )}

                {/* 7. Mixed 2 Right / 3 Bottom: Video Left (2/3), 2 Features Right (1/3), 3 Bottom (Grid) */}
                {layout === 'mixed_2r_3b' && (
                    <div className="flex flex-col gap-12">
                        {/* Top: Video Left (2/3) + 2 Cards Right (1/3) */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 h-full"><VideoPlayer /></div>
                            <div className="flex flex-col gap-6">
                                {content.features?.slice(0, 2).map((f: any, i: number) => renderFeature(f, i, 'card'))}
                            </div>
                        </div>
                        {/* Bottom: 3 Cards Grid */}
                        {content.features?.length > 2 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                                {content.features?.slice(2).map((f: any, i: number) => renderFeature(f, i + 2, 'card'))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

// ... UsersSection ... (keep as is)
interface UsersSectionProps {
    content: any;
}

const UsersSection: React.FC<UsersSectionProps> = ({ content }) => {
    const layout = content.layout || 'row';

    return (
        <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto text-center">
                {content.title && <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-10 uppercase tracking-wide opacity-80">{content.title}</h2>}
                
                {/* Layout 1: Row (Default) */}
                {layout === 'row' && (
                    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                        {(content.users || []).map((user: any, index: number) => (
                            <div key={index} className="flex flex-col items-center gap-3 group">
                                <div className="w-24 h-24 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-sm border border-white/40 dark:border-white/10 flex items-center justify-center p-4 transition-transform hover:scale-110 duration-300">
                                    {user.logo ? (
                                        <img src={user.logo} alt={user.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100" />
                                    ) : (
                                        <Building size={32} className="text-slate-400 group-hover:text-primary transition-colors" />
                                    )}
                                </div>
                                <span className="font-bold text-slate-500 dark:text-slate-400 text-sm group-hover:text-primary transition-colors">{user.name}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Layout 2: Grid */}
                {layout === 'grid' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {(content.users || []).map((user: any, index: number) => (
                            <div key={index} className="flex flex-col items-center p-4 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/40 dark:border-white/10 hover:border-primary/50 transition-colors">
                                <div className="w-12 h-12 mb-3 flex items-center justify-center text-slate-400">
                                    {user.logo ? <img src={user.logo} alt={user.name} className="w-full h-full object-contain" /> : <Building size={24} />}
                                </div>
                                <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">{user.name}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Layout 3: Cards */}
                {layout === 'cards' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(content.users || []).map((user: any, index: number) => (
                            <div key={index} className="flex items-center gap-4 p-5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-sm border border-white/40 dark:border-white/5 hover:shadow-md transition-all text-left">
                                <div className="w-16 h-16 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                                    {user.logo ? <img src={user.logo} alt={user.name} className="w-full h-full object-contain" /> : <Building size={28} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Trusted Partner</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

// ... PreviewSection ... (keep as is)
interface PreviewSectionProps {
  content: any;
  products: Product[];
  settings: StoreSettings | null | undefined;
}

const ProductDetailsModal = ({ product, onClose, currency }: { product: Product, onClose: () => void, currency: string }) => {
    if (!product) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl w-full max-w-lg border border-white/20 dark:border-white/10 overflow-hidden relative flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/10 dark:bg-white/10 rounded-full text-slate-600 dark:text-slate-300 hover:bg-black/20 dark:hover:bg-white/20 transition-colors">
                    <X size={20} />
                </button>

                {/* Product Image */}
                <div className="h-64 sm:h-72 w-full bg-slate-100 dark:bg-slate-950 relative shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-4 left-4 flex gap-2">
                        <span className="px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs font-bold shadow-sm flex items-center gap-1.5">
                            <Tag size={14} className="text-primary"/> {product.category}
                        </span>
                        {product.stock > 0 ? (
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold shadow-sm flex items-center gap-1.5">
                                <Box size={14} /> In Stock: {product.stock}
                            </span>
                        ) : (
                            <span className="px-3 py-1.5 rounded-xl bg-red-500/90 backdrop-blur-md text-white text-xs font-bold shadow-sm">
                                Out of Stock
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 overflow-y-auto">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{product.name}</h2>
                        <span className="text-2xl font-extrabold text-primary shrink-0 ml-4">{currency}{product.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h4>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                {product.description || 'No description available for this product.'}
                            </p>
                        </div>
                        
                        {product.barcode && (
                            <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Item Code</span>
                                <span className="font-mono text-sm font-medium text-slate-700 dark:text-slate-300">{product.barcode}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/20">
                    <button onClick={onClose} className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-blue-600 transition-colors">
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

const PreviewSection: React.FC<PreviewSectionProps> = ({ content, products, settings }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Extract unique categories
    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
    <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto bg-white/30 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 dark:border-white/10 shadow-2xl p-6 md:p-10 transition-transform duration-700">
           <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-4 border border-white/20 shadow-sm">
                  <Store size={24} className="text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">{content.title || 'Live Inventory'}</h2>
              <p className="text-slate-600 dark:text-slate-400">Real-time availability from our showroom</p>
           </div>

           {/* Search and Filters */}
           <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
                <div className="relative w-full max-w-xs md:max-w-sm group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/10 focus:bg-white/80 dark:focus:bg-slate-800/80 focus:border-primary/50 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 shadow-sm"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25' : 'bg-white/40 dark:bg-white/5 border-white/20 text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
           </div>

           {filteredProducts.length === 0 ? (
               <div className="text-center py-20 opacity-50">
                   <Package size={48} className="mx-auto mb-2"/>
                   <p>No products found matching your search</p>
               </div>
           ) : (
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.slice(0, 12).map(product => (
                      <div 
                        key={product.id} 
                        onClick={() => setSelectedProduct(product)}
                        className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl p-3 shadow-sm border border-white/40 dark:border-white/10 flex flex-col group hover:shadow-md transition-all cursor-pointer"
                      >
                          <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-900">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              <div className="absolute top-2 right-2">
                                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-sm ${product.stock > 0 ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                                  </span>
                              </div>
                          </div>
                          <div className="mt-auto">
                              <div className="mb-1.5">
                                  <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wide">
                                      {product.category}
                                  </span>
                              </div>
                              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate mb-1" title={product.name}>{product.name}</h3>
                              <div className="flex items-center justify-between">
                                  <span className="font-bold text-primary">{settings?.currency || '$'}{product.price.toFixed(2)}</span>
                              </div>
                          </div>
                      </div>
                  ))}
               </div>
           )}
        </div>
        
        {/* Product Details Modal */}
        {selectedProduct && (
            <ProductDetailsModal 
                product={selectedProduct} 
                onClose={() => setSelectedProduct(null)} 
                currency={settings?.currency || '$'} 
            />
        )}
    </section>
    );
};

interface RepairSectionProps {
    content: any;
}

const RepairSection: React.FC<RepairSectionProps> = ({ content }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RepairTicket | null>(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        
        setLoading(true);
        setSearched(true);
        setResult(null);

        // Fetch all repairs and filter locally (simulated API search)
        try {
            const repairs = await getRepairs();
            // Search by ID (last 6 chars or full) or Phone
            const found = repairs.find(r => 
                r.id.toLowerCase().endsWith(query.toLowerCase()) || 
                r.customerPhone.includes(query)
            );
            
            // Artificial delay for effect
            setTimeout(() => {
                setResult(found || null);
                setLoading(false);
            }, 800);
        } catch (error) {
            setLoading(false);
        }
    };

    const statusColors: Record<string, string> = {
        'Received': 'bg-blue-500/10 text-blue-600',
        'In Progress': 'bg-amber-500/10 text-amber-600',
        'Waiting for Parts': 'bg-purple-500/10 text-purple-600',
        'Ready': 'bg-emerald-500/10 text-emerald-600',
        'Completed': 'bg-slate-500/10 text-slate-600',
        'Cancelled': 'bg-red-500/10 text-red-600',
    };

    return (
        <section className="pb-20 px-6">
            <div className="max-w-4xl mx-auto bg-white/30 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 dark:border-white/10 shadow-2xl p-8 md:p-12 text-center transition-transform duration-700">
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 backdrop-blur-md rounded-2xl mb-4 border border-amber-500/20 shadow-sm">
                        <Wrench size={24} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{content.title || 'Track Your Repair'}</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">{content.subtitle || 'Check the real-time status of your device repair using your Ticket ID or Phone Number.'}</p>
                </div>

                <form onSubmit={handleSearch} className="max-w-md mx-auto relative mb-8">
                    <input 
                        type="text" 
                        placeholder="Enter Ticket ID (e.g., A1B2C3) or Phone..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-6 pr-14 py-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/30 dark:border-white/10 focus:bg-white/90 dark:focus:bg-slate-800/90 focus:border-amber-500/50 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 shadow-inner text-lg font-medium"
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="absolute right-2 top-2 bottom-2 aspect-square bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg flex items-center justify-center transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
                    </button>
                </form>

                {searched && !loading && (
                    <div className="animate-fade-in-up">
                        {result ? (
                            <div className="bg-white/80 dark:bg-slate-800/80 rounded-3xl p-6 border border-white/20 dark:border-white/5 shadow-xl text-left max-w-sm mx-auto">
                                <div className="flex justify-between items-start mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Ticket ID</p>
                                        <p className="text-lg font-mono font-bold text-slate-800 dark:text-slate-100">#{result.id.slice(-6).toUpperCase()}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[result.status] || 'bg-slate-100 text-slate-500'}`}>
                                        {result.status}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Device</p>
                                        <p className="font-medium text-slate-800 dark:text-slate-200">{result.deviceName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Issue</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{result.issueDescription}</p>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Estimated Completion</p>
                                        <p className="font-medium text-slate-800 dark:text-slate-200">
                                            {result.status === 'Completed' || result.status === 'Ready' ? 'Ready for Pickup' : 'Processing'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-white/5 rounded-2xl border border-white/20 inline-block">
                                <p>No repair ticket found with that information.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

interface SubscriptionSectionProps {
    content: any;
    onSelectPlan: (plan: any) => void;
}

const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({ content, onSelectPlan }) => {
    return (
        <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">{content.title || 'Simple Pricing'}</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{content.subtitle || 'Choose the plan that best fits your business needs.'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(content.plans || []).map((plan: any, idx: number) => (
                        <div 
                            key={idx} 
                            className={`relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-8 border transition-all hover:-translate-y-2 duration-300 flex flex-col ${plan.recommended ? 'border-primary shadow-2xl shadow-primary/20 scale-105 z-10' : 'border-slate-200 dark:border-white/10 shadow-lg'}`}
                        >
                            {plan.recommended && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide shadow-md">
                                    Recommended
                                </div>
                            )}
                            
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">{plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {(plan.features || []).map((feature: string, fIdx: number) => (
                                    <li key={fIdx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                        <div className={`mt-0.5 p-0.5 rounded-full ${plan.recommended ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                                            <Check size={10} strokeWidth={3} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button 
                                onClick={() => onSelectPlan(plan)}
                                className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.recommended ? 'bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white'}`}
                            >
                                {plan.buttonText || 'Choose Plan'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

interface FooterSectionProps {
  content: any;
  storeName: string;
}

const FooterSection: React.FC<FooterSectionProps> = ({ content, storeName }) => (
    <footer className="mt-auto py-10 px-6 border-t border-slate-200/50 dark:border-white/5 bg-white/10 dark:bg-slate-900/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
            <ShieldCheck size={18} className="text-emerald-500" />
            <span>Secure & Cloud Native</span>
          </div>
          <p>{content.copyright || `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`}</p>
        </div>
    </footer>
);

// Subscription Checkout Page (Unchanged)
const SubscriptionCheckout = ({ plan, onBack, onComplete }: { plan: any, onBack: () => void, onComplete: () => void }) => {
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 1500);
    };

    if (step === 2) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-slate-200 dark:border-slate-700 animate-fade-in-up">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-green-500/30">
                        <Check size={40} strokeWidth={3} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Welcome Aboard!</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-8">
                        Your subscription to the <span className="font-bold text-primary">{plan.name}</span> plan is active.
                    </p>
                    <button 
                        onClick={onComplete}
                        className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:opacity-90 transition-opacity"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 bg-slate-900 text-white p-8 flex flex-col justify-between">
                <div>
                    <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <h2 className="text-3xl font-bold mb-2">Subscribe to ANAJAK POS</h2>
                    <p className="text-slate-400 mb-8">Unlock the full potential of your business.</p>
                    <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-md border border-white/10">
                        <div className="text-sm text-slate-300 uppercase font-bold tracking-wider mb-2">Selected Plan</div>
                        <div className="flex justify-between items-baseline mb-4">
                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                            <span className="text-xl font-bold">{plan.price} <span className="text-sm font-normal text-slate-300">{plan.period}</span></span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 p-6 md:p-12 overflow-y-auto">
                <div className="max-w-xl mx-auto">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Payment Details</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Card Number</label>
                            <input required type="text" className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary" placeholder="0000 0000 0000 0000" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-4 bg-primary hover:bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-8">
                            {loading ? <Loader2 className="animate-spin"/> : `Pay ${plan.price}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
};

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onViewDemo, settings, products = [], currentUser, customerData, transactions = [], repairs = [], onLogout }) => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [viewTransaction, setViewTransaction] = useState<Transaction | null>(null);
  const storeName = settings?.storeName || 'ANAJAK POS';
  const sections = settings?.landingPage?.sections || [];
  
  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  // If a plan is selected, show checkout instead of landing page
  if (selectedPlan) {
      return (
          <SubscriptionCheckout 
            plan={selectedPlan} 
            onBack={() => setSelectedPlan(null)} 
            onComplete={() => { setSelectedPlan(null); onGetStarted(); }} 
          />
      );
  }

  const isCustomerLoggedIn = currentUser && customerData;

  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden flex flex-col font-sans text-slate-900 dark:text-white scroll-smooth relative">
      
      {/* Navbar (Fixed) */}
      <nav className="fixed w-full z-50 px-6 py-4 transition-all duration-300 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-white/20 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/90 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
              <Store size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">{storeName}</span>
          </div>
          
          {/* Auth Button or Profile */}
          {isCustomerLoggedIn ? (
              <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end mr-1">
                      <span className="text-sm font-bold text-slate-800 dark:text-white">{currentUser?.name}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{customerData?.points || 0} pts</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                      {currentUser?.name.charAt(0)}
                  </div>
                  {onLogout && (
                      <button 
                        onClick={onLogout}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors ml-1"
                        title="Sign Out"
                      >
                          <LogOut size={18} />
                      </button>
                  )}
              </div>
          ) : (
              <button 
                onClick={onGetStarted}
                className="px-6 py-2.5 rounded-xl bg-white dark:bg-white/10 text-slate-900 dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/20 transition-all border border-slate-200 dark:border-white/10 shadow-sm"
              >
                Sign In
              </button>
          )}
        </div>
      </nav>

      {/* Dynamic Content */}
      <div className="flex-1 flex flex-col">
          {sortedSections.map((section: LandingPageSection) => {
              if (!section.visible) return null;
              
              switch (section.type) {
                  case 'hero':
                      return <HeroSection key={section.id} content={section.content} onGetStarted={onGetStarted} onViewDemo={onViewDemo} />;
                  case 'customer_dashboard':
                      if (!isCustomerLoggedIn) return null;
                      return <CustomerDashboardSection 
                                key={section.id} 
                                currentUser={currentUser!} 
                                customerData={customerData!} 
                                settings={settings!} 
                                transactions={transactions}
                                repairs={repairs}
                                content={section.content}
                                onViewTransaction={setViewTransaction}
                             />;
                  case 'features':
                      return <FeaturesSection key={section.id} content={section.content} />;
                  case 'video':
                      return <VideoSection key={section.id} content={section.content} />;
                  case 'users':
                      return <UsersSection key={section.id} content={section.content} />;
                  case 'preview':
                      return <PreviewSection key={section.id} content={section.content} products={products} settings={settings} />;
                  case 'repair':
                      return <RepairSection key={section.id} content={section.content} />;
                  case 'subscription':
                      return <SubscriptionSection key={section.id} content={section.content} onSelectPlan={setSelectedPlan} />;
                  case 'footer':
                      return <FooterSection key={section.id} content={section.content} storeName={storeName} />;
                  default:
                      return null;
              }
          })}
      </div>

      {viewTransaction && settings && (
            <Invoice 
                transaction={viewTransaction} 
                settings={settings} 
                onClose={() => setViewTransaction(null)} 
            />
      )}
    </div>
  );
};
