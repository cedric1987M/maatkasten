/**
 * Advanced bin-packing algorithm for optimal material sheet usage
 * Implements a 2D guillotine algorithm for efficient panel placement
 */

export interface Panel {
  id: string;
  width: number;
  height: number;
  quantity: number;
  material: string;
}

export interface PlacedPanel {
  panelId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotated: boolean;
}

export interface Sheet {
  id: string;
  width: number;
  height: number;
  material: string;
  panels: PlacedPanel[];
  usedArea: number;
  wasteArea: number;
}

export interface BinPackingResult {
  sheets: Sheet[];
  totalSheets: number;
  totalUsedArea: number;
  totalWasteArea: number;
  wastePercentage: number;
  efficiency: number;
}

const SHEET_WIDTH = 2800; // mm
const SHEET_HEIGHT = 2070; // mm
const KERF = 3; // mm - saw blade thickness

/**
 * Calculate the area of a panel including kerf
 */
function getPanelAreaWithKerf(width: number, height: number): number {
  return (width + KERF) * (height + KERF);
}

/**
 * Check if a panel can fit in the remaining space
 */
function canFit(panel: Panel, x: number, y: number, sheet: Sheet): boolean {
  const panelWidth = panel.width + KERF;
  const panelHeight = panel.height + KERF;

  if (x + panelWidth > sheet.width || y + panelHeight > sheet.height) {
    return false;
  }

  // Check for collisions with existing panels
  for (const placed of sheet.panels) {
    if (
      x < placed.x + placed.width &&
      x + panelWidth > placed.x &&
      y < placed.y + placed.height &&
      y + panelHeight > placed.y
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Find the best position for a panel in a sheet using guillotine algorithm
 */
function findBestPosition(panel: Panel, sheet: Sheet): PlacedPanel | null {
  let bestPosition: PlacedPanel | null = null;
  let bestWaste = Infinity;

  // Try placing at different positions
  for (let x = 0; x <= sheet.width - panel.width; x += 50) {
    for (let y = 0; y <= sheet.height - panel.height; y += 50) {
      if (canFit(panel, x, y, sheet)) {
        const waste = (sheet.width - x - panel.width) * (sheet.height - y - panel.height);

        if (waste < bestWaste) {
          bestWaste = waste;
          bestPosition = {
            panelId: panel.id,
            x,
            y,
            width: panel.width + KERF,
            height: panel.height + KERF,
            rotated: false,
          };
        }
      }

      // Try rotated
      if (panel.width !== panel.height) {
        if (canFit({ ...panel, width: panel.height, height: panel.width }, x, y, sheet)) {
          const waste =
            (sheet.width - x - panel.height) * (sheet.height - y - panel.width);

          if (waste < bestWaste) {
            bestWaste = waste;
            bestPosition = {
              panelId: panel.id,
              x,
              y,
              width: panel.height + KERF,
              height: panel.width + KERF,
              rotated: true,
            };
          }
        }
      }
    }
  }

  return bestPosition;
}

/**
 * Pack panels into sheets using advanced bin-packing algorithm
 */
export function packPanels(panels: Panel[]): BinPackingResult {
  const sheets: Sheet[] = [];
  const panelsByMaterial = new Map<string, Panel[]>();

  // Group panels by material
  panels.forEach((panel) => {
    if (!panelsByMaterial.has(panel.material)) {
      panelsByMaterial.set(panel.material, []);
    }
    panelsByMaterial.get(panel.material)!.push(panel);
  });

  let totalUsedArea = 0;
  let totalWasteArea = 0;

  // Process each material separately
  panelsByMaterial.forEach((materialPanels, material) => {
    // Sort panels by area (largest first) for better packing
    const sortedPanels = [...materialPanels].sort(
      (a, b) => b.width * b.height - a.width * a.height
    );

    // Pack each panel
    for (const panel of sortedPanels) {
      for (let i = 0; i < panel.quantity; i++) {
        let placed = false;

        // Try to place in existing sheets
        for (const sheet of sheets.filter((s) => s.material === material)) {
          const position = findBestPosition(panel, sheet);
          if (position) {
            sheet.panels.push(position);
            sheet.usedArea += getPanelAreaWithKerf(panel.width, panel.height);
            placed = true;
            break;
          }
        }

        // Create new sheet if needed
        if (!placed) {
          const newSheet: Sheet = {
            id: `sheet-${sheets.length + 1}`,
            width: SHEET_WIDTH,
            height: SHEET_HEIGHT,
            material,
            panels: [],
            usedArea: 0,
            wasteArea: 0,
          };

          const position = findBestPosition(panel, newSheet);
          if (position) {
            newSheet.panels.push(position);
            newSheet.usedArea += getPanelAreaWithKerf(panel.width, panel.height);
            sheets.push(newSheet);
          }
        }
      }
    }
  });

  // Calculate waste
  const sheetArea = SHEET_WIDTH * SHEET_HEIGHT;
  sheets.forEach((sheet) => {
    sheet.wasteArea = sheetArea - sheet.usedArea;
    totalUsedArea += sheet.usedArea;
    totalWasteArea += sheet.wasteArea;
  });

  const totalArea = sheets.length > 0 ? sheets.length * sheetArea : 1;
  const wastePercentage = sheets.length > 0 ? (totalWasteArea / totalArea) * 100 : 0;
  const efficiency = sheets.length > 0 ? ((totalUsedArea / totalArea) * 100) : 0;

  return {
    sheets,
    totalSheets: sheets.length,
    totalUsedArea,
    totalWasteArea,
    wastePercentage,
    efficiency,
  };
}

/**
 * Generate a report of panel placement for production
 */
export function generatePackingReport(result: BinPackingResult): string {
  let report = "=== MATERIAALOPTIMALISATIE RAPPORT ===\n\n";

  report += `Totaal benodigde platen: ${result.totalSheets}\n`;
  report += `Totale gebruikte oppervlakte: ${(result.totalUsedArea / 1000000).toFixed(2)} m²\n`;
  report += `Totale afvaloppervlakte: ${(result.totalWasteArea / 1000000).toFixed(2)} m²\n`;
  report += `Afvalpercentage: ${result.wastePercentage.toFixed(1)}%\n`;
  report += `Efficiëntie: ${result.efficiency.toFixed(1)}%\n\n`;

  result.sheets.forEach((sheet, index) => {
    report += `--- PLAAT ${index + 1} (${sheet.material}) ---\n`;
    report += `Gebruikte oppervlakte: ${(sheet.usedArea / 1000000).toFixed(2)} m²\n`;
    report += `Afvaloppervlakte: ${(sheet.wasteArea / 1000000).toFixed(2)} m²\n`;
    report += `Panelen op deze plaat: ${sheet.panels.length}\n\n`;

    sheet.panels.forEach((panel, pIndex) => {
      report += `  Panel ${pIndex + 1}: ${panel.width}x${panel.height}mm`;
      if (panel.rotated) report += " (GEROTEERD)";
      report += ` @ (${panel.x}, ${panel.y})\n`;
    });

    report += "\n";
  });

  return report;
}
