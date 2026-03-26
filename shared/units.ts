/**
 * Unit conversion utilities
 * Internal system uses millimeters (mm)
 * UI displays centimeters (cm)
 */

/**
 * Convert centimeters to millimeters
 * @param cm Value in centimeters
 * @returns Value in millimeters
 */
export function cmToMm(cm: number): number {
  if (!Number.isFinite(cm)) return 0;
  return Math.round(cm * 10);
}

/**
 * Convert millimeters to centimeters
 * @param mm Value in millimeters
 * @returns Value in centimeters
 */
export function mmToCm(mm: number): number {
  if (!Number.isFinite(mm)) return 0;
  return mm / 10;
}

/**
 * Format millimeters as centimeters for display
 * @param mm Value in millimeters
 * @returns Formatted string (e.g., "200 cm")
 */
export function formatMmAsCm(mm: number): string {
  return `${mmToCm(mm)} cm`;
}

/**
 * Format millimeters as millimeters for display
 * @param mm Value in millimeters
 * @returns Formatted string (e.g., "2000 mm")
 */
export function formatMm(mm: number): string {
  return `${mm} mm`;
}

/**
 * Validate that a value is within a range (in mm)
 */
export function isWithinRange(value: number, minMm: number, maxMm: number): boolean {
  return value >= minMm && value <= maxMm;
}

/**
 * Clamp a value to a range (in mm)
 */
export function clampMm(value: number, minMm: number, maxMm: number): number {
  return Math.max(minMm, Math.min(maxMm, value));
}
