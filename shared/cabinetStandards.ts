/**
 * CENTRALIZED CABINET STANDARDS
 * Single source of truth for all cabinet dimensions, defaults, and validation rules
 * All values in CENTIMETERS for UI/user input
 * Backend converts to millimeters internally
 */

export type CabinetType = 'wardrobe' | 'tv-furniture' | 'shoe-cabinet' | 'loft-cabinet' | 'stairs';
export type MaterialType = 'white_melamine' | 'oak' | 'walnut' | 'black_melamine' | 'gray_melamine';
export type DoorHardwareType = 'push_to_open' | 'handle' | 'knob';

export interface CabinetStandard {
  name: string;
  description: string;
  defaultWidth: number;   // cm
  defaultHeight: number;  // cm
  defaultDepth: number;   // cm
  defaultShelves: number;
  defaultDoors: number;
  defaultDrawers: number;
  minWidth: number;       // cm
  maxWidth: number;       // cm
  minHeight: number;      // cm
  maxHeight: number;      // cm
  minDepth: number;       // cm
  maxDepth: number;       // cm
}

/**
 * OFFICIAL CABINET STANDARDS
 * These are the ONLY correct values - all other modules must use these
 */
export const CABINET_STANDARDS: Record<CabinetType, CabinetStandard> = {
  wardrobe: {
    name: 'Kledingkast',
    description: 'Standaard kledingkast met hangers en planken',
    defaultWidth: 200,
    defaultHeight: 220,
    defaultDepth: 60,
    defaultShelves: 3,
    defaultDoors: 2,
    defaultDrawers: 1,
    minWidth: 50,
    maxWidth: 500,
    minHeight: 50,
    maxHeight: 300,
    minDepth: 20,
    maxDepth: 80,
  },
  'tv-furniture': {
    name: 'TV Meubel',
    description: 'Lage kast voor televisie en media',
    defaultWidth: 200,
    defaultHeight: 45,
    defaultDepth: 40,
    defaultShelves: 2,
    defaultDoors: 0,
    defaultDrawers: 2,
    minWidth: 50,
    maxWidth: 500,
    minHeight: 30,
    maxHeight: 150,
    minDepth: 20,
    maxDepth: 80,
  },
  'shoe-cabinet': {
    name: 'Schoenenkast',
    description: 'Kast voor schoenen met meerdere planken',
    defaultWidth: 120,
    defaultHeight: 120,
    defaultDepth: 40,
    defaultShelves: 5,
    defaultDoors: 1,
    defaultDrawers: 0,
    minWidth: 50,
    maxWidth: 300,
    minHeight: 50,
    maxHeight: 300,
    minDepth: 20,
    maxDepth: 80,
  },
  'loft-cabinet': {
    name: 'Zolderkast',
    description: 'Kast voor zolders met schuine zijden',
    defaultWidth: 200,
    defaultHeight: 100,
    defaultDepth: 60,
    defaultShelves: 3,
    defaultDoors: 1,
    defaultDrawers: 0,
    minWidth: 50,
    maxWidth: 400,
    minHeight: 50,
    maxHeight: 300,
    minDepth: 20,
    maxDepth: 80,
  },
  stairs: {
    name: 'Trap',
    description: 'Trap met opbergvakken',
    defaultWidth: 120,
    defaultHeight: 280,
    defaultDepth: 30,
    defaultShelves: 0,
    defaultDoors: 0,
    defaultDrawers: 0,
    minWidth: 50,
    maxWidth: 300,
    minHeight: 150,
    maxHeight: 400,
    minDepth: 20,
    maxDepth: 80,
  },
};

/**
 * Get standard for a cabinet type
 */
export function getStandard(type: CabinetType): CabinetStandard {
  return CABINET_STANDARDS[type];
}

/**
 * Get all cabinet types
 */
export function getAllCabinetTypes(): CabinetType[] {
  return Object.keys(CABINET_STANDARDS) as CabinetType[];
}

/**
 * Validate dimensions against standards
 */
export function validateDimensions(
  type: CabinetType,
  width: number,
  height: number,
  depth: number
): { valid: boolean; errors: string[] } {
  const standard = CABINET_STANDARDS[type];
  const errors: string[] = [];

  if (width < standard.minWidth || width > standard.maxWidth) {
    errors.push(`Breedte moet tussen ${standard.minWidth} cm en ${standard.maxWidth} cm liggen.`);
  }

  if (height < standard.minHeight || height > standard.maxHeight) {
    errors.push(`Hoogte moet tussen ${standard.minHeight} cm en ${standard.maxHeight} cm liggen.`);
  }

  if (depth < standard.minDepth || depth > standard.maxDepth) {
    errors.push(`Diepte moet tussen ${standard.minDepth} cm en ${standard.maxDepth} cm liggen.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Clamp dimension to valid range
 */
export function clampDimension(
  type: CabinetType,
  dimension: 'width' | 'height' | 'depth',
  value: number
): number {
  const standard = CABINET_STANDARDS[type];
  const key = `min${dimension.charAt(0).toUpperCase() + dimension.slice(1)}` as keyof CabinetStandard;
  const maxKey = `max${dimension.charAt(0).toUpperCase() + dimension.slice(1)}` as keyof CabinetStandard;
  
  const min = standard[key] as number;
  const max = standard[maxKey] as number;
  
  return Math.max(min, Math.min(max, value));
}

/**
 * Get default configuration for a cabinet type
 */
export function getDefaults(type: CabinetType) {
  const standard = CABINET_STANDARDS[type];
  return {
    width: standard.defaultWidth,
    height: standard.defaultHeight,
    depth: standard.defaultDepth,
    numberOfShelves: standard.defaultShelves,
    numberOfDoors: standard.defaultDoors,
    numberOfDrawers: standard.defaultDrawers,
  };
}

/**
 * Convert cm to mm (for backend)
 */
export function cmToMm(cm: number): number {
  return Math.round(cm * 10);
}

/**
 * Convert mm to cm (for UI)
 */
export function mmToCm(mm: number): number {
  return mm / 10;
}


/**
 * MATERIAL COMPATIBILITY RULES
 * Defines which materials are available for each cabinet type
 */
export const MATERIAL_COMPATIBILITY: Record<CabinetType, MaterialType[]> = {
  wardrobe: ['white_melamine', 'oak', 'walnut', 'black_melamine', 'gray_melamine'],
  'tv-furniture': ['white_melamine', 'oak', 'walnut', 'black_melamine', 'gray_melamine'],
  'shoe-cabinet': ['white_melamine', 'oak', 'walnut', 'gray_melamine'],
  'loft-cabinet': ['white_melamine', 'oak', 'walnut'],
  stairs: ['oak', 'walnut'],
};

/**
 * DOOR HARDWARE COMPATIBILITY
 * Defines which door hardware options are available for each cabinet type
 */
export const DOOR_HARDWARE_COMPATIBILITY: Record<CabinetType, DoorHardwareType[]> = {
  wardrobe: ['push_to_open', 'handle', 'knob'],
  'tv-furniture': ['push_to_open', 'handle'],
  'shoe-cabinet': ['push_to_open', 'handle', 'knob'],
  'loft-cabinet': ['push_to_open', 'handle'],
  stairs: [],
};

/**
 * OPTION AVAILABILITY RULES
 * Defines which options are available for each cabinet type
 */
export interface OptionAvailability {
  canHaveDoors: boolean;
  canHaveDrawers: boolean;
  canHaveClothingRail: boolean;
  canHaveShelves: boolean;
  maxShelves: number;
  maxDoors: number;
  maxDrawers: number;
}

export const OPTION_AVAILABILITY: Record<CabinetType, OptionAvailability> = {
  wardrobe: {
    canHaveDoors: true,
    canHaveDrawers: true,
    canHaveClothingRail: true,
    canHaveShelves: true,
    maxShelves: 10,
    maxDoors: 4,
    maxDrawers: 4,
  },
  'tv-furniture': {
    canHaveDoors: true,
    canHaveDrawers: true,
    canHaveClothingRail: false,
    canHaveShelves: true,
    maxShelves: 5,
    maxDoors: 4,
    maxDrawers: 4,
  },
  'shoe-cabinet': {
    canHaveDoors: true,
    canHaveDrawers: false,
    canHaveClothingRail: false,
    canHaveShelves: true,
    maxShelves: 10,
    maxDoors: 2,
    maxDrawers: 0,
  },
  'loft-cabinet': {
    canHaveDoors: true,
    canHaveDrawers: false,
    canHaveClothingRail: false,
    canHaveShelves: true,
    maxShelves: 8,
    maxDoors: 2,
    maxDrawers: 0,
  },
  stairs: {
    canHaveDoors: false,
    canHaveDrawers: false,
    canHaveClothingRail: false,
    canHaveShelves: false,
    maxShelves: 0,
    maxDoors: 0,
    maxDrawers: 0,
  },
};

/**
 * Check if a material is compatible with a cabinet type
 */
export function isMaterialCompatible(type: CabinetType, material: MaterialType): boolean {
  return MATERIAL_COMPATIBILITY[type].includes(material);
}

/**
 * Get available materials for a cabinet type
 */
export function getAvailableMaterials(type: CabinetType): MaterialType[] {
  return MATERIAL_COMPATIBILITY[type];
}

/**
 * Check if door hardware is compatible with a cabinet type
 */
export function isDoorHardwareCompatible(type: CabinetType, hardware: DoorHardwareType): boolean {
  return DOOR_HARDWARE_COMPATIBILITY[type].includes(hardware);
}

/**
 * Get available door hardware for a cabinet type
 */
export function getAvailableDoorHardware(type: CabinetType): DoorHardwareType[] {
  return DOOR_HARDWARE_COMPATIBILITY[type];
}

/**
 * Get option availability for a cabinet type
 */
export function getOptionAvailability(type: CabinetType): OptionAvailability {
  return OPTION_AVAILABILITY[type];
}

/**
 * Check if a specific option is available for a cabinet type
 */
export function isOptionAvailable(type: CabinetType, option: keyof OptionAvailability): boolean {
  const availability = OPTION_AVAILABILITY[type];
  if (option.startsWith('can')) {
    return availability[option] as boolean;
  }
  return true;
}

/**
 * Validate configuration compatibility
 */
export function validateConfigurationCompatibility(
  type: CabinetType,
  material: MaterialType,
  doorHardware: DoorHardwareType,
  numberOfDoors: number,
  numberOfDrawers: number,
  numberOfShelves: number,
  hasClothingRail: boolean
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const availability = OPTION_AVAILABILITY[type];

  // Check material compatibility
  if (!isMaterialCompatible(type, material)) {
    errors.push(`Materiaal is niet beschikbaar voor ${CABINET_STANDARDS[type].name}.`);
  }

  // Check door hardware compatibility
  if (numberOfDoors > 0 && !isDoorHardwareCompatible(type, doorHardware)) {
    errors.push(`Deurhardware is niet compatibel met dit kasttype.`);
  }

  // Check doors
  if (!availability.canHaveDoors && numberOfDoors > 0) {
    errors.push(`${CABINET_STANDARDS[type].name} kan geen deuren hebben.`);
  }
  if (numberOfDoors > availability.maxDoors) {
    errors.push(`Maximaal ${availability.maxDoors} deuren toegestaan.`);
  }

  // Check drawers
  if (!availability.canHaveDrawers && numberOfDrawers > 0) {
    errors.push(`${CABINET_STANDARDS[type].name} kan geen laden hebben.`);
  }
  if (numberOfDrawers > availability.maxDrawers) {
    errors.push(`Maximaal ${availability.maxDrawers} laden toegestaan.`);
  }

  // Check shelves
  if (!availability.canHaveShelves && numberOfShelves > 0) {
    errors.push(`${CABINET_STANDARDS[type].name} kan geen planken hebben.`);
  }
  if (numberOfShelves > availability.maxShelves) {
    errors.push(`Maximaal ${availability.maxShelves} planken toegestaan.`);
  }

  // Check clothing rail
  if (!availability.canHaveClothingRail && hasClothingRail) {
    errors.push(`${CABINET_STANDARDS[type].name} kan geen kledingstang hebben.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}


/**
 * EXTREME DIMENSION VALIDATION
 * Defines thresholds for combinations that require manual review
 */
export interface ExtremeDimensionThresholds {
  veryLargeWidth: number;      // Width > this requires review (cm)
  veryLargeHeight: number;     // Height > this requires review (cm)
  verySmallWidth: number;      // Width < this requires review (cm)
  verySmallHeight: number;     // Height < this requires review (cm)
  extremeAspectRatio: number;  // Height/Width ratio threshold
}

export const EXTREME_DIMENSION_THRESHOLDS: ExtremeDimensionThresholds = {
  veryLargeWidth: 350,         // Very wide cabinets (>3.5m) need review
  veryLargeHeight: 280,        // Very tall cabinets (>2.8m) need review
  verySmallWidth: 70,          // Very narrow cabinets (<70cm) need review
  verySmallHeight: 100,        // Very short cabinets (<100cm) need review
  extremeAspectRatio: 3.0,     // Height/Width ratio > 3.0 is extreme
};

/**
 * Check if dimensions require manual review
 * Returns true if the combination is extreme and needs special handling
 */
export function requiresManualReview(
  width: number,
  height: number,
  depth: number,
  type: CabinetType
): { requiresReview: boolean; reason?: string } {
  const thresholds = EXTREME_DIMENSION_THRESHOLDS;

  // Check for very large dimensions
  if (width > thresholds.veryLargeWidth) {
    return {
      requiresReview: true,
      reason: 'Zeer brede afmetingen',
    };
  }

  if (height > thresholds.veryLargeHeight) {
    return {
      requiresReview: true,
      reason: 'Zeer hoge afmetingen',
    };
  }

  // Check for very small dimensions
  if (width < thresholds.verySmallWidth) {
    return {
      requiresReview: true,
      reason: 'Zeer smalle afmetingen',
    };
  }

  if (height < thresholds.verySmallHeight) {
    return {
      requiresReview: true,
      reason: 'Zeer lage afmetingen',
    };
  }

  // Check for extreme aspect ratios (very tall and narrow)
  const aspectRatio = height / width;
  if (aspectRatio > thresholds.extremeAspectRatio) {
    return {
      requiresReview: true,
      reason: 'Extreme verhoudingen (zeer hoog en smal)',
    };
  }

  // Type-specific checks
  if (type === 'stairs' && width < 100) {
    return {
      requiresReview: true,
      reason: 'Trappen moeten minimaal 100cm breed zijn',
    };
  }

  return { requiresReview: false };
}


/**
 * LOFT CABINET SPECIFIC VALIDATION
 * Validates loft cabinet dimensions and slope configuration
 */
export interface LoftCabinetValidation {
  isValid: boolean;
  errors: string[];
}

export function validateLoftCabinet(
  lowSideHeight: number,
  highSideHeight: number,
  width: number,
  depth: number
): LoftCabinetValidation {
  const errors: string[] = [];

  // Validate low side height (100-300cm)
  if (lowSideHeight < 100) {
    errors.push('Lage zijde moet minimaal 100cm zijn');
  }
  if (lowSideHeight > 300) {
    errors.push('Lage zijde mag maximaal 300cm zijn');
  }

  // Validate high side height (100-300cm)
  if (highSideHeight < 100) {
    errors.push('Hoge zijde moet minimaal 100cm zijn');
  }
  if (highSideHeight > 300) {
    errors.push('Hoge zijde mag maximaal 300cm zijn');
  }

  // Validate that high side is higher than low side
  if (highSideHeight <= lowSideHeight) {
    errors.push('Hoge zijde moet hoger zijn dan lage zijde');
  }

  // Validate slope angle is reasonable (max 45 degrees)
  const heightDifference = highSideHeight - lowSideHeight;
  if (heightDifference > width) {
    errors.push('Helling is te steil (meer dan 45 graden)');
  }

  // Validate width and depth are within normal ranges
  if (width < 50 || width > 400) {
    errors.push('Breedte moet tussen 50cm en 400cm zijn');
  }
  if (depth < 20 || depth > 80) {
    errors.push('Diepte moet tussen 20cm en 80cm zijn');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}


/**
 * STAIR SAFETY & COMFORT STANDARDS
 * Based on building codes and ergonomic principles
 * Rise (hoogte per trede): 15-20cm (optimal 17-18cm)
 * Run (diepte per trede): 25-30cm (optimal 28cm)
 * Blondel's Rule: 2×rise + run = 60-65cm (ideal 63cm)
 */
export interface StairSafetyValidation {
  isCompliant: boolean;
  warnings: string[];
  calculatedSteps: number;
  recommendedRise: number;
  recommendedRun: number;
}

export function validateStairSafety(
  totalHeight: number,  // cm
  numberOfSteps: number,
  treadDepth: number    // cm
): StairSafetyValidation {
  const warnings: string[] = [];
  
  // Calculate rise per step
  const risePerStep = totalHeight / numberOfSteps;
  
  // Validate rise per step (optimal 17-18cm, acceptable 15-20cm)
  if (risePerStep < 15) {
    warnings.push('Treden zijn te laag (stijging < 15cm) - oncomfortabel');
  }
  if (risePerStep > 20) {
    warnings.push('Treden zijn te hoog (stijging > 20cm) - onveilig');
  }
  
  // Validate tread depth (optimal 28cm, acceptable 25-30cm)
  if (treadDepth < 25) {
    warnings.push('Treden zijn te ondiep (diepte < 25cm) - onveilig');
  }
  if (treadDepth > 30) {
    warnings.push('Treden zijn te diep (diepte > 30cm) - oncomfortabel');
  }
  
  // Apply Blondel's Rule: 2×rise + run = 60-65cm (ideal 63cm)
  const blondelValue = (2 * risePerStep) + treadDepth;
  if (blondelValue < 60 || blondelValue > 65) {
    warnings.push(`Blondel-regel niet optimaal (2×${risePerStep.toFixed(1)} + ${treadDepth} = ${blondelValue.toFixed(1)}cm, ideaal 63cm)`);
  }
  
  // Validate number of steps based on height
  const minStepsForHeight = Math.ceil(totalHeight / 20);  // Max 20cm per step
  const maxStepsForHeight = Math.floor(totalHeight / 15); // Min 15cm per step
  
  if (numberOfSteps < minStepsForHeight) {
    warnings.push(`Te weinig treden voor deze hoogte (minimum ${minStepsForHeight})`);
  }
  if (numberOfSteps > maxStepsForHeight) {
    warnings.push(`Te veel treden voor deze hoogte (maximum ${maxStepsForHeight})`);
  }
  
  // Calculate recommended values
  const recommendedRise = Math.round(totalHeight / numberOfSteps);
  const recommendedRun = Math.max(25, Math.min(30, 63 - (2 * recommendedRise)));
  
  return {
    isCompliant: warnings.length === 0,
    warnings,
    calculatedSteps: numberOfSteps,
    recommendedRise,
    recommendedRun,
  };
}

/**
 * Calculate optimal number of steps for a given height
 */
export function calculateOptimalSteps(totalHeight: number): number {
  // Optimal rise is 17-18cm
  const optimalRise = 17.5;
  return Math.round(totalHeight / optimalRise);
}

/**
 * Calculate optimal tread depth based on rise (using Blondel's rule)
 */
export function calculateOptimalTreadDepth(risePerStep: number): number {
  // Blondel's rule: 2×rise + run = 63cm (ideal)
  const optimalRun = 63 - (2 * risePerStep);
  // Clamp to safe range
  return Math.max(25, Math.min(30, optimalRun));
}


/**
 * AUTOMATIC STAIR CALCULATION
 * Given total height and available length, calculate optimal stair configuration
 */
export interface StairCalculation {
  numberOfSteps: number;
  risePerStep: number;
  treadDepth: number;
  totalLength: number;
  isOptimal: boolean;
  warnings: string[];
}

/**
 * Calculate optimal stair configuration from height and available length
 * Prioritizes comfort and safety using Blondel's rule
 */
export function calculateOptimalStairConfig(
  totalHeight: number,  // cm
  availableLength: number  // cm (horizontal space available)
): StairCalculation {
  const warnings: string[] = [];
  
  // Step 1: Calculate optimal number of steps (17-21cm rise is comfortable)
  // Using 18.5cm as optimal starting point
  const optimalRise = 18.5;
  let numberOfSteps = Math.round(totalHeight / optimalRise);
  
  // Clamp to safe range
  numberOfSteps = Math.max(3, Math.min(30, numberOfSteps));
  
  // Step 2: Calculate actual rise per step
  const risePerStep = Math.round((totalHeight / numberOfSteps) * 10) / 10;
  
  // Step 3: Calculate optimal tread depth using Blondel's rule
  // Blondel: 2×rise + run = 63cm (ideal)
  let treadDepth = 63 - (2 * risePerStep);
  // Clamp to safe range: 22-30cm (aantrede)
  treadDepth = Math.max(22, Math.min(30, treadDepth));
  
  // Step 4: Calculate total length needed
  // Total length = (numberOfSteps - 1) × treadDepth
  // (We subtract 1 because the last step doesn't need a tread depth after it)
  const totalLengthNeeded = (numberOfSteps - 1) * treadDepth;
  
  // Step 5: Validate against available length
  let isOptimal = true;
  if (totalLengthNeeded > availableLength) {
    warnings.push(`Beschikbare lengte is te kort (${availableLength}cm). Nodig: ${Math.ceil(totalLengthNeeded)}cm`);
    isOptimal = false;
    
    // Recalculate with available length constraint
    const maxTreadDepth = Math.floor(availableLength / (numberOfSteps - 1));
    if (maxTreadDepth < 25) {
      warnings.push('Te veel treden voor beschikbare ruimte. Verlaag aantal treden of vergroot ruimte.');
      isOptimal = false;
    } else if (maxTreadDepth < treadDepth) {
      treadDepth = Math.max(25, maxTreadDepth);
      warnings.push(`Trede diepte gereduceerd naar ${treadDepth}cm om in beschikbare ruimte te passen`);
    }
  }
  
  // Step 6: Validate rise per step (optrede moet 17-21cm zijn)
  if (risePerStep < 17) {
    warnings.push('Treden zijn te laag (stijging < 17cm). Ideaal: 17-21cm');
    isOptimal = false;
  }
  if (risePerStep > 21) {
    warnings.push('Treden zijn te hoog (stijging > 21cm). Ideaal: 17-21cm');
    isOptimal = false;
  }
  
  // Step 7: Validate Blondel's rule (2×optrede + aantrede ≈ 63cm)
  const blondelValue = (2 * risePerStep) + treadDepth;
  if (Math.abs(blondelValue - 63) > 1.5) {
    warnings.push(`Blondel-regel afwijking: ${blondelValue.toFixed(1)}cm (ideaal 63cm). Deze trap voldoet mogelijk niet aan standaard comfortregels. Wij controleren dit verder.`);
    isOptimal = false;
  }
  
  return {
    numberOfSteps,
    risePerStep,
    treadDepth,
    totalLength: (numberOfSteps - 1) * treadDepth,
    isOptimal,
    warnings,
  };
}

/**
 * Validate if a stair configuration fits within available space
 */
export function validateStairSpace(
  numberOfSteps: number,
  treadDepth: number,
  availableLength: number
): boolean {
  const totalLengthNeeded = (numberOfSteps - 1) * treadDepth;
  return totalLengthNeeded <= availableLength;
}


/**
 * IMPOSSIBLE COMBINATION DETECTION
 * Prevents selection of configurations that are not buildable or realistic
 */
export interface ImpossibleCombinationCheck {
  isImpossible: boolean;
  reason?: string;
}

export function checkImpossibleCombinations(
  cabinetType: CabinetType,
  width: number,
  height: number,
  depth: number,
  hasDrawers: boolean,
  hasDoors: boolean,
  numberOfShelves: number,
  numberOfDoors: number
): ImpossibleCombinationCheck {
  
  // Rule 1: Too wide without support (>300cm) requires special reinforcement
  if (width > 300 && numberOfShelves === 0 && !hasDoors) {
    return {
      isImpossible: true,
      reason: 'Te brede kast zonder ondersteuning (planken of deuren)',
    };
  }

  // Rule 2: Too low for drawers (<80cm) - drawers need minimum height
  if (hasDrawers && height < 80) {
    return {
      isImpossible: true,
      reason: 'Te lage kast voor laden (minimum 80cm nodig)',
    };
  }

  // Rule 3: Too narrow for drawers (<50cm) - drawers need minimum width
  if (hasDrawers && width < 50) {
    return {
      isImpossible: true,
      reason: 'Te smalle kast voor laden (minimum 50cm nodig)',
    };
  }

  // Rule 4: Extreme aspect ratio (height > 3× width) without reinforcement
  if (height > width * 3 && numberOfShelves < 2) {
    return {
      isImpossible: true,
      reason: 'Extreme verhoudingen (zeer hoog en smal) - extra ondersteuning nodig',
    };
  }

  // Rule 5: Too many shelves for height (more than 1 shelf per 40cm)
  const maxShelvesForHeight = Math.floor(height / 40);
  if (numberOfShelves > maxShelvesForHeight) {
    return {
      isImpossible: true,
      reason: `Te veel planken voor deze hoogte (maximum ${maxShelvesForHeight})`,
    };
  }

  // Rule 6: Too many doors for width (max 1 door per 60cm)
  const maxDoorsForWidth = Math.floor(width / 60);
  if (numberOfDoors > maxDoorsForWidth) {
    return {
      isImpossible: true,
      reason: `Te veel deuren voor deze breedte (maximum ${maxDoorsForWidth})`,
    };
  }

  // Rule 7: Wardrobe with no shelves and no drawers (needs at least one)
  if (cabinetType === 'wardrobe' && numberOfShelves === 0 && !hasDrawers) {
    return {
      isImpossible: true,
      reason: 'Kledingkast moet minstens planken of laden hebben',
    };
  }

  // Rule 8: TV furniture too tall (>150cm) - not practical for TV viewing
  if (cabinetType === 'tv-furniture' && height > 150) {
    return {
      isImpossible: true,
      reason: 'TV meubel te hoog (maximum 150cm aanbevolen)',
    };
  }

  // Rule 9: Shoe cabinet too deep (>40cm) - not practical for shoes
  if (cabinetType === 'shoe-cabinet' && depth > 40) {
    return {
      isImpossible: true,
      reason: 'Schoenenkast te diep (maximum 40cm aanbevolen)',
    };
  }

  // Rule 10: Loft cabinet with unrealistic slope
  if (cabinetType === 'loft-cabinet' && width < 100) {
    return {
      isImpossible: true,
      reason: 'Zolderkast moet minimaal 100cm breed zijn',
    };
  }

  // Rule 11: Cabinet too shallow for doors (<30cm)
  if (hasDoors && depth < 30) {
    return {
      isImpossible: true,
      reason: 'Te ondiepe kast voor deuren (minimum 30cm nodig)',
    };
  }

  // Rule 12: Cabinet too small overall (volume < 0.1 m³)
  const volume = (width * height * depth) / 1000000; // cm³ to m³
  if (volume < 0.1) {
    return {
      isImpossible: true,
      reason: 'Kast te klein (minimum volume 0.1m³)',
    };
  }

  return { isImpossible: false };
}


/**
 * EDGE-CASE DETECTION
 * Identifies configurations that are technically valid but near limits
 * These require extra manual review to ensure quality
 */
export interface EdgeCaseCheck {
  isEdgeCase: boolean;
  reason?: string;
  severity?: 'warning' | 'caution'; // 'warning' for near limits, 'caution' for extreme but valid
}

export function detectEdgeCaseConfiguration(
  cabinetType: CabinetType,
  width: number,
  height: number,
  depth: number,
  numberOfShelves: number,
  numberOfDoors: number,
  hasDrawers: boolean
): EdgeCaseCheck {
  
  const standard = CABINET_STANDARDS[cabinetType];
  
  // Define edge-case thresholds (90% of max for width, 95% of max for height, etc.)
  const widthThreshold = standard.maxWidth * 0.90;
  const heightThreshold = standard.maxHeight * 0.95;
  const depthThreshold = standard.maxDepth * 0.90;
  
  // Edge-case 1: Very wide cabinet (near max width)
  if (width >= widthThreshold) {
    return {
      isEdgeCase: true,
      reason: `Voor deze configuratie nemen wij contact op voor extra controle (zeer brede kast: ${width}cm)`,
      severity: 'caution',
    };
  }
  
  // Edge-case 2: Very tall cabinet (near max height)
  if (height >= heightThreshold) {
    return {
      isEdgeCase: true,
      reason: `Voor deze configuratie nemen wij contact op voor extra controle (zeer hoge kast: ${height}cm)`,
      severity: 'caution',
    };
  }
  
  // Edge-case 3: Very deep cabinet (near max depth)
  if (depth >= depthThreshold) {
    return {
      isEdgeCase: true,
      reason: `Voor deze configuratie nemen wij contact op voor extra controle (zeer diepe kast: ${depth}cm)`,
      severity: 'caution',
    };
  }
  
  // Edge-case 4: Maximum number of doors (near limit)
  const maxDoorsForWidth = Math.floor(width / 60);
  if (numberOfDoors >= maxDoorsForWidth * 0.9 && numberOfDoors > 0) {
    return {
      isEdgeCase: true,
      reason: `Voor deze configuratie nemen wij contact op voor extra controle (veel deuren: ${numberOfDoors})`,
      severity: 'warning',
    };
  }
  
  // Edge-case 5: Maximum number of shelves (near limit)
  const maxShelvesForHeight = Math.floor(height / 40);
  if (numberOfShelves >= maxShelvesForHeight * 0.9 && numberOfShelves > 0) {
    return {
      isEdgeCase: true,
      reason: `Voor deze configuratie nemen wij contact op voor extra controle (veel planken: ${numberOfShelves})`,
      severity: 'warning',
    };
  }
  
  // Edge-case 6: Extreme aspect ratio (height > 2.5× width) but valid
  if (height > width * 2.5 && numberOfShelves >= 1) {
    return {
      isEdgeCase: true,
      reason: `Voor deze configuratie nemen wij contact op voor extra controle (extreme verhouding)`,
      severity: 'caution',
    };
  }
  
  // Edge-case 7: Very small cabinet (near minimum volume)
  const volume = (width * height * depth) / 1000000; // cm³ to m³
  if (volume < 0.15 && volume >= 0.1) {
    return {
      isEdgeCase: true,
      reason: `Voor deze configuratie nemen wij contact op voor extra controle (zeer compact)`,
      severity: 'warning',
    };
  }
  
  // Edge-case 8: Combination of near-limit dimensions
  const nearLimitCount = [
    width >= widthThreshold * 0.95,
    height >= heightThreshold * 0.95,
    depth >= depthThreshold * 0.95,
  ].filter(Boolean).length;
  
  if (nearLimitCount >= 2) {
    return {
      isEdgeCase: true,
      reason: `Voor deze configuratie nemen wij contact op voor extra controle (meerdere extreme afmetingen)`,
      severity: 'caution',
    };
  }
  
  // Edge-case 9: Drawers with near-maximum width
  if (hasDrawers && width >= standard.maxWidth * 0.85) {
    return {
      isEdgeCase: true,
      reason: `Voor deze configuratie nemen wij contact op voor extra controle (brede kast met laden)`,
      severity: 'warning',
    };
  }
  
  // Edge-case 10: Many shelves with maximum height
  if (numberOfShelves >= 4 && height >= standard.maxHeight * 0.90) {
    return {
      isEdgeCase: true,
      reason: `Voor deze configuratie nemen wij contact op voor extra controle (veel planken in hoge kast)`,
      severity: 'caution',
    };
  }
  
  return { isEdgeCase: false };
}


/**
 * FILLER STRIP CONFIGURATION (Passtukken)
 * Filler strips provide perfect wall alignment for cabinets
 */
export interface FillerStripConfig {
  hasLeftFiller: boolean;
  leftFillerWidth?: number;  // cm (1-10cm)
  hasRightFiller: boolean;
  rightFillerWidth?: number; // cm (1-10cm)
}

export const FILLER_STRIP_CONSTRAINTS = {
  minWidth: 1,    // cm
  maxWidth: 10,   // cm
  defaultWidth: 2, // cm
};

/**
 * Validate filler strip configuration
 */
export function validateFillerStrips(config: FillerStripConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (config.hasLeftFiller && config.leftFillerWidth) {
    if (config.leftFillerWidth < FILLER_STRIP_CONSTRAINTS.minWidth) {
      errors.push(`Linker passtuk moet minimaal ${FILLER_STRIP_CONSTRAINTS.minWidth}cm zijn`);
    }
    if (config.leftFillerWidth > FILLER_STRIP_CONSTRAINTS.maxWidth) {
      errors.push(`Linker passtuk mag maximaal ${FILLER_STRIP_CONSTRAINTS.maxWidth}cm zijn`);
    }
  }

  if (config.hasRightFiller && config.rightFillerWidth) {
    if (config.rightFillerWidth < FILLER_STRIP_CONSTRAINTS.minWidth) {
      errors.push(`Rechter passtuk moet minimaal ${FILLER_STRIP_CONSTRAINTS.minWidth}cm zijn`);
    }
    if (config.rightFillerWidth > FILLER_STRIP_CONSTRAINTS.maxWidth) {
      errors.push(`Rechter passtuk mag maximaal ${FILLER_STRIP_CONSTRAINTS.maxWidth}cm zijn`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}


/**
 * TOP FINISH CONFIGURATION
 * Determines how the top of the cabinet is finished
 */
export type TopFinish = "flush_to_ceiling" | "open_top";

export interface TopFinishOption {
  value: TopFinish;
  label: string;
  description: string;
}

export const TOP_FINISH_OPTIONS: TopFinishOption[] = [
  {
    value: "flush_to_ceiling",
    label: "Tot tegen plafond",
    description: "Tot tegen plafond zorgt voor een strakke en afgewerkte look",
  },
  {
    value: "open_top",
    label: "Open bovenkant",
    description: "Open bovenkant geeft een luchtig en modern uiterlijk",
  },
];

/**
 * Get top finish option by value
 */
export function getTopFinishOption(value: TopFinish): TopFinishOption | undefined {
  return TOP_FINISH_OPTIONS.find(opt => opt.value === value);
}


/**
 * BOTTOM FINISH CONFIGURATION
 * Determines how the bottom of the cabinet is finished
 */
export type BottomFinish = "met_plint" | "zonder_plint" | "verhoogde_kast";

export interface BottomFinishOption {
  value: BottomFinish;
  label: string;
  description: string;
}

export const BOTTOM_FINISH_OPTIONS: BottomFinishOption[] = [
  {
    value: "met_plint",
    label: "Met plint",
    description: "Een plint zorgt voor een nette afwerking en stabiliteit",
  },
  {
    value: "zonder_plint",
    label: "Zonder plint",
    description: "Zonder plint voor een minimalistisch en modern design",
  },
  {
    value: "verhoogde_kast",
    label: "Verhoogde kast",
    description: "Verhoogde kast met voetjes voor gemakkelijk schoonmaken",
  },
];

/**
 * Get bottom finish option by value
 */
export function getBottomFinishOption(value: BottomFinish): BottomFinishOption | undefined {
  return BOTTOM_FINISH_OPTIONS.find(opt => opt.value === value);
}
