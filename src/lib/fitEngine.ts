import type { Product, SizeMeasurements } from '../data/products';

export interface UserMeasurements {
  height: number; // in cm
  weight: number; // in kg
  age?: number;
  gender: string;
  bodyShape: string;
  preferredFit: 'tight' | 'regular' | 'relaxed' | 'oversized';
  chest?: number; // optional exact in cm
  waist?: number; // optional exact in cm
  hips?: number; // optional exact in cm
}

export interface FitRecommendation {
  recommendedSize: string;
  confidence: number; // 0 - 100
  returnRiskPercent: number; // 0 - 100
  returnRiskLevel: 'low' | 'medium' | 'high';
  fitNotes: string[];
  returnReasons: string[];
  detailedFit: {
    chestFit: 'tight' | 'perfect' | 'loose';
    waistFit: 'tight' | 'perfect' | 'loose';
    hipsFit: 'tight' | 'perfect' | 'loose';
    lengthFit: 'short' | 'perfect' | 'long';
  };
  estimatedBody: {
    chest: number;
    waist: number;
    hips: number;
  };
}

/**
 * Estimates anatomical body circumference from height, weight, gender, and body shape
 * Based on biometric sizing regression models
 */
export function estimateBodyCircumferences(user: UserMeasurements): {
  chest: number;
  waist: number;
  hips: number;
} {
  // If user provided exact measurements, respect them
  if (user.chest && user.waist && user.hips) {
    return {
      chest: Math.round(user.chest),
      waist: Math.round(user.waist),
      hips: Math.round(user.hips),
    };
  }

  const { height, weight, gender, bodyShape } = user;
  const bmi = weight / Math.pow(height / 100, 2);

  // Baseline circumference calculations (in cm)
  let chest = 0;
  let waist = 0;
  let hips = 0;

  if (gender.toLowerCase() === 'female' || gender.toLowerCase() === 'women') {
    chest = 78 + (bmi - 21) * 3.1 + (height - 165) * 0.15;
    waist = 64 + (bmi - 21) * 3.4 + (height - 165) * 0.12;
    hips = 90 + (bmi - 21) * 3.7 + (height - 165) * 0.18;

    // Body shape adjustments
    switch (bodyShape) {
      case 'hourglass':
        chest += 4;
        waist -= 4;
        hips += 5;
        break;
      case 'pear':
        chest -= 3;
        waist -= 2;
        hips += 7;
        break;
      case 'rectangle':
        chest -= 1;
        waist += 3;
        hips -= 2;
        break;
      case 'athletic':
        chest += 4;
        waist += 1;
        hips += 1;
        break;
      case 'oval':
        chest += 2;
        waist += 8;
        hips += 2;
        break;
      case 'inverted_triangle':
        chest += 6;
        waist -= 1;
        hips -= 4;
        break;
    }
  } else {
    // Male or Unisex baseline
    chest = 92 + (bmi - 23) * 3.4 + (height - 175) * 0.25;
    waist = 80 + (bmi - 23) * 3.8 + (height - 175) * 0.18;
    hips = 94 + (bmi - 23) * 3.2 + (height - 175) * 0.22;

    switch (bodyShape) {
      case 'athletic':
        chest += 5;
        waist -= 3;
        hips += 1;
        break;
      case 'rectangle':
        waist += 3;
        break;
      case 'oval':
        chest += 2;
        waist += 9;
        hips += 3;
        break;
      case 'inverted_triangle':
        chest += 7;
        waist -= 2;
        hips -= 3;
        break;
      case 'pear':
        chest -= 3;
        waist += 2;
        hips += 5;
        break;
    }
  }

  return {
    chest: Math.max(60, Math.round(chest)),
    waist: Math.max(50, Math.round(waist)),
    hips: Math.max(70, Math.round(hips)),
  };
}

/**
 * Calculates fit recommendations, size selection, confidence score, and return risk
 */
export function calculateFitRecommendation(
  user: UserMeasurements,
  product: Product
): FitRecommendation {
  const body = estimateBodyCircumferences(user);
  const sizeKeys = product.sizes;
  const sizeChart = product.size_chart;

  // Fit ease preference offset (in cm)
  const easeAllowance: Record<string, number> = {
    tight: -2,
    regular: 4,
    relaxed: 8,
    oversized: 14,
  };
  const targetEase = easeAllowance[user.preferredFit] ?? 4;

  // Fabric stretch tolerance factor
  const stretchFactor: Record<string, number> = {
    none: 0,
    low: 2,
    medium: 4,
    high: 8,
  };
  const stretchBonus = stretchFactor[product.traits.stretch] || 1;

  let bestSize = sizeKeys[Math.floor(sizeKeys.length / 2)] || 'M';
  let bestScore = -Infinity;
  let chestFit: 'tight' | 'perfect' | 'loose' = 'perfect';
  let waistFit: 'tight' | 'perfect' | 'loose' = 'perfect';
  let hipsFit: 'tight' | 'perfect' | 'loose' = 'perfect';
  let lengthFit: 'short' | 'perfect' | 'long' = 'perfect';

  const isBottom = product.category === 'bottoms';

  for (const size of sizeKeys) {
    const gar = sizeChart[size];
    if (!gar) continue;

    let deltaScore = 100;

    if (isBottom) {
      // Bottoms prioritize waist and hips
      const waistDiff = gar.waist - body.waist;
      const hipsDiff = gar.hips - body.hips;

      const waistPenalty = Math.abs(waistDiff - (targetEase * 0.6));
      const hipsPenalty = Math.abs(hipsDiff - (targetEase * 0.8));

      deltaScore -= (waistPenalty * 2.8) + (hipsPenalty * 2.2);

      // If garment waist is smaller than user body plus stretch, heavy penalty
      if (gar.waist + stretchBonus < body.waist) {
        deltaScore -= 40;
      }
    } else {
      // Tops / Outerwear / Dresses prioritize chest
      const chestDiff = gar.chest - body.chest;
      const waistDiff = gar.waist - body.waist;

      const chestPenalty = Math.abs(chestDiff - targetEase);
      const waistPenalty = Math.abs(waistDiff - (targetEase * 0.7));

      deltaScore -= (chestPenalty * 2.5) + (waistPenalty * 1.5);

      if (gar.chest + stretchBonus < body.chest) {
        deltaScore -= 35;
      }
    }

    if (deltaScore > bestScore) {
      bestScore = deltaScore;
      bestSize = size;
    }
  }

  // Calculate detailed attributes for best size
  const chosenGarment = sizeChart[bestSize];
  if (chosenGarment) {
    if (isBottom) {
      const wDiff = chosenGarment.waist - body.waist;
      if (wDiff < 0) waistFit = 'tight';
      else if (wDiff > 6) waistFit = 'loose';
      else waistFit = 'perfect';

      const hDiff = chosenGarment.hips - body.hips;
      if (hDiff < 2) hipsFit = 'tight';
      else if (hDiff > 12) hipsFit = 'loose';
      else hipsFit = 'perfect';
    } else {
      const cDiff = chosenGarment.chest - body.chest;
      if (cDiff < 2) chestFit = 'tight';
      else if (cDiff > 14) chestFit = 'loose';
      else chestFit = 'perfect';

      const wDiff = chosenGarment.waist - body.waist;
      if (wDiff < 1) waistFit = 'tight';
      else if (wDiff > 12) waistFit = 'loose';
      else waistFit = 'perfect';
    }

    // Height comparison
    if (user.height < 162 && chosenGarment.length > 76) lengthFit = 'long';
    else if (user.height > 188 && chosenGarment.length < 68) lengthFit = 'short';
    else lengthFit = 'perfect';
  }

  // Confidence & Return Risk calculations
  const normalizedConfidence = Math.min(98, Math.max(72, Math.round(75 + (bestScore / 10))));
  const returnRiskPercent = Math.max(5, Math.min(55, Math.round(100 - normalizedConfidence + (product.traits.stretch === 'none' ? 6 : 0))));
  
  let returnRiskLevel: 'low' | 'medium' | 'high' = 'low';
  if (returnRiskPercent > 35) returnRiskLevel = 'high';
  else if (returnRiskPercent > 18) returnRiskLevel = 'medium';

  // Generate Personalized Fit Notes
  const fitNotes: string[] = [];
  if (isBottom) {
    fitNotes.push(`Waist fit is calibrated for ${user.preferredFit} styling around ${body.waist}cm natural waist.`);
    fitNotes.push(`Hip contour offers ${chosenGarment ? chosenGarment.hips - body.hips : 8}cm dynamic comfort margin.`);
  } else {
    fitNotes.push(`Chest allowance provides ${chosenGarment ? chosenGarment.chest - body.chest : 6}cm optimal drape.`);
    if (product.fit_type === 'oversized') {
      fitNotes.push('Cut with engineered dropped shoulders for an architectural silhouette.');
    } else {
      fitNotes.push('Clean tailored shoulder placement aligned with standard proportions.');
    }
  }

  if (product.traits.stretch === 'high') {
    fitNotes.push('High-stretch premium knit accommodates body micro-movements seamlessly.');
  }

  // Generate Return Reasons / Advisories
  const returnReasons: string[] = [];
  if (user.preferredFit === 'tight' && product.fit_type === 'oversized') {
    returnReasons.push('You prefer tight fit but this piece is intentionally oversized; consider sizing down one size.');
  }
  if (product.traits.stretch === 'none' && chestFit === 'tight') {
    returnReasons.push('Zero-stretch fabric means snug chest fit may feel restrictive during arm extension.');
  }
  if (lengthFit === 'long') {
    returnReasons.push('Garment length may drape past upper thigh based on your height profile.');
  }

  return {
    recommendedSize: bestSize,
    confidence: normalizedConfidence,
    returnRiskPercent,
    returnRiskLevel,
    fitNotes,
    returnReasons,
    detailedFit: {
      chestFit,
      waistFit,
      hipsFit,
      lengthFit,
    },
    estimatedBody: body,
  };
}
