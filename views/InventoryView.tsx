
import React, { useState, useEffect, useRef } from 'react';
import { Product, StoreSettings, User } from '../types';
import { Plus, Trash2, RefreshCw, Search, AlertTriangle, Bell, Lock, Box, Edit, ScanBarcode, DollarSign, Download, Upload, Printer, X, QrCode } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useAlert } from '../components/Alert';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

interface InventoryViewProps {
  products: Product[];
  onDeleteProduct: (id: string) => void;
  onUpdateProduct: (p: Product) => void;
  onImportProducts: (products: Product[]) => void;
  settings: StoreSettings;
  currentUser: User;
  onOpenProductModal: (product: Product | null) => void;
}

const PrintableLabel = ({ product, settings, mode }: { product: Product, settings: StoreSettings, mode: 'barcode' | 'qrcode' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        // Clear canvas
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        if (mode === 'barcode') {
            try {
                const codeValue = product.barcode || product.id.substring(0, 12);
                JsBarcode(canvasRef.current, codeValue, {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 1.5,
                    height: 35,
                    displayValue: true,
                    fontSize: 9,
                    margin: 0,
                    textMargin: 0
                });
            } catch (e) {
                console.error("Barcode generation failed", e);
            }
        } else {
            const qrValue = product.barcode || product.id;
            QRCode.toCanvas(canvasRef.current, qrValue, { 
                width: 80,
                margin: 0,
                errorCorrectionLevel: 'M'
            }, (error) => {
                if (error) console.error("QR generation failed", error);
            });
        }
    }, [mode, product]);

    return (
        <div className="bg-white text-black p-1 w-[50mm] h-[30mm] shadow-sm rounded-sm flex flex-col items-center justify-center text-center leading-tight overflow-hidden border border-gray-200 print:border-none print:shadow-none break-inside-avoid page-break-inside-avoid relative">
            <p className="text-[8px] font-bold uppercase tracking-wider mb-0.5 w-full truncate px-1">{settings.storeName}</p>
            <p className="font-bold text-[9px] line-clamp-2 leading-tight mb-0.5 px-1 w-full break-words">{product.name}</p>
            <p className="font-extrabold text-xs leading-none my-0.5">{settings.currency}{product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            
            <div className="mt-0.5 flex-1 flex items-center justify-center w-full overflow-hidden">
                 <canvas ref={canvasRef} className="max-w-full max-h-full"></canvas>
            </div>
        </div>
    );
};

const ProductLabelPrint = ({ product, settings, onClose }: { product: Product, settings: StoreSettings, onClose: () => void }) => {
    const [mode, setMode] = useState<'barcode' | 'qrcode'>('barcode');

    return (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:block animate-fade-in">
            <div className="relative flex flex-col items-center w-full max-w-sm print:w-full print:block print:static">
                <div className="flex flex-col items-center gap-4 mb-8 shrink-0 print:hidden">
                    <div className="flex gap-2 p-1 bg-white/20 backdrop-blur-md rounded-xl border border-white/20">
                        <button 
                            onClick={() => setMode('barcode')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === 'barcode' ? 'bg-white text-primary shadow-sm' : 'text-white hover:bg-white/10'}`}
                        >
                            <ScanBarcode size={16} /> Barcode
                        </button>
                        <button 
                            onClick={() => setMode('qrcode')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === 'qrcode' ? 'bg-white text-primary shadow-sm' : 'text-white hover:bg-white/10'}`}
                        >
                            <QrCode size={16} /> QR Code
                        </button>
                    </div>
                    
                    <div className="flex gap-2">
                        <button onClick={() => window.print()} className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl hover:bg-gray-100 transition-colors transform hover:scale-105 active:scale-95">
                            <Printer size={20} /> Print Label
                        </button>
                        <button onClick={onClose} className="bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors backdrop-blur-md">
                            <X size={20} />
                        </button>
                    </div>
                </div>
                
                {/* Preview Wrapper */}
                <div className="shadow-2xl print:shadow-none">
                    <PrintableLabel product={product} settings={settings} mode={mode} />
                </div>
                <p className="text-white/80 text-sm mt-6 print:hidden font-medium bg-black/20 px-4 py-1 rounded-full backdrop-blur-md">Preview (50mm x 30mm)</p>
            </div>
        </div>
    );
};

const BulkLabelPrint = ({ products, settings, onClose }: { products: Product[], settings: StoreSettings, onClose: () => void }) => {
    const [mode, setMode] = useState<'barcode' | 'qrcode'>('barcode');

    return (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:block animate-fade-in">
            <div className="relative flex flex-col items-center w-full max-w-5xl h-[85vh] print:w-full print:max-w-full print:h-auto print:static">
                {/* Controls - Hidden on Print */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 shrink-0 print:hidden w-full bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Printer className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Bulk Print Labels</h3>
                            <p className="text-xs text-slate-400">{products.length} products selected</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                         <div className="flex gap-1 p-1 bg-black/40 rounded-xl border border-white/10">
                            <button onClick={() => setMode('barcode')} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${mode === 'barcode' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                                <ScanBarcode size={14} /> Barcode
                            </button>
                            <button onClick={() => setMode('qrcode')} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${mode === 'qrcode' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                                <QrCode size={14} /> QR Code
                            </button>
                        </div>
                        <div className="h-8 w-px bg-white/10"></div>
                        <button onClick={() => window.print()} className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-blue-600 transition-colors text-sm">
                            <Printer size={16} /> Print All
                        </button>
                        <button onClick={onClose} className="bg-white/10 text-white p-2.5 rounded-xl hover:bg-white/20 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Preview Area */}
                <div className="flex-1 w-full overflow-y-auto bg-slate-200/90 dark:bg-black/50 p-8 rounded-3xl print:p-0 print:bg-white print:overflow-visible no-scrollbar shadow-inner">
                    <div className="flex flex-wrap gap-1 justify-center print:justify-start print:gap-0 print:block">
                        {products.map(p => (
                            <div key={p.id} className="m-1 inline-block print:m-0 print:float-left print:mb-1 break-inside-avoid">
                                <PrintableLabel product={p} settings={settings} mode={mode} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const InventoryView: React.FC<InventoryViewProps> = ({ products, onDeleteProduct, onUpdateProduct, onImportProducts, settings, currentUser, onOpenProductModal }) => {
  const [search, setSearch] = useState('');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [printingProduct, setPrintingProduct] = useState<Product | null>(null);
  const [isBulkPrintOpen, setIsBulkPrintOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const lowStockThreshold = settings.lowStockThreshold;
  const isStaff = currentUser.role === 'Staff';
  const prevLowStockCount = useRef<number>(0);
  const { showToast } = useToast();
  const { showConfirm } = useAlert();

  useEffect(() => { if ('Notification' in window) setNotificationPermission(Notification.permission); }, []);

  const handleRequestPermission = async () => {
    if (!('Notification' in window)) { showToast('Notifications not supported', 'error'); return; }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') { showToast('Notifications enabled', 'success'); }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.barcode && p.barcode.includes(search)));
  const lowStockItems = products.filter(p => p.stock <= lowStockThreshold);

  useEffect(() => {
    if (lowStockItems.length > 0 && notificationPermission === 'granted' && lowStockItems.length > prevLowStockCount.current) {
        try {
            new Notification('Low Stock Warning', {
                body: `${lowStockItems.length} products are running low on inventory.`,
                icon: '/vite.svg',
            });
        } catch (e) {
            console.error("Notification failed", e);
        }
    }
    prevLowStockCount.current = lowStockItems.length;
  }, [lowStockItems.length, notificationPermission]);

  const handleReorder = (product: Product) => {
    onUpdateProduct({ ...product, stock: product.stock + (product.itemsPerCase || 20) });
    showToast(`Restocked ${product.name}`, 'success');
  };

  const handleDeleteClick = async (productId: string) => {
    const isConfirmed = await showConfirm({
        title: 'Delete Product',
        message: 'Are you sure you want to delete this product? This action cannot be undone and may affect transaction history.',
        variant: 'danger',
        confirmText: 'Delete',
    });

    if (isConfirmed) { 
      onDeleteProduct(productId); 
      showToast('Product deleted', 'success'); 
    }
  };

  // --- Export Functionality ---
  const handleExport = () => {
    const headers = ['Name', 'Category', 'Price', 'Cost', 'Stock', 'Barcode', 'Description', 'ItemsPerCase'];
    const csvContent = [
      headers.join(','),
      ...products.map(p => [
        `"${(p.name || '').replace(/"/g, '""')}"`,
        `"${(p.category || 'Other').replace(/"/g, '""')}"`,
        p.price || 0,
        p.cost || 0,
        p.stock || 0,
        `"${(p.barcode || '').replace(/"/g, '""')}"`,
        `"${(p.description || '').replace(/"/g, '""')}"`,
        p.itemsPerCase || 1
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Import Functionality ---
  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      try {
        const lines = text.split(/\r\n|\n/);
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
        
        const newProducts: Product[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
          
          if (row.length < 3) continue;

          const product: any = { id: `imp-${Date.now()}-${i}`, image: '' };
          
          headers.forEach((h, idx) => {
            const val = row[idx];
            if (h === 'name') product.name = val;
            else if (h === 'category') product.category = val;
            else if (h === 'price') product.price = parseFloat(val) || 0;
            else if (h === 'cost') product.cost = parseFloat(val) || 0;
            else if (h === 'stock') product.stock = parseInt(val) || 0;
            else if (h === 'barcode') product.barcode = val;
            else if (h === 'description') product.description = val;
            else if (h === 'itemspercase') product.itemsPerCase = parseInt(val) || 1;
          });

          if (product.name && product.price >= 0) {
             if (!product.category) product.category = 'Other';
             newProducts.push(product as Product);
          }
        }

        if (newProducts.length > 0) {
          onImportProducts(newProducts);
        } else {
          showToast('No valid products found in file', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Failed to parse CSV file', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
             <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 drop-shadow-sm">Inventory</h2>
             <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">Manage product catalog</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {notificationPermission !== 'granted' && 'Notification' in window && (
            <button onClick={handleRequestPermission} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 rounded-xl hover:bg-indigo-500/20 transition-colors text-xs font-bold backdrop-blur-sm border border-indigo-500/20">
              <Bell size={16} /> Alerts
            </button>
          )}
          {!isStaff && (
            <>
                {products.length > 0 && (
                    <button onClick={() => setIsBulkPrintOpen(true)} className="px-3 py-2 bg-white/60 dark:bg-white/10 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm shadow-sm border border-white/20 hover:bg-white/80 dark:hover:bg-white/20 transition-colors flex items-center gap-2">
                        <Printer size={16} /> <span className="hidden sm:inline">Print All</span>
                    </button>
                )}
                <button onClick={handleExport} className="px-3 py-2 bg-white/60 dark:bg-white/10 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm shadow-sm border border-white/20 hover:bg-white/80 dark:hover:bg-white/20 transition-colors flex items-center gap-2">
                    <Download size={16} /> <span className="hidden sm:inline">Export</span>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
                <button onClick={handleImportClick} className="px-3 py-2 bg-white/60 dark:bg-white/10 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm shadow-sm border border-white/20 hover:bg-white/80 dark:hover:bg-white/20 transition-colors flex items-center gap-2">
                    <Upload size={16} /> <span className="hidden sm:inline">Import</span>
                </button>
                <button onClick={() => onOpenProductModal(null)} className="flex-1 sm:flex-none justify-center bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 font-bold text-sm">
                    <Plus size={18} /> <span>Add Product</span>
                </button>
            </>
          )}
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/20 backdrop-blur-md rounded-2xl p-3 flex items-start sm:items-center gap-3 animate-fade-in shadow-sm">
          <div className="p-2 bg-orange-100/50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-orange-900 dark:text-orange-200 font-bold text-sm">Low Stock Warning</h3>
            <p className="text-orange-800 dark:text-orange-300 text-xs mt-0.5 font-medium">
              <span className="font-bold">{lowStockItems.length} products</span> are below the threshold of {settings.lowStockThreshold}.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 dark:border-white/10 overflow-hidden flex flex-col min-h-[400px]">
         <div className="p-4 border-b border-white/20 dark:border-white/10 bg-white/20 dark:bg-white/5 flex flex-col sm:flex-row gap-3 justify-between items-center sticky top-0 z-10 backdrop-blur-md">
            <div className="relative w-full max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
               <input type="text" placeholder="Search by name or barcode..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/10 text-sm focus:bg-white/80 dark:focus:bg-slate-800/80 focus:border-primary/50 outline-none transition-all text-slate-800 dark:text-slate-200" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
         </div>

         {/* Desktop Table View */}
         <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/30 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold border-b border-white/20 dark:border-white/10">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Barcode</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  {!isStaff && <th className="p-4">Cost</th>}
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20 dark:divide-white/5">
                {filtered.map(product => {
                  const isLow = product.stock <= lowStockThreshold;
                  const cases = product.itemsPerCase && product.itemsPerCase > 1 ? Math.floor(product.stock / product.itemsPerCase) : null;
                  return (
                  <tr key={product.id} className={`hover:bg-white/30 dark:hover:bg-white/5 transition-colors ${isLow ? 'bg-red-500/5' : ''}`}>
                    <td className="p-4"><div className="flex items-center gap-3 min-w-[200px]"><img src={product.image} className="w-10 h-10 rounded-xl object-cover bg-white/20 shadow-sm" alt="" /><div><div className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{product.name}</div><div className="text-slate-500 text-xs truncate max-w-[150px]">{product.description}</div></div></div></td>
                    <td className="p-4">{product.barcode ? (<span className="font-mono text-xs bg-white/50 dark:bg-white/10 border border-white/20 px-2 py-1 rounded-lg text-slate-600 dark:text-slate-400 flex items-center w-fit gap-1"><ScanBarcode size={12} /> {product.barcode}</span>) : <span className="text-slate-300 text-xs italic">None</span>}</td>
                    <td className="p-4"><span className="px-3 py-1 rounded-lg bg-white/50 dark:bg-white/10 border border-white/20 text-slate-600 dark:text-slate-300 text-xs font-bold">{product.category}</span></td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{settings.currency}{product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    {!isStaff && <td className="p-4 font-medium text-slate-500">{product.cost ? `${settings.currency}${product.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}</td>}
                    <td className="p-4"><div className={`flex items-center gap-2 font-bold transition-all ${isLow ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>{product.stock} Units {isLow && <AlertTriangle size={16} className="text-red-500 animate-pulse" />}</div>{cases !== null && <div className="text-xs text-slate-400 mt-0.5 flex gap-1"><Box size={12}/>{cases} cases</div>}</td>
                    <td className="p-4 text-right"><div className="flex items-center justify-end gap-2">{isStaff ? <span className="text-slate-300 p-2"><Lock size={16} /></span> : (<>{isLow && <button onClick={() => handleReorder(product)} className="p-2 bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 rounded-lg" title="Reorder"><RefreshCw size={16} /></button>}<button onClick={() => setPrintingProduct(product)} className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg" title="Print Label"><Printer size={16} /></button><button onClick={() => onOpenProductModal(product)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg" title="Edit"><Edit size={16} /></button><button onClick={() => handleDeleteClick(product.id)} className="p-2 text-red-400 hover:bg-red-500/10 hover:text-red-600 rounded-lg" title="Delete"><Trash2 size={16} /></button></>)}</div></td>
                  </tr>
                )})}
              </tbody>
            </table>
         </div>

         {/* Mobile Card View */}
         <div className="md:hidden p-3 space-y-3 bg-white/10 dark:bg-white/5">
            {filtered.map(product => {
              const isLow = product.stock <= lowStockThreshold;
              const cases = product.itemsPerCase && product.itemsPerCase > 1 ? Math.floor(product.stock / product.itemsPerCase) : null;
              return (
                <div key={product.id} className={`p-3 rounded-xl border ${isLow ? 'bg-red-500/5 border-red-500/20' : 'bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-white/10'} backdrop-blur-md shadow-sm`}>
                   <div className="flex gap-3 mb-2"><img src={product.image} className="w-12 h-12 rounded-lg object-cover bg-white/20 shadow-sm" alt="" /><div className="flex-1 min-w-0"><div className="flex justify-between items-start"><h4 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1 text-sm">{product.name}</h4><span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{settings.currency}{product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div><p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{product.category}</p>{product.barcode && (<div className="flex items-center gap-1 mt-1"><ScanBarcode size={10} className="text-slate-400" /><span className="text-[10px] font-mono text-slate-500 bg-white/40 dark:bg-white/10 px-1.5 py-0.5 rounded">{product.barcode}</span></div>)}</div></div>
                   <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                      <div className="flex flex-col">
                         <div className={`text-xs font-bold flex items-center gap-1 ${isLow ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>{isLow && <AlertTriangle size={12} />}{product.stock} Units</div>
                         {cases !== null && <span className="text-[9px] text-slate-400 flex items-center gap-1"><Box size={10}/> {cases} cases</span>}
                      </div>
                      <div className="flex gap-2">
                        {!isStaff && product.cost && (<div className="flex items-center text-[10px] text-slate-400 bg-slate-100 dark:bg-white/5 px-2 rounded-lg mr-auto"><DollarSign size={10}/> Cost: {product.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>)}
                        {!isStaff && isLow && (<button onClick={() => handleReorder(product)} className="p-1.5 bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 rounded-lg text-[10px] font-bold flex items-center gap-1"><RefreshCw size={12} /> Restock</button>)}
                        {!isStaff && (<><button onClick={() => setPrintingProduct(product)} className="p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"><Printer size={14}/></button><button onClick={() => onOpenProductModal(product)} className="p-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg"><Edit size={14} /></button><button onClick={() => handleDeleteClick(product.id)} className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg"><Trash2 size={14} /></button></>)}
                      </div>
                   </div>
                </div>
              );
            })}
         </div>
      </div>
      
      {printingProduct && (
          <ProductLabelPrint product={printingProduct} settings={settings} onClose={() => setPrintingProduct(null)} />
      )}

      {isBulkPrintOpen && (
          <BulkLabelPrint products={filtered} settings={settings} onClose={() => setIsBulkPrintOpen(false)} />
      )}
    </div>
  );
};
