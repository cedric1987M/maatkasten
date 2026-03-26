/**
 * Panel Generation System
 * 
 * Automatically generates all panels needed for a cabinet configuration.
 * Handles:
 * - Regular rectangular cabinets
 * - Sloped loft cabinets
 * - Different cabinet types (wardrobe, TV furniture, etc.)
 */

export interface Panel {
  id: string; // Unique identifier
  name: string; // Display name
  widthMm: number;
  heightMm: number;
  thicknessMm: number;
  quantity: number;
  material: string;
  needsEdgeBanding: boolean;
  notes: string;
  category: "structural" | "shelf" | "divider" | "door" | "drawer" | "back";
}

export interface PanelList {
  panels: Panel[];
  totalPanels: number;
  totalAreaM2: number;
  totalLinearMetersEdgeBanding: number;
  estimatedWeight: number; // kg
}

const PANEL_THICKNESS_MM = 18;
const SHELF_CLEARANCE_MM = 4;
const DEPTH_REDUCTION_MM = 20;

/**
 * Generate all panels for a standard rectangular cabinet
 */
export function generateStandardPanels(
  widthMm: number,
  heightMm: number,
  depthMm: number,
  numberOfCompartments: number,
  numberOfShelves: number,
  numberOfDoors: number,
  numberOfDrawers: number,
  material: string
): PanelList {
  const panels: Panel[] = [];
  let panelId = 1;
  
  // Calculate dimensions
  const innerWidthMm = widthMm - (PANEL_THICKNESS_MM * 2);
  const innerHeightMm = heightMm - (PANEL_THICKNESS_MM * 2);
  const innerDepthMm = depthMm - DEPTH_REDUCTION_MM;
  const compartmentWidthMm = innerWidthMm / numberOfCompartments;
  const shelfWidthMm = compartmentWidthMm - SHELF_CLEARANCE_MM;
  
  // Side panels (left and right)
  panels.push({
    id: `panel-${panelId++}`,
    name: "Side Panel (Left)",
    widthMm: depthMm,
    heightMm: heightMm,
    thicknessMm: PANEL_THICKNESS_MM,
    quantity: 1,
    material,
    needsEdgeBanding: false,
    notes: "Left side panel - zijpaneel links",
    category: "structural",
  });
  
  panels.push({
    id: `panel-${panelId++}`,
    name: "Side Panel (Right)",
    widthMm: depthMm,
    heightMm: heightMm,
    thicknessMm: PANEL_THICKNESS_MM,
    quantity: 1,
    material,
    needsEdgeBanding: false,
    notes: "Right side panel - zijpaneel rechts",
    category: "structural",
  });
  
  // Top panel
  panels.push({
    id: `panel-${panelId++}`,
    name: "Top Panel",
    widthMm: widthMm,
    heightMm: depthMm,
    thicknessMm: PANEL_THICKNESS_MM,
    quantity: 1,
    material,
    needsEdgeBanding: false,
    notes: "Top panel - bovenpaneel",
    category: "structural",
  });
  
  // Bottom panel
  panels.push({
    id: `panel-${panelId++}`,
    name: "Bottom Panel",
    widthMm: widthMm,
    heightMm: depthMm,
    thicknessMm: PANEL_THICKNESS_MM,
    quantity: 1,
    material,
    needsEdgeBanding: false,
    notes: "Bottom panel - onderpaneel",
    category: "structural",
  });
  
  // Vertical dividers
  const dividerCount = Math.max(0, numberOfCompartments - 1);
  if (dividerCount > 0) {
    panels.push({
      id: `panel-${panelId++}`,
      name: "Vertical Divider",
      widthMm: depthMm,
      heightMm: innerHeightMm,
      thicknessMm: PANEL_THICKNESS_MM,
      quantity: dividerCount,
      material,
      needsEdgeBanding: false,
      notes: "Vertical dividers - scheidingspanelen",
      category: "divider",
    });
  }
  
  // Shelves
  const totalShelves = numberOfShelves * numberOfCompartments;
  if (totalShelves > 0) {
    panels.push({
      id: `panel-${panelId++}`,
      name: "Shelf",
      widthMm: shelfWidthMm,
      heightMm: innerDepthMm,
      thicknessMm: PANEL_THICKNESS_MM,
      quantity: totalShelves,
      material,
      needsEdgeBanding: true,
      notes: "Shelves with edge banding - legplanken met kantenband",
      category: "shelf",
    });
  }
  
  // Back panel (optional, usually plywood or hardboard)
  panels.push({
    id: `panel-${panelId++}`,
    name: "Back Panel",
    widthMm: widthMm,
    heightMm: innerHeightMm,
    thicknessMm: 4, // Thinner for back
    quantity: 1,
    material: "plywood_4mm",
    needsEdgeBanding: false,
    notes: "Back panel (plywood) - achterpaneel",
    category: "back",
  });
  
  return compilePanelList(panels);
}

/**
 * Generate panels for a sloped loft cabinet
 */
export function generateSlopedPanels(
  widthMm: number,
  depthMm: number,
  leftHeightMm: number,
  rightHeightMm: number,
  numberOfCompartments: number,
  numberOfShelves: number,
  material: string
): PanelList {
  const panels: Panel[] = [];
  let panelId = 1;
  
  // Calculate sloped dimensions
  const heightDifferenceMm = Math.abs(rightHeightMm - leftHeightMm);
  const slopedSideLengthMm = Math.sqrt(
    Math.pow(widthMm, 2) + Math.pow(heightDifferenceMm, 2)
  );
  
  const innerWidthMm = widthMm - (PANEL_THICKNESS_MM * 2);
  const innerDepthMm = depthMm - DEPTH_REDUCTION_MM;
  const compartmentWidthMm = innerWidthMm / numberOfCompartments;
  const shelfWidthMm = compartmentWidthMm - SHELF_CLEARANCE_MM;
  
  // Sloped side panels
  panels.push({
    id: `panel-${panelId++}`,
    name: "Sloped Side Panel (Left)",
    widthMm: depthMm,
    heightMm: slopedSideLengthMm,
    thicknessMm: PANEL_THICKNESS_MM,
    quantity: 1,
    material,
    needsEdgeBanding: false,
    notes: "Sloped left side - schuine zijpaneel links",
    category: "structural",
  });
  
  panels.push({
    id: `panel-${panelId++}`,
    name: "Sloped Side Panel (Right)",
    widthMm: depthMm,
    heightMm: slopedSideLengthMm,
    thicknessMm: PANEL_THICKNESS_MM,
    quantity: 1,
    material,
    needsEdgeBanding: false,
    notes: "Sloped right side - schuine zijpaneel rechts",
    category: "structural",
  });
  
  // Bottom panel (rectangular)
  panels.push({
    id: `panel-${panelId++}`,
    name: "Bottom Panel",
    widthMm: widthMm,
    heightMm: depthMm,
    thicknessMm: PANEL_THICKNESS_MM,
    quantity: 1,
    material,
    needsEdgeBanding: false,
    notes: "Bottom panel - onderpaneel",
    category: "structural",
  });
  
  // Top panel (trapezoid - but we'll approximate as rectangle for cutting)
  panels.push({
    id: `panel-${panelId++}`,
    name: "Top Panel (Trapezoid)",
    widthMm: widthMm,
    heightMm: depthMm,
    thicknessMm: PANEL_THICKNESS_MM,
    quantity: 1,
    material,
    needsEdgeBanding: false,
    notes: "Top panel trapezoid - bovenpaneel trapezium",
    category: "structural",
  });
  
  // Vertical dividers (follow the slope)
  const dividerCount = Math.max(0, numberOfCompartments - 1);
  if (dividerCount > 0) {
    // Average height for dividers
    const averageHeightMm = (leftHeightMm + rightHeightMm) / 2 - PANEL_THICKNESS_MM;
    panels.push({
      id: `panel-${panelId++}`,
      name: "Vertical Divider (Sloped)",
      widthMm: depthMm,
      heightMm: averageHeightMm,
      thicknessMm: PANEL_THICKNESS_MM,
      quantity: dividerCount,
      material,
      needsEdgeBanding: false,
      notes: "Vertical dividers (follow slope) - scheidingspanelen",
      category: "divider",
    });
  }
  
  // Shelves (parallel to bottom)
  const totalShelves = numberOfShelves * numberOfCompartments;
  if (totalShelves > 0) {
    panels.push({
      id: `panel-${panelId++}`,
      name: "Shelf",
      widthMm: shelfWidthMm,
      heightMm: innerDepthMm,
      thicknessMm: PANEL_THICKNESS_MM,
      quantity: totalShelves,
      material,
      needsEdgeBanding: true,
      notes: "Shelves with edge banding - legplanken met kantenband",
      category: "shelf",
    });
  }
  
  // Back panel
  panels.push({
    id: `panel-${panelId++}`,
    name: "Back Panel",
    widthMm: widthMm,
    heightMm: Math.max(leftHeightMm, rightHeightMm) - PANEL_THICKNESS_MM,
    thicknessMm: 4,
    quantity: 1,
    material: "plywood_4mm",
    needsEdgeBanding: false,
    notes: "Back panel (plywood) - achterpaneel",
    category: "back",
  });
  
  return compilePanelList(panels);
}

/**
 * Compile panel list with totals and calculations
 */
function compilePanelList(panels: Panel[]): PanelList {
  let totalPanels = 0;
  let totalAreaM2 = 0;
  let totalLinearMetersEdgeBanding = 0;
  
  panels.forEach((panel) => {
    totalPanels += panel.quantity;
    
    // Calculate area (in m²)
    const areaMm2 = panel.widthMm * panel.heightMm * panel.quantity;
    totalAreaM2 += areaMm2 / 1_000_000;
    
    // Calculate edge banding (linear meters)
    if (panel.needsEdgeBanding) {
      // Edge banding on front edge only
      const linearMeters = (panel.widthMm / 1000) * panel.quantity;
      totalLinearMetersEdgeBanding += linearMeters;
    }
  });
  
  // Estimate weight (18mm melamine ~110 kg/m³)
  const estimatedWeight = totalAreaM2 * 0.018 * 110; // thickness * density
  
  return {
    panels,
    totalPanels,
    totalAreaM2,
    totalLinearMetersEdgeBanding,
    estimatedWeight,
  };
}

/**
 * Get panel by category
 */
export function getPanelsByCategory(panelList: PanelList, category: Panel["category"]): Panel[] {
  return panelList.panels.filter((p) => p.category === category);
}

/**
 * Calculate cutting optimization (group similar sizes)
 */
export function optimizePanelCutting(panelList: PanelList): Map<string, Panel[]> {
  const grouped = new Map<string, Panel[]>();
  
  panelList.panels.forEach((panel) => {
    const key = `${panel.widthMm}x${panel.heightMm}x${panel.material}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(panel);
  });
  
  return grouped;
}
