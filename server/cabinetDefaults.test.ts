import { describe, it, expect } from 'vitest';
import {
  validateDimensions,
  clampDimension,
  getDefaultsForType,
  getAvailableOptions,
  getDefaultLayout,
  VALIDATION_RULES,
  CABINET_DEFAULTS,
} from './cabinetDefaults';

describe('Cabinet Defaults and Validation', () => {
  describe('validateDimensions', () => {
    it('should validate correct dimensions', () => {
      const result = validateDimensions(200, 240, 60);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject width below minimum', () => {
      const result = validateDimensions(30, 240, 60);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Breedte');
    });

    it('should reject width above maximum', () => {
      const result = validateDimensions(450, 240, 60);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Breedte');
    });

    it('should reject height below minimum', () => {
      const result = validateDimensions(200, 30, 60);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Hoogte');
    });

    it('should reject height above maximum', () => {
      const result = validateDimensions(200, 350, 60);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Hoogte');
    });

    it('should reject depth below minimum', () => {
      const result = validateDimensions(200, 240, 10);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Diepte');
    });

    it('should reject depth above maximum', () => {
      const result = validateDimensions(200, 240, 100);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Diepte');
    });

    it('should report multiple errors', () => {
      const result = validateDimensions(30, 350, 100);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(3);
    });
  });

  describe('clampDimension', () => {
    it('should return value within bounds', () => {
      const result = clampDimension(150, 40, 400);
      expect(result).toBe(150);
    });

    it('should clamp value below minimum', () => {
      const result = clampDimension(20, 40, 400);
      expect(result).toBe(40);
    });

    it('should clamp value above maximum', () => {
      const result = clampDimension(500, 40, 400);
      expect(result).toBe(400);
    });
  });

  describe('getDefaultsForType', () => {
    it('should return wardrobe defaults', () => {
      const defaults = getDefaultsForType('wardrobe');
      expect(defaults.width).toBe(200);
      expect(defaults.height).toBe(240);
      expect(defaults.depth).toBe(60);
    });

    it('should return tv-furniture defaults', () => {
      const defaults = getDefaultsForType('tv-furniture');
      expect(defaults.width).toBe(180);
      expect(defaults.height).toBe(55);
      expect(defaults.depth).toBe(45);
    });

    it('should return shoe-cabinet defaults', () => {
      const defaults = getDefaultsForType('shoe-cabinet');
      expect(defaults.width).toBe(100);
      expect(defaults.height).toBe(120);
      expect(defaults.depth).toBe(35);
    });

    it('should return loft-cabinet defaults', () => {
      const defaults = getDefaultsForType('loft-cabinet');
      expect(defaults.width).toBe(150);
      expect(defaults.height).toBe(200);
      expect(defaults.depth).toBe(50);
    });

    it('should return stairs defaults', () => {
      const defaults = getDefaultsForType('stairs');
      expect(defaults.width).toBe(120);
      expect(defaults.height).toBe(280);
      expect(defaults.depth).toBe(30);
    });
  });

  describe('getAvailableOptions', () => {
    it('should return wardrobe options', () => {
      const options = getAvailableOptions('wardrobe');
      expect(options).toContain('hanging-rail');
      expect(options).toContain('shelves');
      expect(options).toContain('drawers');
    });

    it('should return tv-furniture options', () => {
      const options = getAvailableOptions('tv-furniture');
      expect(options).toContain('open-shelves');
      expect(options).toContain('cable-management');
    });

    it('should return shoe-cabinet options', () => {
      const options = getAvailableOptions('shoe-cabinet');
      expect(options).toContain('shoe-shelves');
    });

    it('should return loft-cabinet options', () => {
      const options = getAvailableOptions('loft-cabinet');
      expect(options).toContain('sloped-sides');
    });

    it('should return stairs options', () => {
      const options = getAvailableOptions('stairs');
      expect(options).toContain('storage-drawers');
    });
  });

  describe('getDefaultLayout', () => {
    it('should return wardrobe layout', () => {
      const layout = getDefaultLayout('wardrobe');
      expect(layout['hanging-rail']).toBe(1);
      expect(layout['shelves']).toBe(3);
      expect(layout['drawers']).toBe(1);
    });

    it('should return tv-furniture layout', () => {
      const layout = getDefaultLayout('tv-furniture');
      expect(layout['open-shelves']).toBe(2);
      expect(layout['drawers']).toBe(2);
    });

    it('should return shoe-cabinet layout', () => {
      const layout = getDefaultLayout('shoe-cabinet');
      expect(layout['shoe-shelves']).toBe(5);
    });
  });

  describe('Validation Rules', () => {
    it('should have correct min/max values', () => {
      expect(VALIDATION_RULES.minWidth).toBe(40);
      expect(VALIDATION_RULES.maxWidth).toBe(400);
      expect(VALIDATION_RULES.minHeight).toBe(40);
      expect(VALIDATION_RULES.maxHeight).toBe(300);
      expect(VALIDATION_RULES.minDepth).toBe(20);
      expect(VALIDATION_RULES.maxDepth).toBe(80);
    });
  });

  describe('Cabinet Defaults', () => {
    it('should have all cabinet types defined', () => {
      expect(CABINET_DEFAULTS['wardrobe']).toBeDefined();
      expect(CABINET_DEFAULTS['tv-furniture']).toBeDefined();
      expect(CABINET_DEFAULTS['shoe-cabinet']).toBeDefined();
      expect(CABINET_DEFAULTS['loft-cabinet']).toBeDefined();
      expect(CABINET_DEFAULTS['stairs']).toBeDefined();
    });
  });
});
