import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Sparkles, 
  ShoppingCart, 
  Heart, 
  ArrowLeftRight, 
  Check, 
  Truck, 
  ShieldCheck, 
  ThumbsUp, 
  ThumbsDown,
  RefreshCw,
  Zap,
  BarChart3
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  onToggleCompare: (productId: string) => void;
  isCompared: boolean;
  onAskAgent: (product: Product, customPrompt?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onToggleCompare,
  isCompared,
  onAskAgent,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews' | 'ai-insights'>('overview');
  const [aiSentiment, setAiSentiment] = useState<any>(null);
  const [loadingSentiment, setLoadingSentiment] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveTab('overview');
      fetchSentiment(product.id);
    }
  }, [product]);

  const fetchSentiment = async (productId: string) => {
    setLoadingSentiment(true);
    try {
      const res = await fetch('/api/review-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiSentiment(data);
      }
    } catch (e) {
      console.error('Failed to load sentiment', e);
    } finally {
      setLoadingSentiment(false);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#F8F9FA]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A73E8] bg-[#E8F0FE] border border-[#1A73E8]/20 px-2 py-0.5 rounded-md">
              {product.brand}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {product.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-[#202124] hover:bg-slate-200/60 rounded-full transition-colors"
            id="close-product-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left: Product Image & Highlights */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#F8F9FA] border border-slate-200 shadow-inner">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-[#202124]/90 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 p-2.5 bg-[#F8F9FA] rounded-xl border border-slate-200/80">
                <Truck className="w-4 h-4 text-[#1A73E8] shrink-0" />
                <span>Free Express 2-Day Delivery on orders over $50</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-[#F8F9FA] rounded-xl border border-slate-200/80">
                <ShieldCheck className="w-4 h-4 text-[#1E8E3E] shrink-0" />
                <span>2-Year Authentic Manufacturer Warranty</span>
              </div>
            </div>

            {/* AI Agent Quick Prompts for this item */}
            <div className="p-4 bg-[#E8F0FE]/60 rounded-2xl border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#1967D2] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1A73E8]" />
                  Gemini Agent Insights
                </span>
                <span className="text-[10px] text-[#1A73E8] font-semibold uppercase">Instant Advice</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    onClose();
                    onAskAgent(product, `What are the top pros and cons of ${product.title} compared to market alternatives?`);
                  }}
                  className="text-left text-xs text-[#1967D2] hover:text-blue-950 hover:bg-[#E8F0FE] p-2 rounded-lg transition-colors font-medium"
                >
                  💬 "How does this compare to cheaper alternatives?"
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onAskAgent(product, `Are there any hidden downsides or customer complaints for ${product.title}?`);
                  }}
                  className="text-left text-xs text-[#1967D2] hover:text-blue-950 hover:bg-[#E8F0FE] p-2 rounded-lg transition-colors font-medium"
                >
                  💬 "Check user review sentiment and durability complaints"
                </button>
              </div>
            </div>
          </div>

          {/* Right: Info, Tabs, and Purchase Section */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#202124] leading-tight">
                {product.title}
              </h2>

              {/* Rating & Stock */}
              <div className="flex items-center gap-4 mt-2.5">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-[#202124]">{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">({product.reviewCount} customer reviews)</span>
                </div>
                <div className="h-3.5 w-px bg-slate-200" />
                <span className="text-xs font-semibold text-[#1E8E3E] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  In Stock ({product.stockCount} units)
                </span>
              </div>

              {/* Price Banner */}
              <div className="flex items-baseline gap-3 my-4 p-3.5 bg-[#F8F9FA] rounded-2xl border border-slate-200/80">
                <span className="text-3xl font-extrabold text-[#202124]">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="text-xs font-bold text-[#1E8E3E] bg-emerald-100 px-2 py-0.5 rounded-full">
                      Save ${(product.originalPrice - product.price).toFixed(0)} ({product.discountPercent}%)
                    </span>
                  </>
                )}
              </div>

              {/* Tabs Navigation */}
              <div className="flex items-center gap-1 border-b border-slate-200 pb-2 mb-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-[#202124] text-white'
                      : 'text-slate-600 hover:text-[#202124] hover:bg-slate-100'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'specs'
                      ? 'bg-[#202124] text-white'
                      : 'text-slate-600 hover:text-[#202124] hover:bg-slate-100'
                  }`}
                >
                  Tech Specs
                </button>
                <button
                  onClick={() => setActiveTab('ai-insights')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                    activeTab === 'ai-insights'
                      ? 'bg-[#1A73E8] text-white'
                      : 'text-[#1A73E8] hover:bg-[#E8F0FE]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Sentiment
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'reviews'
                      ? 'bg-[#202124] text-white'
                      : 'text-slate-600 hover:text-[#202124] hover:bg-slate-100'
                  }`}
                >
                  Reviews ({product.userReviews.length})
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-4 text-xs text-slate-700">
                  <p className="leading-relaxed text-slate-600 text-sm">
                    {product.description}
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-bold text-[#202124] text-xs uppercase tracking-wider">Key Highlights:</h4>
                    <ul className="space-y-1.5">
                      {product.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#1E8E3E] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                      <div className="font-bold text-emerald-800 flex items-center gap-1.5 mb-1.5">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        Customer Pros
                      </div>
                      <ul className="space-y-1 text-emerald-900 text-[11px]">
                        {product.pros.map((p, i) => (
                          <li key={i}>• {p}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl">
                      <div className="font-bold text-amber-800 flex items-center gap-1.5 mb-1.5">
                        <ThumbsDown className="w-3.5 h-3.5" />
                        Known Trade-offs
                      </div>
                      <ul className="space-y-1 text-amber-900 text-[11px]">
                        {product.cons.map((c, i) => (
                          <li key={i}>• {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-2">
                  <table className="w-full text-xs">
                    <tbody>
                      {Object.entries(product.specs).map(([key, val], idx) => (
                        <tr key={key} className={idx % 2 === 0 ? 'bg-[#F8F9FA]' : 'bg-white'}>
                          <td className="py-2 px-3 font-semibold text-slate-600 border-b border-slate-100 w-1/3">
                            {key}
                          </td>
                          <td className="py-2 px-3 text-[#202124] border-b border-slate-100 font-medium">
                            {val}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'ai-insights' && (
                <div className="space-y-4 text-xs">
                  {loadingSentiment ? (
                    <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
                      <RefreshCw className="w-6 h-6 text-[#1A73E8] animate-spin" />
                      <span>Synthesizing hundreds of verified buyer reviews...</span>
                    </div>
                  ) : aiSentiment ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-[#E8F0FE]/70 rounded-xl border border-blue-100">
                        <div className="font-bold text-[#1967D2] mb-1 flex items-center justify-between">
                          <span>Overall Buyer Sentiment</span>
                          <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            {aiSentiment.overallSentiment}
                          </span>
                        </div>
                        <p className="text-slate-700 text-xs leading-relaxed">{aiSentiment.aiSummary}</p>
                      </div>

                      {/* Component Score Bars */}
                      {aiSentiment.scoreBreakdown && (
                        <div className="grid grid-cols-2 gap-2 bg-[#F8F9FA] p-3 rounded-xl border border-slate-200/80">
                          <div>
                            <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                              <span>Build Quality</span>
                              <strong className="text-[#202124]">{aiSentiment.scoreBreakdown.buildQuality}/10</strong>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#1A73E8] rounded-full" 
                                style={{ width: `${(aiSentiment.scoreBreakdown.buildQuality / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                              <span>Ease of Use</span>
                              <strong className="text-[#202124]">{aiSentiment.scoreBreakdown.easeOfUse}/10</strong>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#1E8E3E] rounded-full" 
                                style={{ width: `${(aiSentiment.scoreBreakdown.easeOfUse / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                              <span>Value for Money</span>
                              <strong className="text-[#202124]">{aiSentiment.scoreBreakdown.valueForMoney}/10</strong>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-amber-500 rounded-full" 
                                style={{ width: `${(aiSentiment.scoreBreakdown.valueForMoney / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                              <span>Durability</span>
                              <strong className="text-[#202124]">{aiSentiment.scoreBreakdown.durability}/10</strong>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-slate-700 rounded-full" 
                                style={{ width: `${(aiSentiment.scoreBreakdown.durability / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Buy If / Skip If */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-900">
                          <strong className="block text-[11px] text-emerald-800 mb-1">Buy if:</strong>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                            {aiSentiment.buyIf?.map((b: string, i: number) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-2.5 bg-rose-50 rounded-lg text-rose-900">
                          <strong className="block text-[11px] text-rose-800 mb-1">Skip if:</strong>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                            {aiSentiment.skipIf?.map((s: string, i: number) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {product.userReviews.map((rev) => (
                    <div key={rev.id} className="p-3 bg-[#F8F9FA] rounded-xl border border-slate-200/80 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#202124]">{rev.author}</span>
                          {rev.verified && (
                            <span className="bg-emerald-100 text-[#1E8E3E] text-[10px] px-1.5 py-0.2 rounded font-semibold">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <h5 className="font-semibold text-[#202124] mb-0.5">{rev.title}</h5>
                      <p className="text-slate-600 text-xs">{rev.comment}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{rev.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`p-3 rounded-2xl border transition-colors ${
                  isWishlisted 
                    ? 'bg-rose-50 text-[#D93025] border-rose-200' 
                    : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                title="Wishlist"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={() => onToggleCompare(product.id)}
                className={`p-3 rounded-2xl border transition-colors ${
                  isCompared 
                    ? 'bg-amber-50 text-amber-800 border-amber-300' 
                    : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                title="Compare with other gear"
              >
                <ArrowLeftRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="flex-1 py-3.5 bg-[#202124] hover:bg-[#1A73E8] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 active:scale-98 transition-all"
                id="modal-add-to-cart-btn"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart • ${product.price}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
