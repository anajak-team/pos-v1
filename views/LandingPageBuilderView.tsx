
import React, { useState } from 'react';
import { StoreSettings } from '../types';
import { ArrowLeft, Globe, Gift, Eye, Shield, ArrowUp, ArrowDown, EyeOff, Trash2, Plus, Save, Wrench, CreditCard, Video, Users, Upload } from 'lucide-react';

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

  const handleChange = (newSettings: StoreSettings) => {
      setLocalSettings(newSettings);
  };

  const handleSave = () => {
      onSave(localSettings);
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
      const sections = [...(localSettings.landingPage?.sections || [])];
      if (direction === 'up' && index > 0) {
          [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
          sections.forEach((s, i) => s.order = i);
          handleChange({ ...localSettings, landingPage: { ...localSettings.landingPage, sections } });
      } else if (direction === 'down' && index < sections.length - 1) {
          [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
          sections.forEach((s, i) => s.order = i);
          handleChange({ ...localSettings, landingPage: { ...localSettings.landingPage, sections } });
      }
  };

  const handleToggleSectionVisibility = (index: number) => {
      const sections = [...(localSettings.landingPage?.sections || [])];
      sections[index].visible = !sections[index].visible;
      handleChange({ ...localSettings, landingPage: { ...localSettings.landingPage, sections } });
  };

  const handleUpdateSectionContent = (index: number, content: any) => {
      const sections = [...(localSettings.landingPage?.sections || [])];
      sections[index].content = content;
      handleChange({ ...localSettings, landingPage: { ...localSettings.landingPage, sections } });
  };

  const handleAddFeature = (sectionIndex: number) => {
      const sections = [...(localSettings.landingPage?.sections || [])];
      const currentFeatures = sections[sectionIndex].content.items || [];
      const newFeature = { icon: 'Star', title: 'New Feature', desc: 'Description here', color: 'blue' };
      sections[sectionIndex].content = { ...sections[sectionIndex].content, items: [...currentFeatures, newFeature] };
      handleChange({ ...localSettings, landingPage: { ...localSettings.landingPage, sections } });
  };

  const handleRemoveFeature = (sectionIndex: number, featureIndex: number) => {
      const sections = [...(localSettings.landingPage?.sections || [])];
      const currentFeatures = [...sections[sectionIndex].content.items];
      currentFeatures.splice(featureIndex, 1);
      sections[sectionIndex].content = { ...sections[sectionIndex].content, items: currentFeatures };
      handleChange({ ...localSettings, landingPage: { ...localSettings.landingPage, sections } });
  };

  const handleUpdateFeature = (sectionIndex: number, featureIndex: number, field: string, value: string) => {
      const sections = [...(localSettings.landingPage?.sections || [])];
      const currentFeatures = [...sections[sectionIndex].content.items];
      currentFeatures[featureIndex] = { ...currentFeatures[featureIndex], [field]: value };
      sections[sectionIndex].content = { ...sections[sectionIndex].content, items: currentFeatures };
      handleChange({ ...localSettings, landingPage: { ...localSettings.landingPage, sections } });
  };

  // Subscription Handlers
  const handleAddPlan = (sectionIndex: number) => {
      const sections = [...(localSettings.landingPage?.sections || [])];
      const currentPlans = sections[sectionIndex].content.plans || [];
      const newPlan = { name: 'New Plan', price: '$0', period: '/mo', features: ['Feature 1'], buttonText: 'Select', recommended: false };
      sections[sectionIndex].content = { ...sections[sectionIndex].content, plans: [...currentPlans, newPlan] };
      handleChange({ ...localSettings, landingPage: { ...localSettings.landingPage, sections } });
  };

  const handleRemovePlan = (sectionIndex: number, planIndex: number) => {
      const sections = [...(localSettings.landingPage?.sections || [])];
      const currentPlans = [...sections[sectionIndex].content.plans];
      currentPlans.splice(planIndex, 1);
      sections[sectionIndex].content = { ...sections[sectionIndex].content, plans: currentPlans };
      handleChange({ ...localSettings, landingPage: { ...localSettings.landingPage, sections } });
  };

  const handleUpdatePlan = (sectionIndex: number, planIndex: number, field: string, value: any) => {
      const sections = [...(localSettings.landingPage?.sections || [])];
      const currentPlans = [...sections[sectionIndex].content.plans];
      
      // If setting recommended to true, unset others
      if (field === 'recommended' && value === true) {
          currentPlans.forEach(p => p.recommended = false);
      }
      
      currentPlans[planIndex] = { ...currentPlans[planIndex], [field]: value };
      sections[sectionIndex].content = { ...sections[sectionIndex].content, plans: currentPlans };
      handleChange({ ...localSettings, landingPage: { ...localSettings.landingPage, sections } });
  };

  // Users Handlers
  const handleAddUser = (sectionIndex: number) => {
      const sections = [...(localSettings.landingPage?.sections || [])];
      const currentUsers = sections[sectionIndex].content.users || [];
      sections[sectionIndex].content = { ...sections[sectionIndex].content, users: [...currentUsers, { name: 'New User', logo: '' }] };
      handleChange({ ...localSettings, landingPage: { ...localSettings.landingPage, sections } });
  };

  const handleRemoveUser = (sectionIndex: number, userIndex: number) => {
      const sections = [...(localSettings.landingPage?.sections || [])];
      const currentUsers = [...sections[sectionIndex].content.users];
      currentUsers.splice(userIndex, 1);
      sections[sectionIndex].content = { ...sections[sectionIndex].content, users: currentUsers };
      handleChange({ ...localSettings, landingPage: { ...localSettings.landingPage, sections } });
  };

  const handleUpdateUser = (sectionIndex: number, userIndex: number, field: string, value: string) => {
      const sections = [...(localSettings.landingPage?.sections || [])];
      const currentUsers = [...sections[sectionIndex].content.users];
      currentUsers[userIndex] = { ...currentUsers[userIndex], [field]: value };
      sections[sectionIndex].content = { ...sections[sectionIndex].content, users: currentUsers };
      handleChange({ ...localSettings, landingPage: { ...localSettings.landingPage, sections } });
  };

  const handleLogoUpload = (sectionIndex: number, userIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              handleUpdateUser(sectionIndex, userIndex, 'logo', reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                <ArrowLeft size={24} className="text-slate-700 dark:text-white" />
            </button>
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Landing Page Builder</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Customize your public storefront layout</p>
            </div>
        </div>
        <button onClick={handleSave} className="bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg flex items-center gap-2 hover:bg-blue-600 transition-colors">
            <Save size={20} /> Save Changes
        </button>
      </div>

      <div className="space-y-4">
        {(localSettings.landingPage?.sections || []).map((section, index) => (
            <div key={section.id} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm transition-all">
                {/* Section Header */}
                <div className="p-4 flex items-center justify-between bg-white/40 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${section.visible ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                            {section.type === 'hero' && <Globe size={18} />}
                            {section.type === 'features' && <Gift size={18} />}
                            {section.type === 'video' && <Video size={18} />}
                            {section.type === 'users' && <Users size={18} />}
                            {section.type === 'preview' && <Eye size={18} />}
                            {section.type === 'repair' && <Wrench size={18} />}
                            {section.type === 'subscription' && <CreditCard size={18} />}
                            {section.type === 'footer' && <Shield size={18} />}
                        </div>
                        <span className={`font-bold text-sm ${section.visible ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 decoration-slate-400'}`}>
                            {section.label}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => handleMoveSection(index, 'up')} disabled={index === 0} className="p-1.5 text-slate-500 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg disabled:opacity-30"><ArrowUp size={16}/></button>
                        <button onClick={() => handleMoveSection(index, 'down')} disabled={index === (localSettings.landingPage?.sections.length || 0) - 1} className="p-1.5 text-slate-500 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg disabled:opacity-30"><ArrowDown size={16}/></button>
                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                        <button onClick={() => handleToggleSectionVisibility(index)} className={`p-1.5 rounded-lg transition-colors ${section.visible ? 'text-indigo-600 hover:bg-indigo-50' : 'text-slate-400 hover:bg-slate-100'}`}>{section.visible ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                        <button onClick={() => setEditingSectionId(editingSectionId === section.id ? null : section.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${editingSectionId === section.id ? 'bg-indigo-500 text-white' : 'bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-white/20'}`}>
                            {editingSectionId === section.id ? 'Done' : 'Edit'}
                        </button>
                    </div>
                </div>

                {/* Section Editor */}
                {editingSectionId === section.id && (
                    <div className="p-6 border-t border-white/20 dark:border-white/10 space-y-4 animate-fade-in bg-slate-50/50 dark:bg-black/20">
                        {section.type === 'hero' && (
                            <>
                                <InputGroup label="Badge Text" value={section.content.badge} onChange={(v) => handleUpdateSectionContent(index, { ...section.content, badge: v })} />
                                <InputGroup label="Title Main" value={section.content.title} onChange={(v) => handleUpdateSectionContent(index, { ...section.content, title: v })} />
                                <InputGroup label="Title Gradient" value={section.content.titleGradient} onChange={(v) => handleUpdateSectionContent(index, { ...section.content, titleGradient: v })} />
                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Subtitle</label><textarea value={section.content.subtitle} onChange={(e) => handleUpdateSectionContent(index, { ...section.content, subtitle: e.target.value })} className={commonInputClass} rows={2} /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-3">
                                        <InputGroup label="Primary CTA Text" value={section.content.ctaPrimary} onChange={(v) => handleUpdateSectionContent(index, { ...section.content, ctaPrimary: v })} />
                                        <InputGroup label="Primary CTA Link" value={section.content.ctaPrimaryLink} onChange={(v) => handleUpdateSectionContent(index, { ...section.content, ctaPrimaryLink: v })} placeholder="https://... (Leave empty for login)" />
                                    </div>
                                    <div className="space-y-3">
                                      <InputGroup label="Secondary CTA Text" value={section.content.ctaSecondary} onChange={(v) => handleUpdateSectionContent(index, { ...section.content, ctaSecondary: v })} />
                                      <InputGroup label="Secondary CTA Link" value={section.content.ctaSecondaryLink} onChange={(v) => handleUpdateSectionContent(index, { ...section.content, ctaSecondaryLink: v })} placeholder="https://..." />
                                    </div>
                                </div>
                            </>
                        )}

                        {section.type === 'features' && (
                            <div className="space-y-3">
                                {section.content.items.map((item: any, fIndex: number) => (
                                    <div key={fIndex} className="p-3 bg-white dark:bg-white/5 rounded-xl border border-white/20 dark:border-white/10 relative group">
                                        <button onClick={() => handleRemoveFeature(index, fIndex)} className="absolute top-2 right-2 p-1 text-red-400 hover:bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                                        <div className="grid grid-cols-2 gap-3 mb-2">
                                            <InputGroup label="Title" value={item.title} onChange={(v) => handleUpdateFeature(index, fIndex, 'title', v)} className="flex-1" />
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Icon</label>
                                                <select value={item.icon} onChange={(e) => handleUpdateFeature(index, fIndex, 'icon', e.target.value)} className={commonInputClass + " py-2"}>
                                                    {['ShoppingCart', 'Package', 'BarChart3', 'Wrench', 'Zap', 'ShieldCheck', 'Users', 'Globe', 'Store', 'Gift'].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <textarea value={item.desc} onChange={(e) => handleUpdateFeature(index, fIndex, 'desc', e.target.value)} className={commonInputClass + " text-xs"} rows={2} placeholder="Description" />
                                    </div>
                                ))}
                                <button onClick={() => handleAddFeature(index)} className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl text-slate-500 font-bold text-xs hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"><Plus size={14}/> Add Feature Card</button>
                            </div>
                        )}

                        {section.type === 'video' && (
                            <>
                                <InputGroup label="Section Title" value={section.content.title} onChange={(v) => handleUpdateSectionContent(index, { ...section.content, title: v })} />
                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Subtitle</label><textarea value={section.content.subtitle} onChange={(e) => handleUpdateSectionContent(index, { ...section.content, subtitle: e.target.value })} className={commonInputClass} rows={2} /></div>
                                <InputGroup label="Video Embed URL" value={section.content.videoUrl} onChange={(v) => handleUpdateSectionContent(index, { ...section.content, videoUrl: v })} placeholder="https://www.youtube.com/embed/..." />
                            </>
                        )}

                        {section.type === 'users' && (
                            <div className="space-y-4">
                                <InputGroup label="Section Title" value={section.content.title} onChange={(v) => handleUpdateSectionContent(index, { ...section.content, title: v })} />
                                
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Client Logos / Names</label>
                                    {section.content.users.map((user: any, uIndex: number) => (
                                        <div key={uIndex} className="p-3 bg-white dark:bg-white/5 rounded-xl border border-white/20 dark:border-white/10 relative group flex gap-3 items-start">
                                            <div className="flex-1">
                                                <InputGroup label="Name" value={user.name} onChange={(v) => handleUpdateUser(index, uIndex, 'name', v)} />
                                            </div>
                                            <div className="flex-1 space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Logo</label>
                                                <div className="flex gap-2">
                                                    {user.logo && (
                                                        <div className="w-11 h-11 shrink-0 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-1 shadow-sm">
                                                            <img src={user.logo} alt="logo" className="max-w-full max-h-full object-contain" />
                                                        </div>
                                                    )}
                                                    <div className="relative flex-1">
                                                        <input 
                                                            type="text" 
                                                            value={user.logo || ''} 
                                                            onChange={e => handleUpdateUser(index, uIndex, 'logo', e.target.value)} 
                                                            className="w-full p-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 focus:bg-white/80 dark:focus:bg-black/40 focus:border-primary/50 outline-none transition-all text-slate-800 dark:text-white placeholder:text-slate-400 shadow-inner text-sm pr-10"
                                                            placeholder="https://... or Upload"
                                                        />
                                                        <label className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-200/80 dark:bg-slate-700/80 rounded-lg cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors" title="Upload Image">
                                                            <Upload size={14} className="text-slate-600 dark:text-slate-300"/>
                                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(index, uIndex, e)} />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={() => handleRemoveUser(index, uIndex)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors mt-6"><Trash2 size={16}/></button>
                                        </div>
                                    ))}
                                    <button onClick={() => handleAddUser(index)} className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl text-slate-500 font-bold text-xs hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"><Plus size={14}/> Add User/Client</button>
                                </div>
                            </div>
                        )}

                        {section.type === 'preview' && (
                            <InputGroup label="Section Title" value={section.content.title} onChange={(v) => handleUpdateSectionContent(index, { ...section.content, title: v })} />
                        )}

                        {section.type === 'repair' && (
                            <>
                                <InputGroup label="Section Title" value={section.content.title} onChange={(v) => handleUpdateSectionContent(index, { ...section.content, title: v })} />
                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Subtitle</label><textarea value={section.content.subtitle} onChange={(e) => handleUpdateSectionContent(index, { ...section.content, subtitle: e.target.value })} className={commonInputClass} rows={2} /></div>
                            </>
                        )}

                        {section.type === 'subscription' && (
                            <>
                                <InputGroup label="Section Title" value={section.content.title} onChange={(v) => handleUpdateSectionContent(index, { ...section.content, title: v })} />
                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Subtitle</label><textarea value={section.content.subtitle} onChange={(e) => handleUpdateSectionContent(index, { ...section.content, subtitle: e.target.value })} className={commonInputClass} rows={2} /></div>
                                
                                <div className="space-y-3 mt-4">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Plans</label>
                                    {section.content.plans.map((plan: any, pIndex: number) => (
                                        <div key={pIndex} className={`p-4 rounded-xl border relative ${plan.recommended ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-500/30' : 'bg-white dark:bg-white/5 border-white/20'}`}>
                                            <button onClick={() => handleRemovePlan(index, pIndex)} className="absolute top-2 right-2 p-1 text-red-400 hover:bg-red-500/10 rounded-md transition-opacity"><Trash2 size={14} /></button>
                                            
                                            <div className="grid grid-cols-2 gap-3 mb-2">
                                                <InputGroup label="Plan Name" value={plan.name} onChange={(v) => handleUpdatePlan(index, pIndex, 'name', v)} />
                                                <div className="flex items-center gap-2 mt-6">
                                                    <input type="checkbox" checked={plan.recommended} onChange={(e) => handleUpdatePlan(index, pIndex, 'recommended', e.target.checked)} className="w-4 h-4 accent-primary" />
                                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Recommended</span>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-2 mb-2">
                                                <InputGroup label="Price" value={plan.price} onChange={(v) => handleUpdatePlan(index, pIndex, 'price', v)} />
                                                <InputGroup label="Period" value={plan.period} onChange={(v) => handleUpdatePlan(index, pIndex, 'period', v)} />
                                                <InputGroup label="Btn Text" value={plan.buttonText} onChange={(v) => handleUpdatePlan(index, pIndex, 'buttonText', v)} />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Features (one per line)</label>
                                                <textarea 
                                                    value={Array.isArray(plan.features) ? plan.features.join('\n') : plan.features} 
                                                    onChange={(e) => handleUpdatePlan(index, pIndex, 'features', e.target.value.split('\n'))} 
                                                    className={commonInputClass + " text-xs"} 
                                                    rows={3} 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => handleAddPlan(index)} className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl text-slate-500 font-bold text-xs hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"><Plus size={14}/> Add Plan</button>
                                </div>
                            </>
                        )}

                        {section.type === 'footer' && (
                            <InputGroup label="Copyright Text" value={section.content.copyright} onChange={(v) => handleUpdateSectionContent(index, { ...section.content, copyright: v })} />
                        )}
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};
