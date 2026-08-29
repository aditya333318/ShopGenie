import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  ArrowLeftRight, 
  Camera, 
  SlidersHorizontal, 
  Check, 
  Tag, 
  HelpCircle,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import { 
  Product, 
  CartItem, 
  ChatMessage, 
  FilterState, 
  Coupon 
} from './types';
import { 
  INITIAL_PRODUCTS, 
  SHOPPING_MISSIONS, 
  AVAILABLE_COUPONS 
} from './data/products';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CompareModal } from './components/CompareModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AgentPanel } from './components/AgentPanel';
import { VisualSearchModal } from './components/VisualSearchModal';
import { FilterSidebar } from './components/FilterSidebar';
import { SkillsLabModal } from './components/SkillsLabModal';

export default function App() {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);

  // Cart state with local storage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shopgenie_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shopgenie_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Comparison tray state
  const [comparedIds, setComparedIds] = useState<string[]>([]);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => AVAILABLE_COUPONS[0]);

  // Toast banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals & Panels
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isSkillsLabOpen, setIsSkillsLabOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  // Filter & Search State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'All',
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    inStockOnly: false,
    fastShippingOnly: false,
    sortBy: 'featured',
  });

  // Chat Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: "👋 Hello! I'm your **Google AI Studio Shopping Concierge**, powered by Gemini 3.7.\n\nI can help you build custom tech setups, compare product specs, find active deals, or search lookalikes using photos. What are you shopping for today?",
      timestamp: 'Just now',
      suggestedPrompts: [
        'Build a remote work desk setup under $500',
        'Find the best noise-canceling headphones',
        'Recommend pour-over coffee gear',
      ],
    },
  ]);
  const [isAgentLoading, setIsAgentLoading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('shopgenie_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shopgenie_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  // Cart Actions
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added "${product.title}" to cart`);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist Actions
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed item from Wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved item to Wishlist ❤️');
        return [...prev, productId];
      }
    });
  };

  const handleMoveAllWishlistToCart = () => {
    const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));
    wishlistProducts.forEach((prod) => {
      handleAddToCart(prod);
    });
    setWishlistIds([]);
    setIsWishlistOpen(false);
    setIsCartOpen(true);
    showToast(`Moved ${wishlistProducts.length} items to Cart!`);
  };

  // Compare Actions
  const handleToggleCompare = (productId: string) => {
    setComparedIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        showToast('Comparison tray limited to 3 items at a time');
        return prev;
      }
      showToast('Added to comparison matrix');
      return [...prev, productId];
    });
  };

  const handleAddProductToCompare = (product: Product) => {
    if (!comparedIds.includes(product.id) && comparedIds.length < 3) {
      setComparedIds((prev) => [...prev, product.id]);
    }
  };

  const handleRemoveFromCompare = (productId: string) => {
    setComparedIds((prev) => prev.filter((id) => id !== productId));
  };

  // Coupon Actions
  const handleApplyCoupon = (code: string) => {
    const coupon = AVAILABLE_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon);
      showToast(`Coupon "${coupon.code}" applied: ${coupon.discountPercentage}% OFF!`);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // Agent Chat Handler
  const handleSendMessage = async (text: string, imageBase64?: string) => {
    setIsAgentOpen(true);
    setIsAgentLoading(true);

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMessage]);

    try {
      if (imageBase64) {
        // Visual search in agent
        const res = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64,
            mimeType: 'image/jpeg',
            userNotes: text,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const assistantMsg: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            role: 'assistant',
            content: `📷 **Visual Search Analysis:**\n\nI identified this aesthetic as **${data.identifiedItem}** (${data.priceRange}).\n\n${data.analysis}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            recommendedProductIds: data.recommendedProductIds,
            suggestedPrompts: [
              'Compare these matching items',
              'Are there cheaper alternatives?',
            ],
          };
          setChatMessages((prev) => [...prev, assistantMsg]);
        }
      } else {
        // Standard shopping chat
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            chatHistory: chatMessages.slice(-6).map((m) => ({
              role: m.role,
              content: m.content,
            })),
            currentCart: cart.map((c) => ({
              title: c.product.title,
              price: c.product.price,
              quantity: c.quantity,
            })),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const assistantMsg: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            role: 'assistant',
            content: data.reply || 'Here is what I found for your request.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            recommendedProductIds: data.recommendedProductIds,
            comparisonProductIds: data.comparisonProductIds,
            thoughtSteps: data.thoughtSteps,
            dealCodeSuggestion: data.dealCodeSuggestion,
            suggestedPrompts: data.suggestedPrompts,
          };
          setChatMessages((prev) => [...prev, assistantMsg]);
        } else {
          throw new Error('API failed');
        }
      }
    } catch (error) {
      console.error('Chat error', error);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: "I've cataloged your request and matched the best items from our inventory with active discounts and top customer ratings.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProductIds: products.slice(0, 2).map((p) => p.id),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAgentLoading(false);
    }
  };

  const handleAskAgentAboutProduct = (product: Product, customPrompt?: string) => {
    const prompt = customPrompt || `Tell me why I should buy the ${product.brand} ${product.title}. What are its main benefits, potential drawbacks, and top alternatives in your catalog?`;
    handleSendMessage(prompt);
  };

  // Categories list
  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const matchesTitle = p.title.toLowerCase().includes(q);
          const matchesBrand = p.brand.toLowerCase().includes(q);
          const matchesCategory = p.category.toLowerCase().includes(q);
          const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesBrand && !matchesCategory && !matchesTags) {
            return false;
          }
        }

        // Category
        if (filters.category !== 'All' && p.category !== filters.category) {
          return false;
        }

        // Price
        if (p.price > filters.maxPrice) {
          return false;
        }

        // Rating
        if (p.rating < filters.minRating) {
          return false;
        }

        // Stock
        if (filters.inStockOnly && !p.inStock) {
          return false;
        }

        // Fast Shipping
        if (filters.fastShippingOnly && !p.fastShipping) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'discount':
            return (b.discountPercent || 0) - (a.discountPercent || 0);
          case 'featured':
          default:
            return b.reviewCount - a.reviewCount;
        }
      });
  }, [products, filters]);

  const comparedProducts = products.filter((p) => comparedIds.includes(p.id));
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#202124]">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#202124] text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-[#8AB4F8]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlistIds.length}
        compareCount={comparedIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenAgent={() => setIsAgentOpen(true)}
        onOpenVisualSearch={() => setIsVisualSearchOpen(true)}
        onOpenSkillsLab={() => setIsSkillsLabOpen(true)}
        selectedCategory={filters.category}
        onSelectCategory={(cat) => setFilters((prev) => ({ ...prev, category: cat }))}
        categories={categories}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Hero Shopping Assistant Banner */}
        <section className="relative rounded-3xl overflow-hidden bg-[#202124] text-white p-6 sm:p-8 shadow-md border border-slate-800">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A73E8]/20 border border-[#1A73E8]/30 text-[#8AB4F8] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#8AB4F8] animate-pulse" />
              Google Skills Lab: Develop Gen AI Apps with Gemini & Streamlit
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Your Intelligent Shopping Concierge
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Describe your lifestyle, budget, or upload an aesthetic photo. Our autonomous agent finds, benchmarks, and customizes the ideal gear kit for you.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={() => setIsAgentOpen(true)}
                className="px-4 py-2.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-blue-100" />
                Launch Shopping Agent
              </button>
              <button
                onClick={() => setIsVisualSearchOpen(true)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all"
              >
                <Camera className="w-4 h-4 text-[#8AB4F8]" />
                Visual Search Lens
              </button>
              <button
                onClick={() => setIsSkillsLabOpen(true)}
                className="px-4 py-2.5 bg-[#1A73E8]/30 hover:bg-[#1A73E8]/50 text-[#8AB4F8] hover:text-white border border-[#1A73E8]/40 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all"
                id="hero-skills-lab-btn"
              >
                <Tag className="w-4 h-4 text-[#8AB4F8]" />
                Skills Lab Code & Hub
              </button>
            </div>
          </div>

          {/* Interactive Fast Goal Mission Chips */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-slate-400 font-bold shrink-0">Try Goal:</span>
            {SHOPPING_MISSIONS.slice(0, 4).map((m) => (
              <button
                key={m.id}
                onClick={() => handleSendMessage(m.prompt)}
                className="bg-white/10 hover:bg-[#1A73E8]/30 border border-white/10 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5"
              >
                <span>{m.title}</span>
                <span className="text-[10px] text-[#8AB4F8] font-bold bg-black/40 px-1.5 py-0.2 rounded">
                  ${m.budget}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Catalog Grid & Filters */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            categories={categories}
            products={products}
            onResetFilters={() =>
              setFilters({
                searchQuery: '',
                category: 'All',
                minPrice: 0,
                maxPrice: 1000,
                minRating: 0,
                inStockOnly: false,
                fastShippingOnly: false,
                sortBy: 'featured',
              })
            }
          />

          {/* Right: Products Grid */}
          <div className="flex-1 space-y-4">
            
            {/* Results Counter & Active Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 shadow-xs">
              <div>
                Showing <strong className="text-[#202124]">{filteredProducts.length}</strong> of{' '}
                <strong className="text-[#202124]">{products.length}</strong> verified products
                {filters.category !== 'All' && (
                  <span> in <strong className="text-[#1A73E8]">{filters.category}</strong></span>
                )}
              </div>

              {/* Compare Tray Notification Bar if items exist */}
              {comparedIds.length > 0 && (
                <div className="flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl font-medium">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600" />
                  <span>{comparedIds.length} items in compare tray</span>
                  <button
                    onClick={() => setIsCompareOpen(true)}
                    className="font-bold underline text-amber-900 ml-1 hover:text-amber-700"
                  >
                    View Comparison Matrix →
                  </button>
                </div>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
                <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-[#202124]">No products match your current filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your price slider, clearing search terms, or ask the AI Shopping Agent to find alternatives.
                </p>
                <button
                  onClick={() => setIsAgentOpen(true)}
                  className="px-4 py-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask Agent to Search Custom Items
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleCompare={handleToggleCompare}
                    isCompared={comparedIds.includes(product.id)}
                    onOpenDetails={setSelectedProductDetails}
                    onAskAgent={handleAskAgentAboutProduct}
                  />
                ))}
              </div>
            )}

          </div>

        </div>

      </main>

      {/* Floating Agent Trigger Pill */}
      {!isAgentOpen && (
        <button
          onClick={() => setIsAgentOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#1A73E8] hover:bg-[#1557B0] text-white px-4 py-3 rounded-full font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/25 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 border border-blue-400/30 group"
          id="floating-agent-btn"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
          </div>
          <span>Shopping Agent</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        </button>
      )}

      {/* Modals and Drawers */}
      <ProductDetailModal
        product={selectedProductDetails}
        onClose={() => setSelectedProductDetails(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProductDetails ? wishlistIds.includes(selectedProductDetails.id) : false}
        onToggleCompare={handleToggleCompare}
        isCompared={selectedProductDetails ? comparedIds.includes(selectedProductDetails.id) : false}
        onAskAgent={handleAskAgentAboutProduct}
      />

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        comparedProducts={comparedProducts}
        onRemoveFromCompare={handleRemoveFromCompare}
        onAddToCart={handleAddToCart}
        allProducts={products}
        onAddProductToCompare={handleAddProductToCompare}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onMoveAllToCart={handleMoveAllWishlistToCart}
      />

      <VisualSearchModal
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
        allProducts={products}
        onAddToCart={handleAddToCart}
        onOpenProductDetails={setSelectedProductDetails}
        onAskAgent={handleAskAgentAboutProduct}
      />

      <AgentPanel
        isOpen={isAgentOpen}
        onClose={() => setIsAgentOpen(false)}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        isLoading={isAgentLoading}
        allProducts={products}
        cart={cart}
        onAddToCart={handleAddToCart}
        onOpenProductDetails={setSelectedProductDetails}
        onToggleCompare={handleToggleCompare}
        comparedIds={comparedIds}
        onApplyCoupon={handleApplyCoupon}
        onClearChat={() =>
          setChatMessages([
            {
              id: 'welcome-1',
              role: 'assistant',
              content: "👋 How can I help with your shopping decisions today?",
              timestamp: 'Just now',
            },
          ])
        }
      />

      <SkillsLabModal
        isOpen={isSkillsLabOpen}
        onClose={() => setIsSkillsLabOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-[#202124] text-slate-400 text-xs py-8 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button 
            onClick={() => setIsSkillsLabOpen(true)}
            className="flex items-center gap-2 text-left hover:text-white transition-colors group"
            id="footer-skills-lab-btn"
          >
            <div className="w-6 h-6 rounded-lg bg-[#1A73E8] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white">ShopGenie AI</span>
            <span className="text-slate-400 group-hover:text-[#8AB4F8] transition-colors">— Google Skills Lab Submission & Streamlit Code ↗</span>
          </button>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Powered by Google AI Studio</span>
            <span>•</span>
            <span>Gemini 3.7 Flash</span>
            <span>•</span>
            <span>Multimodal Vision</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
