import React from 'react';
import { 
  Star, 
  Sparkles, 
  ShoppingCart, 
  Heart, 
  ArrowLeftRight, 
  Check, 
  Truck, 
  Info 
} from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  onToggleCompare: (productId: string) => void;
  isCompared: boolean;
  onOpenDetails: (product: Product) => void;
  onAskAgent: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onToggleCompare,
  isCompared,
  onOpenDetails,
  onAskAgent,
}) => {
  return (
    <div 
      className="group bg-white rounded-2xl border border-slate-200 hover:border-[#1A73E8]/40 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-200 flex flex-col overflow-hidden relative"
      id={`product-card-${product.id}`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 bg-[#F8F9FA] overflow-hidden cursor-pointer" onClick={() => onOpenDetails(product)}>
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="bg-[#202124]/90 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
              {product.badge}
            </span>
          )}
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="bg-[#1E8E3E] text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              -{product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Top Right Action Icons: Wishlist & Quick Compare */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              isWishlisted
                ? 'bg-[#D93025] text-white shadow-xs'
                : 'bg-white/85 text-slate-600 hover:bg-white hover:text-[#D93025] shadow-xs'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            id={`wishlist-toggle-${product.id}`}
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              isCompared
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white/85 text-slate-600 hover:bg-white hover:text-amber-600 shadow-xs'
            }`}
            title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
            id={`compare-toggle-${product.id}`}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Fast Shipping & Stock Indicator */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-medium pointer-events-none">
          {product.fastShipping && (
            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-xs text-slate-700 px-2 py-0.5 rounded-md shadow-xs border border-slate-200/60">
              <Truck className="w-3 h-3 text-[#1A73E8]" />
              Express Delivery
            </span>
          )}
          {product.stockCount && product.stockCount < 10 && (
            <span className="bg-rose-50/95 text-[#D93025] border border-rose-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
              Only {product.stockCount} left!
            </span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-[#1A73E8]">{product.brand}</span>
            <span>{product.category}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onOpenDetails(product)}
            className="font-bold text-[#202124] text-sm leading-snug line-clamp-2 hover:text-[#1A73E8] cursor-pointer transition-colors"
          >
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-[#202124] ml-1">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-400 text-xs">({product.reviewCount.toLocaleString()})</span>
          </div>

          {/* Top highlight / feature */}
          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {product.features[0]}
          </p>
        </div>

        {/* Pricing & Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-[#202124]">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <button
              onClick={() => onAskAgent(product)}
              className="text-[11px] font-semibold text-[#1A73E8] hover:text-[#1557B0] bg-[#E8F0FE] hover:bg-[#D2E3FC] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
              title="Ask Gemini about this item"
              id={`ask-agent-${product.id}`}
            >
              <Sparkles className="w-3 h-3 text-[#1A73E8]" />
              Ask Agent
            </button>
          </div>

          {/* Buttons: Add to Cart & Quick View */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenDetails(product)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
              id={`quick-view-${product.id}`}
            >
              <Info className="w-3.5 h-3.5" />
              Details
            </button>
            <button
              onClick={() => onAddToCart(product)}
              className="px-3 py-2 bg-[#202124] hover:bg-[#1A73E8] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95"
              id={`add-to-cart-${product.id}`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
