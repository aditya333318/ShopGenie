import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  Sparkles, 
  RefreshCw, 
  ShoppingCart, 
  ArrowRight, 
  Tag, 
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { Product } from '../types';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allProducts: Product[];
  onAddToCart: (product: Product) => void;
  onOpenProductDetails: (product: Product) => void;
  onAskAgent: (product: Product, prompt?: string) => void;
}

const PRESET_SAMPLE_PHOTOS = [
  {
    title: 'Specialty Coffee Bar',
    url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80',
    hint: 'Gooseneck kettle & grinder look'
  },
  {
    title: 'Minimalist Desk Setup',
    url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    hint: 'Custom mechanical keyboard'
  },
  {
    title: 'Travel Noise-Canceling',
    url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
    hint: 'Over-ear headphones'
  },
  {
    title: 'Smart Fitness Gear',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    hint: 'GPS running smartwatch'
  }
];

export const VisualSearchModal: React.FC<VisualSearchModalProps> = ({
  isOpen,
  onClose,
  allProducts,
  onAddToCart,
  onOpenProductDetails,
  onAskAgent,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      analyzeImage(reader.result as string, userNotes);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = async (presetUrl: string) => {
    try {
      setIsAnalyzing(true);
      setSelectedImage(presetUrl);
      
      // Fetch preset image and convert to base64 for multimodal analysis
      const res = await fetch(presetUrl);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        analyzeImage(reader.result as string, userNotes);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.error('Preset load error', e);
      setIsAnalyzing(false);
    }
  };

  const analyzeImage = async (base64: string, notes: string) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: 'image/jpeg',
          userNotes: notes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      }
    } catch (e) {
      console.error('Failed to analyze visual image', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                Gemini Visual Shopping Lens
                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-bold">
                  Multimodal AI
                </span>
              </h2>
              <p className="text-xs text-slate-500">Upload any photo or screenshot to find matching aesthetic items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Upload / Dropzone Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/30 hover:bg-indigo-50/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[180px]"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <Upload className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="font-bold text-xs text-slate-800">Upload Photo or Drop Image</span>
              <span className="text-[11px] text-slate-500 mt-0.5">Supports JPG, PNG, WebP</span>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Or Try Sample Visual Prompts:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_SAMPLE_PHOTOS.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(sample.url)}
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left flex items-center gap-2 group transition-all"
                  >
                    <img src={sample.url} alt={sample.title} className="w-10 h-10 object-cover rounded-lg shrink-0 bg-white" />
                    <div className="min-w-0">
                      <span className="font-bold text-[11px] text-slate-900 block truncate group-hover:text-indigo-600">
                        {sample.title}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">{sample.hint}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Image Preview & Analysis Results */}
          {selectedImage && (
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-4">
                <img
                  src={selectedImage}
                  alt="Visual Query"
                  className="w-24 h-24 object-cover rounded-2xl border border-slate-200 shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Current Visual Query</h4>
                  <p className="text-xs text-slate-500">Gemini is extracting visual attributes & catalog similarity...</p>
                  {isAnalyzing && (
                    <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold mt-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Analyzing style and matching inventory...
                    </div>
                  )}
                </div>
              </div>

              {result && (
                <div className="p-4 bg-gradient-to-br from-indigo-50/80 to-purple-50/50 rounded-2xl border border-indigo-100 space-y-4">
                  {/* Identification & Attributes */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Identified Object</span>
                      <h3 className="font-extrabold text-base text-slate-900">{result.identifiedItem}</h3>
                    </div>
                    {result.priceRange && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        Estimated Tier: {result.priceRange}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{result.analysis}</p>

                  {/* Attribute tags */}
                  {result.attributes && (
                    <div className="flex flex-wrap gap-1.5">
                      {result.attributes.map((attr: string, i: number) => (
                        <span key={i} className="text-[11px] bg-white/80 border border-indigo-200/60 text-indigo-900 px-2 py-0.5 rounded-md font-medium">
                          #{attr}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Matching Products */}
                  {result.recommendedProductIds && result.recommendedProductIds.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-indigo-100">
                      <span className="text-xs font-bold text-slate-900 block">Matching Store Catalog Items:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {result.recommendedProductIds.map((prodId: string) => {
                          const prod = allProducts.find((p) => p.id === prodId);
                          if (!prod) return null;

                          return (
                            <div key={prod.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img src={prod.imageUrl} alt={prod.title} className="w-12 h-12 object-cover rounded-lg shrink-0 cursor-pointer" onClick={() => onOpenProductDetails(prod)} />
                                <div className="min-w-0">
                                  <h5 className="font-bold text-xs text-slate-900 truncate hover:text-indigo-600 cursor-pointer" onClick={() => onOpenProductDetails(prod)}>
                                    {prod.title}
                                  </h5>
                                  <span className="text-xs font-extrabold text-slate-900 block">${prod.price}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  onAddToCart(prod);
                                  onClose();
                                }}
                                className="p-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                                title="Add to Cart"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
