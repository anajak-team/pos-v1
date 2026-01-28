import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { LoginView } from './views/LoginView';
import { SignUpView } from './views/SignUpView';
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
import { FileText, Printer, Wand2, ScanBarcode, Box, Image as ImageIcon, Upload, X, Check, ZoomIn, ZoomOut, Move, Save, Loader2, Minus, Plus, Undo2, Eye, Camera, CheckCircle2, AlertTriangle, MapPin, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from './components/Toast';
import { generateProductDescription } from './services/geminiService';
import { TRANSLATIONS } from './translations';

// --- Helper Components ---

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
        const Html5Qrcode = (window as any).Html5Qrcode;
        if (!Html5Qrcode) {
            if(isMounted) setError("Scanner component not loaded");
            return;
        }

        const elementId = "product-modal-scanner-reader";
        
        // Clean up previous instance
        if (scannerRef.current) {
            try { await scannerRef.current.stop(); } catch(e) {}
            try { scannerRef.current.clear(); } catch(e) {}
        }

        try {
            const html5QrCode = new Html5Qrcode(elementId);
            scannerRef.current = html5QrCode;
            
            const config = { 
                fps: 20,
                qrbox: (viewWidth: number, viewHeight: number) => {
                    return { width: Math.min(viewWidth * 0.8, 300), height: Math.min(viewHeight * 0.5, 180) };
                },
                aspectRatio: 1.0,
                disableFlip: false,
                videoConstraints: {
                    facingMode: "environment", // Prioritize back camera
                    width: { min: 640, ideal: 1280, max: 1920 },
                    height: { min: 480, ideal: 720, max: 1080 },
                    focusMode: "continuous"
                }
            };
            
            await html5QrCode.start(
                { facingMode: "environment" }, // Exactly 1 key for first argument
                config, 
                (decodedText: string) => {
                    if (scannerRef.current && !scanSuccess && isMounted) {
                        setScanSuccess(true);
                        setTimeout(() => {
                            if(isMounted) onScan(decodedText);
                        }, 500);
                    }
                },
                (errorMessage: string) => {
                    // ignore
                }
            );
        } catch (err: any) {
            console.error("Error starting scanner", err);
            if(isMounted) setError("Camera permission denied or unavailable.");
        }
    }, 200);

    return () => {
        isMounted = false;
        clearTimeout(timer);
        if (scannerRef.current) {
            scannerRef.current.stop().then(() => {
                try { scannerRef.current.clear(); } catch(e){}
            }).catch((err: any) => {
                console.warn("Scanner stop suppressed", err);
                try { scannerRef.current.clear(); } catch(e){}
            });
        }
    };
  }, []); 

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (scannerRef.current) {
        try {
            await scannerRef.current.stop();
        } catch (err) {
            console.warn("Stop error during file upload", err);
        }
    }

    try {
        const result = await scannerRef.current.scanFile(file, true);
        if (result) {
             setScanSuccess(true);
             setTimeout(() => onScan(result), 500);
        }
    } catch (err) {
        console.error(err);
        setError("No barcode found in image");
        setTimeout(() => setError(null), 2000);
        onClose(); 
    } finally {
        e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-fade-in">
        <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors z-50"
        >
            <X size={24} />
        </button>
        
        {error ? (
            <div className="text-white text-center p-6 max-w-sm bg-white/10 rounded-3xl backdrop-blur-md border border-white/10">
                <AlertTriangle size={48} className="mx-auto mb-4 text-amber-500" />
                <p className="mb-6 font-medium text-lg">{error}</p>
                <button onClick={onClose} className="bg-white text-slate-900 px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
                    Close
                </button>
            </div>
        ) : (
            <div className="relative w-full h-full">
                <div id="product-modal-scanner-reader" className="w-full h-full"></div>
                {/* Visual Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="relative w-[300px] h-[180px]">
                        <div className="absolute -top-3 -left-3 w-12 h-12 border-t-[6px] border-l-[6px] border-primary rounded-tl-2xl"></div>
                        <div className="absolute -top-3 -right-3 w-12 h-12 border-t-[6px] border-r-[6px] border-primary rounded-tr-2xl"></div>
                        <div className="absolute -bottom-3 -left-3 w-12 h-12 border-b-[6px] border-l-[6px] border-primary rounded-bl-2xl"></div>
                        <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-[6px] border-r-[6px] border-primary rounded-br-2xl"></div>
                        <div className="absolute top-1/2 left-6 right-6 h-[2px] bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] animate-pulse -translate-y-1/2 z-10 rounded-full"></div>
                    </div>
                </div>
            </div>
        )}
        
        {!error && (
            <div className="absolute bottom-12 left-0 right-0 flex justify-center z-20">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-5 bg-white/20 backdrop-blur-lg rounded-full text-white hover:bg-white/30 transition-all shadow-xl"
                >
                    <ImageIcon size={32} />
                </button>
            </div>
        )}
        
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload} 
        />
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
    else setFormData({ category: categories[0] || 'Other', name: '', price: 0, cost: 0, stock: 0, description: '', barcode: '', itemsPerCase: 1, image: '', zone: '' });
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
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Location</label>
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    className="w-full pl-9 p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 outline-none transition-all"
                    value={formData.zone || ''} 
                    onChange={e => setFormData({...formData, zone: e.target.value})} 
                    placeholder="Zone / Aisle (e.g. Aisle 1, Shelf B)" 
                />
            </div>
          </div>

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

const TransactionsHistory = ({ transactions, currency, onPrint, onReturn, onView, settings }: { transactions: Transaction[], currency: string, onPrint: (t: Transaction) => void, onReturn: (t: Transaction) => void, onView: (t: Transaction) => void, settings: StoreSettings }) => {
    return (
        <div className="max-w-6xl mx-auto space-y-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{TRANSLATIONS.en.TRANSACTION_HISTORY}</h2>
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 dark:border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/30 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold">
                            <tr>
                                <th className="p-4">{TRANSLATIONS.en.TRANSACTION_ID}</th>
                                <th className="p-4">{TRANSLATIONS.en.DATE}</th>
                                <th className="p-4">{TRANSLATIONS.en.CUSTOMER}</th>
                                <th className="p-4">{TRANSLATIONS.en.ITEMS}</th>
                                <th className="p-4">{TRANSLATIONS.en.TOTAL}</th>
                                <th className="p-4 text-right">{TRANSLATIONS.en.ACTIONS}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/20 dark:divide-white/5">
                            {transactions.map(t => (
                                <tr key={t.id} className="hover:bg-white/30 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-mono text-xs">{t.id.slice(-6)}</td>
                                    <td className="p-4">{new Date(t.date).toLocaleString()}</td>
                                    <td className="p-4">{t.customerName || '-'}</td>
                                    <td className="p-4">{t.items.length} items</td>
                                    <td className="p-4 font-bold">{currency}{t.total.toLocaleString()}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => onPrint(t)} className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"><Printer size={16} /></button>
                                            <button onClick={() => onView(t)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg"><Eye size={16} /></button>
                                            {t.type === 'sale' && <button onClick={() => onReturn(t)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Undo2 size={16} /></button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---

export const App = () => {
  // Initialize state from LocalStorage for session persistence
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('pos_session_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [view, setView] = useState<ViewState>(() => {
    return (localStorage.getItem('pos_session_view') as ViewState) || 'DASHBOARD';
  });

  const [customerData, setCustomerData] = useState<Customer | null>(() => {
    try {
      const stored = localStorage.getItem('pos_session_customer_data');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<string[]>([]);
  const [repairs, setRepairs] = useState<RepairTicket[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isCloseShiftModalOpen, setIsCloseShiftModalOpen] = useState(false);
  const [completedShift, setCompletedShift] = useState<Shift | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [viewTransaction, setViewTransaction] = useState<Transaction | null>(null);
  
  const { showToast } = useToast();

  useEffect(() => {
    const init = async () => {
      const loadedSettings = await api.getSettings();
      setSettings(loadedSettings);
      document.documentElement.classList.toggle('dark', loadedSettings.theme === 'dark');
      
      setProducts(await api.getProducts());
      setTransactions(await api.getTransactions());
      setUsers(await api.getUsers());
      setShifts(await api.getShifts());
      setActiveShift(await api.getActiveShift());
      setCustomers(await api.getCustomers());
      setCategories(await api.getCategories());
      setExpenses(await api.getExpenses());
      setExpenseCategories(await api.getExpenseCategories());
      setRepairs(await api.getRepairs());
      setPurchaseOrders(await api.getPurchaseOrders());
    };
    init();
  }, []);

  // -- Session Persistence Effects --
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pos_session_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pos_session_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (view && view !== 'LOGIN') {
      localStorage.setItem('pos_session_view', view);
    }
  }, [view]);

  useEffect(() => {
    if (customerData) {
      localStorage.setItem('pos_session_customer_data', JSON.stringify(customerData));
    } else {
      localStorage.removeItem('pos_session_customer_data');
    }
  }, [customerData]);
  // -- End Session Persistence Effects --

  const handleLogin = async (user: User, rememberMe: boolean) => {
    setCurrentUser(user);
    if (user.role === 'Customer') {
        // Fetch specific customer data linked to this user
        const customerProfile = await api.getCustomerByEmail(user.email);
        if (customerProfile) {
            setCustomerData(customerProfile);
            setView('LANDING_BUILDER'); // Default landing for customer logic interception
            showToast(`Welcome back, ${user.name}`, 'success');
        } else {
            showToast('Customer profile not found', 'error');
            setCurrentUser(null);
        }
    } else {
        setView('DASHBOARD');
        showToast(`Welcome back, ${user.name}`, 'success');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCustomerData(null);
    
    // Clear session storage but keep settings/other data
    localStorage.removeItem('pos_session_user');
    localStorage.removeItem('pos_session_view');
    localStorage.removeItem('pos_session_customer_data');
    
    // If we were in demo mode, clear it and reload to reset state/connections
    if (localStorage.getItem('nexus_demo_mode')) {
        localStorage.removeItem('nexus_demo_mode');
        window.location.reload();
        return;
    }
    
    setView('DASHBOARD'); // Navigates to Landing Page because user is null
  };

  const handleViewDemo = async () => {
      localStorage.setItem('nexus_demo_mode', 'true');
      
      // Refresh all data to use demo/local storage
      const loadedSettings = await api.getSettings();
      setSettings(loadedSettings);
      
      setProducts(await api.getProducts());
      setTransactions(await api.getTransactions());
      setUsers(await api.getUsers());
      setShifts(await api.getShifts());
      setActiveShift(await api.getActiveShift());
      setCustomers(await api.getCustomers());
      setCategories(await api.getCategories());
      setExpenses(await api.getExpenses());
      setExpenseCategories(await api.getExpenseCategories());
      setRepairs(await api.getRepairs());
      setPurchaseOrders(await api.getPurchaseOrders());

      const demoUser: User = {
          id: 'demo-manager',
          name: 'Demo Manager',
          email: 'demo@anajak.com',
          role: 'Manager',
          avatar: 'D'
      };
      setCurrentUser(demoUser);
      setView('DASHBOARD');
      showToast('Entered Demo Mode - Data is local only', 'success');
  };

  const handleStartShift = async (amount: number) => {
    if (!currentUser) return;
    try {
        const newShift = await api.saveShift({
            userId: currentUser.id,
            userName: currentUser.name,
            startTime: new Date().toISOString(),
            startingCash: amount,
            cashSales: 0,
            cardSales: 0,
            digitalSales: 0,
            status: 'OPEN',
            cashMovements: []
        });
        setActiveShift(newShift);
        setShifts([newShift, ...shifts]);
        showToast('Shift started successfully', 'success');
    } catch (e) {
        showToast('Failed to start shift', 'error');
    }
  };

  const handleCloseShift = async (countedCash: number) => {
      if (!activeShift) return;
      const closedShift = await api.saveShift({
          ...activeShift,
          endTime: new Date().toISOString(),
          status: 'CLOSED',
          countedCash,
          difference: countedCash - ((activeShift.expectedCash || 0)) // Note: calculation should be more robust in real app
      });
      setActiveShift(null);
      setShifts(shifts.map(s => s.id === closedShift.id ? closedShift : s));
      setCompletedShift(closedShift);
      setIsCloseShiftModalOpen(false);
  };

  const handleAddProduct = async (product: Partial<Product>) => {
      const newProduct = await api.addProduct(product);
      setProducts([...products, newProduct]);
      showToast('Product added successfully', 'success');
      return newProduct;
  };

  const handleUpdateProduct = async (product: Product) => {
      const updated = await api.updateProduct(product);
      setProducts(products.map(p => p.id === updated.id ? updated : p));
      showToast('Product updated', 'success');
  };

  const handleDeleteProduct = async (id: string) => {
      await api.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
  };

  const handleTransaction = async (t: Transaction) => {
      const saved = await api.saveTransaction(t);
      setTransactions([saved, ...transactions]);
      
      // Update Stock
      const updates = t.items.map(async item => {
          const product = products.find(p => p.id === item.id);
          if (product) {
              const updated = await api.updateProduct({ ...product, stock: product.stock - item.quantity });
              return updated;
          }
      });
      
      const updatedProducts = (await Promise.all(updates)).filter(Boolean) as Product[];
      setProducts(prev => prev.map(p => updatedProducts.find(up => up.id === p.id) || p));

      // Update Shift
      if (activeShift) {
          const shiftUpdate: Partial<Shift> = {
              id: activeShift.id,
              cashSales: activeShift.cashSales + (t.paymentMethod === 'cash' ? t.total : 0),
              cardSales: activeShift.cardSales + (t.paymentMethod === 'card' ? t.total : 0),
              digitalSales: activeShift.digitalSales + (t.paymentMethod === 'digital' ? t.total : 0),
          };
          const updatedShift = await api.saveShift(shiftUpdate);
          setActiveShift(updatedShift);
      }

      // Update Customer
      if (t.customerId) {
          await api.updateCustomerStats(t.customerId, t.total);
          const updatedCustomers = await api.getCustomers();
          setCustomers(updatedCustomers);
      }
  };

  const handleAddExpense = async (expense: Omit<Expense, 'id'>) => {
      const newExpense = await api.addExpense(expense);
      setExpenses([...expenses, newExpense]);
  };

  const handleDeleteExpense = async (id: string) => {
      await api.deleteExpense(id);
      setExpenses(expenses.filter(e => e.id !== id));
  };

  // Toggle Theme Logic (Reused for Customer View)
  const toggleTheme = () => {
    if (!settings) return;
    const newTheme: 'light' | 'dark' = settings.theme === 'light' ? 'dark' : 'light';
    const newSettings: StoreSettings = { ...settings, theme: newTheme };
    api.saveSettings(newSettings).then(() => {
        setSettings(newSettings);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    });
  };

  const toggleLanguage = () => {
    if (!settings) return;
    const langs = ['en', 'km', 'zh'];
    const currentIdx = langs.indexOf(settings.language || 'en');
    const nextLang = langs[(currentIdx + 1) % langs.length];
    const newSettings = { ...settings, language: nextLang as any };
    api.saveSettings(newSettings).then(() => setSettings(newSettings));
  }

  if (!settings) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  if (!currentUser) {
      if (view === 'LOGIN') {
          return <LoginView onLogin={handleLogin} onBack={() => setView('DASHBOARD')} onSignUpClick={() => setView('SIGNUP')} settings={settings} />;
      }
      if (view === 'SIGNUP') {
          return <SignUpView onSignUpSuccess={() => { setView('LOGIN'); showToast('Account created! Please sign in.', 'success'); }} onBack={() => setView('LOGIN')} settings={settings} />;
      }
      if (view === 'LANDING_BUILDER') {
          return <LandingPageBuilderView settings={settings} onSave={(s) => { api.saveSettings(s).then(setSettings); }} onBack={() => setView('DASHBOARD')} />;
      }
      return <LandingPage onGetStarted={() => setView('LOGIN')} onViewDemo={handleViewDemo} settings={settings} products={products} />;
  }

  // --- Customer View Logic ---
  // If user is a customer, always show the Landing Page with their data
  if (currentUser.role === 'Customer' && customerData) {
      return (
          <LandingPage
            onGetStarted={() => {}} // No-op
            onViewDemo={() => {}}
            settings={settings}
            products={products}
            currentUser={currentUser}
            customerData={customerData}
            transactions={transactions}
            repairs={repairs}
            onLogout={handleLogout}
          />
      );
  }

  // Active Shift Check for Staff/Admins
  if (!activeShift && currentUser && currentUser.role !== 'Customer' && view !== 'LANDING_BUILDER' && view !== 'SETTINGS') {
      return <ShiftEntryModal currentUser={currentUser} onStartShift={handleStartShift} settings={settings} onLogout={handleLogout} />;
  }

  const renderView = () => {
      switch (view) {
          case 'DASHBOARD': return <DashboardView transactions={transactions} isDarkMode={settings.theme === 'dark'} currentUser={currentUser} expenses={expenses} products={products} settings={settings} />;
          case 'POS': return <PosView products={products} transactions={transactions} onCompleteTransaction={handleTransaction} onPrint={(t) => setViewTransaction(t)} settings={settings} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} currentUser={currentUser} onOpenProductModal={(p) => { setProductToEdit(p); setProductModalOpen(true); }} categories={categories} customers={customers} onAddCustomer={async (c) => await api.addCustomer(c)} />;
          case 'INVENTORY': return <InventoryView products={products} onDeleteProduct={handleDeleteProduct} onUpdateProduct={handleUpdateProduct} onImportProducts={async (newProds) => { await api.saveProducts(newProds); setProducts(await api.getProducts()); }} settings={settings} currentUser={currentUser} onOpenProductModal={(p) => { setProductToEdit(p); setProductModalOpen(true); }} />;
          case 'TRANSACTIONS': return <TransactionsHistory transactions={transactions} currency={settings.currency} onPrint={(t) => setViewTransaction(t)} onReturn={() => {}} onView={(t) => setViewTransaction(t)} settings={settings} />;
          case 'SETTINGS': return <SettingsView settings={settings} onSave={async (s) => { await api.saveSettings(s); setSettings(s); document.documentElement.classList.toggle('dark', s.theme === 'dark'); showToast('Settings saved', 'success'); }} transactions={transactions} currentUser={currentUser} categories={categories} onUpdateCategories={async (c) => { await api.saveCategories(c); setCategories(c); }} onRenameCategory={()=>{}} users={users} onAddUser={async (u) => { const n = await api.addUser(u); setUsers([...users, n]); }} onUpdateUser={async (u) => { await api.updateUser(u); setUsers(users.map(us => us.id === u.id ? u : us)); }} onDeleteUser={async (id) => { await api.deleteUser(id); setUsers(users.filter(u => u.id !== id)); }} customers={customers} onAddCustomer={async (c) => { const n = await api.addCustomer(c); setCustomers([...customers, n]); }} onUpdateCustomer={async (c) => { await api.updateCustomer(c); setCustomers(customers.map(cu => cu.id === c.id ? c : cu)); }} onDeleteCustomer={async (id) => { await api.deleteCustomer(id); setCustomers(customers.filter(c => c.id !== id)); }} onNavigate={setView} />;
          case 'PURCHASES': return <PurchaseView orders={purchaseOrders} products={products} settings={settings} onCreateOrder={async (o) => { const n = await api.savePurchaseOrder(o); setPurchaseOrders([n, ...purchaseOrders]); }} onReceiveOrder={async (id) => { const o = purchaseOrders.find(po => po.id === id); if(o) { const u = await api.savePurchaseOrder({...o, status: 'Received'}); setPurchaseOrders(purchaseOrders.map(p => p.id === id ? u : p)); o.items.forEach(async i => { const p = products.find(prod => prod.id === i.productId); if(p) { const updated = await api.updateProduct({...p, stock: p.stock + i.quantity}); setProducts(prev => prev.map(pr => pr.id === updated.id ? updated : pr)); } }); showToast('Order received, inventory updated', 'success'); } }} currentUser={currentUser} />;
          case 'EXPENSES': return <ExpensesView expenses={expenses} categories={expenseCategories} onAddExpense={handleAddExpense} onDeleteExpense={handleDeleteExpense} onUpdateCategories={async (c) => { await api.saveExpenseCategories(c); setExpenseCategories(c); }} settings={settings} currentUser={currentUser} />;
          case 'REPORTS': return <ReportsView transactions={transactions} expenses={expenses} settings={settings} currentUser={currentUser} />;
          case 'REPAIRS': return <RepairsView repairs={repairs} customers={customers} onAddRepair={async (r) => { const n = await api.addRepair(r); setRepairs([n, ...repairs]); }} onUpdateRepair={async (r) => { const u = await api.updateRepair(r); setRepairs(repairs.map(rep => rep.id === r.id ? u : rep)); }} onDeleteRepair={async (id) => { await api.deleteRepair(id); setRepairs(repairs.filter(r => r.id !== id)); }} settings={settings} currentUser={currentUser} />;
          case 'LANDING_BUILDER': return <LandingPageBuilderView settings={settings} onSave={async (s) => { await api.saveSettings(s); setSettings(s); showToast('Landing page updated', 'success'); }} onBack={() => setView('SETTINGS')} />;
          default: return <DashboardView transactions={transactions} isDarkMode={settings.theme === 'dark'} currentUser={currentUser} expenses={expenses} products={products} settings={settings} />;
      }
  };

  return (
    <Layout 
        currentView={view} 
        onNavigate={setView} 
        storeName={settings.storeName} 
        onLogout={handleLogout} 
        currentUser={currentUser} 
        onWalletClick={() => setIsWalletModalOpen(true)}
        isDarkMode={settings.theme === 'dark'}
        onToggleTheme={toggleTheme}
        currentLanguage={settings.language || 'en'}
        onToggleLanguage={toggleLanguage}
    >
        {renderView()}
        {activeShift && (
            <WalletModal 
                isOpen={isWalletModalOpen} 
                onClose={() => setIsWalletModalOpen(false)} 
                shift={activeShift} 
                onAddMovement={async (type, amount, reason) => {
                    const movement: CashMovement = {
                        id: Date.now().toString(),
                        type,
                        amount,
                        reason,
                        timestamp: new Date().toISOString(),
                        userId: currentUser.id,
                        userName: currentUser.name
                    };
                    const updatedShift = await api.saveShift({ ...activeShift, cashMovements: [...(activeShift.cashMovements || []), movement] });
                    setActiveShift(updatedShift);
                    setShifts(shifts.map(s => s.id === updatedShift.id ? updatedShift : s));
                    showToast('Cash movement recorded', 'success');
                }}
                onCloseShift={() => setIsCloseShiftModalOpen(true)}
                settings={settings}
            />
        )}
        <CloseShiftModal 
            isOpen={isCloseShiftModalOpen} 
            onClose={() => setIsCloseShiftModalOpen(false)} 
            onConfirm={handleCloseShift} 
            shift={activeShift || undefined} 
            settings={settings} 
        />
        {completedShift && (
            <ShiftReport 
                shift={completedShift} 
                settings={settings} 
                onClose={() => { setCompletedShift(null); handleLogout(); }} 
            />
        )}
        <ProductModal 
            isOpen={productModalOpen} 
            onClose={() => setProductModalOpen(false)} 
            onSave={async (p) => { 
                if (productToEdit) { 
                    await handleUpdateProduct({ ...productToEdit, ...p } as Product); 
                } else { 
                    await handleAddProduct(p); 
                } 
                setProductModalOpen(false); 
            }} 
            productToEdit={productToEdit} 
            categories={categories} 
        />
        {viewTransaction && settings && (
            <Invoice 
                transaction={viewTransaction} 
                settings={settings} 
                onClose={() => setViewTransaction(null)} 
            />
        )}
    </Layout>
  );
};

export default App;