import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Heart, 
  ShoppingBag, 
  Ruler, 
  ShieldCheck, 
  Check, 
  Layers, 
  RefreshCw, 
  Share2,
  Table
} from 'lucide-react';
import type { Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { FitAssistant } from '../components/FitAssistant';
import { calculateFitRecommendation } from '../lib/fitEngine';
import { formatCurrency } from '../lib/utils';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { profile, hasProfile, openFitWizard } = useUserProfile();

  const [activeImage, setActiveImage] = useState<string>(product.image_url);
  const [selectedSize, setSelectedSize] = useState<string>(() => {
    if (hasProfile) {
      const rec = calculateFitRecommendation(profile, product);
      return rec.recommendedSize;
    }
    return product.sizes[0] || 'M';
  });

  const [quantity, setQuantity] = useState(1);
  const [showSizeChartModal, setShowSizeChartModal] = useState(false);
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  const isWish = isInWishlist(product.id);
  const recommendation = hasProfile ? calculateFitRecommendation(profile, product) : null;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedSize === recommendation?.recommendedSize);
    setIsAddedSuccess(true);
    setTimeout(() => setIsAddedSuccess(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-left">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Full Collection</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image Gallery (col 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-xl">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.badges.map((b, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-950/80 backdrop-blur-md text-white border border-neutral-700"
                >
                  {b}
                </span>
              ))}
            </div>

            {/* Wishlist button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md border transition-all ${
                isWish
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-neutral-950/60 text-neutral-300 border-neutral-700 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWish ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnail switcher */}
          {product.secondary_image && (
            <div className="flex gap-3">
              <button
                onClick={() => setActiveImage(product.image_url)}
                className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === product.image_url
                    ? 'border-indigo-500 shadow-md shadow-indigo-500/20'
                    : 'border-neutral-800 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={product.image_url} alt="" className="w-full h-full object-cover" />
              </button>
              <button
                onClick={() => setActiveImage(product.secondary_image!)}
                className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === product.secondary_image
                    ? 'border-indigo-500 shadow-md shadow-indigo-500/20'
                    : 'border-neutral-800 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={product.secondary_image} alt="" className="w-full h-full object-cover" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Product Details & Fit Assistant (col 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-1 flex items-center justify-between">
              <span>{product.category} • {product.fit_type} Fit</span>
              <span className="text-neutral-400 font-mono text-[11px]">ID: {product.id}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Syne',sans-serif]">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-2xl font-black text-white">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-neutral-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                In Stock & Ready to Ship
              </span>
            </div>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed">
            {product.description}
          </p>

          {/* Color swatches */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
              Color Palette
            </span>
            <div className="flex items-center gap-2">
              {product.colors.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-neutral-700 shadow-inner"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SMART FIT ASSISTANT COMPONENT */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Sizing & Virtual Fit Assistant
              </span>

              <button
                onClick={() => setShowSizeChartModal(true)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 underline"
              >
                <Table className="w-3.5 h-3.5" />
                <span>Size Chart</span>
              </button>
            </div>

            <FitAssistant
              product={product}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />
          </div>

          {/* Quantity and Add to Bag */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <div className="flex items-center border border-neutral-800 rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 text-neutral-400 hover:text-white"
                >
                  -
                </button>
                <span className="px-3 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 text-neutral-400 hover:text-white"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {isAddedSuccess
                    ? 'Added to Shopping Bag!'
                    : `Add to Bag • ${formatCurrency(product.price * quantity)}`}
                </span>
              </button>
            </div>
          </div>

          {/* Fabric Specifications Card */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Fabric & Composition
            </h4>

            <div className="grid grid-cols-2 gap-2 text-neutral-300">
              <div>
                <span className="text-neutral-500 block text-[11px]">Material</span>
                <span className="font-semibold text-white">{product.fabric}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Stretch Factor</span>
                <span className="font-semibold text-white capitalize">{product.traits.stretch} Stretch</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Weight Profile</span>
                <span className="font-semibold text-white capitalize">{product.traits.weight} Weight</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Care Standard</span>
                <span className="font-semibold text-white">{product.traits.care}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Size Chart Modal */}
      {showSizeChartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-white">Garment Size Specifications</h3>
                <p className="text-xs text-neutral-400">{product.name} (Measurements in centimeters)</p>
              </div>
              <button
                onClick={() => setShowSizeChartModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[11px]">
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Chest (cm)</th>
                    <th className="py-2.5 px-3">Waist (cm)</th>
                    <th className="py-2.5 px-3">Hips (cm)</th>
                    <th className="py-2.5 px-3">Length (cm)</th>
                    <th className="py-2.5 px-3">Sleeve (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {Object.entries(product.size_chart).map(([sz, meas]) => {
                    const isRec = recommendation?.recommendedSize === sz;
                    return (
                      <tr
                        key={sz}
                        className={`hover:bg-neutral-800/40 ${
                          isRec ? 'bg-indigo-950/40 text-indigo-300 font-bold' : 'text-neutral-200'
                        }`}
                      >
                        <td className="py-2.5 px-3 flex items-center gap-1.5">
                          <span>{sz}</span>
                          {isRec && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                              Your Size
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">{meas.chest > 0 ? meas.chest : '-'}</td>
                        <td className="py-2.5 px-3">{meas.waist > 0 ? meas.waist : '-'}</td>
                        <td className="py-2.5 px-3">{meas.hips > 0 ? meas.hips : '-'}</td>
                        <td className="py-2.5 px-3">{meas.length}</td>
                        <td className="py-2.5 px-3">{meas.sleeve || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowSizeChartModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white"
              >
                Close Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
