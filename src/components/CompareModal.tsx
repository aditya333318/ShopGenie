import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ShoppingCart, 
  Trash2, 
  Trophy, 
  Check, 
  Minus, 
  RefreshCw,
  Plus
} from 'lucide-react';
import { Product } from '../types';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProducts: Product[];
  onRemoveFromCompare: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  allProducts: Product[];
  onAddProductToCompare: (product: Product) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  comparedProducts,
  onRemoveFromCompare,
  onAddToCart,
  allProducts,
  onAddProductToCompare,
}) => {
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && comparedProducts.length >= 2) {
      fetchComparison();
    } else {
      setAiAnalysis(null);
    }
  }, [isOpen, comparedProducts.map((p) => p.id).join(',')]);

  const fetchComparison = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: comparedProducts.map((p) => p.id),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data);
      }
    } catch (e) {
      console.error('Failed to compare', e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Extract all unique spec keys across compared items
  const allSpecKeys: string[] = Array.from(
    new Set<string>(comparedProducts.flatMap((p) => Object.keys(p.specs || {})))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              VS
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Side-by-Side Product Comparison</h2>
              <p className="text-xs text-slate-500">Compare specs, value scores, and AI verdict</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            id="close-compare-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {comparedProducts.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <p className="font-semibold text-slate-700">No products in comparison tray.</p>
              <p className="text-xs">Click the comparison icon on any 2 or more products to see their side-by-side analysis.</p>
            </div>
          ) : (
            <>
              {/* Product Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {comparedProducts.map((p) => (
                  <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 relative flex flex-col justify-between">
                    <button
                      onClick={() => onRemoveFromCompare(p.id)}
                      className="absolute top-2.5 right-2.5 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div>
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-36 object-cover rounded-xl mb-3 bg-white"
                      />
                      <div className="text-xs font-semibold text-indigo-600 mb-0.5">{p.brand}</div>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-2">{p.title}</h4>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-xl font-extrabold text-slate-900">${p.price}</span>
                        {p.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">${p.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onAddToCart(p)}
                      className="w-full mt-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                  </div>
                ))}

                {/* Add product slot if fewer than 3 */}
                {comparedProducts.length < 3 && (
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 text-slate-400 hover:border-indigo-300 transition-colors">
                    <Plus className="w-8 h-8 text-slate-300" />
                    <span className="text-xs font-semibold text-slate-600">Select another product</span>
                    <select
                      onChange={(e) => {
                        const prod = allProducts.find((p) => p.id === e.target.value);
                        if (prod) onAddProductToCompare(prod);
                      }}
                      value=""
                      className="mt-2 text-xs bg-slate-100 text-slate-700 p-2 rounded-xl border border-slate-200 outline-none"
                    >
                      <option value="">+ Add to comparison...</option>
                      {allProducts
                        .filter((p) => !comparedProducts.some((cp) => cp.id === p.id))
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.brand} - {p.title} (${p.price})
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Gemini AI Comparison & Winner Analysis */}
              {comparedProducts.length >= 2 && (
                <div className="bg-gradient-to-br from-indigo-50/90 via-slate-50 to-purple-50/60 p-5 rounded-2xl border border-indigo-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <h3 className="font-bold text-sm text-slate-900">Gemini AI Synthesis & Comparison Verdict</h3>
                    </div>
                    {loading && (
                      <span className="text-xs text-indigo-600 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Analyzing trade-offs...
                      </span>
                    )}
                  </div>

                  {aiAnalysis && (
                    <div className="space-y-3 text-xs">
                      {/* Overall Summary */}
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {aiAnalysis.summary}
                      </p>

                      {/* Winner Callout */}
                      {aiAnalysis.winner && (
                        <div className="p-3 bg-white/80 rounded-xl border border-indigo-200 flex items-start gap-3 shadow-xs">
                          <Trophy className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-slate-900 text-xs">Overall Value Winner: {aiAnalysis.winner}</strong>
                            <p className="text-slate-600 text-[11px] mt-0.5">{aiAnalysis.winnerReason}</p>
                          </div>
                        </div>
                      )}

                      {/* Key Differences */}
                      {aiAnalysis.keyDifferences && (
                        <div className="space-y-1.5 pt-1">
                          <strong className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Key Differences:</strong>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {aiAnalysis.keyDifferences.map((kd: any, idx: number) => (
                              <div key={idx} className="p-2.5 bg-white/60 rounded-lg border border-slate-200/80">
                                <span className="font-bold text-slate-800 block text-[11px]">{kd.feature}</span>
                                <span className="text-slate-600 text-[11px]">{kd.detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Persona recommendations */}
                      {aiAnalysis.idealFor && (
                        <div className="pt-2">
                          <strong className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-1.5">Who Should Choose Which?</strong>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {aiAnalysis.idealFor.map((item: any, idx: number) => (
                              <div key={idx} className="p-2 bg-indigo-50/50 rounded-lg border border-indigo-100">
                                <span className="font-semibold text-indigo-900 block text-[11px]">{item.productTitle}</span>
                                <span className="text-indigo-700 text-[11px]">{item.bestFor}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Spec Comparison Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Detailed Specifications Matrix</h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                        <th className="py-2.5 px-4 text-left font-bold w-1/4">Specification</th>
                        {comparedProducts.map((p) => (
                          <th key={p.id} className="py-2.5 px-4 text-left font-bold">{p.title}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50">Price</td>
                        {comparedProducts.map((p) => (
                          <td key={p.id} className="py-2.5 px-4 font-bold text-slate-900">${p.price}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50">Customer Rating</td>
                        {comparedProducts.map((p) => (
                          <td key={p.id} className="py-2.5 px-4 text-slate-800">★ {p.rating} ({p.reviewCount})</td>
                        ))}
                      </tr>
                      {allSpecKeys.map((key) => (
                        <tr key={key} className="border-b border-slate-100">
                          <td className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50">{key}</td>
                          {comparedProducts.map((p) => (
                            <td key={p.id} className="py-2.5 px-4 text-slate-800">
                              {p.specs?.[key] || <Minus className="w-3 h-3 text-slate-300" />}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
