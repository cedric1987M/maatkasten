import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Ruler } from "lucide-react";
import { validateLoftCabinet } from "@/../../shared/cabinetStandards";

interface LoftCabinetFieldsProps {
  lowSideHeight: number;
  highSideHeight: number;
  slopeDirection: "left" | "right" | "";
  width: number;
  depth: number;
  onLowSideHeightChange: (value: number) => void;
  onHighSideHeightChange: (value: number) => void;
  onSlopeDirectionChange: (direction: "left" | "right") => void;
  inputValues: {
    lowSideHeight: string;
    highSideHeight: string;
  };
  onInputChange: (field: "lowSideHeight" | "highSideHeight", value: string) => void;
  experienceLevel: "beginner" | "expert";
}

export function LoftCabinetFields({
  lowSideHeight,
  highSideHeight,
  slopeDirection,
  width,
  depth,
  onLowSideHeightChange,
  onHighSideHeightChange,
  onSlopeDirectionChange,
  inputValues,
  onInputChange,
  experienceLevel,
}: LoftCabinetFieldsProps) {
  // Validate loft cabinet configuration
  const validation = useMemo(() => {
    return validateLoftCabinet(lowSideHeight, highSideHeight, width, depth);
  }, [lowSideHeight, highSideHeight, width, depth]);

  const hasErrors = validation.errors.length > 0;
  const slopeAngle = lowSideHeight > 0 && width > 0 
    ? Math.round(Math.atan((highSideHeight - lowSideHeight) / width) * (180 / Math.PI) * 10) / 10
    : 0;

  return (
    <div className="space-y-6">
      {/* Slope Direction Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Hellingsrichting *</Label>
        <p className="text-sm text-gray-600">Waar is het dak het laagst?</p>
        <div className="flex gap-3">
          <Button
            variant={slopeDirection === "left" ? "default" : "outline"}
            onClick={() => onSlopeDirectionChange("left")}
            className="flex-1"
          >
            Dak laag aan LINKS
          </Button>
          <Button
            variant={slopeDirection === "right" ? "default" : "outline"}
            onClick={() => onSlopeDirectionChange("right")}
            className="flex-1"
          >
            Dak laag aan RECHTS
          </Button>
        </div>
        {!slopeDirection && experienceLevel === "beginner" && (
          <p className="text-sm text-blue-600">💡 Dit bepaalt hoe de kast wordt georiënteerd</p>
        )}
      </div>

      {/* Low Side Height */}
      <div className="space-y-2">
        <Label htmlFor="lowSideHeight" className="flex items-center gap-2">
          <Ruler className="w-4 h-4" />
          Hoogte lage zijde *
        </Label>
        <p className="text-xs text-gray-600">Meet van vloer tot plafond aan de laagste kant</p>
        <Input
          id="lowSideHeight"
          type="number"
          value={inputValues.lowSideHeight}
          onChange={(e) => onInputChange("lowSideHeight", e.target.value)}
          onBlur={() => {
            const val = parseInt(inputValues.lowSideHeight);
            if (!isNaN(val)) {
              const clamped = Math.max(100, Math.min(300, val));
              onLowSideHeightChange(clamped);
            }
          }}
          min="100"
          max="300"
          className="w-full"
        />
        <p className="text-xs text-gray-500">Min: 100cm • Max: 300cm</p>
      </div>

      {/* High Side Height */}
      <div className="space-y-2">
        <Label htmlFor="highSideHeight" className="flex items-center gap-2">
          <Ruler className="w-4 h-4" />
          Hoogte hoge zijde *
        </Label>
        <p className="text-xs text-gray-600">Meet van vloer tot plafond aan de hoogste kant</p>
        <Input
          id="highSideHeight"
          type="number"
          value={inputValues.highSideHeight}
          onChange={(e) => onInputChange("highSideHeight", e.target.value)}
          onBlur={() => {
            const val = parseInt(inputValues.highSideHeight);
            if (!isNaN(val)) {
              const clamped = Math.max(100, Math.min(300, val));
              onHighSideHeightChange(clamped);
            }
          }}
          min="100"
          max="300"
          className="w-full"
        />
        <p className="text-xs text-gray-500">Min: 100cm • Max: 300cm</p>
      </div>

      {/* Slope Information */}
      {lowSideHeight > 0 && highSideHeight > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
          <p className="text-sm font-semibold text-blue-900">Hellingshoek: {slopeAngle}°</p>
          <p className="text-xs text-blue-700">
            Hoogteverschil: {highSideHeight - lowSideHeight}cm
          </p>
        </div>
      )}

      {/* Validation Errors */}
      {hasErrors && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900 text-sm">
                Deze kast voldoet mogelijk niet aan standaard bouwregels
              </p>
              <ul className="mt-2 space-y-1">
                {validation.errors.map((error, idx) => (
                  <li key={idx} className="text-xs text-yellow-800">
                    • {error}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-yellow-700 mt-2">
                Wij nemen contact op voor controle en advies.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Beginner Guidance */}
      {experienceLevel === "beginner" && !hasErrors && lowSideHeight > 0 && highSideHeight > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-900">
            ✓ Deze configuratie voldoet aan bouwstandaarden
          </p>
        </div>
      )}
    </div>
  );
}
