import React, { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Zap } from "lucide-react";
import { calculateOptimalStairConfig } from "@/../../shared/cabinetStandards";

interface StairConfiguratorFieldsProps {
  height: number;
  width: number; // Available length for stair run
  numberOfSteps: number;
  treadDepth: number;
  showManualOverride: boolean;
  onShowManualOverrideChange: (show: boolean) => void;
  onNumberOfStepsChange: (value: number) => void;
  onTreadDepthChange: (value: number) => void;
  inputValues: {
    numberOfSteps: string;
    treadDepth: string;
  };
  onInputChange: (field: "numberOfSteps" | "treadDepth", value: string) => void;
  experienceLevel: "beginner" | "expert";
}

export function StairConfiguratorFields({
  height,
  width,
  numberOfSteps,
  treadDepth,
  showManualOverride,
  onShowManualOverrideChange,
  onNumberOfStepsChange,
  onTreadDepthChange,
  inputValues,
  onInputChange,
  experienceLevel,
}: StairConfiguratorFieldsProps) {
  // Auto-calculate optimal stair configuration
  const stairCalculation = useMemo(() => {
    return calculateOptimalStairConfig(height, width);
  }, [height, width]);

  const risePerStep = stairCalculation.risePerStep;
  const isOptimal = stairCalculation.isOptimal;

  return (
    <div className="space-y-6">
      {/* Auto-Calculation Section */}
      <div className={`space-y-4 rounded-lg p-4 border-2 ${
        isOptimal 
          ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800" 
          : "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
      }`}>
        <div className="flex items-start gap-3">
          <Zap className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
            isOptimal ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"
          }`} />
          <div className="flex-1">
            <h3 className={`font-semibold ${
              isOptimal 
                ? "text-green-900 dark:text-green-100" 
                : "text-yellow-900 dark:text-yellow-100"
            }`}>
              ⚡ Automatische berekening
            </h3>
            <p className={`text-sm mt-1 ${
              isOptimal 
                ? "text-green-800 dark:text-green-200" 
                : "text-yellow-800 dark:text-yellow-200"
            }`}>
              Voer totale hoogte en beschikbare lengte in. Wij berekenen de optimale trapindeling.
            </p>
          </div>
        </div>

        {/* Calculated Results Display */}
        <div className="grid grid-cols-3 gap-3 bg-white dark:bg-slate-900 rounded p-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Aantal treden</p>
            <p className="text-2xl font-bold text-accent">{stairCalculation.numberOfSteps}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Stijging/trede</p>
            <p className="text-2xl font-bold text-accent">{risePerStep.toFixed(1)}cm</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Trede diepte</p>
            <p className="text-2xl font-bold text-accent">{stairCalculation.treadDepth}cm</p>
          </div>
        </div>

        {/* Warnings */}
        {stairCalculation.warnings.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-yellow-200 dark:border-yellow-800">
            {stairCalculation.warnings.map((warning, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">{warning}</p>
              </div>
            ))}
          </div>
        )}

        {/* Manual Override Toggle */}
        {experienceLevel === "expert" && (
          <div className="flex items-center gap-2 pt-3 border-t border-green-200 dark:border-green-800">
            <Checkbox
              id="manual-override"
              checked={showManualOverride}
              onCheckedChange={(checked) => onShowManualOverrideChange(checked as boolean)}
            />
            <Label htmlFor="manual-override" className="text-sm cursor-pointer">
              Handmatig aanpassen (voor gevorderde gebruikers)
            </Label>
          </div>
        )}
      </div>

      {/* Manual Override Fields (only for expert mode) */}
      {showManualOverride && experienceLevel === "expert" && (
        <div className="space-y-4 bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Handmatige aanpassingen</p>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-sm">Aantal treden</Label>
              <Input
                type="number"
                value={inputValues.numberOfSteps}
                onChange={(e) => onInputChange("numberOfSteps", e.target.value)}
                onBlur={(e) => {
                  const num = parseInt(e.target.value);
                  if (!isNaN(num)) {
                    onNumberOfStepsChange(Math.max(3, Math.min(30, num)));
                  }
                }}
                min="3"
                max="30"
              />
              <p className="text-xs text-muted-foreground">Min: 3 • Max: 30</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Trede diepte (cm)</Label>
              <Input
                type="number"
                value={inputValues.treadDepth}
                onChange={(e) => onInputChange("treadDepth", e.target.value)}
                onBlur={(e) => {
                  const num = parseInt(e.target.value);
                  if (!isNaN(num)) {
                    onTreadDepthChange(Math.max(25, Math.min(30, num)));
                  }
                }}
                min="25"
                max="30"
              />
              <p className="text-xs text-muted-foreground">Min: 25cm • Max: 30cm (optimaal)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
