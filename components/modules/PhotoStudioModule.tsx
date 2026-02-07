
import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Download, Crop, Wand2, Eraser, Undo, Redo, 
  Image as ImageIcon, Sun, Contrast, 
  Droplet, RotateCw, Check, X, Wrench, Trash2, ZoomIn, Move, Maximize2
} from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

export const PhotoStudioModule: React.FC<Props> = ({ isBangla }) => {
  const [image, setImage] = useState<string | null>(null);
  
  // History for Undo/Redo
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Filters & Transforms
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  
  // Modes
  const [isCropping, setIsCropping] = useState(false);
  const [cropSize, setCropSize] = useState({ w: 300, h: 400 });
  const [targetRatio, setTargetRatio] = useState<number | null>(null); // null = free
  
  const [borderEnabled, setBorderEnabled] = useState(false);
  const [borderColor, setBorderColor] = useState('#ffffff');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Constants
  const PASSPORT_W = 413;
  const PASSPORT_H = 531;
  const STAMP_W = 236;
  const STAMP_H = 295;

  const COLORS = [
    '#ffffff', '#f8fafc', '#dbeafe', // Whites/Blues
    '#3b82f6', '#0ea5e9', '#eab308', // Blue/Yellow
    '#ef4444', '#22c55e', '#a855f7'  // Red/Green/Purple
  ];

  const addToHistory = (newImage: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newImage);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImage(result);
        setHistory([result]);
        setHistoryIndex(0);
        
        // Reset adjustments
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setRotation(0);
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setIsCropping(false);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = ''; 
  };

  const handleDelete = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (!confirm(isBangla ? 'আপনি কি ছবিটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this image?')) return;
    
    setImage(null);
    setHistory([]);
    setHistoryIndex(-1);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setRotation(0);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsCropping(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setImage(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setImage(history[newIndex]);
    }
  };

  const handleAutoEnhance = (type: 'real' | 'ai') => {
    if (!image) return;
    if (type === 'real') {
      setContrast(110);
      setBrightness(105);
      setSaturation(105);
    } else {
      setContrast(120);
      setBrightness(110);
      setSaturation(130);
    }
  };

  // --- Interaction Logic ---

  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isResizingCrop, setIsResizingCrop] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, type: 'image' | 'crop', handle?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (type === 'crop' && handle) {
      setIsResizingCrop(true);
      setResizeHandle(handle);
    } else {
      setIsDraggingImage(true);
    }
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingImage && !isResizingCrop) return;
    
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    setLastMousePos({ x: e.clientX, y: e.clientY });

    if (isDraggingImage) {
      // Pan image
      setPan(p => ({ x: p.x + dx, y: p.y + dy }));
    } else if (isResizingCrop && resizeHandle) {
      // Resize crop box
      setCropSize(prev => {
        let newW = prev.w;
        let newH = prev.h;

        // Resize Logic
        if (resizeHandle.includes('e')) newW += dx * 2; // Symmetric
        if (resizeHandle.includes('w')) newW -= dx * 2;
        if (resizeHandle.includes('s')) newH += dy * 2;
        if (resizeHandle.includes('n')) newH -= dy * 2;

        // Enforce aspect ratio if set
        if (targetRatio) {
           if (resizeHandle === 'e' || resizeHandle === 'w') newH = newW / targetRatio;
           else if (resizeHandle === 'n' || resizeHandle === 's') newW = newH * targetRatio;
           else {
             // Corner drag
             if (Math.abs(dx) > Math.abs(dy)) newH = newW / targetRatio;
             else newW = newH * targetRatio;
           }
        }

        return { w: Math.max(50, newW), h: Math.max(50, newH) };
      });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingImage(false);
    setIsResizingCrop(false);
    setResizeHandle(null);
  };

  const applyFiltersStyle = () => ({
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
    transform: `rotate(${rotation}deg) scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
    cursor: isDraggingImage ? 'grabbing' : 'grab',
    transition: isDraggingImage ? 'none' : 'transform 0.1s ease-out'
  });

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setRotation(0);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setBorderEnabled(false);
    setIsCropping(false);
  };

  // Generate Final Output (Returns Data URL or Downloads)
  const generateOutput = async (downloadWidth?: number, downloadHeight?: number, returnData = false) => {
    if (!image) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = image;
    img.crossOrigin = "anonymous";
    await new Promise(r => img.onload = r);

    // If cropping, we render what's inside the crop box
    if (isCropping) {
        const outW = downloadWidth || cropSize.w;
        const outH = downloadHeight || cropSize.h;
        canvas.width = outW;
        canvas.height = outH;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, outW, outH);

        const scaleX = outW / cropSize.w;
        const scaleY = outH / cropSize.h;

        ctx.save();
        ctx.translate(outW / 2, outH / 2);
        ctx.scale(scaleX, scaleY);
        
        // Apply Transforms
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);
        ctx.translate(pan.x / zoom, pan.y / zoom);

        // Apply filters
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
    } else {
        // Full Image Export (respecting rotation/filters)
        const rad = (rotation * Math.PI) / 180;
        const newWidth = Math.abs(img.width * Math.cos(rad)) + Math.abs(img.height * Math.sin(rad));
        const newHeight = Math.abs(img.width * Math.sin(rad)) + Math.abs(img.height * Math.cos(rad));
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rad);
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
    }

    // Border
    if (borderEnabled) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = Math.max(canvas.width, canvas.height) * 0.015;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

    if (returnData) return dataUrl;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `photo_studio_${Date.now()}.jpg`;
    link.click();
  };

  const handlePassportClick = () => {
    if (!image) return;
    if (!isCropping || targetRatio !== PASSPORT_W/PASSPORT_H) {
      setIsCropping(true);
      setTargetRatio(PASSPORT_W/PASSPORT_H);
      setCropSize({ w: 206, h: 265 }); // Scaled down visual size
      setPan({ x: 0, y: 0 }); // Center image
      setZoom(1);
    } else {
      generateOutput(PASSPORT_W, PASSPORT_H);
    }
  };

  const handleStampClick = () => {
    if (!image) return;
    if (!isCropping || targetRatio !== STAMP_W/STAMP_H) {
      setIsCropping(true);
      setTargetRatio(STAMP_W/STAMP_H);
      setCropSize({ w: 236, h: 295 }); // Visual size
      setPan({ x: 0, y: 0 });
      setZoom(1);
    } else {
      generateOutput(STAMP_W, STAMP_H);
    }
  };

  return (
    <div className="min-h-screen lg:h-[85vh] lg:min-h-[600px] bg-[#0f172a] text-white p-4 font-sans animate-fade-in flex flex-col"
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
         onMouseLeave={handleMouseUp}
    >
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
        
        {/* Left Toolbar */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1">
           <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setIsCropping(!isCropping); setTargetRatio(null); }} 
                disabled={!image} 
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-colors text-sm font-bold disabled:opacity-50 ${isCropping && !targetRatio ? 'bg-green-600 border-green-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'}`}
              >
                 <Crop size={18} /> {isBangla ? 'ফ্রি ক্রপ' : 'Free Crop'}
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => handleAutoEnhance('real')} className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-colors text-xs font-medium text-slate-300">
                    <Wrench size={16} className="text-purple-400" /> En-Real
                 </button>
                 <button onClick={() => handleAutoEnhance('ai')} className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-colors text-xs font-medium text-slate-300">
                    <Wand2 size={16} className="text-pink-400" /> Enhan-AI
                 </button>
                 <button onClick={() => alert("Background removal requires server-side processing.")} className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-colors text-xs font-medium text-slate-300">
                    <X size={16} className="text-red-400" /> BG-Remove
                 </button>
                 <button className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-colors text-xs font-medium text-slate-300">
                    <ImageIcon size={16} className="text-blue-400" /> BG-AI
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                 <button className="flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"><Eraser size={14}/> Erase</button>
                 <button className="flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"><Check size={14}/> Restore</button>
                 <button onClick={handleUndo} disabled={historyIndex <= 0} className="flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 disabled:opacity-50"><Undo size={14}/> Undo</button>
                 <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 disabled:opacity-50"><Redo size={14}/> Redo</button>
              </div>
           </div>

           <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{isBangla ? 'ফিল্টার' : 'Filters'}</h3>
              <div className="space-y-1">
                 <div className="flex justify-between text-xs text-slate-300 mb-1"><span className="flex items-center gap-1"><Sun size={12}/> Brightness</span><span>{brightness}%</span></div>
                 <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
              </div>
              <div className="space-y-1">
                 <div className="flex justify-between text-xs text-slate-300 mb-1"><span className="flex items-center gap-1"><Contrast size={12}/> Contrast</span><span>{contrast}%</span></div>
                 <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
              </div>
              <div className="space-y-1">
                 <div className="flex justify-between text-xs text-slate-300 mb-1"><span className="flex items-center gap-1"><Droplet size={12}/> Saturation</span><span>{saturation}%</span></div>
                 <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-pink-500" />
              </div>
           </div>

           <div className="mt-auto">
              <button onClick={resetFilters} className="w-full py-2.5 rounded-xl border border-slate-600 text-slate-400 text-sm font-bold hover:bg-slate-700 transition-colors">Reset</button>
           </div>
        </div>

        {/* Center Workspace */}
        <div className="lg:col-span-8 flex flex-col gap-4 h-full">
           <div className="flex-1 bg-slate-900 rounded-3xl border-2 border-slate-700 flex flex-col relative overflow-hidden" ref={containerRef}>
              <div 
                className={`flex-1 flex items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5 relative overflow-hidden`}
                onMouseDown={(e) => handleMouseDown(e, 'image')}
              >
                 {image ? (
                   <>
                     <img 
                        ref={imageRef}
                        src={image} 
                        className="max-h-none max-w-none object-contain select-none" 
                        style={applyFiltersStyle()} 
                        draggable={false}
                      />
                      
                      {/* Crop Overlay */}
                      {isCropping && (
                        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                           {/* The Crop Box with huge shadow for overlay effect */}
                           <div 
                              className="relative pointer-events-none border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
                              style={{ width: cropSize.w, height: cropSize.h }}
                           >
                              {/* Resize Handles (Pointer Events Auto to catch clicks) */}
                              <div className="absolute -top-3 -left-3 w-6 h-6 bg-transparent cursor-nw-resize pointer-events-auto" onMouseDown={(e) => handleMouseDown(e, 'crop', 'nw')} />
                              <div className="absolute -top-3 -right-3 w-6 h-6 bg-transparent cursor-ne-resize pointer-events-auto" onMouseDown={(e) => handleMouseDown(e, 'crop', 'ne')} />
                              <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-transparent cursor-sw-resize pointer-events-auto" onMouseDown={(e) => handleMouseDown(e, 'crop', 'sw')} />
                              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-transparent cursor-se-resize pointer-events-auto" onMouseDown={(e) => handleMouseDown(e, 'crop', 'se')} />
                              
                              {/* Visible Handles */}
                              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-slate-500" />
                              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-slate-500" />
                              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-slate-500" />
                              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-slate-500" />

                              {/* Edge Handles */}
                              <div className="absolute top-1/2 -left-1.5 w-3 h-6 -translate-y-1/2 bg-white border border-slate-500 cursor-w-resize pointer-events-auto" onMouseDown={(e) => handleMouseDown(e, 'crop', 'w')} />
                              <div className="absolute top-1/2 -right-1.5 w-3 h-6 -translate-y-1/2 bg-white border border-slate-500 cursor-e-resize pointer-events-auto" onMouseDown={(e) => handleMouseDown(e, 'crop', 'e')} />
                              <div className="absolute -top-1.5 left-1/2 h-3 w-6 -translate-x-1/2 bg-white border border-slate-500 cursor-n-resize pointer-events-auto" onMouseDown={(e) => handleMouseDown(e, 'crop', 'n')} />
                              <div className="absolute -bottom-1.5 left-1/2 h-3 w-6 -translate-x-1/2 bg-white border border-slate-500 cursor-s-resize pointer-events-auto" onMouseDown={(e) => handleMouseDown(e, 'crop', 's')} />

                              {/* Grid Lines */}
                              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                                 <div className="border-r border-white/50"></div><div className="border-r border-white/50"></div><div></div>
                                 <div className="border-r border-white/50 border-t border-white/50"></div><div className="border-r border-white/50 border-t border-white/50"></div><div className="border-t border-white/50"></div>
                                 <div className="border-r border-white/50 border-t border-white/50"></div><div className="border-r border-white/50 border-t border-white/50"></div><div className="border-t border-white/50"></div>
                              </div>
                           </div>
                        </div>
                      )}
                   </>
                 ) : (
                   <div className="text-center">
                      <div onClick={() => fileInputRef.current?.click()} className="w-48 h-48 rounded-3xl bg-slate-800/50 border-2 border-dashed border-slate-500 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700 transition-all group mb-4 mx-auto">
                         <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform"><Upload size={28} /></div>
                         <span className="font-bold text-slate-300 group-hover:text-white transition-colors">{isBangla ? 'ছবি আপলোড করুন' : 'Upload Image'}</span>
                      </div>
                      <p className="text-slate-500 text-sm">Or drop image here</p>
                   </div>
                 )}
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              </div>

              <div className="bg-slate-900/90 backdrop-blur p-4 border-t border-slate-700 flex items-center gap-6 z-20">
                 <ZoomIn size={20} className="text-slate-400" />
                 <input type="range" min="0.1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-green-500" />
                 <div className="w-px h-6 bg-slate-700 mx-2"></div>
                 <RotateCw size={20} className="text-slate-400" />
                 <input type="range" min="-180" max="180" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="flex-1 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-white" />
              </div>
           </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto custom-scrollbar pl-1">
           <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isBangla ? 'ইমেজ ট্রে' : 'Image Tray'}</h3>
                 {image && (
                   <button onClick={(e) => handleDelete(e)} className="text-red-500 hover:text-red-400 transition-colors p-1" title="Delete Image">
                     <Trash2 size={16} />
                   </button>
                 )}
              </div>
              <div className="aspect-square rounded-xl bg-slate-900 border-2 border-slate-600 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition-colors relative group">
                 {image ? (
                   <>
                     <img src={image} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                        <button onClick={(e) => handleDelete(e)} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"><Trash2 size={20}/></button>
                     </div>
                   </>
                 ) : (
                   <div className="p-3 bg-slate-800 rounded-lg" onClick={() => fileInputRef.current?.click()}><Upload size={20} className="text-slate-500"/></div>
                 )}
              </div>
           </div>

           <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{isBangla ? 'কালার ও বর্ডার' : 'Colors & Border'}</h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                 {COLORS.map((c, i) => (
                   <button key={i} onClick={() => setBorderColor(c)} className={`w-8 h-8 rounded-full border-2 transition-all ${borderColor === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`} style={{ backgroundColor: c }} />
                 ))}
              </div>
              <label className="flex items-center gap-3 cursor-pointer group">
                 <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${borderEnabled ? 'bg-blue-600 border-blue-600' : 'border-slate-500 bg-transparent group-hover:border-slate-400'}`}>
                    {borderEnabled && <Check size={14} />}
                 </div>
                 <input type="checkbox" className="hidden" checked={borderEnabled} onChange={() => setBorderEnabled(!borderEnabled)} />
                 <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">2px Border</span>
              </label>
           </div>

           <div className="mt-auto space-y-3">
              <div className="grid grid-cols-2 gap-2">
                 <Button onClick={handlePassportClick} className={`w-full py-3 rounded-xl font-bold shadow-lg flex flex-col items-center justify-center gap-1 h-auto text-xs ${targetRatio === PASSPORT_W/PASSPORT_H ? 'bg-green-600 text-white animate-pulse' : 'bg-[#16a34a] text-white hover:bg-[#15803d]'}`}>
                    <Download size={16} /> 
                    {targetRatio === PASSPORT_W/PASSPORT_H ? (isBangla ? 'ডাউনলোড' : 'Download') : (isBangla ? 'পাসপোর্ট সাইজ' : 'Passport Size')}
                 </Button>
                 <Button onClick={handleStampClick} className={`w-full py-3 rounded-xl font-bold shadow-lg flex flex-col items-center justify-center gap-1 h-auto text-xs ${targetRatio === STAMP_W/STAMP_H ? 'bg-emerald-600 text-white animate-pulse' : 'bg-[#059669] text-white hover:bg-[#047857]'}`}>
                    <Download size={16} /> 
                    {targetRatio === STAMP_W/STAMP_H ? (isBangla ? 'ডাউনলোড' : 'Download') : (isBangla ? 'স্ট্যাম্প সাইজ' : 'Stamp Size')}
                 </Button>
              </div>
              <Button onClick={() => generateOutput()} className="w-full py-3 rounded-xl font-bold shadow-lg bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center justify-center gap-2">
                 <Download size={16} /> {isBangla ? 'ডাউনলোড' : 'Download Image'}
              </Button>
           </div>
        </div>

      </div>
    </div>
  );
};
