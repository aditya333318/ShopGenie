import React from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  SlidersHorizontal, 
  Search, 
  Camera, 
  ArrowLeftRight, 
  Layers
} from 'lucide-react';
import { Product } from '../types';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  wishlistCount: number;
  compareCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenCompare: () => void;
  onOpenAgent: () => void;
  onOpenVisualSearch: () => void;
  onOpenSkillsLab?: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: string[];
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  wishlistCount,
  compareCount,
  onOpenCart,
  onOpenWishlist,
  onOpenCompare,
  onOpenAgent,
  onOpenVisualSearch,
  onOpenSkillsLab,
  selectedCategory,
  onSelectCategory,
  categories,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Top Banner for Google Skills Lab Announcement */}
      <div className="bg-[#202124] text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-flex items-center gap-1 bg-[#1A73E8]/30 text-[#8AB4F8] px-2 py-0.5 rounded-full border border-[#1A73E8]/40 text-[11px] font-semibold">
            <Sparkles className="w-3 h-3 text-[#8AB4F8] animate-pulse" />
            Google Skills Lab
          </span>
          <span className="hidden sm:inline text-slate-300">
            Develop Gen AI Apps with Gemini & Streamlit Project Submission
          </span>
          <span className="sm:hidden text-slate-300">Skills Lab Submission</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-300 text-xs">
          {onOpenSkillsLab && (
            <button
              onClick={onOpenSkillsLab}
              className="text-[#8AB4F8] hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-md font-semibold transition-colors flex items-center gap-1"
              id="top-banner-skills-lab-btn"
            >
              <span>View Project & Streamlit Code</span>
              <span>→</span>
            </button>
          )}
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Code: <strong className="text-[#8AB4F8]">SKILLSLAB20</strong> (20% Off)</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSelectCategory('All')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
              id="app-logo-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1A73E8] flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-extrabold text-lg text-[#202124] tracking-tight flex items-center gap-1.5">
                  ShopGenie
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E8F0FE] text-[#1A73E8] border border-[#1A73E8]/20 px-1.5 py-0.5 rounded">
                    AI Agent
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium -mt-0.5">Google Skills Lab Edition</div>
              </div>
            </button>
          </div>

          {/* Search Bar & Visual Search Button */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products, brands, or ask agent for gifts..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-24 py-2 bg-[#F8F9FA] hover:bg-slate-100/90 focus:bg-white text-sm text-[#202124] placeholder-slate-400 rounded-xl border border-slate-200 focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 focus:outline-none transition-all"
                id="main-search-input"
              />
              <button
                onClick={onOpenVisualSearch}
                title="Search with Image (Multimodal)"
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-slate-700 bg-white hover:bg-slate-50 hover:text-[#1A73E8] border border-slate-200 px-2 py-1 rounded-lg transition-colors shadow-xs"
                id="visual-search-btn"
              >
                <Camera className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span className="font-medium">Lens</span>
              </button>
            </div>
          </div>

          {/* Actions & Agent Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Visual Search (Mobile) */}
            <button
              onClick={onOpenVisualSearch}
              className="md:hidden p-2 text-slate-600 hover:text-[#1A73E8] hover:bg-slate-100 rounded-xl border border-slate-200"
              title="Visual Search"
              id="mobile-visual-search-btn"
            >
              <Camera className="w-5 h-5 text-[#1A73E8]" />
            </button>

            {/* Shopping Agent Button */}
            <button
              onClick={onOpenAgent}
              className="relative flex items-center gap-2 px-3.5 py-2 bg-[#1A73E8] hover:bg-[#1557B0] active:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all group"
              id="open-agent-drawer-btn"
            >
              <Sparkles className="w-4 h-4 text-blue-100 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Ask AI Agent</span>
              <span className="sm:hidden">Agent</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            </button>

            {/* Compare Drawer Trigger */}
            <button
              onClick={onOpenCompare}
              className={`relative p-2 rounded-xl border transition-colors ${
                compareCount > 0
                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  : 'text-slate-600 hover:text-[#202124] border-slate-200 hover:bg-slate-100'
              }`}
              title="Compare Products"
              id="compare-tray-btn"
            >
              <ArrowLeftRight className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-slate-600 hover:text-[#202124] hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
              title="Wishlist"
              id="wishlist-btn"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D93025] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 px-3 py-2 bg-[#202124] hover:bg-[#303134] text-white rounded-xl text-sm font-semibold shadow-xs transition-all"
              id="cart-btn"
            >
              <ShoppingBag className="w-4 h-4 text-slate-200" />
              <span className="font-bold">{cartCount}</span>
            </button>
          </div>

        </div>

        {/* Category Filter Scroll Bar */}
        <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar border-t border-slate-100 text-xs font-medium">
          <button
            onClick={() => onSelectCategory('All')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-[#202124] text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-[#202124] hover:bg-slate-100'
            }`}
            id="cat-all-btn"
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1A73E8] text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-[#202124] hover:bg-slate-100'
              }`}
              id={`cat-${cat.toLowerCase().replace(/\s+/g, '-')}-btn`}
            >
              {cat}
            </button>
          ))}
          {onOpenSkillsLab && (
            <button
              onClick={onOpenSkillsLab}
              className="ml-auto px-3 py-1.5 rounded-lg whitespace-nowrap text-[#1A73E8] bg-[#E8F0FE] hover:bg-[#D2E3FC] border border-[#1A73E8]/30 font-bold transition-all flex items-center gap-1.5 shrink-0"
              id="skills-lab-pill-btn"
            >
              <Sparkles className="w-3 h-3 text-[#1A73E8]" />
              <span>Skills Lab / Streamlit Hub</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
