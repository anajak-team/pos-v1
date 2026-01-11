

import React, { useState, useEffect } from 'react';
import { PurchaseOrder, Product, StoreSettings, PurchaseItem, User, Supplier } from '../types';
import { Plus, Search, PackageCheck, Clock, Truck, ChevronDown, X, CheckCircle2, AlertCircle, Building, User as UserIcon, Phone, Mail, Edit, Trash2, Eye, Printer } from 'lucide-react';
import { useToast } from '../components/Toast';
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier } from '../services/storageService';

interface PurchaseViewProps {
  orders: PurchaseOrder[];
  products: Product[];
  settings: StoreSettings;
  onCreateOrder: (order: PurchaseOrder) => void;
  onReceiveOrder: (orderId: string) => void;
  currentUser: User;
}

const SupplierModal = ({ isOpen, onClose, onSave, supplierToEdit }: { isOpen: boolean, onClose: () => void, onSave: (s: Omit<Supplier, 'id'>) => void, supplierToEdit: Supplier | null }) => {
    const [formData, setFormData] = useState({ name: '', contactName: '', phone: '', email: '' });

    useEffect(() => {
        if (supplierToEdit) {
            setFormData({
                name: supplierToEdit.name,
                contactName: supplierToEdit.contactName || '',
                phone: supplierToEdit.phone || '',
                email: supplierToEdit.email || '',
            });
        } else {
            setFormData({ name: '', contactName: '', phone: '', email: '' });
        }
    }, [supplierToEdit, isOpen]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name) onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg flex items-center justify-center p-4">
           <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl w-full max-w-lg border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-white/10"><h3 className="text-xl font-bold">{supplierToEdit ? 'Edit Supplier' : 'Add Supplier'}</h3></div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Supplier Name</label>
                    <input required type="text" className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Contact Name</label>
                        <input type="text" className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone</label>
                        <input type="text" className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                      </div>
                   </div>
                   <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                    <input type="email" className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 py-3 rounded-2xl font-bold text-slate-600 hover:bg-white/30">Cancel</button>
                    <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg">Save</button>
                  </div>
              </form>
           </div>
        </div>
    );
};

const PurchaseOrderDetailsModal = ({ order, onClose, settings }: { order: PurchaseOrder | null, onClose: () => void, settings: StoreSettings }) => {
    if (!order) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in print:p-0 print:bg-white print:block">
             <div className="relative flex flex-col items-center w-full max-w-2xl max-h-full print:max-w-full print:max-h-full print:static">
                <div className="flex gap-2 mb-4 shrink-0 print:hidden">
                    <button onClick={() => window.print()} className="bg-white text-black px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg hover:bg-gray-100 transition-colors">
                        <Printer size={16} /> Print
                    </button>
                    <button onClick={onClose} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="bg-white w-full shadow-2xl overflow-hidden rounded-xl max-h-[80vh] overflow-y-auto print:shadow-none print:max-h-none print:overflow-visible print:rounded-none">
                     <div className="p-8 print:p-0">
                        {/* Invoice Header */}
                        <div className="flex justify-between items-start border-b pb-6 mb-6">
                            <div>
                                <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">{settings.storeName}</h1>
                                <p className="text-sm text-slate-500 font-medium">Purchase Order</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-xl font-mono font-bold text-slate-900">#{order.id.slice(-6)}</h2>
                                <p className="text-sm text-slate-500">{new Date(order.date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Supplier & Status */}
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase mb-1">Supplier</h3>
                                <p className="font-bold text-lg text-slate-800">{order.supplierName}</p>
                                <div className="text-sm text-slate-500 mt-1">
                                    Vendor ID: {order.supplierId}
                                </div>
                            </div>
                             <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase mb-1">Order Details</h3>
                                <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                                    <span className="text-slate-600 text-sm">Status</span>
                                    <span className={`font-bold text-sm ${order.status === 'Received' ? 'text-emerald-600' : 'text-amber-600'}`}>{order.status}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                                    <span className="text-slate-600 text-sm">Items</span>
                                    <span className="font-bold text-sm">{order.items.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm mb-6">
                                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                                    <tr>
                                        <th className="p-3 rounded-l-lg">Product</th>
                                        <th className="p-3 text-center">Qty</th>
                                        <th className="p-3 text-right">Unit Cost</th>
                                        <th className="p-3 rounded-r-lg text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {order.items.map((item, i) => (
                                        <tr key={i}>
                                            <td className="p-3 font-medium text-slate-800">{item.productName}</td>
                                            <td className="p-3 text-center text-slate-600">{item.quantity}</td>
                                            <td className="p-3 text-right text-slate-600">{settings.currency}{item.unitCost.toFixed(2)}</td>
                                            <td className="p-3 text-right font-bold text-slate-800">{settings.currency}{(item.quantity * item.unitCost).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Totals */}
                        <div className="flex justify-end">
                            <div className="w-full sm:w-1/2 space-y-2">
                                <div className="flex justify-between items-center pt-4 border-t-2 border-slate-900">
                                    <span className="font-bold text-lg text-slate-900">Total Amount</span>
                                    <span className="font-extrabold text-2xl text-primary">{settings.currency}{order.totalCost.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-slate-400 text-right mt-2">Authorized Signature</p>
                            </div>
                        </div>
                     </div>
                </div>
             </div>
        </div>
    );
};


export const PurchaseView: React.FC<PurchaseViewProps> = ({ orders, products, settings, onCreateOrder, onReceiveOrder, currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  const isStaff = currentUser.role === 'Staff';

  // Order State
  const [newOrderSupplierId, setNewOrderSupplierId] = useState('');
  const [newOrderItems, setNewOrderItems] = useState<PurchaseItem[]>([]);
  const [itemSearch, setItemSearch] = useState('');

  // Supplier State
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // View Order State
  const [viewOrder, setViewOrder] = useState<PurchaseOrder | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setSuppliers(await getSuppliers());
      } catch (err) {
        showToast('Failed to load suppliers.', 'error');
      }
    };
    fetchSuppliers();
  }, [showToast]);

  const handleAddItem = (product: Product) => {
      const existing = newOrderItems.find(i => i.productId === product.id);
      if (existing) setNewOrderItems(prev => prev.map(i => i.productId === product.id ? { ...i, quantity: (i.quantity || 0) + 1 } : i));
      else setNewOrderItems(prev => [...prev, { productId: product.id, productName: product.name, quantity: product.itemsPerCase || 1, unitCost: product.price * 0.6 }]);
      setItemSearch('');
  };
  const handleUpdateItem = (productId: string, field: keyof PurchaseItem, value: number) => { setNewOrderItems(prev => prev.map(i => i.productId === productId ? { ...i, [field]: value } : i)); };
  const handleRemoveItem = (productId: string) => { setNewOrderItems(prev => prev.filter(i => i.productId !== productId)); };
  const handleSubmitOrder = () => { 
      const supplier = suppliers.find(s => s.id === newOrderSupplierId);
      if (!supplier || newOrderItems.length === 0) {
        showToast('Please select a supplier and add items.', 'error');
        return;
      }
      onCreateOrder({ id: Date.now().toString(), supplierId: supplier.id, supplierName: supplier.name, date: new Date().toISOString(), status: 'Ordered', items: newOrderItems, totalCost: newOrderItems.reduce((a, i) => a + (i.quantity * i.unitCost), 0) });
      setIsModalOpen(false); setNewOrderSupplierId(''); setNewOrderItems([]); showToast('Order created', 'success');
  };

  // Supplier handlers
  const handleOpenSupplierModal = (supplier: Supplier | null) => {
    setEditingSupplier(supplier);
    setIsSupplierModalOpen(true);
  };
  const handleCloseSupplierModal = () => {
    setEditingSupplier(null);
    setIsSupplierModalOpen(false);
  };
  const handleSaveSupplier = async (supplierData: Omit<Supplier, 'id'>) => {
    try {
      if (editingSupplier) {
        const savedSupplier = await updateSupplier({ ...editingSupplier, ...supplierData });
        setSuppliers(prev => prev.map(s => s.id === savedSupplier.id ? savedSupplier : s));
        showToast('Supplier updated', 'success');
      } else {
        const savedSupplier = await addSupplier(supplierData);
        setSuppliers(prev => [...prev, savedSupplier]);
        showToast('Supplier added', 'success');
      }
      handleCloseSupplierModal();
    } catch (err) {
      showToast('Failed to save supplier.', 'error');
    }
  };
  const handleDeleteSupplier = async (id: string) => {
      if (window.confirm('Are you sure you want to delete this supplier? This may affect past purchase orders.')) {
          try {
            await deleteSupplier(id);
            setSuppliers(prev => prev.filter(s => s.id !== id));
            showToast('Supplier deleted', 'info');
          } catch (err) {
            showToast('Failed to delete supplier.', 'error');
          }
      }
  };

  const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 drop-shadow-sm">Procurement</h2>
           <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Manage suppliers & purchase orders</p>
        </div>
        
        {!isStaff && (
          <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 font-bold backdrop-blur-md">
            <Plus size={20} /> <span className="hidden sm:inline">New Order</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-5 rounded-3xl border border-white/30 dark:border-white/10 shadow-lg">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1 font-bold text-xs uppercase tracking-wide"><Truck size={18} /> Active Orders</div>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{orders.filter(o => o.status === 'Ordered').length}</p>
         </div>
         <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-5 rounded-3xl border border-white/30 dark:border-white/10 shadow-lg">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1 font-bold text-xs uppercase tracking-wide"><Building size={18} /> Suppliers</div>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{suppliers.length}</p>
         </div>
      </div>

      {/* Supplier List */}
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 dark:border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/20 bg-white/20 dark:bg-white/5 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><Building size={20} /> Suppliers</h3>
            {!isStaff && (
                <button onClick={() => handleOpenSupplierModal(null)} className="px-3 py-1.5 bg-primary/80 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-primary">
                    <Plus size={14} /> Add Supplier
                </button>
            )}
        </div>
        <div className="max-h-60 overflow-y-auto divide-y divide-white/20 dark:divide-white/5">
            {suppliers.map(s => (
                <div key={s.id} className="p-4 hover:bg-white/30 dark:hover:bg-white/5 transition-colors flex justify-between items-center">
                    <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{s.name}</p>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-4 mt-1">
                            {s.contactName && <span className="flex items-center gap-1.5"><UserIcon size={12}/>{s.contactName}</span>}
                            {s.phone && <span className="flex items-center gap-1.5"><Phone size={12}/>{s.phone}</span>}
                        </div>
                    </div>
                    {!isStaff && (
                        <div className="flex gap-2">
                            <button onClick={() => handleOpenSupplierModal(s)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg"><Edit size={16} /></button>
                            <button onClick={() => handleDeleteSupplier(s.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* PO List */}
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 dark:border-white/10 overflow-hidden">
         <div className="p-5 border-b border-white/20 bg-white/20 dark:bg-white/5"><h3 className="font-bold text-slate-800 dark:text-slate-100">Purchase Order History</h3></div>
         {sortedOrders.length === 0 ? (
            <div className="p-10 text-center text-slate-400">No orders</div>
         ) : (
            <div className="divide-y divide-white/20 dark:divide-white/5">
               {sortedOrders.map(order => (
                 <div key={order.id} className="p-5 hover:bg-white/30 dark:hover:bg-white/5 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${order.status === 'Ordered' ? 'bg-amber-500/20 text-amber-600' : 'bg-emerald-500/20 text-emerald-600'}`}>
                          {order.status === 'Ordered' ? <Clock size={22} /> : <CheckCircle2 size={22} />}
                       </div>
                       <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100 text-lg">{order.supplierName}</div>
                          <div className="text-sm text-slate-500">#{order.id.slice(-4)} • {new Date(order.date).toLocaleDateString()}</div>
                       </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pl-16 sm:pl-0">
                       <div className="text-right">
                          <div className="font-bold text-slate-900 dark:text-slate-100 text-lg">{settings.currency}{order.totalCost.toFixed(2)}</div>
                          <div className="text-xs font-bold uppercase text-slate-400">{order.status}</div>
                       </div>
                       <div className="flex gap-2">
                           <button onClick={() => setViewOrder(order)} className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg" title="View Invoice">
                                <Eye size={20} />
                           </button>
                           {order.status === 'Ordered' && !isStaff && <button onClick={() => onReceiveOrder(order.id)} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg hover:bg-blue-600">Receive</button>}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         )}
      </div>

      {/* New Order Modal */}
      {isModalOpen && !isStaff && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg flex items-center justify-center p-4">
           <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl w-full max-w-2xl border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-white/10"><h3 className="text-xl font-bold">New Purchase Order</h3></div>
              <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Supplier</label>
                    <select className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30 outline-none" value={newOrderSupplierId} onChange={e => setNewOrderSupplierId(e.target.value)}>
                        <option value="" disabled>Select a supplier</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                      <input type="text" placeholder="Add products to order..." className="w-full pl-10 p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30 outline-none" value={itemSearch} onChange={e => setItemSearch(e.target.value)} />
                      {itemSearch && <div className="absolute w-full bg-white dark:bg-slate-800 shadow-xl rounded-xl mt-2 z-10 max-h-40 overflow-y-auto border border-white/20">{products.filter(p=>p.name.toLowerCase().includes(itemSearch.toLowerCase())).map(p=><div key={p.id} onClick={()=>handleAddItem(p)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">{p.name}</div>)}</div>}
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto border border-white/20 rounded-xl bg-white/20 dark:bg-black/20">
                      {newOrderItems.map(i => (
                          <div key={i.productId} className="flex items-center justify-between p-3 border-b border-white/10 last:border-0">
                              <span>{i.productName}</span>
                              <div className="flex items-center gap-3">
                                  <input type="number" value={i.quantity} onChange={e=>handleUpdateItem(i.productId, 'quantity', parseInt(e.target.value))} className="w-16 text-center rounded bg-white/50 p-1" placeholder="Qty" />
                                  <input type="number" step="0.01" value={i.unitCost} onChange={e=>handleUpdateItem(i.productId, 'unitCost', parseFloat(e.target.value))} className="w-20 text-center rounded bg-white/50 p-1" placeholder="Cost" />
                                  <button onClick={()=>handleRemoveItem(i.productId)} className="text-red-400 p-1 hover:bg-red-500/10 rounded-full"><X size={16}/></button>
                              </div>
                          </div>
                      ))}
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-2xl font-bold text-slate-600 hover:bg-white/30">Cancel</button>
                    <button onClick={handleSubmitOrder} className="flex-1 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg">Create Order</button>
                  </div>
              </div>
           </div>
        </div>
      )}

      {/* Supplier Modal */}
      <SupplierModal 
        isOpen={isSupplierModalOpen}
        onClose={handleCloseSupplierModal}
        onSave={handleSaveSupplier}
        supplierToEdit={editingSupplier}
      />
      
      {/* View Order Modal */}
      <PurchaseOrderDetailsModal 
        order={viewOrder} 
        onClose={() => setViewOrder(null)} 
        settings={settings} 
      />
    </div>
  );
};
