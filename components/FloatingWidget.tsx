
import React, { useState } from 'react';
import { Plus, Calculator, ScanBarcode, Receipt, X, Minus, Delete, GripVertical } from 'lucide-react';
import { ViewState } from '../types';

interface FloatingWidgetProps {
  onNavigate: (view: ViewState) => void;
  onQuickAction: (action: string) => void;
}

export const FloatingWidget: React.FC<FloatingWidgetProps> = ({ onNavigate, onQuickAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'menu' | 'calculator'>('menu');
  const [calcInput, setCalcInput] = useState('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newOp, setNewOp] = useState(true);

  // Calculator Logic
  const handleNum = (num: string) => {
    if (newOp) {
      setCalcInput(num);
      setNewOp(false);
    } else {
      setCalcInput(calcInput === '0' ? num : calcInput + num);
    }
  };

  const handleOp = (op: string) => {
    setOperation(op);
    setPrevVal(parseFloat(calcInput));
    setNewOp(true);
  };

  const handleEqual = () => {
    if (prevVal !== null && operation) {
      const current = parseFloat(calcInput);
      let result = 0;
      switch (operation) {
        case '+': result = prevVal + current; break;
        case '-': result = prevVal - current; break;
        case '*': result = prevVal * current; break;
        case '/': result = prevVal / current; break;
      }
      setCalcInput(String(Number(result.toFixed(2)))); // Prevent long decimals
      setPrevVal(null);
      setOperation(null);
      setNewOp(true);
    }
  };

  const handleClear = () => {
    setCalcInput('0');
    setPrevVal(null);
    setOperation(null);
    setNewOp(true);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen) setMode('menu'); // Reset to menu on close
  };

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[90] flex flex-col items-end gap-4 pointer-events-none">
      
      {/* Expanded Content */}
      <div className={`transition-all duration-300 origin-bottom-right pointer-events-auto ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 translate-y-10 pointer-events-none'}`}>
        
        {mode === 'calculator' ? (
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl p-4 w-64 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2"><Calculator size={14}/> Calculator</h3>
               <button onClick={() => setMode('menu')} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"><X size={16}/></button>
            </div>
            <div className="bg-slate-100 dark:bg-black/40 p-3 rounded-xl mb-3 text-right text-2xl font-mono font-bold text-slate-800 dark:text-white truncate">
              {calcInput}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['C', '/', '*', '-'].map(op => (
                <button key={op} onClick={() => op === 'C' ? handleClear() : handleOp(op)} className={`p-3 rounded-lg font-bold text-sm ${op === 'C' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{op}</button>
              ))}
              {['7', '8', '9', '+'].map(op => (
                <button key={op} onClick={() => op === '+' ? handleOp(op) : handleNum(op)} className={`p-3 rounded-lg font-bold text-sm ${op === '+' ? 'bg-blue-100 text-blue-600 row-span-2 h-full' : 'bg-white dark:bg-white/10 shadow-sm'}`} style={op === '+' ? { gridRow: 'span 2' } : {}}>{op}</button>
              ))}
              {['4', '5', '6'].map(op => (
                <button key={op} onClick={() => handleNum(op)} className="p-3 rounded-lg font-bold text-sm bg-white dark:bg-white/10 shadow-sm">{op}</button>
              ))}
              {['1', '2', '3', '='].map(op => (
                <button key={op} onClick={() => op === '=' ? handleEqual() : handleNum(op)} className={`p-3 rounded-lg font-bold text-sm ${op === '=' ? 'bg-emerald-500 text-white row-span-2 h-full' : 'bg-white dark:bg-white/10 shadow-sm'}`} style={op === '=' ? { gridRow: 'span 2' } : {}}>{op}</button>
              ))}
              <button onClick={() => handleNum('0')} className="col-span-2 p-3 rounded-lg font-bold text-sm bg-white dark:bg-white/10 shadow-sm">0</button>
              <button onClick={() => handleNum('.')} className="p-3 rounded-lg font-bold text-sm bg-white dark:bg-white/10 shadow-sm">.</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 items-end">
             <button onClick={() => { onNavigate('POS'); onQuickAction('scan'); setIsOpen(false); }} className="flex items-center gap-3 pr-2 group">
                <span className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">Scan Item</span>
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-white/20 flex items-center justify-center text-blue-600 hover:scale-110 transition-transform">
                   <ScanBarcode size={20} />
                </div>
             </button>
             <button onClick={() => { onNavigate('EXPENSES'); setIsOpen(false); }} className="flex items-center gap-3 pr-2 group">
                <span className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">Add Expense</span>
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-white/20 flex items-center justify-center text-amber-600 hover:scale-110 transition-transform">
                   <Receipt size={20} />
                </div>
             </button>
             <button onClick={() => setMode('calculator')} className="flex items-center gap-3 pr-2 group">
                <span className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">Calculator</span>
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-white/20 flex items-center justify-center text-purple-600 hover:scale-110 transition-transform">
                   <Calculator size={20} />
                </div>
             </button>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button 
        onClick={toggleOpen}
        className={`pointer-events-auto w-14 h-14 rounded-[1.2rem] shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-95 z-50 ${isOpen ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 rotate-45' : 'bg-primary text-white hover:bg-blue-600'}`}
      >
        <Plus size={28} strokeWidth={3} />
      </button>
    </div>
  );
};
