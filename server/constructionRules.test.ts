import { describe, it, expect } from "vitest";
import { validateConfiguration, optimizeMaterialUsage, CabinetConfig } from "./constructionRules";

describe("Construction Rules Validation", () => {
  describe("Shelf width validation", () => {
    it("should warn when shelf width exceeds 90cm", () => {
      const config: CabinetConfig = {
        width: 100,
        height: 200,
        depth: 60,
        numberOfCompartments: 1,
        numberOfShelves: 3,
        numberOfDoors: 0,
        numberOfDrawers: 0,
        hasClothingRail: false,
        material: "white_melamine",
      };

      const result = validateConfiguration(config);
      expect(result.warnings.some((w) => w.code === "SHELF_WIDTH_EXCEEDED")).toBe(true);
      expect(result.suggestedPanels).toBe(1);
    });

    it("should pass when shelf width is within limits", () => {
      const config: CabinetConfig = {
        width: 80,
        height: 200,
        depth: 60,
        numberOfCompartments: 1,
        numberOfShelves: 3,
        numberOfDoors: 0,
        numberOfDrawers: 0,
        hasClothingRail: false,
        material: "white_melamine",
      };

      const result = validateConfiguration(config);
      expect(result.warnings.filter((w) => w.code === "SHELF_WIDTH_EXCEEDED")).toHaveLength(0);
    });
  });

  describe("Shelf depth validation", () => {
    it("should warn when shelf depth exceeds 60cm", () => {
      const config: CabinetConfig = {
        width: 80,
        height: 200,
        depth: 70,
        numberOfCompartments: 1,
        numberOfShelves: 3,
        numberOfDoors: 0,
        numberOfDrawers: 0,
        hasClothingRail: false,
        material: "white_melamine",
      };

      const result = validateConfiguration(config);
      expect(result.warnings.some((w) => w.code === "SHELF_DEPTH_EXCEEDED")).toBe(true);
    });
  });

  describe("Compartment width validation", () => {
    it("should error when compartment width is less than 30cm", () => {
      const config: CabinetConfig = {
        width: 80,
        height: 200,
        depth: 60,
        numberOfCompartments: 3,
        numberOfShelves: 3,
        numberOfDoors: 0,
        numberOfDrawers: 0,
        hasClothingRail: false,
        material: "white_melamine",
      };

      const result = validateConfiguration(config);
      const error = result.warnings.find((w) => w.code === "COMPARTMENT_WIDTH_TOO_SMALL");
      expect(error).toBeDefined();
      expect(error?.type).toBe("error");
      expect(result.isValid).toBe(false);
    });
  });

  describe("Clothing rail validation", () => {
    it("should disable clothing rail when depth is less than 55cm", () => {
      const config: CabinetConfig = {
        width: 80,
        height: 200,
        depth: 50,
        numberOfCompartments: 1,
        numberOfShelves: 3,
        numberOfDoors: 0,
        numberOfDrawers: 0,
        hasClothingRail: true,
        material: "white_melamine",
      };

      const result = validateConfiguration(config);
      expect(result.canAddClothingRail).toBe(false);
      expect(result.warnings.some((w) => w.code === "CLOTHING_RAIL_DEPTH_INSUFFICIENT")).toBe(true);
    });

    it("should allow clothing rail when depth is sufficient", () => {
      const config: CabinetConfig = {
        width: 80,
        height: 200,
        depth: 60,
        numberOfCompartments: 1,
        numberOfShelves: 3,
        numberOfDoors: 0,
        numberOfDrawers: 0,
        hasClothingRail: true,
        material: "white_melamine",
      };

      const result = validateConfiguration(config);
      expect(result.canAddClothingRail).toBe(true);
    });
  });

  describe("Drawer validation", () => {
    it("should disable drawers when compartment width is less than 45cm", () => {
      const config: CabinetConfig = {
        width: 80,
        height: 200,
        depth: 60,
        numberOfCompartments: 2,
        numberOfShelves: 3,
        numberOfDoors: 0,
        numberOfDrawers: 1,
        hasClothingRail: false,
        material: "white_melamine",
      };

      const result = validateConfiguration(config);
      expect(result.canAddDrawers).toBe(false);
    });

    it("should allow drawers when compartment width is sufficient", () => {
      const config: CabinetConfig = {
        width: 100,
        height: 200,
        depth: 60,
        numberOfCompartments: 1,
        numberOfShelves: 3,
        numberOfDoors: 0,
        numberOfDrawers: 1,
        hasClothingRail: false,
        material: "white_melamine",
      };

      const result = validateConfiguration(config);
      expect(result.canAddDrawers).toBe(true);
    });
  });

  describe("Structural reinforcement", () => {
    it("should warn when width exceeds 240cm", () => {
      const config: CabinetConfig = {
        width: 250,
        height: 200,
        depth: 60,
        numberOfCompartments: 1,
        numberOfShelves: 3,
        numberOfDoors: 0,
        numberOfDrawers: 0,
        hasClothingRail: false,
        material: "white_melamine",
      };

      const result = validateConfiguration(config);
      expect(result.warnings.some((w) => w.code === "WIDTH_REQUIRES_REINFORCEMENT")).toBe(true);
    });

    it("should warn when height exceeds 240cm", () => {
      const config: CabinetConfig = {
        width: 80,
        height: 250,
        depth: 60,
        numberOfCompartments: 1,
        numberOfShelves: 3,
        numberOfDoors: 0,
        numberOfDrawers: 0,
        hasClothingRail: false,
        material: "white_melamine",
      };

      const result = validateConfiguration(config);
      expect(result.warnings.some((w) => w.code === "HEIGHT_REQUIRES_REINFORCEMENT")).toBe(true);
    });
  });
});

describe("Material Optimization", () => {
  it("should calculate sheets needed for material", () => {
    const panels = [
      {
        name: "Panel 1",
        width: 280,
        height: 207,
        thickness: 18,
        quantity: 1,
        material: "white_melamine",
        needsEdgeBanding: false,
        notes: "test",
      },
    ];

    const result = optimizeMaterialUsage(panels);
    expect(result.sheetsNeeded["white_melamine"]).toBe(1);
    expect(result.totalUsedArea["white_melamine"]).toBeGreaterThan(0);
    expect(result.wastePercentage["white_melamine"]).toBeGreaterThanOrEqual(0);
  });

  it("should group panels by material", () => {
    const panels = [
      {
        name: "Panel 1",
        width: 100,
        height: 100,
        thickness: 18,
        quantity: 1,
        material: "white_melamine",
        needsEdgeBanding: false,
        notes: "test",
      },
      {
        name: "Panel 2",
        width: 100,
        height: 100,
        thickness: 18,
        quantity: 1,
        material: "oak_decor",
        needsEdgeBanding: false,
        notes: "test",
      },
    ];

    const result = optimizeMaterialUsage(panels);
    expect(Object.keys(result.panelsPerMaterial)).toContain("white_melamine");
    expect(Object.keys(result.panelsPerMaterial)).toContain("oak_decor");
  });
});
