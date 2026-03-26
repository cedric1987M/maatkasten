/**
 * Central Calculation Engine for Cabinet Dimensions
 * 
 * This is the single source of truth for all dimension calculations.
 * All inputs are in millimeters (mm).
 * All outputs are in millimeters (mm).
 * 
 * No other components should perform dimension calculations.
 */

export interface DimensionInput {
  widthMm: number;
  heightMm: number;
  depthMm: number;
  numberOfCompartments: number;
  numberOfShelves: number;
  numberOfDoors: number;
  numberOfDrawers: number;
  cabinetType: "wardrobe" | "tv-furniture" | "shoe-cabinet" | "loft-cabinet" | "stairs";
  placement?: "freestanding" | "between-walls" | "left-wall" | "right-wall";
  shape?: "straight" | "sloped-left" | "sloped-right";
  loftHeightLeftMm?: number; // For loft cabinets
  loftHeightRightMm?: number; // For loft cabinets
}

export interface DimensionOutput {
  // Outer dimensions
  outerWidthMm: number;
  outerHeightMm: number;
  outerDepthMm: number;
  
  // Inner dimensions (usable space)
  innerWidthMm: number;
  innerHeightMm: number;
  innerDepthMm: number;
  
  // Panel dimensions
  sidePanelWidthMm: number;
  sidePanelHeightMm: number;
  topPanelWidthMm: number;
  topPanelHeightMm: number;
  bottomPanelWidthMm: number;
  bottomPanelHeightMm: number;
  
  // Compartment dimensions
  compartmentWidthMm: number;
  compartmentHeightMm: number;
  
  // Shelf dimensions
  shelfWidthMm: number;
  shelfDepthMm: number;
  
  // Door dimensions
  doorWidthMm: number;
  doorHeightMm: number;
  
  // Drawer dimensions
  drawerWidthMm: number;
  drawerHeightMm: number;
  drawerDepthMm: number;
  
  // Sloped geometry (for loft cabinets)
  slopedGeometry?: {
    heightDifferenceMm: number;
    slopedSideLengthMm: number; // Hypotenuse of sloped side
    leftHeightMm: number;
    rightHeightMm: number;
  };
  
  // Panel count
  totalPanelCount: number;
  sidePanelCount: number;
  shelfCount: number;
  dividerCount: number;
  
  // Material calculations
  totalAreaM2: number;
  totalLinearMetersEdgeBanding: number;
}

// Constants
const PANEL_THICKNESS_MM = 18;
const SHELF_CLEARANCE_MM = 4;
const DEPTH_REDUCTION_MM = 20;
const DOOR_CLEARANCE_MM = 2; // Gap between door and frame
const EDGE_BANDING_WIDTH_MM = 2; // Width of edge banding strip

/**
 * Calculate all dimensions for a cabinet configuration
 * This is the main entry point - all other components should use this function
 */
export function calculateDimensions(input: DimensionInput): DimensionOutput {
  // Validate input
  validateInput(input);
  
  // Calculate outer dimensions (same as input)
  const outerWidthMm = input.widthMm;
  const outerHeightMm = input.heightMm;
  const outerDepthMm = input.depthMm;
  
  // Calculate inner dimensions (usable space inside the cabinet)
  const innerWidthMm = outerWidthMm - (PANEL_THICKNESS_MM * 2); // Subtract left and right panels
  const innerHeightMm = outerHeightMm - (PANEL_THICKNESS_MM * 2); // Subtract top and bottom panels
  const innerDepthMm = outerDepthMm - DEPTH_REDUCTION_MM; // Subtract space for back panel and hardware
  
  // Calculate side panel dimensions
  const sidePanelWidthMm = outerDepthMm;
  const sidePanelHeightMm = outerHeightMm;
  
  // Calculate top and bottom panel dimensions
  const topPanelWidthMm = outerWidthMm;
  const topPanelHeightMm = outerDepthMm;
  const bottomPanelWidthMm = outerWidthMm;
  const bottomPanelHeightMm = outerDepthMm;
  
  // Calculate compartment dimensions
  const compartmentWidthMm = innerWidthMm / input.numberOfCompartments;
  const compartmentHeightMm = innerHeightMm;
  
  // Calculate shelf dimensions
  const shelfWidthMm = compartmentWidthMm - SHELF_CLEARANCE_MM;
  const shelfDepthMm = innerDepthMm;
  
  // Calculate door dimensions
  const doorWidthMm = (compartmentWidthMm - DOOR_CLEARANCE_MM) / input.numberOfDoors;
  const doorHeightMm = compartmentHeightMm - DOOR_CLEARANCE_MM;
  
  // Calculate drawer dimensions
  const drawerWidthMm = compartmentWidthMm - SHELF_CLEARANCE_MM;
  const drawerHeightMm = Math.max(50, compartmentHeightMm / (input.numberOfDrawers + 1)); // Minimum 50mm drawer height
  const drawerDepthMm = innerDepthMm;
  
  // Calculate sloped geometry for loft cabinets
  let slopedGeometry: DimensionOutput["slopedGeometry"] | undefined;
  if (input.cabinetType === "loft-cabinet" && input.shape !== "straight") {
    const leftHeightMm = input.loftHeightLeftMm || outerHeightMm;
    const rightHeightMm = input.loftHeightRightMm || outerHeightMm;
    const heightDifferenceMm = Math.abs(rightHeightMm - leftHeightMm);
    
    // Use Pythagorean theorem: c² = a² + b²
    // where a = width, b = height difference
    const slopedSideLengthMm = Math.sqrt(
      Math.pow(outerWidthMm, 2) + Math.pow(heightDifferenceMm, 2)
    );
    
    slopedGeometry = {
      heightDifferenceMm,
      slopedSideLengthMm,
      leftHeightMm,
      rightHeightMm,
    };
  }
  
  // Calculate panel counts
  const sidePanelCount = 2; // Left and right
  const dividerCount = Math.max(0, input.numberOfCompartments - 1);
  const shelfCount = input.numberOfShelves * input.numberOfCompartments;
  const totalPanelCount = sidePanelCount + 2 + dividerCount + shelfCount; // +2 for top and bottom
  
  // Calculate total material area (in m²)
  let totalAreaM2 = 0;
  
  // Side panels
  totalAreaM2 += (sidePanelWidthMm * sidePanelHeightMm * sidePanelCount) / 1_000_000;
  
  // Top and bottom panels
  totalAreaM2 += (topPanelWidthMm * topPanelHeightMm * 2) / 1_000_000;
  
  // Dividers
  if (dividerCount > 0) {
    totalAreaM2 += (sidePanelWidthMm * compartmentHeightMm * dividerCount) / 1_000_000;
  }
  
  // Shelves
  if (shelfCount > 0) {
    totalAreaM2 += (shelfWidthMm * shelfDepthMm * shelfCount) / 1_000_000;
  }
  
  // Calculate linear meters of edge banding needed
  // Edge banding is applied to exposed edges of shelves and dividers
  let totalLinearMetersEdgeBanding = 0;
  
  // Shelf front edges
  if (shelfCount > 0) {
    totalLinearMetersEdgeBanding += (shelfWidthMm / 1000) * shelfCount;
  }
  
  // Divider front edges
  if (dividerCount > 0) {
    totalLinearMetersEdgeBanding += (compartmentHeightMm / 1000) * dividerCount;
  }
  
  return {
    // Outer dimensions
    outerWidthMm,
    outerHeightMm,
    outerDepthMm,
    
    // Inner dimensions
    innerWidthMm,
    innerHeightMm,
    innerDepthMm,
    
    // Panel dimensions
    sidePanelWidthMm,
    sidePanelHeightMm,
    topPanelWidthMm,
    topPanelHeightMm,
    bottomPanelWidthMm,
    bottomPanelHeightMm,
    
    // Compartment dimensions
    compartmentWidthMm,
    compartmentHeightMm,
    
    // Shelf dimensions
    shelfWidthMm,
    shelfDepthMm,
    
    // Door dimensions
    doorWidthMm,
    doorHeightMm,
    
    // Drawer dimensions
    drawerWidthMm,
    drawerHeightMm,
    drawerDepthMm,
    
    // Sloped geometry
    slopedGeometry,
    
    // Panel counts
    totalPanelCount,
    sidePanelCount,
    shelfCount,
    dividerCount,
    
    // Material calculations
    totalAreaM2,
    totalLinearMetersEdgeBanding,
  };
}

/**
 * Validate input dimensions against cabinet-specific rules
 */
function validateInput(input: DimensionInput): void {
  const errors: string[] = [];
  
  // General validation
  if (input.widthMm < 600) errors.push("Breedte moet minimaal 600 mm zijn");
  if (input.widthMm > 4000) errors.push("Breedte mag maximaal 4000 mm zijn");
  
  if (input.heightMm < 300) errors.push("Hoogte moet minimaal 300 mm zijn");
  if (input.heightMm > 2600) errors.push("Hoogte mag maximaal 2600 mm zijn");
  
  if (input.depthMm < 300) errors.push("Diepte moet minimaal 300 mm zijn");
  if (input.depthMm > 700) errors.push("Diepte mag maximaal 700 mm zijn");
  
  // Cabinet-specific validation
  switch (input.cabinetType) {
    case "tv-furniture":
      if (input.heightMm < 300) errors.push("TV-meubel hoogte moet minimaal 300 mm zijn");
      if (input.heightMm > 900) errors.push("TV-meubel hoogte mag maximaal 900 mm zijn");
      break;
      
    case "loft-cabinet":
      if (input.loftHeightLeftMm && input.loftHeightLeftMm < 400) {
        errors.push("Zolderkast linker hoogte moet minimaal 400 mm zijn");
      }
      if (input.loftHeightRightMm && input.loftHeightRightMm < 400) {
        errors.push("Zolderkast rechter hoogte moet minimaal 400 mm zijn");
      }
      if (input.loftHeightLeftMm && input.loftHeightRightMm) {
        const diff = Math.abs(input.loftHeightRightMm - input.loftHeightLeftMm);
        if (diff > 1500) {
          errors.push("Verschil tussen linker en rechter hoogte mag maximaal 1500 mm zijn");
        }
      }
      break;
  }
  
  if (errors.length > 0) {
    throw new Error(`Validatiefouten:\n${errors.join("\n")}`);
  }
}

/**
 * Get validation rules for a specific cabinet type
 */
export function getValidationRules(cabinetType: string): {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  minDepth: number;
  maxDepth: number;
} {
  switch (cabinetType) {
    case "tv-furniture":
      return {
        minWidth: 800,
        maxWidth: 4000,
        minHeight: 300,
        maxHeight: 900,
        minDepth: 300,
        maxDepth: 700,
      };
    case "shoe-cabinet":
      return {
        minWidth: 600,
        maxWidth: 2000,
        minHeight: 400,
        maxHeight: 1500,
        minDepth: 300,
        maxDepth: 500,
      };
    case "loft-cabinet":
      return {
        minWidth: 600,
        maxWidth: 3000,
        minHeight: 800,
        maxHeight: 2600,
        minDepth: 300,
        maxDepth: 700,
      };
    case "wardrobe":
    default:
      return {
        minWidth: 600,
        maxWidth: 3000,
        minHeight: 1200,
        maxHeight: 2600,
        minDepth: 300,
        maxDepth: 700,
      };
  }
}
