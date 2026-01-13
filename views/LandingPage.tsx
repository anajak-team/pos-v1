
import React, { useState } from 'react';
import { Store, ArrowRight, ShoppingCart, BarChart3, Wrench, ShieldCheck, Zap, Package, Globe, Gift, Search, Loader2, Check, ExternalLink, Play, Building, ArrowLeft, CreditCard, Lock, Mail, User, X, Tag, Box } from 'lucide-react';
import { StoreSettings, LandingPageSection, Product, RepairTicket } from '../types';
import { getRepairs } from '../services/storageService';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
  settings?: StoreSettings | null;
  products?: Product[];
}

// Icon mapping for dynamic features
const ICON_MAP: Record<string, any> = {
    ShoppingCart,
    Package,
    BarChart3,
    Wrench,
    Zap,
    ShieldCheck,
    Globe,
    Store,
    Gift
};

interface HeroSectionProps {
  content: any;
  onGetStarted: () => void;
  onViewDemo: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ content, onGetStarted, onViewDemo }) => (
    <header className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {content.badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wide mb-6 border border-blue-500/20 animate-fade-in-up">
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
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
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
        </div>

        {/* Abstract Background Blobs - Static for aesthetic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] -z-10 animate-blob mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] -z-10 animate-blob mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '2s' }}></div>
    </header>
);

interface FeatureCardProps {
  iconName: string;
  title: string;
  desc: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ iconName, title, desc, color }) => {
  const Icon = ICON_MAP[iconName] || Package;
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-600',
    emerald: 'bg-emerald-500/10 text-emerald-600',
    purple: 'bg-purple-500/10 text-purple-600',
    amber: 'bg-amber-500/10 text-amber-600',
  };

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 dark:border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${colorClasses[color] || colorClasses.blue} group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
};

interface FeaturesSectionProps {
  content: any;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ content }) => (
    <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(content.items || []).map((item: any, i: number) => (
                <FeatureCard 
                    key={i}
                    iconName={item.icon} 
                    title={item.title} 
                    desc={item.desc}
                    color={item.color}
                />
            ))}
          </div>
        </div>
    </section>
);

interface VideoSectionProps {
    content: any;
}

const VideoSection: React.FC<VideoSectionProps> = ({ content }) => {
    // Helper to convert standard video URLs to embed versions
    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        
        // YouTube Watch URL
        const youtubeWatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
        if (youtubeWatch && youtubeWatch[1]) {
            return `https://www.youtube.com/embed/${youtubeWatch[1]}`;
        }
        
        // Vimeo
        const vimeo = url.match(/vimeo\.com\/(\d+)/);
        if (vimeo && vimeo[1]) {
            return `https://player.vimeo.com/video/${vimeo[1]}`;
        }

        return url;
    };

    const embedUrl = getEmbedUrl(content.videoUrl);

    return (
    <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
            {(content.title || content.subtitle) && (
                <div className="mb-12">
                    {content.title && <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">{content.title}</h2>}
                    {content.subtitle && <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">{content.subtitle}</p>}
                </div>
            )}
            
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 dark:border-white/5 bg-black">
                {embedUrl ? (
                    <iframe 
                        src={embedUrl} 
                        title="Video Showcase"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-100 dark:bg-slate-800">
                        <Play size={48} className="mb-2 opacity-50" />
                        <p>No video URL configured</p>
                    </div>
                )}
            </div>
        </div>
    </section>
    );
};

interface UsersSectionProps {
    content: any;
}

const UsersSection: React.FC<UsersSectionProps> = ({ content }) => (
    <section className="py-20 px-6 bg-slate-50/50 dark:bg-black/10">
        <div className="max-w-7xl mx-auto text-center">
            {content.title && <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-10 uppercase tracking-wide opacity-80">{content.title}</h2>}
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                {(content.users || []).map((user: any, index: number) => (
                    <div key={index} className="flex flex-col items-center gap-3 group">
                        <div className="w-24 h-24 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 flex items-center justify-center p-4 transition-transform hover:scale-110 duration-300">
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
        </div>
    </section>
);

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
                        className="bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col group hover:shadow-md transition-all cursor-pointer"
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
        <section className="py-20 px-6 bg-slate-50/50 dark:bg-black/20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">{content.title || 'Simple Pricing'}</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{content.subtitle || 'Choose the plan that best fits your business needs.'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(content.plans || []).map((plan: any, idx: number) => (
                        <div 
                            key={idx} 
                            className={`relative bg-white dark:bg-slate-900 rounded-3xl p-8 border transition-all hover:-translate-y-2 duration-300 flex flex-col ${plan.recommended ? 'border-primary shadow-2xl shadow-primary/20 scale-105 z-10' : 'border-slate-200 dark:border-white/10 shadow-lg'}`}
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
    <footer className="mt-auto py-10 px-6 border-t border-slate-200/50 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
            <ShieldCheck size={18} className="text-emerald-500" />
            <span>Secure & Cloud Native</span>
          </div>
          <p>{content.copyright || `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`}</p>
        </div>
    </footer>
);

// Subscription Checkout Page
const SubscriptionCheckout = ({ plan, onBack, onComplete }: { plan: any, onBack: () => void, onComplete: () => void }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
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
            {/* Sidebar / Summary */}
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
                        <ul className="space-y-3">
                            {(plan.features || []).map((f: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                    <Check size={16} className="text-green-400 mt-0.5 shrink-0" />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-8 text-xs text-slate-500">
                    <p>© ANAJAK POS Inc. Secure Checkout.</p>
                </div>
            </div>

            {/* Form */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto">
                <div className="max-w-xl mx-auto">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Payment Details</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b pb-2 mb-4">Account Info</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">First Name</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                        <input required type="text" className="w-full pl-10 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary" placeholder="John" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Last Name</label>
                                    <input required type="text" className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                    <input required type="email" className="w-full pl-10 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary" placeholder="john@company.com" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b pb-2 mb-4">Payment Method</h4>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Card Number</label>
                                <div className="relative">
                                    <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                    <input required type="text" className="w-full pl-10 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary" placeholder="0000 0000 0000 0000" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Expiry Date</label>
                                    <input required type="text" className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary" placeholder="MM/YY" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">CVC</label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                        <input required type="text" className="w-full pl-10 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary" placeholder="123" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 bg-primary hover:bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-8"
                        >
                            {loading ? <Loader2 className="animate-spin"/> : `Pay ${plan.price}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
};

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onViewDemo, settings, products = [] }) => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
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

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 dark:text-white">
      
      {/* Navbar (Fixed) */}
      <nav className="fixed w-full z-50 px-6 py-4 transition-all duration-300 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-white/20 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/90 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
              <Store size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">{storeName}</span>
          </div>
          <button 
            onClick={onGetStarted}
            className="px-6 py-2.5 rounded-xl bg-white dark:bg-white/10 text-slate-900 dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/20 transition-all border border-slate-200 dark:border-white/10 shadow-sm"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Dynamic Content */}
      <div className="flex-1 flex flex-col">
          {sortedSections.map((section: LandingPageSection) => {
              if (!section.visible) return null;
              
              switch (section.type) {
                  case 'hero':
                      return <HeroSection key={section.id} content={section.content} onGetStarted={onGetStarted} onViewDemo={onViewDemo} />;
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
    </div>
  );
};