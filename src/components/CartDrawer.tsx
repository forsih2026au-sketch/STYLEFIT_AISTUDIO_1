import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Database, 
  CreditCard, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { formatCurrency } from '../lib/utils';

export const CartDrawer: React.FC = () => {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    subtotal, 
    shipping, 
    tax, 
    total 
  } = useCart();

  const { profile, updateProfile, supabaseCustomerId } = useUserProfile();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (!isCartOpen) return null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Sync customer data to Supabase if updated
      await updateProfile({
        name: customerName,
        email: customerEmail,
      }, true);

      const generatedOrder = `INSPIRA-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrder);

      setTimeout(() => {
        setIsProcessing(false);
        setCheckoutStep('success');
        clearCart();
      }, 900);
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col text-left">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">
                {checkoutStep === 'cart' && 'Shopping Bag'}
                {checkoutStep === 'checkout' && 'Checkout & Supabase Sync'}
                {checkoutStep === 'success' && 'Order Confirmed'}
              </h2>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setCheckoutStep('cart');
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            
            {/* STEP 1: CART ITEMS */}
            {checkoutStep === 'cart' && (
              <>
                {items.length === 0 ? (
                  <div className="py-20 text-center space-y-3 text-neutral-400">
                    <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto" />
                    <p className="text-base font-semibold text-white">Your bag is empty</p>
                    <p className="text-xs">Explore our collection and add pieces with your calibrated size.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item, idx) => (
                      <div
                        key={`${item.product.id}-${item.size}-${idx}`}
                        className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex gap-3 text-xs"
                      >
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-16 h-20 object-cover rounded-lg bg-neutral-800 shrink-0"
                        />

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="font-bold text-white text-xs line-clamp-1">
                                {item.product.name}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.product.id, item.size)}
                                className="text-neutral-500 hover:text-rose-400 p-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5 mt-1 text-neutral-400">
                              <span>Size: <strong className="text-white">{item.size}</strong></span>
                              {item.isRecommendedSize && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold flex items-center gap-0.5">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  AI Fit Match
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center border border-neutral-800 rounded-lg bg-neutral-900 text-xs">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                className="px-2 py-0.5 text-neutral-400 hover:text-white"
                              >
                                -
                              </button>
                              <span className="px-2 font-semibold text-white">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                                className="px-2 py-0.5 text-neutral-400 hover:text-white"
                              >
                                +
                              </button>
                            </div>

                            <span className="font-bold text-white text-sm">
                              {formatCurrency(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* STEP 2: CHECKOUT FORM */}
            {checkoutStep === 'checkout' && (
              <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 flex items-start gap-2">
                  <Database className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Supabase Customer Synchronization</span>
                    <p className="text-[11px] text-neutral-300 mt-0.5">
                      Your identity and contact information will be linked to your body measurements profile in Supabase ({supabaseCustomerId ? `ID: ${supabaseCustomerId.slice(0, 10)}...` : 'New Customer ID'}).
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="alex.rivera@example.com"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Delivery Address</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="124 Fashion Ave, Apt 4B, New York, NY"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Payment Method</label>
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-neutral-300">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-indigo-400" />
                        <span>Instant Card / Demo Checkout</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded">
                        Simulated
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 3: ORDER SUCCESS */}
            {checkoutStep === 'success' && (
              <div className="text-center py-10 space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <Check className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">Order Confirmed!</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Order Reference: <strong className="text-white">{orderNumber}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left font-mono text-xs space-y-2">
                  <div className="flex justify-between text-neutral-400 pb-1 border-b border-neutral-900 text-[11px]">
                    <span className="text-indigo-400 font-bold">SUPABASE STATUS</span>
                    <span className="text-emerald-400">SYNCED</span>
                  </div>
                  <div className="text-neutral-300">Customer: {customerName || 'Inspira Patron'}</div>
                  <div className="text-neutral-400 text-[11px]">Database Record: customers.id saved</div>
                  <div className="text-emerald-400 text-[11px]">Return Risk mitigated with custom biometric sizing.</div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutStep('cart');
                  }}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            )}

          </div>

          {/* Footer Pricing Summary */}
          {checkoutStep !== 'success' && items.length > 0 && (
            <div className="p-6 border-t border-neutral-800 bg-neutral-950/80 space-y-3 text-xs">
              <div className="space-y-1.5 text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-white font-semibold">
                    {shipping === 0 ? <span className="text-emerald-400">FREE</span> : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (8%)</span>
                  <span className="text-white font-semibold">{formatCurrency(tax)}</span>
                </div>
                <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold text-white">
                  <span>Total</span>
                  <span className="text-indigo-400 text-base">{formatCurrency(total)}</span>
                </div>
              </div>

              {checkoutStep === 'cart' ? (
                <button
                  onClick={() => setCheckoutStep('checkout')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="px-4 py-3 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={isProcessing}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing & Syncing to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4" />
                        <span>Place Order & Sync to Supabase</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
