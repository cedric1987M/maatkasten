/**
 * Pricing Configuration
 * 
 * This file contains all pricing parameters for cabinet calculations.
 * Update these values to reflect your actual costs and desired margins.
 */

export const PRICING_CONFIG = {
  // Material costs per m² (in euros)
  materials: {
    white_melamine: 25,      // €/m²
    oak_decor: 35,           // €/m²
    black_decor: 32,         // €/m²
    mdf_white_ral9016: 28,   // €/m² MDF Gelakt Wit
    mdf_grey_ral7035: 28,    // €/m² MDF Gelakt Lichtgrijs
    mdf_grey_ral7038: 28,    // €/m² MDF Gelakt Donkergrijs
    mdf_green_ral6029: 30,   // €/m² MDF Gelakt Groen
    mdf_blue_ral5002: 30,    // €/m² MDF Gelakt Blauw
    mdf_red_ral3020: 30,     // €/m² MDF Gelakt Rood
    mdf_cream_ral1015: 28,   // €/m² MDF Gelakt Crème
    mdf_brown_ral8017: 30,   // €/m² MDF Gelakt Bruin
  },

  // Labor rates (in euros per hour)
  labor: {
    hourlyRate: 65,          // €/hour
    cuttingHoursPerCabinet: 1,      // hours
    assemblyHoursPerCabinet: 2,     // hours
    finishingHoursPerCabinet: 0.5,  // hours
  },

  // Additional costs per cabinet (in euros)
  hardware: {
    edgeBanding: 0.50,       // €/meter (estimated 50m per cabinet = €25)
    screws: 5,               // €/cabinet
    hinges: 15,              // €/cabinet (2-3 pairs)
    handles: 10,             // €/cabinet (2-3 handles)
    varnish: 2,              // €/cabinet
  },

  // Overhead percentage (applied to material + labor)
  overhead: 0.12,            // 12%

  // Profit margin (40% means selling price = cost / 0.60)
  profitMargin: 0.40,        // 40%

  // Door hardware costs
  doorHardware: {
    push_to_open: 0,         // €0 (no hardware)
    handle: 8,               // €8 per handle
    knob: 5,                 // €5 per knob
  },

  // Installation costs
  installation: {
    diy: 0,                  // €0 (customer installs)
    with_placement: 150,     // €150 for professional installation
  },

  // Minimum prices (to prevent unrealistic low prices)
  minimumPrice: 600,         // €600 minimum selling price (competitive with market)
};

/**
 * Calculate total labor hours for a cabinet
 */
export function getTotalLaborHours(): number {
  return (
    PRICING_CONFIG.labor.cuttingHoursPerCabinet +
    PRICING_CONFIG.labor.assemblyHoursPerCabinet +
    PRICING_CONFIG.labor.finishingHoursPerCabinet
  );
}

/**
 * Calculate labor cost
 */
export function calculateLaborCost(): number {
  return getTotalLaborHours() * PRICING_CONFIG.labor.hourlyRate;
}

/**
 * Calculate total hardware costs per cabinet
 */
export function calculateHardwareCost(): number {
  return (
    PRICING_CONFIG.hardware.screws +
    PRICING_CONFIG.hardware.hinges +
    PRICING_CONFIG.hardware.handles +
    PRICING_CONFIG.hardware.varnish
  );
}

/**
 * Get material cost per m² based on material type
 */
export function getMaterialCostPerM2(material: string): number {
  const materialKey = material as keyof typeof PRICING_CONFIG.materials;
  return PRICING_CONFIG.materials[materialKey] || PRICING_CONFIG.materials.white_melamine;
}

/**
 * Calculate selling price based on costs
 * Formula: Selling Price = Total Cost / (1 - Margin%)
 */
export function calculateSellingPrice(totalCost: number): number {
  const priceBeforeMargin = totalCost / (1 - PRICING_CONFIG.profitMargin);
  return Math.max(priceBeforeMargin, PRICING_CONFIG.minimumPrice);
}

/**
 * Calculate profit amount
 */
export function calculateProfit(sellingPrice: number, totalCost: number): number {
  return sellingPrice - totalCost;
}

/**
 * Calculate profit margin percentage
 */
export function calculateProfitMarginPercent(sellingPrice: number, totalCost: number): number {
  return ((sellingPrice - totalCost) / sellingPrice) * 100;
}
