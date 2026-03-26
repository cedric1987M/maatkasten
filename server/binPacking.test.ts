import { describe, it, expect } from "vitest";
import { packPanels, Panel } from "./binPacking";

describe("Bin Packing Algorithm", () => {
  it("should pack single panel into one sheet", () => {
    const panels: Panel[] = [
      {
        id: "panel-1",
        width: 1000,
        height: 800,
        quantity: 1,
        material: "white_melamine",
      },
    ];

    const result = packPanels(panels);
    expect(result.totalSheets).toBe(1);
    expect(result.sheets[0].panels).toHaveLength(1);
  });

  it("should pack multiple panels of same material", () => {
    const panels: Panel[] = [
      {
        id: "panel-1",
        width: 500,
        height: 500,
        quantity: 2,
        material: "white_melamine",
      },
    ];

    const result = packPanels(panels);
    expect(result.totalSheets).toBeGreaterThanOrEqual(1);
    expect(result.sheets.every((s) => s.material === "white_melamine")).toBe(true);
  });

  it("should separate panels by material", () => {
    const panels: Panel[] = [
      {
        id: "panel-1",
        width: 500,
        height: 500,
        quantity: 1,
        material: "white_melamine",
      },
      {
        id: "panel-2",
        width: 500,
        height: 500,
        quantity: 1,
        material: "oak_decor",
      },
    ];

    const result = packPanels(panels);
    const materials = new Set(result.sheets.map((s) => s.material));
    expect(materials.size).toBe(2);
  });

  it("should calculate waste percentage", () => {
    const panels: Panel[] = [
      {
        id: "panel-1",
        width: 2800,
        height: 2070,
        quantity: 1,
        material: "white_melamine",
      },
    ];

    const result = packPanels(panels);
    expect(result.wastePercentage).toBeGreaterThanOrEqual(0);
    expect(result.wastePercentage).toBeLessThanOrEqual(100);
  });

  it("should calculate efficiency", () => {
    const panels: Panel[] = [
      {
        id: "panel-1",
        width: 1000,
        height: 1000,
        quantity: 1,
        material: "white_melamine",
      },
    ];

    const result = packPanels(panels);
    expect(result.efficiency).toBeGreaterThan(0);
    expect(result.efficiency).toBeLessThanOrEqual(100);
  });

  it("should handle large quantity of panels", () => {
    const panels: Panel[] = [
      {
        id: "panel-1",
        width: 300,
        height: 300,
        quantity: 20,
        material: "white_melamine",
      },
    ];

    const result = packPanels(panels);
    expect(result.totalSheets).toBeGreaterThan(0);
    const totalPanelsPlaced = result.sheets.reduce((sum, s) => sum + s.panels.length, 0);
    expect(totalPanelsPlaced).toBeGreaterThan(0);
  });

  it("should track used and waste areas", () => {
    const panels: Panel[] = [
      {
        id: "panel-1",
        width: 1000,
        height: 800,
        quantity: 1,
        material: "white_melamine",
      },
    ];

    const result = packPanels(panels);
    expect(result.totalUsedArea).toBeGreaterThan(0);
    expect(result.totalWasteArea).toBeGreaterThanOrEqual(0);
    expect(result.totalUsedArea + result.totalWasteArea).toBeGreaterThan(0);
  });
});
