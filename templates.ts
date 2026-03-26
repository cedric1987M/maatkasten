import { CabinetConfig } from "./cabinetCalculator";

export interface CabinetTemplate {
  id: string;
  name: string;
  description: string;
  category: "bedroom" | "kitchen" | "office" | "living_room" | "custom";
  config: CabinetConfig;
  image?: string;
}

/**
 * Pre-configured cabinet templates for quick start
 */
export const CABINET_TEMPLATES: CabinetTemplate[] = [
  {
    id: "bedroom-wardrobe-small",
    name: "Kleine Slaapkamerkast",
    description: "Compacte kledingkast voor kleine slaapkamers - 120cm breed",
    category: "bedroom",
    config: {
      width: 120,
      height: 200,
      depth: 60,
      numberOfCompartments: 2,
      numberOfShelves: 3,
      numberOfDoors: 2,
      numberOfDrawers: 1,
      hasClothingRail: true,
      material: "white_melamine",
    },
  },
  {
    id: "bedroom-wardrobe-medium",
    name: "Standaard Slaapkamerkast",
    description: "Klassieke kledingkast - 180cm breed met veel opbergruimte",
    category: "bedroom",
    config: {
      width: 180,
      height: 220,
      depth: 60,
      numberOfCompartments: 3,
      numberOfShelves: 4,
      numberOfDoors: 3,
      numberOfDrawers: 2,
      hasClothingRail: true,
      material: "white_melamine",
    },
  },
  {
    id: "bedroom-wardrobe-large",
    name: "Grote Slaapkamerkast",
    description: "Ruime kledingkast - 240cm breed met maximale opbergruimte",
    category: "bedroom",
    config: {
      width: 240,
      height: 240,
      depth: 60,
      numberOfCompartments: 4,
      numberOfShelves: 5,
      numberOfDoors: 4,
      numberOfDrawers: 3,
      hasClothingRail: true,
      material: "white_melamine",
    },
  },
  {
    id: "kitchen-pantry",
    name: "Keukenkasten Set",
    description: "Set van keukenkasten - 150cm breed met veel legplanken",
    category: "kitchen",
    config: {
      width: 150,
      height: 180,
      depth: 50,
      numberOfCompartments: 2,
      numberOfShelves: 5,
      numberOfDoors: 2,
      numberOfDrawers: 2,
      hasClothingRail: false,
      material: "oak_decor",
    },
  },
  {
    id: "office-shelving",
    name: "Kantoor Boekenkasten",
    description: "Open boekenkasten voor kantoor - 200cm breed",
    category: "office",
    config: {
      width: 200,
      height: 200,
      depth: 35,
      numberOfCompartments: 3,
      numberOfShelves: 6,
      numberOfDoors: 0,
      numberOfDrawers: 0,
      hasClothingRail: false,
      material: "white_melamine",
    },
  },
  {
    id: "office-storage",
    name: "Kantoor Opbergkast",
    description: "Gesloten opbergkast voor kantoor - 120cm breed",
    category: "office",
    config: {
      width: 120,
      height: 180,
      depth: 45,
      numberOfCompartments: 2,
      numberOfShelves: 4,
      numberOfDoors: 2,
      numberOfDrawers: 1,
      hasClothingRail: false,
      material: "black_decor",
    },
  },
  {
    id: "living-room-storage",
    name: "Woonkamer Opbergkast",
    description: "Stijlvolle opbergkast voor woonkamer - 160cm breed",
    category: "living_room",
    config: {
      width: 160,
      height: 200,
      depth: 55,
      numberOfCompartments: 2,
      numberOfShelves: 4,
      numberOfDoors: 2,
      numberOfDrawers: 2,
      hasClothingRail: false,
      material: "oak_decor",
    },
  },
];

/**
 * Get template by ID
 */
export function getTemplateById(id: string): CabinetTemplate | undefined {
  return CABINET_TEMPLATES.find((t) => t.id === id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(
  category: CabinetTemplate["category"]
): CabinetTemplate[] {
  return CABINET_TEMPLATES.filter((t) => t.category === category);
}

/**
 * Get all template categories
 */
export function getTemplateCategories(): Array<{
  id: CabinetTemplate["category"];
  name: string;
  description: string;
}> {
  return [
    {
      id: "bedroom",
      name: "Slaapkamer",
      description: "Kledingkasten en slaapkamermeubels",
    },
    {
      id: "kitchen",
      name: "Keuken",
      description: "Keukenkasten en opbergoplossingen",
    },
    {
      id: "office",
      name: "Kantoor",
      description: "Boekenkasten en kantooropberging",
    },
    {
      id: "living_room",
      name: "Woonkamer",
      description: "Woonkamermeubels en opberging",
    },
    {
      id: "custom",
      name: "Aangepast",
      description: "Maak uw eigen configuratie",
    },
  ];
}
