
import React from 'react';
import { createPortal } from 'react-dom';
import { Transaction, StoreSettings } from '../types';
import { X, Printer } from 'lucide-react';

interface InvoiceProps {
  transaction: Transaction | null;
  settings: StoreSettings;
  onClose?: () => void;
}

const ReceiptContent = ({ transaction, settings }: { transaction: Transaction, settings: StoreSettings }) => {
    const subtotal = transaction.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return (
        <div className="w-[80mm] mx-auto print:w-full font-mono text-black leading-tight bg-white p-4 print:p-0">
             <div className="text-center mb-4 pb-4 border-b-2 border-black border-dashed">
                <h1 className="text-xl font-bold uppercase mb-1">{settings.storeName}</h1>
                {settings.receiptHeader && <p className="text-sm mb-2">{settings.receiptHeader}</p>}
                <div className="text-xs mt-2 space-y-1">
                <p>{new Date(transaction.date).toLocaleDateString()} {new Date(transaction.date).toLocaleTimeString()}</p>
                <p>Order #{transaction.id.slice(-6)}</p>
                {transaction.customerName && <p className="font-bold">Customer: {transaction.customerName}</p>}
                </div>
            </div>

            <div className="mb-4 pb-4 border-b-2 border-black border-dashed">
                <table className="w-full text-xs text-left">
                <thead>
                    <tr>
                    <th className="pb-2 w-8">Qty</th>
                    <th className="pb-2">Item</th>
                    <th className="pb-2 text-right">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {transaction.items.map((item, idx) => (
                    <tr key={`${item.id}-${idx}`}>
                        <td className="align-top py-1">{item.quantity}</td>
                        <td className="align-top py-1">
                        {item.name}
                        {item.quantity > 1 && <div className="text-[10px] text-gray-600">@{settings.currency}{item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>}
                        </td>
                        <td className="align-top py-1 text-right">{settings.currency}{(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            <div className="mb-4 pb-4 border-b-2 border-black border-dashed text-right text-sm">
                <div className="flex justify-between mb-1"><span>Subtotal</span><span>{settings.currency}{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                {transaction.discount && transaction.discount > 0 && <div className="flex justify-between mb-1"><span>Discount</span><span>-{settings.currency}{transaction.discount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>}
                <div className="flex justify-between mb-1"><span>Tax ({settings.taxRate}%)</span><span>{settings.currency}{transaction.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between font-bold text-lg mt-2"><span>TOTAL</span><span>{settings.currency}{transaction.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                {settings.exchangeRate > 0 && <div className="flex justify-between font-bold text-[10px] mt-1 text-gray-600"><span>{settings.secondaryCurrency}</span><span>{(transaction.total * settings.exchangeRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>}
            </div>

            <div className="mb-6 text-xs text-center">
                <p className="uppercase mb-1">Payment Method: {transaction.paymentMethod}</p>
                <p>Status: PAID</p>
            </div>

            <div className="text-center text-xs">
                <p className="font-bold mb-2">Thank You!</p>
                {settings.receiptFooter && <p>{settings.receiptFooter}</p>}
                <p className="mt-4 text-[8px] text-gray-400">Powered by ANAJAK POS</p>
            </div>
        </div>
    )
}

export const Invoice: React.FC<InvoiceProps> = ({ transaction, settings, onClose }) => {
  if (!transaction) return null;
  const isPreview = !!onClose;

  if (isPreview) {
    return createPortal(
        <div className="print-portal fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:block animate-fade-in">
             <div className="relative flex flex-col items-center max-h-full print:w-full print:block print:static">
                <div className="flex gap-2 mb-4 shrink-0 print:hidden w-full max-w-[80mm] justify-between">
                    <button onClick={() => window.print()} className="bg-white text-black px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg hover:bg-gray-100 transition-colors">
                        <Printer size={16} /> Print
                    </button>
                    <button onClick={onClose} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="bg-white shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto rounded-sm scrollbar-thin print:shadow-none print:max-h-full print:overflow-visible">
                     <ReceiptContent transaction={transaction} settings={settings} />
                </div>
             </div>
        </div>,
        document.body
    );
  }

  return createPortal(
    <div className="print-portal hidden print:block fixed inset-0 bg-white z-[9999] p-0 overflow-hidden">
         <ReceiptContent transaction={transaction} settings={settings} />
    </div>,
    document.body
  );
};
