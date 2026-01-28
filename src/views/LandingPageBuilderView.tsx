
import React, { useState } from 'react';
import { StoreSettings, LandingPageSection } from '../types';
import { ArrowLeft, Globe, Gift, Eye, Shield, ArrowUp, ArrowDown, EyeOff, Trash2, Plus, Save, Wrench, CreditCard, Video, Users, User, Layout, GripVertical, Check, PlusCircle } from 'lucide-react';

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
            {features.map((feature, idx) => (
                <div key={idx} className="flex gap-2">
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
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ))}
            <button 
                onClick={() => onChange([...features, 'New Feature'])}
                className="text-xs text-primary font-bold flex items-center gap-1 hover:underline ml-1"
            >
                <Plus size={12} /> Add Feature
            </button>
        </div>
    );
};

export const LandingPageBuilderView: React.FC<LandingPageBuilderProps> = ({ settings, onSave, onBack }) => {
  const [localSettings, setLocalSettings] = useState<StoreSettings>(settings);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
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
          video: { title: 'Watch Now', videoUrl: '', overlayTitle: 'Video Title' },
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

  const handleDragStart = (index: number) => {
      setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      setDragOverIndex(index);
  };

  const handleDrop = (targetIndex: number) => {
      if (draggedItemIndex === null) return;
      if (draggedItemIndex === targetIndex) {
          setDraggedItemIndex(null);
          setDragOverIndex(null);
          return;
      }

      const sections = [...(localSettings.landingPage?.sections || [])].sort((a, b) => a.order - b.order);
      const itemToMove = sections[draggedItemIndex];
      
      sections.splice(draggedItemIndex, 1);
      sections.splice(targetIndex, 0, itemToMove);
      
      const updatedSections = sections.map((s, i) => ({ ...s, order: i }));
      
      updateSections(updatedSections);
      setDraggedItemIndex(null);
      setDragOverIndex(null);
  };

  const handleToggleVisibility = (id: string) => {
      const sections = (localSettings.landingPage?.sections || []).map(s => 
          s.id === id ? { ...s, visible: !s.visible } : s
      );
      updateSections(sections);
  };

  const handleUpdateContent = (id: string, content: any) => {
      const sections = (localSettings.landingPage?.sections || []).map(s => 
          s.id === id ? { ...s, content: { ...s.content, ...content } } : s
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
                  <div className="space-y-4">
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Layout Style</label>
                          <select className={commonInputClass} value={section.content.layout || 'grid'} onChange={(e) => handleUpdateContent(section.id, { layout: e.target.value })}>
                              <option value="grid">Grid (4 Columns)</option>
                              <option value="list">Vertical List (Focused)</option>
                              <option value="minimal">Minimal Icons (Compact)</option>
                          </select>
                      </div>
                      <div className="flex justify-between items-center mb-2 pt-4 border-t border-slate-200 dark:border-white/10">
                          <h4 className="font-bold text-sm">Feature Items</h4>
                          <button onClick={() => handleUpdateContent(section.id, { items: [...(section.content.items || []), { title: 'New Feature', desc: 'Description', icon: 'Zap', color: 'blue' }] })} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1 font-bold"><Plus size={14} /> Add Feature</button>
                      </div>
                      <div className="space-y-4">
                          {(section.content.items || []).map((item: any, idx: number) => (
                              <div key={idx} className="p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5 relative group shadow-sm">
                                  <button onClick={() => { const newItems = [...section.content.items]; newItems.splice(idx, 1); handleUpdateContent(section.id, { items: newItems }); }} className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3 pr-8">
                                      <InputGroup label="Title" value={item.title} onChange={(v) => { const newItems = [...section.content.items]; newItems[idx].title = v; handleUpdateContent(section.id, { items: newItems }); }} />
                                      <div className="space-y-1.5">
                                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Icon</label>
                                          <select className={commonInputClass} value={item.icon} onChange={(e) => { const newItems = [...section.content.items]; newItems[idx].icon = e.target.value; handleUpdateContent(section.id, { items: newItems }); }}>
                                              {['Rocket', 'QrCode', 'Languages', 'Store', 'Package', 'ShieldCheck', 'Zap', 'Globe', 'Gift', 'Settings', 'ShoppingCart', 'BarChart3', 'Wrench', 'Sliders', 'LayoutGrid'].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                                          </select>
                                      </div>
                                  </div>
                                  <div className="space-y-1.5">
                                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Color Palette</label>
                                      <div className="flex gap-2">
                                          {['blue', 'emerald', 'purple', 'amber', 'red'].map(color => (
                                              <button key={color} type="button" onClick={() => { const newItems = [...section.content.items]; newItems[idx].color = color; handleUpdateContent(section.id, { items: newItems }); }} className={`w-8 h-8 rounded-full border-2 transition-all ${item.color === color ? 'border-primary scale-110 shadow-lg' : 'border-transparent opacity-60'}`} style={{ backgroundColor: color === 'emerald' ? '#10b981' : color === 'amber' ? '#f59e0b' : color === 'red' ? '#ef4444' : color === 'purple' ? '#8b5cf6' : '#3b82f6' }} />
                                          ))}
                                      </div>
                                  </div>
                                  <div className="mt-3">
                                      <InputGroup label="Description" value={item.desc} onChange={(v) => { const newItems = [...section.content.items]; newItems[idx].desc = v; handleUpdateContent(section.id, { items: newItems }); }} />
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              );
          case 'subscription':
              return (
                  <div className="space-y-4">
                      <InputGroup label="Section Title" value={section.content.title} onChange={(v) => handleUpdateContent(section.id, { title: v })} />
                      <InputGroup label="Subtitle" value={section.content.subtitle} onChange={(v) => handleUpdateContent(section.id, { subtitle: v })} />
                      <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                          <div className="flex justify-between items-center mb-3">
                              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Pricing Plans</h4>
                              <button onClick={() => handleUpdateContent(section.id, { plans: [...(section.content.plans || []), { name: 'Pro', price: '$29', period: '/mo', features: ['All access'], buttonText: 'Buy Now', recommended: false }] })} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1 font-bold"><PlusCircle size={14} /> Add Plan</button>
                          </div>
                          <div className="space-y-6">
                              {(section.content.plans || []).map((plan: any, idx: number) => (
                                  <div key={idx} className="p-4 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5 relative group shadow-sm">
                                      <button onClick={() => { const newPlans = [...section.content.plans]; newPlans.splice(idx, 1); handleUpdateContent(section.id, { plans: newPlans }); }} className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                                      <div className="grid grid-cols-2 gap-3 mb-3">
                                          <InputGroup label="Plan Name" value={plan.name} onChange={(v) => { const newPlans = [...section.content.plans]; newPlans[idx].name = v; handleUpdateContent(section.id, { plans: newPlans }); }} />
                                          <div className="flex items-center gap-2 mt-6">
                                              <input type="checkbox" checked={plan.recommended} onChange={(e) => { const newPlans = [...section.content.plans]; newPlans[idx].recommended = e.target.checked; handleUpdateContent(section.id, { plans: newPlans }); }} className="w-4 h-4 rounded border-gray-300 text-primary cursor-pointer" />
                                              <label className="text-xs font-bold text-slate-500 uppercase">Featured</label>
                                          </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-3 mb-3">
                                          <InputGroup label="Price" value={plan.price} onChange={(v) => { const newPlans = [...section.content.plans]; newPlans[idx].price = v; handleUpdateContent(section.id, { plans: newPlans }); }} />
                                          <InputGroup label="Period" value={plan.period} onChange={(v) => { const newPlans = [...section.content.plans]; newPlans[idx].period = v; handleUpdateContent(section.id, { plans: newPlans }); }} />
                                      </div>
                                      <InputGroup label="Button Text" value={plan.buttonText} onChange={(v) => { const newPlans = [...section.content.plans]; newPlans[idx].buttonText = v; handleUpdateContent(section.id, { plans: newPlans }); }} className="mb-3" />
                                      <FeaturesListEditor features={plan.features || []} onChange={(newFeatures) => { const newPlans = [...section.content.plans]; newPlans[idx].features = newFeatures; handleUpdateContent(section.id, { plans: newPlans }); }} />
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              );
          default:
              return (
                  <div className="space-y-4">
                      {section.content.title !== undefined && <InputGroup label="Title" value={section.content.title} onChange={(v) => handleUpdateContent(section.id, { title: v })} />}
                      {section.content.subtitle !== undefined && <InputGroup label="Subtitle" value={section.content.subtitle} onChange={(v) => handleUpdateContent(section.id, { subtitle: v })} />}
                      <p className="text-xs text-slate-400 italic mt-2">Edit content for this {section.type} section.</p>
                  </div>
              );
      }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"><ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" /></button>
              <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Landing Page Builder</h1>
          </div>
          <button onClick={() => onSave(localSettings)} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"><Save size={18} /> Save Changes</button>
      </div>

      <div className="flex-1 flex overflow-hidden">
          <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 flex flex-col overflow-hidden shrink-0 z-10">
              <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 flex justify-between items-center">
                  <h3 className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Page Sections</h3>
                  <div className="relative">
                      <button onClick={() => setShowAddMenu(!showAddMenu)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"><PlusCircle size={20} /></button>
                      {showAddMenu && (
                          <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                              {['hero', 'features', 'video', 'preview', 'users', 'repair', 'subscription'].map(type => (
                                  <button key={type} onClick={() => handleAddSection(type as any)} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-white/5 capitalize text-slate-700 dark:text-slate-200">{type}</button>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                  {sortedSections.map((section, index) => {
                      const Icon = getSectionIcon(section.type);
                      const isDragging = draggedItemIndex === index;
                      const isOver = dragOverIndex === index && draggedItemIndex !== index;
                      return (
                          <div key={section.id}>
                              {isOver && <div className="h-1 bg-primary/40 rounded-full mb-2 animate-pulse"></div>}
                              <div 
                                  className={`group rounded-xl border transition-all ${editingSectionId === section.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500/50 shadow-md scale-[1.02]' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-blue-300'} ${isDragging ? 'opacity-40 grayscale' : ''}`}
                                  draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} onDrop={() => handleDrop(index)}
                              >
                                  <div className="p-3 flex items-center gap-3">
                                      <div className="cursor-grab text-slate-300 hover:text-slate-500 active:cursor-grabbing p-1"><GripVertical size={16} /></div>
                                      <div className="flex-1 cursor-pointer" onClick={() => setEditingSectionId(section.id)}>
                                          <div className="flex items-center gap-2 mb-1">
                                              <Icon size={16} className={editingSectionId === section.id ? 'text-primary' : 'text-slate-500'} />
                                              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{section.label}</span>
                                          </div>
                                          <p className="text-[10px] text-slate-500 truncate capitalize">{section.type.replace('_', ' ')}</p>
                                      </div>
                                      <div className="flex items-center gap-1">
                                          <button onClick={(e) => { e.stopPropagation(); handleToggleVisibility(section.id); }} className={`p-1.5 rounded-lg transition-colors ${section.visible ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-400 bg-slate-100 dark:bg-white/5'}`}>{section.visible ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                                          <button onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id); }} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>

          <div className="flex-1 bg-slate-50 dark:bg-black/20 overflow-y-auto p-8 no-scrollbar">
              {editingSectionId ? (
                  <div className="max-w-2xl mx-auto animate-view-fade-in">
                      {sortedSections.map(section => {
                          if (section.id !== editingSectionId) return null;
                          return (
                              <div key={section.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                                  <div className="p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 flex justify-between items-center">
                                      <div>
                                          <div className="flex items-center gap-2 text-primary mb-1">
                                              {React.createElement(getSectionIcon(section.type), { size: 18 })}
                                              <span className="text-[10px] font-bold uppercase tracking-widest">{section.type.replace('_', ' ')}</span>
                                          </div>
                                          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Edit {section.label}</h2>
                                      </div>
                                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${section.visible ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{section.visible ? 'Active' : 'Hidden'}</div>
                                  </div>
                                  <div className="p-6">{renderEditor(section)}</div>
                              </div>
                          );
                      })}
                  </div>
              ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                      <Layout size={64} className="mb-4" />
                      <p className="font-bold text-lg">Select a section to customize</p>
                      <p className="text-sm">Drag sections in the sidebar to reorder them on your site.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
