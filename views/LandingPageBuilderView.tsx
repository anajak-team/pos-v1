
import React, { useState } from 'react';
import { StoreSettings, LandingPageSection } from '../types';
import { ArrowLeft, Globe, Gift, Eye, Shield, ArrowUp, ArrowDown, EyeOff, Trash2, Plus, Save, Wrench, CreditCard, Video, Users, User, Layout, GripVertical, Check, PlusCircle, Edit3, ChevronRight, Crown, Image as ImageIcon, Play, Sliders, LayoutGrid, Rocket, QrCode, Languages, Info } from 'lucide-react';

interface LandingPageBuilderProps {
  settings: StoreSettings;
  onSave: (settings: StoreSettings) => void;
  onBack: () => void;
}

const InputGroup: React.FC<{ label: string; value: string; onChange: (v: string) => void; className?: string; placeholder?: string }> = ({ label, value, onChange, className, placeholder }) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">{label}</label>
    <input 
      type="text" 
      value={value || ''} 
      onChange={e => onChange(e.target.value)} 
      className="w-full p-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 focus:bg-white/80 dark:focus:bg-black/40 focus:border-primary/50 outline-none transition-all text-slate-800 dark:text-white placeholder:text-slate-400 shadow-inner text-sm"
      placeholder={placeholder}
    />
  </div>
);

const commonInputClass = "w-full p-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 focus:bg-white/80 dark:focus:bg-black/40 focus:border-primary/50 outline-none transition-all text-slate-800 dark:text-white placeholder:text-slate-400 shadow-inner text-sm";

const FeaturesListEditor = ({ features, onChange }: { features: string[], onChange: (features: string[]) => void }) => {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Plan Features</label>
            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
                {features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2 group">
                        <input 
                            className={commonInputClass + " py-2 text-xs"}
                            value={feature}
                            onChange={(e) => {
                                const newFeatures = [...features];
                                newFeatures[idx] = e.target.value;
                                onChange(newFeatures);
                            }}
                            placeholder="Feature description"
                        />
                        <button 
                            onClick={() => {
                                const newFeatures = features.filter((_, i) => i !== idx);
                                onChange(newFeatures);
                            }}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
            <button 
                onClick={() => onChange([...features, ''])}
                className="w-full py-2 border border-dashed border-primary/30 text-primary rounded-xl text-xs font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 mt-2"
            >
                <Plus size={14} /> Add Feature Line
            </button>
        </div>
    );
};

export const LandingPageBuilderView: React.FC<LandingPageBuilderProps> = ({ settings, onSave, onBack }) => {
  const [localSettings, setLocalSettings] = useState<StoreSettings>(settings);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [activePlanEditIndex, setactivePlanEditIndex] = useState<number | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const updateSections = (newSections: LandingPageSection[]) => {
      setLocalSettings(prev => ({
          ...prev,
          landingPage: {
              ...prev.landingPage,
              sections: newSections
          }
      }));
  };

  const handleAddSection = (type: LandingPageSection['type']) => {
      const newId = `${type}_${Date.now()}`;
      const sections = [...(localSettings.landingPage?.sections || [])];
      
      const defaultContent: Record<string, any> = {
          hero: { title: 'New Title', titleGradient: 'New Gradient', subtitle: 'New Subtitle', ctaPrimary: 'Get Started', layout: 'centered' },
          features: { items: [{ title: 'New Feature', desc: 'Description', icon: 'Zap', color: 'blue' }], layout: 'grid' },
          subscription: { title: 'Pricing Plans', subtitle: 'Choose your plan', plans: [{ name: 'Pro', price: '$29', period: '/mo', features: ['All access'], buttonText: 'Buy Now', recommended: true }] },
          video: { title: 'Watch Now', videoUrl: '', overlayTitle: 'Video Title', overlaySubtitle: 'Learn more about us', layout: 'classic', features: [] },
          users: { title: 'Our Partners', users: [] },
          preview: { title: 'Live Preview', subtitle: 'View items' },
          repair: { title: 'Repair Status', subtitle: 'Track your device' },
          footer: { copyright: '© All rights reserved' }
      };

      const newSection: LandingPageSection = {
          id: newId,
          type,
          label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
          visible: true,
          order: sections.length,
          content: defaultContent[type] || {}
      };

      updateSections([...sections, newSection]);
      setShowAddMenu(false);
      setEditingSectionId(newId);
  };

  const handleDeleteSection = (id: string) => {
      const sections = (localSettings.landingPage?.sections || []).filter(s => s.id !== id);
      updateSections(sections.map((s, i) => ({ ...s, order: i })));
      if (editingSectionId === id) setEditingSectionId(null);
  };

  const handleUpdateContent = (id: string, content: any) => {
      const sections = (localSettings.landingPage?.sections || []).map(s => 
          s.id === id ? { ...s, content: { ...s.content, ...content } } : s
      );
      updateSections(sections);
  };

  const handleToggleVisibility = (id: string) => {
      const sections = (localSettings.landingPage?.sections || []).map(s => 
          s.id === id ? { ...s, visible: !s.visible } : s
      );
      updateSections(sections);
  };

  const sortedSections = [...(localSettings.landingPage?.sections || [])].sort((a, b) => a.order - b.order);

  const getSectionIcon = (type: string) => {
      switch(type) {
          case 'hero': return Globe;
          case 'features': return Gift;
          case 'preview': return Eye;
          case 'footer': return Shield;
          case 'repair': return Wrench;
          case 'subscription': return CreditCard;
          case 'video': return Video;
          case 'users': return Users;
          case 'customer_dashboard': return User;
          default: return Layout;
      }
  };

  const renderEditor = (section: LandingPageSection) => {
      switch(section.type) {
          case 'hero':
              return (
                  <div className="space-y-4">
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Layout Style</label>
                          <select className={commonInputClass} value={section.content.layout || 'centered'} onChange={(e) => handleUpdateContent(section.id, { layout: e.target.value })}>
                              <option value="centered">Centered</option>
                              <option value="split">Split (Left/Right)</option>
                              <option value="minimal">Minimal</option>
                          </select>
                      </div>
                      <InputGroup label="Badge Text" value={section.content.badge} onChange={(v) => handleUpdateContent(section.id, { badge: v })} />
                      <InputGroup label="Main Title" value={section.content.title} onChange={(v) => handleUpdateContent(section.id, { title: v })} />
                      <InputGroup label="Gradient Text" value={section.content.titleGradient} onChange={(v) => handleUpdateContent(section.id, { titleGradient: v })} />
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Subtitle</label>
                          <textarea className={commonInputClass} rows={3} value={section.content.subtitle} onChange={(e) => handleUpdateContent(section.id, { subtitle: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <InputGroup label="Button Text" value={section.content.ctaPrimary} onChange={(v) => handleUpdateContent(section.id, { ctaPrimary: v })} />
                          <InputGroup label="Link" value={section.content.ctaPrimaryLink} onChange={(v) => handleUpdateContent(section.id, { ctaPrimaryLink: v })} />
                      </div>
                  </div>
              );
          case 'features':
              return (
                  <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputGroup label="Section Title" value={section.content.title} onChange={(v) => handleUpdateContent(section.id, { title: v })} />
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Layout Style</label>
                            <select className={commonInputClass} value={section.content.layout || 'grid'} onChange={(e) => handleUpdateContent(section.id, { layout: e.target.value })}>
                                <option value="grid">Grid (Cards)</option>
                                <option value="list">List (Wide Cards)</option>
                                <option value="minimal">Minimal (Icons Only)</option>
                            </select>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Subtitle</label>
                          <textarea className={commonInputClass} rows={2} value={section.content.subtitle} onChange={(e) => handleUpdateContent(section.id, { subtitle: e.target.value })} />
                      </div>

                      <div className="pt-6 border-t border-slate-200 dark:border-white/10 mt-6">
                          <div className="flex justify-between items-center mb-4">
                              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-widest">Feature Cards</h4>
                              <button 
                                  onClick={() => {
                                      const newItem = { title: 'New Feature', desc: 'Describe this feature', icon: 'Rocket', color: 'blue' };
                                      const newItems = [...(section.content.items || []), newItem];
                                      handleUpdateContent(section.id, { items: newItems });
                                  }} 
                                  className="text-xs bg-primary text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 font-bold shadow-md"
                              >
                                  <Plus size={14} /> Add Feature
                              </button>
                          </div>

                          <div className="space-y-4">
                              {(section.content.items || []).map((item: any, idx: number) => (
                                  <div key={idx} className="p-5 bg-white dark:bg-black/20 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm group">
                                      <div className="flex justify-between items-center mb-4">
                                          <div className="flex items-center gap-2">
                                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs bg-slate-100 dark:bg-white/5 text-slate-500`}>
                                                  {idx + 1}
                                              </div>
                                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Feature Item</span>
                                          </div>
                                          <button 
                                              onClick={() => {
                                                  const newItems = section.content.items.filter((_:any, i:number) => i !== idx);
                                                  handleUpdateContent(section.id, { items: newItems });
                                              }}
                                              className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                          >
                                              <Trash2 size={16} />
                                          </button>
                                      </div>
                                      
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                          <InputGroup label="Title" value={item.title} onChange={(v) => {
                                              const newItems = [...section.content.items];
                                              newItems[idx].title = v;
                                              handleUpdateContent(section.id, { items: newItems });
                                          }} />
                                          <div className="space-y-1.5">
                                              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Icon</label>
                                              <select className={commonInputClass} value={item.icon} onChange={(e) => {
                                                  const newItems = [...section.content.items];
                                                  newItems[idx].icon = e.target.value;
                                                  handleUpdateContent(section.id, { items: newItems });
                                              }}>
                                                  {['ShoppingCart', 'Package', 'BarChart3', 'Wrench', 'Zap', 'ShieldCheck', 'Globe', 'Store', 'Gift', 'Settings', 'Sliders', 'LayoutGrid', 'Rocket', 'QrCode', 'Languages'].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                                              </select>
                                          </div>
                                      </div>

                                      <div className="space-y-1.5 mb-4">
                                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Accent Color</label>
                                          <div className="flex gap-2">
                                              {['blue', 'emerald', 'purple', 'amber', 'red'].map(color => (
                                                  <button 
                                                      key={color} 
                                                      type="button" 
                                                      onClick={() => {
                                                          const newItems = [...section.content.items];
                                                          newItems[idx].color = color;
                                                          handleUpdateContent(section.id, { items: newItems });
                                                      }} 
                                                      className={`w-8 h-8 rounded-full border-2 transition-all ${item.color === color ? 'border-primary scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`} 
                                                      style={{ backgroundColor: color === 'emerald' ? '#10b981' : color === 'amber' ? '#f59e0b' : color === 'red' ? '#ef4444' : color === 'purple' ? '#8b5cf6' : '#3b82f6' }} 
                                                  />
                                              ))}
                                          </div>
                                      </div>

                                      <div className="space-y-1.5">
                                          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
                                          <textarea className={commonInputClass} rows={2} value={item.desc} onChange={(e) => {
                                              const newItems = [...section.content.items];
                                              newItems[idx].desc = e.target.value;
                                              handleUpdateContent(section.id, { items: newItems });
                                          }} />
                                      </div>
                                  </div>
                              ))}
                              {(!section.content.items || section.content.items.length === 0) && (
                                  <div className="py-12 text-center bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-slate-300 dark:border-white/10">
                                      <Gift size={32} className="mx-auto mb-2 text-slate-300" />
                                      <p className="text-sm text-slate-500 font-medium">No feature items added yet.</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              );
          case 'video':
              return (
                  <div className="space-y-6">
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Layout Style</label>
                          <select className={commonInputClass} value={section.content.layout || 'classic'} onChange={(e) => handleUpdateContent(section.id, { layout: e.target.value })}>
                              <option value="classic">Classic (Video Left, Features Right)</option>
                              <option value="reversed">Reversed (Video Right, Features Left)</option>
                              <option value="full">Cinematic (Video Top, Grid Bottom)</option>
                              <option value="modern">Modern (50/50 Split)</option>
                              <option value="minimal">Minimal (Video Center, Row Bottom)</option>
                              <option value="mixed_2r_3b">Mixed (Video + 2 Right + 3 Bottom)</option>
                          </select>
                      </div>
                      <InputGroup label="Video URL (YouTube/Vimeo)" value={section.content.videoUrl} onChange={(v) => handleUpdateContent(section.id, { videoUrl: v })} placeholder="https://youtube.com/watch?v=..." />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputGroup label="Thumbnail Title" value={section.content.overlayTitle} onChange={(v) => handleUpdateContent(section.id, { overlayTitle: v })} />
                        <InputGroup label="Thumbnail Subtitle" value={section.content.overlaySubtitle} onChange={(v) => handleUpdateContent(section.id, { overlaySubtitle: v })} />
                      </div>

                      <div className="pt-6 border-t border-slate-200 dark:border-white/10 mt-6">
                          <div className="flex justify-between items-center mb-4">
                              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-widest">Section Features</h4>
                              <button 
                                  onClick={() => {
                                      const newFeature = { title: 'New Feature', desc: 'Brief description', icon: 'Settings' };
                                      const newFeatures = [...(section.content.features || []), newFeature];
                                      handleUpdateContent(section.id, { features: newFeatures });
                                  }} 
                                  className="text-xs bg-primary text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 font-bold shadow-md"
                              >
                                  <Plus size={14} /> Add Feature
                              </button>
                          </div>

                          <div className="space-y-4">
                              {(section.content.features || []).map((feature: any, idx: number) => (
                                  <div key={idx} className="p-4 bg-white dark:bg-black/20 rounded-[1.5rem] border border-slate-200 dark:border-white/5 shadow-sm group">
                                      <div className="flex justify-between items-center mb-3">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Feature #{idx + 1}</span>
                                          <button 
                                              onClick={() => {
                                                  const newFeatures = section.content.features.filter((_:any, i:number) => i !== idx);
                                                  handleUpdateContent(section.id, { features: newFeatures });
                                              }}
                                              className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                          >
                                              <Trash2 size={16} />
                                          </button>
                                      </div>
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                          <div className="sm:col-span-2">
                                              <InputGroup label="Title" value={feature.title} onChange={(v) => {
                                                  const newFeatures = [...section.content.features];
                                                  newFeatures[idx].title = v;
                                                  handleUpdateContent(section.id, { features: newFeatures });
                                              }} />
                                          </div>
                                          <div>
                                              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Icon</label>
                                              <select className={commonInputClass} value={feature.icon} onChange={(e) => {
                                                  const newFeatures = [...section.content.features];
                                                  newFeatures[idx].icon = e.target.value;
                                                  handleUpdateContent(section.id, { features: newFeatures });
                                              }}>
                                                  {['ShoppingCart', 'Package', 'BarChart3', 'Wrench', 'Zap', 'ShieldCheck', 'Globe', 'Store', 'Gift', 'Settings', 'Sliders', 'LayoutGrid', 'Rocket', 'QrCode', 'Languages'].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                                              </select>
                                          </div>
                                      </div>
                                      <div className="mt-3">
                                          <InputGroup label="Description" value={feature.desc} onChange={(v) => {
                                              const newFeatures = [...section.content.features];
                                              newFeatures[idx].desc = v;
                                              handleUpdateContent(section.id, { features: newFeatures });
                                          }} />
                                      </div>
                                  </div>
                              ))}
                              {(!section.content.features || section.content.features.length === 0) && (
                                  <div className="py-12 text-center bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
                                      <Play size={32} className="mx-auto mb-2 text-slate-300" />
                                      <p className="text-sm text-slate-500 font-medium">No features added to this video section.</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              );
          case 'users':
              return (
                <div className="space-y-6">
                    <InputGroup label="Section Title" value={section.content.title} onChange={(v) => handleUpdateContent(section.id, { title: v })} />
                    <div className="pt-6 border-t border-slate-200 dark:border-white/10">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-widest">Our Clients / Partners</h4>
                            <button 
                                onClick={() => {
                                    const newUser = { name: 'New Partner', logo: '' };
                                    const newUsersList = [...(section.content.users || []), newUser];
                                    handleUpdateContent(section.id, { users: newUsersList });
                                }} 
                                className="text-xs bg-primary text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 font-bold shadow-md"
                            >
                                <Plus size={14} /> Add Partner
                            </button>
                        </div>

                        <div className="space-y-4">
                            {(section.content.users || []).map((user: any, idx: number) => (
                                <div key={idx} className="p-4 bg-white dark:bg-black/20 rounded-[1.5rem] border border-slate-200 dark:border-white/5 shadow-sm group">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/10 overflow-hidden">
                                            {user.logo ? (
                                                <img src={user.logo} alt="" className="w-full h-full object-contain" />
                                            ) : (
                                                <ImageIcon size={24} className="text-slate-300" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Partner #{idx + 1}</span>
                                                <button 
                                                    onClick={() => {
                                                        const newUsersList = section.content.users.filter((_:any, i:number) => i !== idx);
                                                        handleUpdateContent(section.id, { users: newUsersList });
                                                    }}
                                                    className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <InputGroup label="Name" value={user.name} onChange={(v) => {
                                                const newUsersList = [...section.content.users];
                                                newUsersList[idx].name = v;
                                                handleUpdateContent(section.id, { users: newUsersList });
                                            }} />
                                            <InputGroup label="Logo URL" value={user.logo} onChange={(v) => {
                                                const newUsersList = [...section.content.users];
                                                newUsersList[idx].logo = v;
                                                handleUpdateContent(section.id, { users: newUsersList });
                                            }} placeholder="https://..." />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!section.content.users || section.content.users.length === 0) && (
                                <div className="py-12 text-center bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
                                    <Users size={32} className="mx-auto mb-2 text-slate-300" />
                                    <p className="text-sm text-slate-500 font-medium">No partners listed yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
              );
          case 'subscription':
              if (activePlanEditIndex !== null && section.content.plans?.[activePlanEditIndex]) {
                  const plan = section.content.plans[activePlanEditIndex];
                  return (
                      <div className="space-y-6 animate-fade-in">
                          <div className="flex items-center justify-between">
                              <button onClick={() => setactivePlanEditIndex(null)} className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                                  <ArrowLeft size={14} /> Back to Plans
                              </button>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Editing Plan #{activePlanEditIndex + 1}</span>
                          </div>

                          <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                  <InputGroup label="Plan Name" value={plan.name} onChange={(v) => {
                                      const newPlans = [...section.content.plans];
                                      newPlans[activePlanEditIndex].name = v;
                                      handleUpdateContent(section.id, { plans: newPlans });
                                  }} />
                                  <div className="flex items-center gap-2 mt-6">
                                      <input 
                                        type="checkbox" 
                                        id="plan-featured"
                                        checked={plan.recommended} 
                                        onChange={(e) => {
                                          const newPlans = [...section.content.plans];
                                          newPlans[activePlanEditIndex].recommended = e.target.checked;
                                          handleUpdateContent(section.id, { plans: newPlans });
                                        }} 
                                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" 
                                      />
                                      <label htmlFor="plan-featured" className="text-xs font-bold text-slate-500 uppercase cursor-pointer">Featured / Recommended</label>
                                  </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                  <InputGroup label="Price (e.g. $29)" value={plan.price} onChange={(v) => {
                                      const newPlans = [...section.content.plans];
                                      newPlans[activePlanEditIndex].price = v;
                                      handleUpdateContent(section.id, { plans: newPlans });
                                  }} />
                                  <InputGroup label="Period (e.g. /mo)" value={plan.period} onChange={(v) => {
                                      const newPlans = [...section.content.plans];
                                      newPlans[activePlanEditIndex].period = v;
                                      handleUpdateContent(section.id, { plans: newPlans });
                                  }} />
                              </div>

                              <InputGroup label="Button Text" value={plan.buttonText} onChange={(v) => {
                                  const newPlans = [...section.content.plans];
                                  newPlans[activePlanEditIndex].buttonText = v;
                                  handleUpdateContent(section.id, { plans: newPlans });
                              }} />

                              <div className="pt-2">
                                  <FeaturesListEditor features={plan.features || []} onChange={(newFeatures) => {
                                      const newPlans = [...section.content.plans];
                                      newPlans[activePlanEditIndex].features = newFeatures;
                                      handleUpdateContent(section.id, { plans: newPlans });
                                  }} />
                              </div>
                          </div>
                      </div>
                  );
              }

              return (
                  <div className="space-y-4">
                      <InputGroup label="Section Title" value={section.content.title} onChange={(v) => handleUpdateContent(section.id, { title: v })} />
                      <InputGroup label="Subtitle" value={section.content.subtitle} onChange={(v) => handleUpdateContent(section.id, { subtitle: v })} />
                      
                      <div className="pt-6 border-t border-slate-200 dark:border-white/10 mt-6">
                          <div className="flex justify-between items-center mb-4">
                              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-widest">Pricing Plans</h4>
                              <button 
                                onClick={() => {
                                    const newPlan = { name: 'New Plan', price: '$0', period: '/mo', features: [], buttonText: 'Select', recommended: false };
                                    const newPlans = [...(section.content.plans || []), newPlan];
                                    handleUpdateContent(section.id, { plans: newPlans });
                                    setactivePlanEditIndex(newPlans.length - 1);
                                }} 
                                className="text-xs bg-primary text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 font-bold shadow-lg shadow-blue-500/20"
                              >
                                  <Plus size={14} /> Add Plan
                              </button>
                          </div>

                          <div className="space-y-3">
                              {(section.content.plans || []).map((plan: any, idx: number) => (
                                  <div 
                                    key={idx} 
                                    className="flex items-center justify-between p-4 bg-white dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-primary/30 transition-all group"
                                  >
                                      <div className="flex items-center gap-4">
                                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${plan.recommended ? 'bg-amber-500/10 text-amber-600' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}>
                                              {plan.recommended ? <Crown size={16} /> : (idx + 1)}
                                          </div>
                                          <div>
                                              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{plan.name || 'Unnamed Plan'}</p>
                                              <p className="text-[10px] text-slate-500 font-bold uppercase">{plan.price} {plan.period}</p>
                                          </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                          <button 
                                            onClick={() => setactivePlanEditIndex(idx)}
                                            className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors"
                                            title="Edit Plan"
                                          >
                                              <Edit3 size={18} />
                                          </button>
                                          <button 
                                            onClick={() => {
                                                const newPlans = section.content.plans.filter((_:any, i:number) => i !== idx);
                                                handleUpdateContent(section.id, { plans: newPlans });
                                            }}
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete Plan"
                                          >
                                              <Trash2 size={18} />
                                          </button>
                                      </div>
                                  </div>
                              ))}
                              {(!section.content.plans || section.content.plans.length === 0) && (
                                  <div className="py-12 text-center bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
                                      <CreditCard size={32} className="mx-auto mb-2 text-slate-300" />
                                      <p className="text-sm text-slate-500">No plans defined yet.</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              );
          case 'footer':
              return (
                  <div className="space-y-4">
                      <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 flex items-start gap-3 mb-2">
                          <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium leading-relaxed">The footer appears at the very bottom of your landing page. Keep the copyright text professional.</p>
                      </div>
                      <InputGroup label="Copyright Text" value={section.content.copyright} onChange={(v) => handleUpdateContent(section.id, { copyright: v })} placeholder="© 2024 Your Store Name. All rights reserved." />
                  </div>
              );
          default:
              return (
                  <div className="space-y-4">
                      {section.content.title !== undefined && <InputGroup label="Title" value={section.content.title} onChange={(v) => handleUpdateContent(section.id, { title: v })} />}
                      {section.content.subtitle !== undefined && <InputGroup label="Subtitle" value={section.content.subtitle} onChange={(v) => handleUpdateContent(section.id, { subtitle: v })} />}
                      <p className="text-xs text-slate-400 italic mt-2">More customization options coming soon for this section type.</p>
                  </div>
              );
      }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* Header */}
      <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"><ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" /></button>
              <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Landing Page Builder</h1>
          </div>
          <button onClick={() => onSave(localSettings)} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 active:scale-95"><Save size={18} /> Save Changes</button>
      </div>

      <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Sections */}
          <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 flex flex-col overflow-hidden shrink-0 z-10 shadow-sm">
              <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 flex justify-between items-center">
                  <h3 className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">Page Structure</h3>
                  <div className="relative">
                      <button onClick={() => setShowAddMenu(!showAddMenu)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"><PlusCircle size={20} /></button>
                      {showAddMenu && (
                          <div className="absolute top-full right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-scale-in">
                              {['hero', 'features', 'video', 'preview', 'users', 'repair', 'subscription', 'footer'].map(type => (
                                  <button key={type} onClick={() => handleAddSection(type as any)} className="w-full px-5 py-3 text-left text-sm hover:bg-primary/5 capitalize text-slate-700 dark:text-slate-200 font-medium flex items-center justify-between group">
                                      {type.replace('_', ' ')}
                                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                                  </button>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                  {sortedSections.map((section, index) => {
                      const Icon = getSectionIcon(section.type);
                      return (
                          <div 
                              key={section.id} 
                              className={`group rounded-2xl border transition-all ${editingSectionId === section.id ? 'bg-primary/5 border-primary shadow-sm scale-[1.02]' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-primary/40'}`}
                          >
                              <div className="p-4 flex items-center gap-4">
                                  <div className="flex items-center justify-center p-2 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-400 group-hover:text-primary transition-colors cursor-grab active:cursor-grabbing">
                                    <GripVertical size={16} />
                                  </div>

                                  <div className="flex-1 cursor-pointer" onClick={() => { setEditingSectionId(section.id); setactivePlanEditIndex(null); }}>
                                      <div className="flex items-center gap-2 mb-1">
                                          <Icon size={16} className={editingSectionId === section.id ? 'text-primary' : 'text-slate-400'} />
                                          <span className={`font-bold text-sm ${editingSectionId === section.id ? 'text-primary' : 'text-slate-800 dark:text-slate-200'}`}>{section.label}</span>
                                      </div>
                                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{section.type.replace('_', ' ')}</p>
                                  </div>

                                  <div className="flex items-center gap-1">
                                      <button onClick={() => handleToggleVisibility(section.id)} className={`p-1.5 rounded-lg transition-colors ${section.visible ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-400 bg-slate-100 dark:bg-white/5'}`} title={section.visible ? 'Visible' : 'Hidden'}>
                                          {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                                      </button>
                                      <button onClick={() => handleDeleteSection(section.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                                  </div>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 bg-slate-50 dark:bg-black/20 overflow-y-auto p-8 no-scrollbar">
              {editingSectionId ? (
                  <div className="max-w-2xl mx-auto animate-view-fade-in">
                      {sortedSections.map(section => {
                          if (section.id !== editingSectionId) return null;
                          return (
                              <div key={section.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                                  <div className="p-8 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 flex justify-between items-center">
                                      <div>
                                          <div className="flex items-center gap-2 text-primary mb-1">
                                              {React.createElement(getSectionIcon(section.type), { size: 18 })}
                                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{section.type.replace('_', ' ')}</span>
                                          </div>
                                          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Edit {section.label}</h2>
                                      </div>
                                      <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase border tracking-widest ${section.visible ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{section.visible ? 'Live' : 'Hidden'}</div>
                                  </div>
                                  <div className="p-8">{renderEditor(section)}</div>
                              </div>
                          );
                      })}
                  </div>
              ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-40">
                      <div className="w-24 h-24 rounded-[2rem] border-4 border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center mb-6">
                        <Layout size={48} />
                      </div>
                      <p className="font-black text-xl tracking-tight">Landing Page Customizer</p>
                      <p className="text-sm font-medium mt-1">Select a section from the left sidebar to start editing.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
