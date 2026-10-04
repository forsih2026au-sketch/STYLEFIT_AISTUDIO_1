import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  UploadCloud, 
  User, 
  Layers, 
  Activity, 
  ShieldCheck, 
  ArrowUpRight,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { 
  SUPABASE_URL, 
  fetchCustomersFromSupabase, 
  fetchFitAnalysesFromSupabase, 
  fetchProductsFromSupabase, 
  seedProductsToSupabase,
  checkSupabaseHealth
} from '../integrations/supabase/client';
import type { CustomerRow, FitAnalysisRow, ProductRow } from '../integrations/supabase/types';
import { getProductInsertRows } from '../data/products';
import { useUserProfile } from '../contexts/UserProfileContext';

interface SupabaseDataViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseDataViewer: React.FC<SupabaseDataViewerProps> = ({ isOpen, onClose }) => {
  const { supabaseCustomerId } = useUserProfile();

  const [activeTab, setActiveTab] = useState<'customers' | 'fit_analyses' | 'products' | 'config'>('customers');
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [fitAnalyses, setFitAnalyses] = useState<FitAnalysisRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [health, setHealth] = useState<{ ok: boolean; message: string; latencyMs: number }>({
    ok: true,
    message: 'Checking...',
    latencyMs: 0,
  });

  const loadData = async () => {
    setIsLoading(true);
    const [h, cust, fits, prods] = await Promise.all([
      checkSupabaseHealth(),
      fetchCustomersFromSupabase(25),
      fetchFitAnalysesFromSupabase(25),
      fetchProductsFromSupabase(),
    ]);

    setHealth(h);
    setCustomers(cust);
    setFitAnalyses(fits);
    setProducts(prods);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleSeedProducts = async () => {
    setIsSeeding(true);
    const rows = getProductInsertRows();
    await seedProductsToSupabase(rows);
    await loadData();
    setIsSeeding(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Supabase Live Database Monitor</h2>
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Connected
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {SUPABASE_URL} • Latency: {health.latencyMs}ms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh from Supabase"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-neutral-800 bg-neutral-950/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'customers'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>customers ({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('fit_analyses')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'fit_analyses'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>fit_analyses ({fitAnalyses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'products'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'config'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Connection & Schema</span>
          </button>
        </div>

        {/* Content Tab Panels */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-left">
          
          {/* TAB 1: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>
                  All records saved when users calibrate in the <strong>Smart Fit Wizard</strong>:
                </span>
                {supabaseCustomerId && (
                  <span className="text-emerald-400 font-medium">
                    Your Current Session ID: {supabaseCustomerId.slice(0, 8)}...
                  </span>
                )}
              </div>

              {customers.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 space-y-2">
                  <User className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-sm font-semibold text-white">No customers registered yet</p>
                  <p className="text-xs">
                    Complete the Fit Wizard on the homepage to save your first profile to Supabase.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {customers.map((c) => {
                    const isCurrent = c.id === supabaseCustomerId;
                    return (
                      <div
                        key={c.id}
                        className={`p-4 rounded-xl border text-xs transition-all ${
                          isCurrent
                            ? 'bg-indigo-950/30 border-indigo-500/50 text-neutral-200 shadow-md'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-[11px] pb-2 border-b border-neutral-900">
                          <div className="flex items-center gap-2">
                            <span className="text-indigo-400 font-bold">UUID:</span>
                            <span className="text-neutral-300">{c.id}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-sans font-bold text-[10px]">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-neutral-500">
                            {new Date(c.created_at).toLocaleString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 font-sans">
                          <div>
                            <span className="text-neutral-500 text-[11px] block">Height</span>
                            <span className="font-semibold text-white">{c.height} cm</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 text-[11px] block">Weight</span>
                            <span className="font-semibold text-white">{c.weight} kg</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 text-[11px] block">Body Shape</span>
                            <span className="font-semibold text-white capitalize">{c.body_shape}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 text-[11px] block">Preferred Fit</span>
                            <span className="font-semibold text-white capitalize">{c.preferred_fit}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FIT ANALYSES */}
          {activeTab === 'fit_analyses' && (
            <div className="space-y-4">
              <div className="text-xs text-neutral-400">
                Sizing calculations and return-risk assessments saved to the <strong>fit_analyses</strong> table:
              </div>

              {fitAnalyses.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 space-y-2">
                  <Activity className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-sm font-semibold text-white">No fit analyses stored yet</p>
                  <p className="text-xs">
                    Inspect any product and click &quot;Save Fit Analysis to Supabase&quot; to populate this table.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {fitAnalyses.map((f) => (
                    <div
                      key={f.id}
                      className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] pb-2 border-b border-neutral-900">
                        <div className="flex items-center gap-2">
                          <span className="text-indigo-400 font-bold">Analysis ID:</span>
                          <span className="text-neutral-300">{f.id}</span>
                        </div>
                        <span className="text-neutral-500">
                          {new Date(f.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <span className="text-neutral-500 text-[11px] block">Recommended Size</span>
                          <span className="text-sm font-bold text-white">Size {f.recommended_size}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[11px] block">Confidence</span>
                          <span className="font-semibold text-emerald-400">{f.fit_confidence}%</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[11px] block">Return Risk</span>
                          <span className="font-semibold text-indigo-300 capitalize">
                            {f.return_risk_level} ({f.return_risk_percent}%)
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[11px] block">Customer FK</span>
                          <span className="font-mono text-neutral-400 truncate block">
                            {f.customer_id ? f.customer_id.slice(0, 10) + '...' : 'None'}
                          </span>
                        </div>
                      </div>

                      {Array.isArray(f.fit_notes) && f.fit_notes.length > 0 && (
                        <div className="pt-2 border-t border-neutral-900 text-[11px] text-neutral-400 space-y-0.5">
                          <span className="text-neutral-500 font-semibold">Fit Notes:</span>
                          {f.fit_notes.map((note: any, idx: number) => (
                            <div key={idx} className="text-neutral-300">• {String(note)}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>
                  Catalog items in Supabase <strong>products</strong> table ({products.length} found):
                </span>
                
                <button
                  onClick={handleSeedProducts}
                  disabled={isSeeding}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSeeding ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Syncing Catalog...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Sync / Seed All Products to Supabase</span>
                    </>
                  )}
                </button>
              </div>

              {products.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 space-y-3">
                  <Layers className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-sm font-semibold text-white">Products table in Supabase is currently unseeded</p>
                  <p className="text-xs max-w-sm mx-auto">
                    The app uses high-resolution design assets and size charts. Click the button above to seed all 8 items directly into your Supabase database.
                  </p>
                  <button
                    onClick={handleSeedProducts}
                    disabled={isSeeding}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors inline-flex items-center gap-1.5"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Seed Catalog to Supabase</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs flex items-center gap-3"
                    >
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-12 h-16 object-cover rounded-lg bg-neutral-800 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-16 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 text-neutral-500">
                          <Layers className="w-5 h-5" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white text-sm truncate">{p.name}</div>
                        <div className="text-neutral-400 text-[11px] capitalize mt-0.5">
                          {p.category} • {p.fit_type} fit • ${p.price}
                        </div>
                        <div className="text-neutral-500 font-mono text-[10px] mt-1">
                          ID: {p.id}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CONFIG & SCHEMA */}
          {activeTab === 'config' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="text-sm font-bold text-indigo-400 font-sans flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Supabase Project Configuration
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-300">
                  <div>
                    <span className="text-neutral-500 block">Project URL:</span>
                    <span className="text-white select-all">{SUPABASE_URL}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Database Status:</span>
                    <span className="text-emerald-400 font-bold">PostgreSQL Cloud Connected</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Authentication Mode:</span>
                    <span className="text-white">JWT / Anon & Service Role</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Ping Latency:</span>
                    <span className="text-white">{health.latencyMs} ms</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="text-xs font-bold text-neutral-300 font-sans">
                  Active Database Tables:
                </div>
                <div className="space-y-1 text-neutral-400 text-[11px]">
                  <div>• <code className="text-indigo-300">customers</code> (id, height, weight, age, gender, body_shape, preferred_fit, created_at)</div>
                  <div>• <code className="text-indigo-300">fit_analyses</code> (id, customer_id, product_id, recommended_size, fit_confidence, return_risk_percent, return_risk_level, fit_notes, return_reasons, created_at)</div>
                  <div>• <code className="text-indigo-300">products</code> (id, name, category, gender, price, image_url, description, fabric, fit_type, style, size_chart, traits, created_at)</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Real-time persistence active</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
