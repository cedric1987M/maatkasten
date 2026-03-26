import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BOTTOM_FINISH_OPTIONS, BottomFinish } from "@/../../shared/cabinetStandards";
import { Info } from "lucide-react";

interface BottomFinishSelectorProps {
  value: BottomFinish;
  onChange: (value: BottomFinish) => void;
  experienceLevel?: "beginner" | "expert";
}

export function BottomFinishSelector({
  value,
  onChange,
  experienceLevel = "beginner",
}: BottomFinishSelectorProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold text-slate-900">
            Onderzijde
          </Label>
          {experienceLevel === "beginner" && (
            <p className="text-sm text-slate-600 mt-2">
              Kies hoe je kast aan de onderkant wordt afgewerkt
            </p>
          )}
        </div>

        <RadioGroup value={value} onValueChange={onChange}>
          <div className="space-y-3">
            {BOTTOM_FINISH_OPTIONS.map((option) => (
              <div
                key={option.value}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/50 transition-colors cursor-pointer"
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <Label
                    htmlFor={option.value}
                    className="font-medium text-slate-900 cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>

        {experienceLevel === "beginner" && (
          <div className="flex items-start space-x-2 p-3 bg-purple-100 rounded-lg border border-purple-300">
            <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-purple-900">
              Een plint zorgt voor een nette afwerking en stabiliteit. Verhoogde kasten zijn ideaal voor gemakkelijk schoonmaken.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
