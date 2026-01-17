
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Product, CartItem, StoreSettings, User, Transaction, Customer } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, Trash2, Plus, Minus, CreditCard, Banknote, Smartphone, ShoppingCart, ArrowRight, X, Package, Sparkles, ScanBarcode, Loader2, CheckCircle2, Printer, AlertTriangle, ShoppingBasket, Tag, Crown } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useAlert } from '../components/Alert';
import { suggestUpsell } from '../services/geminiService';
import { getCart, saveCart } from '../services/storageService';

interface CartItemRowProps {
  item: CartItem;
  currency: string;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  isExiting: boolean;
  currentUser: User;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, currency, onUpdateQty, onRemove, isExiting }) => {
  return (
    <div className={`
        flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/40 dark:border-white/10 shadow-sm transition-all duration-300
        ${isExiting ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}
    `}>
      <div className="flex items-center gap-3 overflow-hidden flex-1">
        <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/10 shrink-0 overflow-hidden relative border border-white/20">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{item.name}</h4>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {currency}{item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-white dark:bg-black/20 rounded-xl border border-white/20 shadow-inner h-8">
            <button 
                onClick={() => onUpdateQty(item.id, -1)}
                className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-colors rounded-l-xl active:scale-90"
            >
                <Minus size={14} />
            </button>
            <span className="w-6 text-center font-bold text-xs text-slate-800 dark:text-slate-100">{item.quantity}</span>
            <button 
                onClick={() => onUpdateQty(item.id, 1)}
                className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-green-500 hover:bg-green-500/10 transition-colors rounded-r-xl active:scale-90"
            >
                <Plus size={14} />
            </button>
        </div>
        <div className="text-right min-w-[50px] hidden sm:block">
             <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                {currency}{(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
             </div>
        </div>
        <button 
            onClick={() => onRemove(item.id)}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
        >
            <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

interface CartPanelProps {
  cart: CartItem[];
  settings: StoreSettings;
  subtotal: number;
  discountAmount: number;
  tax: number;
  total: number;
  change: number;
  changeSecondary: number;
  clearCart: () => void;
  setShowCheckout: (show: boolean) => void;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (c: Customer | null) => void;
  setIsCustomerModalOpen: (open: boolean) => void;
  currentUser: User;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  exitingItems: Set<string>;
  upsell: string;
  completed: boolean;
  discount: string;
  setDiscount: (val: string) => void;
  discountType: 'fixed' | 'percentage';
  setDiscountType: (type: 'fixed' | 'percentage') => void;
  showDiscountInput: boolean;
  setShowDiscountInput: (show: boolean) => void;
  paymentMethod: 'cash' | 'card' | 'digital';
  setPaymentMethod: (method: 'cash' | 'card' | 'digital') => void;
  cashReceived: string;
  setCashReceived: (val: string) => void;
  cashReceivedSecondary: string;
  setCashReceivedSecondary: (val: string) => void;
  processing: boolean;
  handleCheckout: () => void;
  lastTransaction: Transaction | null;
  onPrint: (t: Transaction) => void;
  isMobile?: boolean;
  cartEndRef: React.RefObject<HTMLDivElement | null>;
  totalPaid: number;
}

const CartPanel: React.FC<CartPanelProps> = (props) => {
  const { cart, settings, subtotal, discountAmount, tax, total, change, changeSecondary, clearCart, setShowCheckout, selectedCustomer, setSelectedCustomer, setIsCustomerModalOpen, currentUser, updateQuantity, removeFromCart, exitingItems, upsell, completed, discount, setDiscount, discountType, setDiscountType, showDiscountInput, setShowDiscountInput, paymentMethod, setPaymentMethod, cashReceived, setCashReceived, cashReceivedSecondary, setCashReceivedSecondary, processing, handleCheckout, lastTransaction, onPrint, isMobile, cartEndRef, totalPaid } = props;

  return (
    <div className={`flex flex-col h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl ${isMobile ? 'rounded-t-3xl border-t border-white/20' : 'rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl'}`}>
         {/* Cart Header */}
         <div className="p-5 border-b border-white/10 bg-white/10 dark:bg-black/10 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
               <div className="bg-primary/10 text-primary p-2 rounded-xl">
                  <ShoppingCart size={20} />
               </div>
               <span className="font-bold text-lg text-slate-800 dark:text-white">Current Order</span>
            </div>
            <div className="flex gap-2">
                <button onClick={clearCart} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors" disabled={cart.length === 0} title="Clear Cart"><Trash2 size={20} /></button>
                {isMobile && <button onClick={() => setShowCheckout(false)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl"><X size={20} /></button>}
            </div>
         </div>

         {/* Customer Selection */}
         <div className="px-5 py-3 bg-white/40 dark:bg-black/20 border-b border-white/10">
            {selectedCustomer ? (
                <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-white/5 rounded-xl border border-white/20">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-600 flex items-center justify-center font-bold text-xs">
                            {selectedCustomer.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-sm text-slate-800 dark:text-white">{selectedCustomer.name}</div>
                            {(settings.enableLoyalty !== false) && (
                                <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                    <Crown size={12} className="fill-current"/> 
                                    {selectedCustomer.points || 0} Points
                                </div>
                            )}
                        </div>
                    </div>
                    <button onClick={() => setSelectedCustomer(null)} className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg"><X size={16}/></button>
                </div>
            ) : (
                <button onClick={() => setIsCustomerModalOpen(true)} className="w-full py-2 border border-dashed border-primary/30 text-primary rounded-xl text-sm font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                    <Plus size={16} /> Add Customer
                </button>
            )}
         </div>

         {/* Cart Items */}
         <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar touch-pan-y">
            {cart.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-60">
                  <ShoppingCart size={64} strokeWidth={1} />
                  <p className="text-sm font-medium">Cart is empty</p>
               </div>
            ) : (
               <>
                  {cart.map(item => (
                     <CartItemRow 
                        key={item.id} 
                        item={item} 
                        currency={settings.currency} 
                        onUpdateQty={updateQuantity} 
                        onRemove={removeFromCart} 
                        isExiting={exitingItems.has(item.id)}
                        currentUser={currentUser}
                     />
                  ))}
                  <div ref={cartEndRef} />
               </>
            )}
         </div>

         {/* Upsell AI */}
         {upsell && !completed && (
            <div className="px-4 pb-2 shrink-0 animate-fade-in">
               <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-3 flex items-start gap-3">
                  <Sparkles size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                     <p className="text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase mb-0.5">Smart Suggestion</p>
                     <p className="text-xs text-slate-600 dark:text-slate-300">Customer might also like: <span className="font-bold">{upsell}</span></p>
                  </div>
               </div>
            </div>
         )}

         {/* Checkout Panel */}
         <div className="p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-white/20 dark:border-white/10 shrink-0 space-y-4">
            {!completed ? (
                <>
                    {/* Totals */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                          <span>Subtotal</span>
                          <span>{settings.currency}{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      
                      {/* Discount Section */}
                      <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                        <button onClick={() => setShowDiscountInput(!showDiscountInput)} className="text-primary font-bold text-xs flex items-center gap-1">
                          <Tag size={12}/> {discountAmount > 0 ? 'Edit Discount' : 'Add Discount'}
                        </button>
                        {discountAmount > 0 && (
                          <span className="font-bold text-red-500">- {settings.currency}{discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        )}
                      </div>

                      {showDiscountInput && (
                        <div className="p-3 bg-white/50 dark:bg-black/20 rounded-xl border border-white/20 flex gap-2 animate-fade-in">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{discountType === 'fixed' ? settings.currency : '%'}</span>
                            <input
                              type="number"
                              value={discount}
                              onChange={(e) => setDiscount(e.target.value)}
                              className="w-full pl-8 pr-2 py-2 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-bold outline-none ring-2 ring-transparent focus:ring-primary"
                              placeholder="0"
                            />
                          </div>
                          <button onClick={() => setDiscountType('fixed')} className={`px-3 py-1 rounded-lg text-xs font-bold ${discountType === 'fixed' ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-600'}`}>{settings.currency}</button>
                          <button onClick={() => setDiscountType('percentage')} className={`px-3 py-1 rounded-lg text-xs font-bold ${discountType === 'percentage' ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-600'}`}>%</button>
                        </div>
                      )}

                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                          <span>Tax ({settings.taxRate}%)</span>
                          <span>{settings.currency}{tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-end pt-2 border-t border-black/5 dark:border-white/5">
                          <span className="font-bold text-lg text-slate-800 dark:text-white">Total</span>
                          <div className="text-right">
                              <span className="font-bold text-2xl text-slate-900 dark:text-white block leading-none">{settings.currency}{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              {settings.secondaryCurrency && (
                                  <span className="text-xs text-slate-500 font-medium">
                                  ≈ {settings.secondaryCurrency} {(total * settings.exchangeRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </span>
                              )}
                          </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setPaymentMethod('cash')} className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${paymentMethod === 'cash' ? 'bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400' : 'bg-slate-100 dark:bg-white/5 border-transparent text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10'}`}>
                        <Banknote size={20} className="mb-1" />
                        <span className="text-[10px] font-bold uppercase">Cash</span>
                    </button>
                    <button onClick={() => setPaymentMethod('card')} className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${paymentMethod === 'card' ? 'bg-blue-500/10 border-blue-500/50 text-blue-700 dark:text-blue-400' : 'bg-slate-100 dark:bg-white/5 border-transparent text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10'}`}>
                        <CreditCard size={20} className="mb-1" />
                        <span className="text-[10px] font-bold uppercase">Card</span>
                    </button>
                    <button onClick={() => setPaymentMethod('digital')} className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${paymentMethod === 'digital' ? 'bg-purple-500/10 border-purple-500/50 text-purple-700 dark:text-purple-400' : 'bg-slate-100 dark:bg-white/5 border-transparent text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10'}`}>
                        <Smartphone size={20} className="mb-1" />
                        <span className="text-[10px] font-bold uppercase">Digital</span>
                    </button>
                    </div>

                    {/* Cash Input */}
                    {paymentMethod === 'cash' && (
                    <div className="animate-fade-in space-y-2">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{settings.currency}</span>
                                <input 
                                    type="number" 
                                    placeholder="Amount" 
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-black/20 border border-transparent focus:border-primary/50 outline-none font-bold text-slate-800 dark:text-white transition-all"
                                    value={cashReceived}
                                    onChange={e => setCashReceived(e.target.value)}
                                />
                            </div>
                            {settings.secondaryCurrency && (
                                <div className="relative flex-1">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{settings.secondaryCurrency}</span>
                                    <input 
                                        type="number" 
                                        placeholder="Amount" 
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-black/20 border border-transparent focus:border-primary/50 outline-none font-bold text-slate-800 dark:text-white transition-all"
                                        value={cashReceivedSecondary}
                                        onChange={e => setCashReceivedSecondary(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                        {settings.secondaryCurrency && (
                            <p className="text-[10px] text-slate-400 text-center">Rate: 1 {settings.currency} = {settings.exchangeRate} {settings.secondaryCurrency}</p>
                        )}
                        {totalPaid >= total && (
                            <div className="mt-2 flex flex-col p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                <div className="flex justify-between items-center text-green-700 dark:text-green-400 text-sm font-bold">
                                    <span>Change Due:</span>
                                    <span>{settings.currency}{change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                {settings.secondaryCurrency && (
                                    <div className="text-right text-xs text-green-600 dark:text-green-500/80 font-medium mt-1">
                                        ≈ {settings.secondaryCurrency}{changeSecondary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    )}

                    {/* Checkout Button */}
                    <button 
                    onClick={handleCheckout}
                    disabled={cart.length === 0 || (paymentMethod === 'cash' && (totalPaid < total - 0.01)) || processing}
                    className="w-full py-4 bg-primary hover:bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    {processing ? <Loader2 className="animate-spin" /> : (
                        <>
                            <span>Complete Order</span>
                            <ArrowRight size={20} />
                        </>
                    )}
                    </button>
                </>
            ) : (
                <div className="text-center space-y-4 animate-fade-in">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/30 text-white mb-2">
                        <CheckCircle2 size={32} className="animate-scale-in" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Payment Successful!</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Order #{lastTransaction?.id.slice(-6)}</p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button onClick={() => lastTransaction && onPrint(lastTransaction)} className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-300 transition-colors text-sm">
                        <Printer size={18} /> Receipt
                        </button>
                        <button onClick={clearCart} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-lg text-sm">
                        Next <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}
         </div>
    </div>
  );
};

interface PosViewProps {
  products: Product[];
  onCompleteTransaction: (transaction: Transaction) => void;
  onPrint: (transaction: Transaction) => void;
  settings: StoreSettings;
  onAddProduct: (product: Partial<Product>) => Promise<Product>;
  onUpdateProduct: (product: Product) => void;
  currentUser: User;
  onOpenProductModal: (product: Product | null) => void;
  categories: string[];
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id'>) => Promise<Customer>;
}

export const PosView: React.FC<PosViewProps> = ({
  products,
  onCompleteTransaction,
  onPrint,
  settings,
  onAddProduct,
  onUpdateProduct,
  currentUser,
  onOpenProductModal,
  categories,
  customers,
  onAddCustomer
}) => {
  const [cart, setCart] = useState<CartItem[]>(() => getCart());
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital'>('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [cashReceivedSecondary, setCashReceivedSecondary] = useState('');
  const [upsell, setUpsell] = useState<string>('');
  const [showCheckout, setShowCheckout] = useState(false); // Mobile/Tablet modal toggle
  
  // Discount State
  const [discount, setDiscount] = useState('');
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [showDiscountInput, setShowDiscountInput] = useState(false);

  // Scanner & Quick Add State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [lastScannedMsg, setLastScannedMsg] = useState<string | null>(null);
  const [unrecognizedBarcode, setUnrecognizedBarcode] = useState<string | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddForm, setQuickAddForm] = useState<Partial<Product>>({ name: '', price: 0, category: 'Other', stock: 10 });
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const scannerInstanceRef = useRef<any>(null);

  // Customer State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '' });

  // Checkout State
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  const { showToast } = useToast();
  const { showConfirm } = useAlert();
  const cartEndRef = useRef<HTMLDivElement>(null);
  const prevCartItemsRef = useRef<string[]>([]);
  
  // Animation state for removing items
  const [exitingItems, setExitingItems] = useState<Set<string>>(new Set());

  // Scroll to bottom of cart when items added
  useEffect(() => {
    if (cart.length > prevCartItemsRef.current.length) {
        cartEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [cart.length]);

  // Sync cart to local storage
  useEffect(() => {
    saveCart(cart.filter(i => i.quantity > 0));
  }, [cart]);

  // Sync cart with product updates
  useEffect(() => {
    setCart(currentCart => {
      return currentCart.map(cartItem => {
        const updatedProduct = products.find(p => p.id === cartItem.id);
        return updatedProduct ? { ...updatedProduct, quantity: cartItem.quantity } : cartItem;
      });
    });
  }, [products]);

  // AI Upsell Logic
  useEffect(() => {
    const currentItemNames = cart.map(c => c.name);
    const hasChanged = JSON.stringify(currentItemNames) !== JSON.stringify(prevCartItemsRef.current);
    
    if (hasChanged && cart.length > 0 && cart.length % 3 === 0) {
       const fetchUpsell = async () => {
          const suggestion = await suggestUpsell(currentItemNames);
          if (suggestion) setUpsell(suggestion);
       };
       fetchUpsell();
    } else if (cart.length === 0) {
        setUpsell('');
    }
    prevCartItemsRef.current = currentItemNames;
  }, [cart]);

  // Auto-focus search input when scanner closes
  useEffect(() => {
    if (!isScannerOpen && !isQuickAddOpen && !isCustomerModalOpen && !showCheckout) {
        const timer = setTimeout(() => {
            searchInputRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
    }
  }, [isScannerOpen, isQuickAddOpen, isCustomerModalOpen, showCheckout]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            (p.barcode && p.barcode.includes(search));
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesStock = !settings.hideOutOfStockProducts || p.stock > 0;
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, selectedCategory, settings.hideOutOfStockProducts]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      showToast('Item is out of stock', 'error');
      playSystemSound('error');
      return;
    }
    playSystemSound('beep');
    
    if (exitingItems.has(product.id)) {
        setExitingItems(prev => { const next = new Set(prev); next.delete(product.id); return next; });
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
            showToast('Cannot add more than available stock', 'error');
            return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    if(product.stock <= 5) {
        showToast(`Low stock: only ${product.stock} left`, 'info');
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty < 1) return item; // Handled by remove
        const product = products.find(p => p.id === id);
        if (product && newQty > product.stock) {
            showToast('Not enough stock', 'error');
            return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setExitingItems(prev => new Set(prev).add(id));
    setTimeout(() => {
      setCart(prev => prev.filter(item => item.id !== id));
      setExitingItems(prev => { const next = new Set(prev); next.delete(id); return next; });
    }, 300);
  };

  const clearCart = () => {
    setCart([]);
    setCashReceived('');
    setCashReceivedSecondary('');
    setUpsell('');
    setCompleted(false);
    setPaymentMethod('cash');
    setLastTransaction(null);
    setSelectedCustomer(null);
    setShowCheckout(false);
    setDiscount('');
    setShowDiscountInput(false);
    setSearch('');
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  // Barcode Scanner / Search Handler
  const handleSearchKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          const term = search.trim();
          if (!term) return;

          const barcodeMatch = products.find(p => p.barcode === term);
          const nameMatch = products.find(p => p.name.toLowerCase() === term.toLowerCase());
          const productToAdd = barcodeMatch || nameMatch;

          if (productToAdd) {
              addToCart(productToAdd);
              setSearch(''); 
              showToast(`Added: ${productToAdd.name}`, 'success');
          } else {
              if (filteredProducts.length === 1) {
                  addToCart(filteredProducts[0]);
                  setSearch('');
                  showToast(`Added: ${filteredProducts[0].name}`, 'success');
              } else {
                  playSystemSound('error');
                  if (filteredProducts.length === 0) {
                      if (/^\d{5,}$/.test(term)) {
                          const confirmed = await showConfirm({
                              title: 'Product Not Found',
                              message: `Barcode "${term}" is not in the system. Would you like to add it now?`,
                              confirmText: 'Add Product',
                              variant: 'info'
                          });
                          
                          if (confirmed) {
                              setUnrecognizedBarcode(term);
                              setIsQuickAddOpen(true);
                          }
                      } else {
                          showToast('Product not found', 'error');
                      }
                  }
              }
          }
      }
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discountAmount = 0;
  const discountValue = parseFloat(discount);
  if (!isNaN(discountValue) && discountValue > 0) {
    if (discountType === 'percentage') {
      discountAmount = subtotal * (discountValue / 100);
    } else {
      discountAmount = discountValue;
    }
  }
  discountAmount = Math.min(subtotal, discountAmount);
  
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * (settings.taxRate / 100);
  const total = discountedSubtotal + tax;
  
  const exchangeRate = settings.exchangeRate || 1;
  const paidPrimary = parseFloat(cashReceived) || 0;
  const paidSecondary = parseFloat(cashReceivedSecondary) || 0;
  // Convert secondary currency to primary currency value
  const secondaryInPrimary = paidSecondary / exchangeRate;
  const totalPaid = paidPrimary + secondaryInPrimary;
  
  const change = paymentMethod === 'cash' ? Math.max(0, totalPaid - total) : 0;
  const changeSecondary = change * exchangeRate;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    if (paymentMethod === 'cash') {
        if (totalPaid < total - 0.01) { // 0.01 tolerance for floating point
            showToast('Insufficient cash received', 'error');
            return;
        }
    }

    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    const transactionData: Transaction = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        items: [...cart],
        total: total,
        tax: tax,
        discount: discountAmount,
        paymentMethod: paymentMethod,
        customerId: selectedCustomer?.id,
        customerName: selectedCustomer?.name,
        type: 'sale',
    };

    onCompleteTransaction(transactionData);
    setLastTransaction(transactionData);
    playSystemSound('success');
    
    setCart([]);
    setProcessing(false);
    setCompleted(true);
  };

  const playSystemSound = (type: 'beep' | 'success' | 'error') => {
    if (!settings.enableSound) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const gainNode = ctx.createGain();
      gainNode.connect(ctx.destination);
      const osc = ctx.createOscillator();
      
      if (type === 'beep') { osc.type = 'sine'; osc.frequency.setValueAtTime(800, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08); gainNode.gain.setValueAtTime(0.05, ctx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08); osc.connect(gainNode); osc.start(); osc.stop(ctx.currentTime + 0.1); } 
      else if (type === 'error') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2); gainNode.gain.setValueAtTime(0.05, ctx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2); osc.connect(gainNode); osc.start(); osc.stop(ctx.currentTime + 0.25); } 
      else if (type === 'success') { [523.25, 659.25, 783.99].forEach((freq, i) => { const osc2 = ctx.createOscillator(); osc2.type = 'sine'; osc2.frequency.setValueAtTime(freq, ctx.currentTime + (i * 0.1)); const noteGain = ctx.createGain(); noteGain.connect(ctx.destination); noteGain.gain.setValueAtTime(0.05, ctx.currentTime + (i * 0.1)); noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i * 0.1) + 0.4); osc2.connect(noteGain); osc2.start(ctx.currentTime + (i * 0.1)); osc2.stop(ctx.currentTime + (i * 0.1) + 0.4); }); }
    } catch (e) { console.error(e); }
  };

  const startScanner = () => { 
    setIsScannerOpen(true); 
    setScannerError(null); 
    setLastScannedMsg(null); 
    setScanSuccess(false);
  };
  
  const stopScanner = useCallback(() => { 
    setIsScannerOpen(false); 
  }, []);

  const handleScan = useCallback((code: string) => { 
      if(code === unrecognizedBarcode) return;

      const product = products.find(p => p.barcode === code); 
      if (product) { 
          addToCart(product); 
          setLastScannedMsg(`Added: ${product.name}`);
          setScanSuccess(true);
          setTimeout(() => setScanSuccess(false), 1000); 
          setTimeout(() => setLastScannedMsg(null), 2000); 
      } else { 
          playSystemSound('error'); 
          setIsScannerOpen(false); 
          setUnrecognizedBarcode(code); 
          setIsQuickAddOpen(true); 
      } 
  }, [products, unrecognizedBarcode]);

  useEffect(() => {
    let html5QrCode: any;
    
    if (isScannerOpen) {
        const timer = setTimeout(() => {
            const Html5Qrcode = (window as any).Html5Qrcode;
            if (!Html5Qrcode) {
                setScannerError("Scanner library not loaded. Please refresh.");
                return;
            }

            try {
                html5QrCode = new Html5Qrcode("reader");
                scannerInstanceRef.current = html5QrCode;

                const config = { 
                    fps: 10, 
                    qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
                        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
                        return {
                            width: Math.floor(minEdge * 0.7),
                            height: Math.floor(minEdge * 0.7)
                        };
                    },
                    aspectRatio: 1.0,
                    disableFlip: false
                };
                
                html5QrCode.start(
                    { facingMode: "environment" }, 
                    config, 
                    (decodedText: string) => {
                        handleScan(decodedText);
                    },
                    (errorMessage: string) => { }
                ).catch((err: any) => {
                    setScannerError("Camera permission denied or error.");
                });
            } catch (e) {
                setScannerError("Failed to initialize scanner.");
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            if (scannerInstanceRef.current) {
                try {
                    scannerInstanceRef.current.stop().then(() => {
                        scannerInstanceRef.current.clear();
                        scannerInstanceRef.current = null;
                    }).catch((err: any) => {
                        try { scannerInstanceRef.current.clear(); } catch (e) {}
                    });
                } catch(e) {}
            }
        };
    }
  }, [isScannerOpen, handleScan]);


  const handleQuickAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quickAddForm.name && quickAddForm.price && unrecognizedBarcode) {
      const newProductData: Partial<Product> = {
        name: quickAddForm.name!,
        price: Number(quickAddForm.price),
        category: quickAddForm.category || 'Other',
        stock: Number(quickAddForm.stock) || 0,
        barcode: unrecognizedBarcode,
        description: 'Quick added from POS',
        image: `https://picsum.photos/200?random=${Date.now()}`
      };
      try {
        const newProduct = await onAddProduct(newProductData);
        addToCart(newProduct);
        setIsQuickAddOpen(false);
        setUnrecognizedBarcode(null);
        setQuickAddForm({ name: '', price: 0, category: 'Other', stock: 10 });
        playSystemSound('success');
        showToast('Product created', 'success');
      } catch (error) {
        showToast('Failed to quick-add product.', 'error');
      }
    }
  };

  const handleCreateCustomer = async () => { 
    if(newCustomer.name && newCustomer.phone) { 
      const customerData: Omit<Customer, 'id'> = { 
        name: newCustomer.name, 
        phone: newCustomer.phone, 
        email: newCustomer.email, 
        totalSpent: 0, 
        visits: 0, 
        lastVisit: new Date().toISOString(),
        points: 0
      }; 
      try {
        const newSavedCustomer = await onAddCustomer(customerData); 
        setSelectedCustomer(newSavedCustomer); 
        setNewCustomer({ name: '', phone: '', email: '' }); 
        setIsCustomerModalOpen(false); 
        showToast('Customer created', 'success'); 
      } catch (e) {
        showToast('Failed to create customer', 'error');
      }
    } 
  };
  const filteredCustomers = (customers || []).filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch));

  // Prepare props for CartPanel
  const cartPanelProps: CartPanelProps = {
    cart, settings, subtotal, discountAmount, tax, total, change, changeSecondary,
    clearCart, setShowCheckout, selectedCustomer, setSelectedCustomer,
    setIsCustomerModalOpen, currentUser, updateQuantity, removeFromCart,
    exitingItems, upsell, completed, discount, setDiscount, discountType,
    setDiscountType, showDiscountInput, setShowDiscountInput, paymentMethod,
    setPaymentMethod, cashReceived, setCashReceived, cashReceivedSecondary, setCashReceivedSecondary, processing, handleCheckout,
    lastTransaction, onPrint, cartEndRef, totalPaid
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 relative">
      
      {/* Products Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header */}
        <div className="mb-4 space-y-3 shrink-0">
           <div className="flex flex-col md:flex-row gap-3">
               <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Search or Scan Barcode..." 
                    className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/20 dark:border-white/10 focus:bg-white/80 dark:focus:bg-slate-900/80 focus:border-primary/50 outline-none transition-all backdrop-blur-md shadow-sm text-slate-800 dark:text-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2" title="Scan Barcode">
                    <button onClick={startScanner} className="p-1.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-colors">
                       <ScanBarcode size={18} />
                    </button>
                  </div>
               </div>
           </div>
           
           {/* Category Scrolling */}
           <div className="flex gap-2 overflow-x-auto pb-2">
              {['All', ...categories].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                      : 'bg-white/40 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>

        {/* Product Grid - Adaptive Columns */}
        <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
           {filteredProducts.length === 0 ? (
             <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                <Package size={48} className="mb-2 opacity-50" />
                <p>No products found</p>
             </div>
           ) : (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3 pb-24 lg:pb-4">
                {filteredProducts.map(product => (
                   <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAdd={addToCart} 
                      currency={settings.currency} 
                      showStockLevel={settings.showStockLevels !== false}
                   />
                ))}
             </div>
           )}
        </div>
      </div>

      {/* Cart Toggle FAB - Mobile Only */}
      {!showCheckout && cart.length > 0 && (
        <button 
          onClick={() => setShowCheckout(true)} 
          className="lg:hidden fixed bottom-20 md:bottom-8 right-4 md:right-8 bg-primary text-white p-4 rounded-full shadow-2xl shadow-blue-500/40 z-30 flex items-center gap-3 animate-fade-in-up pr-6 hover:scale-105 transition-transform"
        >
          <div className="relative">
             <ShoppingBasket size={24} />
             <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-primary">{cart.reduce((a,c)=>a+c.quantity,0)}</span>
          </div>
          <span className="font-bold text-lg">{settings.currency}{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </button>
      )}

      {/* Mobile Cart Portal */}
      {showCheckout && createPortal(
        <>
            <div className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm animate-fade-in" onClick={() => setShowCheckout(false)} />
            <div className="fixed bottom-0 left-0 right-0 h-[90vh] z-[101] animate-slide-up">
                 <CartPanel {...cartPanelProps} isMobile />
            </div>
        </>,
        document.body
      )}

      {/* Desktop Cart Sidebar */}
      <div className="hidden lg:flex flex-col h-full shrink-0 overflow-hidden w-[380px] xl:w-[420px]">
         <CartPanel {...cartPanelProps} />
      </div>

      {/* Modals */}
      {isScannerOpen && (<div className="fixed inset-0 z-[70] bg-black/90 flex flex-col animate-fade-in"><div className="absolute top-4 right-4 z-20"><button onClick={stopScanner} className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30"><X size={24} /></button></div><div className="flex-1 relative flex items-center justify-center">{scannerError ? (<div className="text-white text-center p-6 max-w-sm"><AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" /><p className="mb-4 font-medium">{scannerError}</p><button onClick={stopScanner} className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold">Close Scanner</button></div>) : (<div className="relative w-full max-w-md aspect-square overflow-hidden rounded-3xl border-2 border-white/30 shadow-2xl mx-4"><div id="reader" className="w-full h-full bg-black rounded-3xl overflow-hidden"></div><div className="absolute inset-0 p-8 pointer-events-none"><div className={`w-full h-full border-2 rounded-3xl relative transition-all duration-300 ${scanSuccess ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'border-white/50'}`}><div className={`absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 rounded-tl-xl transition-colors duration-300 ${scanSuccess ? 'border-green-500' : 'border-primary'}`}></div><div className={`absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 rounded-tr-xl transition-colors duration-300 ${scanSuccess ? 'border-green-500' : 'border-primary'}`}></div><div className={`absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 rounded-bl-xl transition-colors duration-300 ${scanSuccess ? 'border-green-500' : 'border-primary'}`}></div><div className={`absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 rounded-br-xl transition-colors duration-300 ${scanSuccess ? 'border-green-500' : 'border-primary'}`}></div></div></div><p className="absolute bottom-8 left-0 right-0 text-center text-white/80 font-medium text-sm bg-black/40 py-2 backdrop-blur-sm">Align barcode within frame</p>{lastScannedMsg && (<div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"><div className="bg-white/90 text-green-600 px-6 py-4 rounded-2xl flex flex-col items-center shadow-2xl animate-scale-in"><CheckCircle2 size={48} className="mb-2" /><span className="font-bold text-lg text-center">{lastScannedMsg}</span></div></div>)}</div>)}</div></div>)}
      {isQuickAddOpen && (<div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"><div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl w-full max-w-md border border-white/20"><h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Unrecognized Item</h3><p className="text-sm text-slate-500 mb-4">Barcode: <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{unrecognizedBarcode}</span></p><form onSubmit={handleQuickAddSubmit} className="space-y-4"><div><label className="text-xs font-bold text-slate-500 uppercase">Name</label><input required className="w-full p-3 bg-white/50 dark:bg-black/20 border border-white/20 rounded-xl outline-none" value={quickAddForm.name} onChange={e => setQuickAddForm({...quickAddForm, name: e.target.value})} /></div><div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-bold text-slate-500 uppercase">Price</label><input required type="number" step="0.01" className="w-full p-3 bg-white/50 dark:bg-black/20 border border-white/20 rounded-xl outline-none" value={quickAddForm.price} onChange={e => setQuickAddForm({...quickAddForm, price: parseFloat(e.target.value)})} /></div><div><label className="text-xs font-bold text-slate-500 uppercase">Category</label><select className="w-full p-3 bg-white/50 dark:bg-black/20 border border-white/20 rounded-xl outline-none" value={quickAddForm.category} onChange={e => setQuickAddForm({...quickAddForm, category: e.target.value })}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div></div><div className="flex gap-3 pt-2"><button type="button" onClick={() => setIsQuickAddOpen(false)} className="flex-1 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold">Cancel</button><button type="submit" className="flex-1 py-3 rounded-xl bg-primary text-white font-bold shadow-lg">Add & Cart</button></div></form></div></div>)}
      {isCustomerModalOpen && (<div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-md flex items-center justify-center p-4"><div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] shadow-2xl w-full max-w-lg border border-white/20 overflow-hidden flex flex-col max-h-[90vh]"><div className="p-5 border-b border-white/10 flex justify-between items-center"><h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Select Customer</h3><button onClick={() => setIsCustomerModalOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full"><X size={20}/></button></div><div className="p-5 flex-1 overflow-y-auto"><div className="mb-6"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input placeholder="Search customers..." className="w-full pl-10 p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 outline-none" value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} /></div>{customerSearch && (<div className="mt-2 space-y-2 max-h-40 overflow-y-auto">{(customers || []).filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch)).map(c => (<button key={c.id} onClick={() => { setSelectedCustomer(c); setIsCustomerModalOpen(false); }} className="w-full p-3 flex justify-between items-center bg-white/40 dark:bg-white/5 hover:bg-primary/10 rounded-xl border border-transparent hover:border-primary/30 transition-all text-left"><div><div className="font-bold text-slate-800 dark:text-slate-100">{c.name}</div><div className="text-xs text-slate-500">{c.phone}</div></div><ArrowRight size={16} className="text-slate-400"/></button>))}{filteredCustomers.length === 0 && <div className="text-center text-slate-400 text-sm p-2">No matches</div>}</div>)}</div><div className="border-t border-white/10 pt-6"><h4 className="text-sm font-bold text-slate-500 uppercase mb-3">New Customer</h4><div className="space-y-3"><input placeholder="Full Name" className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} /><div className="grid grid-cols-2 gap-3"><input placeholder="Phone" className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} /><input placeholder="Email" className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} /></div><button onClick={handleCreateCustomer} disabled={!newCustomer.name || !newCustomer.phone} className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg disabled:opacity-50">Create</button></div></div></div></div></div>)}
    </div>
  );
};
