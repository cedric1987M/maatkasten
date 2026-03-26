/**
 * Configuration Steps Components
 * 
 * Reusable components for each step of the 8-step configuration flow
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CabinetType,
  Placement,
  Shape,
  CABINET_TYPES,
  PLACEMENTS,
  SHAPES,
  FullConfiguration,
} from "../../../shared/configurationFlow";
import { AlertCircle, Check } from "lucide-react";

// ============================================================================
// Step 1: Cabinet Type Selection
// ============================================================================

interface Step1Props {
  selectedType: CabinetType;
  onTypeChange: (type: CabinetType) => void;
  onNext: () => void;
}

export function Step1TypeSelection({ selectedType, onTypeChange, onNext }: Step1Props) {
  const types: CabinetType[] = ["wardrobe", "tv-furniture", "shoe-cabinet", "loft-cabinet", "stairs"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Stap 1: Kies uw kasttype</h2>
        <p className="text-muted-foreground">Welk type kast wilt u ontwerpen?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {types.map((type) => (
          <Card
            key={type}
            className={`p-6 cursor-pointer transition-all ${
              selectedType === type
                ? "border-primary bg-primary/5 ring-2 ring-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => onTypeChange(type)}
          >
            <div className="flex items-start gap-4">
              <RadioGroup value={selectedType} onValueChange={(v) => onTypeChange(v as CabinetType)}>
                <RadioGroupItem value={type} id={`type-${type}`} />
              </RadioGroup>
              <div className="flex-1">
                <Label htmlFor={`type-${type}`} className="text-base font-semibold cursor-pointer">
                  {CABINET_TYPES[type].name}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">{CABINET_TYPES[type].description}</p>
              </div>
              {selectedType === type && <Check className="w-5 h-5 text-primary mt-1" />}
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={onNext} size="lg" className="w-full">
        Volgende →
      </Button>
    </div>
  );
}

// ============================================================================
// Step 2: Placement Selection
// ============================================================================

interface Step2Props {
  selectedPlacement: Placement;
  onPlacementChange: (placement: Placement) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2PlacementSelection({
  selectedPlacement,
  onPlacementChange,
  onNext,
  onBack,
}: Step2Props) {
  const placements: Placement[] = ["freestanding", "between-walls", "left-wall", "right-wall"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Stap 2: Plaatsing</h2>
        <p className="text-muted-foreground">Waar plaatst u de kast?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {placements.map((placement) => (
          <Card
            key={placement}
            className={`p-6 cursor-pointer transition-all ${
              selectedPlacement === placement
                ? "border-primary bg-primary/5 ring-2 ring-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => onPlacementChange(placement)}
          >
            <div className="flex items-start gap-4">
              <RadioGroup value={selectedPlacement} onValueChange={(v) => onPlacementChange(v as Placement)}>
                <RadioGroupItem value={placement} id={`placement-${placement}`} />
              </RadioGroup>
              <div className="flex-1">
                <Label htmlFor={`placement-${placement}`} className="text-base font-semibold cursor-pointer">
                  {PLACEMENTS[placement].name}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">{PLACEMENTS[placement].description}</p>
              </div>
              {selectedPlacement === placement && <Check className="w-5 h-5 text-primary mt-1" />}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
          ← Terug
        </Button>
        <Button onClick={onNext} size="lg" className="flex-1">
          Volgende →
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Step 3: Dimensions Input
// ============================================================================

interface Step3Props {
  width: number;
  height: number;
  depth: number;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onDepthChange: (value: number) => void;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  minDepth: number;
  maxDepth: number;
  errors: string[];
  onNext: () => void;
  onBack: () => void;
}

export function Step3Dimensions({
  width,
  height,
  depth,
  onWidthChange,
  onHeightChange,
  onDepthChange,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  minDepth,
  maxDepth,
  errors,
  onNext,
  onBack,
}: Step3Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Stap 3: Afmetingen</h2>
        <p className="text-muted-foreground">Bepaal de breedte, hoogte en diepte van uw kast</p>
      </div>

      {errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="text-sm text-destructive">
            {errors.map((error, i) => (
              <div key={i}>{error}</div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Width */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Breedte: {width} cm</Label>
            <span className="text-xs text-muted-foreground">
              {minWidth}-{maxWidth} cm
            </span>
          </div>
          <Slider
            value={[width]}
            onValueChange={(v) => onWidthChange(v[0])}
            min={minWidth}
            max={maxWidth}
            step={1}
            className="w-full"
          />
          <Input
            type="number"
            value={width}
            onChange={(e) => onWidthChange(parseInt(e.target.value) || minWidth)}
            min={minWidth}
            max={maxWidth}
            className="w-full"
          />
        </div>

        {/* Height */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Hoogte: {height} cm</Label>
            <span className="text-xs text-muted-foreground">
              {minHeight}-{maxHeight} cm
            </span>
          </div>
          <Slider
            value={[height]}
            onValueChange={(v) => onHeightChange(v[0])}
            min={minHeight}
            max={maxHeight}
            step={1}
            className="w-full"
          />
          <Input
            type="number"
            value={height}
            onChange={(e) => onHeightChange(parseInt(e.target.value) || minHeight)}
            min={minHeight}
            max={maxHeight}
            className="w-full"
          />
        </div>

        {/* Depth */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Diepte: {depth} cm</Label>
            <span className="text-xs text-muted-foreground">
              {minDepth}-{maxDepth} cm
            </span>
          </div>
          <Slider
            value={[depth]}
            onValueChange={(v) => onDepthChange(v[0])}
            min={minDepth}
            max={maxDepth}
            step={1}
            className="w-full"
          />
          <Input
            type="number"
            value={depth}
            onChange={(e) => onDepthChange(parseInt(e.target.value) || minDepth)}
            min={minDepth}
            max={maxDepth}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
          ← Terug
        </Button>
        <Button onClick={onNext} size="lg" className="flex-1" disabled={errors.length > 0}>
          Volgende →
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Step 4: Shape Selection (for loft cabinets)
// ============================================================================

interface Step4Props {
  shape: Shape;
  loftHeightLeft?: number;
  loftHeightRight?: number;
  onShapeChange: (shape: Shape) => void;
  onLoftHeightLeftChange?: (height: number) => void;
  onLoftHeightRightChange?: (height: number) => void;
  onNext: () => void;
  onBack: () => void;
  isLoftCabinet: boolean;
}

export function Step4Shape({
  shape,
  loftHeightLeft,
  loftHeightRight,
  onShapeChange,
  onLoftHeightLeftChange,
  onLoftHeightRightChange,
  onNext,
  onBack,
  isLoftCabinet,
}: Step4Props) {
  const shapes: Shape[] = ["straight", "sloped-left", "sloped-right"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Stap 4: Vorm</h2>
        <p className="text-muted-foreground">
          {isLoftCabinet
            ? "Kies of uw zolderkast recht of schuin is"
            : "Uw kast is recht"}
        </p>
      </div>

      {isLoftCabinet && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shapes.map((s) => (
            <Card
              key={s}
              className={`p-6 cursor-pointer transition-all ${
                shape === s
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : "hover:border-primary/50"
              }`}
              onClick={() => onShapeChange(s)}
            >
              <div className="flex items-start gap-4">
                <RadioGroup value={shape} onValueChange={(v) => onShapeChange(v as Shape)}>
                  <RadioGroupItem value={s} id={`shape-${s}`} />
                </RadioGroup>
                <div className="flex-1">
                  <Label htmlFor={`shape-${s}`} className="text-base font-semibold cursor-pointer">
                    {SHAPES[s].name}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">{SHAPES[s].description}</p>
                </div>
                {shape === s && <Check className="w-5 h-5 text-primary mt-1" />}
              </div>
            </Card>
          ))}
        </div>
      )}

      {isLoftCabinet && (shape === "sloped-left" || shape === "sloped-right") && (
        <Card className="p-6 bg-muted/50">
          <h3 className="font-semibold mb-4">Schuine hoogte</h3>
          <div className="space-y-4">
            {(shape === "sloped-left" || shape === "sloped-right") && onLoftHeightLeftChange && (
              <div className="space-y-2">
                <Label>Linker hoogte: {loftHeightLeft} cm</Label>
                <Slider
                  value={[loftHeightLeft || 100]}
                  onValueChange={(v) => onLoftHeightLeftChange(v[0])}
                  min={40}
                  max={260}
                  step={1}
                />
              </div>
            )}
            {(shape === "sloped-left" || shape === "sloped-right") && onLoftHeightRightChange && (
              <div className="space-y-2">
                <Label>Rechter hoogte: {loftHeightRight} cm</Label>
                <Slider
                  value={[loftHeightRight || 100]}
                  onValueChange={(v) => onLoftHeightRightChange(v[0])}
                  min={40}
                  max={260}
                  step={1}
                />
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
          ← Terug
        </Button>
        <Button onClick={onNext} size="lg" className="flex-1">
          Volgende →
        </Button>
      </div>
    </div>
  );
}


// ============================================================================
// Step 5: Layout Configuration
// ============================================================================

interface Step5Props {
  numberOfCompartments: number;
  numberOfShelves: number;
  numberOfDrawers: number;
  numberOfDoors: number;
  hasClothingRail: boolean;
  onCompartmentsChange: (n: number) => void;
  onShelvesChange: (n: number) => void;
  onDrawersChange: (n: number) => void;
  onDoorsChange: (n: number) => void;
  onClothingRailChange: (v: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step5Layout({
  numberOfCompartments,
  numberOfShelves,
  numberOfDrawers,
  numberOfDoors,
  hasClothingRail,
  onCompartmentsChange,
  onShelvesChange,
  onDrawersChange,
  onDoorsChange,
  onClothingRailChange,
  onNext,
  onBack,
}: Step5Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Stap 5: Indeling</h2>
        <p className="text-muted-foreground">Bepaal de compartimenten, planken en laden</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Aantal compartimenten: {numberOfCompartments}</Label>
          <Slider
            value={[numberOfCompartments]}
            onValueChange={(v) => onCompartmentsChange(v[0])}
            min={1}
            max={6}
            step={1}
          />
        </div>

        <div className="space-y-3">
          <Label>Aantal planken per compartiment: {numberOfShelves}</Label>
          <Slider
            value={[numberOfShelves]}
            onValueChange={(v) => onShelvesChange(v[0])}
            min={0}
            max={10}
            step={1}
          />
        </div>

        <div className="space-y-3">
          <Label>Aantal laden: {numberOfDrawers}</Label>
          <Slider
            value={[numberOfDrawers]}
            onValueChange={(v) => onDrawersChange(v[0])}
            min={0}
            max={6}
            step={1}
          />
        </div>

        <div className="space-y-3">
          <Label>Aantal deuren: {numberOfDoors}</Label>
          <Slider
            value={[numberOfDoors]}
            onValueChange={(v) => onDoorsChange(v[0])}
            min={0}
            max={6}
            step={1}
          />
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="clothing-rail"
            checked={hasClothingRail}
            onCheckedChange={(v) => onClothingRailChange(v as boolean)}
          />
          <Label htmlFor="clothing-rail" className="cursor-pointer">
            Kledingstang toevoegen
          </Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
          ← Terug
        </Button>
        <Button onClick={onNext} size="lg" className="flex-1">
          Volgende →
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Step 6: Fronts (Doors, Handles, Materials)
// ============================================================================

interface Step6Props {
  material: string;
  handleType: "knob" | "pull" | "integrated";
  doorSystem: "hinged" | "sliding" | "folding";
  onMaterialChange: (m: string) => void;
  onHandleTypeChange: (h: "knob" | "pull" | "integrated") => void;
  onDoorSystemChange: (d: "hinged" | "sliding" | "folding") => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step6Fronts({
  material,
  handleType,
  doorSystem,
  onMaterialChange,
  onHandleTypeChange,
  onDoorSystemChange,
  onNext,
  onBack,
}: Step6Props) {
  const materials = [
    { id: "white_melamine", name: "Wit melamine" },
    { id: "oak_decor", name: "Eiken decor" },
    { id: "black_decor", name: "Zwart decor" },
    { id: "mdf_white_ral9016", name: "MDF wit RAL9016" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Stap 6: Fronten</h2>
        <p className="text-muted-foreground">Kies materiaal, grepen en deursysteem</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Materiaal</Label>
          <div className="grid grid-cols-2 gap-2">
            {materials.map((m) => (
              <Button
                key={m.id}
                variant={material === m.id ? "default" : "outline"}
                onClick={() => onMaterialChange(m.id)}
                className="justify-start"
              >
                {m.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Greeptype</Label>
          <RadioGroup value={handleType} onValueChange={(v) => onHandleTypeChange(v as any)}>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="knob" id="handle-knob" />
              <Label htmlFor="handle-knob" className="cursor-pointer">
                Knop
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="pull" id="handle-pull" />
              <Label htmlFor="handle-pull" className="cursor-pointer">
                Trekgreep
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="integrated" id="handle-integrated" />
              <Label htmlFor="handle-integrated" className="cursor-pointer">
                Geïntegreerd
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Deursysteem</Label>
          <RadioGroup value={doorSystem} onValueChange={(v) => onDoorSystemChange(v as any)}>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="hinged" id="door-hinged" />
              <Label htmlFor="door-hinged" className="cursor-pointer">
                Scharnieren
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="sliding" id="door-sliding" />
              <Label htmlFor="door-sliding" className="cursor-pointer">
                Schuifdeuren
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="folding" id="door-folding" />
              <Label htmlFor="door-folding" className="cursor-pointer">
                Vouwdeuren
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
          ← Terug
        </Button>
        <Button onClick={onNext} size="lg" className="flex-1">
          Volgende →
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Step 7: Options (LED, Outlets, etc.)
// ============================================================================

interface Step7Props {
  hasLED: boolean;
  hasSocketOutlets: boolean;
  numberOfSocketOutlets: number;
  hasDrawerDividers: boolean;
  hasShoeRack: boolean;
  onLEDChange: (v: boolean) => void;
  onSocketOutletsChange: (v: boolean) => void;
  onNumberOfSocketOutletsChange: (n: number) => void;
  onDrawerDividersChange: (v: boolean) => void;
  onShoeRackChange: (v: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step7Options({
  hasLED,
  hasSocketOutlets,
  numberOfSocketOutlets,
  hasDrawerDividers,
  hasShoeRack,
  onLEDChange,
  onSocketOutletsChange,
  onNumberOfSocketOutletsChange,
  onDrawerDividersChange,
  onShoeRackChange,
  onNext,
  onBack,
}: Step7Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Stap 7: Opties</h2>
        <p className="text-muted-foreground">Voeg extra functies toe aan uw kast</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Checkbox id="led" checked={hasLED} onCheckedChange={(v) => onLEDChange(v as boolean)} />
          <Label htmlFor="led" className="cursor-pointer">
            LED-verlichting toevoegen (+€50)
          </Label>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="outlets"
            checked={hasSocketOutlets}
            onCheckedChange={(v) => onSocketOutletsChange(v as boolean)}
          />
          <Label htmlFor="outlets" className="cursor-pointer">
            Stopcontacten toevoegen
          </Label>
        </div>

        {hasSocketOutlets && (
          <div className="ml-6 space-y-2">
            <Label>Aantal stopcontacten: {numberOfSocketOutlets}</Label>
            <Slider
              value={[numberOfSocketOutlets]}
              onValueChange={(v) => onNumberOfSocketOutletsChange(v[0])}
              min={1}
              max={6}
              step={1}
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <Checkbox
            id="dividers"
            checked={hasDrawerDividers}
            onCheckedChange={(v) => onDrawerDividersChange(v as boolean)}
          />
          <Label htmlFor="dividers" className="cursor-pointer">
            Ladenverdelers toevoegen (+€20)
          </Label>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="shoeRack"
            checked={hasShoeRack}
            onCheckedChange={(v) => onShoeRackChange(v as boolean)}
          />
          <Label htmlFor="shoeRack" className="cursor-pointer">
            Schoenenrek toevoegen (+€30)
          </Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
          ← Terug
        </Button>
        <Button onClick={onNext} size="lg" className="flex-1">
          Volgende →
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Step 8: Delivery Options
// ============================================================================

interface Step8Props {
  deliveryOption: "pickup" | "delivery" | "delivery-and-install";
  notes?: string;
  onDeliveryOptionChange: (o: "pickup" | "delivery" | "delivery-and-install") => void;
  onNotesChange: (n: string) => void;
  onComplete: () => void;
  onBack: () => void;
  totalPrice: number;
}

export function Step8Delivery({
  deliveryOption,
  notes,
  onDeliveryOptionChange,
  onNotesChange,
  onComplete,
  onBack,
  totalPrice,
}: Step8Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Stap 8: Levering</h2>
        <p className="text-muted-foreground">Kies hoe u uw kast wilt ontvangen</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <RadioGroup value={deliveryOption} onValueChange={(v) => onDeliveryOptionChange(v as any)}>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="pickup" id="delivery-pickup" />
              <Label htmlFor="delivery-pickup" className="cursor-pointer">
                Afhalen (Gratis)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="delivery" id="delivery-delivery" />
              <Label htmlFor="delivery-delivery" className="cursor-pointer">
                Levering (+€50)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="delivery-and-install" id="delivery-install" />
              <Label htmlFor="delivery-install" className="cursor-pointer">
                Levering en plaatsing (+€200)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Opmerkingen (optioneel)</Label>
          <textarea
            id="notes"
            value={notes || ""}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Bijzonderheden, wensen, etc."
            className="w-full p-2 border rounded-lg"
            rows={4}
          />
        </div>
      </div>

      <Card className="p-4 bg-muted">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Totaal:</span>
          <span>€{totalPrice.toFixed(2)}</span>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
          ← Terug
        </Button>
        <Button onClick={onComplete} size="lg" className="flex-1">
          Bestellen →
        </Button>
      </div>
    </div>
  );
}
