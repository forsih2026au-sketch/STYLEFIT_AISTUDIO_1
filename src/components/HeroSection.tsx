import React from 'react';
import { Sparkles, Sliders, ShieldCheck, ArrowRight, Database, RefreshCw, Check } from 'lucide-react';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroSectionProps {
  onExploreClick: () => void;
  onOpenDataViewer: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick, onOpenDataViewer }) => {
  const { profile, hasProfile, isSynced, openFitWizard, supabaseCustomerId } = useUserProfile();
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden bg-neutral-950 border-b border-neutral-800 py-12 lg:py-20">
      {/* Background ambient decorative glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-900/30 via-violet-800/20 to-pink-800/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -top-10 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline and Call-to-actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700/80 text-xs font-medium text-neutral-300 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span>Next-Gen Body Fit Intelligence</span>
              <span className="text-neutral-500">•</span>
              <span className="text-indigo-400 font-semibold">Supabase Powered</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-['Syne',sans-serif]">
              Precision Fit. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                Zero Guesswork.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Every body is unique. Input your height, weight, and silhouette to compute true ease allowances across luxury garments — all saved permanently to your Supabase PostgreSQL database.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={openFitWizard}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Sliders className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                <span>{hasProfile ? 'Adjust Body Profile' : 'Calibrate My Size (30s)'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white font-semibold text-sm border border-neutral-700/80 hover:border-neutral-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Curated Pieces</span>
              </button>
            </div>

            {/* Live profile status banner */}
            {hasProfile && (
              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-emerald-500/30 flex items-center justify-between text-xs text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>Body Profile Active</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Supabase Synced
                      </span>
                    </div>
                    <p className="text-neutral-400 text-[11px]">
                      {profile.height}cm • {profile.weight}kg • {profile.bodyShape} shape • {profile.preferredFit} fit
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenDataViewer}
                  className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 text-[11px] underline"
                >
                  <Database className="w-3 h-3" />
                  <span>Inspect DB Record</span>
                </button>
              </div>
            )}

            {/* Trust counters */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-800/80 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">98.4%</div>
                <div className="text-xs text-neutral-400 font-medium">Fit Sizing Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">-73%</div>
                <div className="text-xs text-neutral-400 font-medium">Garment Return Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400 tracking-tight flex items-center gap-1 justify-center lg:justify-start">
                  <span>Live</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div className="text-xs text-neutral-400 font-medium">Supabase Sync</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Fit Calibration Card */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl p-6 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-neutral-800 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                    AI
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Biometric Sizing Engine</h3>
                    <p className="text-[11px] text-neutral-400">PostgreSQL Data Pipeline</p>
                  </div>
                </div>
                <button
                  onClick={onOpenDataViewer}
                  className="px-2.5 py-1 rounded-md bg-neutral-800 text-[11px] text-indigo-300 font-medium hover:bg-neutral-700 flex items-center gap-1 border border-neutral-700"
                >
                  <Database className="w-3 h-3 text-indigo-400" />
                  <span>Supabase</span>
                </button>
              </div>

              {/* Sizing Visualization simulation */}
              <div className="py-5 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Target Ease Clearance</span>
                  <span className="font-semibold text-indigo-400">+4.5 cm (Optimal)</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>Chest Circumference</span>
                    <span className="text-white font-medium">{hasProfile ? `${Math.round(profile.height * 0.53)} cm` : '96 cm'}</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-[78%] rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>Waist Alignment</span>
                    <span className="text-white font-medium">{hasProfile ? `${Math.round(profile.height * 0.44)} cm` : '80 cm'}</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full w-[65%] rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>Torso & Sleeve Proportions</span>
                    <span className="text-white font-medium">{hasProfile ? `${profile.height} cm` : '175 cm'}</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-full w-[84%] rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Supabase record info preview */}
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 font-mono text-[11px] text-neutral-400">
                <div className="flex items-center justify-between text-neutral-500 pb-1 mb-1 border-b border-neutral-900">
                  <span>TABLE: customers</span>
                  <span className="text-emerald-400">STATUS: 200 OK</span>
                </div>
                <div className="text-neutral-300">
                  customer_id: <span className="text-indigo-400">{supabaseCustomerId ? `"${supabaseCustomerId.slice(0, 18)}..."` : 'Auto-assigned on calibrate'}</span>
                </div>
                <div>
                  fit_confidence: <span className="text-emerald-400">96.8%</span> | return_risk: <span className="text-indigo-300">low</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={openFitWizard}
                  className="w-full py-2.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold text-xs border border-indigo-500/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{hasProfile ? 'Update Measurements in Supabase' : 'Open 30s Fit Calibration Wizard'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
