
export interface Product {
  id: string;
  name: string;
  price: number;
  cost?: number; // Cost of goods sold
  category: string;
  stock: number;
  image?: string; // URL or base64
  description?: string;
  barcode?: string;
  itemsPerCase?: number;
  zone?: string; // Physical location (e.g., Aisle 1, Warehouse B)
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  date: string; // ISO string
  items: CartItem[];
  total: number;
  tax: number;
  discount?: number;
  paymentMethod: 'cash' | 'card' | 'digital';
  shiftId?: string;
  customerId?: string;
  customerName?: string;
  type: 'sale' | 'return';
  originalTransactionId?: string; // For returns
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  status: 'Ordered' | 'Received';
  items: PurchaseItem[];
  totalCost: number;
  expectedDelivery?: string;
}

export type ViewState = 'DASHBOARD' | 'POS' | 'INVENTORY' | 'TRANSACTIONS' | 'PURCHASES' | 'EXPENSES' | 'REPORTS' | 'SETTINGS' | 'REPAIRS' | 'LANDING_BUILDER' | 'LOGIN' | 'SIGNUP' | 'CUSTOMER_DASHBOARD';

export interface SalesMetric {
  date: string;
  amount: number;
}

export interface PrinterConfig {
  id: string;
  name: string;
  type: 'receipt' | 'kitchen';
  address: string; // IP address or identifier
  status: 'online' | 'offline';
  paperWidth?: '58mm' | '80mm';
}

export interface LandingPageSection {
  id: string;
  type: 'hero' | 'features' | 'preview' | 'footer' | 'repair' | 'subscription' | 'video' | 'users' | 'customer_dashboard';
  label: string; // Display name for Admin UI
  visible: boolean;
  order: number;
  content: any; // Dynamic content based on type
}

export interface LandingPageConfig {
  sections: LandingPageSection[];
}

export interface StoreSettings {
  storeName: string;
  currency: string;
  secondaryCurrency: string;
  exchangeRate: number;
  taxRate: number;
  lowStockThreshold: number;
  receiptHeader: string;
  receiptFooter: string;
  receiptPaperSize?: '58mm' | '80mm';
  enableSound: boolean;
  theme: 'light' | 'dark';
  primaryColor?: string; // Format: "R G B" e.g., "37 99 235"
  printers: PrinterConfig[];
  autoOpenDrawer?: boolean;
  enableLoyalty: boolean;
  loyaltyRate: number; // Points earned per 1 currency unit
  hideOutOfStockProducts?: boolean;
  showStockLevels?: boolean;
  landingPage: LandingPageConfig;
  language?: 'en' | 'km' | 'zh';
}

export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Manager' | 'Staff' | 'Customer';
  avatar?: string;
  email: string;
}

export interface StoredUser extends User {
  password: string;
}

export interface CashMovement {
  id: string;
  type: 'in' | 'out';
  amount: number;
  reason: string;
  timestamp: string;
  userId: string;
  userName: string;
}

export interface Shift {
  id: string;
  userId: string;
  userName: string;
  startTime: string;
  endTime?: string;
  startingCash: number; // Cash Float
  cashSales: number;
  cardSales: number;
  digitalSales: number;
  totalSales?: number;
  expectedCash?: number;
  countedCash?: number;
  difference?: number; // countedCash - expectedCash
  status: 'OPEN' | 'CLOSED';
  cashMovements: CashMovement[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalSpent: number;
  visits: number;
  lastVisit?: string;
  points: number; // Loyalty points
}

export interface Expense {
  id: string;
  date: string; // ISO String
  category: string;
  description: string;
  amount: number;
}

export interface RepairTicket {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deviceName: string;
  serialNumber?: string;
  issueDescription: string;
  status: 'Received' | 'In Progress' | 'Waiting for Parts' | 'Ready' | 'Completed' | 'Cancelled';
  estimatedCost: number;
  deposit: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  technicianId?: string;
}
