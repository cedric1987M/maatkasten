import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, ChevronRight } from "lucide-react";

type WardroobeType = "sliding" | "hinged" | "open" | null;
type Material = "oak" | "white" | "black" | "walnut" | null;

interface ConfiguratorState {
  // Step 1: Dimensions
  width: number;
  height: number;
  depth: number;
  // Step 2: Type
  type: WardroobeType;
  // Step 3: Layout
  shelves: number;
  hangingSpace: boolean;
  drawers: number;
  // Step 4: Material
  material: Material;
  // Step 5: Result
  estimatedPrice: number;
}

export default function ConfiguratorNew() {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<ConfiguratorState>({
    width: 100,
    height: 200,
    depth: 60,
    type: null,
    shelves: 3,
    hangingSpace: true,
    drawers: 2,
    material: null,
    estimatedPrice: 0,
  });

  const updateConfig = (updates: Partial<ConfiguratorState>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const calculatePrice = () => {
    let price = 500; // Base price
    
    // Size factor
    const volume = (config.width * config.height * config.depth) / 1000;
    price += volume * 2;

    // Type factor
    if (config.type === "sliding") price += 200;
    if (config.type === "hinged") price += 150;
    if (config.type === "open") price += 50;

    // Layout factor
    price += config.shelves * 30;
    if (config.hangingSpace) price += 100;
    price += config.drawers * 50;

    // Material factor
    if (config.material === "oak") price += 300;
    if (config.material === "white") price += 150;
    if (config.material === "black") price += 200;
    if (config.material === "walnut") price += 400;

    return Math.round(price);
  };

  const handleNext = () => {
    if (step === 5) {
      updateConfig({ estimatedPrice: calculatePrice() });
    }
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = (): boolean => {
    switch (step) {
      case 1:
        return config.width > 0 && config.height > 0 && config.depth > 0;
      case 2:
        return config.type !== null;
      case 3:
        return config.shelves >= 0 && config.drawers >= 0;
      case 4:
        return config.material !== null;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Wardrobe Configurator
          </h1>
          <p className="text-slate-600">
            Design your perfect wardrobe in 5 simple steps
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all ${
                    s <= step
                      ? "bg-blue-600 text-white"
                      : "bg-slate-300 text-slate-600"
                  }`}
                >
                  {s}
                </div>
                <span className="text-xs text-slate-600 text-center">
                  {["Dimensions", "Type", "Layout", "Material", "Review"][s - 1]}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-8 mb-8 shadow-lg">
          {/* STEP 1: DIMENSIONS */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Step 1: Dimensions
              </h2>
              <p className="text-slate-600">
                Enter the dimensions for your wardrobe (in cm)
              </p>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700">
                    Width (cm)
                  </Label>
                  <Input
                    type="number"
                    value={config.width}
                    onChange={(e) =>
                      updateConfig({ width: parseInt(e.target.value) || 0 })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700">
                    Height (cm)
                  </Label>
                  <Input
                    type="number"
                    value={config.height}
                    onChange={(e) =>
                      updateConfig({ height: parseInt(e.target.value) || 0 })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700">
                    Depth (cm)
                  </Label>
                  <Input
                    type="number"
                    value={config.depth}
                    onChange={(e) =>
                      updateConfig({ depth: parseInt(e.target.value) || 0 })
                    }
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TYPE */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Step 2: Wardrobe Type
              </h2>
              <p className="text-slate-600">Choose your preferred door style</p>

              <RadioGroup value={config.type || ""} onValueChange={(value) => updateConfig({ type: value as WardroobeType })}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 p-4 border-2 border-slate-200 rounded-lg hover:border-blue-400 cursor-pointer">
                    <RadioGroupItem value="sliding" id="sliding" />
                    <Label htmlFor="sliding" className="cursor-pointer flex-1">
                      <div className="font-semibold text-slate-900">
                        Sliding Doors
                      </div>
                      <div className="text-sm text-slate-600">
                        Modern look, space-saving
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border-2 border-slate-200 rounded-lg hover:border-blue-400 cursor-pointer">
                    <RadioGroupItem value="hinged" id="hinged" />
                    <Label htmlFor="hinged" className="cursor-pointer flex-1">
                      <div className="font-semibold text-slate-900">
                        Hinged Doors
                      </div>
                      <div className="text-sm text-slate-600">
                        Classic style, full access
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border-2 border-slate-200 rounded-lg hover:border-blue-400 cursor-pointer">
                    <RadioGroupItem value="open" id="open" />
                    <Label htmlFor="open" className="cursor-pointer flex-1">
                      <div className="font-semibold text-slate-900">
                        Open Wardrobe
                      </div>
                      <div className="text-sm text-slate-600">
                        Contemporary, minimalist
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* STEP 3: LAYOUT */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Step 3: Interior Layout
              </h2>
              <p className="text-slate-600">
                Configure shelves, hanging space, and drawers
              </p>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700">
                    Number of Shelves: {config.shelves}
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={config.shelves}
                    onChange={(e) =>
                      updateConfig({ shelves: parseInt(e.target.value) })
                    }
                    className="w-full mt-2"
                  />
                </div>

                <div className="flex items-center space-x-3 p-4 border-2 border-slate-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="hanging"
                    checked={config.hangingSpace}
                    onChange={(e) =>
                      updateConfig({ hangingSpace: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <Label htmlFor="hanging" className="cursor-pointer">
                    Add Hanging Space (for coats, dresses)
                  </Label>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">
                    Number of Drawers: {config.drawers}
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={config.drawers}
                    onChange={(e) =>
                      updateConfig({ drawers: parseInt(e.target.value) })
                    }
                    className="w-full mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: MATERIAL */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Step 4: Material & Color
              </h2>
              <p className="text-slate-600">Choose your preferred finish</p>

              <RadioGroup value={config.material || ""} onValueChange={(value) => updateConfig({ material: value as Material })}>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "white", label: "White", desc: "Clean, modern" },
                    { value: "black", label: "Black", desc: "Elegant, bold" },
                    { value: "oak", label: "Oak", desc: "Warm, natural" },
                    {
                      value: "walnut",
                      label: "Walnut",
                      desc: "Premium, dark",
                    },
                  ].map((mat) => (
                    <div key={mat.value} className="flex items-center space-x-2 p-4 border-2 border-slate-200 rounded-lg hover:border-blue-400 cursor-pointer">
                      <RadioGroupItem value={mat.value} id={mat.value} />
                      <Label htmlFor={mat.value} className="cursor-pointer flex-1">
                        <div className="font-semibold text-slate-900">
                          {mat.label}
                        </div>
                        <div className="text-xs text-slate-600">{mat.desc}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* STEP 5: REVIEW */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Step 5: Your Wardrobe
              </h2>
              <p className="text-slate-600">Review your configuration</p>

              <div className="bg-slate-50 p-6 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Dimensions</p>
                    <p className="font-semibold text-slate-900">
                      {config.width}cm × {config.height}cm × {config.depth}cm
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Type</p>
                    <p className="font-semibold text-slate-900 capitalize">
                      {config.type} Doors
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Interior</p>
                    <p className="font-semibold text-slate-900">
                      {config.shelves} shelves
                      {config.hangingSpace && ", hanging space"}
                      {config.drawers > 0 && `, ${config.drawers} drawers`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Material</p>
                    <p className="font-semibold text-slate-900 capitalize">
                      {config.material}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg">
                <p className="text-sm text-blue-600 mb-2">Estimated Price</p>
                <p className="text-4xl font-bold text-blue-900">
                  €{calculatePrice().toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  *Price is an estimate. Final price may vary.
                </p>
              </div>

              <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
                <p className="text-green-900 font-semibold mb-3">
                  Ready to proceed?
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Request Quote
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handleBack}
            disabled={step === 1}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            Back
          </Button>

          <span className="text-sm font-medium text-slate-600">
            Step {step} of 5
          </span>

          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {step === 5 ? "Complete" : "Next"}
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
