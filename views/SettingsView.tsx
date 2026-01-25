
import React, { useState, useEffect, useRef } from 'react';
import { StoreSettings, Transaction, PrinterConfig, User, StoredUser, Customer, ViewState } from '../types';
import { Save, Store, Receipt, Database, Percent, Download, AlertTriangle, Volume2, VolumeX, Printer, Plus, Trash2, Wifi, RefreshCw, Loader2, Moon, Sun, Users, Shield, UserPlus, Lock, Mail, FileJson, Coins, Contact, Search, Tag, Upload, Edit, Wallet, Check, X, Crown, Gift, Globe, Layout, ArrowRight, EyeOff, Package, TestTube, FileText } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useAlert } from '../components/Alert';
import { exportFullBackup, importBackup, clearAllData } from '../services/storageService';
import { TRANSLATIONS } from '../translations';

interface SettingsViewProps {
  settings: StoreSettings;
  onSave: (settings: StoreSettings) => void;
  transactions: Transaction[];
  currentUser: User;
  categories: string[];
  onUpdateCategories: (categories: string[]) => void;
  onRenameCategory: (oldName: string, newName: string) => void;
  users: StoredUser[];
  onAddUser: (user: Omit<StoredUser, 'id'>) => Promise<void>;
  onUpdateUser: (user: StoredUser) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id'>) => Promise<void | Customer>;
  onUpdateCustomer: (customer: Customer) => Promise<void>;
  onDeleteCustomer: (customerId: string) => Promise<void>;
  onNavigate: (view: ViewState) => void;
}

interface SectionCardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  colorClass: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon: Icon, children, colorClass }) => (
  <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-lg transition-all hover:bg-white/50 dark:hover:bg-slate-900/50">
    <div className="flex items-center gap-3 mb-6">
      <div className={`p-2.5 ${colorClass} bg-opacity-20 rounded-2xl shadow-sm`}>
        <Icon size={22} />
      </div>
      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{title}</h3>
    </div>
    <div className="space-y-5">{children}</div>
  </div>
);

interface InputGroupProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, type = "text", value, onChange, placeholder, className }) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">{label}</label>
    <input 
      type={type} 
      value={value || ''} 
      onChange={e => onChange(e.target.value)} 
      className="w-full p-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 focus:bg-white/80 dark:focus:bg-black/40 focus:border-primary/50 outline-none transition-all text-slate-800 dark:text-white placeholder:text-slate-400 shadow-inner text-sm"
      placeholder={placeholder}
    />
  </div>
);

// Edit User Modal
const EditUserModal = ({ isOpen, onClose, user, onSave }: { isOpen: boolean, onClose: () => void, user: StoredUser | null, onSave: (user: StoredUser) => void }) => {
  const [formData, setFormData] = useState<Partial<StoredUser>>({});

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as StoredUser);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl w-full max-w-lg border border-white/20">
        <div className="p-6 border-b border-white/10"><h3 className="text-xl font-bold">Edit User: {user.name}</h3></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <InputGroup label="Full Name" value={formData.name || ''} onChange={(v) => setFormData(f => ({...f, name: v}))} />
          <InputGroup label="Email Address" type="email" value={formData.email || ''} onChange={(v) => setFormData(f => ({...f, email: v}))} />
          <InputGroup label="Password" type="text" value={formData.password || ''} onChange={(v) => setFormData(f => ({...f, password: v}))} placeholder="Enter new password" />
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-slate-600 hover:bg-white/40">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Customer Modal (Add/Edit)
const CustomerModal = ({ isOpen, onClose, customer, onSave }: { isOpen: boolean, onClose: () => void, customer: Customer | null, onSave: (customer: Partial<Customer>) => void }) => {
  const [formData, setFormData] = useState<Partial<Customer>>({});

  useEffect(() => {
    if (customer) {
        setFormData(customer);
    } else {
        setFormData({ name: '', phone: '', email: '', points: 0 });
    }
  }, [customer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
        onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl w-full max-w-lg border border-white/20">
        <div className="p-6 border-b border-white/10"><h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{customer ? 'Edit Customer' : 'Add New Customer'}</h3></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <InputGroup label="Full Name" value={formData.name || ''} onChange={(v) => setFormData(f => ({...f, name: v}))} />
          <InputGroup label="Phone Number" value={formData.phone || ''} onChange={(v) => setFormData(f => ({...f, phone: v}))} />
          <InputGroup label="Email Address" type="email" value={formData.email || ''} onChange={(v) => setFormData(f => ({...f, email: v}))} />
          
          <div className="pt-2 border-t border-white/10">
             <InputGroup label="Loyalty Points" type="number" value={formData.points || 0} onChange={(v) => setFormData(f => ({...f, points: parseInt(v) || 0}))} />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-slate-600 hover:bg-white/40">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg">{customer ? 'Save Changes' : 'Create Customer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const SettingsView: React.FC<SettingsViewProps> = (props) => {
  const { settings, onSave, currentUser, categories, onUpdateCategories, onRenameCategory, users, onAddUser, onUpdateUser, onDeleteUser, customers, onAddCustomer, onUpdateCustomer, onDeleteCustomer, onNavigate } = props;
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const isStaff = currentUser.role === 'Staff';
  const isAdmin = currentUser.role === 'Admin';
  
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Staff' as 'Admin' | 'Manager' | 'Staff' });
  const [customerSearch, setCustomerSearch] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingUser, setEditingUser] = useState<StoredUser | null>(null);
  
  // Customer Modal State
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  // Category Edit State
  const [editingCategory, setEditingCategory] = useState<{ original: string, current: string } | null>(null);
  
  // Printer State
  const [newPrinter, setNewPrinter] = useState<{name: string, address: string, type: 'receipt' | 'kitchen', paperWidth: '58mm' | '80mm'}>({ name: '', address: '', type: 'receipt', paperWidth: '80mm' });

  const { showToast } = useToast();
  const { showConfirm } = useAlert();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync settings prop to state
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // Translation Helper
  const t = (key: keyof typeof TRANSLATIONS.en) => {
    const lang = settings?.language || 'en';
    // @ts-ignore
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key];
  };

  const handleChange = (field: keyof StoreSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // --- General Handlers ---
  const handleSave = () => onSave(formData);
  const handleExportData = async () => { try { await exportFullBackup(); showToast('Backup exported', 'success'); } catch (e) { showToast('Export failed', 'error'); }};
  const handleImportClick = () => fileInputRef.current?.click();
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => { 
    const file = event.target.files?.[0]; 
    if (!file) return; 
    
    const isConfirmed = await showConfirm({
        title: 'Import Data',
        message: 'WARNING: This will overwrite ALL existing data. Are you sure you want to continue?',
        variant: 'warning',
        confirmText: 'Import'
    });

    if (isConfirmed) { 
        const reader = new FileReader(); 
        reader.onload = async (e) => { 
            const content = e.target?.result; 
            if (typeof content === 'string') { 
                try { 
                    await importBackup(content); 
                    showToast('Import successful! App will reload.', 'success'); 
                    setTimeout(() => window.location.reload(), 1500); 
                } catch (error) { 
                    showToast('Import failed. Invalid file.', 'error'); 
                } 
            } 
        }; 
        reader.readAsText(file); 
    } 
    event.target.value = ''; 
  };

  const handleFactoryReset = async () => { 
      const isConfirmed = await showConfirm({
          title: 'Factory Reset',
          message: 'WARNING: This will delete ALL data (Products, Sales, Customers, etc) except Admin accounts. Are you sure?',
          variant: 'danger',
          confirmText: 'Reset Everything'
      });

      if (isConfirmed) { 
          clearAllData().then(() => window.location.reload()); 
      }
  };

  // User Handlers
  const handleAddUser = async () => { if (newUser.name && newUser.email && newUser.password) { await onAddUser({ ...newUser, avatar: newUser.name.charAt(0).toUpperCase() }); setNewUser({ name: '', email: '', password: '', role: 'Staff' }); showToast('User added', 'success'); } };
  
  const handleDeleteUser = async (id: string) => { 
      if (id === currentUser.id) { showToast("You cannot delete your own account", 'error'); return; } 
      const confirmed = await showConfirm({ title: 'Delete User', message: 'Are you sure you want to delete this user?', variant: 'danger' });
      if (confirmed) { await onDeleteUser(id); showToast('User deleted', 'info'); } 
  };

  const handleUpdateUserRole = async (user: StoredUser, newRole: 'Admin' | 'Manager' | 'Staff') => { if (user.id === currentUser.id) { showToast("You cannot change your own role", 'error'); return; } const updatedUser = { ...user, role: newRole }; await onUpdateUser(updatedUser); showToast(`Updated ${user.name}'s role`, 'success'); };
  const handleSaveUserEdit = async (user: StoredUser) => { await onUpdateUser(user); showToast('User updated', 'success'); setEditingUser(null); };

  // Customer Handlers
  const handleDeleteCustomer = async (id: string) => { 
      const confirmed = await showConfirm({ title: 'Delete Customer', message: 'Delete this customer and their history?', variant: 'danger' });
      if (confirmed) { await onDeleteCustomer(id); showToast('Customer deleted', 'info'); }
  };
  
  const handleAddCustomerClick = () => { setEditingCustomer(null); setShowCustomerModal(true); };
  const handleEditCustomerClick = (customer: Customer) => { setEditingCustomer(customer); setShowCustomerModal(true); };
  const handleCustomerSave = async (data: Partial<Customer>) => { try { if (editingCustomer) { await onUpdateCustomer({ ...editingCustomer, ...data } as Customer); showToast('Customer updated', 'success'); } else { if (data.name && data.phone) { await onAddCustomer({ name: data.name, phone: data.phone, email: data.email, points: data.points || 0, totalSpent: 0, visits: 0, lastVisit: new Date().toISOString() }); showToast('Customer added', 'success'); } } setShowCustomerModal(false); setEditingCustomer(null); } catch (error) { showToast('Failed to save customer', 'error'); } };
  const filteredCustomers = (customers || []).filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch));
  
  // Category Handlers
  const handleAddCategory = () => { const trimmed = newCategory.trim(); if (trimmed && !categories.find(c => c.toLowerCase() === trimmed.toLowerCase())) { onUpdateCategories([...categories, trimmed]); setNewCategory(''); showToast('Category added', 'success'); } else { showToast('Category already exists', 'error'); } };
  const handleDeleteCategory = async (cat: string) => { 
      const confirmed = await showConfirm({ title: 'Delete Category', message: `Delete category "${cat}"?`, variant: 'warning' });
      if (confirmed) { onUpdateCategories(categories.filter(c => c !== cat)); showToast('Category deleted', 'info'); } 
  };
  
  const startEditingCategory = (cat: string) => { setEditingCategory({ original: cat, current: cat }); };
  const saveEditingCategory = () => { if (editingCategory && editingCategory.current.trim() && editingCategory.current !== editingCategory.original) { onRenameCategory(editingCategory.original, editingCategory.current.trim()); setEditingCategory(null); showToast('Category updated', 'success'); } else { setEditingCategory(null); } };

  // Printer Handlers
  const handleAddPrinter = () => { 
      if (newPrinter.name && newPrinter.address) { 
          const printer: PrinterConfig = { 
              id: Date.now().toString(), 
              name: newPrinter.name, 
              address: newPrinter.address, 
              type: newPrinter.type, 
              status: 'online',
              paperWidth: newPrinter.paperWidth
          }; 
          handleChange('printers', [...(formData.printers || []), printer]); 
          setNewPrinter({ name: '', address: '', type: 'receipt', paperWidth: '80mm' }); 
          showToast('Printer added (Remember to Save)', 'success'); 
      } else { 
          showToast('Please fill printer details', 'error'); 
      } 
  };
  const handleDeletePrinter = (index: number) => { const updated = [...(formData.printers || [])]; updated.splice(index, 1); handleChange('printers', updated); };
  const handleTestPrint = (printer: PrinterConfig) => {
      showToast(`Test print sent to ${printer.name} (${printer.address})`, 'info');
      // In a real app, this would perform a network request
  };

  const commonInputClass = "w-full p-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 focus:bg-white/80 dark:focus:bg-black/40 focus:border-primary/50 outline-none transition-all text-slate-800 dark:text-white placeholder:text-slate-400 shadow-inner text-sm";

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-end"><h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 drop-shadow-sm">{t('SETTINGS')}</h2><button onClick={handleSave} className="bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg flex items-center gap-2 hover:bg-blue-600 transition-colors active:scale-95"><Save size={20} /> <span className="hidden sm:inline">{t('SAVE')}</span></button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title={t('STORE_PROFILE')} icon={Store} colorClass="bg-blue-500 text-blue-600 dark:text-blue-400">
            {!isStaff && (
              <>
                <InputGroup label="Store Name" value={formData.storeName} onChange={(v: string) => handleChange('storeName', v)} />
                <div className="grid grid-cols-2 gap-3 pt-2">
                   <InputGroup label="Currency Symbol" value={formData.currency} onChange={(v) => handleChange('currency', v)} placeholder="$" />
                   <InputGroup label="Low Stock Alert" type="number" value={formData.lowStockThreshold} onChange={(v) => handleChange('lowStockThreshold', parseInt(v) || 0)} />
                </div>
                <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/20">
                        <div className="flex items-center gap-3"><div className={`p-2 rounded-xl ${formData.showStockLevels !== false ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-200 text-slate-500'}`}><Package size={20} /></div><span className="font-bold text-sm text-slate-700 dark:text-slate-200">Show Stock Levels in POS</span></div>
                        <button onClick={() => handleChange('showStockLevels', !(formData.showStockLevels !== false))} className={`w-12 h-6 rounded-full transition-colors relative ${formData.showStockLevels !== false ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}><div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.showStockLevels !== false ? 'translate-x-6' : ''}`} /></button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/20">
                        <div className="flex items-center gap-3"><div className={`p-2 rounded-xl ${formData.hideOutOfStockProducts ? 'bg-slate-500/20 text-slate-600 dark:text-slate-400' : 'bg-slate-200 text-slate-500'}`}><EyeOff size={20} /></div><span className="font-bold text-sm text-slate-700 dark:text-slate-200">Hide Out of Stock Items</span></div>
                        <button onClick={() => handleChange('hideOutOfStockProducts', !formData.hideOutOfStockProducts)} className={`w-12 h-6 rounded-full transition-colors relative ${formData.hideOutOfStockProducts ? 'bg-slate-600' : 'bg-slate-300 dark:bg-slate-600'}`}><div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.hideOutOfStockProducts ? 'translate-x-6' : ''}`} /></button>
                    </div>
                </div>
              </>
            )}
            <div className="space-y-1.5 pt-2"><label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">{t('APPEARANCE')}</label><div className="grid grid-cols-2 gap-3"><button onClick={() => handleChange('theme', 'light')} className={`flex items-center justify-center gap-2 p-3 rounded-2xl border ${formData.theme === 'light' ? 'bg-blue-500/20 text-blue-700' : 'bg-white/30 text-slate-500'}`}><Sun size={18}/> {t('THEME_LIGHT')}</button><button onClick={() => handleChange('theme', 'dark')} className={`flex items-center justify-center gap-2 p-3 rounded-2xl border ${formData.theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/30 text-slate-500'}`}><Moon size={18}/> {t('THEME_DARK')}</button></div></div>
        </SectionCard>
        
        {isAdmin && (
            <SectionCard title="Online Presence" icon={Globe} colorClass="bg-indigo-500 text-indigo-600 dark:text-indigo-400">
                <div className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300">Customize your customer-facing landing page layout and content.</p>
                    <button 
                        onClick={() => onNavigate('LANDING_BUILDER')}
                        className="w-full py-3 bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-indigo-600 transition-colors"
                    >
                        <Layout size={18} /> Open Landing Page Builder <ArrowRight size={18} />
                    </button>
                </div>
            </SectionCard>
        )}
        
        {!isStaff && (
          <>
            <SectionCard title={t('RECEIPT_TAXES')} icon={Receipt} colorClass="bg-purple-500 text-purple-600 dark:text-purple-400">
              <div className="space-y-3">
                <textarea value={formData.receiptHeader} onChange={e => handleChange('receiptHeader', e.target.value)} className={commonInputClass} rows={2} placeholder="Receipt Header" />
                <textarea value={formData.receiptFooter} onChange={e => handleChange('receiptFooter', e.target.value)} className={commonInputClass} rows={2} placeholder="Receipt Footer" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Tax Rate %</label><div className="relative"><Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="number" value={formData.taxRate || ''} onChange={e => handleChange('taxRate', parseFloat(e.target.value) || 0)} className={`${commonInputClass} pl-10`} /></div></div>
                  <InputGroup label="2nd Currency" value={formData.secondaryCurrency} onChange={(v) => handleChange('secondaryCurrency', v)} placeholder="Optional (e.g. €)" />
                </div>
                {formData.secondaryCurrency && (<InputGroup label={`Exchange Rate (1 ${formData.currency} = ? ${formData.secondaryCurrency})`} type="number" value={formData.exchangeRate} onChange={(v) => handleChange('exchangeRate', parseFloat(v) || 0)} />)}
                
                <div className="pt-2 border-t border-white/10 space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1 flex items-center gap-1"><FileText size={14}/> Paper Size</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => handleChange('receiptPaperSize', '80mm')} 
                            className={`py-2 rounded-xl text-xs font-bold border transition-colors ${formData.receiptPaperSize === '80mm' || !formData.receiptPaperSize ? 'bg-primary text-white border-primary' : 'bg-white/50 dark:bg-black/20 text-slate-600 dark:text-slate-300 border-white/30 dark:border-white/10'}`}
                        >
                            80mm (Standard)
                        </button>
                        <button 
                            onClick={() => handleChange('receiptPaperSize', '58mm')} 
                            className={`py-2 rounded-xl text-xs font-bold border transition-colors ${formData.receiptPaperSize === '58mm' ? 'bg-primary text-white border-primary' : 'bg-white/50 dark:bg-black/20 text-slate-600 dark:text-slate-300 border-white/30 dark:border-white/10'}`}
                        >
                            58mm (Small)
                        </button>
                    </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Loyalty Program" icon={Gift} colorClass="bg-amber-500 text-amber-600 dark:text-amber-400">
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/20">
                        <div className="flex items-center gap-3"><div className={`p-2 rounded-xl ${formData.enableLoyalty !== false ? 'bg-amber-500/20 text-amber-600' : 'bg-slate-200 text-slate-500'}`}><Crown size={20} /></div><span className="font-bold text-sm text-slate-700 dark:text-slate-200">Enable Customer Loyalty</span></div>
                        <button onClick={() => handleChange('enableLoyalty', !(formData.enableLoyalty !== false))} className={`w-12 h-6 rounded-full transition-colors relative ${formData.enableLoyalty !== false ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'}`}><div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.enableLoyalty !== false ? 'translate-x-6' : ''}`} /></button>
                    </div>
                    {formData.enableLoyalty !== false && (<div className="space-y-1.5 animate-fade-in"><label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Earning Rate</label><div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 p-3 rounded-2xl border border-white/30 dark:border-white/10"><span className="text-sm text-slate-600 dark:text-slate-300 font-medium">Earn</span><input type="number" min="0.1" step="0.1" className="w-20 p-2 text-center bg-white dark:bg-slate-800 rounded-lg font-bold border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500" value={formData.loyaltyRate || 1} onChange={(e) => handleChange('loyaltyRate', parseFloat(e.target.value) || 0)} /><span className="text-sm text-slate-600 dark:text-slate-300 font-medium">point(s) per {formData.currency}1 spent</span></div></div>)}
                </div>
            </SectionCard>
          </>
        )}

        {!isStaff && <SectionCard title={t('HARDWARE')} icon={Printer} colorClass="bg-orange-500 text-orange-600 dark:text-orange-400">
            <div className="space-y-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/20"><div className="flex items-center gap-3"><div className={`p-2 rounded-xl ${formData.enableSound ? 'bg-blue-500/20 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>{formData.enableSound ? <Volume2 size={20} /> : <VolumeX size={20} />}</div><span className="font-bold text-sm text-slate-700 dark:text-slate-200">Sound Effects</span></div><button onClick={() => handleChange('enableSound', !formData.enableSound)} className={`w-12 h-6 rounded-full transition-colors relative ${formData.enableSound ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}><div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.enableSound ? 'translate-x-6' : ''}`} /></button></div>
                    <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/20"><div className="flex items-center gap-3"><div className={`p-2 rounded-xl ${formData.autoOpenDrawer ? 'bg-green-500/20 text-green-600' : 'bg-slate-200 text-slate-500'}`}><Wallet size={20} /></div><span className="font-bold text-sm text-slate-700 dark:text-slate-200">Auto-Open Drawer (Cash)</span></div><button onClick={() => handleChange('autoOpenDrawer', !formData.autoOpenDrawer)} className={`w-12 h-6 rounded-full transition-colors relative ${formData.autoOpenDrawer ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}><div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.autoOpenDrawer ? 'translate-x-6' : ''}`} /></button></div>
                </div>
                <div className="pt-2 border-t border-white/10">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 ml-1">Network Printers</h4>
                    <div className="space-y-2 mb-3">
                        {(formData.printers || []).map((printer, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-white/40 dark:bg-white/5 rounded-xl border border-white/20">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                                        <Printer size={16} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-xs text-slate-800 dark:text-slate-200">{printer.name}</div>
                                        <div className="text-[10px] text-slate-500 flex items-center gap-2">
                                            <span>{printer.address}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                            <span className="uppercase">{printer.type}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                            <span>{printer.paperWidth || '80mm'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => handleTestPrint(printer)} className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg" title="Test Print"><TestTube size={14}/></button>
                                    <button onClick={() => handleDeletePrinter(idx)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg" title="Delete"><Trash2 size={14}/></button>
                                </div>
                            </div>
                        ))}
                        {(!formData.printers || formData.printers.length === 0) && <div className="text-center text-xs text-slate-400 py-2">No printers configured</div>}
                    </div>
                    
                    <div className="bg-white/30 dark:bg-black/10 p-3 rounded-xl space-y-2">
                        <input placeholder="Printer Name (e.g. Counter)" className={commonInputClass + " py-2 text-xs"} value={newPrinter.name} onChange={e => setNewPrinter({...newPrinter, name: e.target.value})} />
                        <div className="flex gap-2">
                            <input placeholder="IP / URL" className={commonInputClass + " py-2 text-xs flex-1"} value={newPrinter.address} onChange={e => setNewPrinter({...newPrinter, address: e.target.value})} />
                            <select className={commonInputClass + " py-2 text-xs w-24"} value={newPrinter.type} onChange={e => setNewPrinter({...newPrinter, type: e.target.value as any})}>
                                <option value="receipt">Receipt</option>
                                <option value="kitchen">Kitchen</option>
                            </select>
                        </div>
                        <div className="flex gap-2 items-center">
                             <select className={commonInputClass + " py-2 text-xs flex-1"} value={newPrinter.paperWidth} onChange={e => setNewPrinter({...newPrinter, paperWidth: e.target.value as any})}>
                                <option value="80mm">80mm Paper</option>
                                <option value="58mm">58mm Paper</option>
                            </select>
                            <button onClick={handleAddPrinter} className="flex-1 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors shadow-md">Add Printer</button>
                        </div>
                    </div>
                </div>
            </div>
        </SectionCard>}
        
        {isAdmin && (
          <SectionCard title={t('TEAM')} icon={Users} colorClass="bg-teal-500 text-teal-600 dark:text-teal-400">
             <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
               {users.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/20">
                     <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">{user.avatar || user.name.charAt(0)}</div><div><div className="font-bold text-sm">{user.name}</div><div className="text-xs text-slate-500">{user.email}</div></div></div>
                     <div className="flex items-center gap-1">
                        <select value={user.role} onChange={(e) => handleUpdateUserRole(user, e.target.value as any)} className="bg-transparent text-xs font-bold py-1 px-2 rounded-lg border-none outline-none" disabled={user.id === currentUser.id}><option>Admin</option><option>Manager</option><option>Staff</option></select>
                        <button onClick={() => setEditingUser(user)} className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg"><Edit size={16} /></button>
                        {user.id !== currentUser.id && <button onClick={() => handleDeleteUser(user.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>}
                     </div>
                  </div>
               ))}
            </div>
            <div className="pt-4 border-t border-white/10"><h4 className="text-xs font-bold text-slate-500 uppercase mb-3 ml-1 flex items-center gap-1"><UserPlus size={14}/> Add User</h4><div className="space-y-3"><div className="grid grid-cols-2 gap-3"><input placeholder="Full Name" className={commonInputClass} value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} /><select className={commonInputClass} value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as any})}><option>Staff</option><option>Manager</option><option>Admin</option></select></div><input type="email" placeholder="Email Address" className={commonInputClass} value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} /><input type="password" placeholder="Password" className={commonInputClass} value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} /><button onClick={handleAddUser} className="w-full py-3 bg-teal-600 text-white rounded-2xl font-bold">Create</button></div></div>
          </SectionCard>
        )}
        
        {!isStaff && <SectionCard title={t('CATEGORY')} icon={Tag} colorClass="bg-cyan-500 text-cyan-600 dark:text-cyan-400">
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {categories.map(cat => (
                    <div key={cat} className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/20">
                        {editingCategory?.original === cat ? (
                            <div className="flex items-center gap-2 w-full"><input autoFocus className="flex-1 bg-white dark:bg-black/20 p-2 rounded-lg border border-primary/50 outline-none text-sm text-slate-800 dark:text-slate-100" value={editingCategory.current} onChange={e => setEditingCategory({...editingCategory, current: e.target.value})} onKeyDown={e => { if(e.key === 'Enter') saveEditingCategory(); if(e.key === 'Escape') setEditingCategory(null); }} /><button onClick={saveEditingCategory} className="p-1.5 text-green-600 hover:bg-green-500/10 rounded-lg"><Check size={16} /></button><button onClick={() => setEditingCategory(null)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"><X size={16} /></button></div>
                        ) : (
                            <><span className="font-bold text-sm text-slate-700 dark:text-slate-200">{cat}</span><div className="flex gap-1"><button onClick={() => startEditingCategory(cat)} className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg"><Edit size={16} /></button><button onClick={() => handleDeleteCategory(cat)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={16} /></button></div></>
                        )}
                    </div>
                ))}
            </div>
            <div className="pt-2 border-t border-white/10"><div className="flex gap-2"><input placeholder="New category name..." className={commonInputClass} value={newCategory} onChange={e => setNewCategory(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()} /><button onClick={handleAddCategory} className="p-3 bg-primary text-white rounded-2xl font-bold"><Plus size={20} /></button></div></div>
        </SectionCard>}
        
        <SectionCard title={t('DATA_MANAGEMENT')} icon={Database} colorClass="bg-slate-500 text-slate-600 dark:text-slate-400">
            <div className="space-y-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                        <input 
                            placeholder={t('SEARCH')} 
                            className={commonInputClass + " pl-10"} 
                            value={customerSearch} 
                            onChange={e => setCustomerSearch(e.target.value)} 
                        />
                    </div>
                    <button onClick={handleAddCustomerClick} className="p-3 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 transition-colors">
                        <UserPlus size={20} />
                    </button>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {filteredCustomers.map(cust => (
                        <div key={cust.id} className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/20">
                            <div>
                                <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{cust.name}</div>
                                <div className="text-xs text-slate-500">{cust.phone}</div>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => handleEditCustomerClick(cust)} className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg"><Edit size={16} /></button>
                                <button onClick={() => handleDeleteCustomer(cust.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                    {filteredCustomers.length === 0 && <div className="text-center text-xs text-slate-400 py-2">No customers found</div>}
                </div>
            </div>
        </SectionCard>

        {isAdmin && <SectionCard title={t('DATA_MANAGEMENT')} icon={Database} colorClass="bg-slate-500 text-slate-600 dark:text-slate-400">
            <div className="grid grid-cols-2 gap-3">
                <button onClick={handleExportData} className="flex flex-col items-center justify-center p-4 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/20 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all gap-2 group">
                    <Download size={24} className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{t('EXPORT')}</span>
                </button>
                <button onClick={handleImportClick} className="flex flex-col items-center justify-center p-4 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/20 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all gap-2 group">
                    <Upload size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{t('IMPORT')}</span>
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
            </div>
            <button onClick={handleFactoryReset} className="w-full mt-2 p-3 bg-red-500/10 text-red-600 rounded-xl font-bold text-xs hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center gap-2">
                <AlertTriangle size={16} /> Factory Reset
            </button>
        </SectionCard>}
      </div>

      <EditUserModal isOpen={!!editingUser} user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveUserEdit} />
      <CustomerModal isOpen={showCustomerModal} customer={editingCustomer} onClose={() => setShowCustomerModal(false)} onSave={handleCustomerSave} />
    </div>
  );
};
