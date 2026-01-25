
import React from 'react';
import { createPortal } from 'react-dom';
import { Transaction, Expense, StoreSettings } from '../types';
import { Printer, X } from 'lucide-react';
import { TRANSLATIONS } from '../translations';

interface DailyReportProps {
  transactions: Transaction[];
  expenses: Expense[];
  settings: StoreSettings;
  onClose: () => void;
  date: Date;
}

export const DailyReport: React.FC<DailyReportProps> = ({ transactions, expenses, settings, onClose, date }) => {
  // Filter for the specific date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const dailyTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate >= startOfDay && tDate <= endOfDay;
  });

  const dailyExpenses = expenses.filter(e => {
    const eDate = new Date(e.date);
    return eDate >= startOfDay && eDate <= endOfDay;
  });

  const sales = dailyTransactions.filter(t => t.type === 'sale');
  const returns = dailyTransactions.filter(t => t.type === 'return');

  // Calculations
  const grossSales = sales.reduce((sum, t) => sum + t.total, 0); // Note: t.total is already net of discount in current types, but for reporting "Gross" usually means pre-discount. However, t.total + t.discount is gross.
  const totalDiscounts = sales.reduce((sum, t) => sum + (t.discount || 0), 0);
  const totalReturns = returns.reduce((sum, t) => sum + t.total, 0); // returns are positive values in t.total
  const netSales = grossSales - totalReturns; // Simplified: Gross (paid) - Returns

  const totalOrders = sales.length;
  const avgOrderValue = totalOrders > 0 ? netSales / totalOrders : 0;

  const totalExpenses = dailyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = netSales - totalExpenses; // Simplified Profit (Sales - Expenses, ignoring COGS for this simple view)

  // Payment Methods
  const payments = {
    cash: sales.filter(t => t.paymentMethod === 'cash').reduce((sum, t) => sum + t.total, 0),
    card: sales.filter(t => t.paymentMethod === 'card').reduce((sum, t) => sum + t.total, 0),
    digital: sales.filter(t => t.paymentMethod === 'digital').reduce((sum, t) => sum + t.total, 0),
  };

  const widthClass = settings.receiptPaperSize === '58mm' ? 'w-[58mm]' : 'w-[80mm]';
  const maxWidthClass = settings.receiptPaperSize === '58mm' ? 'max-w-[58mm]' : 'max-w-[80mm]';

  // Translation
  const t = (key: keyof typeof TRANSLATIONS.en) => {
    const lang = settings?.language || 'en';
    // @ts-ignore
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key];
  };

  const format = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return createPortal(
    <div className="print-portal fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:block animate-fade-in">
      <div className="relative flex flex-col items-center w-full max-w-sm print:w-full print:block print:static">
        <div className={`flex gap-2 mb-4 shrink-0 print:hidden w-full ${maxWidthClass} justify-between`}>
            <button onClick={() => window.print()} className="bg-white text-black px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg hover:bg-gray-100 transition-colors">
                <Printer size={16} /> {t('PRINT')}
            </button>
            <button onClick={onClose} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className={`bg-white ${widthClass} mx-auto shadow-2xl overflow-hidden rounded-sm print:shadow-none print:w-full font-mono text-black p-4 text-xs leading-tight`}>
            <div className="text-center mb-4 pb-4 border-b-2 border-black border-dashed">
                <h1 className="text-xl font-bold uppercase mb-1">{settings.storeName}</h1>
                <p className="text-[10px] uppercase tracking-widest font-bold">{t('DAILY_REPORT')}</p>
                <p className="mt-1">{date.toLocaleDateString()}</p>
            </div>

            <div className="mb-4 pb-4 border-b-2 border-black border-dashed">
                <p className="font-bold mb-2 uppercase border-b border-black pb-1">{t('SALES_SUMMARY')}</p>
                <div className="flex justify-between mb-1"><span>{t('GROSS_SALES')}</span><span>{settings.currency}{format(grossSales + totalDiscounts)}</span></div>
                {totalDiscounts > 0 && <div className="flex justify-between mb-1"><span>{t('DISCOUNT')}</span><span>-{settings.currency}{format(totalDiscounts)}</span></div>}
                <div className="flex justify-between mb-1"><span>{t('RETURNS')}</span><span>-{settings.currency}{format(totalReturns)}</span></div>
                <div className="flex justify-between font-bold mt-2 pt-1 border-t border-dotted border-gray-400 text-sm"><span>{t('NET_SALES')}</span><span>{settings.currency}{format(netSales)}</span></div>
            </div>

            <div className="mb-4 pb-4 border-b-2 border-black border-dashed">
                <p className="font-bold mb-2 uppercase border-b border-black pb-1">{t('PAYMENTS')}</p>
                <div className="flex justify-between mb-1"><span>{t('CASH')}</span><span>{settings.currency}{format(payments.cash)}</span></div>
                <div className="flex justify-between mb-1"><span>{t('CARD')}</span><span>{settings.currency}{format(payments.card)}</span></div>
                <div className="flex justify-between mb-1"><span>{t('DIGITAL')}</span><span>{settings.currency}{format(payments.digital)}</span></div>
            </div>

            <div className="mb-4 pb-4 border-b-2 border-black border-dashed">
                <p className="font-bold mb-2 uppercase border-b border-black pb-1">{t('PERFORMANCE')}</p>
                <div className="flex justify-between mb-1"><span>{t('TOTAL_ORDERS')}</span><span>{totalOrders}</span></div>
                <div className="flex justify-between mb-1"><span>{t('AVG_VALUE')}</span><span>{settings.currency}{format(avgOrderValue)}</span></div>
            </div>

            <div className="mb-6 pb-4 border-b-2 border-black border-dashed">
                <p className="font-bold mb-2 uppercase border-b border-black pb-1">{t('PROFIT_LOSS')}</p>
                <div className="flex justify-between mb-1"><span>{t('NET_SALES')}</span><span>{settings.currency}{format(netSales)}</span></div>
                <div className="flex justify-between mb-1"><span>{t('TOTAL_EXPENSES')}</span><span>-{settings.currency}{format(totalExpenses)}</span></div>
                <div className="flex justify-between font-bold mt-2 pt-1 border-t border-dotted border-gray-400"><span>{t('NET_PROFIT')}</span><span>{settings.currency}{format(netProfit)}</span></div>
            </div>

            <div className="text-center text-[8px] text-gray-500">
                Generated: {new Date().toLocaleString()}
            </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
