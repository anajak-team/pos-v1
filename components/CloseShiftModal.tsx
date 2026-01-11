
import React, { useState, useEffect } from 'react';
import { Shift } from '../types';
import { X, Wallet, Banknote, CreditCard, Smartphone, Calculator, CheckCircle2 } from 'lucide-react';

interface CloseShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (countedCash: number) => void;
  shift: Shift | undefined;
  currency: string;
}

export const CloseShiftModal: React.FC<CloseShiftModalProps> = ({ isOpen, onClose, onConfirm, shift, currency }) => {
  const [countedCash, setCountedCash] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setCountedCash('');
    }
  }, [isOpen]);

  if (!isOpen || !shift) return null;

  const totalSales = shift.cashSales + shift.cardSales + shift.digitalSales;
  const expectedCash = shift.startingCash + shift.cashSales;
  const difference = parseFloat(countedCash) - expectedCash;

  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toFixed(2)}`;
  };
  
  const handleConfirm = () => {
    const counted = parseFloat(countedCash);
    if (!isNaN(counted)) {
        onConfirm(counted);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white/60 dark:bg-black/60 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/40 dark:border-white/10 relative flex flex-col">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/10 dark:bg-black/10">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Close Shift</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Sales Summary */}
          <section>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Sales Summary</h3>
            <div className="bg-white/40 dark:bg-black/20 p-4 rounded-2xl border border-white/20 dark:border-white/10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2"><Banknote size={16} /> Cash Sales</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{formatCurrency(shift.cashSales)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2"><CreditCard size={16} /> Card Sales</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{formatCurrency(shift.cardSales)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2"><Smartphone size={16} /> Digital Sales</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{formatCurrency(shift.digitalSales)}</span>
              </div>
              <div className="pt-3 border-t border-white/20 dark:border-white/10 flex justify-between items-center">
                <span className="font-bold text-slate-700 dark:text-slate-200">Total Sales</span>
                <span className="font-extrabold text-lg text-slate-900 dark:text-white">{formatCurrency(totalSales)}</span>
              </div>
            </div>
          </section>

          {/* Cash Reconciliation */}
          <section>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Calculator size={16}/> Cash Reconciliation</h3>
            <div className="bg-white/40 dark:bg-black/20 p-4 rounded-2xl border border-white/20 dark:border-white/10 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-600 dark:text-slate-300">Opening Float</span>
                <span className="font-mono text-slate-700 dark:text-slate-200">{formatCurrency(shift.startingCash)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-600 dark:text-slate-300">(+) Cash Sales</span>
                <span className="font-mono text-slate-700 dark:text-slate-200">{formatCurrency(shift.cashSales)}</span>
              </div>
              <div className="pt-3 border-t border-white/20 dark:border-white/10 flex justify-between items-center">
                <span className="font-bold text-slate-700 dark:text-slate-200">Expected in Drawer</span>
                <span className="font-bold text-lg text-slate-900 dark:text-white">{formatCurrency(expectedCash)}</span>
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                   <Wallet size={18} />
                   Counted Cash Amount
                </label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">{currency}</span>
                   <input 
                      type="number" 
                      step="0.01"
                      autoFocus
                      value={countedCash}
                      onChange={(e) => setCountedCash(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 text-2xl font-bold text-center rounded-2xl bg-white/50 dark:bg-black/30 border-2 border-white/30 dark:border-white/10 text-slate-800 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                   />
                </div>
              </div>

              {!isNaN(difference) && countedCash !== '' && (
                <div className={`flex justify-between items-center p-3 rounded-lg ${difference === 0 ? 'bg-green-500/10 text-green-700 dark:text-green-300' : 'bg-red-500/10 text-red-700 dark:text-red-300'}`}>
                   <span className="font-bold text-sm">Difference</span>
                   <span className="font-bold text-sm">{formatCurrency(difference)} {difference > 0 ? '(Over)' : difference < 0 ? '(Short)' : ''}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-white/10 bg-white/10 dark:bg-black/10">
          <button
            onClick={handleConfirm}
            disabled={countedCash === ''}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-red-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 size={22} /> Confirm & Close Shift
          </button>
        </div>
      </div>
    </div>
  );
};