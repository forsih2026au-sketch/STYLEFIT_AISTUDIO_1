import React, { createContext, useContext, useEffect, useState } from 'react';
import { saveCustomerToSupabase, saveFitAnalysisToSupabase } from '../integrations/supabase/client';
import type { CustomerRow } from '../integrations/supabase/types';
import type { UserMeasurements, FitRecommendation } from '../lib/fitEngine';
import type { Product } from '../data/products';

export interface UserProfile extends UserMeasurements {
  id?: string;
  name?: string;
  email?: string;
  unit: 'metric' | 'imperial';
}

interface UserProfileContextType {
  profile: UserProfile;
  hasProfile: boolean;
  supabaseCustomerId: string | null;
  isSyncing: boolean;
  isSynced: boolean;
  lastSyncedAt: string | null;
  syncError: string | null;
  updateProfile: (updates: Partial<UserProfile>, syncImmediately?: boolean) => Promise<CustomerRow | null>;
  recordProductAnalysis: (product: Product, recommendation: FitRecommendation) => Promise<boolean>;
  openFitWizard: () => void;
  closeFitWizard: () => void;
  isFitWizardOpen: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  height: 175,
  weight: 70,
  age: 26,
  gender: 'unisex',
  bodyShape: 'athletic',
  preferredFit: 'regular',
  unit: 'metric',
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('inspira-user-profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed parsing saved profile', e);
    }
    return DEFAULT_PROFILE;
  });

  const [hasProfile, setHasProfile] = useState<boolean>(() => {
    return localStorage.getItem('inspira-has-profile') === 'true';
  });

  const [supabaseCustomerId, setSupabaseCustomerId] = useState<string | null>(() => {
    return localStorage.getItem('inspira-supabase-customer-id');
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isSynced, setIsSynced] = useState<boolean>(() => {
    return !!localStorage.getItem('inspira-supabase-customer-id');
  });
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(() => {
    return localStorage.getItem('inspira-last-synced-at');
  });
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isFitWizardOpen, setIsFitWizardOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('inspira-user-profile', JSON.stringify(profile));
  }, [profile]);

  /**
   * Update profile and automatically persist data to Supabase `customers` table!
   */
  const updateProfile = async (
    updates: Partial<UserProfile>,
    syncImmediately: boolean = true
  ): Promise<CustomerRow | null> => {
    const updated: UserProfile = { ...profile, ...updates };
    setProfile(updated);
    setHasProfile(true);
    localStorage.setItem('inspira-has-profile', 'true');

    if (!syncImmediately) {
      return null;
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      // Height in cm and weight in kg
      const heightInCm = updated.unit === 'imperial' 
        ? Math.round(updated.height * 2.54)
        : Math.round(updated.height);
      const weightInKg = updated.unit === 'imperial'
        ? Math.round(updated.weight * 0.453592)
        : Math.round(updated.weight);

      const { data, error } = await saveCustomerToSupabase({
        height: heightInCm,
        weight: weightInKg,
        age: updated.age || 25,
        gender: updated.gender || 'unisex',
        body_shape: updated.bodyShape || 'athletic',
        preferred_fit: updated.preferredFit || 'regular',
      });

      if (error) {
        setSyncError(error.message || 'Failed saving to Supabase');
        setIsSynced(false);
        setIsSyncing(false);
        return null;
      }

      if (data) {
        setSupabaseCustomerId(data.id);
        localStorage.setItem('inspira-supabase-customer-id', data.id);
        const timestamp = new Date().toISOString();
        setLastSyncedAt(timestamp);
        localStorage.setItem('inspira-last-synced-at', timestamp);
        setIsSynced(true);
        setIsSyncing(false);
        return data;
      }

      setIsSyncing(false);
      return null;
    } catch (err: any) {
      setSyncError(err?.message || 'Error syncing data');
      setIsSyncing(false);
      return null;
    }
  };

  /**
   * Record product sizing analysis to Supabase `fit_analyses` table
   */
  const recordProductAnalysis = async (
    product: Product,
    recommendation: FitRecommendation
  ): Promise<boolean> => {
    let customerId = supabaseCustomerId;

    // If customer doesn't have an ID in Supabase yet, save customer profile first!
    if (!customerId) {
      const savedCustomer = await updateProfile(profile, true);
      if (savedCustomer) {
        customerId = savedCustomer.id;
      }
    }

    if (!customerId) {
      console.warn('Cannot record fit analysis without a customer ID');
      return false;
    }

    try {
      const { data, error } = await saveFitAnalysisToSupabase({
        customer_id: customerId,
        product_id: product.id,
        recommended_size: recommendation.recommendedSize,
        fit_confidence: recommendation.confidence,
        return_risk_percent: recommendation.returnRiskPercent,
        return_risk_level: recommendation.returnRiskLevel,
        fit_notes: recommendation.fitNotes,
        return_reasons: recommendation.returnReasons,
      });

      if (error) {
        console.error('Fit analysis save error:', error);
        return false;
      }
      return !!data;
    } catch (err) {
      console.error('Failed saving fit analysis:', err);
      return false;
    }
  };

  const openFitWizard = () => setIsFitWizardOpen(true);
  const closeFitWizard = () => setIsFitWizardOpen(false);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        hasProfile,
        supabaseCustomerId,
        isSyncing,
        isSynced,
        lastSyncedAt,
        syncError,
        updateProfile,
        recordProductAnalysis,
        openFitWizard,
        closeFitWizard,
        isFitWizardOpen,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
