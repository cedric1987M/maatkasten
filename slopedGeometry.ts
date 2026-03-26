/**
 * Sloped Geometry Calculator for Loft Cabinets
 * 
 * Handles calculations for loft cabinets with sloped sides.
 * Uses Pythagorean theorem to calculate hypotenuse and panel dimensions.
 */

export interface SlopedDimensions {
  // Heights at each end
  leftHeightMm: number;
  rightHeightMm: number;
  heightDifferenceMm: number;
  
  // Sloped side panel
  slopedSideLengthMm: number; // Hypotenuse
  slopedSideAngleDegrees: number;
  
  // Horizontal dimensions
  widthMm: number;
  depthMm: number;
  
  // Panel dimensions for sloped sides
  // These are the actual panel dimensions needed to cut
  slopedLeftPanelWidthMm: number; // Depth dimension
  slopedLeftPanelHeightMm: number; // Sloped length
  slopedRightPanelWidthMm: number; // Depth dimension
  slopedRightPanelHeightMm: number; // Sloped length
  
  // Top panel (trapezoid shape)
  topPanelLeftHeightMm: number;
  topPanelRightHeightMm: number;
  topPanelWidthMm: number;
  topPanelDepthMm: number;
  
  // Bottom panel (rectangle)
  bottomPanelWidthMm: number;
  bottomPanelDepthMm: number;
  
  // Shelf dimensions (for shelves parallel to bottom)
  shelfWidthMm: number;
  shelfDepthMm: number;
  
  // Divider dimensions (vertical dividers - affected by slope)
  // Dividers need to follow the slope
  dividerLeftHeightMm: number;
  dividerRightHeightMm: number;
  dividerWidthMm: number;
  
  // Useful info for construction
  isLeftSloped: boolean; // true if left side is higher
  isRightSloped: boolean; // true if right side is higher
}

/**
 * Calculate all dimensions for a sloped loft cabinet
 * 
 * @param widthMm Cabinet width
 * @param depthMm Cabinet depth
 * @param leftHeightMm Height at left side
 * @param rightHeightMm Height at right side
 * @param numberOfCompartments Number of vertical compartments
 * @returns SlopedDimensions object with all calculated dimensions
 */
export function calculateSlopedDimensions(
  widthMm: number,
  depthMm: number,
  leftHeightMm: number,
  rightHeightMm: number,
  numberOfCompartments: number = 1
): SlopedDimensions {
  // Validate inputs
  if (leftHeightMm < 400 || rightHeightMm < 400) {
    throw new Error("Minimum height for sloped cabinet is 400mm");
  }
  
  if (Math.abs(leftHeightMm - rightHeightMm) > 1500) {
    throw new Error("Height difference cannot exceed 1500mm");
  }
  
  const heightDifferenceMm = Math.abs(rightHeightMm - leftHeightMm);
  const isLeftSloped = leftHeightMm > rightHeightMm;
  const isRightSloped = rightHeightMm > leftHeightMm;
  
  // Calculate sloped side length using Pythagorean theorem
  // c² = a² + b²
  // where a = width, b = height difference
  const slopedSideLengthMm = Math.sqrt(
    Math.pow(widthMm, 2) + Math.pow(heightDifferenceMm, 2)
  );
  
  // Calculate angle of slope in degrees
  const slopedSideAngleDegrees = Math.atan2(heightDifferenceMm, widthMm) * (180 / Math.PI);
  
  // Panel thickness constant
  const PANEL_THICKNESS_MM = 18;
  const SHELF_CLEARANCE_MM = 4;
  const DEPTH_REDUCTION_MM = 20;
  
  // Calculate inner dimensions
  const innerWidthMm = widthMm - (PANEL_THICKNESS_MM * 2);
  const innerDepthMm = depthMm - DEPTH_REDUCTION_MM;
  
  // Sloped side panels
  const slopedLeftPanelWidthMm = depthMm;
  const slopedLeftPanelHeightMm = slopedSideLengthMm;
  const slopedRightPanelWidthMm = depthMm;
  const slopedRightPanelHeightMm = slopedSideLengthMm;
  
  // Top panel (trapezoid)
  const topPanelLeftHeightMm = depthMm;
  const topPanelRightHeightMm = depthMm;
  const topPanelWidthMm = widthMm;
  const topPanelDepthMm = depthMm;
  
  // Bottom panel (rectangle)
  const bottomPanelWidthMm = widthMm;
  const bottomPanelDepthMm = depthMm;
  
  // Shelf dimensions (parallel to bottom)
  const compartmentWidthMm = innerWidthMm / numberOfCompartments;
  const shelfWidthMm = compartmentWidthMm - SHELF_CLEARANCE_MM;
  const shelfDepthMm = innerDepthMm;
  
  // Divider dimensions (vertical dividers follow the slope)
  const dividerLeftHeightMm = leftHeightMm - PANEL_THICKNESS_MM;
  const dividerRightHeightMm = rightHeightMm - PANEL_THICKNESS_MM;
  const dividerWidthMm = depthMm;
  
  return {
    // Heights
    leftHeightMm,
    rightHeightMm,
    heightDifferenceMm,
    
    // Sloped side
    slopedSideLengthMm,
    slopedSideAngleDegrees,
    
    // Horizontal
    widthMm,
    depthMm,
    
    // Sloped panels
    slopedLeftPanelWidthMm,
    slopedLeftPanelHeightMm,
    slopedRightPanelWidthMm,
    slopedRightPanelHeightMm,
    
    // Top panel
    topPanelLeftHeightMm,
    topPanelRightHeightMm,
    topPanelWidthMm,
    topPanelDepthMm,
    
    // Bottom panel
    bottomPanelWidthMm,
    bottomPanelDepthMm,
    
    // Shelves
    shelfWidthMm,
    shelfDepthMm,
    
    // Dividers
    dividerLeftHeightMm,
    dividerRightHeightMm,
    dividerWidthMm,
    
    // Info
    isLeftSloped,
    isRightSloped,
  };
}

/**
 * Calculate the height at a specific horizontal position along the slope
 * Useful for calculating intermediate panel heights
 * 
 * @param leftHeightMm Height at left side (x=0)
 * @param rightHeightMm Height at right side (x=width)
 * @param widthMm Total width
 * @param xPositionMm Position along width (0 to widthMm)
 * @returns Height at that position
 */
export function getHeightAtPosition(
  leftHeightMm: number,
  rightHeightMm: number,
  widthMm: number,
  xPositionMm: number
): number {
  if (xPositionMm < 0 || xPositionMm > widthMm) {
    throw new Error("Position must be between 0 and width");
  }
  
  // Linear interpolation
  const ratio = xPositionMm / widthMm;
  return leftHeightMm + (rightHeightMm - leftHeightMm) * ratio;
}

/**
 * Calculate panel area for a sloped panel
 * Sloped panels are parallelograms
 * 
 * @param widthMm Width of the panel (perpendicular to slope)
 * @param slopedLengthMm Length along the slope (hypotenuse)
 * @returns Area in mm²
 */
export function calculateSlopedPanelArea(widthMm: number, slopedLengthMm: number): number {
  return widthMm * slopedLengthMm;
}

/**
 * Calculate the cutting angle for sloped panels
 * This is the angle at which the panel needs to be cut at the top
 * 
 * @param heightDifferenceMm Difference in height between left and right
 * @param widthMm Width of the cabinet
 * @returns Angle in degrees
 */
export function calculateCuttingAngle(heightDifferenceMm: number, widthMm: number): number {
  return Math.atan2(heightDifferenceMm, widthMm) * (180 / Math.PI);
}

/**
 * Validate sloped cabinet dimensions
 * 
 * @param leftHeightMm Height at left
 * @param rightHeightMm Height at right
 * @param widthMm Cabinet width
 * @returns Array of error messages (empty if valid)
 */
export function validateSlopedDimensions(
  leftHeightMm: number,
  rightHeightMm: number,
  widthMm: number
): string[] {
  const errors: string[] = [];
  
  if (leftHeightMm < 400) {
    errors.push("Linker hoogte moet minimaal 400mm zijn");
  }
  
  if (rightHeightMm < 400) {
    errors.push("Rechter hoogte moet minimaal 400mm zijn");
  }
  
  if (leftHeightMm > 2600) {
    errors.push("Linker hoogte mag maximaal 2600mm zijn");
  }
  
  if (rightHeightMm > 2600) {
    errors.push("Rechter hoogte mag maximaal 2600mm zijn");
  }
  
  const heightDifference = Math.abs(rightHeightMm - leftHeightMm);
  if (heightDifference > 1500) {
    errors.push("Verschil tussen linker en rechter hoogte mag maximaal 1500mm zijn");
  }
  
  if (widthMm < 600) {
    errors.push("Breedte moet minimaal 600mm zijn");
  }
  
  if (widthMm > 3000) {
    errors.push("Breedte mag maximaal 3000mm zijn");
  }
  
  return errors;
}
