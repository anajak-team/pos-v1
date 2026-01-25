
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Shift, StoreSettings } from '../types';
import { Printer, X, LogOut } from 'lucide-react';
import { TRANSLATIONS } from '../translations';

interface ShiftReportProps {
  shift: Shift;
  settings: StoreSettings;
  onClose: () => void;
}

export const ShiftReport: React.FC<ShiftReportProps> = ({ shift, settings, onClose }) => {
    const totalSales = (shift.cashSales || 0) + (shift.cardSales || 0) + (shift.digitalSales || 0);
    const expectedCash = (shift.startingCash || 0) + (shift.cashSales || 0);
    const actualCash = shift.countedCash !== undefined ? shift.countedCash : 0;
    const difference = shift.difference !== undefined ? shift.difference : (actualCash - expectedCash);
    const endTime = shift.endTime ? new Date(shift.endTime) : new Date();
    
    const widthClass = settings.receiptPaperSize === '58mm' ? 'w-[58mm]' : 'w-[80mm]';
    const maxWidthClass = settings.receiptPaperSize === '58mm' ? 'max-w-[58mm]' : 'max-w-[80mm]';

    // Translation Helper
    const t = (key: keyof typeof TRANSLATIONS.en) => {
        const lang = settings?.language || 'en';
        // @ts-ignore
        return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key];
    };

    const format = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    useEffect(() => {
        // Automatically print when report opens (optional, but convenient for POS)
        // setTimeout(() => window.print(), 500);
    }, []);

    return createPortal(
        <div className="print-portal fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:block animate-fade-in">
            <div className="relative flex flex-col items-center w-full max-w-md max-h-full print:max-w-full print:max-h-full print:static">
                 <div className={`flex gap-3 mb-6 shrink-0 print:hidden w-full ${maxWidthClass} justify-between`}>
                    <button onClick={() => window.print()} className="flex-1 bg-white text-black px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-gray-100 transition-colors">
                        <Printer size={18} /> {t('PRINT')}
                    </button>
                    <button onClick={onClose} className="flex-1 bg-primary text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-blue-600 transition-colors">
                        <LogOut size={18} /> Finish
                    </button>
                </div>

                <div className={`bg-white ${widthClass} mx-auto shadow-2xl overflow-hidden rounded-sm print:shadow-none print:w-full font-mono text-black p-5 text-xs leading-tight`}>
                    <div className="text-center mb-4 pb-4 border-b-2 border-black border-dashed">
                        <h1 className="text-xl font-bold uppercase mb-1">{settings.storeName}</h1>
                        <p className="text-[10px] uppercase tracking-widest mb-2">{t('CLOSE_SHIFT')} Report</p>
                        
                        <div className="text-left mt-3 space-y-1">
                            <p>Shift ID: <span className="float-right">#{shift.id.slice(-6)}</span></p>
                            <p>Manager: <span className="float-right">{shift.userName}</span></p>
                            <p>Opened: <span className="float-right">{new Date(shift.startTime).toLocaleString()}</span></p>
                            <p>Closed: <span className="float-right">{endTime.toLocaleString()}</span></p>
                        </div>
                    </div>

                    <div className="mb-4 pb-4 border-b-2 border-black border-dashed">
                        <p className="font-bold mb-2 uppercase border-b border-black pb-1">{t('SALES_SUMMARY')}</p>
                        <div className="flex justify-between mb-1"><span>{t('CASH')}</span><span>{settings.currency}{format(shift.cashSales)}</span></div>
                        <div className="flex justify-between mb-1"><span>{t('CARD')}</span><span>{settings.currency}{format(shift.cardSales)}</span></div>
                        <div className="flex justify-between mb-1"><span>{t('DIGITAL')}</span><span>{settings.currency}{format(shift.digitalSales)}</span></div>
                        <div className="flex justify-between font-bold mt-2 pt-1 border-t border-dotted border-gray-400 text-sm"><span>{t('TOTAL')}</span><span>{settings.currency}{format(totalSales)}</span></div>
                    </div>

                    <div className="mb-6 pb-4 border-b-2 border-black border-dashed">
                        <p className="font-bold mb-2 uppercase border-b border-black pb-1">{t('CASH_RECONCILIATION')}</p>
                        <div className="flex justify-between mb-1"><span>{t('OPENING_FLOAT')}</span><span>{settings.currency}{format(shift.startingCash)}</span></div>
                        <div className="flex justify-between mb-1"><span>(+) {t('CASH')}</span><span>{settings.currency}{format(shift.cashSales)}</span></div>
                        <div className="flex justify-between font-bold mt-1 bg-gray-100 p-1"><span>{t('EXPECTED_DRAWER')}</span><span>{settings.currency}{format(expectedCash)}</span></div>
                        <div className="flex justify-between font-bold mt-1 p-1"><span>{t('COUNTED_CASH')}</span><span>{settings.currency}{format(actualCash)}</span></div>
                        
                        <div className="flex justify-between font-bold mt-2 pt-1 border-t border-dotted border-gray-400">
                            <span>{t('DIFFERENCE')}</span>
                            <span className={`${difference < 0 ? 'text-black font-black' : ''}`}>
                                {difference > 0 ? '+' : ''}{settings.currency}{format(difference)}
                            </span>
                        </div>
                        {difference !== 0 && (
                            <p className="text-[10px] italic mt-1 text-center">
                                {difference > 0 ? '(Overage)' : '(Shortage)'}
                            </p>
                        )}
                    </div>
                    
                    <div className="text-center pt-4 space-y-6">
                        <div>
                            <div className="border-b border-black w-3/4 mx-auto mb-1"></div>
                            <p>Manager Signature</p>
                        </div>
                        <p className="text-[8px]">Printed: {new Date().toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
