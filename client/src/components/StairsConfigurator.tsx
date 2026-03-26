import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StairsConfig {
  stairType: "straight" | "quarter_turn" | "half_turn" | "floating" | "with_storage";
  totalHeight: number;
  width: number;
  numberOfSteps: number;
  material: "oak" | "beech" | "walnut" | "mdf_lacquered" | "plywood";
  finish: "oil" | "matte_lacquer" | "high_gloss" | "matte_paint";
  hasRailing: boolean;
  hasLighting: boolean;
  hasStorageDrawers: boolean;
  openSteps: boolean;
}

interface StairsConfiguratorProps {
  config: StairsConfig;
  onConfigChange: (config: StairsConfig) => void;
}

export default function StairsConfigurator({
  config,
  onConfigChange,
}: StairsConfiguratorProps) {
  const stepHeight = 18; // cm
  const stepDepth = 28; // cm
  const calculatedSteps = Math.ceil(config.totalHeight / stepHeight);

  const handleChange = (updates: Partial<StairsConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  const stairTypes = [
    { id: "straight", name: "Rechte Trap", description: "Eenvoudige rechte trap" },
    { id: "quarter_turn", name: "Kwartdraai", description: "Trap met 90° bocht" },
    { id: "half_turn", name: "Halfdraai", description: "Trap met 180° bocht" },
    { id: "floating", name: "Zwevende Trap", description: "Moderne zwevende trap" },
    { id: "with_storage", name: "Met Opbergruimte", description: "Trap met ingebouwde lades" },
  ];

  return (
    <div className="space-y-6">
      {/* Trap Type Selection */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Trap Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stairTypes.map((type) => (
            <div
              key={type.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                config.stairType === type.id
                  ? "border-accent bg-accent/10"
                  : "border-gray-200 hover:border-accent/50"
              }`}
              onClick={() => handleChange({ stairType: type.id as any })}
            >
              <h4 className="font-semibold">{type.name}</h4>
              <p className="text-sm text-muted-foreground">{type.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Dimensions */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-semibold">Afmetingen</h3>

        <div className="space-y-3">
          <Label>Totale hoogte: {config.totalHeight} cm</Label>
          <Slider
            value={[config.totalHeight]}
            onValueChange={(value) => handleChange({ totalHeight: value[0] })}
            min={200}
            max={400}
            step={10}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Aantal treden: {calculatedSteps} (staphoogte: {stepHeight} cm)
          </p>
        </div>

        <div className="space-y-3">
          <Label>Breedte: {config.width} cm</Label>
          <Slider
            value={[config.width]}
            onValueChange={(value) => handleChange({ width: value[0] })}
            min={60}
            max={150}
            step={5}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <Label>Trede diepte: {stepDepth} cm (vast)</Label>
          <p className="text-sm text-muted-foreground">
            Totale traplengte: {calculatedSteps * stepDepth} cm
          </p>
        </div>
      </Card>

      {/* Material & Finish */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Materiaal & Afwerking</h3>

        <div className="space-y-3">
          <Label>Materiaal</Label>
          <Select value={config.material} onValueChange={(value: any) => handleChange({ material: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oak">Eik</SelectItem>
              <SelectItem value="beech">Beuk</SelectItem>
              <SelectItem value="walnut">Walnoot</SelectItem>
              <SelectItem value="mdf_lacquered">MDF Gelakt</SelectItem>
              <SelectItem value="plywood">Multiplex</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Afwerking</Label>
          <Select value={config.finish} onValueChange={(value: any) => handleChange({ finish: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oil">Olie</SelectItem>
              <SelectItem value="matte_lacquer">Matte Lak</SelectItem>
              <SelectItem value="high_gloss">Hoogglans</SelectItem>
              <SelectItem value="matte_paint">Matte Verf</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Options */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Opties</h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              id="railing"
              checked={config.hasRailing}
              onCheckedChange={(checked) =>
                handleChange({ hasRailing: checked as boolean })
              }
            />
            <Label htmlFor="railing" className="cursor-pointer">
              Leuning
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="lighting"
              checked={config.hasLighting}
              onCheckedChange={(checked) =>
                handleChange({ hasLighting: checked as boolean })
              }
            />
            <Label htmlFor="lighting" className="cursor-pointer">
              Ingebouwde Verlichting
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="storage"
              checked={config.hasStorageDrawers}
              onCheckedChange={(checked) =>
                handleChange({ hasStorageDrawers: checked as boolean })
              }
              disabled={config.stairType !== "with_storage"}
            />
            <Label htmlFor="storage" className="cursor-pointer">
              Opberglades (alleen voor trap met opbergruimte)
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="open-steps"
              checked={config.openSteps}
              onCheckedChange={(checked) =>
                handleChange({ openSteps: checked as boolean })
              }
            />
            <Label htmlFor="open-steps" className="cursor-pointer">
              Open Treden
            </Label>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-6 bg-muted/50 space-y-2">
        <h4 className="font-semibold">Samenvatting</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>Type: {stairTypes.find((t) => t.id === config.stairType)?.name}</li>
          <li>Hoogte: {config.totalHeight} cm</li>
          <li>Breedte: {config.width} cm</li>
          <li>Treden: {calculatedSteps}</li>
          <li>Materiaal: {config.material}</li>
          <li>Afwerking: {config.finish}</li>
        </ul>
      </Card>
    </div>
  );
}
