import { PDFDocument, PDFPage, rgb, degrees } from "pdf-lib";
import { CabinetConfig } from "./cabinetCalculator";

interface CutListPanel {
  name: string;
  widthMm: number;
  heightMm: number;
  thicknessMm: number;
  quantity: number;
  material: string;
}

interface PricingInfo {
  materialCost: number;
  shelfCost: number;
  doorCost: number;
  drawerCost: number;
  clothingRailCost: number;
  hardwareCost: number;
  productPrice: number;
  installationCost: number;
  total: number;
}

export async function generateCutListPDF(
  config: CabinetConfig,
  panels: CutListPanel[],
  orderId: string
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();

  const margin = 40;
  const contentWidth = width - margin * 2;
  let yPosition = height - margin;

  // Helper function to draw text
  const drawText = (
    text: string,
    x: number,
    y: number,
    size: number = 12,
    bold: boolean = false
  ) => {
    page.drawText(text, {
      x,
      y,
      size,
      color: rgb(0, 0, 0),
    });
  };

  // Header
  drawText("ZAAGLIJST", margin, yPosition, 24, true);
  yPosition -= 40;

  // Order info
  drawText(`Ordernummer: ${orderId}`, margin, yPosition, 11);
  yPosition -= 20;
  drawText(`Datum: ${new Date().toLocaleDateString("nl-NL")}`, margin, yPosition, 11);
  yPosition -= 30;

  // Cabinet dimensions
  drawText("MAATKAST SPECIFICATIES", margin, yPosition, 14, true);
  yPosition -= 25;

  const specs = [
    `Breedte: ${config.width} cm`,
    `Hoogte: ${config.height} cm`,
    `Diepte: ${config.depth} cm`,
    `Materiaal: ${config.material}`,
  ];

  specs.forEach((spec) => {
    drawText(spec, margin + 10, yPosition, 10);
    yPosition -= 18;
  });

  yPosition -= 15;

  // Table header
  drawText("PANELEN", margin, yPosition, 12, true);
  yPosition -= 20;

  const colPositions = {
    name: margin,
    width: margin + 150,
    height: margin + 220,
    thickness: margin + 290,
    quantity: margin + 360,
    area: margin + 420,
  };

  // Draw column headers
  const headers = ["Paneel", "Breedte (cm)", "Hoogte (cm)", "Dikte (mm)", "Aantal", "Oppervlakte (m²)"];
  const headerPositions = [
    colPositions.name,
    colPositions.width,
    colPositions.height,
    colPositions.thickness,
    colPositions.quantity,
    colPositions.area,
  ];

  headerPositions.forEach((x, i) => {
    drawText(headers[i], x, yPosition, 10, true);
  });

  yPosition -= 20;

  // Draw separator line
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: width - margin, y: yPosition },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  yPosition -= 15;

  // Draw table rows
  let totalArea = 0;
  panels.forEach((panel) => {
    const area = (panel.widthMm * panel.heightMm * panel.quantity) / 1_000_000; // Convert to m²
    totalArea += area;

    drawText(panel.name, colPositions.name, yPosition, 9);
    drawText((panel.widthMm / 10).toFixed(1), colPositions.width, yPosition, 9);
    drawText((panel.heightMm / 10).toFixed(1), colPositions.height, yPosition, 9);
    drawText((panel.thicknessMm).toString(), colPositions.thickness, yPosition, 9);
    drawText(panel.quantity.toString(), colPositions.quantity, yPosition, 9);
    drawText(area.toFixed(2), colPositions.area, yPosition, 9);

    yPosition -= 18;
  });

  yPosition -= 10;

  // Draw separator line
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: width - margin, y: yPosition },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  yPosition -= 20;

  // Totals
  drawText(`Totale oppervlakte: ${totalArea.toFixed(2)} m²`, margin, yPosition, 11, true);
  yPosition -= 20;
  drawText(`Totaal panelen: ${panels.reduce((sum, p) => sum + p.quantity, 0)}`, margin, yPosition, 11, true);

  // Footer
  yPosition = margin;
  page.drawLine({
    start: { x: margin, y: yPosition + 10 },
    end: { x: width - margin, y: yPosition + 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  drawText("Maatkast Configurator - Zaaglijst", margin, yPosition, 9);
  drawText(new Date().toLocaleString("nl-NL"), width - margin - 100, yPosition, 9);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export async function generateQuotePDF(
  config: CabinetConfig,
  pricing: PricingInfo,
  customerName: string,
  orderId: string
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();

  const margin = 40;
  const contentWidth = width - margin * 2;
  let yPosition = height - margin;

  // Helper function to draw text
  const drawText = (
    text: string,
    x: number,
    y: number,
    size: number = 12,
    bold: boolean = false
  ) => {
    page.drawText(text, {
      x,
      y,
      size,
      color: rgb(0, 0, 0),
    });
  };

  // Header
  drawText("OFFERTE", margin, yPosition, 24, true);
  yPosition -= 40;

  // Quote info
  drawText(`Offertenummer: ${orderId}`, margin, yPosition, 11);
  yPosition -= 20;
  drawText(`Datum: ${new Date().toLocaleDateString("nl-NL")}`, margin, yPosition, 11);
  yPosition -= 20;
  drawText(`Klant: ${customerName}`, margin, yPosition, 11);
  yPosition -= 30;

  // Cabinet specifications
  drawText("MAATKAST SPECIFICATIES", margin, yPosition, 14, true);
  yPosition -= 25;

  const specs = [
    `Breedte: ${config.width} cm`,
    `Hoogte: ${config.height} cm`,
    `Diepte: ${config.depth} cm`,
    `Materiaal: ${config.material}`,
    `Vakken: ${config.numberOfCompartments}`,
    `Legplanken: ${config.numberOfShelves} per vak`,
    `Deuren: ${config.numberOfDoors}`,
    `Lades: ${config.numberOfDrawers}`,
  ];

  specs.forEach((spec) => {
    drawText(spec, margin + 10, yPosition, 10);
    yPosition -= 18;
  });

  yPosition -= 15;

  // Pricing breakdown
  drawText("PRIJSBREAKDOWN", margin, yPosition, 14, true);
  yPosition -= 25;

  const pricingItems = [
    { label: "Materiaal", value: pricing.materialCost },
    { label: "Legplanken", value: pricing.shelfCost },
    { label: "Deuren", value: pricing.doorCost },
    { label: "Lades", value: pricing.drawerCost },
    { label: "Kledingstang", value: pricing.clothingRailCost },
    { label: "Beslag & hardware", value: pricing.hardwareCost },
    { label: "Installatie", value: pricing.installationCost },
  ];

  const labelX = margin + 10;
  const priceX = width - margin - 80;

  pricingItems.forEach(({ label, value }) => {
    if (value > 0) {
      drawText(label, labelX, yPosition, 10);
      drawText(`€ ${value.toFixed(2)}`, priceX, yPosition, 10);
      yPosition -= 18;
    }
  });

  yPosition -= 10;

  // Draw separator line
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: width - margin, y: yPosition },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  yPosition -= 20;

  // Product Price
  drawText("Productprijs", labelX, yPosition, 11);
  drawText(`€ ${pricing.productPrice.toFixed(2)}`, priceX, yPosition, 11);
  yPosition -= 20;

  // Installation
  if (pricing.installationCost > 0) {
    drawText("Plaatsing (25%)", labelX, yPosition, 11);
    drawText(`€ ${pricing.installationCost.toFixed(2)}`, priceX, yPosition, 11);
    yPosition -= 20;
  }

  // Total
  drawText("TOTAAL", labelX, yPosition, 12, true);
  drawText(`€ ${pricing.total.toFixed(2)}`, priceX, yPosition, 12, true);

  yPosition -= 40;

  // Terms
  drawText("VOORWAARDEN", margin, yPosition, 12, true);
  yPosition -= 20;

  const terms = [
    "• Deze offerte is geldig voor 30 dagen",
    "• Betaling dient plaats te vinden vóór aanvang productie",
    "• Levertijd: 4-6 weken na orderbevestiging",
    "• Montage niet inbegrepen tenzij anders afgesproken",
  ];

  terms.forEach((term) => {
    drawText(term, margin + 10, yPosition, 9);
    yPosition -= 18;
  });

  // Footer
  yPosition = margin;
  page.drawLine({
    start: { x: margin, y: yPosition + 10 },
    end: { x: width - margin, y: yPosition + 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  drawText("Maatkast Configurator", margin, yPosition, 9);
  drawText(new Date().toLocaleString("nl-NL"), width - margin - 100, yPosition, 9);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
