import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Trash2, 
  CheckCircle2, 
  CircleDot, 
  Clock, 
  Camera, 
  ChevronDown, 
  ChevronUp, 
  Tag, 
  ArrowRight, 
  ShoppingCart, 
  ArrowLeftRight,
  RefreshCw,
  Zap,
  Info,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { ChatMessage, Product, CartItem, ShoppingMission } from '../types';
import { SHOPPING_MISSIONS, AVAILABLE_COUPONS } from '../data/products';

interface AgentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string, imageBase64?: string) => Promise<void>;
  isLoading: boolean;
  allProducts: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onOpenProductDetails: (product: Product) => void;
  onToggleCompare: (productId: string) => void;
  comparedIds: string[];
  onApplyCoupon: (code: string) => void;
  onClearChat: () => void;
}

export const AgentPanel: React.FC<AgentPanelProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  isLoading,
  allProducts,
  cart,
  onAddToCart,
  onOpenProductDetails,
  onToggleCompare,
  comparedIds,
  onApplyCoupon,
  onClearChat,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});
  const [isExpandedFull, setIsExpandedFull] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const textToSend = inputText.trim();
    const imageToSend = selectedImage || undefined;

    setInputText('');
    setSelectedImage(null);
    await onSendMessage(textToSend, imageToSend);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const toggleThoughts = (msgId: string) => {
    setExpandedThoughts((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isExpandedFull
        ? 'inset-4 md:inset-10'
        : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[500px] h-[650px] max-h-[90vh]'
    }`}>
      <div className="w-full h-full bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden backdrop-blur-xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#202124] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1A73E8] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm tracking-tight text-white">Google Shopping Agent</h3>
                <span className="text-[10px] font-bold bg-[#1A73E8]/30 text-[#8AB4F8] border border-[#1A73E8]/30 px-1.5 py-0.2 rounded-full">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Autonomous product discovery & comparisons</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpandedFull(!isExpandedFull)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors hidden sm:block"
              title={isExpandedFull ? 'Minimize' : 'Expand full screen'}
            >
              {isExpandedFull ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClearChat}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors"
              title="Clear Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Close Agent"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F9FA]">
          
          {/* Welcome Screen & Pre-built Shopping Missions if only 1 welcome msg */}
          {messages.length <= 1 && (
            <div className="space-y-4 my-2">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2 shadow-xs">
                <div className="font-bold text-[#202124] flex items-center gap-1.5 text-sm">
                  <Zap className="w-4 h-4 text-[#1A73E8]" />
                  What can I help you discover today?
                </div>
                <p className="text-slate-600 leading-relaxed">
                  I can curate gear combinations, balance your budget, do deep spec comparisons, analyze authentic reviews, or find matches from a photo.
                </p>
              </div>

              {/* Shopping Missions Grid */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
                  Popular Shopping Missions:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SHOPPING_MISSIONS.slice(0, 4).map((mission) => (
                    <button
                      key={mission.id}
                      onClick={() => onSendMessage(mission.prompt)}
                      className="p-2.5 bg-white hover:bg-[#E8F0FE] border border-slate-200 hover:border-[#1A73E8]/40 rounded-xl text-left transition-all group shadow-xs"
                    >
                      <div className="flex items-center justify-between text-[#202124] font-bold text-xs mb-1">
                        <span className="group-hover:text-[#1A73E8] transition-colors">{mission.title}</span>
                        {mission.budget && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">
                            ${mission.budget}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                        {mission.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-[#1A73E8] text-white rounded-br-xs'
                    : 'bg-white text-[#202124] border border-slate-200 rounded-bl-xs'
                }`}
              >
                {/* Agent Thought Steps (if available) */}
                {msg.thoughtSteps && msg.thoughtSteps.length > 0 && (
                  <div className="mb-3 border border-blue-100 rounded-xl bg-[#E8F0FE]/60 overflow-hidden text-xs">
                    <button
                      onClick={() => toggleThoughts(msg.id)}
                      className="w-full px-3 py-1.5 flex items-center justify-between text-[11px] font-bold text-[#1967D2] hover:bg-[#E8F0FE] transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-[#1A73E8]" />
                        Agent Reasoning Trace ({msg.thoughtSteps.length} steps)
                      </span>
                      {expandedThoughts[msg.id] ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {expandedThoughts[msg.id] && (
                      <div className="p-2.5 pt-0 space-y-1.5 border-t border-blue-100/70">
                        {msg.thoughtSteps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#1E8E3E] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-[#202124]">{step.title}</span>
                              {step.detail && <p className="text-slate-500 text-[10px]">{step.detail}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Text Content */}
                <div className="prose prose-sm max-w-none text-inherit leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>

                {/* Deal code suggestion badge */}
                {msg.dealCodeSuggestion && (
                  <div className="mt-3 p-2.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#1E8E3E]" />
                      <span>Recommended Coupon: <strong>{msg.dealCodeSuggestion}</strong></span>
                    </div>
                    <button
                      onClick={() => onApplyCoupon(msg.dealCodeSuggestion!)}
                      className="text-[11px] bg-[#1E8E3E] hover:bg-emerald-700 text-white px-2 py-1 rounded-lg font-bold transition-colors"
                    >
                      Apply Coupon
                    </button>
                  </div>
                )}

                {/* Embedded Recommended Products */}
                {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Matching Catalog Recommendations:
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.recommendedProductIds.map((prodId) => {
                        const prod = allProducts.find((p) => p.id === prodId);
                        if (!prod) return null;
                        const isComp = comparedIds.includes(prod.id);

                        return (
                          <div
                            key={prod.id}
                            className="flex items-center gap-3 p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-colors"
                          >
                            <img
                              src={prod.imageUrl}
                              alt={prod.title}
                              className="w-12 h-12 object-cover rounded-lg bg-white shrink-0 cursor-pointer"
                              onClick={() => onOpenProductDetails(prod)}
                            />
                            <div className="flex-1 min-w-0">
                              <h5 
                                onClick={() => onOpenProductDetails(prod)}
                                className="font-bold text-[#202124] text-xs truncate hover:text-[#1A73E8] cursor-pointer"
                              >
                                {prod.title}
                              </h5>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-extrabold text-[#202124] text-xs">${prod.price}</span>
                                <span className="text-[10px] text-slate-500">★ {prod.rating}</span>
                                {prod.badge && (
                                  <span className="text-[9px] bg-[#E8F0FE] text-[#1967D2] px-1 rounded font-semibold">
                                    {prod.badge}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => onToggleCompare(prod.id)}
                                className={`p-1.5 rounded-lg text-xs border ${
                                  isComp
                                    ? 'bg-amber-500 text-white border-amber-500'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                                title="Compare"
                              >
                                <ArrowLeftRight className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onAddToCart(prod)}
                                className="p-1.5 bg-[#202124] hover:bg-[#1A73E8] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                                title="Add to Cart"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Suggested Follow-up Prompt Pills */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {msg.suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSendMessage(prompt)}
                        className="text-[11px] font-medium bg-[#E8F0FE] hover:bg-[#D2E3FC] text-[#1967D2] px-2.5 py-1 rounded-full border border-blue-100 transition-colors"
                      >
                        ↳ {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl max-w-xs text-xs text-slate-600 shadow-xs animate-pulse">
              <RefreshCw className="w-4 h-4 text-[#1A73E8] animate-spin" />
              <span>Gemini is reasoning over catalog & deals...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white">
          
          {/* Selected Image Thumbnail preview if any */}
          {selectedImage && (
            <div className="mb-2 p-1.5 bg-[#F8F9FA] border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={selectedImage} alt="Upload" className="w-10 h-10 object-cover rounded-lg" />
                <span className="text-xs text-slate-700 font-medium">Image attached for Visual Search</span>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 text-slate-400 hover:text-rose-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-2.5 rounded-xl border transition-colors ${
                selectedImage 
                  ? 'bg-[#E8F0FE] text-[#1A73E8] border-blue-300' 
                  : 'text-slate-500 hover:text-[#1A73E8] border-slate-200 hover:bg-slate-50'
              }`}
              title="Attach photo for visual shopping"
            >
              <Camera className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder="Ask for recommendations, compare items, budget plans..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 py-2 px-3 bg-[#F8F9FA] hover:bg-slate-100/90 focus:bg-white text-xs sm:text-sm text-[#202124] placeholder-slate-400 rounded-xl border border-slate-200 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 focus:outline-none transition-all"
              id="agent-chat-input"
            />

            <button
              type="submit"
              disabled={(!inputText.trim() && !selectedImage) || isLoading}
              className="p-2.5 bg-[#1A73E8] hover:bg-[#1557B0] disabled:opacity-40 text-white rounded-xl font-semibold shadow-xs transition-all"
              id="agent-send-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
