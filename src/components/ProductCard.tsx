import React, { useState } from 'react';
import { Sparkles, Heart, ShoppingBag, Eye, Check, ShieldAlert } from 'lucide-react';
import type { Product } from '../data/products';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { calculateFitRecommendation } from '../lib/fitEngine';
import { formatCurrency } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onOpenProductDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenProductDetail }) => {
  const { profile, hasProfile } = useUserProfile();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [isHovered, setIsHovered] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const recommendation = hasProfile ? calculateFitRecommendation(profile, product) : null;
  const isWish = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const sizeToUse = recommendation ? recommendation.recommendedSize : product.sizes[0];
    addToCart(product, sizeToUse, !!recommendation);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  return (
    <div
      onClick={() => onOpenProductDetail(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 overflow-hidden transition-all duration-300 flex flex-col cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
        <img
          src={isHovered && product.secondary_image ? product.secondary_image : product.image_url}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-all duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badges.slice(0, 2).map((badge, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-neutral-950/80 backdrop-blur-md text-neutral-200 border border-neutral-700/60"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all z-10 ${
            isWish
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              : 'bg-neutral-950/60 text-neutral-300 border-neutral-700 hover:text-white hover:bg-neutral-900'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWish ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Live Fit Match Pill (if user has profile) */}
        {recommendation && (
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <div className="px-3 py-1.5 rounded-xl bg-neutral-950/90 backdrop-blur-md border border-indigo-500/40 text-neutral-200 shadow-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-bold text-white">Size {recommendation.recommendedSize}</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
                {recommendation.confidence}% Fit
              </span>
            </div>
          </div>
        )}

        {/* Quick action overlay on desktop hover if no profile */}
        {!recommendation && (
          <div className="absolute bottom-3 left-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleQuickAdd}
              className="w-full py-2 px-3 rounded-xl bg-neutral-950/90 hover:bg-indigo-600 backdrop-blur-md border border-neutral-700 hover:border-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-lg"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{addedAnim ? 'Added to Bag!' : 'Quick Add'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between text-[11px] text-neutral-400 uppercase tracking-wider">
            <span>{product.category}</span>
            <span className="capitalize">{product.fit_type} Fit</span>
          </div>

          <h3 className="font-bold text-sm text-neutral-100 group-hover:text-indigo-400 transition-colors line-clamp-1 mt-0.5">
            {product.name}
          </h3>

          <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
            {product.fabric}
          </p>
        </div>

        {/* Sizes & Price */}
        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-white">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-500 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-medium">
            {product.sizes.slice(0, 4).map((s) => (
              <span
                key={s}
                className={`px-1.5 py-0.5 rounded ${
                  recommendation?.recommendedSize === s
                    ? 'bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/40'
                    : 'bg-neutral-800/60'
                }`}
              >
                {s}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-neutral-500">+{product.sizes.length - 4}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
