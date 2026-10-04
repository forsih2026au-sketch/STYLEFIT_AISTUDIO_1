import { createClient } from '@supabase/supabase-js';
import type { Database, CustomerInsert, CustomerRow, FitAnalysisInsert, FitAnalysisRow, ProductInsert, ProductRow } from './types';

export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 'https://xztekegoeyyzqlnhqzrv.supabase.co';

export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6dGVrZWdvZXl5enFsbmhxenJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMTc1MDMsImV4cCI6MjEwNjY5MzUwM30.sJ6fZM-urYf8oCxlLZYgS9lNlpDzAygPw94fu7wR4Yw';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Checks connection health to Supabase
 */
export async function checkSupabaseHealth(): Promise<{ ok: boolean; message: string; latencyMs: number }> {
  const start = performance.now();
  try {
    const { error } = await supabase.from('products').select('id').limit(1);
    const latency = Math.round(performance.now() - start);
    if (error) {
      return { ok: false, message: error.message, latencyMs: latency };
    }
    return { ok: true, message: 'Connected to Supabase PostgreSQL', latencyMs: latency };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Connection failed', latencyMs: Math.round(performance.now() - start) };
  }
}

/**
 * Saves customer body measurements profile to Supabase `customers` table
 */
export async function saveCustomerToSupabase(customer: CustomerInsert): Promise<{ data: CustomerRow | null; error: any }> {
  try {
    const insertPayload: CustomerInsert = {
      height: Number(customer.height),
      weight: Number(customer.weight),
      age: Number(customer.age) || 25,
      gender: customer.gender || 'unisex',
      body_shape: customer.body_shape || 'regular',
      preferred_fit: customer.preferred_fit || 'regular',
    };

    const { data, error } = await supabase
      .from('customers')
      .insert(insertPayload as any)
      .select()
      .single();

    if (error) {
      console.error('Error saving customer to Supabase:', error);
      return { data: null, error };
    }
    return { data: data as CustomerRow, error: null };
  } catch (err: any) {
    console.error('Exception saving customer to Supabase:', err);
    return { data: null, error: err };
  }
}

/**
 * Saves fit analysis recommendation to Supabase `fit_analyses` table
 */
export async function saveFitAnalysisToSupabase(analysis: FitAnalysisInsert): Promise<{ data: FitAnalysisRow | null; error: any }> {
  try {
    const insertPayload: FitAnalysisInsert = {
      customer_id: analysis.customer_id,
      product_id: analysis.product_id || null,
      recommended_size: analysis.recommended_size,
      fit_confidence: Number(analysis.fit_confidence),
      return_risk_percent: Number(analysis.return_risk_percent),
      return_risk_level: analysis.return_risk_level,
      fit_notes: analysis.fit_notes || [],
      return_reasons: analysis.return_reasons || [],
    };

    const { data, error } = await supabase
      .from('fit_analyses')
      .insert(insertPayload as any)
      .select()
      .single();

    if (error) {
      console.error('Error saving fit analysis to Supabase:', error);
      return { data: null, error };
    }
    return { data: data as FitAnalysisRow, error: null };
  } catch (err: any) {
    console.error('Exception saving fit analysis to Supabase:', err);
    return { data: null, error: err };
  }
}

/**
 * Fetch recent customers from Supabase
 */
export async function fetchCustomersFromSupabase(limit = 10): Promise<CustomerRow[]> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('Could not fetch customers from Supabase:', error.message);
      return [];
    }
    return (data as CustomerRow[]) || [];
  } catch (err) {
    console.error('Exception fetching customers:', err);
    return [];
  }
}

/**
 * Fetch recent fit analyses from Supabase
 */
export async function fetchFitAnalysesFromSupabase(limit = 10): Promise<FitAnalysisRow[]> {
  try {
    const { data, error } = await supabase
      .from('fit_analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('Could not fetch fit analyses from Supabase:', error.message);
      return [];
    }
    return (data as FitAnalysisRow[]) || [];
  } catch (err) {
    console.error('Exception fetching fit analyses:', err);
    return [];
  }
}

/**
 * Fetch products from Supabase
 */
export async function fetchProductsFromSupabase(): Promise<ProductRow[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Error fetching products from Supabase:', error.message);
      return [];
    }
    return (data as ProductRow[]) || [];
  } catch (err) {
    console.error('Exception fetching products from Supabase:', err);
    return [];
  }
}

/**
 * Seed initial products into Supabase if products table is empty
 */
export async function seedProductsToSupabase(products: ProductInsert[]): Promise<boolean> {
  try {
    const { count, error: countErr } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countErr) {
      console.warn('Count error for products:', countErr);
      return false;
    }

    if (count && count > 0) {
      return true; // Already seeded
    }

    const { error: insertErr } = await supabase
      .from('products')
      .upsert(products as any, { onConflict: 'id' });

    if (insertErr) {
      console.error('Failed to seed products into Supabase:', insertErr);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception seeding products:', err);
    return false;
  }
}
