
import React, { useState } from 'react';
import { StoreSettings, LandingPageSection } from '../types';
import { ArrowLeft, Globe, Gift, Eye, Shield, ArrowUp, ArrowDown, EyeOff, Trash2, Plus, Save, Wrench, CreditCard, Video, Users, User, Layout } from 'lucide-react';

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

export const LandingPageBuilderView: React.FC<LandingPageBuilderProps> = ({ settings, onSave, onBack }) => {
  const [localSettings, setLocalSettings] = useState<StoreSettings>(settings);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  // Helper to update sections safely
  const updateSections = (newSections: LandingPageSection[]) => {
      setLocalSettings(prev => ({
          ...prev,
          landingPage: {
              ...prev.landingPage,
              sections: newSections
          }
      }));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
      const sections = [...(localSettings.landingPage?.sections || [])].sort((a, b) => a.order - b.order);
      if (direction === 'up' && index > 0) {
          const temp = sections[index].order;
          sections[index].order = sections[index - 1].order;
          sections[index - 1].order = temp;
      } else if (direction === 'down' && index < sections.length - 1) {
          const temp = sections[index].order;
          sections[index].order = sections[index + 1].order;
          sections[index + 1].order = temp;
      }
      updateSections(sections.sort((a, b) => a.order - b.order));
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

  const handleSave = () => {
      onSave(localSettings);
  };

  const sortedSections = [...(localSettings.landingPage?.sections || [])].sort((a, b) => a.order - b.order);

  // Section Icon Mapping
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
                          <select 
                              className={commonInputClass}
                              value={section.content.layout || 'centered'}
                              onChange={(e) => handleUpdateContent(section.id, { layout: e.target.value })}
                          >
                              <option value="centered">Centered (Default)</option>
                              <option value="split">Split (Left Text / Right Visual)</option>
                              <option value="minimal">Minimal (Clean Text)</option>
                          </select>
                      </div>
                      <InputGroup label="Badge Text" value={section.content.badge} onChange={(v) => handleUpdateContent(section.id, { badge: v })} />
                      <InputGroup label="Title Line 1" value={section.content.title} onChange={(v) => handleUpdateContent(section.id, { title: v })} />
                      <InputGroup label="Title Line 2 (Gradient)" value={section.content.titleGradient} onChange={(v) => handleUpdateContent(section.id, { titleGradient: v })} />
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Subtitle</label>
                          <textarea className={commonInputClass} rows={3} value={section.content.subtitle} onChange={(e) => handleUpdateContent(section.id, { subtitle: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <InputGroup label="Primary Button" value={section.content.ctaPrimary} onChange={(v) => handleUpdateContent(section.id, { ctaPrimary: v })} />
                          <InputGroup label="Primary Link" value={section.content.ctaPrimaryLink} onChange={(v) => handleUpdateContent(section.id, { ctaPrimaryLink: v })} placeholder="#" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <InputGroup label="Secondary Button" value={section.content.ctaSecondary} onChange={(v) => handleUpdateContent(section.id, { ctaSecondary: v })} />
                          <InputGroup label="Secondary Link" value={section.content.ctaSecondaryLink} onChange={(v) => handleUpdateContent(section.id, { ctaSecondaryLink: v })} placeholder="#" />
                      </div>
                  </div>
              );
          case 'video':
              return (
                  <div className="space-y-4">
                      <InputGroup label="Section Title" value={section.content.title} onChange={(v) => handleUpdateContent(section.id, { title: v })} />
                      <InputGroup label="Section Subtitle" value={section.content.subtitle} onChange={(v) => handleUpdateContent(section.id, { subtitle: v })} />
                      <InputGroup label="Video URL (YouTube/Vimeo)" value={section.content.videoUrl} onChange={(v) => handleUpdateContent(section.id, { videoUrl: v })} />
                      
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Layout Style</label>
                          <select 
                              className={commonInputClass}
                              value={section.content.layout || 'classic'}
                              onChange={(e) => handleUpdateContent(section.id, { layout: e.target.value })}
                          >
                              <option value="classic">Classic (Video Left / List Right)</option>
                              <option value="reversed">Reversed (Video Right / List Left)</option>
                              <option value="full">Cinematic (Video Top / Grid Bottom)</option>
                              <option value="modern">Modern (50/50 Split / Grid Right)</option>
                              <option value="minimal">Minimal (Centered Video / Row Bottom)</option>
                              <option value="mixed">Mixed (Video Left / 3 Right & Rest Bottom)</option>
                              <option value="mixed_2r_3b">Hybrid (Video Left / 2 Right & 3 Bottom)</option>
                          </select>
                      </div>

                      <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                          <h4 className="font-bold text-sm mb-3">Video Overlay</h4>
                          <div className="grid grid-cols-2 gap-4">
                              <InputGroup label="Overlay Title" value={section.content.overlayTitle} onChange={(v) => handleUpdateContent(section.id, { overlayTitle: v })} />
                              <InputGroup label="Overlay Subtitle" value={section.content.overlaySubtitle} onChange={(v) => handleUpdateContent(section.id, { overlaySubtitle: v })} />
                          </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                          <div className="flex justify-between items-center mb-2">
                              <h4 className="font-bold text-sm">Feature Highlights</h4>
                              <button 
                                  onClick={() => handleUpdateContent(section.id, { features: [...(section.content.features || []), { title: 'New Feature', desc: 'Feature description', icon: 'Check' }] })}
                                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors flex items-center gap-1 font-bold"
                              >
                                  <Plus size={12} /> Add
                              </button>
                          </div>
                          <div className="space-y-3">
                              {(section.content.features || []).map((feature: any, idx: number) => (
                                  <div key={idx} className="p-3 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5 relative group">
                                      <button 
                                          onClick={() => {
                                              const newFeatures = [...section.content.features];
                                              newFeatures.splice(idx, 1);
                                              handleUpdateContent(section.id, { features: newFeatures });
                                          }}
                                          className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                      >
                                          <Trash2 size={14} />
                                      </button>
                                      <div className="grid grid-cols-2 gap-3 mb-2 pr-8">
                                          <InputGroup label="Feature Title" value={feature.title} onChange={(v) => {
                                              const newFeatures = [...section.content.features];
                                              newFeatures[idx].title = v;
                                              handleUpdateContent(section.id, { features: newFeatures });
                                          }} />
                                          <div className="space-y-1.5">
                                              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Icon</label>
                                              <select 
                                                  className={commonInputClass}
                                                  value={feature.icon}
                                                  onChange={(e) => {
                                                      const newFeatures = [...section.content.features];
                                                      newFeatures[idx].icon = e.target.value;
                                                      handleUpdateContent(section.id, { features: newFeatures });
                                                  }}
                                              >
                                                  {['Store', 'Package', 'ShieldCheck', 'Zap', 'Globe', 'Gift', 'Settings', 'ShoppingCart', 'BarChart3', 'Wrench', 'Sliders', 'LayoutGrid', 'Rocket', 'QrCode', 'Languages'].map(ic => (
                                                      <option key={ic} value={ic}>{ic}</option>
                                                  ))}
                                              </select>
                                          </div>
                                      </div>
                                      <InputGroup label="Description" value={feature.desc} onChange={(v) => {
                                          const newFeatures = [...section.content.features];
                                          newFeatures[idx].desc = v;
                                          handleUpdateContent(section.id, { features: newFeatures });
                                      }} />
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              );
          case 'features':
              return (
                  <div className="space-y-4">
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Layout Style</label>
                          <select 
                              className={commonInputClass}
                              value={section.content.layout || 'grid'}
                              onChange={(e) => handleUpdateContent(section.id, { layout: e.target.value })}
                          >
                              <option value="grid">Grid Cards (Default)</option>
                              <option value="list">Vertical List</option>
                              <option value="minimal">Minimal Icons</option>
                          </select>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-sm">Feature Cards</h4>
                          <button 
                              onClick={() => handleUpdateContent(section.id, { items: [...(section.content.items || []), { title: 'New Feature', desc: 'Description', icon: 'Gift', color: 'blue' }] })}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors flex items-center gap-1 font-bold"
                          >
                              <Plus size={12} /> Add
                          </button>
                      </div>
                      <div className="space-y-3">
                          {(section.content.items || []).map((item: any, idx: number) => (
                              <div key={idx} className="p-3 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5 relative group">
                                  <button 
                                      onClick={() => {
                                          const newItems = [...section.content.items];
                                          newItems.splice(idx, 1);
                                          handleUpdateContent(section.id, { items: newItems });
                                      }}
                                      className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                  >
                                      <Trash2 size={14} />
                                  </button>
                                  <div className="grid grid-cols-2 gap-3 mb-2 pr-8">
                                      <InputGroup label="Title" value={item.title} onChange={(v) => {
                                          const newItems = [...section.content.items];
                                          newItems[idx].title = v;
                                          handleUpdateContent(section.id, { items: newItems });
                                      }} />
                                      <div className="space-y-1.5">
                                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Icon</label>
                                          <select 
                                              className={commonInputClass}
                                              value={item.icon}
                                              onChange={(e) => {
                                                  const newItems = [...section.content.items];
                                                  newItems[idx].icon = e.target.value;
                                                  handleUpdateContent(section.id, { items: newItems });
                                              }}
                                          >
                                              {['Store', 'Package', 'ShieldCheck', 'Zap', 'Globe', 'Gift', 'Settings', 'ShoppingCart', 'BarChart3', 'Wrench', 'Rocket', 'QrCode', 'Languages'].map(ic => (
                                                  <option key={ic} value={ic}>{ic}</option>
                                              ))}
                                          </select>
                                      </div>
                                  </div>
                                  <InputGroup label="Description" value={item.desc} onChange={(v) => {
                                      const newItems = [...section.content.items];
                                      newItems[idx].desc = v;
                                      handleUpdateContent(section.id, { items: newItems });
                                  }} />
                              </div>
                          ))}
                      </div>
                  </div>
              );
          case 'users':
              return (
                  <div className="space-y-4">
                      <InputGroup label="Title" value={section.content.title} onChange={(v) => handleUpdateContent(section.id, { title: v })} />
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Layout Style</label>
                          <select 
                              className={commonInputClass}
                              value={section.content.layout || 'row'}
                              onChange={(e) => handleUpdateContent(section.id, { layout: e.target.value })}
                          >
                              <option value="row">Horizontal Row (Default)</option>
                              <option value="grid">Grid</option>
                              <option value="cards">Card Grid</option>
                          </select>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-sm">Users/Partners</h4>
                          <button 
                              onClick={() => handleUpdateContent(section.id, { users: [...(section.content.users || []), { name: 'New Partner', logo: '' }] })}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors flex items-center gap-1 font-bold"
                          >
                              <Plus size={12} /> Add
                          </button>
                      </div>
                      <div className="space-y-3">
                          {(section.content.users || []).map((user: any, idx: number) => (
                              <div key={idx} className="p-3 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5 relative group">
                                  <button 
                                      onClick={() => {
                                          const newUsers = [...section.content.users];
                                          newUsers.splice(idx, 1);
                                          handleUpdateContent(section.id, { users: newUsers });
                                      }}
                                      className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                  >
                                      <Trash2 size={14} />
                                  </button>
                                  <div className="pr-8 space-y-2">
                                      <InputGroup label="Name" value={user.name} onChange={(v) => {
                                          const newUsers = [...section.content.users];
                                          newUsers[idx].name = v;
                                          handleUpdateContent(section.id, { users: newUsers });
                                      }} />
                                      <InputGroup label="Logo URL (Optional)" value={user.logo} onChange={(v) => {
                                          const newUsers = [...section.content.users];
                                          newUsers[idx].logo = v;
                                          handleUpdateContent(section.id, { users: newUsers });
                                      }} />
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              );
          case 'subscription':
              return (
                  <div className="space-y-4">
                      <InputGroup label="Title" value={section.content.title} onChange={(v) => handleUpdateContent(section.id, { title: v })} />
                      <InputGroup label="Subtitle" value={section.content.subtitle} onChange={(v) => handleUpdateContent(section.id, { subtitle: v })} />
                  </div>
              );
          case 'preview':
              return (
                  <div className="space-y-4">
                      <InputGroup label="Section Title" value={section.content.title} onChange={(v) => handleUpdateContent(section.id, { title: v })} />
                      <p className="text-xs text-slate-500">This section displays a live preview of your product inventory with search and category filters.</p>
                  </div>
              );
          case 'repair':
              return (
                  <div className="space-y-4">
                      <InputGroup label="Title" value={section.content.title} onChange={(v) => handleUpdateContent(section.id, { title: v })} />
                      <InputGroup label="Subtitle" value={section.content.subtitle} onChange={(v) => handleUpdateContent(section.id, { subtitle: v })} />
                  </div>
              );
          case 'customer_dashboard':
              return (
                  <div className="space-y-4">
                      <InputGroup label="Dashboard Title" value={section.content.title} onChange={(v) => handleUpdateContent(section.id, { title: v })} />
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Subtitle</label>
                          <textarea className={commonInputClass} rows={2} value={section.content.subtitle} onChange={(e) => handleUpdateContent(section.id, { subtitle: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <InputGroup label="Points Label" value={section.content.pointsLabel} onChange={(v) => handleUpdateContent(section.id, { pointsLabel: v })} />
                          <InputGroup label="Spent Label" value={section.content.spentLabel} onChange={(v) => handleUpdateContent(section.id, { spentLabel: v })} />
                      </div>
                  </div>
              );
          case 'footer':
              return (
                  <div className="space-y-4">
                      <InputGroup label="Copyright Text" value={section.content.copyright} onChange={(v) => handleUpdateContent(section.id, { copyright: v })} />
                  </div>
              );
          default:
              return (
                  <div className="space-y-4">
                      {section.content.title !== undefined && <InputGroup label="Title" value={section.content.title} onChange={(v) => handleUpdateContent(section.id, { title: v })} />}
                      {section.content.subtitle !== undefined && <InputGroup label="Subtitle" value={section.content.subtitle} onChange={(v) => handleUpdateContent(section.id, { subtitle: v })} />}
                      <p className="text-xs text-slate-400 italic mt-2">More complex editing for this section available in code configuration.</p>
                  </div>
              );
      }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors">
                  <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
              </button>
              <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Landing Page Builder</h1>
          </div>
          <button 
              onClick={handleSave}
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
          >
              <Save size={18} /> Save Changes
          </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Sections List */}
          <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 flex flex-col overflow-hidden shrink-0 z-10">
              <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/20">
                  <h3 className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Sections</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {sortedSections.map((section, index) => {
                      const Icon = getSectionIcon(section.type);
                      return (
                          <div 
                              key={section.id} 
                              className={`rounded-xl border transition-all ${editingSectionId === section.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500/50 shadow-md' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-700'}`}
                          >
                              <div className="p-3 flex items-center gap-3">
                                  <div className="flex flex-col gap-1 text-slate-400">
                                      <button 
                                          disabled={index === 0} 
                                          onClick={(e) => { e.stopPropagation(); handleMoveSection(index, 'up'); }}
                                          className="hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30"
                                      >
                                          <ArrowUp size={14} />
                                      </button>
                                      <button 
                                          disabled={index === sortedSections.length - 1} 
                                          onClick={(e) => { e.stopPropagation(); handleMoveSection(index, 'down'); }}
                                          className="hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30"
                                      >
                                          <ArrowDown size={14} />
                                      </button>
                                  </div>
                                  
                                  <div 
                                      className="flex-1 cursor-pointer"
                                      onClick={() => setEditingSectionId(section.id)}
                                  >
                                      <div className="flex items-center gap-2 mb-1">
                                          <Icon size={16} className={editingSectionId === section.id ? 'text-primary' : 'text-slate-500'} />
                                          <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{section.label}</span>
                                      </div>
                                      <p className="text-[10px] text-slate-500 truncate capitalize">{section.type.replace('_', ' ')}</p>
                                  </div>

                                  <button 
                                      onClick={(e) => { e.stopPropagation(); handleToggleVisibility(section.id); }}
                                      className={`p-1.5 rounded-lg transition-colors ${section.visible ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-400 bg-slate-100 dark:bg-white/5'}`}
                                      title={section.visible ? 'Visible' : 'Hidden'}
                                  >
                                      {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                                  </button>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 bg-slate-50 dark:bg-black/20 overflow-y-auto p-8">
              {editingSectionId ? (
                  <div className="max-w-2xl mx-auto">
                      {sortedSections.map(section => {
                          if (section.id !== editingSectionId) return null;
                          return (
                              <div key={section.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                                  <div className="p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 flex justify-between items-center">
                                      <div>
                                          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Edit {section.label}</h2>
                                          <p className="text-xs text-slate-500 mt-1">Configure content and settings for this section.</p>
                                      </div>
                                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${section.visible ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                          {section.visible ? 'Active' : 'Hidden'}
                                      </div>
                                  </div>
                                  <div className="p-6">
                                      {renderEditor(section)}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <Wrench size={64} className="mb-4 opacity-20" />
                      <p className="font-medium">Select a section from the sidebar to edit content.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
