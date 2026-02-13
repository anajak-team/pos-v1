import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { StoreSettings, Transaction, PrinterConfig, User, StoredUser, Customer, ViewState } from '../types';
import { Save, Store, Receipt, Database, Percent, Download, AlertTriangle, Volume2, VolumeX, Printer, Plus, Trash2, Wifi, RefreshCw, Loader2, Moon, Sun, Users, Shield, UserPlus, Lock, Mail, FileJson, Coins, Contact, Search, Tag, Upload, Edit, Wallet, Check, X, Crown, Gift, Globe, Layout, ArrowRight, EyeOff, Package, TestTube, FileText, MessageSquare, Send } from 'lucide-react';
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
  
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Staff' as 'Admin' | 'Manager' | 'Staff' | 'Customer' });
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
        variant: 'danger',
        confirmText: 'Import & Overwrite'
    });

    if (isConfirmed) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                await importBackup(e.target?.result as string);
                showToast('Data imported successfully. Reloading...', 'success');
                setTimeout(() => window.location.reload(), 1500);
            } catch (err) {
                showToast('Invalid backup file', 'error');
            }
        };
        reader.readAsText(file);
    }
    event.target.value = ''; // Reset
  };

  const handleClearData = async () => {
      const confirmed = await showConfirm({
          title: 'Factory Reset',
          message: 'DANGER: This will delete ALL products, transactions, and customers. Only the Admin account will remain. This cannot be undone.',
          variant: 'danger',
          confirmText: 'Reset Everything'
      });
      
      if (confirmed) {
          await clearAllData();
          showToast('System reset complete. Reloading...', 'success');
          setTimeout(() => window.location.reload(), 1500);
      }
  };

  // --- Users Handlers ---
  const handleAddUserSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await onAddUser(newUser);
          setNewUser({ name: '', email: '', password: '', role: 'Staff' });
          showToast('User added', 'success');
      } catch (e: any) {
          showToast(e.message || 'Error adding user', 'error');
      }
  };

  // --- Categories Handlers ---
  const handleAddCategory = () => {
      if (newCategory && !categories.includes(newCategory)) {
          onUpdateCategories([...categories, newCategory]);
          setNewCategory('');
      }
  };
  const handleDeleteCategory = (cat: string) => {
      onUpdateCategories(categories.filter(c => c !== cat));
  };
  const startEditingCategory = (cat: string) => {
      setEditingCategory({ original: cat, current: cat });
  };
  const saveCategoryEdit = () => {
      if (editingCategory && editingCategory.current.trim() && editingCategory.current !== editingCategory.original) {
          const updated = categories.map(c => c === editingCategory.original ? editingCategory.current.trim() : c);
          onUpdateCategories(updated);
          onRenameCategory(editingCategory.original, editingCategory.current.trim());
      }
      setEditingCategory(null);
  };

  // --- Printer Handlers ---
  const handleAddPrinter = () => {
      if(newPrinter.name && newPrinter.address) {
          const printer: PrinterConfig = { ...newPrinter, id: Date.now().toString(), status: 'offline' };
          handleChange('printers', [...(formData.printers || []), printer]);
          setNewPrinter({ name: '', address: '', type: 'receipt', paperWidth: '80mm' });
      }
  };
  const handleDeletePrinter = (id: string) => {
      handleChange('printers', (formData.printers || []).filter(p => p.id !== id));
  };

  // --- Customer Handlers ---
  const handleSaveCustomer = async (data: Partial<Customer>) => {
      try {
          if (editingCustomer) {
              await onUpdateCustomer({ ...editingCustomer, ...data } as Customer);
              showToast('Customer updated', 'success');
          } else {
              await onAddCustomer(data as any);
              showToast('Customer created', 'success');
          }
          setShowCustomerModal(false);
          setEditingCustomer(null);
      } catch (e: any) {
          showToast('Error saving customer', 'error');
      }
  };

  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch));

  if (isStaff) {
      return (
          <div className="max-w-2xl mx-auto py-12 text-center">
              <Shield size={64} className="mx-auto text-slate-300 mb-4" />
              <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Restricted Access</h2>
              <p className="text-slate-500">Settings are only available to Admin and Manager accounts.</p>
          </div>
      );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 drop-shadow-sm">{t('SETTINGS')}</h2>
           <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Configure your store preferences</p>
        </div>
        <button onClick={handleSave} className="bg-primary text-white px-8 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 font-bold active:scale-95">
          <Save size={20} /> <span>{t('SAVE')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Profile */}
        <SectionCard title={t('STORE_PROFILE')} icon={Store} colorClass="text-blue-600">
          <InputGroup label="Store Name" value={formData.storeName} onChange={(v) => handleChange('storeName', v)} />
          <div className="grid grid-cols-2 gap-4">
             <InputGroup label="Primary Currency" value={formData.currency} onChange={(v) => handleChange('currency', v)} />
             <InputGroup label="Secondary Currency" value={formData.secondaryCurrency} onChange={(v) => handleChange('secondaryCurrency', v)} />
          </div>
          <InputGroup label="Exchange Rate (1 Primary = ? Secondary)" type="number" value={formData.exchangeRate} onChange={(v) => handleChange('exchangeRate', parseFloat(v))} />
          <div className="flex items-center gap-3 pt-2">
             <button onClick={() => handleChange('enableSound', !formData.enableSound)} className={`p-3 rounded-xl transition-colors ${formData.enableSound ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                {formData.enableSound ? <Volume2 size={20} /> : <VolumeX size={20} />}
             </button>
             <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Sound Effects</span>
          </div>
        </SectionCard>

        {/* Loyalty Program */}
        <SectionCard title="Loyalty Program" icon={Crown} colorClass="text-amber-600">
            <div className="flex items-center gap-3 mb-4">
                <input 
                    type="checkbox" 
                    id="enableLoyalty" 
                    checked={formData.enableLoyalty} 
                    onChange={e => handleChange('enableLoyalty', e.target.checked)} 
                    className="w-5 h-5 rounded text-primary focus:ring-primary bg-slate-200 border-transparent" 
                />
                <label htmlFor="enableLoyalty" className="text-sm font-bold text-slate-700 dark:text-slate-300">Enable Customer Rewards</label>
            </div>
            {formData.enableLoyalty && (
                <div className="space-y-1.5 animate-fade-in">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Loyalty Rate</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            step="0.01"
                            value={formData.loyaltyRate} 
                            onChange={e => handleChange('loyaltyRate', parseFloat(e.target.value))} 
                            className="w-full p-3 pl-3 pr-16 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 focus:bg-white/80 dark:focus:bg-black/40 focus:border-primary/50 outline-none transition-all text-slate-800 dark:text-white shadow-inner text-sm"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Points / {formData.currency}1.00</span>
                    </div>
                    <p className="text-[10px] text-slate-400 ml-1">Customers earn {formData.loyaltyRate} points for every {formData.currency}1.00 spent.</p>
                </div>
            )}
        </SectionCard>

        {/* Receipt & Taxes */}
        <SectionCard title={t('RECEIPT_TAXES')} icon={Receipt} colorClass="text-emerald-600">
           <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Tax Rate (%)" type="number" value={formData.taxRate} onChange={(v) => handleChange('taxRate', parseFloat(v))} />
              <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Paper Size</label>
                  <select 
                    value={formData.receiptPaperSize || '80mm'} 
                    onChange={(e) => handleChange('receiptPaperSize', e.target.value)}
                    className="w-full p-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 outline-none text-slate-800 dark:text-white text-sm"
                  >
                      <option value="80mm">80mm (Standard)</option>
                      <option value="58mm">58mm (Compact)</option>
                  </select>
              </div>
           </div>
           <InputGroup label="Receipt Header" value={formData.receiptHeader} onChange={(v) => handleChange('receiptHeader', v)} />
           <InputGroup label="Receipt Footer" value={formData.receiptFooter} onChange={(v) => handleChange('receiptFooter', v)} />
        </SectionCard>

        {/* Integrations (Telegram) */}
        <SectionCard title="Integrations" icon={MessageSquare} colorClass="text-sky-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                    label="Telegram Bot Token" 
                    value={formData.telegramBotToken || ''} 
                    onChange={(v) => handleChange('telegramBotToken', v)} 
                    placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                />
                <InputGroup 
                    label="Telegram Chat ID" 
                    value={formData.telegramChatId || ''} 
                    onChange={(v) => handleChange('telegramChatId', v)} 
                    placeholder="-1001234567890"
                />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 bg-sky-50 dark:bg-sky-900/10 p-3 rounded-xl border border-sky-100 dark:border-sky-800/30 leading-relaxed">
                Create a bot via <strong className="text-sky-600 dark:text-sky-400">@BotFather</strong> and get the token. Add the bot to your group/channel and get the Chat ID.
            </p>
        </SectionCard>

        {/* Hardware & Printers */}
        <SectionCard title={t('HARDWARE')} icon={Printer} colorClass="text-purple-600">
            <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-white/30 dark:border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Network Printers</h4>
                <div className="space-y-2">
                    {(formData.printers || []).map(p => (
                        <div key={p.id} className="flex justify-between items-center p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                            <div>
                                <div className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
                                    <Wifi size={14} className={p.status === 'online' ? 'text-green-500' : 'text-slate-300'} />
                                    {p.name}
                                </div>
                                <div className="text-xs text-slate-500">{p.address} • {p.type} • {p.paperWidth || '80mm'}</div>
                            </div>
                            <button onClick={() => handleDeletePrinter(p.id)} className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors"><Trash2 size={16}/></button>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                    <input placeholder="Name (e.g. Kitchen)" className="p-2 bg-white dark:bg-white/5 rounded-xl text-sm outline-none border border-transparent focus:border-primary/50" value={newPrinter.name} onChange={e => setNewPrinter({...newPrinter, name: e.target.value})} />
                    <input placeholder="IP Address / ID" className="p-2 bg-white dark:bg-white/5 rounded-xl text-sm outline-none border border-transparent focus:border-primary/50" value={newPrinter.address} onChange={e => setNewPrinter({...newPrinter, address: e.target.value})} />
                    <select className="p-2 bg-white dark:bg-white/5 rounded-xl text-sm outline-none" value={newPrinter.type} onChange={e => setNewPrinter({...newPrinter, type: e.target.value as any})}>
                        <option value="receipt">Receipt Printer</option>
                        <option value="kitchen">Kitchen Printer</option>
                    </select>
                    <select className="p-2 bg-white dark:bg-white/5 rounded-xl text-sm outline-none" value={newPrinter.paperWidth} onChange={e => setNewPrinter({...newPrinter, paperWidth: e.target.value as any})}>
                        <option value="80mm">80mm</option>
                        <option value="58mm">58mm</option>
                    </select>
                    <button onClick={handleAddPrinter} className="col-span-2 bg-slate-800 text-white py-2 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors">Add Printer</button>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <input type="checkbox" id="autoDrawer" checked={formData.autoOpenDrawer} onChange={e => handleChange('autoOpenDrawer', e.target.checked)} className="w-5 h-5 rounded text-primary focus:ring-primary bg-slate-200 border-transparent" />
                <label htmlFor="autoDrawer" className="text-sm font-bold text-slate-700 dark:text-slate-300">Open Cash Drawer on Print</label>
            </div>
        </SectionCard>

        {/* Data Management */}
        <SectionCard title={t('DATA_MANAGEMENT')} icon={Database} colorClass="text-amber-600">
            <div className="grid grid-cols-2 gap-4">
                <button onClick={handleExportData} className="flex flex-col items-center justify-center p-4 bg-emerald-500/10 text-emerald-600 rounded-2xl hover:bg-emerald-500/20 transition-colors border border-emerald-500/20 gap-2">
                    <Download size={24} />
                    <span className="font-bold text-sm">{t('EXPORT')}</span>
                </button>
                <div className="relative">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                    <button onClick={handleImportClick} className="w-full h-full flex flex-col items-center justify-center p-4 bg-blue-500/10 text-blue-600 rounded-2xl hover:bg-blue-500/20 transition-colors border border-blue-500/20 gap-2">
                        <Upload size={24} />
                        <span className="font-bold text-sm">{t('IMPORT')}</span>
                    </button>
                </div>
            </div>
            {isAdmin && (
                <button onClick={handleClearData} className="w-full p-4 mt-2 bg-red-500/10 text-red-600 rounded-2xl hover:bg-red-500/20 transition-colors border border-red-500/20 flex items-center justify-center gap-2">
                    <AlertTriangle size={20} />
                    <span className="font-bold text-sm">Factory Reset Data</span>
                </button>
            )}
        </SectionCard>

        {/* Category Management */}
        <SectionCard title="Product Categories" icon={Tag} colorClass="text-pink-600">
            <div className="flex gap-2 mb-4">
                <input 
                    placeholder="New category name" 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 outline-none text-sm"
                />
                <button onClick={handleAddCategory} className="bg-primary text-white p-3 rounded-xl"><Plus size={20}/></button>
            </div>
            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <div key={cat} className="group flex items-center gap-2 bg-white dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
                        {editingCategory && editingCategory.original === cat ? (
                            <input 
                                autoFocus
                                className="bg-transparent outline-none w-24 text-sm font-bold"
                                value={editingCategory.current}
                                onChange={e => setEditingCategory({...editingCategory, current: e.target.value})}
                                onBlur={saveCategoryEdit}
                                onKeyDown={e => e.key === 'Enter' && saveCategoryEdit()}
                            />
                        ) : (
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer" onDoubleClick={() => startEditingCategory(cat)}>{cat}</span>
                        )}
                        <button onClick={() => handleDeleteCategory(cat)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={14}/></button>
                    </div>
                ))}
            </div>
            <p className="text-xs text-slate-400 mt-2 italic">Double-click a category to rename.</p>
        </SectionCard>

        {/* User Management */}
        {isAdmin && (
            <SectionCard title={t('TEAM')} icon={Users} colorClass="text-indigo-600">
                <div className="space-y-4">
                    <div className="bg-white/40 dark:bg-black/20 rounded-2xl p-4 border border-white/20 dark:border-white/5">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Add Team Member</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <InputGroup label="Name" value={newUser.name} onChange={v => setNewUser({...newUser, name: v})} placeholder="Employee Name" />
                            <InputGroup label="Email" value={newUser.email} onChange={v => setNewUser({...newUser, email: v})} placeholder="login@store.com" />
                            <InputGroup label="Password" type="password" value={newUser.password} onChange={v => setNewUser({...newUser, password: v})} placeholder="••••••" />
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Role</label>
                                <select className="w-full p-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 outline-none text-slate-800 dark:text-white text-sm" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as any})}>
                                    <option value="Staff">Staff (POS Only)</option>
                                    <option value="Manager">Manager (Full Access)</option>
                                    <option value="Admin">Admin (System Control)</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={handleAddUserSubmit} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors text-sm">Add User</button>
                    </div>

                    <div className="space-y-2">
                        {users.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md ${user.role === 'Admin' ? 'bg-purple-500' : user.role === 'Manager' ? 'bg-blue-500' : 'bg-slate-500'}`}>
                                        {user.avatar || user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{user.name}</p>
                                        <p className="text-xs text-slate-500">{user.email} • {user.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingUser(user)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit size={16} /></button>
                                    {user.id !== currentUser.id && (
                                        <button onClick={() => onDeleteUser(user.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </SectionCard>
        )}

        {/* Customer Management */}
        <SectionCard title="Customers" icon={Contact} colorClass="text-orange-600">
            <div className="flex justify-between items-center mb-4">
                <div className="relative flex-1 mr-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        placeholder="Search customers..." 
                        className="w-full pl-9 p-2.5 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 outline-none text-sm"
                        value={customerSearch}
                        onChange={e => setCustomerSearch(e.target.value)}
                    />
                </div>
                <button onClick={() => { setEditingCustomer(null); setShowCustomerModal(true); }} className="bg-orange-500 text-white p-2.5 rounded-xl hover:bg-orange-600 transition-colors shadow-md">
                    <UserPlus size={20} />
                </button>
            </div>
            
            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {filteredCustomers.map(cust => (
                    <div key={cust.id} className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
                        <div>
                            <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">{cust.name}</div>
                            <div className="text-xs text-slate-500">{cust.phone}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 justify-end"><Crown size={10} className="fill-current"/> {cust.points}</div>
                                <div className="text-[10px] text-slate-400">Spent: {settings.currency}{cust.totalSpent.toLocaleString()}</div>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => { setEditingCustomer(cust); setShowCustomerModal(true); }} className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg"><Edit size={14}/></button>
                                <button onClick={() => onDeleteCustomer(cust.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={14}/></button>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredCustomers.length === 0 && <div className="text-center text-slate-400 text-sm py-4">No customers found</div>}
            </div>
        </SectionCard>

        {/* Landing Page Builder Link */}
        <SectionCard title="Online Storefront" icon={Layout} colorClass="text-teal-600">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">Customize your public landing page, loyalty program, and service tracker.</p>
            <button 
                onClick={() => onNavigate('LANDING_BUILDER')}
                className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-teal-500/30 hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
            >
                <Layout size={20} /> Open Page Builder <ArrowRight size={20} />
            </button>
        </SectionCard>
      </div>

      <EditUserModal isOpen={!!editingUser} onClose={() => setEditingUser(null)} user={editingUser} onSave={async (u) => { await onUpdateUser(u); setEditingUser(null); showToast('User updated', 'success'); }} />
      <CustomerModal isOpen={showCustomerModal} onClose={() => setShowCustomerModal(false)} customer={editingCustomer} onSave={handleSaveCustomer} />
    </div>
  );
};