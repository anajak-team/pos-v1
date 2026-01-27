
import React, { useState } from 'react';
import { Store, ArrowRight, ShoppingCart, BarChart3, Wrench, ShieldCheck, Zap, Package, Globe, Gift, Search, Loader2, Check, ExternalLink, Play, Building, ArrowLeft, CreditCard, Lock, Mail, User as UserIcon, X, Tag, Box, Crown, LogOut, ChevronRight, Receipt, Calendar, ShoppingBag, History, Settings, Sliders, LayoutGrid, Rocket, QrCode, Languages, MapPin } from 'lucide-react';
import { StoreSettings, LandingPageSection, Product, RepairTicket, User, Customer, Transaction } from '../types';
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
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
  onToggleLanguage?: () => void;
  currentLanguage?: string;
}

const ICON_MAP: Record<string, any> = {
    ShoppingCart, Package, BarChart3, Wrench, Zap, ShieldCheck, Globe, Store, Gift, Settings, Sliders, LayoutGrid, Rocket, QrCode, Languages
};

// --- Feature Card Component ---
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
    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/40 dark:border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[color] || 'bg-red-50 text-red-600 border border-red-100'} group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm bg-white/80 dark:bg-slate-800/80`}>
        <Icon size={24} strokeWidth={2} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
};

// --- Sections ---

const HeroSection = ({ content, onGetStarted, onViewDemo }: any) => {
    const layout = content.layout || 'centered';
    const Buttons = () => (
        <div className={`flex flex-col sm:flex-row gap-4 animate-fade-in-up ${layout === 'centered' ? 'justify-center' : 'justify-start'}`} style={{ animationDelay: '0.3s' }}>
            <button onClick={onGetStarted} className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">
                {content.ctaPrimary} <ArrowRight size={20} />
            </button>
            <button onClick={onViewDemo} className="w-full sm:w-auto px-8 py-4 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 text-slate-800 dark:text-white rounded-2xl font-bold text-lg border border-white/40 dark:border-white/10 transition-all backdrop-blur-md flex items-center justify-center gap-2">
                {content.ctaSecondary || 'View Demo'} <Play size={18} fill="currentColor" className="opacity-80" />
            </button>
        </div>
    );

    if (layout === 'centered') {
        return (
            <header className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                  {content.badge && <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wide mb-6 border border-blue-500/20"><Zap size={14} className="fill-current" />{content.badge}</div>}
                  <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-sm">{content.title} <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{content.titleGradient}</span></h1>
                  <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">{content.subtitle}</p>
                  <Buttons />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] -z-10 animate-blob mix-blend-multiply dark:mix-blend-screen"></div>
            </header>
        );
    }
    return null; // Fallback for other layouts if implemented later
};

const FeaturesSection = ({ content }: any) => {
    const layout = content.layout || 'grid';
    return (
        <section className="py-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {layout === 'list' ? (
                    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                        {(content.items || []).map((item: any, i: number) => <FeatureCard key={i} iconName={item.icon} title={item.title} desc={item.desc} color={item.color || 'red'} layout="list" />)}
                    </div>
                ) : layout === 'minimal' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
                        {(content.items || []).map((item: any, i: number) => <FeatureCard key={i} iconName={item.icon} title={item.title} desc={item.desc} color={item.color || 'red'} layout="minimal" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(content.items || []).map((item: any, i: number) => <FeatureCard key={i} iconName={item.icon} title={item.title} desc={item.desc} color={item.color || 'red'} layout="grid" />)}
                    </div>
                )}
            </div>
        </section>
    );
};

const VideoSection = ({ content }: any) => {
    const [isPlaying, setIsPlaying] = useState(false);
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
        <div className={`relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video group border border-white/20 dark:border-white/10 w-full`}>
            {!isPlaying ? (
                <div className="absolute inset-0 bg-cover bg-center cursor-pointer" style={{ backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)` }} onClick={() => setIsPlaying(true)}>
                    <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors flex flex-col justify-between p-6 md:p-10">
                        <div className="text-white">
                            <div className="flex items-center gap-2 mb-2"><div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Video</div></div>
                            <h3 className="font-bold text-2xl md:text-3xl leading-tight mb-2 drop-shadow-md">{content.overlayTitle}</h3>
                            <p className="text-white/90 text-lg">{content.overlaySubtitle}</p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300"><Play size={32} fill="white" className="text-white ml-1" /></div></div>
                    </div>
                </div>
            ) : (
                <iframe src={`${embedUrl}?autoplay=1`} title="Video Showcase" className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            )}
        </div>
    );

    const renderFeature = (feature: any, idx: number, type: 'list' | 'grid' | 'card') => {
        const Icon = ICON_MAP[feature.icon] || Settings;
        if (type === 'card') {
            return (
                <div key={idx} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/40 dark:border-white/10 hover:shadow-lg transition-all duration-300 flex flex-col items-start justify-center gap-4 h-full">
                    <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl w-fit backdrop-blur-sm"><Icon size={24} /></div>
                    <div><h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{feature.title}</h4><p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p></div>
                </div>
            )
        }
        if (type === 'list') {
            return (
                <div key={idx} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/40 dark:border-white/10 hover:shadow-lg transition-all duration-300 group">
                    <div className="w-12 h-12 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center justify-center mb-4 text-red-600 bg-white dark:bg-white/5 shadow-sm group-hover:scale-110 transition-transform backdrop-blur-sm"><Icon size={24} strokeWidth={1.5} /></div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">{feature.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <section className="py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    {content.title && <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">{content.title}</h2>}
                    {content.subtitle && <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">{content.subtitle}</p>}
                </div>
                {layout === 'mixed_2r_3b' ? (
                    <div className="flex flex-col gap-8 md:gap-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                            <div className="lg:col-span-2 w-full"><VideoPlayer /></div>
                            <div className="flex flex-col gap-6 h-full">
                                {content.features?.slice(0, 2).map((f: any, i: number) => <div key={i} className="flex-1">{renderFeature(f, i, 'card')}</div>)}
                            </div>
                        </div>
                        {content.features?.length > 2 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                                {content.features?.slice(2).map((f: any, i: number) => renderFeature(f, i + 2, 'card'))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        <div className="lg:col-span-2"><VideoPlayer /></div>
                        <div className="flex flex-col gap-4">
                            {content.features?.map((f: any, i: number) => renderFeature(f, i, 'list'))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

const UsersSection = ({ content }: any) => (
    <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
            {content.title && <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-10 uppercase tracking-wide opacity-80">{content.title}</h2>}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                {(content.users || []).map((user: any, index: number) => (
                    <div key={index} className="flex flex-col items-center gap-3 group">
                        <div className="w-24 h-24 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-sm border border-white/40 dark:border-white/10 flex items-center justify-center p-4 transition-transform hover:scale-110 duration-300">
                            {user.logo ? <img src={user.logo} alt={user.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100" /> : <Building size={32} className="text-slate-400 group-hover:text-primary transition-colors" />}
                        </div>
                        <span className="font-bold text-slate-500 dark:text-slate-400 text-sm group-hover:text-primary transition-colors">{user.name}</span>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// --- Product Details Modal Component ---
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
                        {product.zone && (
                            <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Location</span>
                                <span className="font-medium text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1"><MapPin size={14}/> {product.zone}</span>
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

// --- Preview Section with Search and Filters ---
const PreviewSection = ({ content, products, settings }: any) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Safeguard products prop
    const safeProducts = Array.isArray(products) ? products : [];

    // Extract unique categories
    const categories = ['All', ...Array.from(new Set(safeProducts.map((p: Product) => p.category)))];

    const filteredProducts = safeProducts.filter((product: Product) => {
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
              <p className="text-slate-600 dark:text-slate-400">{content.subtitle || 'Real-time availability from our showroom'}</p>
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
                    {categories.map((cat: any) => (
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
                  {filteredProducts.slice(0, 12).map((product: Product) => (
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
                              {product.zone && (
                                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1 shadow-sm border border-white/10">
                                      <MapPin size={10} /> {product.zone}
                                  </div>
                              )}
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

const RepairSection = ({ content }: any) => (
    <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto bg-white/30 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 dark:border-white/10 shadow-2xl p-8 md:p-12 text-center">
            <div className="mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 backdrop-blur-md rounded-2xl mb-4 border border-amber-500/20 shadow-sm"><Wrench size={24} className="text-amber-600 dark:text-amber-400" /></div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{content.title || 'Track Your Repair'}</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">{content.subtitle}</p>
            </div>
            <div className="max-w-md mx-auto relative mb-8">
                <input type="text" placeholder={content.placeholder || "Enter Ticket ID..."} className="w-full pl-6 pr-14 py-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/30 dark:border-white/10 focus:bg-white/90 dark:focus:bg-slate-800/90 outline-none transition-all text-slate-800 dark:text-slate-100 shadow-inner text-lg font-medium" />
                <button className="absolute right-2 top-2 bottom-2 aspect-square bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg flex items-center justify-center transition-all active:scale-95"><Search size={24} /></button>
            </div>
        </div>
    </section>
);

const SubscriptionSection = ({ content }: any) => (
    <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">{content.title || 'Simple Pricing'}</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{content.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(content.plans || []).map((plan: any, idx: number) => (
                    <div key={idx} className={`relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-8 border transition-all flex flex-col ${plan.recommended ? 'border-primary shadow-2xl scale-105 z-10' : 'border-slate-200 dark:border-white/10 shadow-lg'}`}>
                        {plan.recommended && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide shadow-md">Recommended</div>}
                        <div className="mb-6"><h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{plan.name}</h3><div className="flex items-baseline gap-1"><span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span><span className="text-slate-500 dark:text-slate-400 font-medium">{plan.period}</span></div></div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {(plan.features || []).map((feature: string, fIdx: number) => <li key={fIdx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300"><Check size={16} className="text-green-500 shrink-0 mt-0.5" />{feature}</li>)}
                        </ul>
                        <button className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.recommended ? 'bg-primary hover:bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white'}`}>{plan.buttonText || 'Choose Plan'}</button>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FooterSection = ({ content, storeName }: any) => (
    <footer className="mt-auto py-10 px-6 border-t border-slate-200/50 dark:border-white/5 bg-white/10 dark:bg-slate-900/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300"><ShieldCheck size={18} className="text-emerald-500" /><span>Secure & Cloud Native</span></div>
          <p>{content.copyright || `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`}</p>
        </div>
    </footer>
);

const CustomerDashboardSection = ({ currentUser, customerData, settings, transactions, repairs, content, onViewTransaction }: any) => {
    const totalSpent = customerData.totalSpent || 0;
    const points = customerData.points || 0;
    const myRepairs = repairs ? repairs.filter((r: RepairTicket) => r.customerId === customerData.id) : [];
    const activeRepairs = myRepairs.filter((r: RepairTicket) => r.status !== 'Completed' && r.status !== 'Cancelled');

    return (
        <section className="py-12 px-6">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="relative bg-gradient-to-r from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-2"><Crown size={14} className="fill-yellow-400 text-yellow-400" />{content.title || 'Your Dashboard'}</div>
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Welcome, {currentUser.name}</h2>
                            <p className="text-indigo-100 text-lg max-w-md">{content.subtitle || 'Track your points, orders, and repairs.'}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl min-w-[200px] text-center shadow-lg"><p className="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-1">{content.pointsLabel || 'Loyalty Points'}</p><div className="text-4xl font-black mb-1 drop-shadow-sm flex items-center justify-center gap-2"><Crown size={28} className="text-yellow-400 fill-yellow-400"/>{points.toLocaleString()}</div></div>
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl min-w-[200px] text-center shadow-lg"><p className="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-1">{content.spentLabel || 'Lifetime Spent'}</p><div className="text-4xl font-black mb-1 drop-shadow-sm">{settings.currency}{totalSpent.toLocaleString()}</div></div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400"><History size={24} /></div><h3 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Purchases</h3></div>
                        <div className="space-y-4">
                            {transactions.slice(0, 3).map((t: Transaction) => (
                                <div key={t.id} onClick={() => onViewTransaction(t)} className="group bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-xs">{new Date(t.date).getDate()}</div>
                                        <div><h4 className="font-bold text-slate-900 dark:text-white text-sm">Order #{t.id.slice(-6)}</h4><p className="text-xs text-slate-500">{t.items.length} Items</p></div>
                                    </div>
                                    <div className="flex items-center gap-3"><span className="font-bold text-slate-900 dark:text-white">{settings.currency}{t.total.toLocaleString()}</span><ChevronRight size={16} className="text-slate-400"/></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400"><Wrench size={24} /></div><h3 className="text-2xl font-bold text-slate-900 dark:text-white">My Repairs</h3></div>
                        <div className="space-y-4">
                            {activeRepairs.map((r: RepairTicket) => (
                                <div key={r.id} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-sm"><h4 className="font-bold text-slate-900 dark:text-white text-sm">{r.deviceName}</h4><p className="text-xs text-slate-500">{r.status}</p></div>
                            ))}
                            {activeRepairs.length === 0 && <div className="text-center text-slate-500">No active repairs</div>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Main Landing Page ---

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onViewDemo, settings, products = [], currentUser, customerData, transactions = [], repairs = [], onLogout }) => {
  const [viewTransaction, setViewTransaction] = useState<Transaction | null>(null);
  const storeName = settings?.storeName || 'ANAJAK POS';
  const sections = settings?.landingPage?.sections || [];
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const isCustomerLoggedIn = currentUser && customerData;

  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden flex flex-col font-sans text-slate-900 dark:text-white scroll-smooth relative">
      <nav className="fixed w-full z-50 px-6 py-4 transition-all duration-300 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-white/20 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2"><div className="w-10 h-10 bg-primary/90 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white"><Store size={24} /></div><span className="text-xl font-bold tracking-tight">{storeName}</span></div>
          {isCustomerLoggedIn ? (
              <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end mr-1"><span className="text-sm font-bold text-slate-800 dark:text-white">{currentUser?.name}</span><span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{customerData?.points || 0} pts</span></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">{currentUser?.name.charAt(0)}</div>
                  {onLogout && <button onClick={onLogout} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors ml-1" title="Sign Out"><LogOut size={18} /></button>}
              </div>
          ) : (
              <button onClick={onGetStarted} className="px-6 py-2.5 rounded-xl bg-white dark:bg-white/10 text-slate-900 dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/20 transition-all border border-slate-200 dark:border-white/10 shadow-sm">Sign In</button>
          )}
        </div>
      </nav>

      <div className="flex-1 flex flex-col">
          {sortedSections.map((section: LandingPageSection) => {
              if (!section.visible) return null;
              if (section.type === 'customer_dashboard' && !isCustomerLoggedIn) return null;
              if (section.type === 'customer_dashboard' && isCustomerLoggedIn) return <CustomerDashboardSection key={section.id} currentUser={currentUser} customerData={customerData} settings={settings} transactions={transactions} repairs={repairs} content={section.content} onViewTransaction={setViewTransaction} />;
              
              switch (section.type) {
                  case 'hero': return <HeroSection key={section.id} content={section.content} onGetStarted={onGetStarted} onViewDemo={onViewDemo} />;
                  case 'features': return <FeaturesSection key={section.id} content={section.content} />;
                  case 'video': return <VideoSection key={section.id} content={section.content} />;
                  case 'users': return <UsersSection key={section.id} content={section.content} />;
                  case 'preview': return <PreviewSection key={section.id} content={section.content} products={products} settings={settings} />;
                  case 'repair': return <RepairSection key={section.id} content={section.content} />;
                  case 'subscription': return <SubscriptionSection key={section.id} content={section.content} />;
                  case 'footer': return <FooterSection key={section.id} content={section.content} storeName={storeName} />;
                  default: return null;
              }
          })}
      </div>

      {viewTransaction && settings && <Invoice transaction={viewTransaction} settings={settings} onClose={() => setViewTransaction(null)} />}
    </div>
  );
};
