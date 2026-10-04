export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          height: number;
          weight: number;
          age: number;
          gender: string;
          body_shape: string;
          preferred_fit: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          height: number;
          weight: number;
          age: number;
          gender: string;
          body_shape: string;
          preferred_fit: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          height?: number;
          weight?: number;
          age?: number;
          gender?: string;
          body_shape?: string;
          preferred_fit?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      fit_analyses: {
        Row: {
          id: string;
          customer_id: string;
          product_id: string | null;
          recommended_size: string;
          fit_confidence: number;
          return_risk_percent: number;
          return_risk_level: string;
          fit_notes: Json;
          return_reasons: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          product_id?: string | null;
          recommended_size: string;
          fit_confidence: number;
          return_risk_percent: number;
          return_risk_level: string;
          fit_notes?: Json;
          return_reasons?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          product_id?: string | null;
          recommended_size?: string;
          fit_confidence?: number;
          return_risk_percent?: number;
          return_risk_level?: string;
          fit_notes?: Json;
          return_reasons?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fit_analyses_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fit_analyses_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      products: {
        Row: {
          id: string;
          name: string;
          category: string;
          gender: string;
          price: number;
          image_url: string | null;
          description: string | null;
          fabric: string | null;
          fit_type: string | null;
          style: string | null;
          size_chart: Json;
          traits: Json;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          category: string;
          gender: string;
          price: number;
          image_url?: string | null;
          description?: string | null;
          fabric?: string | null;
          fit_type?: string | null;
          style?: string | null;
          size_chart?: Json;
          traits?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          gender?: string;
          price?: number;
          image_url?: string | null;
          description?: string | null;
          fabric?: string | null;
          fit_type?: string | null;
          style?: string | null;
          size_chart?: Json;
          traits?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type CustomerRow = Database['public']['Tables']['customers']['Row'];
export type CustomerInsert = Database['public']['Tables']['customers']['Insert'];

export type FitAnalysisRow = Database['public']['Tables']['fit_analyses']['Row'];
export type FitAnalysisInsert = Database['public']['Tables']['fit_analyses']['Insert'];

export type ProductRow = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
