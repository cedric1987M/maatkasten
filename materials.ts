/**
 * Material definitions with pricing and color information
 */

export interface Material {
  id: string;
  name: string;
  category: 'melamine' | 'mdf_lacquered' | 'veneer';
  color: string;
  hexColor: string;
  pricePerM2: number;
  description: string;
}

export const MATERIALS: Record<string, Material> = {
  // Melamine options
  white_melamine: {
    id: 'white_melamine',
    name: 'Wit Melamine',
    category: 'melamine',
    color: 'Wit',
    hexColor: '#FFFFFF',
    pricePerM2: 25.00,
    description: 'Schoon, modern en betaalbaar melamine',
  },
  oak_decor: {
    id: 'oak_decor',
    name: 'Eiken Decor',
    category: 'melamine',
    color: 'Eiken',
    hexColor: '#D4A574',
    pricePerM2: 35.00,
    description: 'Warm en klassiek eiken design',
  },
  black_decor: {
    id: 'black_decor',
    name: 'Zwart Decor',
    category: 'melamine',
    color: 'Zwart',
    hexColor: '#2C2C2C',
    pricePerM2: 30.00,
    description: 'Elegant en stijlvol zwart design',
  },

  // MDF Lacquered RAL colors
  mdf_ral_9016: {
    id: 'mdf_ral_9016',
    name: 'MDF Gelakt RAL 9016 (Wit)',
    category: 'mdf_lacquered',
    color: 'RAL 9016 - Verkeerswit',
    hexColor: '#F5F5F5',
    pricePerM2: 45.00,
    description: 'Premium MDF gelakt in RAL 9016 verkeerswit',
  },
  mdf_ral_7035: {
    id: 'mdf_ral_7035',
    name: 'MDF Gelakt RAL 7035 (Lichtgrijs)',
    category: 'mdf_lacquered',
    color: 'RAL 7035 - Lichtgrijs',
    hexColor: '#D7DCDC',
    pricePerM2: 45.00,
    description: 'Premium MDF gelakt in RAL 7035 lichtgrijs',
  },
  mdf_ral_7038: {
    id: 'mdf_ral_7038',
    name: 'MDF Gelakt RAL 7038 (Agaatgrijs)',
    category: 'mdf_lacquered',
    color: 'RAL 7038 - Agaatgrijs',
    hexColor: '#B5B8B8',
    pricePerM2: 45.00,
    description: 'Premium MDF gelakt in RAL 7038 agaatgrijs',
  },
  mdf_ral_6029: {
    id: 'mdf_ral_6029',
    name: 'MDF Gelakt RAL 6029 (Mintagroen)',
    category: 'mdf_lacquered',
    color: 'RAL 6029 - Mintagroen',
    hexColor: '#4A7C59',
    pricePerM2: 48.00,
    description: 'Premium MDF gelakt in RAL 6029 mintagroen',
  },
  mdf_ral_5002: {
    id: 'mdf_ral_5002',
    name: 'MDF Gelakt RAL 5002 (Ultramarijnblauw)',
    category: 'mdf_lacquered',
    color: 'RAL 5002 - Ultramarijnblauw',
    hexColor: '#00308C',
    pricePerM2: 48.00,
    description: 'Premium MDF gelakt in RAL 5002 ultramarijnblauw',
  },
  mdf_ral_3020: {
    id: 'mdf_ral_3020',
    name: 'MDF Gelakt RAL 3020 (Verkeersrood)',
    category: 'mdf_lacquered',
    color: 'RAL 3020 - Verkeersrood',
    hexColor: '#C41E3A',
    pricePerM2: 48.00,
    description: 'Premium MDF gelakt in RAL 3020 verkeersrood',
  },
  mdf_ral_1015: {
    id: 'mdf_ral_1015',
    name: 'MDF Gelakt RAL 1015 (Lichtkaki)',
    category: 'mdf_lacquered',
    color: 'RAL 1015 - Lichtkaki',
    hexColor: '#E6D4B8',
    pricePerM2: 45.00,
    description: 'Premium MDF gelakt in RAL 1015 lichtkaki',
  },
  mdf_ral_8017: {
    id: 'mdf_ral_8017',
    name: 'MDF Gelakt RAL 8017 (Chocoladebruin)',
    category: 'mdf_lacquered',
    color: 'RAL 8017 - Chocoladebruin',
    hexColor: '#45342E',
    pricePerM2: 48.00,
    description: 'Premium MDF gelakt in RAL 8017 chocoladebruin',
  },
};

/**
 * Get material by ID
 */
export function getMaterial(id: string): Material | undefined {
  return MATERIALS[id];
}

/**
 * Get all materials
 */
export function getAllMaterials(): Material[] {
  return Object.values(MATERIALS);
}

/**
 * Get materials by category
 */
export function getMaterialsByCategory(category: string): Material[] {
  return Object.values(MATERIALS).filter((m) => m.category === category);
}

/**
 * Get price per m² for a material
 */
export function getPricePerM2(materialId: string): number {
  const material = getMaterial(materialId);
  return material?.pricePerM2 || 25.00;
}

/**
 * Get hex color for a material
 */
export function getMaterialColor(materialId: string): string {
  const material = getMaterial(materialId);
  return material?.hexColor || '#CCCCCC';
}
