import React, { useState, useMemo } from 'react';
import { HeroSection } from '../components/HeroSection';
import { FilterPanel, type FilterState } from '../components/FilterPanel';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS, type Product } from '../data/products';
import { useUserProfile } from '../contexts/UserProfileContext';
import { calculateFitRecommendation } from '../lib/fitEngine';
import { 
  Sparkles, 
  Database, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  RefreshCw,
  Sliders,
  Award
} from 'lucide-react';

interface IndexPageProps {
  onSelectProduct: (product: Product) => void;
  onOpenDataViewer: () => void;
  searchQuery: string;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const IndexPage: React.FC<IndexPageProps> = ({
  onSelectProduct,
  onOpenDataViewer,
  searchQuery,
  selectedCategory,
  onSelectCategory,
}) => {
  const { profile, hasProfile, openFitWizard, isSynced, supabaseCustomerId } = useUserProfile();

  const [filters, setFilters] = useState<FilterState>({
    category: selectedCategory || 'all',
    gender: 'all',
    fitType: 'all',
    sortBy: 'featured',
    fitForMeOnly: false,
  });

  // Keep synced with header selectedCategory
  React.useEffect(() => {
    setFilters((prev) => ({ ...prev, category: selectedCategory }));
  }, [selectedCategory]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    if (newFilters.category !== selectedCategory) {
      onSelectCategory(newFilters.category);
    }
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter
      if (filters.category !== 'all' && p.category !== filters.category) {
        return false;
      }
      // Gender filter
      if (filters.gender !== 'all') {
        if (filters.gender === 'unisex' && p.gender !== 'unisex') return false;
        if (filters.gender === 'men' && p.gender !== 'men' && p.gender !== 'unisex') return false;
        if (filters.gender === 'women' && p.gender !== 'women' && p.gender !== 'unisex') return false;
      }
      // Fit Type filter
      if (filters.fitType !== 'all' && p.fit_type !== filters.fitType) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        const matchFabric = p.fabric.toLowerCase().includes(query);
        const matchStyle = p.style.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchFabric && !matchStyle) return false;
      }
      // "Fit For Me" filter: only keep items with high confidence (> 85%) and low return risk
      if (filters.fitForMeOnly && hasProfile) {
        const rec = calculateFitRecommendation(profile, p);
        if (rec.confidence < 85 || rec.returnRiskLevel === 'high') return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [filters, searchQuery, hasProfile, profile]);

  return (
    <div className="space-y-12 pb-20">
      
      {/* Editorial Hero */}
      <HeroSection
        onExploreClick={() => {
          const el = document.getElementById('catalog-grid');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenDataViewer={onOpenDataViewer}
      />

      {/* Main Catalog Section */}
      <div id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          totalProducts={filteredProducts.length}
        />

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
            <Sparkles className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No pieces match your filters</h3>
            <p className="text-xs text-neutral-400">
              Try adjusting your category, fit preference, or search terms.
            </p>
            <button
              onClick={() =>
                handleFilterChange({
                  category: 'all',
                  gender: 'all',
                  fitType: 'all',
                  sortBy: 'featured',
                  fitForMeOnly: false,
                })
              }
              className="px-4 py-2 rounded-xl bg-neutral-800 text-xs text-white font-semibold hover:bg-neutral-700"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenProductDetail={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sizing Innovation / Supabase Integration Feature Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-neutral-900 to-purple-950 border border-indigo-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-400/40 text-xs font-semibold text-indigo-300">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Supabase PostgreSQL Integration</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Syne',sans-serif]">
                Your Biometric Profile, Always Synchronized.
              </h2>

              <p className="text-sm text-neutral-300 max-w-xl leading-relaxed">
                When you input measurements in ForgeInspira, your exact data is stored directly in your connected Supabase PostgreSQL instance under <code className="text-indigo-300 font-mono">customers</code> and <code className="text-indigo-300 font-mono">fit_analyses</code>. Inspect records anytime with zero delays.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={onOpenDataViewer}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <Database className="w-4 h-4" />
                  <span>Inspect Live Supabase Records</span>
                </button>

                <button
                  onClick={openFitWizard}
                  className="px-5 py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 hover:text-white font-semibold text-xs border border-neutral-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span>{hasProfile ? 'Edit Saved Profile' : 'Calibrate Profile Now'}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-neutral-950/80 rounded-2xl p-5 border border-neutral-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-neutral-500 pb-2 border-b border-neutral-900">
                <span className="text-indigo-400 font-bold">DATABASE SCHEMA</span>
                <span className="text-emerald-400">ONLINE</span>
              </div>
              <div className="space-y-1 text-neutral-300 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-neutral-500">public.customers:</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">public.fit_analyses:</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">public.products:</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </div>
              </div>
              <div className="pt-2 border-t border-neutral-900 text-[10px] text-neutral-500">
                Connected via Supabase JS SDK & REST API
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
