/**
 * Product Types for the Professional Configurator
 * Supports: Cabinets, Loft Cabinets, TV Furniture, Stairs
 */

export type ProductType = "cabinet" | "loft_cabinet" | "tv_furniture" | "stairs";

export type CabinetType =
  | "standard"
  | "tv_furniture"
  | "wardrobe"
  | "built_in"
  | "loft_left"
  | "loft_right"
  | "loft_double";

export type StairType = "straight" | "quarter_turn" | "half_turn" | "floating" | "with_storage";

export type Material = "oak" | "beech" | "walnut" | "mdf_lacquered" | "plywood";

export type Finish = "oil" | "matte_lacquer" | "high_gloss" | "matte_paint";

export type InteriorElement = "shelf" | "drawer" | "clothing_rail" | "divider" | "door" | "open_space";

// Cabinet Configuration
export interface CabinetConfig {
  productType: "cabinet";
  cabinetType: CabinetType;
  width: number; // cm
  height: number; // cm
  depth: number; // cm
  material: Material;
  finish: Finish;
  numberOfDoors: number;
  numberOfDrawers: number;
  numberOfShelves: number;
  hasClothingRail: boolean;
  interiorElements: InteriorElement[];
}

// Loft Cabinet Configuration
export interface LoftCabinetConfig {
  productType: "loft_cabinet";
  cabinetType: "loft_left" | "loft_right" | "loft_double";
  width: number; // cm
  height: number; // cm
  depth: number; // cm
  slopeHeight: number; // cm - height of the sloped side
  slopeAngle: number; // degrees
  slopeLength: number; // cm
  material: Material;
  finish: Finish;
  numberOfDoors: number;
  numberOfDrawers: number;
  numberOfShelves: number;
  interiorElements: InteriorElement[];
}

// TV Furniture Configuration
export interface TVFurnitureConfig {
  productType: "tv_furniture";
  width: number; // cm
  height: number; // cm
  depth: number; // cm
  tvSize: number; // inches
  numberOfShelves: number;
  numberOfDrawers: number;
  material: Material;
  finish: Finish;
  hasBackPanel: boolean;
  interiorElements: InteriorElement[];
}

// Stairs Configuration
export interface StairsConfig {
  productType: "stairs";
  stairType: StairType;
  totalHeight: number; // cm
  width: number; // cm
  numberOfSteps: number;
  material: Material;
  finish: Finish;
  hasRailing: boolean;
  hasLighting: boolean;
  hasStorageDrawers: boolean;
  openSteps: boolean;
}

export type ProductConfig = CabinetConfig | LoftCabinetConfig | TVFurnitureConfig | StairsConfig;

// Interior Element Position
export interface ElementPosition {
  id: string;
  type: InteriorElement;
  x: number; // cm from left
  y: number; // cm from bottom
  z: number; // cm from front
  width: number; // cm
  height: number; // cm
  depth: number; // cm
}

// Product Specifications
export const PRODUCT_SPECS = {
  cabinet: {
    minWidth: 30,
    maxWidth: 300,
    minHeight: 50,
    maxHeight: 300,
    minDepth: 20,
    maxDepth: 80,
  },
  loft_cabinet: {
    minWidth: 30,
    maxWidth: 300,
    minHeight: 50,
    maxHeight: 300,
    minDepth: 20,
    maxDepth: 80,
    minSlopeHeight: 50,
    maxSlopeHeight: 200,
    minSlopeAngle: 20,
    maxSlopeAngle: 80,
  },
  tv_furniture: {
    minWidth: 80,
    maxWidth: 400,
    minHeight: 40,
    maxHeight: 200,
    minDepth: 30,
    maxDepth: 100,
    tvSizes: [32, 43, 50, 55, 65, 75, 85],
  },
  stairs: {
    minHeight: 200,
    maxHeight: 400,
    minWidth: 60,
    maxWidth: 150,
    minSteps: 3,
    maxSteps: 25,
    standardStepHeight: 18, // cm
    standardStepDepth: 28, // cm
  },
};

// Material Properties
export const MATERIAL_PROPERTIES = {
  oak: {
    name: "Eik",
    density: 0.75, // kg/dm³
    color: "#D4A574",
    textureUrl: "/textures/oak.jpg",
  },
  beech: {
    name: "Beuk",
    density: 0.72,
    color: "#E8C4A0",
    textureUrl: "/textures/beech.jpg",
  },
  walnut: {
    name: "Walnoot",
    density: 0.65,
    color: "#5C4033",
    textureUrl: "/textures/walnut.jpg",
  },
  mdf_lacquered: {
    name: "MDF Gelakt",
    density: 0.7,
    color: "#F5F5F5",
    textureUrl: "/textures/mdf.jpg",
  },
  plywood: {
    name: "Multiplex",
    density: 0.6,
    color: "#C9A961",
    textureUrl: "/textures/plywood.jpg",
  },
};

// Finish Properties
export const FINISH_PROPERTIES = {
  oil: {
    name: "Olie",
    glossLevel: 0.3,
    roughness: 0.7,
  },
  matte_lacquer: {
    name: "Matte Lak",
    glossLevel: 0.2,
    roughness: 0.8,
  },
  high_gloss: {
    name: "Hoogglans",
    glossLevel: 0.9,
    roughness: 0.1,
  },
  matte_paint: {
    name: "Matte Verf",
    glossLevel: 0.1,
    roughness: 0.9,
  },
};
