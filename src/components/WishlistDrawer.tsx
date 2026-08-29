import React from 'react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onMoveAllToCart: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onMoveAllToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="font-extrabold text-slate-900 text-base">Saved Wishlist</h2>
              <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {wishlistProducts.length} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          {wishlistProducts.length === 0 ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-3 text-slate-400">
              <Heart className="w-16 h-16 text-slate-200 stroke-1" />
              <p className="font-bold text-slate-700 text-sm">Your wishlist is empty</p>
              <p className="text-xs max-w-xs">Heart any product in the catalog to save it for later review.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="divide-y divide-slate-100">
                {wishlistProducts.map((product) => (
                  <div key={product.id} className="py-3.5 flex gap-3.5 items-center">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold text-indigo-600">{product.brand}</div>
                      <h4 className="font-bold text-slate-900 text-xs truncate">{product.title}</h4>
                      <div className="text-xs font-extrabold text-slate-900 mt-1">${product.price}</div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onAddToCart(product)}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        Add
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(product.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          {wishlistProducts.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <button
                onClick={onMoveAllToCart}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Move All {wishlistProducts.length} Items to Cart
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
