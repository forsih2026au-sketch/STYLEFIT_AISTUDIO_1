import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProfileProvider } from './contexts/UserProfileContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { Header } from './components/Header';
import { IndexPage } from './pages/Index';
import { ProductDetail } from './pages/ProductDetail';
import { FitWizard } from './components/FitWizard';
import { CartDrawer } from './components/CartDrawer';
import { SupabaseDataViewer } from './components/SupabaseDataViewer';
import { FashionChatbot } from './components/FashionChatbot';
import { PRODUCTS, getProductInsertRows, type Product } from './data/products';
import { seedProductsToSupabase } from './integrations/supabase/client';
import { Sparkles, Database, ShieldCheck, Heart } from 'lucide-react';

function MainApp() {
  const [currentView, setCurrentView] = useState<'catalog' | 'detail'>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDataViewerOpen, setIsDataViewerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Background auto-seeding of initial products to Supabase if products table is unseeded
  useEffect(() => {
    const rows = getProductInsertRows();
    seedProductsToSupabase(rows).then((seeded) => {
      if (seeded) {
        console.log('ForgeInspira products synced with Supabase PostgreSQL');
      }
    });
  }, []);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setCurrentView('catalog');
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Header */}
      <Header
        onOpenDataViewer={() => setIsDataViewerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (currentView !== 'catalog') {
            setCurrentView('catalog');
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'catalog' && (
          <IndexPage
            onSelectProduct={handleSelectProduct}
            onOpenDataViewer={() => setIsDataViewerOpen(true)}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {currentView === 'detail' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onBack={handleBackToCatalog}
            onSelectProduct={handleSelectProduct}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-12 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 p-0.5">
                  <div className="w-full h-full bg-neutral-950 rounded-[6px] flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                </div>
                <span className="font-bold text-base text-white font-['Syne',sans-serif]">
                  FORGE<span className="text-indigo-400">INSPIRA</span>
                </span>
              </div>
              <p className="text-neutral-400 max-w-sm leading-relaxed text-xs">
                Intelligent biometric fashion platform engineered to eradicate sizing mismatch. Powered by modern ease calculations and real-time Supabase cloud persistence.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setIsDataViewerOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 text-indigo-300 border border-neutral-800 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Inspect Supabase Database</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">Navigation</div>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => { setSelectedCategory('all'); setCurrentView('catalog'); }} className="hover:text-white transition-colors">
                    Full Collection
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedCategory('tops'); setCurrentView('catalog'); }} className="hover:text-white transition-colors">
                    Tops & Knitwear
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedCategory('bottoms'); setCurrentView('catalog'); }} className="hover:text-white transition-colors">
                    Trousers & Bottoms
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedCategory('outerwear'); setCurrentView('catalog'); }} className="hover:text-white transition-colors">
                    Tailored Outerwear
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">Cloud Engine</div>
              <ul className="space-y-1.5 text-[11px]">
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Supabase PostgreSQL 15</span>
                </li>
                <li className="text-neutral-400">Table: customers (UUID FK)</li>
                <li className="text-neutral-400">Table: fit_analyses (Risk & Notes)</li>
                <li className="text-neutral-400">Table: products (Size Charts)</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© {new Date().getFullYear()} ForgeInspira. Built with Supabase & Google AI Studio.</p>
            <p className="flex items-center gap-1 text-neutral-500">
              Synchronized with <span className="text-indigo-400 font-mono">https://xztekegoeyyzqlnhqzrv.supabase.co</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Global Interactive Modals & Drawers */}
      <FitWizard />
      <CartDrawer />
      <SupabaseDataViewer
        isOpen={isDataViewerOpen}
        onClose={() => setIsDataViewerOpen(false)}
      />
      <FashionChatbot />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <UserProfileProvider>
          <CartProvider>
            <WishlistProvider>
              <MainApp />
            </WishlistProvider>
          </CartProvider>
        </UserProfileProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
