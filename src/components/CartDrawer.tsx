import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  Sparkles, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Coupon } from '../types';
import { AVAILABLE_COUPONS } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [budgetLimit, setBudgetLimit] = useState<number>(500);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = appliedCoupon
    ? (subtotal * appliedCoupon.discountPercentage) / 100
    : 0;

  const shippingThreshold = 75;
  const isFreeShipping = subtotal >= shippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 9.99;
  const tax = (subtotal - discountAmount) * 0.08;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost + tax);

  const handleApplyCouponCode = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const found = AVAILABLE_COUPONS.find(
      (c) => c.code.toLowerCase() === couponInput.trim().toLowerCase()
    );

    if (!found) {
      setCouponError('Invalid coupon code. Try SKILLSLAB20 or GEMINI15');
      return;
    }

    if (subtotal < found.minSpend) {
      setCouponError(`Minimum spend of $${found.minSpend} required for this code.`);
      return;
    }

    onApplyCoupon(found.code);
    setCouponInput('');
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      setOrderComplete({
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...cart],
        total: finalTotal,
        discount: discountAmount,
      });
      setIsCheckingOut(false);
      onClearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h2 className="font-extrabold text-slate-900 text-base">Your Shopping Cart</h2>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
              id="close-cart-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          {orderComplete ? (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Order Placed Successfully!</h3>
                <p className="text-xs text-slate-500 mt-1">Receipt ID: {orderComplete.orderId}</p>
              </div>
              <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-left space-y-2">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Total Paid:</span>
                  <span className="font-bold text-slate-900">${orderComplete.total.toFixed(2)}</span>
                </div>
                {orderComplete.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount Saved:</span>
                    <span>-${orderComplete.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Delivery:</span>
                  <span>2 Business Days</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setOrderComplete(null);
                  onClose();
                }}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-indigo-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-3 text-slate-400">
              <ShoppingBag className="w-16 h-16 text-slate-200 stroke-1" />
              <p className="font-bold text-slate-700 text-sm">Your cart is empty</p>
              <p className="text-xs max-w-xs">Ask the Google Shopping Agent for personalized recommendations!</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Free shipping & Budget tracker meters */}
              <div className="space-y-3">
                {/* Free Shipping meter */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Truck className="w-3.5 h-3.5 text-indigo-600" />
                      {isFreeShipping ? 'Free Express Delivery unlocked!' : `Add $${(shippingThreshold - subtotal).toFixed(2)} for Free Shipping`}
                    </span>
                    <span className="font-bold">${subtotal.toFixed(0)} / ${shippingThreshold}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Target Budget Tracker */}
                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs">
                  <div className="flex items-center justify-between text-indigo-950 mb-1">
                    <span className="font-semibold flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
                      Shopper Budget Meter (${budgetLimit})
                    </span>
                    <span className={`font-bold ${finalTotal > budgetLimit ? 'text-rose-600' : 'text-emerald-700'}`}>
                      ${finalTotal.toFixed(2)} / ${budgetLimit}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-indigo-200/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        finalTotal > budgetLimit ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (finalTotal / budgetLimit) * 100)}%` }}
                    />
                  </div>
                  {finalTotal > budgetLimit && (
                    <p className="text-[10px] text-rose-600 font-medium mt-1">
                      Over target budget by ${(finalTotal - budgetLimit).toFixed(2)}. Ask the agent for budget substitutions!
                    </p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-3.5 flex gap-3.5 items-center">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold text-indigo-600">{item.product.brand}</div>
                      <h4 className="font-bold text-slate-900 text-xs truncate">{item.product.title}</h4>
                      <div className="text-xs font-extrabold text-slate-900 mt-1">${item.product.price}</div>
                    </div>

                    {/* Quantity Modifier */}
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-slate-900 px-1">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Promo Coupon Form */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-600" />
                    Promo Code / Coupon
                  </span>
                  <span className="text-[10px] text-indigo-600 font-semibold">SKILLSLAB20</span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-xs">
                    <div>
                      <strong className="font-bold">{appliedCoupon.code}</strong> ({appliedCoupon.discountPercentage}% off)
                    </div>
                    <button
                      onClick={onRemoveCoupon}
                      className="text-rose-600 hover:text-rose-800 text-[11px] font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCouponCode} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. SKILLSLAB20"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl uppercase font-mono tracking-wider focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                )}
              </div>

              {/* Summary Breakdown */}
              <div className="space-y-2 text-xs border-t border-slate-200 pt-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({appliedCoupon.discountPercentage}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>{isFreeShipping ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Checkout Button */}
          {cart.length > 0 && !orderComplete && (
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
                id="checkout-btn"
              >
                {isCheckingOut ? (
                  <span>Processing Secure Checkout...</span>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
