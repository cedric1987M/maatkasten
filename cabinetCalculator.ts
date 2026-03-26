/**
 * Cabinet configuration calculation logic
 * Handles all calculations for dimensions, materials, pricing, and cut lists
 * 
 * IMPORTANT: All internal calculations use MILLIMETERS (mm)
 * Input from UI comes in centimeters and is converted to mm
 * Output to UI is converted back to cm for display
 */

export interface CabinetConfig {
  width: number; // cm from UI - will be converted to mm internally
  height: number; // cm from UI - will be converted to mm internally
  depth: number; // cm from UI - will be converted to mm internally
  numberOfCompartments: number;
  numberOfShelves: number;
  numberOfDoors: number;
  numberOfDrawers: number;
  hasClothingRail: boolean;
  material: "white_melamine" | "oak_decor" | "black_decor" | "mdf_white_ral9016" | "mdf_grey_ral7035" | "mdf_grey_ral7038" | "mdf_green_ral6029" | "mdf_blue_ral5002" | "mdf_red_ral3020" | "mdf_cream_ral1015" | "mdf_brown_ral8017";
  includeInstallation?: boolean;
  type?: "wardrobe" | "stairs" | "other"; // Project type for base pricing
}

export interface PanelDimensions {
  name: string;
  widthMm: number; // millimeters
  heightMm: number; // millimeters
  thicknessMm: number; // 18mm
  quantity: number;
  material: string;
  needsEdgeBanding?: boolean;
  notes?: string;
}

export interface CutList {
  panels: PanelDimensions[];
  totalAreaM2: number; // square meters
  totalPanels: number;
}

export interface PricingBreakdown {
  materialCost: number;
  shelfCost: number;
  drawerCost: number;
  doorCost: number;
  clothingRailCost: number;
  hardwareCost: number;
  productPrice: number;
  installationCost: number;
  total: number;
}

// Constants in millimeters
const PANEL_THICKNESS_MM = 18;
const SHELF_CLEARANCE_MM = 4;
const DEPTH_REDUCTION_MM = 20;

/**
 * Convert centimeters to millimeters
 */
function cmToMm(cm: number): number {
  return Math.round(cm * 10);
}

/**
 * Convert millimeters to centimeters
 */
function mmToCm(mm: number): number {
  return Math.round(mm / 10);
}

/**
 * Calculate compartment width based on total width and number of compartments
 * @param totalWidthMm Total width in millimeters
 * @param numberOfCompartments Number of compartments
 * @returns Width per compartment in millimeters
 */
export function calculateCompartmentWidth(totalWidthMm: number, numberOfCompartments: number): number {
  return totalWidthMm / numberOfCompartments;
}

/**
 * Calculate shelf width with clearance
 * @param compartmentWidthMm Compartment width in millimeters
 * @returns Shelf width in millimeters
 */
export function calculateShelfWidth(compartmentWidthMm: number): number {
  return compartmentWidthMm - SHELF_CLEARANCE_MM;
}

/**
 * Calculate shelf depth
 * @param totalDepthMm Total depth in millimeters
 * @returns Shelf depth in millimeters
 */
export function calculateShelfDepth(totalDepthMm: number): number {
  return totalDepthMm - DEPTH_REDUCTION_MM;
}

/**
 * Generate detailed cut list for the cabinet
 * All dimensions are in millimeters internally
 */
export function generateCutList(config: CabinetConfig): CutList {
  // Convert input from cm to mm
  const widthMm = cmToMm(config.width);
  const heightMm = cmToMm(config.height);
  const depthMm = cmToMm(config.depth);

  const panels: PanelDimensions[] = [];
  const compartmentWidth = calculateCompartmentWidth(widthMm, config.numberOfCompartments);
  const shelfWidth = calculateShelfWidth(compartmentWidth);
  const shelfDepth = calculateShelfDepth(depthMm);

  // Side panels (2)
  panels.push({
    name: "Side Panel (Left)",
    widthMm: depthMm,
    heightMm: heightMm,
    thicknessMm: PANEL_THICKNESS_MM,
    quantity: 1,
    material: config.material,
  });

  panels.push({
    name: "Side Panel (Right)",
    widthMm: depthMm,
    heightMm: heightMm,
    thicknessMm: PANEL_THICKNESS_MM,
    quantity: 1,
    material: config.material,
  });

  // Top panel
  panels.push({
    name: "Top Panel",
    widthMm: widthMm,
    heightMm: depthMm,
    thicknessMm: PANEL_THICKNESS_MM,
    quantity: 1,
    material: config.material,
    notes: "bovenpaneel",
  });

  // Bottom panel
  panels.push({
    name: "Bottom Panel",
    widthMm: widthMm,
    heightMm: depthMm,
    thicknessMm: PANEL_THICKNESS_MM,
    quantity: 1,
    material: config.material,
    notes: "onderpaneel",
  });

  // Vertical dividers (numberOfCompartments - 1)
  const dividerCount = Math.max(0, config.numberOfCompartments - 1);
  if (dividerCount > 0) {
    panels.push({
      name: "Vertical Divider",
      widthMm: depthMm,
      heightMm: heightMm,
      thicknessMm: PANEL_THICKNESS_MM,
      quantity: dividerCount,
      material: config.material,
      notes: "scheidingspaneel",
    });
  }

  // Shelves (numberOfShelves per compartment)
  const totalShelves = config.numberOfShelves * config.numberOfCompartments;
  if (totalShelves > 0) {
    panels.push({
      name: "Shelf",
      widthMm: shelfWidth,
      heightMm: shelfDepth,
      thicknessMm: PANEL_THICKNESS_MM,
      quantity: totalShelves,
      material: config.material,
      needsEdgeBanding: true,
      notes: "legplank - voorzijde kantenband nodig",
    });
  }

  // Calculate total area in m2
  // Formula: (width_mm * height_mm * quantity) / 1,000,000 = m2
  let totalAreaM2 = 0;
  panels.forEach((panel) => {
    const areaMm2 = panel.widthMm * panel.heightMm * panel.quantity;
    const areaM2 = areaMm2 / 1_000_000;
    totalAreaM2 += areaM2;
  });

  const totalPanels = panels.reduce((sum, p) => sum + p.quantity, 0);

  return {
    panels,
    totalAreaM2,
    totalPanels,
  };
}

/**
 * Calculate pricing based on configuration using new accessible pricing model
 * 
 * Pricing Model:
 * 1. Start with base price depending on project type (wardrobe, stairs, etc.)
 * 2. Apply material surcharges (Oak +40%, Walnut +65%)
 * 3. Add component costs (LED +€300, Drawer +€140)
 * 4. Apply installation if requested (30% of product price, minimum €500)
 * 
 * Base Prices:
 * - Small projects (wardrobe): €1500
 * - Medium projects: €2500
 * - Large projects: €4000
 * - Stairs: €2200
 */
export function calculatePricing(
  config: CabinetConfig,
  pricingRules?: any
): PricingBreakdown {
  const cutList = generateCutList(config);

  // Determine base price based on project type and dimensions
  let basePrice = 1500; // Default: small wardrobe
  const projectType = config.type || "wardrobe";
  const totalVolume = config.width * config.height * config.depth;

  if (projectType === "stairs") {
    basePrice = 2200;
  } else if (totalVolume > 150000) {
    // Large projects (>150,000 cm³)
    basePrice = 4000;
  } else if (totalVolume > 80000) {
    // Medium projects (80,000-150,000 cm³)
    basePrice = 2500;
  }
  // Small projects stay at €1500

  // Material surcharges (applied to base price)
  const materialSurcharges: Record<string, number> = {
    white_melamine: 0,      // Base
    oak_decor: 0.40,        // +40%
    black_decor: 0.15,      // +15%
    mdf_white_ral9016: 0.10, // +10%
    mdf_grey_ral7035: 0.10,  // +10%
    mdf_grey_ral7038: 0.10,  // +10%
    mdf_green_ral6029: 0.25, // +25%
    mdf_blue_ral5002: 0.25,  // +25%
    mdf_red_ral3020: 0.25,   // +25%
    mdf_cream_ral1015: 0.10, // +10%
    mdf_brown_ral8017: 0.65, // +65% (Walnut)
  };

  const materialSurcharge = materialSurcharges[config.material] || 0;
  const materialAdjustedPrice = basePrice * (1 + materialSurcharge);

  // Component costs
  const ledCost = 300; // €300 for LED lighting
  const drawerCost = config.numberOfDrawers * 140; // €140 per drawer
  const doorCost = config.numberOfDoors * 50; // €50 per door
  const shelfCost = config.numberOfShelves * config.numberOfCompartments * 25; // €25 per shelf
  const clothingRailCost = config.hasClothingRail ? 80 : 0; // €80 for clothing rail

  // Calculate product price
  const productPrice = materialAdjustedPrice + drawerCost + doorCost + shelfCost + clothingRailCost;

  // Installation cost (30% of product price, minimum €500)
  const installationCost = config.includeInstallation !== false 
    ? Math.max(productPrice * 0.30, 500) 
    : 0;
  
  const finalPrice = productPrice + installationCost;

  // Breakdown for display
  const materialCost = materialAdjustedPrice - basePrice;
  const hardwareCost = doorCost;

  return {
    materialCost: Math.round(materialCost * 100) / 100,
    shelfCost: Math.round(shelfCost * 100) / 100,
    drawerCost: Math.round(drawerCost * 100) / 100,
    doorCost: Math.round(doorCost * 100) / 100,
    clothingRailCost: Math.round(clothingRailCost * 100) / 100,
    hardwareCost: Math.round(hardwareCost * 100) / 100,
    productPrice: Math.round(productPrice * 100) / 100,
    installationCost: Math.round(installationCost * 100) / 100,
    total: Math.round(finalPrice * 100) / 100,
  };
}
