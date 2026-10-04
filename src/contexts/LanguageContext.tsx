import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja';

interface Translations {
  [key: string]: Record<string, string>;
}

const TRANSLATIONS: Translations = {
  en: {
    heroTitle: "AI-Powered Virtual Fit Sizing",
    heroSubtitle: "Zero guesswork. 98.4% fit accuracy synced live with Supabase cloud database.",
    startFitWizard: "Find My Size (30s)",
    viewCatalog: "Explore Collection",
    fitAccuracy: "Fit Accuracy",
    returnReduction: "Return Reduction",
    customersSized: "Profiles Calibrated",
    recommendedForYou: "Recommended For Your Body Profile",
    allProducts: "All Designs",
    filterTitle: "Refine Sizing & Fit",
    saveProfile: "Save Body Profile",
    savedToSupabase: "Saved to Supabase",
    addToCart: "Add to Bag",
    addedToCart: "Added to Bag",
    viewDetails: "Inspect Garment",
    cartTitle: "Your Shopping Bag",
    checkout: "Complete Checkout",
    sizeRecommendation: "Recommended Size",
    fitConfidence: "Confidence Score",
    returnRisk: "Return Risk",
    databaseSync: "Supabase Live Sync",
  },
  es: {
    heroTitle: "Ajuste Virtual Impulsado por IA",
    heroSubtitle: "Sin dudas. 98.4% de precisión sincronizado en vivo con Supabase.",
    startFitWizard: "Encontrar Mi Talla (30s)",
    viewCatalog: "Explorar Colección",
    fitAccuracy: "Precisión de Talla",
    returnReduction: "Menos Devoluciones",
    customersSized: "Perfiles Calibrados",
    recommendedForYou: "Recomendado para Tu Cuerpo",
    allProducts: "Todos los Diseños",
    filterTitle: "Filtrar por Talla",
    saveProfile: "Guardar Medidas",
    savedToSupabase: "Guardado en Supabase",
    addToCart: "Añadir a la Bolsa",
    addedToCart: "Añadido a la Bolsa",
    viewDetails: "Ver Prenda",
    cartTitle: "Tu Bolsa de Compras",
    checkout: "Finalizar Compra",
    sizeRecommendation: "Talla Recomendada",
    fitConfidence: "Confianza de Ajuste",
    returnRisk: "Riesgo de Devolución",
    databaseSync: "Sincronización Supabase",
  },
  fr: {
    heroTitle: "Essayage Virtuel par IA",
    heroSubtitle: "Zéro doute. Précision de 98.4% synchronisée en direct sur Supabase.",
    startFitWizard: "Trouver Ma Taille (30s)",
    viewCatalog: "Explorer la Collection",
    fitAccuracy: "Précision Coupe",
    returnReduction: "Retours Évités",
    customersSized: "Profils Calibrés",
    recommendedForYou: "Recommandé pour Votre Morphologie",
    allProducts: "Tous les Produits",
    filterTitle: "Filtrer les Coupes",
    saveProfile: "Enregistrer Mesures",
    savedToSupabase: "Enregistré sur Supabase",
    addToCart: "Ajouter au Panier",
    addedToCart: "Ajouté au Panier",
    viewDetails: "Détails du Vêtement",
    cartTitle: "Votre Panier",
    checkout: "Commander",
    sizeRecommendation: "Taille Recommandée",
    fitConfidence: "Score de Confiance",
    returnRisk: "Risque de Retour",
    databaseSync: "Sync Supabase en Direct",
  },
  de: {
    heroTitle: "KI-Größenberatung & Virtuelle Passform",
    heroSubtitle: "Kein Rätselraten. 98,4% Genauigkeit mit Supabase Cloud-Datenbank.",
    startFitWizard: "Größe Finden (30s)",
    viewCatalog: "Kollektion Entdecken",
    fitAccuracy: "Passform-Genauigkeit",
    returnReduction: "Weniger Retouren",
    customersSized: "Kalibrierte Profile",
    recommendedForYou: "Passend zu Deinem Körper",
    allProducts: "Alle Artikel",
    filterTitle: "Filter & Passform",
    saveProfile: "Profil Speichern",
    savedToSupabase: "In Supabase Gespeichert",
    addToCart: "In den Warenkorb",
    addedToCart: "Hinzugefügt",
    viewDetails: "Artikel Anzeigen",
    cartTitle: "Warenkorb",
    checkout: "Zur Kasse",
    sizeRecommendation: "Empfohlene Größe",
    fitConfidence: "Vertrauensindex",
    returnRisk: "Rücksende-Risiko",
    databaseSync: "Supabase Live-Sync",
  },
  ja: {
    heroTitle: "AIバーチャルフィットサイジング",
    heroSubtitle: "迷わないサイズ選び。Supabaseデータベースとリアルタイム連携。",
    startFitWizard: "サイズ測定 (30秒)",
    viewCatalog: "コレクションを見る",
    fitAccuracy: "サイズ精度",
    returnReduction: "返品率削減",
    customersSized: "診断済みプロファイル",
    recommendedForYou: "あなたにおすすめ",
    allProducts: "全アイテム",
    filterTitle: "フィルター",
    saveProfile: "体型データを保存",
    savedToSupabase: "Supabaseに保存完了",
    addToCart: "バッグに追加",
    addedToCart: "追加済み",
    viewDetails: "商品詳細",
    cartTitle: "ショッピングバッグ",
    checkout: "お会計に進む",
    sizeRecommendation: "推奨サイズ",
    fitConfidence: "フィット信頼度",
    returnRisk: "返品リスク",
    databaseSync: "Supabase同期",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('inspira-lang') as Language;
    return saved && TRANSLATIONS[saved] ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('inspira-lang', lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
