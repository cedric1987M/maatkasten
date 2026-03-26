import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LoftCabinetConfig {
  cabinetType: "loft_left" | "loft_right" | "loft_double";
  width: number;
  height: number;
  depth: number;
  slopeHeight: number;
  slopeAngle: number;
  slopeLength: number;
  material: "oak" | "beech" | "walnut" | "mdf_lacquered" | "plywood";
  finish: "oil" | "matte_lacquer" | "high_gloss" | "matte_paint";
  numberOfDoors: number;
  numberOfDrawers: number;
  numberOfShelves: number;
}

interface LoftCabinetConfiguratorProps {
  config: LoftCabinetConfig;
  onConfigChange: (config: LoftCabinetConfig) => void;
}

export default function LoftCabinetConfigurator({
  config,
  onConfigChange,
}: LoftCabinetConfiguratorProps) {
  const handleChange = (updates: Partial<LoftCabinetConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  // Calculate slope length based on angle and height
  const calculateSlopeLength = (angle: number, height: number) => {
    const radians = (angle * Math.PI) / 180;
    return Math.round(height / Math.sin(radians));
  };

  const slopeLength = calculateSlopeLength(config.slopeAngle, config.slopeHeight);

  const cabinetTypes = [
    { id: "loft_left", name: "Links Schuin", description: "Schuine zijde aan linkerkant" },
    { id: "loft_right", name: "Rechts Schuin", description: "Schuine zijde aan rechterkant" },
    { id: "loft_double", name: "Dubbel Schuin", description: "Schuine zijden aan beide kanten" },
  ];

  return (
    <div className="space-y-6">
      {/* Cabinet Type Selection */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Zolderkast Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {cabinetTypes.map((type) => (
            <div
              key={type.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                config.cabinetType === type.id
                  ? "border-accent bg-accent/10"
                  : "border-gray-200 hover:border-accent/50"
              }`}
              onClick={() => handleChange({ cabinetType: type.id as any })}
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
          <Label>Breedte: {config.width} cm</Label>
          <Slider
            value={[config.width]}
            onValueChange={(value) => handleChange({ width: value[0] })}
            min={30}
            max={300}
            step={5}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <Label>Hoogte (rechte zijde): {config.height} cm</Label>
          <Slider
            value={[config.height]}
            onValueChange={(value) => handleChange({ height: value[0] })}
            min={50}
            max={300}
            step={5}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <Label>Diepte: {config.depth} cm</Label>
          <Slider
            value={[config.depth]}
            onValueChange={(value) => handleChange({ depth: value[0] })}
            min={20}
            max={80}
            step={5}
            className="w-full"
          />
        </div>
      </Card>

      {/* Slope Configuration */}
      <Card className="p-6 space-y-6 border-2 border-accent/30 bg-accent/5">
        <h3 className="text-lg font-semibold">Schuine Zijde</h3>

        <div className="space-y-3">
          <Label>Hoogte schuine zijde: {config.slopeHeight} cm</Label>
          <Slider
            value={[config.slopeHeight]}
            onValueChange={(value) => handleChange({ slopeHeight: value[0] })}
            min={50}
            max={200}
            step={5}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Dit is de hoogteverschil tussen de twee zijden
          </p>
        </div>

        <div className="space-y-3">
          <Label>Hellingshoek: {config.slopeAngle}°</Label>
          <Slider
            value={[config.slopeAngle]}
            onValueChange={(value) => handleChange({ slopeAngle: value[0] })}
            min={20}
            max={80}
            step={5}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Lengte schuine wand: {slopeLength} cm (berekend)
          </p>
        </div>
      </Card>

      {/* Interior Configuration */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-semibold">Interieur</h3>

        <div className="space-y-3">
          <Label>Aantal Deuren: {config.numberOfDoors}</Label>
          <Slider
            value={[config.numberOfDoors]}
            onValueChange={(value) => handleChange({ numberOfDoors: value[0] })}
            min={0}
            max={4}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <Label>Aantal Lades: {config.numberOfDrawers}</Label>
          <Slider
            value={[config.numberOfDrawers]}
            onValueChange={(value) => handleChange({ numberOfDrawers: value[0] })}
            min={0}
            max={6}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <Label>Aantal Legplanken: {config.numberOfShelves}</Label>
          <Slider
            value={[config.numberOfShelves]}
            onValueChange={(value) => handleChange({ numberOfShelves: value[0] })}
            min={0}
            max={8}
            step={1}
            className="w-full"
          />
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
          <li>Type: {cabinetTypes.find((t) => t.id === config.cabinetType)?.name}</li>
          <li>Afmetingen: {config.width} × {config.height} × {config.depth} cm</li>
          <li>Schuine hoogte: {config.slopeHeight} cm (hoek: {config.slopeAngle}°)</li>
          <li>Deuren: {config.numberOfDoors} | Lades: {config.numberOfDrawers} | Planken: {config.numberOfShelves}</li>
          <li>Materiaal: {config.material}</li>
          <li>Afwerking: {config.finish}</li>
        </ul>
      </Card>
    </div>
  );
}
