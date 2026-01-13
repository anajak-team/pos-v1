
import { Product, Transaction, StoreSettings, PurchaseOrder, StoredUser, Shift, Customer, Supplier, User, CartItem, Expense, RepairTicket } from '../types';
import { SEED_PRODUCTS } from '../constants';
import { supabase } from './supabaseClient';

// --- Local Storage Keys (Kept only for Cart and Fallback) ---
const KEYS = {
  CART: 'nexus_cart',
};

// --- Default Data ---
const DEFAULT_CATEGORIES = ['Food', 'Beverage', 'Retail', 'Service', 'Other', 'Electronics', 'Apparel', 'Books', 'Home Goods', 'Toys'];
const DEFAULT_EXPENSE_CATEGORIES = ['Rent', 'Utilities', 'Wages', 'Supplies', 'Marketing', 'Other'];
const DEFAULT_USERS: StoredUser[] = [
  { id: 'user1', name: 'Admin User', email: 'admin@nexus.com', password: 'password', role: 'Admin', avatar: 'A' },
  { id: 'user2', name: 'Manager User', email: 'manager@nexus.com', password: 'password', role: 'Manager', avatar: 'M' },
  { id: 'user3', name: 'Staff User', email: 'staff@nexus.com', password: 'password', role: 'Staff', avatar: 'S' },
];
const DEFAULT_SETTINGS: StoreSettings = {
    storeName: 'Anajak POS',
    currency: '$',
    secondaryCurrency: '៛',
    exchangeRate: 4100,
    taxRate: 8,
    lowStockThreshold: 10,
    receiptHeader: 'Thank you for your business!',
    receiptFooter: 'Please come again!',
    enableSound: true,
    theme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    printers: [],
    autoOpenDrawer: true,
    enableLoyalty: true,
    loyaltyRate: 1,
    landingPage: {
        sections: [
            {
                id: 'hero',
                type: 'hero',
                label: 'Hero Section',
                visible: true,
                order: 0,
                content: {
                    badge: 'AI-Powered Retail Management',
                    title: 'The Operating System',
                    titleGradient: 'for Modern Commerce',
                    subtitle: 'Manage sales, inventory, repairs, and expenses in one beautiful, cloud-based platform. Enhanced with Gemini AI for real-time business intelligence.',
                    ctaPrimary: 'Contact Us',
                    ctaSecondary: 'View Demo'
                }
            },
            {
                id: 'features',
                type: 'features',
                label: 'Features Grid',
                visible: true,
                order: 1,
                content: {
                    items: [
                        { icon: 'ShoppingCart', title: 'Smart POS', desc: 'Fast, intuitive checkout with barcode scanning and multiple payment methods.', color: 'blue' },
                        { icon: 'Package', title: 'Inventory Control', desc: 'Track stock in real-time, manage suppliers, and get low-stock alerts.', color: 'emerald' },
                        { icon: 'BarChart3', title: 'AI Analytics', desc: 'Gemini-powered insights to uncover trends and optimize your revenue.', color: 'purple' },
                        { icon: 'Wrench', title: 'Service & Repairs', desc: 'Built-in ticketing system to manage customer repairs and service orders.', color: 'amber' }
                    ]
                }
            },
            {
                id: 'video',
                type: 'video',
                label: 'Video Showcase',
                visible: true,
                order: 2,
                content: {
                    title: 'See It In Action',
                    subtitle: 'Watch how Nexus POS transforms retail operations.',
                    videoUrl: 'https://www.youtube.com/embed/D0cgsCA9tRY'
                }
            },
            {
                id: 'preview',
                type: 'preview',
                label: 'App Preview',
                visible: true,
                order: 3,
                content: {
                    title: 'Interactive Dashboard Preview'
                }
            },
            {
                id: 'users',
                type: 'users',
                label: 'Our Users',
                visible: true,
                order: 4,
                content: {
                    title: 'Trusted by Industry Leaders',
                    users: [
                        { name: 'Coffee House', logo: '' },
                        { name: 'Tech Haven', logo: '' },
                        { name: 'Urban Style', logo: '' },
                        { name: 'Green Market', logo: '' }
                    ]
                }
            },
            {
                id: 'repair',
                type: 'repair',
                label: 'Repair Tracker',
                visible: true,
                order: 5,
                content: {
                    title: 'Track Your Repair',
                    subtitle: 'Enter your ticket number or phone number to check status.'
                }
            },
            {
                id: 'subscription',
                type: 'subscription',
                label: 'Pricing Plans',
                visible: true,
                order: 6,
                content: {
                    title: 'Simple Pricing',
                    subtitle: 'Choose the plan that fits your business needs.',
                    plans: [
                        { name: 'Starter', price: 'Free', period: 'forever', features: ['50 Products', 'Basic Reporting', 'Email Support'], buttonText: 'Start Free', recommended: false },
                        { name: 'Pro', price: '$29', period: '/mo', features: ['Unlimited Products', 'Advanced Analytics', 'Priority Support', 'Inventory Alerts'], buttonText: 'Go Pro', recommended: true },
                        { name: 'Enterprise', price: 'Custom', period: '', features: ['Dedicated Account Manager', 'Custom Integrations', 'SLA Support'], buttonText: 'Contact Sales', recommended: false }
                    ]
                }
            },
            {
                id: 'footer',
                type: 'footer',
                label: 'Footer',
                visible: true,
                order: 7,
                content: {
                    copyright: 'Nexus POS Systems. All rights reserved.'
                }
            }
        ]
    }
};

// --- Demo Helpers ---
const isDemo = () => localStorage.getItem('nexus_demo_mode') === 'true';

const getDemoLocal = <T>(key: string, defaultVal: T): T => {
    try {
        const stored = localStorage.getItem(`demo_${key}`);
        return stored ? JSON.parse(stored) : defaultVal;
    } catch {
        return defaultVal;
    }
};

const saveDemoLocal = (key: string, val: any) => {
    localStorage.setItem(`demo_${key}`, JSON.stringify(val));
};

// --- Config Helpers (Settings, Categories, etc.) ---
const getConfig = async <T>(key: string, defaultValue: T, forceProduction = false): Promise<T> => {
    if (!forceProduction && isDemo()) {
        return getDemoLocal<T>(key, defaultValue);
    }
    const { data, error } = await supabase
        .from('app_config')
        .select('value')
        .eq('key', key)
        .single();
    
    if (error || !data) return defaultValue;
    return data.value as T;
};

const saveConfig = async <T>(key: string, value: T): Promise<T> => {
    if (isDemo()) {
        saveDemoLocal(key, value);
        return value;
    }
    const { error } = await supabase
        .from('app_config')
        .upsert({ key, value });
    
    if (error) console.error(`Error saving config ${key}:`, error);
    return value;
};

// --- API Implementation ---

// --- Products ---
export const getProducts = async (forceProduction = false): Promise<Product[]> => {
    if (!forceProduction && isDemo()) return getDemoLocal('products', SEED_PRODUCTS);
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }
    return data || [];
};

export const addProduct = async (product: Partial<Product>): Promise<Product> => {
    const newProduct = {
        ...product,
        id: product.id || `prod-${Date.now()}`,
        name: product.name || 'Unnamed Product',
        price: product.price || 0,
        cost: product.cost || 0,
        category: product.category || 'Other',
        stock: product.stock || 0,
    } as Product;

    if (isDemo()) {
        const products = getDemoLocal('products', SEED_PRODUCTS);
        products.push(newProduct);
        saveDemoLocal('products', products);
        return newProduct;
    }

    const { data, error } = await supabase.from('products').insert(newProduct).select().single();
    if (error) throw error;
    return data;
};

export const updateProduct = async (product: Product): Promise<Product> => {
    if (isDemo()) {
        const products = getDemoLocal('products', SEED_PRODUCTS);
        const index = products.findIndex(p => p.id === product.id);
        if (index !== -1) {
            products[index] = product;
            saveDemoLocal('products', products);
        }
        return product;
    }
    const { data, error } = await supabase.from('products').update(product).eq('id', product.id).select().single();
    if (error) throw error;
    return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
    if (isDemo()) {
        const products = getDemoLocal('products', SEED_PRODUCTS);
        saveDemoLocal('products', products.filter(p => p.id !== id));
        return;
    }
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
};

export const saveProducts = async (products: Product[]): Promise<void> => {
    if (isDemo()) {
        const currentProducts = getDemoLocal<Product[]>('products', SEED_PRODUCTS);
        
        // Create a map for faster lookup
        const productMap = new Map(currentProducts.map(p => [p.id, p]));
        
        // Update or add new products (Merge)
        products.forEach(p => {
            productMap.set(p.id, p);
        });
        
        // Convert back to array
        const updatedList = Array.from(productMap.values());
        
        saveDemoLocal('products', updatedList);
        return;
    }
    const { error } = await supabase.from('products').upsert(products);
    if (error) throw error;
};

// --- Transactions ---
export const getTransactions = async (): Promise<Transaction[]> => {
    if (isDemo()) return getDemoLocal('transactions', []);
    const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false }).limit(2000);
    if (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
    return data || [];
};

export const saveTransaction = async (transaction: Transaction): Promise<Transaction> => {
    const newTransaction = { ...transaction, id: transaction.id || `trx-${Date.now()}` };
    if (isDemo()) {
        const transactions = getDemoLocal('transactions', []);
        transactions.unshift(newTransaction);
        saveDemoLocal('transactions', transactions);
        return newTransaction;
    }
    const { data, error } = await supabase.from('transactions').insert(newTransaction).select().single();
    if (error) throw error;
    return data;
};

// --- Settings ---
export const getSettings = async (forceProduction = false): Promise<StoreSettings> => {
    const settings = await getConfig<StoreSettings>('settings', DEFAULT_SETTINGS, forceProduction);
    
    // Merge Landing Page Sections logic (keep identical to ensure consistency)
    if (settings && settings.landingPage && settings.landingPage.sections) {
        const dbSections = settings.landingPage.sections;
        const defaultSections = DEFAULT_SETTINGS.landingPage.sections;
        const missingSections = defaultSections.filter(ds => !dbSections.find(dbs => dbs.id === ds.id));
        
        if (missingSections.length > 0) {
            return {
                ...settings,
                landingPage: {
                    ...settings.landingPage,
                    sections: [...dbSections, ...missingSections].sort((a, b) => a.order - b.order)
                }
            };
        }
    }
    return settings;
};

export const saveSettings = async (settings: StoreSettings): Promise<StoreSettings> => {
    return saveConfig<StoreSettings>('settings', settings);
};

// --- Users ---
export const getUsers = async (): Promise<StoredUser[]> => {
    if (isDemo()) return getDemoLocal('users', DEFAULT_USERS);
    const { data, error } = await supabase.from('users').select('*');
    if (error || !data || data.length === 0) {
        if (data && data.length === 0) {
             await supabase.from('users').insert(DEFAULT_USERS);
             return DEFAULT_USERS;
        }
        return [];
    }
    return data;
};

export const addUser = async (user: Omit<StoredUser, 'id'>): Promise<StoredUser> => {
    const newUser = { ...user, id: `user-${Date.now()}` };
    if (isDemo()) {
        const users = getDemoLocal('users', DEFAULT_USERS);
        users.push(newUser);
        saveDemoLocal('users', users);
        return newUser;
    }
    const { data, error } = await supabase.from('users').insert(newUser).select().single();
    if (error) throw error;
    return data;
};

export const updateUser = async (user: StoredUser): Promise<StoredUser> => {
    if (isDemo()) {
        const users = getDemoLocal('users', DEFAULT_USERS);
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = user;
            saveDemoLocal('users', users);
        }
        return user;
    }
    const { data, error } = await supabase.from('users').update(user).eq('id', user.id).select().single();
    if (error) throw error;
    return data;
};

export const deleteUser = async (userId: string): Promise<void> => {
    if (isDemo()) {
        const users = getDemoLocal('users', DEFAULT_USERS);
        saveDemoLocal('users', users.filter(u => u.id !== userId));
        return;
    }
    const { error } = await supabase.from('users').delete().eq('id', userId);
    if (error) throw error;
};

// --- Shifts ---
export const getShifts = async (): Promise<Shift[]> => {
    if (isDemo()) return getDemoLocal('shifts', []);
    const { data, error } = await supabase.from('shifts').select('*').order('startTime', { ascending: false });
    if (error) return [];
    return data || [];
};

export const getActiveShift = async (): Promise<Shift | null> => {
    if (isDemo()) {
        const shifts = getDemoLocal<Shift[]>('shifts', []);
        return shifts.find(s => s.status === 'OPEN') || null;
    }
    const { data, error } = await supabase.from('shifts').select('*').eq('status', 'OPEN').single();
    if (error) return null;
    return data;
};

export const saveShift = async (shift: Partial<Shift>): Promise<Shift> => {
    if (isDemo()) {
        const shifts = getDemoLocal<Shift[]>('shifts', []);
        let savedShift: Shift;
        if (shift.id) {
            const index = shifts.findIndex(s => s.id === shift.id);
            if (index !== -1) {
                shifts[index] = { ...shifts[index], ...shift } as Shift;
                savedShift = shifts[index];
            } else {
                throw new Error("Shift not found");
            }
        } else {
            savedShift = { ...shift, id: `shift-${Date.now()}` } as Shift;
            shifts.unshift(savedShift);
        }
        saveDemoLocal('shifts', shifts);
        return savedShift;
    }

    let result;
    if (shift.id) {
        result = await supabase.from('shifts').update(shift).eq('id', shift.id).select().single();
    } else {
        const newShift = { ...shift, id: `shift-${Date.now()}` };
        result = await supabase.from('shifts').insert(newShift).select().single();
    }
    if (result.error) throw result.error;
    return result.data;
};

// --- Customers ---
export const getCustomers = async (): Promise<Customer[]> => {
    if (isDemo()) return getDemoLocal('customers', []);
    const { data, error } = await supabase.from('customers').select('*');
    if (error) return [];
    return data || [];
};

export const addCustomer = async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
    const newCustomer = { ...customer, id: `cust-${Date.now()}`, points: customer.points || 0 };
    if (isDemo()) {
        const customers = getDemoLocal('customers', []);
        customers.push(newCustomer);
        saveDemoLocal('customers', customers);
        return newCustomer;
    }
    const { data, error } = await supabase.from('customers').insert(newCustomer).select().single();
    if (error) throw error;
    return data;
};

export const updateCustomer = async (customer: Customer): Promise<Customer> => {
    if (isDemo()) {
        const customers = getDemoLocal('customers', []);
        const index = customers.findIndex(c => c.id === customer.id);
        if (index !== -1) {
            customers[index] = customer;
            saveDemoLocal('customers', customers);
        }
        return customer;
    }
    const { data, error } = await supabase.from('customers').update(customer).eq('id', customer.id).select().single();
    if (error) throw error;
    return data;
};

export const updateCustomerStats = async (customerId: string, transactionTotal: number): Promise<void> => {
    if (isDemo()) {
        const customers = getDemoLocal<Customer[]>('customers', []);
        const idx = customers.findIndex(c => c.id === customerId);
        if (idx !== -1) {
            const customer = customers[idx];
            const settings = await getSettings();
            const pointsEarned = (settings.enableLoyalty !== false) ? Math.floor(transactionTotal * (settings.loyaltyRate || 1)) : 0;
            customers[idx] = {
                ...customer,
                totalSpent: (customer.totalSpent || 0) + transactionTotal,
                visits: (customer.visits || 0) + 1,
                lastVisit: new Date().toISOString(),
                points: (customer.points || 0) + pointsEarned
            };
            saveDemoLocal('customers', customers);
        }
        return;
    }

    const { data: customer } = await supabase.from('customers').select('*').eq('id', customerId).single();
    if (!customer) return;

    const settings = await getSettings();
    const pointsEarned = (settings.enableLoyalty !== false) 
        ? Math.floor(transactionTotal * (settings.loyaltyRate || 1)) 
        : 0;

    const updates = {
        totalSpent: (customer.totalSpent || 0) + transactionTotal,
        visits: (customer.visits || 0) + 1,
        lastVisit: new Date().toISOString(),
        points: (customer.points || 0) + pointsEarned
    };

    await supabase.from('customers').update(updates).eq('id', customerId);
};

export const deleteCustomer = async (customerId: string): Promise<void> => {
    if (isDemo()) {
        const customers = getDemoLocal('customers', []);
        saveDemoLocal('customers', customers.filter(c => c.id !== customerId));
        return;
    }
    const { error } = await supabase.from('customers').delete().eq('id', customerId);
    if (error) throw error;
};

// --- Suppliers ---
export const getSuppliers = async (): Promise<Supplier[]> => {
    if (isDemo()) return getDemoLocal('suppliers', []);
    const { data, error } = await supabase.from('suppliers').select('*');
    if (error) return [];
    return data || [];
};

export const addSupplier = async (supplier: Omit<Supplier, 'id'>): Promise<Supplier> => {
    const newSupplier = { ...supplier, id: `sup-${Date.now()}` };
    if (isDemo()) {
        const suppliers = getDemoLocal('suppliers', []);
        suppliers.push(newSupplier);
        saveDemoLocal('suppliers', suppliers);
        return newSupplier;
    }
    const { data, error } = await supabase.from('suppliers').insert(newSupplier).select().single();
    if (error) throw error;
    return data;
};

export const updateSupplier = async (supplier: Supplier): Promise<Supplier> => {
    if (isDemo()) {
        const suppliers = getDemoLocal('suppliers', []);
        const idx = suppliers.findIndex(s => s.id === supplier.id);
        if (idx !== -1) {
            suppliers[idx] = supplier;
            saveDemoLocal('suppliers', suppliers);
        }
        return supplier;
    }
    const { data, error } = await supabase.from('suppliers').update(supplier).eq('id', supplier.id).select().single();
    if (error) throw error;
    return data;
};

export const deleteSupplier = async (supplierId: string): Promise<void> => {
    if (isDemo()) {
        const suppliers = getDemoLocal('suppliers', []);
        saveDemoLocal('suppliers', suppliers.filter(s => s.id !== supplierId));
        return;
    }
    const { error } = await supabase.from('suppliers').delete().eq('id', supplierId);
    if (error) throw error;
};

// --- Categories ---
export const getCategories = async (): Promise<string[]> => {
    return getConfig<string[]>('categories', DEFAULT_CATEGORIES);
};

export const saveCategories = async (categories: string[]): Promise<string[]> => {
    return saveConfig<string[]>('categories', categories);
};

// --- Expenses ---
export const getExpenses = async (): Promise<Expense[]> => {
    if (isDemo()) return getDemoLocal('expenses', []);
    const { data, error } = await supabase.from('expenses').select('*');
    if (error) return [];
    return data || [];
};

export const addExpense = async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
    const newExpense = { ...expense, id: `exp-${Date.now()}` };
    if (isDemo()) {
        const expenses = getDemoLocal('expenses', []);
        expenses.push(newExpense);
        saveDemoLocal('expenses', expenses);
        return newExpense;
    }
    const { data, error } = await supabase.from('expenses').insert(newExpense).select().single();
    if (error) throw error;
    return data;
};

export const deleteExpense = async (id: string): Promise<void> => {
    if (isDemo()) {
        const expenses = getDemoLocal('expenses', []);
        saveDemoLocal('expenses', expenses.filter(e => e.id !== id));
        return;
    }
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
};

export const getExpenseCategories = async (): Promise<string[]> => {
    return getConfig<string[]>('expense_categories', DEFAULT_EXPENSE_CATEGORIES);
};

export const saveExpenseCategories = async (categories: string[]): Promise<string[]> => {
    return saveConfig<string[]>('expense_categories', categories);
};

// --- Repair Tickets ---
export const getRepairs = async (): Promise<RepairTicket[]> => {
    if (isDemo()) return getDemoLocal('repairs', []);
    const { data, error } = await supabase.from('repairs').select('*').order('updatedAt', { ascending: false });
    if (error) return [];
    return data || [];
};

export const addRepair = async (repair: Omit<RepairTicket, 'id' | 'createdAt' | 'updatedAt'>): Promise<RepairTicket> => {
    const now = new Date().toISOString();
    const newRepair = {
        ...repair,
        id: `rep-${Date.now()}`,
        createdAt: now,
        updatedAt: now
    } as RepairTicket;

    if (isDemo()) {
        const repairs = getDemoLocal('repairs', []);
        repairs.unshift(newRepair);
        saveDemoLocal('repairs', repairs);
        return newRepair;
    }

    const { data, error } = await supabase.from('repairs').insert(newRepair).select().single();
    if (error) throw error;
    return data;
};

export const updateRepair = async (repair: RepairTicket): Promise<RepairTicket> => {
    if (isDemo()) {
        const repairs = getDemoLocal('repairs', []);
        const idx = repairs.findIndex(r => r.id === repair.id);
        if (idx !== -1) {
            repairs[idx] = { ...repair, updatedAt: new Date().toISOString() };
            saveDemoLocal('repairs', repairs);
            return repairs[idx];
        }
        return repair;
    }
    const updated = { ...repair, updatedAt: new Date().toISOString() };
    const { data, error } = await supabase.from('repairs').update(updated).eq('id', repair.id).select().single();
    if (error) throw error;
    return data;
};

export const deleteRepair = async (id: string): Promise<void> => {
    if (isDemo()) {
        const repairs = getDemoLocal('repairs', []);
        saveDemoLocal('repairs', repairs.filter(r => r.id !== id));
        return;
    }
    const { error } = await supabase.from('repairs').delete().eq('id', id);
    if (error) throw error;
};

// --- Purchase Orders ---
export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
    if (isDemo()) return getDemoLocal('purchase_orders', []);
    const { data, error } = await supabase.from('purchase_orders').select('*').order('date', { ascending: false });
    if (error) return [];
    return data || [];
};

export const savePurchaseOrder = async (order: PurchaseOrder): Promise<PurchaseOrder> => {
    if (isDemo()) {
        const orders = getDemoLocal('purchase_orders', []);
        const idx = orders.findIndex(o => o.id === order.id);
        if (idx !== -1) {
            orders[idx] = order;
        } else {
            orders.unshift({ ...order, id: order.id || `po-${Date.now()}` });
        }
        saveDemoLocal('purchase_orders', orders);
        return order;
    }

    const { data: existing } = await supabase.from('purchase_orders').select('id').eq('id', order.id).single();
    if (existing) {
        const { data, error } = await supabase.from('purchase_orders').update(order).eq('id', order.id).select().single();
        if (error) throw error;
        return data;
    } else {
        const newOrder = { ...order, id: order.id || `po-${Date.now()}` };
        const { data, error } = await supabase.from('purchase_orders').insert(newOrder).select().single();
        if (error) throw error;
        return data;
    }
};

// --- Connection Check ---
export const checkConnection = async (): Promise<boolean> => {
    try {
        const { error } = await supabase.from('products').select('count', { count: 'exact', head: true });
        return !error;
    } catch {
        return false;
    }
};

// --- Data Management (Backup/Restore) ---
export const exportFullBackup = async (): Promise<void> => {
    const backupData: { [key: string]: any } = {
        backupVersion: '2.0',
        exportedAt: new Date().toISOString()
    };
    
    // Fetch all collections using current mode functions
    backupData['products'] = await getProducts();
    backupData['transactions'] = await getTransactions();
    backupData['settings'] = await getSettings();
    backupData['users'] = await getUsers();
    backupData['shifts'] = await getShifts();
    backupData['customers'] = await getCustomers();
    backupData['suppliers'] = await getSuppliers();
    backupData['categories'] = await getCategories();
    backupData['expenses'] = await getExpenses();
    backupData['expense_categories'] = await getExpenseCategories();
    backupData['repairs'] = await getRepairs();
    backupData['purchase_orders'] = await getPurchaseOrders();

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_backup_${isDemo() ? 'demo_' : ''}${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const importBackup = async (jsonString: string): Promise<void> => {
    try {
        const backupData = JSON.parse(jsonString);
        if (!backupData.backupVersion || !backupData.exportedAt) {
            throw new Error("Invalid backup file format.");
        }

        if (isDemo()) {
            if (backupData['products']) saveDemoLocal('products', backupData['products']);
            if (backupData['transactions']) saveDemoLocal('transactions', backupData['transactions']);
            if (backupData['users']) saveDemoLocal('users', backupData['users']);
            if (backupData['customers']) saveDemoLocal('customers', backupData['customers']);
            if (backupData['suppliers']) saveDemoLocal('suppliers', backupData['suppliers']);
            if (backupData['shifts']) saveDemoLocal('shifts', backupData['shifts']);
            if (backupData['expenses']) saveDemoLocal('expenses', backupData['expenses']);
            if (backupData['repairs']) saveDemoLocal('repairs', backupData['repairs']);
            if (backupData['purchase_orders']) saveDemoLocal('purchase_orders', backupData['purchase_orders']);
            
            if (backupData['settings']) saveDemoLocal('settings', backupData['settings']);
            if (backupData['categories']) saveDemoLocal('categories', backupData['categories']);
            if (backupData['expense_categories']) saveDemoLocal('expense_categories', backupData['expense_categories']);
            return;
        }

        // Supabase Restore
        if (backupData['products']) await supabase.from('products').upsert(backupData['products']);
        if (backupData['transactions']) await supabase.from('transactions').upsert(backupData['transactions']);
        if (backupData['users']) await supabase.from('users').upsert(backupData['users']);
        if (backupData['customers']) await supabase.from('customers').upsert(backupData['customers']);
        if (backupData['suppliers']) await supabase.from('suppliers').upsert(backupData['suppliers']);
        if (backupData['shifts']) await supabase.from('shifts').upsert(backupData['shifts']);
        if (backupData['expenses']) await supabase.from('expenses').upsert(backupData['expenses']);
        if (backupData['repairs']) await supabase.from('repairs').upsert(backupData['repairs']);
        if (backupData['purchase_orders']) await supabase.from('purchase_orders').upsert(backupData['purchase_orders']);
        
        if (backupData['settings']) await saveConfig('settings', backupData['settings']);
        if (backupData['categories']) await saveConfig('categories', backupData['categories']);
        if (backupData['expense_categories']) await saveConfig('expense_categories', backupData['expense_categories']);

    } catch (error) {
        console.error("Error importing backup data", error);
        throw error;
    }
};

export const clearAllData = async (): Promise<void> => {
    if (isDemo()) {
        localStorage.clear();
        return;
    }
    
    // CAUTION: This wipes data in Supabase
    
    // 1. Clear Transactional & Inventory Data
    await supabase.from('products').delete().neq('id', '0');
    await supabase.from('transactions').delete().neq('id', '0');
    await supabase.from('customers').delete().neq('id', '0');
    await supabase.from('suppliers').delete().neq('id', '0');
    await supabase.from('shifts').delete().neq('id', '0');
    await supabase.from('expenses').delete().neq('id', '0');
    await supabase.from('repairs').delete().neq('id', '0');
    await supabase.from('purchase_orders').delete().neq('id', '0');
    await supabase.from('app_config').delete().neq('key', '0');
    
    // 2. Clear Users EXCEPT Admins
    // We keep accounts with role 'Admin' so the business owner isn't locked out.
    await supabase.from('users').delete().neq('role', 'Admin');
    
    // 3. Reseed Default Data
    await supabase.from('products').insert(SEED_PRODUCTS);
    
    // Note: We do NOT reseed DEFAULT_USERS here to avoid duplicates/conflicts 
    // since we preserved the existing Admin(s).
    
    await saveConfig('settings', DEFAULT_SETTINGS);
    await saveConfig('categories', DEFAULT_CATEGORIES);
    await saveConfig('expense_categories', DEFAULT_EXPENSE_CATEGORIES);
};

// --- Cart (Remains Synchronous Local Storage) ---
export const getCart = (): CartItem[] => {
  try {
    const cartJson = localStorage.getItem(KEYS.CART);
    return cartJson ? JSON.parse(cartJson) : [];
  } catch (error) {
    console.error("Could not get cart from local storage", error);
    return [];
  }
};
export const saveCart = (cart: CartItem[]): void => {
  try {
    localStorage.setItem(KEYS.CART, JSON.stringify(cart));
  } catch (error) {
    console.error("Could not save cart to local storage", error);
  }
};
