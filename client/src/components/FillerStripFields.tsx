import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Info } from "lucide-react";

interface FillerStripFieldsProps {
  hasLeftFiller: boolean;
  leftFillerWidth: number;
  hasRightFiller: boolean;
  rightFillerWidth: number;
  onLeftFillerChange: (enabled: boolean) => void;
  onLeftWidthChange: (width: number) => void;
  onRightFillerChange: (enabled: boolean) => void;
  onRightWidthChange: (width: number) => void;
}

export function FillerStripFields({
  hasLeftFiller,
  leftFillerWidth,
  hasRightFiller,
  rightFillerWidth,
  onLeftFillerChange,
  onLeftWidthChange,
  onRightFillerChange,
  onRightWidthChange,
}: FillerStripFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          <strong>Passtukken:</strong> Zorgen voor een perfecte aansluiting tegen de muur
        </p>
      </div>

      {/* Left Filler Strip */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Checkbox
            id="leftFiller"
            checked={hasLeftFiller}
            onCheckedChange={(checked) => onLeftFillerChange(checked as boolean)}
          />
          <Label htmlFor="leftFiller" className="font-semibold cursor-pointer">
            Passtuk links
          </Label>
        </div>

        {hasLeftFiller && (
          <div className="ml-6 space-y-2">
            <div>
              <Label htmlFor="leftFillerWidth" className="text-sm">
                Breedte (cm)
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="leftFillerWidth"
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  value={leftFillerWidth}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      onLeftWidthChange(Math.max(1, Math.min(10, val)));
                    }
                  }}
                  className="w-20"
                />
                <span className="text-sm text-gray-600">cm (1-10 cm)</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Right Filler Strip */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Checkbox
            id="rightFiller"
            checked={hasRightFiller}
            onCheckedChange={(checked) => onRightFillerChange(checked as boolean)}
          />
          <Label htmlFor="rightFiller" className="font-semibold cursor-pointer">
            Passtuk rechts
          </Label>
        </div>

        {hasRightFiller && (
          <div className="ml-6 space-y-2">
            <div>
              <Label htmlFor="rightFillerWidth" className="text-sm">
                Breedte (cm)
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="rightFillerWidth"
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  value={rightFillerWidth}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      onRightWidthChange(Math.max(1, Math.min(10, val)));
                    }
                  }}
                  className="w-20"
                />
                <span className="text-sm text-gray-600">cm (1-10 cm)</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Summary */}
      {(hasLeftFiller || hasRightFiller) && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Passtukken samenvatting:</strong>
            {hasLeftFiller && <span> Links {leftFillerWidth}cm</span>}
            {hasLeftFiller && hasRightFiller && <span> • </span>}
            {hasRightFiller && <span> Rechts {rightFillerWidth}cm</span>}
          </p>
        </div>
      )}
    </div>
  );
}
