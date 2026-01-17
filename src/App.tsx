
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { PosView } from './views/PosView';
import { InventoryView } from './views/InventoryView';
import { SettingsView } from './views/SettingsView';
import { PurchaseView } from './views/PurchaseView';
import { ExpensesView } from './views/ExpensesView';
import { ReportsView } from './views/ReportsView';
import { RepairsView } from './views/RepairsView';
import { LandingPage } from './views/LandingPage';
import { LandingPageBuilderView } from './views/LandingPageBuilderView';
import { Invoice } from './components/Invoice';
import { ShiftReport } from './components/ShiftReport';
import { ShiftEntryModal } from './components/ShiftEntryModal';
import { CloseShiftModal } from './components/CloseShiftModal';
import { WalletModal } from './components/WalletModal';
import { ViewState, Product, Transaction, StoreSettings, PurchaseOrder, User, Shift, Expense, CartItem, Customer, StoredUser, RepairTicket, CashMovement, Supplier } from './types';
import * as api from './services/storageService';
import { FileText, Printer, Wand2, ScanBarcode, Box, Image as ImageIcon, Upload, X, Check, ZoomIn, ZoomOut, Move, Save, Loader2, Minus, Plus, Undo2, Eye, Camera } from 'lucide-react';
import { useToast } from './components/Toast';
import { generateProductDescription } from './services/geminiService';

const ImageCropper = ({ imageSrc, onCrop, onCancel }: { imageSrc: string, onCrop: (croppedImage: string) => void, onCancel: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const VIEWPORT_SIZE = 280;
  const OUTPUT_SIZE = 400;

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      imageRef.current = img;
      const aspect = img.width / img.height;
      let drawWidth, drawHeight;
      if (aspect > 1) {
        drawHeight = VIEWPORT_SIZE;
        drawWidth = VIEWPORT_SIZE * aspect;
      } else {
        drawWidth = VIEWPORT_SIZE;
        drawHeight = VIEWPORT_SIZE / aspect;
      }
      const initialPos = { x: (VIEWPORT_SIZE - drawWidth) / 2, y: (VIEWPORT_SIZE - drawHeight) / 2 };
      setPosition(initialPos);
      draw(img, 1, initialPos);
    };
  }, [imageSrc]);

  const draw = (img: HTMLImageElement, currentScale: number, currentPos: { x: number, y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const aspect = img.width / img.height;
    let drawWidth, drawHeight;
    if (aspect > 1) {
      drawHeight = VIEWPORT_SIZE * currentScale;
      drawWidth = VIEWPORT_SIZE * aspect * currentScale;
    } else {
      drawWidth = VIEWPORT_SIZE * currentScale;
      drawHeight = (VIEWPORT_SIZE / aspect) * currentScale;
    }
    ctx.drawImage(img, currentPos.x, currentPos.y, drawWidth, drawHeight);
  };

  useEffect(() => { if (imageRef.current) draw(imageRef.current, scale, position) }, [scale, position]);

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => { e.preventDefault(); setIsDragging(true); const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX; const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY; setDragStart({ x: clientX - position.x, y: clientY - position.y }); };
  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => { if (!isDragging) return; e.preventDefault(); const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX; const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY; setPosition({ x: clientX - dragStart.x, y: clientY - dragStart.y }); };
  const handlePointerUp = () => setIsDragging(false);

  const handleSave = () => {
    if (!imageRef.current || !canvasRef.current) return;
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = OUTPUT_SIZE;
    outputCanvas.height = OUTPUT_SIZE;
    const ctx = outputCanvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    const ratio = OUTPUT_SIZE / VIEWPORT_SIZE;
    const aspect = imageRef.current.width / imageRef.current.height;
    let drawWidth, drawHeight;
    if (aspect > 1) { drawHeight = OUTPUT_SIZE * scale; drawWidth = OUTPUT_SIZE * aspect * scale; } else { drawWidth = OUTPUT_SIZE * scale; drawHeight = (OUTPUT_SIZE / aspect) * scale; }
    ctx.drawImage(imageRef.current, position.x * ratio, position.y * ratio, drawWidth, drawHeight);
    onCrop(outputCanvas.toDataURL('image/jpeg', 0.85));
  };
  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center"><h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Move size={16} /> Adjust Image</h3><button onClick={onCancel} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"><X size={20}/></button></div>
        <div className="p-6 flex flex-col items-center bg-slate-100 dark:bg-slate-950/50"><div className="relative overflow-hidden rounded-xl shadow-inner border-2 border-slate-300 dark:border-slate-700 cursor-move touch-none" style={{ width: VIEWPORT_SIZE, height: VIEWPORT_SIZE }} onMouseDown={handlePointerDown} onMouseMove={handlePointerMove} onMouseUp={handlePointerUp} onMouseLeave={handlePointerUp} onTouchStart={handlePointerDown} onTouchMove={handlePointerMove} onTouchEnd={handlePointerUp}><canvas ref={canvasRef} width={VIEWPORT_SIZE} height={VIEWPORT_SIZE} className="block"/><div className="absolute inset-0 pointer-events-none border border-white/30 opacity-50"><div className="absolute top-1/3 w-full h-px bg-white/30"></div><div className="absolute top-2/3 w-full h-px bg-white/30"></div><div className="absolute left-1/3 h-full w-px bg-white/30"></div><div className="absolute left-2/3 h-full w-px bg-white/30"></div></div></div><div className="w-full mt-6 px-4"><div className="flex items-center gap-3 text-slate-500 dark:text-slate-400"><ZoomOut size={16} /><input type="range" min="1" max="3" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="flex-1 h-2 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"/><ZoomIn size={16} /></div></div></div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-3"><button onClick={onCancel} className="flex-1 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">Cancel</button><button onClick={handleSave} className="flex-1 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"><Check size={18} /> Save Image</button></div>
      </div>
    </div>
  );
};

const CameraCapture = ({ onCapture, onCancel }: { onCapture: (img: string) => void, onCancel: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        onCancel();
      }
    };

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onCancel]);

  const capture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black flex flex-col items-center justify-center">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <div className="absolute bottom-8 w-full flex justify-center items-center gap-10">
        <button 
          type="button"
          onClick={onCancel} 
          className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <X size={24} />
        </button>
        <button 
          type="button"
          onClick={capture} 
          className="p-1 rounded-full border-4 border-white transition-transform active:scale-95"
        >
          <div className="w-16 h-16 bg-white rounded-full"></div>
        </button>
      </div>
    </div>
  );
};

const BarcodeScanner = ({ onScan, onClose }: { onScan: (code: string) => void, onClose: () => void }) => {
  const scannerRef = useRef<any>(null);
  const [scanSuccess, setScanSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
        const Html5Qrcode = (window as any).Html5Qrcode;
        const Html5QrcodeSupportedFormats = (window as any).Html5QrcodeSupportedFormats;
        
        if (!Html5Qrcode) {
            console.error("Scanner library not loaded");
            onClose();
            return;
        }

        const elementId = "product-modal-scanner-reader";
        
        if (scannerRef.current) {
            try { scannerRef.current.clear(); } catch(e) {}
        }

        try {
            const formatsToSupport = [
                Html5QrcodeSupportedFormats.QR_CODE,
                Html5QrcodeSupportedFormats.UPC_A,
                Html5QrcodeSupportedFormats.UPC_E,
                Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.EAN_8,
                Html5QrcodeSupportedFormats.CODE_128,
                Html5QrcodeSupportedFormats.CODE_39,
                Html5QrcodeSupportedFormats.CODE_93,
                Html5QrcodeSupportedFormats.CODABAR,
                Html5QrcodeSupportedFormats.ITF,
                Html5QrcodeSupportedFormats.RSS_14,
                Html5QrcodeSupportedFormats.RSS_EXPANDED,
                Html5QrcodeSupportedFormats.PDF_417,
                Html5QrcodeSupportedFormats.AZTEC,
                Html5QrcodeSupportedFormats.DATA_MATRIX,
            ];

            const html5QrCode = new Html5Qrcode(elementId, {
                formatsToSupport: formatsToSupport,
                verbose: false,
                experimentalFeatures: {
                    useBarCodeDetectorIfSupported: true
                }
            });
            scannerRef.current = html5QrCode;
            
            const config = { 
                fps: 20, 
                videoConstraints: {
                    facingMode: "environment",
                    focusMode: "continuous"
                },
                aspectRatio: 1.0,
                disableFlip: false
            };
            
            html5QrCode.start(
                { facingMode: "environment" }, 
                config, 
                (decodedText: string) => {
                    if (scannerRef.current && !scanSuccess) {
                        setScanSuccess(true);
                        try {
                             const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                             if (AudioContext) {
                                 const ctx = new AudioContext();
                                 const osc = ctx.createOscillator();
                                 const gain = ctx.createGain();
                                 osc.connect(gain);
                                 gain.connect(ctx.destination);
                                 osc.frequency.setValueAtTime(800, ctx.currentTime);
                                 gain.gain.setValueAtTime(0.1, ctx.currentTime);
                                 osc.start();
                                 osc.stop(ctx.currentTime + 0.1);
                             }
                        } catch(e){}

                        setTimeout(() => {
                            if (scannerRef.current) {
                                scannerRef.current.stop().then(() => {
                                    scannerRef.current.clear();
                                    onScan(decodedText);
                                }).catch(() => {
                                    onScan(decodedText);
                                });
                            } else {
                                onScan(decodedText);
                            }
                        }, 500);
                    }
                },
                (errorMessage: string) => { }
            ).catch((err: any) => {
                console.error("Error starting scanner", err);
            });
        } catch (e) {
            console.error("Error init scanner", e);
        }
    }, 100);

    return () => {
        clearTimeout(timer);
        if (scannerRef.current) {
            try {
                scannerRef.current.stop().then(() => {
                    scannerRef.current.clear();
                }).catch(() => {
                    try { scannerRef.current.clear(); } catch(e){}
                });
            } catch(e) {}
        }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-fade-in">
        <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors z-50"
        >
            <X size={24} />
        </button>
        <div className="relative w-full max-w-sm aspect-square bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 mx-6">
            <div id="product-modal-scanner-reader" className="w-full h-full"></div>
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 rounded-2xl shadow-[0_0_0_1000px_rgba(0,0,0,0.7)] transition-all duration-300 ${scanSuccess ? 'border-green-500 shadow-[0_0_0_1000px_rgba(0,0,0,0.8)]' : 'border-primary/70'}`}>
                    <div className={`absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 -mt-1 -ml-1 ${scanSuccess ? 'border-green-500' : 'border-primary'}`}></div>
                    <div className={`absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 -mt-1 -mr-1 ${scanSuccess ? 'border-green-500' : 'border-primary'}`}></div>
                    <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 -mb-1 -ml-1 ${scanSuccess ? 'border-green-500' : 'border-primary'}`}></div>
                    <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 -mb-1 -mr-1 ${scanSuccess ? 'border-green-500' : 'border-primary'}`}></div>
                </div>
                {scanSuccess && <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"><Check size={64} className="text-green-500 animate-scale-in" /></div>}
            </div>
        </div>
        <p className="text-slate-400 mt-8 font-medium text-center px-6">{scanSuccess ? 'Barcode Detected!' : 'Align barcode or QR code within the frame to scan'}</p>
    </div>
  );
};

const ProductModal = ({ isOpen, onClose, onSave, productToEdit, categories }: { isOpen: boolean, onClose: () => void, onSave: (p: Partial<Product>) => void, productToEdit: Partial<Product> | null, categories: string[] }) => {
  const [formData, setFormData] = useState<Partial<Product>>({});
  
  useEffect(() => {
    if (productToEdit) setFormData(productToEdit);
    else setFormData({ name: '', price: 0, cost: 0, stock: 0, category: categories[0] || 'Other', description: '', barcode: '' });
  }, [productToEdit, isOpen, categories]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-lg border border-white/20">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{productToEdit ? 'Edit Product' : 'New Product'}</h3>
          <button onClick={onClose}><X size={22} /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <input className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20" placeholder="Product Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
             <input type="number" className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20" placeholder="Price" value={formData.price || 0} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
             <input type="number" className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20" placeholder="Cost" value={formData.cost || 0} onChange={e => setFormData({...formData, cost: parseFloat(e.target.value)})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <input type="number" className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20" placeholder="Stock" value={formData.stock || 0} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} />
             <select className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
          </div>
           <input className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20" placeholder="Barcode" value={formData.barcode || ''} onChange={e => setFormData({...formData, barcode: e.target.value})} />
           <textarea className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20" placeholder="Description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        <div className="p-6 border-t border-white/10 flex gap-3">
           <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-slate-600 hover:bg-white/30">Cancel</button>
           <button onClick={() => onSave(formData)} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg">Save</button>
        </div>
      </div>
    </div>
  );
};

// Transaction History View Component (Inline)
const TransactionHistoryView = ({ transactions, settings, onPrint }: { transactions: Transaction[], settings: StoreSettings, onPrint: (t: Transaction) => void }) => {
    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Transaction History</h2>
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-white/10 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/20 dark:bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Method</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {transactions.map((t: Transaction) => (
                            <tr key={t.id} className="hover:bg-white/10">
                                <td className="p-4 font-mono text-xs">{t.id.slice(-6)}</td>
                                <td className="p-4">{new Date(t.date).toLocaleString()}</td>
                                <td className="p-4">{t.customerName || 'Walk-in'}</td>
                                <td className="p-4 font-bold">{settings.currency}{t.total.toFixed(2)}</td>
                                <td className="p-4 capitalize">{t.paymentMethod}</td>
                                <td className="p-4">
                                    <button onClick={() => onPrint(t)} className="p-2 bg-white/20 rounded-lg hover:bg-white/30"><Printer size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export const App = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
    const [products, setProducts] = useState<Product[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [shift, setShift] = useState<Shift | null>(null);
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [users, setUsers] = useState<StoredUser[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [repairs, setRepairs] = useState<RepairTicket[]>([]);
    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [shiftModalOpen, setShiftModalOpen] = useState(false);
    const [closeShiftModalOpen, setCloseShiftModalOpen] = useState(false);
    const [walletModalOpen, setWalletModalOpen] = useState(false);
    const [productModalOpen, setProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [shiftReport, setShiftReport] = useState<Shift | null>(null);
    const [landingPageMode, setLandingPageMode] = useState(false);
    const [invoiceToPrint, setInvoiceToPrint] = useState<Transaction | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        const loadData = async () => {
            const loadedSettings = await api.getSettings();
            setSettings(loadedSettings);
            setProducts(await api.getProducts());
            setTransactions(await api.getTransactions());
            setUsers(await api.getUsers());
            setCustomers(await api.getCustomers());
            setSuppliers(await api.getSuppliers());
            setExpenses(await api.getExpenses());
            setRepairs(await api.getRepairs());
            setOrders(await api.getPurchaseOrders());
            setCategories(await api.getCategories());
            setShift(await api.getActiveShift());
            
            if (loadedSettings.theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };
        loadData();
    }, []);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
        if (!shift && user.role !== 'Admin') { // Admins might not need shift
            setShiftModalOpen(true);
        }
    };

    const handleStartShift = async (amount: number) => {
        if (!currentUser) return;
        const newShift: Partial<Shift> = {
            userId: currentUser.id,
            userName: currentUser.name,
            startTime: new Date().toISOString(),
            startingCash: amount,
            status: 'OPEN',
            cashSales: 0,
            cardSales: 0,
            digitalSales: 0,
            cashMovements: []
        };
        const savedShift = await api.saveShift(newShift);
        setShift(savedShift);
        setShiftModalOpen(false);
        showToast('Shift started', 'success');
    };

    const handleCloseShift = async (countedCash: number) => {
        if (!shift) return;
        const totalSales = shift.cashSales + shift.cardSales + shift.digitalSales;
        const payIn = shift.cashMovements?.filter(m => m.type === 'in').reduce((s, m) => s + m.amount, 0) || 0;
        const payOut = shift.cashMovements?.filter(m => m.type === 'out').reduce((s, m) => s + m.amount, 0) || 0;
        const expectedCash = shift.startingCash + shift.cashSales + payIn - payOut;
        
        const closedShift: Shift = {
            ...shift,
            endTime: new Date().toISOString(),
            status: 'CLOSED',
            totalSales,
            expectedCash,
            countedCash,
            difference: countedCash - expectedCash
        };
        
        await api.saveShift(closedShift);
        setShift(null);
        setCloseShiftModalOpen(false);
        setShiftReport(closedShift);
    };

    const handleAddProduct = async (p: Partial<Product>) => {
        const newProd = await api.addProduct(p);
        setProducts(prev => [...prev, newProd]);
        setProductModalOpen(false);
        return newProd;
    };

    const handleUpdateProduct = async (p: Product) => {
        const updated = await api.updateProduct(p);
        setProducts(prev => prev.map(prod => prod.id === updated.id ? updated : prod));
    };

    const handleDeleteProduct = async (id: string) => {
        await api.deleteProduct(id);
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const handleTransaction = async (t: Transaction) => {
        const saved = await api.saveTransaction(t);
        setTransactions(prev => [saved, ...prev]);
        
        // Update stock
        for (const item of t.items) {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const updated = { ...product, stock: product.stock - item.quantity };
                await api.updateProduct(updated);
                setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
            }
        }
        
        // Update Shift
        if (shift) {
            const update: Partial<Shift> = {
                id: shift.id,
                cashSales: shift.cashSales + (t.paymentMethod === 'cash' ? t.total : 0),
                cardSales: shift.cardSales + (t.paymentMethod === 'card' ? t.total : 0),
                digitalSales: shift.digitalSales + (t.paymentMethod === 'digital' ? t.total : 0)
            };
            const updatedShift = await api.saveShift(update);
            setShift(updatedShift);
        }

        // Update Customer
        if (t.customerId) {
            await api.updateCustomerStats(t.customerId, t.total);
            const updatedCustomers = await api.getCustomers(); // Refresh
            setCustomers(updatedCustomers);
        }
    };

    const handleAddWalletMovement = async (type: 'in' | 'out', amount: number, reason: string) => {
        if (!shift || !currentUser) return;
        const movement: CashMovement = {
            id: Date.now().toString(),
            type,
            amount,
            reason,
            timestamp: new Date().toISOString(),
            userId: currentUser.id,
            userName: currentUser.name
        };
        const updatedShift = await api.saveShift({
            id: shift.id,
            cashMovements: [...(shift.cashMovements || []), movement]
        });
        setShift(updatedShift);
        showToast(`Cash ${type === 'in' ? 'added' : 'removed'}`, 'success');
    };

    if (landingPageMode) {
        return <LandingPage onGetStarted={() => setLandingPageMode(false)} onViewDemo={() => setLandingPageMode(false)} settings={settings} products={products} />;
    }

    if (!currentUser) {
        return <LoginView onLogin={handleLogin} onBack={() => setLandingPageMode(true)} />;
    }

    return (
        <Layout 
            currentView={currentView} 
            onNavigate={setCurrentView} 
            storeName={settings?.storeName || 'POS'} 
            currentUser={currentUser} 
            onLogout={() => setCurrentUser(null)}
            onWalletClick={() => setWalletModalOpen(true)}
        >
            {currentView === 'DASHBOARD' && settings && <DashboardView transactions={transactions} isDarkMode={settings.theme === 'dark'} currentUser={currentUser} expenses={expenses} products={products} />}
            {currentView === 'POS' && settings && <PosView products={products} onCompleteTransaction={handleTransaction} onPrint={setInvoiceToPrint} settings={settings} currentUser={currentUser} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} onOpenProductModal={(p) => { setEditingProduct(p); setProductModalOpen(true); }} categories={categories} customers={customers} onAddCustomer={api.addCustomer} />}
            {currentView === 'INVENTORY' && settings && <InventoryView products={products} onDeleteProduct={handleDeleteProduct} onUpdateProduct={handleUpdateProduct} onImportProducts={async (ps) => { await api.saveProducts(ps); setProducts(await api.getProducts()); }} settings={settings} currentUser={currentUser} onOpenProductModal={(p) => { setEditingProduct(p); setProductModalOpen(true); }} />}
            {currentView === 'TRANSACTIONS' && settings && <TransactionHistoryView transactions={transactions} settings={settings} onPrint={setInvoiceToPrint} />}
            {currentView === 'SETTINGS' && settings && <SettingsView settings={settings} onSave={async (s) => { await api.saveSettings(s); setSettings(s); showToast('Settings saved', 'success'); }} transactions={transactions} currentUser={currentUser} categories={categories} onUpdateCategories={async (c) => { await api.saveCategories(c); setCategories(c); }} onRenameCategory={async (o, n) => { /* impl */ }} users={users} onAddUser={async (u) => { await api.addUser(u); setUsers(await api.getUsers()); }} onUpdateUser={async (u) => { await api.updateUser(u); setUsers(await api.getUsers()); }} onDeleteUser={async (id) => { await api.deleteUser(id); setUsers(await api.getUsers()); }} customers={customers} onAddCustomer={async (c) => { await api.addCustomer(c); setCustomers(await api.getCustomers()); }} onUpdateCustomer={async (c) => { await api.updateCustomer(c); setCustomers(await api.getCustomers()); }} onDeleteCustomer={async (id) => { await api.deleteCustomer(id); setCustomers(await api.getCustomers()); }} onNavigate={setCurrentView} />}
            {currentView === 'PURCHASES' && settings && <PurchaseView orders={orders} products={products} settings={settings} onCreateOrder={async (o) => { await api.savePurchaseOrder(o); setOrders(await api.getPurchaseOrders()); }} onReceiveOrder={async (id) => { /* impl */ }} currentUser={currentUser} />}
            {currentView === 'EXPENSES' && settings && <ExpensesView expenses={expenses} categories={categories} onAddExpense={async (e) => { await api.addExpense(e); setExpenses(await api.getExpenses()); }} onDeleteExpense={async (id) => { await api.deleteExpense(id); setExpenses(await api.getExpenses()); }} onUpdateCategories={async (c) => { await api.saveExpenseCategories(c); }} settings={settings} currentUser={currentUser} />}
            {currentView === 'REPORTS' && settings && <ReportsView transactions={transactions} expenses={expenses} settings={settings} currentUser={currentUser} />}
            {currentView === 'REPAIRS' && settings && <RepairsView repairs={repairs} customers={customers} onAddRepair={async (r) => { await api.addRepair(r); setRepairs(await api.getRepairs()); }} onUpdateRepair={async (r) => { await api.updateRepair(r); setRepairs(await api.getRepairs()); }} onDeleteRepair={async (id) => { await api.deleteRepair(id); setRepairs(await api.getRepairs()); }} settings={settings} currentUser={currentUser} />}
            {currentView === 'LANDING_BUILDER' && settings && <LandingPageBuilderView settings={settings} onSave={async (s) => { await api.saveSettings(s); setSettings(s); showToast('Layout saved', 'success'); }} onBack={() => setCurrentView('SETTINGS')} />}
            
            {shiftModalOpen && settings && <ShiftEntryModal currentUser={currentUser} onStartShift={handleStartShift} currency={settings.currency} onLogout={() => setCurrentUser(null)} />}
            {walletModalOpen && shift && settings && <WalletModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} shift={shift} onAddMovement={handleAddWalletMovement} onCloseShift={() => setCloseShiftModalOpen(true)} currency={settings.currency} />}
            {closeShiftModalOpen && shift && settings && <CloseShiftModal isOpen={closeShiftModalOpen} onClose={() => setCloseShiftModalOpen(false)} onConfirm={handleCloseShift} shift={shift} currency={settings.currency} />}
            {shiftReport && settings && <ShiftReport shift={shiftReport} settings={settings} onClose={() => setShiftReport(null)} />}
            {invoiceToPrint && settings && <Invoice transaction={invoiceToPrint} settings={settings} onClose={() => setInvoiceToPrint(null)} />}
            <ProductModal isOpen={productModalOpen} onClose={() => setProductModalOpen(false)} onSave={async (p) => { if(editingProduct) await handleUpdateProduct({...editingProduct, ...p} as Product); else await handleAddProduct(p); setProductModalOpen(false); }} productToEdit={editingProduct} categories={categories} />
        </Layout>
    );
};
