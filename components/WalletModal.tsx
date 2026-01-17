
import React, { useState } from 'react';
import { Shift, CashMovement } from '../types';
import { X, ArrowDownLeft, ArrowUpRight, Wallet, History, LogOut } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  shift: Shift;
  onAddMovement: (type: 'in' | 'out', amount: number, reason: string) => void;
  onCloseShift: () => void;
  currency: string;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, shift, onAddMovement, onCloseShift, currency }) => {
  const [activeTab, setActiveTab] = useState<'action' | 'history'>('action');
  const [movementType, setMovementType] = useState<'in' | 'out'>('in');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const totalPayIn = shift.cashMovements?.filter(m => m.type === 'in').reduce((sum, m) => sum + m.amount, 0) || 0;
  const totalPayOut = shift.cashMovements?.filter(m => m.type === 'out').reduce((sum, m) => sum + m.amount, 0) || 0;
  const currentDrawerCash = shift.startingCash + shift.cashSales + totalPayIn - totalPayOut;

  const format = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (val > 0 && reason) {
        onAddMovement(movementType, val, reason);
        setAmount('');
        setReason('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/10 relative flex flex-col max-h-[85vh]">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/30 dark:bg-white/5">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Wallet size={20} className="text-primary"/> Shift Wallet
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-5 rounded-2xl shadow-lg mb-6 relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Expected In Drawer</p>
                    <div className="text-4xl font-bold mb-4">{currency}{format(currentDrawerCash)}</div>
                    <div className="grid grid-cols-2 gap-4 text-sm border-t border-white/10 pt-3">
                        <div>
                            <span className="text-slate-400 block text-xs">Opening Float</span>
                            <span className="font-mono">{currency}{format(shift.startingCash)}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-xs">Cash Sales</span>
                            <span className="font-mono text-emerald-400">+{currency}{format(shift.cashSales)}</span>
                        </div>
                    </div>
                </div>
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
                <button 
                    onClick={() => setActiveTab('action')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'action' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    Manage Cash
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    Movement History
                </button>
            </div>

            {activeTab === 'action' ? (
                <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            type="button"
                            onClick={() => setMovementType('in')}
                            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${movementType === 'in' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-transparent bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                        >
                            <ArrowDownLeft size={24} />
                            <span className="font-bold text-sm">Pay In</span>
                        </button>
                        <button 
                            type="button"
                            onClick={() => setMovementType('out')}
                            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${movementType === 'out' ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400' : 'border-transparent bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                        >
                            <ArrowUpRight size={24} />
                            <span className="font-bold text-sm">Pay Out</span>
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">{currency}</span>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    required
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    className="w-full pl-10 p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 outline-none font-bold text-lg"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Reason</label>
                            <input 
                                type="text" 
                                required
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 outline-none"
                                placeholder={movementType === 'in' ? "e.g., Added change" : "e.g., Supplier payment"}
                            />
                        </div>
                        <button type="submit" className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 mt-2 ${movementType === 'in' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'}`}>
                            Confirm {movementType === 'in' ? 'Add Cash' : 'Remove Cash'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-2 animate-fade-in">
                    {(!shift.cashMovements || shift.cashMovements.length === 0) ? (
                        <div className="text-center py-10 text-slate-400">
                            <History size={32} className="mx-auto mb-2 opacity-50"/>
                            <p className="text-sm">No movements in this shift yet.</p>
                        </div>
                    ) : (
                        [...(shift.cashMovements)].reverse().map(m => (
                            <div key={m.id} className="flex justify-between items-center p-3 bg-white/50 dark:bg-white/5 rounded-xl border border-white/20">
                                <div>
                                    <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{m.reason}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{new Date(m.timestamp).toLocaleTimeString()} • {m.userName}</div>
                                </div>
                                <div className={`font-bold ${m.type === 'in' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {m.type === 'in' ? '+' : '-'}{currency}{format(m.amount)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-black/20 border-t border-slate-200 dark:border-white/5 mt-auto">
            <button 
                onClick={() => { onClose(); onCloseShift(); }} 
                className="w-full py-3 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
                <LogOut size={18} /> Close Shift
            </button>
        </div>
      </div>
    </div>
  );
};
