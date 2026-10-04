import React from 'react';
import { SlidersHorizontal, Sparkles, X, Check } from 'lucide-react';
import { useUserProfile } from '../contexts/UserProfileContext';

export interface FilterState {
  category: string;
  gender: string;
  fitType: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  fitForMeOnly: boolean;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalProducts: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  totalProducts,
}) => {
  const { hasProfile, openFitWizard } = useUserProfile();

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'tops', label: 'Tops' },
    { id: 'bottoms', label: 'Bottoms' },
    { id: 'outerwear', label: 'Outerwear' },
    { id: 'streetwear', label: 'Streetwear' },
    { id: 'dresses', label: 'Dresses' },
  ];

  const fitTypes = [
    { id: 'all', label: 'All Fits' },
    { id: 'slim', label: 'Slim' },
    { id: 'regular', label: 'Regular' },
    { id: 'relaxed', label: 'Relaxed' },
    { id: 'oversized', label: 'Oversized' },
  ];

  const genders = [
    { id: 'all', label: 'All Genders' },
    { id: 'unisex', label: 'Unisex' },
    { id: 'men', label: 'Men' },
    { id: 'women', label: 'Women' },
  ];

  return (
    <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-bold text-white uppercase tracking-wider">Refine Catalog</span>
          <span className="text-xs text-neutral-400">({totalProducts} pieces)</span>
        </div>

        {/* Smart "Fit For Me" Filter Toggle */}
        <div className="flex items-center gap-2">
          {hasProfile ? (
            <button
              onClick={() =>
                onFilterChange({ ...filters, fitForMeOnly: !filters.fitForMeOnly })
              }
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                filters.fitForMeOnly
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                  : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:border-neutral-600'
              }`}
            >
              <Sparkles className="w-3 h-3 text-indigo-300" />
              <span>Calibrated For Me</span>
              {filters.fitForMeOnly && <Check className="w-3 h-3" />}
            </button>
          ) : (
            <button
              onClick={openFitWizard}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-950/40 px-2.5 py-1 rounded-full border border-indigo-800/40"
            >
              <Sparkles className="w-3 h-3" />
              <span>Enable &quot;Fit For Me&quot;</span>
            </button>
          )}

          {/* Sort By Dropdown */}
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({ ...filters, sortBy: e.target.value as any })
            }
            className="bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Filter Row: Category + Gender + FitType Pills */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        
        {/* Categories */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ ...filters, category: cat.id })}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filters.category === cat.id
                  ? 'bg-neutral-200 text-neutral-900 font-semibold shadow-sm'
                  : 'bg-neutral-800/60 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Fit Type & Gender */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-neutral-500 font-medium mr-1">Fit:</span>
            {fitTypes.map((fit) => (
              <button
                key={fit.id}
                onClick={() => onFilterChange({ ...filters, fitType: fit.id })}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  filters.fitType === fit.id
                    ? 'bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/40'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {fit.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-neutral-500 font-medium mr-1">Gender:</span>
            {genders.map((g) => (
              <button
                key={g.id}
                onClick={() => onFilterChange({ ...filters, gender: g.id })}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  filters.gender === g.id
                    ? 'bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/40'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
