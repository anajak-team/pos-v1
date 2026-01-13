
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
import { ViewState, Product, Transaction, StoreSettings, PurchaseOrder, User, Shift, Expense, CartItem, Customer, StoredUser, RepairTicket, CashMovement } from './types';
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

  useEffect(() => {
    const timer = setTimeout(() => {
        const Html5Qrcode = (window as any).Html5Qrcode;
        if (!Html5Qrcode) {
            console.error("Scanner library not loaded");
            onClose();
            return;
        }

        const elementId = "product-modal-scanner-reader";
        const html5QrCode = new Html5Qrcode(elementId);
        scannerRef.current = html5QrCode;
        
        const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 };
        
        html5QrCode.start(
            { facingMode: "environment" }, 
            config, 
            (decodedText: string) => {
                if (scannerRef.current) {
                    scannerRef.current.stop().then(() => {
                        scannerRef.current.clear();
                        onScan(decodedText);
                    }).catch((err: any) => {
                        onScan(decodedText);
                    });
                }
            },
            (errorMessage: string) => {
                // ignore
            }
        ).catch((err: any) => {
            console.error("Error starting scanner", err);
        });
    }, 100);

    return () => {
        clearTimeout(timer);
        if (scannerRef.current) {
            if (scannerRef.current.isScanning) {
                scannerRef.current.stop().then(() => {
                    scannerRef.current.clear();
                }).catch(console.error);
            } else {
                scannerRef.current.clear();
            }
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary/70 rounded-2xl shadow-[0_0_0_1000px_rgba(0,0,0,0.7)]">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary -mt-1 -ml-1"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary -mt-1 -mr-1"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary -mb-1 -ml-1"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary -mb-1 -mr-1"></div>
                </div>
            </div>
        </div>
        <p className="text-slate-400 mt-8 font-medium text-center px-6">Align barcode or QR code within the frame to scan</p>
    </div>
  );
};

const ProductModal = ({ isOpen, onClose, onSave, productToEdit, categories }: { isOpen: boolean, onClose: () => void, onSave: (p: Partial<Product>) => void, productToEdit: Partial<Product> | null, categories: string[] }) => {
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (productToEdit) setFormData(productToEdit);
    else setFormData({ category: categories[0] || 'Other', name: '', price: 0, cost: 0, stock: 0, description: '', barcode: '', itemsPerCase: 1, image: '' });
  }, [productToEdit, isOpen, categories]);

  const handleGenerateDesc = async () => { if (formData.name) { setIsGenerating(true); const desc = await generateProductDescription(formData.name, formData.category || 'General'); setFormData(prev => ({ ...prev, description: desc })); setIsGenerating(false); } };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { if (file.size > 5 * 1024 * 1024) { showToast('Image size should be less than 5MB', 'error'); return; } const reader = new FileReader(); reader.onloadend = () => { setCropImage(reader.result as string); e.target.value = ''; }; reader.readAsDataURL(file); } };
  const handleCropComplete = (croppedImage: string) => { setFormData(prev => ({ ...prev, image: croppedImage })); setCropImage(null); };
  const handleRemoveImage = (e: React.MouseEvent) => { e.stopPropagation(); setFormData(prev => ({ ...prev, image: '' })); };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (formData.name && formData.price != null) { onSave(formData); } };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 my-auto">
        <div className="p-6 border-b border-white/10 bg-white/10"><h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{productToEdit ? 'Edit Product' : 'Add Product'}</h3></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className={`flex flex-col items-center justify-center p-1 border-2 border-dashed rounded-2xl transition-colors relative h-36 overflow-hidden ${formData.image ? 'border-transparent bg-slate-100 dark:bg-black/40' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-black/20'}`}>
              {formData.image ? (
                  <div className="relative w-full h-full group">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                      <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-transform hover:scale-110 z-20" title="Remove Image"><X size={14} /></button>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"><span className="text-white text-xs font-bold">Image Set</span></div>
                  </div>
              ) : (
                  <div className="flex gap-8 items-center justify-center w-full h-full">
                      <label className="flex flex-col items-center gap-2 cursor-pointer group p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-full group-hover:scale-110 transition-transform"><ImageIcon size={24} /></div>
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Upload</span>
                          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                      <div className="w-px h-12 bg-slate-300 dark:bg-slate-700"></div>
                      <button type="button" onClick={() => setIsCameraOpen(true)} className="flex flex-col items-center gap-2 cursor-pointer group p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          <div className="p-3 bg-purple-500/10 text-purple-600 rounded-full group-hover:scale-110 transition-transform"><Camera size={24} /></div>
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Camera</span>
                      </button>
                  </div>
              )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-1"><label className="text-xs font-bold text-slate-500 dark:text-slate-400">Name</label><input required type="text" className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 focus:bg-white/80 dark:focus:bg-black/40 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div><div className="space-y-1"><label className="text-xs font-bold text-slate-500 dark:text-slate-400">Category</label><select className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value })}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 dark:text-slate-400">Price</label><input required type="number" step="0.01" className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 outline-none" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} /></div>
            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 dark:text-slate-400">Cost (COGS)</label><input type="number" step="0.01" className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 outline-none" value={formData.cost || ''} onChange={e => setFormData({...formData, cost: parseFloat(e.target.value)})} placeholder="0.00" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4"><div className="space-y-1"><label className="text-xs font-bold text-slate-500 dark:text-slate-400">Stock</label><input required type="number" className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 outline-none" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} /></div><div className="space-y-1"><label className="text-xs font-bold text-slate-500 dark:text-slate-400">Items per Case</label><div className="relative"><Box className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/><input type="number" min="1" className="w-full pl-9 p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 outline-none" value={formData.itemsPerCase} onChange={e => setFormData({...formData, itemsPerCase: parseInt(e.target.value)})} placeholder="1" /></div></div></div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Barcode</label>
            <div className="relative">
                <input 
                    type="text" 
                    className="w-full pl-3 pr-10 p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 outline-none transition-all" 
                    value={formData.barcode} 
                    onChange={e => setFormData({...formData, barcode: e.target.value})} 
                    placeholder="Scan or type..." 
                />
                <button 
                    type="button" 
                    onClick={() => setIsBarcodeScannerOpen(true)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-primary hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Scan Barcode"
                >
                    <ScanBarcode size={20} />
                </button>
            </div>
          </div>
          <div className="space-y-1"><div className="flex justify-between items-center"><label className="text-xs font-bold text-slate-500 dark:text-slate-400">Description</label><button type="button" onClick={handleGenerateDesc} disabled={isGenerating || !formData.name} className="text-[10px] flex items-center gap-1 text-primary font-bold disabled:opacity-50 hover:underline"><Wand2 size={10}/> AI Auto-Write</button></div><textarea className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 focus:bg-white/80 dark:focus:bg-black/40 outline-none transition-all min-h-[80px] text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Product details..." /></div>
          <div className="flex gap-4 pt-2"><button type="button" onClick={onClose} className="flex-1 py-3 rounded-2xl font-bold text-slate-600 hover:bg-white/40 transition-colors">Cancel</button><button type="submit" className="flex-1 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"><Save size={18}/> {productToEdit ? 'Update' : 'Save'}</button></div>
        </form>
        {isCameraOpen && <CameraCapture onCapture={(img) => { setCropImage(img); setIsCameraOpen(false); }} onCancel={() => setIsCameraOpen(false)} />}
        {isBarcodeScannerOpen && (
            <BarcodeScanner 
                onScan={(code) => {
                    setFormData(prev => ({ ...prev, barcode: code }));
                    setIsBarcodeScannerOpen(false);
                    showToast(`Scanned: ${code}`, 'success');
                }}
                onClose={() => setIsBarcodeScannerOpen(false)}
            />
        )}
        {cropImage && <ImageCropper imageSrc={cropImage} onCrop={handleCropComplete} onCancel={() => setCropImage(null)} />}
      </div>
    </div>
  )
};

const ReturnModal = ({ isOpen, onClose, transaction, onProcessReturn }: { isOpen: boolean, onClose: () => void, transaction: Transaction | null, onProcessReturn: (originalTx: Transaction, itemsToReturn: CartItem[]) => void }) => {
    const [itemsToReturn, setItemsToReturn] = useState<CartItem[]>([]);

    useEffect(() => {
        if (transaction) {
            setItemsToReturn(transaction.items.map(item => ({ ...item, quantity: 0 })));
        }
    }, [transaction]);

    if (!isOpen || !transaction) return null;

    const handleQuantityChange = (itemId: string, delta: number) => {
        setItemsToReturn(prev => prev.map(item => {
            if (item.id === itemId) {
                const originalItem = transaction.items.find(i => i.id === itemId);
                const originalQty = originalItem ? originalItem.quantity : 0;
                const newQty = Math.max(0, Math.min(originalQty, item.quantity + delta));
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const totalReturnAmount = itemsToReturn.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const hasItemsToReturn = itemsToReturn.some(item => item.quantity > 0);

    const handleConfirmReturn = () => {
        const itemsWithQuantities = itemsToReturn.filter(item => item.quantity > 0);
        if (itemsWithQuantities.length > 0) {
            onProcessReturn(transaction, itemsWithQuantities);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg flex items-center justify-center p-4">
            <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-lg border border-white/20 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold">Process Return</h3>
                        <p className="text-xs text-slate-500">Original Order: #{transaction.id.slice(-6)}</p>
                    </div>
                    <button onClick={onClose}><X size={22} /></button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <p className="text-sm text-slate-600 dark:text-slate-300">Select items and quantities to return:</p>
                    <div className="space-y-3">
                        {transaction.items.map(originalItem => {
                            const returnItem = itemsToReturn.find(i => i.id === originalItem.id);
                            const returnQty = returnItem ? returnItem.quantity : 0;
                            return (
                                <div key={originalItem.id} className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 rounded-xl border border-white/20">
                                    <div className="flex items-center gap-3">
                                        <img src={originalItem.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                        <div>
                                            <div className="font-bold text-sm">{originalItem.name}</div>
                                            <div className="text-xs text-slate-500">Sold: {originalItem.quantity}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-black/20 rounded-lg p-1 border border-white/20">
                                        <button onClick={() => handleQuantityChange(originalItem.id, -1)} disabled={returnQty === 0} className="p-1.5 disabled:opacity-30"><Minus size={14}/></button>
                                        <span className="w-6 text-center font-bold text-sm">{returnQty}</span>
                                        <button onClick={() => handleQuantityChange(originalItem.id, 1)} disabled={returnQty >= originalItem.quantity} className="p-1.5 disabled:opacity-30"><Plus size={14}/></button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="p-6 border-t border-white/10 bg-white/10 mt-auto">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-lg">Total Refund:</span>
                        <span className="font-bold text-2xl text-red-500">-${totalReturnAmount.toFixed(2)}</span>
                    </div>
                    <button onClick={handleConfirmReturn} disabled={!hasItemsToReturn} className="w-full py-4 bg-red-600 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <Undo2 size={18} /> Process Refund
                    </button>
                </div>
            </div>
        </div>
    );
};

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('POS');
  
  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [purchases, setPurchases] = useState<PurchaseOrder[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [repairs, setRepairs] = useState<RepairTicket[]>([]);

  // UI States
  const [transactionToPrint, setTransactionToPrint] = useState<Transaction | null>(null);
  const [transactionToReturn, setTransactionToReturn] = useState<Transaction | null>(null);
  const [transactionToView, setTransactionToView] = useState<Transaction | null>(null);
  const [productModalState, setProductModalState] = useState<{isOpen: boolean; product: Partial<Product> | null}>({isOpen: false, product: null});
  const [isCloseShiftModalOpen, setIsCloseShiftModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [shiftReportData, setShiftReportData] = useState<Shift | null>(null);
  
  const { showToast } = useToast();

  useEffect(() => {
    const init = async () => {
        try {
            const storedUser = localStorage.getItem('nexus_user');
            // If user is NOT logged in, we MUST force fetch real settings for the Landing Page.
            // If the browser was previously in Demo mode, localStorage flag might be true,
            // but we don't want the public landing page to show 'Demo Store'.
            const forceProduction = !storedUser;

            // Load settings and products initially (needed for landing page)
            const appSettings = await api.getSettings(forceProduction);
            const productsData = await api.getProducts(forceProduction);
            
            setSettings(appSettings);
            setProducts(productsData);

            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            } else {
                setLoading(false);
            }
        } catch(e) {
            console.error("Failed to load settings or products", e);
            setLoading(false);
        }
    };
    init();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadInitialData();
    }
  }, [currentUser]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Regular load - let the storage service decide based on Demo mode or not
      const [
        productsData, 
        transactionsData, 
        settingsData, 
        purchasesData, 
        activeShiftData,
        categoriesData,
        expensesData,
        usersData,
        customersData,
        expenseCategoriesData,
        repairsData
      ] = await Promise.all([
        api.getProducts(),
        api.getTransactions(),
        api.getSettings(),
        api.getPurchaseOrders(),
        api.getActiveShift(),
        api.getCategories(),
        api.getExpenses(),
        api.getUsers(),
        api.getCustomers(),
        api.getExpenseCategories(),
        api.getRepairs()
      ]);
      setProducts(productsData);
      setTransactions(transactionsData);
      setSettings(settingsData);
      setPurchases(purchasesData);
      setCurrentShift(activeShiftData);
      setCategories(categoriesData);
      setExpenses(expensesData);
      setUsers(usersData);
      setCustomers(customersData);
      setExpenseCategories(expenseCategoriesData);
      setRepairs(repairsData);
    } catch (error) {
      showToast('Failed to load store data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (settings) {
      if (settings.theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, [settings?.theme]);

  useEffect(() => {
    if (transactionToPrint) {
      const timer = setTimeout(() => window.print(), 100);
      return () => clearTimeout(timer);
    }
  }, [transactionToPrint]);

  const handleLogin = (user: User) => {
    localStorage.setItem('nexus_user', JSON.stringify(user));
    localStorage.removeItem('nexus_demo_mode'); // Ensure standard mode
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('nexus_user');
    localStorage.removeItem('nexus_demo_mode'); // Clear demo mode
    setCurrentUser(null);
    setCurrentShift(null); 
    setShiftReportData(null);
    setShowLogin(false);
    
    // Refresh to clear state completely and reload public landing page settings
    window.location.reload(); 
  };

  const handleViewDemo = () => {
    const demoUser: User = {
      id: 'demo_user',
      name: 'Demo Manager',
      role: 'Manager',
      email: 'demo@nexus.com',
      avatar: 'D'
    };
    localStorage.setItem('nexus_demo_mode', 'true');
    localStorage.setItem('nexus_user', JSON.stringify(demoUser));
    setCurrentUser(demoUser);
    showToast('Welcome to Demo Mode', 'success');
  };

  const handleStartShift = async (amount: number) => {
    if (!currentUser) return;
    try {
      const newShift = await api.saveShift({ userId: currentUser.id, userName: currentUser.name, startTime: new Date().toISOString(), startingCash: amount, cashSales: 0, cardSales: 0, digitalSales: 0, status: 'OPEN', cashMovements: [] });
      setCurrentShift(newShift);
      showToast(`Shift started with ${settings?.currency || '$'}${amount.toFixed(2)} float`, 'success');
    } catch (error) {
      showToast('Failed to start shift', 'error');
    }
  };

  const handleConfirmCloseShift = async (countedCash: number) => {
    if (!currentShift) return;
    const totalSales = (currentShift.cashSales || 0) + (currentShift.cardSales || 0) + (currentShift.digitalSales || 0);
    
    const payIn = currentShift.cashMovements?.filter(m => m.type === 'in').reduce((sum, m) => sum + m.amount, 0) || 0;
    const payOut = currentShift.cashMovements?.filter(m => m.type === 'out').reduce((sum, m) => sum + m.amount, 0) || 0;
    
    const expectedCash = (currentShift.startingCash || 0) + (currentShift.cashSales || 0) + payIn - payOut;
    const difference = countedCash - expectedCash;
    const shiftToClose: Partial<Shift> = { id: currentShift.id, endTime: new Date().toISOString(), status: 'CLOSED', totalSales, expectedCash, countedCash, difference };
    try {
      const savedShift = await api.saveShift(shiftToClose);
      setCurrentShift(null);
      setIsCloseShiftModalOpen(false);
      setIsWalletModalOpen(false);
      setShiftReportData(savedShift); // Show report before logout
      showToast('Shift closed successfully.', 'success');
    } catch (error) {
      showToast('Failed to close shift', 'error');
    }
  };

  const handleCashMovement = async (type: 'in' | 'out', amount: number, reason: string) => {
    if (!currentShift || !currentUser) return;
    
    const newMovement: CashMovement = {
        id: Date.now().toString(),
        type,
        amount,
        reason,
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        userName: currentUser.name
    };

    const updatedMovements = [...(currentShift.cashMovements || []), newMovement];
    const updatedShift = { ...currentShift, cashMovements: updatedMovements };
    
    try {
        await api.saveShift(updatedShift);
        setCurrentShift(updatedShift);
        showToast(`Cash ${type === 'in' ? 'added' : 'removed'} successfully`, 'success');
    } catch (error) {
        showToast('Failed to record cash movement', 'error');
    }
  };

  const handleCloseShiftReport = () => {
    setShiftReportData(null);
    handleLogout();
  };
  
  // --- CRUD Handlers ---
  
  // Products
  const handleUpdateProduct = async (product: Product) => {
    try {
      const updatedProduct = await api.updateProduct(product);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    } catch (error) {
      showToast('Failed to update product', 'error');
      throw error;
    }
  };

  const handleAddProduct = async (productData: Partial<Product>): Promise<Product> => {
    try {
      const newProduct = await api.addProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      showToast('Failed to add product', 'error');
      throw error;
    }
  };

  const handleSaveProductFromModal = async (productData: Partial<Product>) => {
    try {
      if (productData.id) {
        await handleUpdateProduct(productData as Product);
        showToast('Product updated successfully', 'success');
      } else {
        await handleAddProduct(productData);
        showToast('Product added successfully', 'success');
      }
      handleCloseProductModal();
    } catch (error) {
      showToast('Failed to save product', 'error');
    }
  };
  const handleDeleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      showToast('Product deleted', 'info');
    } catch (error) {
      showToast('Failed to delete product', 'error');
    }
  };

  const handleImportProducts = async (newProducts: Product[]) => {
    try {
      const updatedProducts = [...products];
      let addedCount = 0;
      let updatedCount = 0;

      for (const p of newProducts) {
        // Match by Barcode or Name
        const existingIndex = updatedProducts.findIndex(ex => 
          (p.barcode && ex.barcode === p.barcode) || 
          (p.name && ex.name.toLowerCase() === p.name.toLowerCase())
        );
        
        if (existingIndex >= 0) {
          // Update existing, keeping ID
          updatedProducts[existingIndex] = { ...updatedProducts[existingIndex], ...p, id: updatedProducts[existingIndex].id };
          updatedCount++;
        } else {
          // Add new
          updatedProducts.push(p);
          addedCount++;
        }
      }
      
      await api.saveProducts(updatedProducts);
      setProducts(updatedProducts);
      showToast(`Import Success: ${addedCount} added, ${updatedCount} updated`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Import failed', 'error');
    }
  };

  // Categories
  const handleUpdateCategories = async (newCategories: string[]) => {
    try {
      const updated = await api.saveCategories(newCategories);
      setCategories(updated);
      showToast('Categories updated', 'success');
    } catch (error) {
      showToast('Failed to update categories', 'error');
    }
  };
  const handleRenameCategory = async (oldName: string, newName: string) => {
    try {
      const updatedCategories = categories.map(c => c === oldName ? newName : c);
      await api.saveCategories(updatedCategories);
      setCategories(updatedCategories);
      const updatedProducts = products.map(p => p.category === oldName ? { ...p, category: newName } : p);
      await api.saveProducts(updatedProducts);
      setProducts(updatedProducts);
      showToast(`Category renamed and products updated.`, 'success');
    } catch (error) {
      showToast('Failed to rename category', 'error');
    }
  };
  
  // Expense Categories
  const handleUpdateExpenseCategories = async (newCategories: string[]) => {
    try {
      const updated = await api.saveExpenseCategories(newCategories);
      setExpenseCategories(updated);
      showToast('Expense categories updated', 'success');
    } catch (error) {
      showToast('Failed to update expense categories', 'error');
    }
  };

  // Users
  const handleAddUser = async (user: Omit<StoredUser, 'id'>) => {
    const savedUser = await api.addUser(user);
    setUsers(prev => [...prev, savedUser]);
  };
  const handleUpdateUser = async (user: StoredUser) => {
    const updatedUser = await api.updateUser(user);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  const handleDeleteUser = async (userId: string) => {
    await api.deleteUser(userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
  };
  
  // Customers
  const handleAddCustomer = async (customer: Omit<Customer, 'id'>) => {
    const savedCustomer = await api.addCustomer(customer);
    setCustomers(prev => [...prev, savedCustomer]);
  };
  const handleUpdateCustomer = async (customer: Customer) => {
    const updatedCustomer = await api.updateCustomer(customer);
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };
  const handleDeleteCustomer = async (customerId: string) => {
    await api.deleteCustomer(customerId);
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  // Repairs
  const handleAddRepair = async (repair: Omit<RepairTicket, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
          const newRepair = await api.addRepair(repair);
          setRepairs([newRepair, ...repairs]);
      } catch (err) {
          showToast('Failed to create repair ticket', 'error');
      }
  };
  const handleUpdateRepair = async (repair: RepairTicket) => {
      try {
          const updatedRepair = await api.updateRepair(repair);
          setRepairs(repairs.map(r => r.id === updatedRepair.id ? updatedRepair : r));
      } catch (err) {
          showToast('Failed to update repair ticket', 'error');
      }
  };
  const handleDeleteRepair = async (id: string) => {
      try {
          await api.deleteRepair(id);
          setRepairs(repairs.filter(r => r.id !== id));
      } catch (err) {
          showToast('Failed to delete repair ticket', 'error');
      }
  };

  // Settings
  const handleUpdateSettings = async (newSettings: StoreSettings) => {
    try {
      const updated = await api.saveSettings(newSettings);
      setSettings(updated);
      showToast('Settings saved successfully', 'success');
    } catch(error) {
      showToast('Failed to save settings', 'error');
    }
  };

  // Expenses
  const handleAddExpense = async (expense: Omit<Expense, 'id'>) => { try { const savedExpense = await api.addExpense(expense); setExpenses([savedExpense, ...expenses]); } catch(error) { showToast('Failed to add expense', 'error'); } };
  const handleDeleteExpense = async (id: string) => { try { await api.deleteExpense(id); setExpenses(expenses.filter(e => e.id !== id)); showToast('Expense deleted', 'info'); } catch(error) { showToast('Failed to delete expense', 'error'); } };

  // Transactions
  const handleTransaction = async (transaction: Transaction) => {
    const newTransaction: Transaction = { ...transaction, id: transaction.id || `trx-${Date.now()}`, shiftId: currentShift?.id };
    try {
      const savedTransaction = await api.saveTransaction(newTransaction);
      setTransactions([savedTransaction, ...transactions]);
      
      const changedProducts: Product[] = [];
      const updatedProducts = products.map(p => { 
          const sold = transaction.items.find(i => i.id === p.id); 
          if (sold) {
              const updated = { ...p, stock: Math.max(0, p.stock - sold.quantity) };
              changedProducts.push(updated);
              return updated;
          }
          return p; 
      });
      setProducts(updatedProducts);
      
      if (changedProducts.length > 0) {
          await api.saveProducts(changedProducts);
      }

      if (currentShift) { const updatedShift = { ...currentShift }; if (transaction.paymentMethod === 'cash') updatedShift.cashSales += transaction.total; else if (transaction.paymentMethod === 'card') updatedShift.cardSales += transaction.total; else if (transaction.paymentMethod === 'digital') updatedShift.digitalSales += transaction.total; setCurrentShift(updatedShift); await api.saveShift(updatedShift); }
      if (transaction.customerId) await api.updateCustomerStats(transaction.customerId, transaction.total);
      showToast(`Sale completed: ${settings?.currency || '$'}${transaction.total.toFixed(2)}`, 'success');
      if (savedTransaction.paymentMethod === 'cash' && settings?.autoOpenDrawer) { handlePrintReceipt(savedTransaction); }
    } catch(error: any) { 
        console.error(error);
        const msg = error?.message || 'Failed to save transaction';
        showToast(msg, 'error'); 
    }
  };

  const handleReturnTransaction = async (originalTx: Transaction, itemsToReturn: CartItem[]) => {
    const totalRefund = itemsToReturn.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxRefund = (totalRefund / (1 + (settings?.taxRate || 0)/100)) * ((settings?.taxRate || 0)/100);
    const returnTransactionData: Omit<Transaction, 'id'> = { date: new Date().toISOString(), items: itemsToReturn.map(i => ({...i, cost: i.cost || 0})), total: totalRefund, tax: taxRefund, paymentMethod: originalTx.paymentMethod, type: 'return', originalTransactionId: originalTx.id, shiftId: currentShift?.id };
    try {
      const savedReturn = await api.saveTransaction(returnTransactionData as Transaction);
      setTransactions([savedReturn, ...transactions]);
      
      const changedProducts: Product[] = [];
      const updatedProducts = products.map(p => { 
          const returnedItem = itemsToReturn.find(i => i.id === p.id); 
          if (returnedItem) {
              const updated = { ...p, stock: p.stock + returnedItem.quantity };
              changedProducts.push(updated);
              return updated;
          }
          return p; 
      });
      setProducts(updatedProducts);
      
      if (changedProducts.length > 0) {
          await api.saveProducts(changedProducts);
      }

      if (currentShift) { const updatedShift = { ...currentShift }; if (returnTransactionData.paymentMethod === 'cash') updatedShift.cashSales -= totalRefund; else if (returnTransactionData.paymentMethod === 'card') updatedShift.cardSales -= totalRefund; else if (returnTransactionData.paymentMethod === 'digital') updatedShift.digitalSales -= totalRefund; setCurrentShift(updatedShift); await api.saveShift(updatedShift); }
      showToast(`Return processed for ${settings?.currency}${totalRefund.toFixed(2)}`, 'success');
      setTransactionToReturn(null);
    } catch(err) { showToast('Failed to process return.', 'error'); }
  };

  const handleCreatePurchaseOrder = async (order: Omit<PurchaseOrder, 'id'>) => { try { const newOrder = await api.savePurchaseOrder(order as PurchaseOrder); setPurchases([newOrder, ...purchases]); } catch(e) { showToast('Failed to save order', 'error')}};
  
  const handleReceiveOrder = async (orderId: string) => {
    const order = purchases.find(o => o.id === orderId);
    if (!order || order.status === 'Received') return;

    try {
      // 1. Update Order Status
      const updatedOrder = { ...order, status: 'Received' as const };
      await api.savePurchaseOrder(updatedOrder);
      
      // 2. Update Inventory (Stock & Weighted Average Cost)
      const updatedProducts = [...products];
      
      for (const item of order.items) {
        const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
          const product = updatedProducts[productIndex];
          
          // Calculate new stock
          const newStock = (product.stock || 0) + item.quantity;
          
          // Calculate new weighted average cost
          const currentTotalValue = (product.stock || 0) * (product.cost || 0);
          const incomingValue = item.quantity * item.unitCost;
          const newCost = newStock > 0 ? (currentTotalValue + incomingValue) / newStock : (product.cost || 0);

          const updatedProduct = { 
            ...product, 
            stock: newStock,
            cost: parseFloat(newCost.toFixed(2))
          };

          // Save product to DB
          await api.updateProduct(updatedProduct);
          
          // Update local products array
          updatedProducts[productIndex] = updatedProduct;
        }
      }

      // 3. Update State
      setPurchases(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
      setProducts(updatedProducts);
      
      showToast(`Order received. Stock updated.`, 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to receive order', 'error');
    }
  };

  const handlePrintReceipt = (transaction: Transaction) => setTransactionToPrint(transaction);
  const handleViewReceipt = (transaction: Transaction) => setTransactionToView(transaction);
  const handleOpenProductModal = (product: Product | null) => setProductModalState({ isOpen: true, product });
  const handleCloseProductModal = () => setProductModalState({ isOpen: false, product: null });
  const handleOpenReturnModal = (transaction: Transaction) => setTransactionToReturn(transaction);
  
  if (loading) return <div className="flex h-screen w-full items-center justify-center bg-slate-100 dark:bg-slate-900"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  if (!currentUser && !showLogin) return <LandingPage onGetStarted={() => setShowLogin(true)} onViewDemo={handleViewDemo} settings={settings} products={products} />;
  if (!currentUser && showLogin) return <LoginView onLogin={handleLogin} onBack={() => setShowLogin(false)} />;
  if (!settings) return <div>Error loading settings. Please refresh.</div>; 
  if (!currentShift && !shiftReportData) return <ShiftEntryModal currentUser={currentUser} onStartShift={handleStartShift} currency={settings.currency} onLogout={handleLogout} />;

  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD': return <DashboardView transactions={transactions} isDarkMode={settings.theme === 'dark'} currentUser={currentUser!} expenses={expenses} />;
      case 'POS': return <PosView products={products} onCompleteTransaction={handleTransaction} onPrint={handlePrintReceipt} settings={settings} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} currentUser={currentUser!} onOpenProductModal={handleOpenProductModal} categories={categories} />;
      case 'REPAIRS': return <RepairsView repairs={repairs} customers={customers} onAddRepair={handleAddRepair} onUpdateRepair={handleUpdateRepair} onDeleteRepair={handleDeleteRepair} settings={settings} currentUser={currentUser!} />;
      case 'INVENTORY': return <InventoryView products={products} onDeleteProduct={handleDeleteProduct} onUpdateProduct={handleUpdateProduct} onImportProducts={handleImportProducts} settings={settings} currentUser={currentUser!} onOpenProductModal={handleOpenProductModal} />;
      case 'PURCHASES': return <PurchaseView orders={purchases} products={products} settings={settings} onCreateOrder={handleCreatePurchaseOrder} onReceiveOrder={handleReceiveOrder} currentUser={currentUser!} />;
      case 'EXPENSES': return <ExpensesView expenses={expenses} categories={expenseCategories} onAddExpense={handleAddExpense} onDeleteExpense={handleDeleteExpense} onUpdateCategories={handleUpdateExpenseCategories} settings={settings} currentUser={currentUser!} />;
      case 'REPORTS': return <ReportsView transactions={transactions} expenses={expenses} settings={settings} currentUser={currentUser!} />;
      case 'TRANSACTIONS': return <TransactionsHistory transactions={transactions} currency={settings.currency} onPrint={handlePrintReceipt} onReturn={handleOpenReturnModal} onView={handleViewReceipt} />;
      case 'SETTINGS': return <SettingsView settings={settings} onSave={handleUpdateSettings} transactions={transactions} currentUser={currentUser!} categories={categories} onUpdateCategories={handleUpdateCategories} onRenameCategory={handleRenameCategory} users={users} customers={customers} onAddUser={handleAddUser} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} onAddCustomer={handleAddCustomer} onUpdateCustomer={handleUpdateCustomer} onDeleteCustomer={handleDeleteCustomer} onNavigate={setCurrentView} />;
      case 'LANDING_BUILDER': return <LandingPageBuilderView settings={settings} onSave={handleUpdateSettings} onBack={() => setCurrentView('SETTINGS')} />;
      default: return <PosView products={products} onCompleteTransaction={handleTransaction} settings={settings} onPrint={handlePrintReceipt} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} currentUser={currentUser!} onOpenProductModal={handleOpenProductModal} categories={categories} />;
    }
  };

  return (
    <>
      {shiftReportData ? (
        <ShiftReport shift={shiftReportData} settings={settings} onClose={handleCloseShiftReport} />
      ) : (
        <>
            <div className="print:hidden h-full text-secondary dark:text-slate-300 transition-colors duration-200">
                <Layout currentView={currentView} onNavigate={setCurrentView} storeName={settings.storeName} onLogout={handleLogout} currentUser={currentUser} onWalletClick={() => setIsWalletModalOpen(true)}>
                {renderView()}
                </Layout>
            </div>
            <Invoice transaction={transactionToPrint} settings={settings} />
            {transactionToView && <Invoice transaction={transactionToView} settings={settings} onClose={() => setTransactionToView(null)} />}
            <ProductModal isOpen={productModalState.isOpen} productToEdit={productModalState.product} onSave={handleSaveProductFromModal} onClose={handleCloseProductModal} categories={categories} />
            <CloseShiftModal isOpen={isCloseShiftModalOpen} onClose={() => setIsCloseShiftModalOpen(false)} onConfirm={handleConfirmCloseShift} shift={currentShift || undefined} currency={settings.currency} />
            {currentShift && (
                <WalletModal 
                    isOpen={isWalletModalOpen} 
                    onClose={() => setIsWalletModalOpen(false)} 
                    shift={currentShift} 
                    onAddMovement={handleCashMovement} 
                    onCloseShift={() => setIsCloseShiftModalOpen(true)}
                    currency={settings.currency}
                />
            )}
            <ReturnModal isOpen={!!transactionToReturn} onClose={() => setTransactionToReturn(null)} transaction={transactionToReturn} onProcessReturn={handleReturnTransaction} />
        </>
      )}
    </>
  );
};

const TransactionsHistory = ({ transactions, currency, onPrint, onReturn, onView }: { transactions: Transaction[], currency: string, onPrint: (t: Transaction) => void, onReturn: (t: Transaction) => void, onView: (t: Transaction) => void }) => (
  <div className="max-w-4xl mx-auto">
     <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 drop-shadow-sm">Transaction History</h2></div>
     <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
        {transactions.length === 0 ? (<div className="p-10 text-center text-slate-500 dark:text-slate-400">No transactions yet</div>) : (<div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">{transactions.map(t => {
          const isReturn = t.type === 'return';
          return (
          <div key={t.id} className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${isReturn ? 'bg-red-500/5' : 'hover:bg-white/30 dark:hover:bg-slate-700/30'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full shadow-sm shrink-0 ${isReturn ? 'bg-red-500/10 text-red-500' : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'}`}>
                {isReturn ? <Undo2 size={20}/> : <FileText size={20} />}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate flex items-center gap-2">
                  Order #{t.id.slice(-6)}
                  {isReturn && <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">RETURN</span>}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{new Date(t.date).toLocaleString()} • {t.paymentMethod.toUpperCase()}</div>
                {t.customerName && <div className="text-xs font-bold text-teal-600 dark:text-teal-400 mt-0.5">{t.customerName}</div>}
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pl-14 sm:pl-0">
              <div className="text-right">
                <div className={`font-bold ${isReturn ? 'text-red-500' : 'text-slate-900 dark:text-slate-100'}`}>
                  {isReturn ? '-' : ''}{currency}{t.total.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t.items.length} items</div>
              </div>
              <div className="flex gap-1">
                {t.type === 'sale' && <button onClick={() => onReturn(t)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-xl transition-colors" title="Process Return"><Undo2 size={20} /></button>}
                <button onClick={() => onView(t)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-colors" title="View Receipt"><Eye size={20} /></button>
                <button onClick={() => onPrint(t)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-white/50 dark:hover:bg-white/10 rounded-xl transition-colors" title="Print Receipt"><Printer size={20} /></button>
              </div>
            </div>
          </div>
        )})}</div>)}
     </div>
  </div>
);
