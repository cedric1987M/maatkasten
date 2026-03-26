/**
 * Configuration Flow Types and Constants
 * 
 * Defines the 8-step configuration process for the wardrobe configurator
 */

export type CabinetType = "wardrobe" | "tv-furniture" | "shoe-cabinet" | "loft-cabinet" | "stairs";
export type Placement = "freestanding" | "between-walls" | "left-wall" | "right-wall";
export type Shape = "straight" | "sloped-left" | "sloped-right";
export type DeliveryOption = "pickup" | "delivery" | "delivery-and-install";

export interface ConfigurationStep {
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
}

export const CONFIGURATION_STEPS: ConfigurationStep[] = [
  {
    stepNumber: 1,
    title: "Type",
    description: "Kies het type kast",
    icon: "cube",
  },
  {
    stepNumber: 2,
    title: "Plaatsing",
    description: "Waar plaatst u de kast?",
    icon: "layout",
  },
  {
    stepNumber: 3,
    title: "Afmetingen",
    description: "Bepaal breedte, hoogte en diepte",
    icon: "ruler",
  },
  {
    stepNumber: 4,
    title: "Vorm",
    description: "Recht of schuin?",
    icon: "sliders",
  },
  {
    stepNumber: 5,
    title: "Indeling",
    description: "Compartimenten, planken, laden",
    icon: "grid",
  },
  {
    stepNumber: 6,
    title: "Fronten",
    description: "Deuren, laden, grepen",
    icon: "door-open",
  },
  {
    stepNumber: 7,
    title: "Opties",
    description: "Verlichting, stopcontacten, etc.",
    icon: "zap",
  },
  {
    stepNumber: 8,
    title: "Levering",
    description: "Afhalen, levering of plaatsing",
    icon: "truck",
  },
];

export interface FullConfiguration {
  // Step 1: Type
  cabinetType: CabinetType;
  
  // Step 2: Placement
  placement: Placement;
  
  // Step 3: Dimensions (in cm)
  widthCm: number;
  heightCm: number;
  depthCm: number;
  
  // Step 4: Shape
  shape: Shape;
  loftHeightLeftCm?: number; // For sloped loft cabinets
  loftHeightRightCm?: number; // For sloped loft cabinets
  
  // Step 5: Layout
  numberOfCompartments: number;
  numberOfShelves: number;
  numberOfDrawers: number;
  numberOfDoors: number;
  hasClothingRail: boolean;
  
  // Step 6: Fronts
  material: string;
  handleType: "knob" | "pull" | "integrated";
  handleColor: string;
  doorSystem: "hinged" | "sliding" | "folding";
  
  // Step 7: Options
  hasLED: boolean;
  ledColor: "warm" | "cool" | "rgb";
  hasSocketOutlets: boolean;
  numberOfSocketOutlets: number;
  hasDrawerDividers: boolean;
  hasShoeRack: boolean;
  
  // Step 8: Delivery
  deliveryOption: DeliveryOption;
  deliveryDate?: string;
  installationDate?: string;
  notes?: string;
}

export const CABINET_TYPES: Record<CabinetType, { name: string; description: string }> = {
  wardrobe: {
    name: "Kledingkast",
    description: "Grote kast voor kleding en accessoires",
  },
  "tv-furniture": {
    name: "TV-meubel",
    description: "Lage kast voor televisie en media",
  },
  "shoe-cabinet": {
    name: "Schoenenrek",
    description: "Compacte kast voor schoenen",
  },
  "loft-cabinet": {
    name: "Zolderkast",
    description: "Kast onder schuine daken",
  },
  stairs: {
    name: "Trap met opberging",
    description: "Trap met ingebouwde kasten",
  },
};

export const PLACEMENTS: Record<Placement, { name: string; description: string }> = {
  freestanding: {
    name: "Vrij staand",
    description: "Kast staat los in de ruimte",
  },
  "between-walls": {
    name: "Tussen muren",
    description: "Kast past exact tussen twee muren",
  },
  "left-wall": {
    name: "Tegen linker muur",
    description: "Kast staat tegen de linker muur",
  },
  "right-wall": {
    name: "Tegen rechter muur",
    description: "Kast staat tegen de rechter muur",
  },
};

export const SHAPES: Record<Shape, { name: string; description: string }> = {
  straight: {
    name: "Recht",
    description: "Standaard rechthoekige vorm",
  },
  "sloped-left": {
    name: "Schuin links",
    description: "Linkerkant hoger dan rechterkant",
  },
  "sloped-right": {
    name: "Schuin rechts",
    description: "Rechterkant hoger dan linkerkant",
  },
};

export const DELIVERY_OPTIONS: Record<DeliveryOption, { name: string; price: number }> = {
  pickup: {
    name: "Afhalen",
    price: 0,
  },
  delivery: {
    name: "Levering",
    price: 50,
  },
  "delivery-and-install": {
    name: "Levering en plaatsing",
    price: 200,
  },
};

export const HANDLE_TYPES = {
  knob: { name: "Knop", price: 5 },
  pull: { name: "Trekgreep", price: 8 },
  integrated: { name: "Geïntegreerd", price: 0 },
};

export const DOOR_SYSTEMS = {
  hinged: { name: "Scharnieren", price: 15 },
  sliding: { name: "Schuifdeuren", price: 30 },
  folding: { name: "Vouwdeuren", price: 25 },
};
