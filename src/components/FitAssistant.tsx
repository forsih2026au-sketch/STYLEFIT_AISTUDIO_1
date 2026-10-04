import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  ShieldCheck, 
  Ruler, 
  Info,
  Check,
  ChevronRight,
  Loader2
} from 'lucide-react';
import type { Product } from '../data/products';
import { useUserProfile } from '../contexts/UserProfileContext';
import { calculateFitRecommendation, estimateBodyCircumferences } from '../lib/fitEngine';

interface FitAssistantProps {
  product: Product;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  compact?: boolean;
}

export const FitAssistant: React.FC<FitAssistantProps> = ({
  product,
  selectedSize,
  onSelectSize,
  compact = false,
}) => {
  const { profile, hasProfile, openFitWizard, recordProductAnalysis } = useUserProfile();
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const recommendation = calculateFitRecommendation(profile, product);
  const body = estimateBodyCircumferences(profile);
  const chosenGarment = product.size_chart[selectedSize] || product.size_chart[recommendation.recommendedSize];

  const handleSaveToSupabase = async () => {
    setIsSavingToDb(true);
    const success = await recordProductAnalysis(product, recommendation);
    setIsSavingToDb(false);
    if (success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  if (!hasProfile) {
    return (
      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-neutral-900 to-neutral-900 border border-indigo-500/30 text-left space-y-3">
        <div className="flex items-center gap-2 text-indigo-400">
          <Sparkles className="w-4 h-4" />
          <h4 className="text-sm font-bold text-white">Smart Fit Recommendation</h4>
        </div>
        <p className="text-xs text-neutral-300">
          Calibrate your body measurements in 30 seconds to unlock centimeter-accurate size recommendations and store them in Supabase.
        </p>
        <button
          onClick={openFitWizard}
          className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <span>Calculate My Size</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const isRecommended = selectedSize === recommendation.recommendedSize;

  return (
    <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4 text-left">
      {/* Top recommendation summary header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Fit Engine Recommendation
            </span>
          </div>

          <div className="text-lg font-extrabold text-white mt-0.5 flex items-center gap-2">
            <span>Size {recommendation.recommendedSize}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60">
              {recommendation.confidence}% Match
            </span>
          </div>
        </div>

        {/* Return risk meter */}
        <div className="text-right">
          <div className="text-[11px] text-neutral-400">Return Risk</div>
          <div className={`text-xs font-bold capitalize flex items-center gap-1 justify-end ${
            recommendation.returnRiskLevel === 'low' ? 'text-emerald-400' :
            recommendation.returnRiskLevel === 'medium' ? 'text-amber-400' : 'text-rose-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              recommendation.returnRiskLevel === 'low' ? 'bg-emerald-500' :
              recommendation.returnRiskLevel === 'medium' ? 'bg-amber-500' : 'bg-rose-500'
            }`}></span>
            <span>{recommendation.returnRiskLevel} ({recommendation.returnRiskPercent}%)</span>
          </div>
        </div>
      </div>

      {/* Size selector buttons with match indicator */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-neutral-400">Available Sizes</span>
          {isRecommended ? (
            <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Recommended size selected
            </span>
          ) : (
            <button
              onClick={() => onSelectSize(recommendation.recommendedSize)}
              className="text-indigo-400 hover:text-indigo-300 text-[11px] font-semibold underline"
            >
              Switch to Recommended (Size {recommendation.recommendedSize})
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => {
            const isRec = s === recommendation.recommendedSize;
            const isSel = s === selectedSize;
            return (
              <button
                key={s}
                onClick={() => onSelectSize(s)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  isSel
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                {s}
                {isRec && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-neutral-900 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {!compact && (
        <>
          {/* Fit alignment gauge bars */}
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2.5 text-xs">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Anatomical Clearance (Size {selectedSize})
            </div>

            {/* Chest or Waist clearance */}
            {product.category !== 'bottoms' && chosenGarment && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Chest Ease:</span>
                <span className="font-semibold text-white">
                  {chosenGarment.chest}cm garment vs {body.chest}cm body (
                  <span className="text-emerald-400">+{chosenGarment.chest - body.chest}cm</span>)
                </span>
              </div>
            )}

            {chosenGarment && chosenGarment.waist > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Waist Ease:</span>
                <span className="font-semibold text-white">
                  {chosenGarment.waist}cm garment vs {body.waist}cm body (
                  <span className="text-emerald-400">+{chosenGarment.waist - body.waist}cm</span>)
                </span>
              </div>
            )}

            {chosenGarment && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Garment Length:</span>
                <span className="font-semibold text-white">{chosenGarment.length}cm</span>
              </div>
            )}
          </div>

          {/* Fit Notes */}
          {recommendation.fitNotes.length > 0 && (
            <div className="space-y-1 text-xs">
              {recommendation.fitNotes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-2 text-neutral-300">
                  <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{note}</span>
                </div>
              ))}
            </div>
          )}

          {/* Return Advisories if any */}
          {recommendation.returnReasons.length > 0 && (
            <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>{recommendation.returnReasons[0]}</span>
            </div>
          )}

          {/* Supabase Save Fit Analysis Action */}
          <div className="pt-1">
            <button
              onClick={handleSaveToSupabase}
              disabled={isSavingToDb}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                savedSuccess
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600'
                  : 'bg-neutral-800 hover:bg-neutral-750 text-indigo-300 border-indigo-500/20 hover:border-indigo-500/40 cursor-pointer'
              }`}
            >
              {isSavingToDb ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Syncing to Supabase fit_analyses...</span>
                </>
              ) : savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Analysis Stored in Supabase!</span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Save Fit Analysis to Supabase</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
