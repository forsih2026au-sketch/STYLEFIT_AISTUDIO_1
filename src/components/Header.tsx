import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Sun, 
  Moon, 
  Database, 
  CheckCircle2, 
  Sliders, 
  Languages, 
  X,
  Menu,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, type Language } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { checkSupabaseHealth } from '../integrations/supabase/client';

interface HeaderProps {
  onOpenDataViewer: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDataViewer,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { hasProfile, isSynced, openFitWizard, supabaseCustomerId } = useUserProfile();

  const [dbStatus, setDbStatus] = useState<{ ok: boolean; latency: number }>({ ok: true, latency: 120 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    checkSupabaseHealth().then((res) => {
      setDbStatus({ ok: res.ok, latency: res.latencyMs });
    });
    const interval = setInterval(() => {
      checkSupabaseHealth().then((res) => {
        setDbStatus({ ok: res.ok, latency: res.latencyMs });
      });
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-neutral-900/85 border-b border-neutral-800 text-neutral-100 transition-colors">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-violet-950 via-neutral-900 to-indigo-950 py-1 px-4 text-xs font-medium text-neutral-300 border-b border-neutral-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-semibold">Supabase Connected:</span>
          <span className="hidden sm:inline text-neutral-400">PostgreSQL Cloud Database Live ({dbStatus.latency}ms)</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenDataViewer}
            className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-indigo-200 transition-colors bg-indigo-950/60 hover:bg-indigo-900/60 px-2.5 py-0.5 rounded-full border border-indigo-700/50"
          >
            <Database className="w-3 h-3 text-indigo-400" />
            <span>Inspect Supabase Data</span>
            {isSynced && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            )}
          </button>

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1 text-neutral-300 hover:text-white transition-colors"
            >
              <Languages className="w-3.5 h-3.5" />
              <span className="uppercase text-[11px] font-semibold">{language}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl py-1 z-50">
                {languagesList.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-neutral-800 transition-colors ${
                      language === item.code ? 'text-indigo-400 font-semibold bg-neutral-800/50' : 'text-neutral-300'
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onSelectCategory('all')} 
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-['Syne',sans-serif]">
                FORGE<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">INSPIRA</span>
              </div>
              <p className="text-[10px] text-neutral-400 font-medium tracking-widest uppercase">Smart Fit • Supabase</p>
            </div>
          </button>

          {/* Desktop Category links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'all', label: 'All Catalog' },
              { id: 'tops', label: 'Tops' },
              { id: 'bottoms', label: 'Bottoms' },
              { id: 'outerwear', label: 'Outerwear' },
              { id: 'streetwear', label: 'Streetwear' },
              { id: 'dresses', label: 'Dresses' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-neutral-800 text-white shadow-inner font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Center search bar (desktop) */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search fabrics, fit, styles..."
            className="w-full pl-9 pr-8 py-1.5 rounded-full bg-neutral-800/80 border border-neutral-700/80 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 text-neutral-400 hover:text-neutral-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search toggle */}
          <button
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Virtual Fit Assistant Wizard Button */}
          <button
            onClick={openFitWizard}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              hasProfile
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/50'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-400/40 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/30'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {hasProfile ? 'My Body Profile' : 'Smart Fit Wizard'}
            </span>
            {hasProfile && (
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-indigo-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-neutral-900 animate-in zoom-in">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search bar dropdown */}
      {isSearchVisible && (
        <div className="lg:hidden px-4 pb-3 pt-1 border-t border-neutral-800 bg-neutral-900">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search garments, styles..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile navigation menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-900 px-4 py-4 space-y-2">
          <div className="text-xs uppercase font-semibold text-neutral-500 mb-1">Categories</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'all', label: 'All Catalog' },
              { id: 'tops', label: 'Tops' },
              { id: 'bottoms', label: 'Bottoms' },
              { id: 'outerwear', label: 'Outerwear' },
              { id: 'streetwear', label: 'Streetwear' },
              { id: 'dresses', label: 'Dresses' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-left text-sm ${
                  selectedCategory === cat.id ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenDataViewer();
                setIsMobileMenuOpen(false);
              }}
              className="text-xs text-indigo-400 flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Inspect Supabase Database</span>
            </button>
            <span className="text-xs text-neutral-400">
              {supabaseCustomerId ? `ID: ${supabaseCustomerId.slice(0, 8)}...` : 'Not calibrated'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
