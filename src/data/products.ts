export interface SizeMeasurements {
  chest: number; // in cm
  waist: number; // in cm
  hips: number; // in cm
  length: number; // in cm
  sleeve?: number; // in cm
  inseam?: number; // in cm
}

export interface Product {
  id: string;
  name: string;
  category: 'tops' | 'bottoms' | 'outerwear' | 'dresses' | 'streetwear';
  gender: 'unisex' | 'men' | 'women';
  price: number;
  originalPrice?: number;
  image_url: string;
  secondary_image?: string;
  description: string;
  fabric: string;
  fit_type: 'slim' | 'regular' | 'relaxed' | 'oversized';
  style: 'streetwear' | 'minimalist' | 'tailored' | 'casual' | 'athleisure';
  sizes: string[];
  size_chart: Record<string, SizeMeasurements>;
  traits: {
    stretch: 'none' | 'low' | 'medium' | 'high';
    weight: 'light' | 'mid' | 'heavy';
    breathability: string;
    care: string;
  };
  rating: number;
  reviewCount: number;
  colors: { name: string; hex: string }[];
  badges: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "inspira-tee-01",
    name: "Architect Heavyweight Boxy Tee",
    category: "tops",
    gender: "unisex",
    price: 48,
    originalPrice: 62,
    image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    secondary_image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
    description: "Crafted from 280 GSM combed organic cotton with dropped shoulders, reinforced collar, and a modern relaxed drape that holds its shape all day.",
    fabric: "100% Combed Organic Cotton (280 GSM)",
    fit_type: "oversized",
    style: "streetwear",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    size_chart: {
      XS: { chest: 96, waist: 92, hips: 96, length: 68, sleeve: 22 },
      S: { chest: 104, waist: 100, hips: 104, length: 71, sleeve: 23 },
      M: { chest: 112, waist: 108, hips: 112, length: 74, sleeve: 24 },
      L: { chest: 120, waist: 116, hips: 120, length: 76, sleeve: 25 },
      XL: { chest: 128, waist: 124, hips: 128, length: 79, sleeve: 26 },
      XXL: { chest: 136, waist: 132, hips: 136, length: 81, sleeve: 27 },
    },
    traits: {
      stretch: "low",
      weight: "heavy",
      breathability: "High airflow weave",
      care: "Machine wash cold inside out, hang dry",
    },
    rating: 4.9,
    reviewCount: 142,
    colors: [
      { name: "Obsidian Black", hex: "#121214" },
      { name: "Chalk Ecru", hex: "#EAE6DF" },
      { name: "Sage Slate", hex: "#6B7A6C" },
    ],
    badges: ["Bestseller", "Heavyweight", "Supabase Sync"],
  },
  {
    id: "inspira-hoodie-02",
    name: "Minimalist French Terry Hoodie",
    category: "streetwear",
    gender: "unisex",
    price: 98,
    originalPrice: 120,
    image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    secondary_image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80",
    description: "Ultra-plush 450 GSM diagonal loopback French terry. Features a seamless double-layer hood, hidden kangaroo stash pockets, and tailored ribbing.",
    fabric: "100% French Terry Cotton (450 GSM)",
    fit_type: "relaxed",
    style: "streetwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    size_chart: {
      S: { chest: 108, waist: 102, hips: 104, length: 68, sleeve: 63 },
      M: { chest: 116, waist: 110, hips: 112, length: 71, sleeve: 65 },
      L: { chest: 124, waist: 118, hips: 120, length: 74, sleeve: 66 },
      XL: { chest: 132, waist: 126, hips: 128, length: 76, sleeve: 68 },
      XXL: { chest: 140, waist: 134, hips: 136, length: 79, sleeve: 69 },
    },
    traits: {
      stretch: "medium",
      weight: "heavy",
      breathability: "Natural breathable loops",
      care: "Cold gentle cycle, lay flat to dry",
    },
    rating: 4.8,
    reviewCount: 98,
    colors: [
      { name: "Charcoal Heather", hex: "#3A3D40" },
      { name: "Sand Taupe", hex: "#B8A99A" },
      { name: "Vintage Olive", hex: "#4A5243" },
    ],
    badges: ["Premium Terry", "Eco-Dye"],
  },
  {
    id: "inspira-blazer-03",
    name: "Tailored Studio Relaxed Blazer",
    category: "outerwear",
    gender: "women",
    price: 165,
    originalPrice: 195,
    image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
    secondary_image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80",
    description: "Contemporary single-breasted blazer with structured shoulders, peak lapels, and interior contrast horn buttons. Effortlessly pairs with denim or tailored trousers.",
    fabric: "70% Virgin Wool, 28% Viscose, 2% Elastane",
    fit_type: "regular",
    style: "tailored",
    sizes: ["XS", "S", "M", "L", "XL"],
    size_chart: {
      XS: { chest: 88, waist: 76, hips: 94, length: 70, sleeve: 59 },
      S: { chest: 94, waist: 82, hips: 100, length: 72, sleeve: 60 },
      M: { chest: 100, waist: 88, hips: 106, length: 74, sleeve: 61 },
      L: { chest: 108, waist: 96, hips: 114, length: 76, sleeve: 62 },
      XL: { chest: 116, waist: 104, hips: 122, length: 78, sleeve: 63 },
    },
    traits: {
      stretch: "low",
      weight: "mid",
      breathability: "Temperature regulating wool blend",
      care: "Dry clean only",
    },
    rating: 4.9,
    reviewCount: 76,
    colors: [
      { name: "Midnight Navy", hex: "#162032" },
      { name: "Warm Camel", hex: "#C19A6B" },
      { name: "Onyx", hex: "#1A1A1A" },
    ],
    badges: ["Tailored", "Wool Blend"],
  },
  {
    id: "inspira-pant-04",
    name: "Pleated Wide-Leg Studio Trouser",
    category: "bottoms",
    gender: "unisex",
    price: 88,
    originalPrice: 110,
    image_url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
    secondary_image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
    description: "High-waisted double-pleated trousers with elasticated back waist for all-day comfort. Designed with a generous fluid drape and deep side welt pockets.",
    fabric: "65% Lyocell (TENCEL™), 35% Cotton Twill",
    fit_type: "relaxed",
    style: "minimalist",
    sizes: ["XS", "S", "M", "L", "XL"],
    size_chart: {
      XS: { chest: 0, waist: 68, hips: 96, length: 103, inseam: 74 },
      S: { chest: 0, waist: 74, hips: 102, length: 105, inseam: 75 },
      M: { chest: 0, waist: 80, hips: 108, length: 107, inseam: 76 },
      L: { chest: 0, waist: 88, hips: 116, length: 109, inseam: 77 },
      XL: { chest: 0, waist: 96, hips: 124, length: 111, inseam: 78 },
    },
    traits: {
      stretch: "low",
      weight: "mid",
      breathability: "Silky moisture-wicking Tencel",
      care: "Delicate machine wash, warm iron",
    },
    rating: 4.7,
    reviewCount: 115,
    colors: [
      { name: "Soft Stone", hex: "#D6D1CA" },
      { name: "Deep Forest", hex: "#263529" },
      { name: "Pitch Black", hex: "#111111" },
    ],
    badges: ["TENCEL™", "Comfort Waist"],
  },
  {
    id: "inspira-jacket-05",
    name: "Tech Nomad Overshirt Jacket",
    category: "outerwear",
    gender: "men",
    price: 135,
    originalPrice: 160,
    image_url: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80",
    secondary_image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
    description: "Weather-resistant ripstop hybrid jacket with modular magnetic chest pockets, matte metal snaps, and breathable underarm eyelets.",
    fabric: "88% Recycled Nylon, 12% Spandex with DWR Water Repellent",
    fit_type: "regular",
    style: "athleisure",
    sizes: ["S", "M", "L", "XL", "XXL"],
    size_chart: {
      S: { chest: 104, waist: 98, hips: 102, length: 70, sleeve: 63 },
      M: { chest: 112, waist: 106, hips: 110, length: 72, sleeve: 64 },
      L: { chest: 120, waist: 114, hips: 118, length: 75, sleeve: 66 },
      XL: { chest: 128, waist: 122, hips: 126, length: 77, sleeve: 67 },
      XXL: { chest: 136, waist: 130, hips: 134, length: 80, sleeve: 68 },
    },
    traits: {
      stretch: "medium",
      weight: "mid",
      breathability: "DWR water-shedding finish",
      care: "Wipe clean or gentle machine wash cold",
    },
    rating: 4.9,
    reviewCount: 64,
    colors: [
      { name: "Technical Olive", hex: "#434B3E" },
      { name: "Stealth Grey", hex: "#2E3033" },
      { name: "Sandstone", hex: "#D4C5B0" },
    ],
    badges: ["Water Resistant", "Stretch Tech"],
  },
  {
    id: "inspira-dress-06",
    name: "Aura Bias-Cut Silk Slip Dress",
    category: "dresses",
    gender: "women",
    price: 145,
    originalPrice: 175,
    image_url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
    secondary_image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80",
    description: "Pure mulberry silk satin with a gentle diagonal drape that naturally hugs curves without clinging. Adjustable slender straps and discreet French seams.",
    fabric: "100% Mulberry Silk Satin (19 Momme)",
    fit_type: "slim",
    style: "minimalist",
    sizes: ["XS", "S", "M", "L"],
    size_chart: {
      XS: { chest: 82, waist: 66, hips: 90, length: 118 },
      S: { chest: 88, waist: 72, hips: 96, length: 120 },
      M: { chest: 94, waist: 78, hips: 102, length: 122 },
      L: { chest: 102, waist: 86, hips: 110, length: 124 },
    },
    traits: {
      stretch: "low",
      weight: "light",
      breathability: "Lustrous breathable pure silk",
      care: "Hand wash cold with silk detergent, line dry in shade",
    },
    rating: 4.8,
    reviewCount: 89,
    colors: [
      { name: "Champagne Pearl", hex: "#F3E8D7" },
      { name: "Noir Gloss", hex: "#0E0E10" },
      { name: "Emerald Glaze", hex: "#1C3C30" },
    ],
    badges: ["100% Silk", "Bias Cut"],
  },
  {
    id: "inspira-cargo-07",
    name: "Parachute Kinetic Cargo Pant",
    category: "streetwear",
    gender: "unisex",
    price: 92,
    originalPrice: 115,
    image_url: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80",
    secondary_image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
    description: "Lightweight technical ripstop parachute pant with cinch cords at the ankle cuffs, darted knees for articulated movement, and 6 utilitarian bellow pockets.",
    fabric: "100% Crinkled Ripstop Nylon with Anti-Static Finish",
    fit_type: "oversized",
    style: "streetwear",
    sizes: ["XS", "S", "M", "L", "XL"],
    size_chart: {
      XS: { chest: 0, waist: 70, hips: 104, length: 101, inseam: 72 },
      S: { chest: 0, waist: 76, hips: 110, length: 103, inseam: 74 },
      M: { chest: 0, waist: 82, hips: 116, length: 106, inseam: 75 },
      L: { chest: 0, waist: 90, hips: 124, length: 108, inseam: 76 },
      XL: { chest: 0, waist: 98, hips: 132, length: 110, inseam: 77 },
    },
    traits: {
      stretch: "none",
      weight: "light",
      breathability: "Ultra-breathable crinkle nylon",
      care: "Cold wash, rapid air dry",
    },
    rating: 4.7,
    reviewCount: 130,
    colors: [
      { name: "Ash Bone", hex: "#C8C5BD" },
      { name: "Matte Black", hex: "#18181A" },
      { name: "Earth Khaki", hex: "#8A7D69" },
    ],
    badges: ["Parachute Fit", "Adjustable Cinch"],
  },
  {
    id: "inspira-knit-08",
    name: "Cashmere-Wool Mockneck Sweater",
    category: "tops",
    gender: "unisex",
    price: 128,
    originalPrice: 155,
    image_url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80",
    secondary_image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=80",
    description: "Spun from 70% extra-fine Australian Merino wool and 30% Mongolian cashmere. Seamless 3D knit body for non-restrictive warmth and soft tactile luxury.",
    fabric: "70% Merino Wool, 30% Cashmere (7 Gauge)",
    fit_type: "regular",
    style: "minimalist",
    sizes: ["S", "M", "L", "XL"],
    size_chart: {
      S: { chest: 100, waist: 92, hips: 94, length: 66, sleeve: 62 },
      M: { chest: 106, waist: 98, hips: 100, length: 69, sleeve: 64 },
      L: { chest: 114, waist: 106, hips: 108, length: 72, sleeve: 65 },
      XL: { chest: 122, waist: 114, hips: 116, length: 75, sleeve: 67 },
    },
    traits: {
      stretch: "high",
      weight: "mid",
      breathability: "Superior thermoregulation",
      care: "Hand wash cold inside out, dry flat",
    },
    rating: 4.9,
    reviewCount: 94,
    colors: [
      { name: "Oatmeal Melange", hex: "#D9D0C3" },
      { name: "Mocha", hex: "#4B3621" },
      { name: "Steel Blue", hex: "#465362" },
    ],
    badges: ["30% Cashmere", "Seamless 3D Knit"],
  },
];

/**
 * Convert products to Supabase product schema rows
 */
export function getProductInsertRows() {
  return PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    gender: p.gender,
    price: p.price,
    image_url: p.image_url,
    description: p.description,
    fabric: p.fabric,
    fit_type: p.fit_type,
    style: p.style,
    size_chart: p.size_chart as any,
    traits: p.traits as any,
  }));
}
