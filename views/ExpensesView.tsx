
import React, { useState, useEffect } from 'react';
import { Expense, User, StoreSettings } from '../types';
import { Receipt, Plus, Trash2, Tag, X, DollarSign } from 'lucide-react';
import { useToast } from '../components/Toast';

interface ExpensesViewProps {
  expenses: Expense[];
  categories: string[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  onUpdateCategories: (categories: string[]) => void;
  settings: StoreSettings;
  currentUser: User;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({ expenses, categories, onAddExpense, onDeleteExpense, onUpdateCategories, settings, currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    category: categories[0] || 'Other',
    description: '',
    amount: 0
  });
  const [newCategory, setNewCategory] = useState('');
  const isStaff = currentUser.role === 'Staff';
  const { showToast } = useToast();

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExpense.description && newExpense.amount > 0) {
      onAddExpense(newExpense);
      setIsModalOpen(false);
      setNewExpense({ date: new Date().toISOString().split('T')[0], category: categories[0] || 'Other', description: '', amount: 0 });
      showToast('Expense added', 'success');
    }
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.find(c => c.toLowerCase() === trimmed.toLowerCase())) {
      onUpdateCategories([...categories, trimmed]);
      setNewCategory('');
      showToast('Expense category added', 'success');
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    onUpdateCategories(categories.filter(c => c !== categoryToDelete));
  };

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (isStaff) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Access Restricted</h2>
        <p className="text-slate-500">You do not have permission to view financial data.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 drop-shadow-sm">Expenses</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Track your business operational costs</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 font-bold">
          <Plus size={20} /> <span className="hidden sm:inline">Add Expense</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense List */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 dark:border-white/10 overflow-hidden">
          <div className="p-5 border-b border-white/20 bg-white/20 dark:bg-white/5"><h3 className="font-bold text-slate-800 dark:text-slate-100">Recent Expenses</h3></div>
          <div className="max-h-96 overflow-y-auto divide-y divide-white/20 dark:divide-white/5">
            {sortedExpenses.length === 0 ? (
              <div className="p-10 text-center text-slate-400">No expenses recorded yet.</div>
            ) : (
              sortedExpenses.map(expense => (
                <div key={expense.id} className="p-4 hover:bg-white/30 dark:hover:bg-white/5 transition-colors flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{expense.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{new Date(expense.date).toLocaleDateString()} • {expense.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{settings.currency}{expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <button onClick={() => onDeleteExpense(expense.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Category Management */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 dark:border-white/10 overflow-hidden">
          <div className="p-5 border-b border-white/20 bg-white/20 dark:bg-white/5"><h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><Tag size={18}/> Expense Categories</h3></div>
          <div className="p-4 space-y-3">
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {categories.map(cat => (
                <div key={cat} className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/20">
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{cat}</span>
                  <button onClick={() => handleDeleteCategory(cat)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  placeholder="New category..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30 outline-none text-sm"
                />
                <button onClick={handleAddCategory} className="p-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-600">
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-lg border border-white/20">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold">Add New Expense</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={22} /></button>
            </div>
            <form onSubmit={handleAddExpense} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
                <input required value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{settings.currency}</span>
                    <input required type="number" step="0.01" value={newExpense.amount || ''} onChange={e => setNewExpense({...newExpense, amount: parseFloat(e.target.value)})} className="w-full pl-8 p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Date</label>
                  <input required type="date" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Category</label>
                <select value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30">
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-600 hover:bg-white/30">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
