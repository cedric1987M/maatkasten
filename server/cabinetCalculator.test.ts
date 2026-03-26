import { describe, it, expect } from "vitest";
import {
  calculateCompartmentWidth,
  calculateShelfWidth,
  calculateShelfDepth,
  generateCutList,
  calculatePricing,
  CabinetConfig,
} from "./cabinetCalculator";

describe("Cabinet Calculator", () => {
  describe("calculateCompartmentWidth", () => {
    it("should calculate correct compartment width", () => {
      expect(calculateCompartmentWidth(120, 2)).toBe(60);
      expect(calculateCompartmentWidth(180, 3)).toBe(60);
      expect(calculateCompartmentWidth(100, 1)).toBe(100);
    });

    it("should handle decimal results", () => {
      expect(calculateCompartmentWidth(100, 3)).toBeCloseTo(33.333, 2);
    });
  });

  describe("calculateShelfWidth", () => {
    it("should subtract clearance from compartment width", () => {
      expect(calculateShelfWidth(60)).toBe(56); // 60 - 4mm clearance
      expect(calculateShelfWidth(100)).toBe(96);
    });
  });

  describe("calculateShelfDepth", () => {
    it("should subtract depth reduction from total depth", () => {
      expect(calculateShelfDepth(60)).toBe(40); // 60 - 20mm reduction
      expect(calculateShelfDepth(80)).toBe(60);
    });
  });

  describe("generateCutList", () => {
    it("should generate correct number of panels", () => {
      const config: CabinetConfig = {
        width: 120,
        height: 200,
        depth: 60,
        numberOfCompartments: 2,
        numberOfShelves: 3,
        numberOfDoors: 2,
        numberOfDrawers: 0,
        hasClothingRail: false,
        material: "white_melamine",
      };

      const cutList = generateCutList(config);

      // Should have: 2 sides + top + bottom + 1 divider + 6 shelves (2 compartments * 3 shelves) = 11 panels
      expect(cutList.totalPanels).toBe(11);
      expect(cutList.panels.length).toBe(6); // 6 different panel types
    });

    it("should calculate total area correctly", () => {
      const config: CabinetConfig = {
        width: 100,
        height: 200,
        depth: 50,
        numberOfCompartments: 1,
        numberOfShelves: 2,
        numberOfDoors: 0,
        numberOfDrawers: 0,
        hasClothingRail: false,
        material: "white_melamine",
      };

      const cutList = generateCutList(config);
      expect(cutList.totalAreaM2).toBeGreaterThan(0);
    });

    it("should handle no shelves", () => {
      const config: CabinetConfig = {
        width: 120,
        height: 200,
        depth: 60,
        numberOfCompartments: 1,
        numberOfShelves: 0,
        numberOfDoors: 0,
        numberOfDrawers: 0,
        hasClothingRail: false,
        material: "white_melamine",
      };

      const cutList = generateCutList(config);
      // Should have: 2 sides + top + bottom (no shelves)
      expect(cutList.totalPanels).toBe(4);
    });

    it("should handle multiple compartments", () => {
      const config: CabinetConfig = {
        width: 180,
        height: 200,
        depth: 60,
        numberOfCompartments: 3,
        numberOfShelves: 2,
        numberOfDoors: 0,
        numberOfDrawers: 0,
        hasClothingRail: false,
        material: "white_melamine",
      };

      const cutList = generateCutList(config);
      // Should have: 2 sides + top + bottom + 2 dividers + 6 shelves (3 compartments * 2 shelves)
      expect(cutList.totalPanels).toBe(12);
    });
  });

  describe("calculatePricing", () => {
    const pricingRules = {
      whiteMelaminePrice: 25,
      oakDecorPrice: 35,
      blackDecorPrice: 30,
      pricePerShelf: 5,
      pricePerDrawer: 15,
      pricePerDoor: 20,
      clothingRailPrice: 10,
      hardwarePrice: 15,
      installationPrice: 50,
    };

    it("should calculate pricing for basic cabinet", () => {
      const config: CabinetConfig = {
        width: 120,
        height: 200,
        depth: 60,
        numberOfCompartments: 1,
        numberOfShelves: 2,
        numberOfDoors: 1,
        numberOfDrawers: 0,
        hasClothingRail: false,
        material: "white_melamine",
      };

      const pricing = calculatePricing(config, pricingRules);

      expect(pricing.materialCost).toBe(0); // white_melamine has 0% surcharge
      expect(pricing.shelfCost).toBe(50); // 2 shelves * 25 each
      expect(pricing.doorCost).toBe(50); // 1 door * 50
      expect(pricing.drawerCost).toBe(0);
      expect(pricing.clothingRailCost).toBe(0);
      expect(pricing.hardwareCost).toBe(50); // doorCost
      expect(pricing.productPrice).toBeGreaterThan(0);
      expect(pricing.total).toBeGreaterThan(pricing.productPrice);
    });

    it("should include all optional costs", () => {
      const config: CabinetConfig = {
        width: 120,
        height: 200,
        depth: 60,
        numberOfCompartments: 1,
        numberOfShelves: 2,
        numberOfDoors: 1,
        numberOfDrawers: 2,
        hasClothingRail: true,
        material: "white_melamine",
      };

      const pricing = calculatePricing(config, pricingRules);

      expect(pricing.shelfCost).toBe(50); // 2 shelves * 25
      expect(pricing.doorCost).toBe(50); // 1 door * 50
      expect(pricing.drawerCost).toBe(280); // 2 drawers * 140
      expect(pricing.clothingRailCost).toBe(80); // clothing rail
    });

    it("should use correct material pricing", () => {
      const baseConfig: CabinetConfig = {
        width: 100,
        height: 200,
        depth: 50,
        numberOfCompartments: 1,
        numberOfShelves: 0,
        numberOfDoors: 0,
        numberOfDrawers: 0,
        hasClothingRail: false,
        material: "white_melamine",
      };

      const whitePricing = calculatePricing(baseConfig, pricingRules);

      const oakConfig = { ...baseConfig, material: "oak_decor" as const };
      const oakPricing = calculatePricing(oakConfig, pricingRules);

      expect(oakPricing.materialCost).toBeGreaterThan(whitePricing.materialCost);
    });

    it("should round prices to 2 decimal places", () => {
      const config: CabinetConfig = {
        width: 120,
        height: 200,
        depth: 60,
        numberOfCompartments: 1,
        numberOfShelves: 1,
        numberOfDoors: 0,
        numberOfDrawers: 0,
        hasClothingRail: false,
        material: "white_melamine",
      };

      const pricing = calculatePricing(config, pricingRules);

      // Check that prices are properly rounded to 2 decimal places
      expect(Number.isFinite(pricing.total)).toBe(true);
      expect(pricing.total).toBeGreaterThan(0);
      // Verify the price string representation has at most 2 decimals
      const totalStr = pricing.total.toString();
      const decimalPart = totalStr.split(".")[1];
      expect(decimalPart ? decimalPart.length : 0).toBeLessThanOrEqual(2);
    });
  });
});
