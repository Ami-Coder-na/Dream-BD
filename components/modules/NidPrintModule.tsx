
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Printer, Download, Image as ImageIcon, RefreshCw, Layers, Sun, Contrast, Droplet, CreditCard } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

export const NidPrintModule: React.FC<Props> = ({ isBangla }) => {
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  
  // Image Adjustments
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (activeTab === 'front') {
          setFrontImage(event.target?.result as string);
        } else {
          setBackImage(event.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    e.target.value = '';
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleResetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  const getFilterStyle = () => {
    return {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
    };
  };

  const drawCanvas = async (callback?: (dataUrl: string) => void) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // A4 size at 96 DPI is approx 794x1123 pixels.
    // NID card standard size approx 3.375 x 2.125 inches.
    // Let's create a canvas large enough for high quality print, maybe 2x scale.
    // Standard print ready layout: Front top, Back bottom.
    
    // Canvas setup for a printable card layout
    canvas.width = 1200; 
    canvas.height = 1800; // Aspect ratio suitable for page print or simple vertical stack

    // Fill background white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    };

    try {
      // Draw Front
      if (frontImage) {
        const imgFront = await loadImage(frontImage);
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        // Draw centered top
        // Card dimensions approx ratio 1.58
        const cardW = 1000;
        const cardH = cardW / 1.58; 
        const x = (canvas.width - cardW) / 2;
        const y1 = 100;
        ctx.drawImage(imgFront, x, y1, cardW, cardH);
      }

      // Draw Back
      if (backImage) {
        const imgBack = await loadImage(backImage);
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        const cardW = 1000;
        const cardH = cardW / 1.58;
        const x = (canvas.width - cardW) / 2;
        const y2 = 100 + cardH + 100; // Gap
        ctx.drawImage(imgBack, x, y2, cardW, cardH);
      }

      if (callback) {
        callback(canvas.toDataURL('image/jpeg', 1.0));
      }

    } catch (err) {
      console.error("Canvas drawing error", err);
    }
  };

  const handleDownload = () => {
    if (!frontImage && !backImage) {
      alert(isBangla ? 'অনুগ্রহ করে ছবি আপলোড করুন।' : 'Please upload images first.');
      return;
    }
    drawCanvas((url) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = `NID_Print_Ready_${Date.now()}.jpg`;
      link.click();
    });
  };

  const handlePrint = () => {
    if (!frontImage && !backImage) return;
    drawCanvas((url) => {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>NID Print</title>
              <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                img { max-width: 100%; max-height: 100%; }
                @media print {
                  @page { margin: 0; }
                  body { -webkit-print-color-adjust: exact; }
                }
              </style>
            </head>
            <body>
              <img src="${url}" onload="window.print();window.close()" />
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-800 py-12 px-4 animate-fade-in font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-700 text-slate-200 text-sm font-bold mb-4 border border-slate-600">
            <CreditCard size={16} />
            {isBangla ? 'NID সেবা' : 'NID Service'}
          </div>
          <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-widest">NID PRINT READY</h1>
          <p className="text-slate-400">
            {isBangla ? 'আপনার NID কার্ডের ছবি আপলোড করুন এবং প্রিন্টের জন্য প্রস্তুত করুন' : 'Upload your NID card images and prepare for print'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                <button 
                  onClick={() => setActiveTab('front')} 
                  className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'front' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {isBangla ? 'সামনের দিক' : 'Front Side'}
                </button>
                <button 
                  onClick={() => setActiveTab('back')} 
                  className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'back' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {isBangla ? 'পেছনের দিক' : 'Back Side'}
                </button>
              </div>

              <div className="mb-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  {activeTab === 'front' ? (isBangla ? 'সামনের ছবি আপলোড:' : 'Upload Front Image:') : (isBangla ? 'পেছনের ছবি আপলোড:' : 'Upload Back Image:')}
                </p>
                <div 
                  onClick={triggerUpload}
                  className="border-2 border-dashed border-slate-300 rounded-2xl h-32 flex flex-col items-center justify-center cursor-pointer hover:border-slate-800 hover:bg-slate-50 transition-all group overflow-hidden relative"
                >
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                  
                  {activeTab === 'front' && frontImage ? (
                    <img src={frontImage} className="w-full h-full object-cover" style={getFilterStyle()} />
                  ) : activeTab === 'back' && backImage ? (
                    <img src={backImage} className="w-full h-full object-cover" style={getFilterStyle()} />
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                        <Upload size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-500">{isBangla ? 'ফাইল বাছুন' : 'Choose File'}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isBangla ? 'কালার এডজাস্টমেন্ট' : 'Adjustments'}</p>
                   <button onClick={handleResetFilters} className="text-[10px] font-bold text-red-500 flex items-center gap-1 hover:underline"><RefreshCw size={10}/> Reset</button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1"><Sun size={12}/> Brightness</span>
                    <span>{brightness}%</span>
                  </div>
                  <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1"><Contrast size={12}/> Contrast</span>
                    <span>{contrast}%</span>
                  </div>
                  <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1"><Droplet size={12}/> Saturation</span>
                    <span>{saturation}%</span>
                  </div>
                  <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800" />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2rem] shadow-2xl p-8 min-h-[600px] flex flex-col justify-between relative overflow-hidden">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 text-xl">{isBangla ? 'প্রিভিউ' : 'Preview'}</h3>
                  <div className="flex gap-2">
                     <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                        {frontImage ? 'Front: Ready' : 'Front: Empty'}
                     </span>
                     <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200">
                        {backImage ? 'Back: Ready' : 'Back: Empty'}
                     </span>
                  </div>
               </div>

               <div className="flex-1 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 p-8 flex flex-col items-center justify-center gap-8 relative">
                  {!frontImage && !backImage && (
                    <div className="text-center text-slate-400">
                       <ImageIcon size={64} className="mx-auto mb-4 opacity-30" />
                       <p className="font-medium">{isBangla ? 'কোন ছবি আপলোড করা হয়নি' : 'No images uploaded yet'}</p>
                    </div>
                  )}
                  
                  {frontImage && (
                    <div className="w-full max-w-md shadow-lg rounded-xl overflow-hidden border border-slate-200 bg-white">
                       <img src={frontImage} className="w-full h-auto block" style={getFilterStyle()} />
                    </div>
                  )}
                  
                  {backImage && (
                    <div className="w-full max-w-md shadow-lg rounded-xl overflow-hidden border border-slate-200 bg-white">
                       <img src={backImage} className="w-full h-auto block" style={getFilterStyle()} />
                    </div>
                  )}
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  <Button onClick={() => alert('Feature coming soon!')} variant="secondary" className="font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border-none">
                    <RefreshCw size={16} className="mr-2" /> {isBangla ? 'ক্লিন ও হাইলাইট' : 'Clean & Highlight'}
                  </Button>
                  <Button onClick={handleDownload} className="font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200">
                    <Download size={18} className="mr-2" /> {isBangla ? 'NID ডাউনলোড' : 'Download NID'}
                  </Button>
                  <div className="flex gap-2">
                    <Button onClick={handlePrint} className="flex-1 font-bold bg-slate-700 hover:bg-slate-900 text-white shadow-lg">
                      <Printer size={18} className="mr-2" /> {isBangla ? 'প্রিন্ট' : 'Print'}
                    </Button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};
