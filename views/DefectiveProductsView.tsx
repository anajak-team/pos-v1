import React, { useState } from 'react';
import { DefectiveProduct, Product, StoreSettings, User } from '../types';
import { AlertTriangle, Plus, Trash2, CheckCircle, Search } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useAlert } from '../components/Alert';

interface DefectiveProductsViewProps {
  defectiveProducts: DefectiveProduct[];
  products: Product[];
  onAddDefective: (defective: Omit<DefectiveProduct, 'id'>) => void;
  onUpdateDefective: (defective: DefectiveProduct) => void;
  onDeleteDefective: (id: string) => void;
  settings: StoreSettings;
  currentUser: User;
}

export const DefectiveProductsView: React.FC<DefectiveProductsViewProps> = ({
  defectiveProducts,
  products,
  onAddDefective,
  onUpdateDefective,
  onDeleteDefective,
  settings,
  currentUser
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  
  const { showToast } = useToast();
  const { showConfirm } = useAlert();

  const filtered = defectiveProducts.filter(d => 
    d.productName.toLowerCase().includes(search.toLowerCase()) ||
    d.reason.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      showToast('Please select a product', 'error');
      return;
    }
    
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    if (quantity > product.stock) {
      showToast(`Cannot mark more than available stock (${product.stock})`, 'error');
      return;
    }

    onAddDefective({
      productId: product.id,
      productName: product.name,
      quantity,
      reason,
      date: new Date().toISOString(),
      status: 'pending'
    });

    setIsModalOpen(false);
    setSelectedProductId('');
    setQuantity(1);
    setReason('');
    showToast('Defective product recorded', 'success');
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm({
      title: 'Delete Record',
      message: 'Are you sure you want to delete this defective product record?',
      variant: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      onDeleteDefective(id);
      showToast('Record deleted', 'success');
    }
  };

  const toggleStatus = (defective: DefectiveProduct) => {
    onUpdateDefective({
      ...defective,
      status: defective.status === 'pending' ? 'resolved' : 'pending'
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" />
            Defective Products
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Track and manage damaged or defective inventory</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all active:scale-95"
        >
          <Plus size={20} /> Record Defective Item
        </button>
      </div>

      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/40 dark:border-white/10 shadow-xl">
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search defective products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/10 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-sm">
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 font-semibold">Quantity</th>
                <th className="pb-3 font-semibold">Reason</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    No defective products found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 text-slate-600 dark:text-slate-300">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 font-medium text-slate-800 dark:text-slate-100">
                      {item.productName}
                    </td>
                    <td className="py-4 text-slate-600 dark:text-slate-300">
                      <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-lg font-bold">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="py-4 text-slate-600 dark:text-slate-300 max-w-xs truncate" title={item.reason}>
                      {item.reason}
                    </td>
                    <td className="py-4">
                      <button 
                        onClick={() => toggleStatus(item)}
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors ${
                          item.status === 'resolved' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                        }`}
                      >
                        {item.status === 'resolved' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                        {item.status.toUpperCase()}
                      </button>
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/20">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Record Defective Product</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800 dark:text-white"
                  required
                >
                  <option value="">Select a product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800 dark:text-white resize-none h-24"
                  placeholder="Describe the defect or damage..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/30 transition-colors"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
