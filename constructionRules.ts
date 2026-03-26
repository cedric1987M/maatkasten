import { CabinetConfig } from "./cabinetCalculator";

export interface ValidationWarning {
  type: "warning" | "error" | "info";
  code: string;
  message: string;
  suggestion?: string;
  affectedField?: string;
}

export interface ValidationResult {
  isValid: boolean;
  warnings: ValidationWarning[];
  canAddClothingRail: boolean;
  canAddDrawers: boolean;
  suggestedPanels?: number; // Number of dividing panels suggested
}

export interface MaterialOptimization {
  sheetWidth: number; // 2800 mm
  sheetHeight: number; // 2070 mm
  panelsPerMaterial: Record<string, PanelInfo[]>;
  sheetsNeeded: Record<string, number>;
  totalUsedArea: Record<string, number>;
  wastePercentage: Record<string, number>;
  totalWastePercentage: number;
}

export interface PanelInfo {
  name: string;
  width: number;
  height: number;
  thickness: number;
  quantity: number;
  material: string;
  needsEdgeBanding: boolean;
  notes: string;
}

const RULES = {
  PANEL_THICKNESS: 18, // mm
  MAX_SHELF_WIDTH: 90, // cm
  MAX_SHELF_DEPTH: 60, // cm
  MAX_HEIGHT_BETWEEN_SHELVES: 60, // cm
  MIN_COMPARTMENT_WIDTH: 30, // cm
  MIN_DEPTH_FOR_CLOTHING_RAIL: 55, // cm
  MIN_WIDTH_FOR_DRAWERS: 45, // cm
  MAX_WIDTH_FOR_REINFORCEMENT: 240, // cm
  MAX_HEIGHT_FOR_REINFORCEMENT: 240, // cm
  SHEET_WIDTH: 2800, // mm
  SHEET_HEIGHT: 2070, // mm
};

export function validateConfiguration(config: CabinetConfig): ValidationResult {
  const warnings: ValidationWarning[] = [];
  let canAddClothingRail = true;
  let canAddDrawers = true;
  let suggestedPanels = 0;

  // Rule 1: Maximum shelf width (90 cm)
  if (config.width > RULES.MAX_SHELF_WIDTH) {
    warnings.push({
      type: "warning",
      code: "SHELF_WIDTH_EXCEEDED",
      message: `De plankbreedte van ${config.width} cm overschrijdt de aanbevolen maximale breedte van ${RULES.MAX_SHELF_WIDTH} cm.`,
      suggestion: `Overweeg een scheidingspaneel toe te voegen om de kast in meerdere vakken op te delen.`,
      affectedField: "width",
    });

    // Calculate suggested dividing panels
    suggestedPanels = Math.ceil(config.width / RULES.MAX_SHELF_WIDTH) - 1;
  }

  // Rule 2: Maximum shelf depth (60 cm)
  if (config.depth > RULES.MAX_SHELF_DEPTH) {
    warnings.push({
      type: "warning",
      code: "SHELF_DEPTH_EXCEEDED",
      message: `De kastdiepte van ${config.depth} cm overschrijdt de aanbevolen maximale diepte van ${RULES.MAX_SHELF_DEPTH} cm.`,
      suggestion: `Extra versteviging kan nodig zijn voor deze diepte.`,
      affectedField: "depth",
    });
  }

  // Rule 3: Maximum height between shelves (60 cm)
  if (config.numberOfShelves > 0) {
    const heightBetweenShelves = Math.floor(config.height / (config.numberOfShelves + 1));
    if (heightBetweenShelves > RULES.MAX_HEIGHT_BETWEEN_SHELVES) {
      warnings.push({
        type: "warning",
        code: "HEIGHT_BETWEEN_SHELVES_EXCEEDED",
        message: `De ruimte tussen legplanken (${heightBetweenShelves} cm) overschrijdt de aanbevolen maximale hoogte van ${RULES.MAX_HEIGHT_BETWEEN_SHELVES} cm.`,
        suggestion: `Overweeg extra legplanken toe te voegen voor betere ondersteuning.`,
        affectedField: "numberOfShelves",
      });
    }
  }

  // Rule 4: Minimum compartment width (30 cm)
  const compartmentWidth = config.width / config.numberOfCompartments;
  if (compartmentWidth < RULES.MIN_COMPARTMENT_WIDTH) {
    warnings.push({
      type: "error",
      code: "COMPARTMENT_WIDTH_TOO_SMALL",
      message: `De vakbreedte van ${compartmentWidth.toFixed(1)} cm is kleiner dan de minimale breedte van ${RULES.MIN_COMPARTMENT_WIDTH} cm.`,
      suggestion: `Verklein het aantal vakken of vergroot de totale breedte.`,
      affectedField: "numberOfCompartments",
    });
  }

  // Rule 5: Minimum depth for clothing rail (55 cm)
  if (config.hasClothingRail && config.depth < RULES.MIN_DEPTH_FOR_CLOTHING_RAIL) {
    canAddClothingRail = false;
    warnings.push({
      type: "error",
      code: "CLOTHING_RAIL_DEPTH_INSUFFICIENT",
      message: `Voor een kledingstang is minimaal ${RULES.MIN_DEPTH_FOR_CLOTHING_RAIL} cm kastdiepte nodig. Uw kast is ${config.depth} cm diep.`,
      suggestion: `Vergroot de kastdiepte of verwijder de kledingstang.`,
      affectedField: "depth",
    });
  }

  if (config.depth < RULES.MIN_DEPTH_FOR_CLOTHING_RAIL) {
    canAddClothingRail = false;
  }

  // Rule 6: Minimum width for drawers (45 cm)
  if (config.numberOfDrawers > 0 && compartmentWidth < RULES.MIN_WIDTH_FOR_DRAWERS) {
    canAddDrawers = false;
    warnings.push({
      type: "error",
      code: "DRAWER_WIDTH_INSUFFICIENT",
      message: `Voor lades is minimaal ${RULES.MIN_WIDTH_FOR_DRAWERS} cm vakbreedte nodig. Uw vakken zijn ${compartmentWidth.toFixed(1)} cm breed.`,
      suggestion: `Vergroot de vakbreedte of verwijder de lades.`,
      affectedField: "numberOfDrawers",
    });
  }

  if (compartmentWidth < RULES.MIN_WIDTH_FOR_DRAWERS) {
    canAddDrawers = false;
  }

  // Rule 7: Structural reinforcement for large width (240 cm)
  if (config.width > RULES.MAX_WIDTH_FOR_REINFORCEMENT) {
    warnings.push({
      type: "warning",
      code: "WIDTH_REQUIRES_REINFORCEMENT",
      message: `De kastbreedte van ${config.width} cm overschrijdt ${RULES.MAX_WIDTH_FOR_REINFORCEMENT} cm.`,
      suggestion: `Overweeg extra scheidingspanelen toe te voegen of de kast op te delen in meerdere modules.`,
      affectedField: "width",
    });
  }

  // Rule 8: Structural reinforcement for large height (240 cm)
  if (config.height > RULES.MAX_HEIGHT_FOR_REINFORCEMENT) {
    warnings.push({
      type: "warning",
      code: "HEIGHT_REQUIRES_REINFORCEMENT",
      message: `De kasthoogte van ${config.height} cm overschrijdt ${RULES.MAX_HEIGHT_FOR_REINFORCEMENT} cm.`,
      suggestion: `Wandverankering en een verstevigend achterpaneel worden aanbevolen.`,
      affectedField: "height",
    });
  }

  const isValid = !warnings.some((w) => w.type === "error");

  return {
    isValid,
    warnings,
    canAddClothingRail,
    canAddDrawers,
    suggestedPanels: suggestedPanels > 0 ? suggestedPanels : undefined,
  };
}

export function optimizeMaterialUsage(
  panels: PanelInfo[],
  sheetWidth: number = RULES.SHEET_WIDTH,
  sheetHeight: number = RULES.SHEET_HEIGHT
): MaterialOptimization {
  const panelsPerMaterial: Record<string, PanelInfo[]> = {};
  const sheetsNeeded: Record<string, number> = {};
  const totalUsedArea: Record<string, number> = {};
  const wastePercentage: Record<string, number> = {};

  // Group panels by material
  panels.forEach((panel) => {
    if (!panelsPerMaterial[panel.material]) {
      panelsPerMaterial[panel.material] = [];
    }
    panelsPerMaterial[panel.material].push(panel);
  });

  // Calculate sheets needed for each material
  let totalWastePercentage = 0;
  let materialCount = 0;

  Object.entries(panelsPerMaterial).forEach(([material, materialPanels]) => {
    const sheetArea = (sheetWidth * sheetHeight) / 1000000; // Convert to m²
    let usedArea = 0;

    materialPanels.forEach((panel) => {
      const panelArea = (panel.width * panel.height * panel.quantity) / 10000; // Convert to m²
      usedArea += panelArea;
    });

    totalUsedArea[material] = usedArea;

    // Simple calculation: assume we can fit panels efficiently
    // In reality, this would need a more sophisticated bin packing algorithm
    const sheetsRequired = Math.ceil(usedArea / sheetArea);
    sheetsNeeded[material] = sheetsRequired;

    const totalSheetArea = sheetsRequired * sheetArea;
    const waste = totalSheetArea - usedArea;
    const wastePercent = (waste / totalSheetArea) * 100;

    wastePercentage[material] = wastePercent;
    totalWastePercentage += wastePercent;
    materialCount++;
  });

  if (materialCount > 0) {
    totalWastePercentage = totalWastePercentage / materialCount;
  }

  return {
    sheetWidth,
    sheetHeight,
    panelsPerMaterial,
    sheetsNeeded,
    totalUsedArea,
    wastePercentage,
    totalWastePercentage,
  };
}

export function enrichPanelsWithEdgeBanding(panels: PanelInfo[]): PanelInfo[] {
  return panels.map((panel) => {
    // Shelves need edge banding on the front edge
    const needsEdgeBanding =
      panel.notes.includes("legplank") || panel.notes.includes("shelf");

    return {
      ...panel,
      needsEdgeBanding,
    };
  });
}
