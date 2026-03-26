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

interface TVFurnitureConfig {
  width: number;
  height: number;
  depth: number;
  tvSize: number;
  numberOfShelves: number;
  numberOfDrawers: number;
  material: "oak" | "beech" | "walnut" | "mdf_lacquered" | "plywood";
  finish: "oil" | "matte_lacquer" | "high_gloss" | "matte_paint";
  hasBackPanel: boolean;
}

interface TVFurnitureConfiguratorProps {
  config: TVFurnitureConfig;
  onConfigChange: (config: TVFurnitureConfig) => void;
}

const TV_SIZES = [32, 43, 50, 55, 65, 75, 85];

export default function TVFurnitureConfigurator({
  config,
  onConfigChange,
}: TVFurnitureConfiguratorProps) {
  const handleChange = (updates: Partial<TVFurnitureConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  return (
    <div className="space-y-6">
      {/* Dimensions */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-semibold">Afmetingen</h3>

        <div className="space-y-3">
          <Label>Breedte: {config.width} cm</Label>
          <Slider
            value={[config.width]}
            onValueChange={(value) => handleChange({ width: value[0] })}
            min={80}
            max={400}
            step={5}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <Label>Hoogte: {config.height} cm</Label>
          <Slider
            value={[config.height]}
            onValueChange={(value) => handleChange({ height: value[0] })}
            min={40}
            max={200}
            step={5}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <Label>Diepte: {config.depth} cm</Label>
          <Slider
            value={[config.depth]}
            onValueChange={(value) => handleChange({ depth: value[0] })}
            min={30}
            max={100}
            step={5}
            className="w-full"
          />
        </div>
      </Card>

      {/* TV Size */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">TV Grootte</h3>
        <Label>Schermdiagonaal: {config.tvSize} inch</Label>
        <Select value={config.tvSize.toString()} onValueChange={(value) => handleChange({ tvSize: parseInt(value) })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TV_SIZES.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} inch
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Dit helpt bij het optimaliseren van de TV-opening
        </p>
      </Card>

      {/* Interior Configuration */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-semibold">Interieur</h3>

        <div className="space-y-3">
          <Label>Aantal Legplanken: {config.numberOfShelves}</Label>
          <Slider
            value={[config.numberOfShelves]}
            onValueChange={(value) => handleChange({ numberOfShelves: value[0] })}
            min={0}
            max={6}
            step={1}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Voor decoratie en entertainment apparatuur
          </p>
        </div>

        <div className="space-y-3">
          <Label>Aantal Lades: {config.numberOfDrawers}</Label>
          <Slider
            value={[config.numberOfDrawers]}
            onValueChange={(value) => handleChange({ numberOfDrawers: value[0] })}
            min={0}
            max={4}
            step={1}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Voor opberging van afstandsbedieningen en kabels
          </p>
        </div>
      </Card>

      {/* Options */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Opties</h3>

        <div className="flex items-center gap-3">
          <Checkbox
            id="back-panel"
            checked={config.hasBackPanel}
            onCheckedChange={(checked) =>
              handleChange({ hasBackPanel: checked as boolean })
            }
          />
          <Label htmlFor="back-panel" className="cursor-pointer">
            Achterpaneel (voor kabelbeheer en betere look)
          </Label>
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

      {/* Summary */}
      <Card className="p-6 bg-muted/50 space-y-2">
        <h4 className="font-semibold">Samenvatting</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>Afmetingen: {config.width} × {config.height} × {config.depth} cm</li>
          <li>TV Grootte: {config.tvSize} inch</li>
          <li>Legplanken: {config.numberOfShelves} | Lades: {config.numberOfDrawers}</li>
          <li>Achterpaneel: {config.hasBackPanel ? "Ja" : "Nee"}</li>
          <li>Materiaal: {config.material}</li>
          <li>Afwerking: {config.finish}</li>
        </ul>
      </Card>
    </div>
  );
}
