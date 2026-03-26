/**
 * Cabinet type defaults and validation rules
 * Ensures consistent, professional cabinet configurations
 */

export type CabinetType = 'wardrobe' | 'tv-furniture' | 'shoe-cabinet' | 'loft-cabinet' | 'stairs';

export interface CabinetDefaults {
  width: number;
  height: number;
  depth: number;
  shelves: number;
  doors: number;
  drawers: number;
}

export interface ValidationRules {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  minDepth: number;
  maxDepth: number;
}

export const CABINET_DEFAULTS: Record<CabinetType, CabinetDefaults> = {
  wardrobe: {
    width: 200,
    height: 240,
    depth: 60,
    shelves: 3,
    doors: 2,
    drawers: 1,
  },
  'tv-furniture': {
    width: 180,
    height: 55,
    depth: 45,
    shelves: 2,
    doors: 0,
    drawers: 2,
  },
  'shoe-cabinet': {
    width: 100,
    height: 120,
    depth: 35,
    shelves: 5,
    doors: 1,
    drawers: 0,
  },
  'loft-cabinet': {
    width: 150,
    height: 200,
    depth: 50,
    shelves: 3,
    doors: 1,
    drawers: 0,
  },
  stairs: {
    width: 120,
    height: 280,
    depth: 30,
    shelves: 0,
    doors: 0,
    drawers: 0,
  },
};

export const VALIDATION_RULES: ValidationRules = {
  minWidth: 40,
  maxWidth: 400,
  minHeight: 40,
  maxHeight: 300,
  minDepth: 20,
  maxDepth: 80,
};

/**
 * Validate cabinet dimensions
 */
export function validateDimensions(
  width: number,
  height: number,
  depth: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (width < VALIDATION_RULES.minWidth || width > VALIDATION_RULES.maxWidth) {
    errors.push(`Breedte moet tussen ${VALIDATION_RULES.minWidth} cm en ${VALIDATION_RULES.maxWidth} cm liggen.`);
  }

  if (height < VALIDATION_RULES.minHeight || height > VALIDATION_RULES.maxHeight) {
    errors.push(`Hoogte moet tussen ${VALIDATION_RULES.minHeight} cm en ${VALIDATION_RULES.maxHeight} cm liggen.`);
  }

  if (depth < VALIDATION_RULES.minDepth || depth > VALIDATION_RULES.maxDepth) {
    errors.push(`Diepte moet tussen ${VALIDATION_RULES.minDepth} cm en ${VALIDATION_RULES.maxDepth} cm liggen.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Clamp value to min/max bounds
 */
export function clampDimension(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Get defaults for a specific cabinet type
 */
export function getDefaultsForType(type: CabinetType): CabinetDefaults {
  return CABINET_DEFAULTS[type];
}

/**
 * Get available options for a specific cabinet type
 */
export function getAvailableOptions(type: CabinetType): string[] {
  const optionsByType: Record<CabinetType, string[]> = {
    wardrobe: ['hanging-rail', 'shelves', 'drawers', 'doors', 'mirrors', 'lighting'],
    'tv-furniture': ['open-shelves', 'drawers', 'cable-management', 'lighting'],
    'shoe-cabinet': ['shoe-shelves', 'drawers', 'doors', 'lighting'],
    'loft-cabinet': ['sloped-sides', 'shelves', 'drawers', 'doors'],
    stairs: ['storage-drawers', 'lighting', 'handrail'],
  };

  return optionsByType[type] || [];
}

/**
 * Get default layout for a specific cabinet type
 */
export function getDefaultLayout(type: CabinetType): Record<string, number> {
  const layoutByType: Record<CabinetType, Record<string, number>> = {
    wardrobe: {
      'hanging-rail': 1,
      'shelves': 3,
      'drawers': 1,
    },
    'tv-furniture': {
      'open-shelves': 2,
      'drawers': 2,
    },
    'shoe-cabinet': {
      'shoe-shelves': 5,
      'drawers': 1,
    },
    'loft-cabinet': {
      'shelves': 3,
      'drawers': 1,
    },
    stairs: {
      'storage-drawers': 2,
    },
  };

  return layoutByType[type] || {};
}
