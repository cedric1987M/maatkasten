import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getConfigurationById,
  getUserConfigurations,
  createConfiguration,
  updateConfiguration,
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getPricingRules,
  updatePricingRules,
} from "../db";
import { calculatePricing, generateCutList, CabinetConfig } from "../cabinetCalculator";
import { generateCutListPDF, generateQuotePDF } from "../pdfGenerator";
import { validateConfiguration, optimizeMaterialUsage, PanelInfo } from "../constructionRules";
import { CABINET_TEMPLATES, getTemplatesByCategory, getTemplateCategories } from "../templates";
import { TRPCError } from "@trpc/server";

const CabinetConfigSchema = z.object({
  width: z.number().int().min(40).max(400),
  height: z.number().int().min(40).max(300),
  depth: z.number().int().min(20).max(80),
  numberOfCompartments: z.number().int().min(1).max(6),
  numberOfShelves: z.number().int().min(0).max(10),
  numberOfDoors: z.number().int().min(0).max(6),
  numberOfDrawers: z.number().int().min(0).max(6),
  hasClothingRail: z.boolean(),
  material: z.enum(["white_melamine", "oak_decor", "black_decor", "mdf_white_ral9016", "mdf_grey_ral7035", "mdf_grey_ral7038", "mdf_green_ral6029", "mdf_blue_ral5002", "mdf_red_ral3020", "mdf_cream_ral1015", "mdf_brown_ral8017"]),
});

export const cabinetRouter = router({
  /**
   * Validate configuration against construction rules
   */
  validateConfig: publicProcedure.input(CabinetConfigSchema).query(async ({ input }) => {
    return validateConfiguration(input);
  }),

  /**
   * Calculate pricing and cut list for a configuration
   */
  calculatePrice: publicProcedure.input(CabinetConfigSchema).query(async ({ input }) => {
    const config: CabinetConfig = {
      ...input,
      hasClothingRail: input.hasClothingRail,
    };

    // Use new hardcoded pricing model - ignore database rules
    const pricing = calculatePricing(config);

    const cutList = generateCutList(config);

    return {
      pricing,
      cutList,
    };
  }),

  /**
   * Get cut list for a configuration
   */
  getCutList: publicProcedure.input(CabinetConfigSchema).query(async ({ input }) => {
    const config: CabinetConfig = {
      ...input,
      hasClothingRail: input.hasClothingRail,
    };

    const cutList = generateCutList(config);
    const panelInfos: PanelInfo[] = cutList.panels.map((p) => ({
      name: p.name,
      width: p.widthMm,
      height: p.heightMm,
      thickness: p.thicknessMm,
      quantity: p.quantity,
      material: p.material,
      needsEdgeBanding: p.needsEdgeBanding || false,
      notes: p.notes || "",
    }));
    const optimization = optimizeMaterialUsage(panelInfos);

    return {
      ...cutList,
      optimization,
    };
  }),

  /**
   * Save a configuration (for logged-in users)
   */
  saveConfiguration: protectedProcedure
    .input(
      CabinetConfigSchema.extend({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const pricingRules = await getPricingRules();
      if (!pricingRules) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Pricing rules not configured",
        });
      }

      const config: CabinetConfig = {
        width: input.width,
        height: input.height,
        depth: input.depth,
        numberOfCompartments: input.numberOfCompartments,
        numberOfShelves: input.numberOfShelves,
        numberOfDoors: input.numberOfDoors,
        numberOfDrawers: input.numberOfDrawers,
        hasClothingRail: input.hasClothingRail,
        material: input.material,
      };

      const pricing = calculatePricing(config, {
        whiteMelaminePrice: parseFloat(pricingRules.whiteMelaminePrice.toString()),
        oakDecorPrice: parseFloat(pricingRules.oakDecorPrice.toString()),
        blackDecorPrice: parseFloat(pricingRules.blackDecorPrice.toString()),
        pricePerShelf: parseFloat(pricingRules.pricePerShelf.toString()),
        pricePerDrawer: parseFloat(pricingRules.pricePerDrawer.toString()),
        pricePerDoor: parseFloat(pricingRules.pricePerDoor.toString()),
        clothingRailPrice: parseFloat(pricingRules.clothingRailPrice.toString()),
        hardwarePrice: parseFloat(pricingRules.hardwarePrice.toString()),
        installationPrice: parseFloat(pricingRules.installationPrice.toString()),
      });

      const result = await createConfiguration({
        userId: ctx.user.id,
        name: input.name,
        description: input.description,
        width: input.width,
        height: input.height,
        depth: input.depth,
        numberOfCompartments: input.numberOfCompartments,
        numberOfShelves: input.numberOfShelves,
        numberOfDoors: input.numberOfDoors,
        numberOfDrawers: input.numberOfDrawers,
        hasClothingRail: input.hasClothingRail ? 1 : 0,
        material: input.material,
        totalPrice: pricing.total.toString(),
        configData: JSON.stringify(config),
      });

      return result;
    }),

  /**
   * Get user's saved configurations
   */
  getMyConfigurations: protectedProcedure.query(async ({ ctx }) => {
    return getUserConfigurations(ctx.user.id);
  }),

  /**
   * Get a specific configuration
   */
  getConfiguration: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return getConfigurationById(input.id);
  }),

  /**
   * Create an order
   */
  createOrder: publicProcedure
    .input(
      z.object({
        configurationId: z.number(),
        customerName: z.string().min(1).max(255),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        configData: CabinetConfigSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const pricingRules = await getPricingRules();
      if (!pricingRules) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Pricing rules not configured",
        });
      }

      const pricing = calculatePricing(input.configData, {
        whiteMelaminePrice: parseFloat(pricingRules.whiteMelaminePrice.toString()),
        oakDecorPrice: parseFloat(pricingRules.oakDecorPrice.toString()),
        blackDecorPrice: parseFloat(pricingRules.blackDecorPrice.toString()),
        pricePerShelf: parseFloat(pricingRules.pricePerShelf.toString()),
        pricePerDrawer: parseFloat(pricingRules.pricePerDrawer.toString()),
        pricePerDoor: parseFloat(pricingRules.pricePerDoor.toString()),
        clothingRailPrice: parseFloat(pricingRules.clothingRailPrice.toString()),
        hardwarePrice: parseFloat(pricingRules.hardwarePrice.toString()),
        installationPrice: parseFloat(pricingRules.installationPrice.toString()),
      });

      const result = await createOrder({
        userId: ctx.user?.id,
        configurationId: input.configurationId,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        status: "pending",
        totalPrice: pricing.total.toString(),
        configSnapshot: JSON.stringify(input.configData),
      });

      return result;
    }),

  /**
   * Get user's orders
   */
  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    return getUserOrders(ctx.user.id);
  }),

  /**
   * Get a specific order
   */
  getOrder: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return getOrderById(input.id);
  }),

  /**
   * Admin: Get all orders
   */
  getAllOrders: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return getAllOrders();
  }),

  /**
   * Admin: Update order status
   */
  updateOrderStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        status: z.enum(["pending", "confirmed", "in_production", "completed", "cancelled"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return updateOrderStatus(input.orderId, input.status);
    }),

  /**
   * Admin: Get pricing rules
   */
  getPricingRules: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return getPricingRules();
  }),

  /**
   * Admin: Update pricing rules
   */
  updatePricingRules: protectedProcedure
    .input(
      z.object({
        whiteMelaminePrice: z.number().optional(),
        oakDecorPrice: z.number().optional(),
        blackDecorPrice: z.number().optional(),
        pricePerShelf: z.number().optional(),
        pricePerDrawer: z.number().optional(),
        pricePerDoor: z.number().optional(),
        clothingRailPrice: z.number().optional(),
        hardwarePrice: z.number().optional(),
        installationPrice: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const updates: Record<string, number> = {};
      Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined) {
          updates[key] = value;
        }
      });

      return updatePricingRules(updates as any);
    }),

  /**
   * Generate PDF cut list for an order
   */
  generateCutListPDF: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
        config: CabinetConfigSchema,
      })
    )
    .mutation(async ({ input }) => {
      const cutList = generateCutList(input.config);
      const pdfBuffer = await generateCutListPDF(
        input.config,
        cutList.panels,
        input.orderId
      );
      return {
        buffer: pdfBuffer.toString("base64"),
        filename: `zaaglijst-${input.orderId}.pdf`,
      };
    }),

  /**
   * Generate PDF quote for an order
   */
  generateQuotePDF: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
        customerName: z.string(),
        config: CabinetConfigSchema,
      })
    )
    .mutation(async ({ input }) => {
      const pricingRules = await getPricingRules();
      if (!pricingRules) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Pricing rules not configured",
        });
      }

      const pricing = calculatePricing(input.config, {
        whiteMelaminePrice: parseFloat(pricingRules.whiteMelaminePrice.toString()),
        oakDecorPrice: parseFloat(pricingRules.oakDecorPrice.toString()),
        blackDecorPrice: parseFloat(pricingRules.blackDecorPrice.toString()),
        pricePerShelf: parseFloat(pricingRules.pricePerShelf.toString()),
        pricePerDrawer: parseFloat(pricingRules.pricePerDrawer.toString()),
        pricePerDoor: parseFloat(pricingRules.pricePerDoor.toString()),
        clothingRailPrice: parseFloat(pricingRules.clothingRailPrice.toString()),
        hardwarePrice: parseFloat(pricingRules.hardwarePrice.toString()),
        installationPrice: parseFloat(pricingRules.installationPrice.toString()),
      });

      const pdfBuffer = await generateQuotePDF(
        input.config,
        pricing,
        input.customerName,
        input.orderId
      );
      return {
        buffer: pdfBuffer.toString("base64"),
        filename: `offerte-${input.orderId}.pdf`,
      };
    }),

  /**
   * Get all cabinet templates
   */
  getTemplates: publicProcedure.query(() => {
    return CABINET_TEMPLATES;
  }),

  /**
   * Get templates by category
   */
  getTemplatesByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(({ input }) => {
      return getTemplatesByCategory(input.category as any);
    }),

  /**
   * Get template categories
   */
  getTemplateCategories: publicProcedure.query(() => {
    return getTemplateCategories();
  }),
});
