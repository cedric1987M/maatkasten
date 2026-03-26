import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { ArrowRight, Download, ShoppingCart, AlertCircle, Info, CheckCircle, Ruler, Zap } from "lucide-react";
import { toast } from "sonner";
import { Cabinet3DSimple } from "@/components/Cabinet3DSimple";
import { ConfiguratorPreview } from "@/components/ConfiguratorPreview";
import { StairConfiguratorFields } from "@/components/StairConfiguratorFields";
import { LoftCabinetFields } from "@/components/LoftCabinetFields";
import { FillerStripFields } from "@/components/FillerStripFields";
import { TopFinishSelector } from "@/components/TopFinishSelector";
import { BottomFinishSelector } from "@/components/BottomFinishSelector";
import { CABINET_STANDARDS, getDefaults, validateDimensions as validateDimensionsFromStandards, clampDimension, CabinetType as StdCabinetType, getAvailableMaterials, getAvailableDoorHardware, getOptionAvailability, validateConfigurationCompatibility, requiresManualReview, validateLoftCabinet, validateStairSafety, calculateOptimalSteps, calculateOptimalTreadDepth, calculateOptimalStairConfig, validateStairSpace, checkImpossibleCombinations, detectEdgeCaseConfiguration, validateFillerStrips } from "@/../../shared/cabinetStandards";

// Map ProductSelector type values to standard cabinet types
const TYPE_MAPPING: Record<string, StdCabinetType> = {
  // Wardrobe/Cabinet types
  standard: "wardrobe",
  wardrobe: "wardrobe",
  built_in: "wardrobe",
  
  // TV Furniture types
  tv_furniture: "tv-furniture",
  "tv-furniture": "tv-furniture",
  tv_standard: "tv-furniture",
  "tv-standard": "tv-furniture",
  wall_mounted: "tv-furniture",
  "wall-mounted": "tv-furniture",
  entertainment_unit: "tv-furniture",
  "entertainment-unit": "tv-furniture",
  
  // Loft Cabinet types
  loft_left: "loft-cabinet",
  loft_right: "loft-cabinet",
  loft_double: "loft-cabinet",
  "loft-cabinet": "loft-cabinet",
  
  // Shoe Cabinet types
  shoe_cabinet: "shoe-cabinet",
  "shoe-cabinet": "shoe-cabinet",
  
  // Stairs types
  stairs: "stairs",
  straight: "stairs",
  quarter_turn: "stairs",
  half_turn: "stairs",
  floating: "stairs",
  with_storage: "stairs",
};

type CabinetType = StdCabinetType;

export default function Configurator() {
  const [location, navigate] = useLocation();
  
  // Memoize initial type to prevent re-renders
  const { initialType, initialDefaults } = useMemo(() => {
    try {
      // Use URL API for proper parsing
      const url = new URL(window.location.href);
      const typeParam = url.searchParams.get('type');
      let type: CabinetType = "wardrobe";
      if (typeParam) {
        const mapped = TYPE_MAPPING[typeParam as keyof typeof TYPE_MAPPING];
        if (mapped) {
          type = mapped;
        }
      }
      const defaults = getDefaults(type);
      return {
        initialType: type,
        initialDefaults: {
          width: defaults.width,
          height: defaults.height,
          depth: defaults.depth,
          shelves: defaults.numberOfShelves,
          doors: defaults.numberOfDoors,
          drawers: defaults.numberOfDrawers,
        }
      };
    } catch (e) {
      // Fallback if URL parsing fails
      const defaults = getDefaults("wardrobe");
      return {
        initialType: "wardrobe" as CabinetType,
        initialDefaults: {
          width: defaults.width,
          height: defaults.height,
          depth: defaults.depth,
          shelves: defaults.numberOfShelves,
          doors: defaults.numberOfDoors,
          drawers: defaults.numberOfDrawers,
        }
      };
    }
  }, [location]);

  const [currentStep, setCurrentStep] = useState(2); // Start at step 2 if type is in URL
  const [cabinetType, setCabinetType] = useState<CabinetType>(initialType);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestFormData, setRequestFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [manualReviewRequired, setManualReviewRequired] = useState(false);
  const [manualReviewReason, setManualReviewReason] = useState<string>();
  const [userConfirmedReview, setUserConfirmedReview] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'expert'>('beginner');
  
  // Stair safety validation state
  const [stairSafetyWarnings, setStairSafetyWarnings] = useState<string[]>([]);
  const [stairIsCompliant, setStairIsCompliant] = useState(true);
  
  // Impossible combination state
  const [impossibleCombination, setImpossibleCombination] = useState<{ isImpossible: boolean; reason?: string }>({ isImpossible: false });
  const [userConfirmedImpossible, setUserConfirmedImpossible] = useState(false);
  
  // Edge-case state
  const [edgeCaseWarning, setEdgeCaseWarning] = useState<{ isEdgeCase: boolean; reason?: string; severity?: 'warning' | 'caution' }>({ isEdgeCase: false });
  const [userConfirmedEdgeCase, setUserConfirmedEdgeCase] = useState(false);

  // Configuration state
  const [config, setConfig] = useState({
    width: initialDefaults.width,
    height: initialDefaults.height,
    depth: initialDefaults.depth,
    numberOfCompartments: 2,
    numberOfShelves: initialDefaults.shelves,
    numberOfDoors: initialDefaults.doors,
    numberOfDrawers: initialDefaults.drawers,
    hasClothingRail: initialType === "wardrobe",
    material: "white_melamine" as const,
    doorHardware: "push_to_open" as "push_to_open" | "handle" | "knob",
    installation: "diy" as "diy" | "with_placement",
    includeInstallation: false,
    hasLeftFiller: false,
    leftFillerWidth: 2,
    hasRightFiller: false,
    rightFillerWidth: 2,
    topFinish: "flush_to_ceiling" as const,
    bottomFinish: "met_plint" as const,
    // Loft cabinet specific fields
    slopeDirection: "left" as "left" | "right",
    lowSideHeight: 80,
    highSideHeight: 200,
    // Stair specific fields
    numberOfSteps: 15,
    treadDepth: 28,
  });

  // Local state for input fields to allow typing without immediate config reset
  const [inputValues, setInputValues] = useState({
    width: String(initialDefaults.width),
    height: String(initialDefaults.height),
    depth: String(initialDefaults.depth),
    lowSideHeight: initialType === "loft-cabinet" ? "80" : "",
    highSideHeight: initialType === "loft-cabinet" ? "200" : "",
    numberOfSteps: initialType === "stairs" ? "15" : "",
    treadDepth: initialType === "stairs" ? "28" : "",
  });

  // Save experience level preference to localStorage
  useEffect(() => {
    localStorage.setItem('configurator_experience_level', experienceLevel);
  }, [experienceLevel]);

  // Load experience level preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('configurator_experience_level');
    if (saved === 'expert' || saved === 'beginner') {
      setExperienceLevel(saved);
    }
  }, []);

  // Sync input values when config changes (from slider only, not from input changes)
  useEffect(() => {
    // Only sync when initialDefaults changes (i.e., when cabinet type changes)
    setInputValues({
      width: String(initialDefaults.width),
      height: String(initialDefaults.height),
      depth: String(initialDefaults.depth),
      lowSideHeight: initialType === "loft-cabinet" ? "80" : "",
      highSideHeight: initialType === "loft-cabinet" ? "200" : "",
      numberOfSteps: initialType === "stairs" ? "15" : "",
      treadDepth: initialType === "stairs" ? "28" : "",
    });
  }, [initialDefaults, initialType]);
  
  // Validate stair safety when stairs config changes
  useEffect(() => {
    if (cabinetType === 'stairs') {
      const validation = validateStairSafety(config.height, config.numberOfSteps, config.treadDepth);
      setStairSafetyWarnings(validation.warnings);
      setStairIsCompliant(validation.isCompliant);
    }
  }, [config.height, config.numberOfSteps, config.treadDepth, cabinetType]);

  // Calculate pricing and cut list
  const { data: calculationResult, isLoading } = trpc.cabinet.calculatePrice.useQuery(config);
  const { data: validation } = trpc.cabinet.validateConfig.useQuery(config);

  // Handle cabinet type change
  const handleCabinetTypeChange = (type: CabinetType) => {
    setCabinetType(type);
    const defaults = getDefaults(type);
    setConfig({
      width: defaults.width,
      height: defaults.height,
      depth: defaults.depth,
      numberOfCompartments: 2,
      numberOfShelves: defaults.numberOfShelves,
      numberOfDoors: defaults.numberOfDoors,
      numberOfDrawers: defaults.numberOfDrawers,
      hasClothingRail: type === "wardrobe",
      material: "white_melamine",
      doorHardware: "push_to_open",
      slopeDirection: "left",
      lowSideHeight: 80,
      highSideHeight: 200,
      numberOfSteps: type === "stairs" ? 15 : 0,
      treadDepth: type === "stairs" ? 28 : 0,
      installation: "diy",
      includeInstallation: false,
      hasLeftFiller: false,
      leftFillerWidth: 2,
      hasRightFiller: false,
      rightFillerWidth: 2,
    topFinish: "flush_to_ceiling" as const,
    bottomFinish: "met_plint" as const,
    });
    setCurrentStep(2);
    setValidationErrors([]);
  };



  // Validate dimensions using centralized standards
  const validateDimensions = (width: number, height: number, depth: number) => {
    const result = validateDimensionsFromStandards(cabinetType, width, height, depth);
    return result.errors;
  };

  // Clamp dimension to valid range using centralized standards
  const clampDimensionValue = (dimension: 'width' | 'height' | 'depth', value: number) => {
    return clampDimension(cabinetType, dimension, value);
  };

  // Handle dimension change from slider
  const handleDimensionChange = (key: "width" | "height" | "depth", value: number) => {
    if (isNaN(value)) return;
    
    // Check manual review BEFORE clamping to catch extreme values
    const tempConfig = {
      ...config,
      [key]: value,
    };
    const review = requiresManualReview(tempConfig.width, tempConfig.height, tempConfig.depth, cabinetType);
    
    const clamped = clampDimensionValue(key, value);

    setConfig((prev) => ({
      ...prev,
      [key]: clamped,
    }));
    
    // Validate using the new clamped values
    const errors = validateDimensions(
      tempConfig.width,
      tempConfig.height,
      tempConfig.depth
    );
    setValidationErrors(errors);
    
    // Set manual review state based on original (unclamped) value
    setManualReviewRequired(review.requiresReview);
    setManualReviewReason(review.reason);
    setUserConfirmedReview(false); // Reset confirmation when dimensions change
    
    // Also update input value for slider changes
    setInputValues(prev => ({
      ...prev,
      [key]: String(clamped),
    }));
  };

  const handleConfigChange = (key: string, value: any) => {
    // For stairs, validate safety when steps or tread depth change
    if (cabinetType === 'stairs' && (key === 'numberOfSteps' || key === 'treadDepth')) {
      const newConfig = {
        ...config,
        [key]: value,
      };
      
      // Validate stair safety
      if (newConfig.numberOfSteps < 3) {
        toast.error('Minimum 3 treden vereist');
        return;
      }
      if (newConfig.numberOfSteps > 30) {
        toast.error('Maximum 30 treden');
        return;
      }
      if (newConfig.treadDepth < 25) {
        toast.error('Trede moet minimaal 25cm diep zijn');
        return;
      }
      if (newConfig.treadDepth > 30) {
        toast.error('Trede mag maximaal 30cm diep zijn');
        return;
      }
    }
    
    // For loft cabinet, validate slope heights when they change
    if (cabinetType === 'loft-cabinet' && (key === 'lowSideHeight' || key === 'highSideHeight')) {
      const newConfig = {
        ...config,
        [key]: value,
      };
      
      // Import validation function from cabinetStandards
      // This will be validated on the server side
      if (newConfig.highSideHeight <= newConfig.lowSideHeight) {
        toast.error('Hoge zijde moet hoger zijn dan lage zijde');
        return;
      }
      
      // Check slope angle (max 45 degrees)
      const heightDifference = newConfig.highSideHeight - newConfig.lowSideHeight;
      if (heightDifference > config.width) {
        toast.error('Helling is te steil (meer dan 45 graden)');
        return;
      }
    }
    
    // Check for impossible combinations
    const newConfig = {
      ...config,
      [key]: value,
    };
    
    const impossibleCheck = checkImpossibleCombinations(
      cabinetType,
      newConfig.width,
      newConfig.height,
      newConfig.depth,
      newConfig.numberOfDrawers > 0,
      newConfig.numberOfDoors > 0,
      newConfig.numberOfShelves,
      newConfig.numberOfDoors
    );
    
    if (impossibleCheck.isImpossible) {
      setImpossibleCombination(impossibleCheck);
      setUserConfirmedImpossible(false);
      toast.error(impossibleCheck.reason || 'Deze combinatie is niet mogelijk');
      return; // Don't update config if impossible
    } else {
      setImpossibleCombination({ isImpossible: false });
    }
    
    // Check for edge-case configurations (near limits)
    const edgeCaseCheck = detectEdgeCaseConfiguration(
      cabinetType,
      newConfig.width,
      newConfig.height,
      newConfig.depth,
      newConfig.numberOfShelves,
      newConfig.numberOfDoors,
      newConfig.numberOfDrawers > 0
    );
    
    if (edgeCaseCheck.isEdgeCase) {
      setEdgeCaseWarning(edgeCaseCheck);
      setUserConfirmedEdgeCase(false);
    } else {
      setEdgeCaseWarning({ isEdgeCase: false });
    }
    
    setConfig(newConfig);
  };

  const handleOrder = () => {
    if (validationErrors.length === 0) {
      setShowRequestForm(true);
    } else {
      toast.error("Corrigeer de fouten voordat u bestelt");
    }
  };

  const handleSubmitRequest = async () => {
    if (!requestFormData.name.trim() || !requestFormData.phone.trim() || !requestFormData.email.trim()) {
      toast.error("Vul alle velden in");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(requestFormData.email)) {
      toast.error("Voer een geldig e-mailadres in");
      return;
    }

    setIsSubmittingRequest(true);
    try {
      toast.success("Bedankt! Wij nemen spoedig contact met u op.");
      setShowRequestForm(false);
      navigate("/checkout", { state: { config, customerInfo: requestFormData } });
    } catch (error) {
      toast.error("Er is een fout opgetreden. Probeer het later opnieuw.");
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const handleDownloadCutList = () => {
    if (!calculationResult?.cutList) {
      toast.error("Zaaglijst niet beschikbaar");
      return;
    }

    let csv = "Paneel,Breedte (cm),Hoogte (cm),Dikte (mm),Aantal,Materiaal,Kantenband,Opmerkingen\n";
    calculationResult.cutList.panels.forEach((panel: any) => {
      csv += `"${panel.name}",${panel.width},${panel.height},${panel.thickness},${panel.quantity},"${panel.material}","${panel.edgeBanding || ""}","${panel.notes || ""}"\n`;
    });

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", "zaaglijst.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("Zaaglijst gedownload");
  };

  // Disable options based on validation
  const canAddClothingRail = validation?.canAddClothingRail ?? true;
  const canAddDrawers = validation?.canAddDrawers ?? true;

  // Get compatibility constraints for current cabinet type
  const optionAvailability = getOptionAvailability(cabinetType);
  const availableMaterials = getAvailableMaterials(cabinetType);
  const availableDoorHardware = getAvailableDoorHardware(cabinetType);

  // Check if current selections are compatible
  const compatibilityErrors = validateConfigurationCompatibility(
    cabinetType,
    config.material as any,
    config.doorHardware,
    config.numberOfDoors,
    config.numberOfDrawers,
    config.numberOfShelves,
    config.hasClothingRail
  );

  // Disable options based on availability
  const canHaveDoors = optionAvailability.canHaveDoors;
  const canHaveDrawers = optionAvailability.canHaveDrawers;
  const canHaveClothingRail = optionAvailability.canHaveClothingRail;
  const canHaveShelves = optionAvailability.canHaveShelves;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Maatkast Configurator</h1>
              <p className="text-muted-foreground mt-2">Stap {currentStep} van 8 - Ontwerp uw perfecte maatkast</p>
            </div>
            <div className="flex items-center gap-2 bg-background rounded-lg p-1">
              <button
                onClick={() => setExperienceLevel('beginner')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  experienceLevel === 'beginner'
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                👤 Beginner
              </button>
              <button
                onClick={() => setExperienceLevel('expert')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                  experienceLevel === 'expert'
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Zap className="w-4 h-4" />
                Expert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="bg-card border-b border-border">
        <div className="container py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Stel jouw maatwerk project samen</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Gebruik onze tool om eenvoudig jouw kast, trap of meubel samen te stellen. Wij controleren alles en begeleiden je verder.
            </p>
            <div className="flex gap-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>Realtime preview</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>Automatische zaaglijst</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>Directe prijsberekening</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Cabinet Type Selection */}
            {currentStep === 1 && (
              <Card className="p-6 space-y-4">
                <div className="space-y-2 pb-4 border-b border-border">
                  <h2 className="text-xl font-bold">Stap 1: Wat wil je maken?</h2>
                  <p className="text-sm text-muted-foreground">Selecteer het type meubel dat u wilt ontwerpen. U kunt later altijd nog van gedachten veranderen.</p>
                </div>
                  <div className="space-y-2">
                    {Object.keys(CABINET_STANDARDS).map((type) => (
                      <Button
                        key={type}
                        onClick={() => handleCabinetTypeChange(type as CabinetType)}
                        variant={cabinetType === type ? "default" : "outline"}
                        className="w-full justify-start"
                      >
                        {type === "wardrobe" && "Kledingkast"}
                        {type === "tv-furniture" && "TV Meubel"}
                        {type === "shoe-cabinet" && "Schoenenkast"}
                        {type === "loft-cabinet" && "Zolderkast"}
                        {type === "stairs" && "Trap"}
                      </Button>
                    ))}
                  </div>
              </Card>
            )}

            {/* Steps 2-8: Configuration */}
            {currentStep >= 2 && (
              <>
                {/* Step 2: Dimensions */}
                {currentStep === 2 && (
                  <Card className="p-6 space-y-6">
                    <div className="space-y-3 pb-4 border-b border-border">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">Geef de afmetingen van jouw ruimte in</h2>
                        <p className="text-sm text-muted-foreground mt-2">Stel de perfecte maten in voor uw ruimte. Wij controleren alles en passen indien nodig aan.</p>
                      </div>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-1 bg-accent/10 rounded">📏 Precisie niet nodig</span>
                        <span className="px-2 py-1 bg-accent/10 rounded">✓ Wij helpen</span>
                      </div>
                    </div>

                    {/* Width */}
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Ruler className="w-4 h-4 text-accent" />
                              <Label className="text-base font-medium">Hoe breed moet het zijn?</Label>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Meet van muur tot muur voor de volledige beschikbare ruimte</p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-accent">{config.width}</span>
                            <p className="text-xs text-muted-foreground">cm</p>
                          </div>
                        </div>
                      <Slider
                        value={[config.width]}
                        onValueChange={(v) => handleDimensionChange("width", v[0])}
                        min={CABINET_STANDARDS[cabinetType].minWidth}
                        max={CABINET_STANDARDS[cabinetType].maxWidth}
                        step={5}
                        className="w-full"
                      />
                      <Input
                        type="number"
                        value={inputValues.width}
                        onChange={(e) => {
                          setInputValues(prev => ({ ...prev, width: e.target.value }));
                        }}
                        onBlur={(e) => {
                          const val = e.target.value;
                          const num = parseInt(val);
                          if (!isNaN(num) && num > 0) {
                            handleDimensionChange("width", num);
                          } else {
                            // Reset to config value if invalid
                            setInputValues(prev => ({ ...prev, width: String(config.width) }));
                          }
                        }}
                        min={CABINET_STANDARDS[cabinetType].minWidth}
                        max={CABINET_STANDARDS[cabinetType].maxWidth}
                      />
                      <p className="text-xs text-muted-foreground">Min: {CABINET_STANDARDS[cabinetType].minWidth}cm • Max: {CABINET_STANDARDS[cabinetType].maxWidth}cm</p>
                      </div>

                    {/* Height */}
                    <div className="space-y-3">
                      {experienceLevel === 'beginner' && (
                        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-900 dark:text-blue-100">
                          <strong>💡 Tip:</strong> Meet van vloer tot plafond. Dit bepaalt hoe hoog jouw meubel kan zijn.
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Ruler className="w-4 h-4 text-accent" />
                              <Label className="text-base font-medium">Hoe hoog moet het zijn?</Label>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Meet de volledige beschikbare hoogte van vloer tot plafond</p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-accent">{config.height}</span>
                            <p className="text-xs text-muted-foreground">cm</p>
                          </div>
                        </div>
                      </div>
                      <Slider
                        value={[config.height]}
                        onValueChange={(v) => handleDimensionChange("height", v[0])}
                        min={CABINET_STANDARDS[cabinetType].minHeight}
                        max={CABINET_STANDARDS[cabinetType].maxHeight}
                        step={5}
                        className="w-full"
                      />
                      <Input
                        type="number"
                        value={inputValues.height}
                        onChange={(e) => {
                          setInputValues(prev => ({ ...prev, height: e.target.value }));
                        }}
                        onBlur={(e) => {
                          const val = e.target.value;
                          const num = parseInt(val);
                          if (!isNaN(num) && num > 0) {
                            handleDimensionChange("height", num);
                          } else {
                            // Reset to config value if invalid
                            setInputValues(prev => ({ ...prev, height: String(config.height) }));
                          }
                        }}
                        min={CABINET_STANDARDS[cabinetType].minHeight}
                        max={CABINET_STANDARDS[cabinetType].maxHeight}
                      />
                      <p className="text-xs text-muted-foreground">Min: {CABINET_STANDARDS[cabinetType].minHeight}cm • Max: {CABINET_STANDARDS[cabinetType].maxHeight}cm</p>
                      </div>
                      </div>

                    {/* Depth */}
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Ruler className="w-4 h-4 text-accent" />
                              <Label className="text-base font-medium">Hoe diep moet het zijn?</Label>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Geef de buitenafmetingen in (diepte van voorkant tot achterkant)</p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-accent">{config.depth}</span>
                            <p className="text-xs text-muted-foreground">cm</p>
                          </div>
                        </div>
                      </div>
                      <Slider
                        value={[config.depth]}
                        onValueChange={(v) => handleDimensionChange("depth", v[0])}
                        min={CABINET_STANDARDS[cabinetType].minDepth}
                        max={CABINET_STANDARDS[cabinetType].maxDepth}
                        step={5}
                        className="w-full"
                      />
                      <Input
                        type="number"
                        value={inputValues.depth}
                        onChange={(e) => {
                          setInputValues(prev => ({ ...prev, depth: e.target.value }));
                        }}
                        onBlur={(e) => {
                          const val = e.target.value;
                          const num = parseInt(val);
                          if (!isNaN(num) && num > 0) {
                            handleDimensionChange("depth", num);
                          } else {
                            // Reset to config value if invalid
                            setInputValues(prev => ({ ...prev, depth: String(config.depth) }));
                          }
                        }}
                        min={CABINET_STANDARDS[cabinetType].minDepth}
                        max={CABINET_STANDARDS[cabinetType].maxDepth}
                      />
                      <p className="text-xs text-muted-foreground">Min: {CABINET_STANDARDS[cabinetType].minDepth}cm • Max: {CABINET_STANDARDS[cabinetType].maxDepth}cm</p>
                    </div>

                    {/* Loft Cabinet Specific Fields */}
                    {cabinetType === 'loft-cabinet' && (
                      <LoftCabinetFields
                        lowSideHeight={config.lowSideHeight}
                        highSideHeight={config.highSideHeight}
                        slopeDirection={config.slopeDirection as 'left' | 'right' | ''}
                        width={config.width}
                        depth={config.depth}
                        onLowSideHeightChange={(val) => handleConfigChange('lowSideHeight', val)}
                        onHighSideHeightChange={(val) => handleConfigChange('highSideHeight', val)}
                        onSlopeDirectionChange={(dir) => handleConfigChange('slopeDirection', dir)}
                        inputValues={{
                          lowSideHeight: inputValues.lowSideHeight,
                          highSideHeight: inputValues.highSideHeight,
                        }}
                        onInputChange={(field, value) => {
                          if (field === 'lowSideHeight') {
                            setInputValues(prev => ({ ...prev, lowSideHeight: value }));
                          } else if (field === 'highSideHeight') {
                            setInputValues(prev => ({ ...prev, highSideHeight: value }));
                          }
                        }}
                        experienceLevel={experienceLevel}
                      />
                    )}

                    {/* Validation Errors */}
                    {validationErrors.length > 0 && (
                      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 space-y-2">
                        {validationErrors.map((error, i) => (
                          <div key={i} className="flex gap-2 text-sm text-destructive">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Impossible Combination Warning */}
                    {impossibleCombination.isImpossible && (
                      <div className="bg-red-50 border border-red-300 rounded-lg p-4 space-y-3">
                        <div className="flex gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-red-900">Deze combinatie is niet mogelijk</h3>
                            <p className="text-sm text-red-800 mt-1">
                              {impossibleCombination.reason || 'Deze combinatie kan niet gebouwd worden. Pas je instellingen aan.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Manual Review Required Warning */}
                    {manualReviewRequired && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
                        <div className="flex gap-3">
                          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-yellow-900">Extra controle nodig</h3>
                            <p className="text-sm text-yellow-800 mt-1">
                              Voor deze afmetingen nemen wij contact op voor extra controle
                            </p>
                            {manualReviewReason && (
                              <p className="text-xs text-yellow-700 mt-2 italic">
                                Reden: {manualReviewReason}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}


                    {/* Edge-Case Warning */}
                    {edgeCaseWarning.isEdgeCase && (
                      <div className={`${edgeCaseWarning.severity === 'caution' ? 'bg-orange-50 border border-orange-300' : 'bg-blue-50 border border-blue-300'} rounded-lg p-4 space-y-3`}>
                        <div className="flex gap-3">
                          <AlertCircle className={`w-5 h-5 ${edgeCaseWarning.severity === 'caution' ? 'text-orange-600' : 'text-blue-600'} flex-shrink-0 mt-0.5`} />
                          <div className="flex-1">
                            <h3 className={`font-semibold ${edgeCaseWarning.severity === 'caution' ? 'text-orange-900' : 'text-blue-900'}`}>Configuratie vereist controle</h3>
                            <p className={`text-sm ${edgeCaseWarning.severity === 'caution' ? 'text-orange-800' : 'text-blue-800'} mt-1`}>
                              {edgeCaseWarning.reason || 'Voor deze configuratie nemen wij contact op voor extra controle'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stair Auto-Calculation Fields */}
                    {cabinetType === 'stairs' && (
                      <StairConfiguratorFields
                        height={config.height}
                        width={config.width}
                        numberOfSteps={config.numberOfSteps}
                        treadDepth={config.treadDepth}
                        showManualOverride={false}
                        onShowManualOverrideChange={() => {}}
                        onNumberOfStepsChange={(val) => handleConfigChange('numberOfSteps', val)}
                        onTreadDepthChange={(val) => handleConfigChange('treadDepth', val)}
                        inputValues={{
                          numberOfSteps: inputValues.numberOfSteps,
                          treadDepth: inputValues.treadDepth,
                        }}
                        onInputChange={(field, val) => {
                          if (field === 'numberOfSteps') {
                            setInputValues(prev => ({ ...prev, numberOfSteps: val }));
                          } else {
                            setInputValues(prev => ({ ...prev, treadDepth: val }));
                          }
                        }}
                        experienceLevel={experienceLevel}
                      />
                    )}

                    {/* Old Stair Safety Fields - REMOVE AFTER TESTING */}
                    {false && cabinetType === 'stairs' && (
                      <div className="space-y-6 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-base font-medium">Aantal treden</Label>
                                <p className="text-xs text-muted-foreground mt-1">Aantal stappen in de trap (3-30)</p>
                              </div>
                              <div className="text-right">
                                <span className="text-2xl font-bold text-accent">{config.numberOfSteps}</span>
                              </div>
                            </div>
                          </div>
                          <Input
                            type="number"
                            value={inputValues.numberOfSteps}
                            onChange={(e) => {
                              setInputValues(prev => ({ ...prev, numberOfSteps: e.target.value }));
                            }}
                            onBlur={(e) => {
                              const val = e.target.value;
                              const num = parseInt(val);
                              if (!isNaN(num) && num > 0) {
                                handleConfigChange('numberOfSteps', Math.max(3, Math.min(30, num)));
                              } else {
                                setInputValues(prev => ({ ...prev, numberOfSteps: String(config.numberOfSteps) }));
                              }
                            }}
                            min="3"
                            max="30"
                          />
                          <p className="text-xs text-muted-foreground">Min: 3 • Max: 30</p>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-base font-medium">Trede diepte</Label>
                                <p className="text-xs text-muted-foreground mt-1">Diepte van elke trede (25-30cm optimaal)</p>
                              </div>
                              <div className="text-right">
                                <span className="text-2xl font-bold text-accent">{config.treadDepth}</span>
                                <p className="text-xs text-muted-foreground">cm</p>
                              </div>
                            </div>
                          </div>
                          <Input
                            type="number"
                            value={inputValues.treadDepth}
                            onChange={(e) => {
                              setInputValues(prev => ({ ...prev, treadDepth: e.target.value }));
                            }}
                            onBlur={(e) => {
                              const val = e.target.value;
                              const num = parseInt(val);
                              if (!isNaN(num) && num > 0) {
                                handleConfigChange('treadDepth', Math.max(25, Math.min(30, num)));
                              } else {
                                setInputValues(prev => ({ ...prev, treadDepth: String(config.treadDepth) }));
                              }
                            }}
                            min="25"
                            max="30"
                          />
                          <p className="text-xs text-muted-foreground">Min: 25cm • Max: 30cm</p>
                        </div>
                      </div>
                    )}

                    {/* Stair Safety Warnings */}
                    {cabinetType === 'stairs' && stairSafetyWarnings.length > 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 space-y-3">
                        <div className="flex gap-3">
                          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Comfortcontrole nodig</h3>
                            <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-2">Deze trap voldoet mogelijk niet aan standaard comfortregels. Wij nemen contact op voor controle.</p>
                            <ul className="text-xs text-yellow-700 dark:text-yellow-300 mt-2 space-y-1 list-disc list-inside">
                              {stairSafetyWarnings.map((warning, i) => (
                                <li key={i}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reassurance Text */}
                    <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground text-center">
                        <span className="font-medium text-foreground">Twijfel je?</span> Wij controleren alles voor productie
                      </p>
                    </div>

                    <div>
                      <Button onClick={() => setCurrentStep(3)} className="w-full">
                        Volgende <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">Wij controleren alles nadien</p>
                    </div>
                  </Card>
                )}

                {/* Step 3: Layout */}
                {currentStep === 3 && (
                  <Card className="p-6 space-y-6">
                    <div className="space-y-3 pb-4 border-b border-border">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">Kies je indeling</h2>
                        <p className="text-sm text-muted-foreground mt-2">
                          {experienceLevel === 'beginner' 
                            ? 'Bepaal hoeveel planken, laden en kledinghangers je wilt. Wij helpen je verder bij twijfel.'
                            : 'Stel je indeling samen. Alle opties zijn beschikbaar.'
                          }
                        </p>
                      </div>
                      {experienceLevel === 'beginner' && (
                        <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 text-sm">
                          <p className="text-foreground"><span className="font-semibold">💡 Tip voor beginners:</span> Start met 2-3 planken en 1-2 laden. Je kunt dit later nog aanpassen.</p>
                        </div>
                      )}
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-1 bg-accent/10 rounded">📦 Flexibel aanpasbaar</span>
                        <span className="px-2 py-1 bg-accent/10 rounded">✓ Advies beschikbaar</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Shelves */}
                      <div className={`space-y-3 p-4 border rounded-lg transition ${
                        canHaveShelves 
                          ? 'border-border bg-card/50 hover:bg-card' 
                          : 'border-border/50 bg-muted/30 opacity-60'
                      }`}>
                        <div>
                          <Label className={`text-base font-medium ${
                            !canHaveShelves ? 'text-muted-foreground' : ''
                          }`}>Hoeveel planken voor opslag?</Label>
                          <p className="text-xs text-muted-foreground mt-1">Voor stapeling van kleding en accessoires</p>
                          {!canHaveShelves && (
                            <p className="text-xs text-destructive mt-2">Niet beschikbaar voor dit kasttype</p>
                          )}
                        </div>
                        <Input
                          type="number"
                          value={config.numberOfShelves}
                          onChange={(e) => handleConfigChange("numberOfShelves", parseInt(e.target.value) || 0)}
                          min="0"
                          max={optionAvailability.maxShelves}
                          disabled={!canHaveShelves}
                        />
                      </div>

                      {/* Doors */}
                      <div className={`space-y-3 p-4 border rounded-lg transition ${
                        canHaveDoors 
                          ? 'border-border bg-card/50 hover:bg-card' 
                          : 'border-border/50 bg-muted/30 opacity-60'
                      }`}>
                        <div>
                          <Label className={`text-base font-medium ${
                            !canHaveDoors ? 'text-muted-foreground' : ''
                          }`}>Kastdeuren</Label>
                          <p className="text-xs text-muted-foreground mt-1">Voor een nette, gesloten uitstraling</p>
                          {!canHaveDoors && (
                            <p className="text-xs text-destructive mt-2">Niet beschikbaar voor dit kasttype</p>
                          )}
                        </div>
                        <Input
                          type="number"
                          value={config.numberOfDoors}
                          onChange={(e) => handleConfigChange("numberOfDoors", parseInt(e.target.value) || 0)}
                          min="0"
                          max={optionAvailability.maxDoors}
                          disabled={!canHaveDoors}
                        />
                      </div>

                      {/* Drawers */}
                      <div className={`space-y-3 p-4 border rounded-lg transition ${
                        canHaveDrawers 
                          ? 'border-border bg-card/50 hover:bg-card' 
                          : 'border-border/50 bg-muted/30 opacity-60'
                      }`}>
                        <div>
                          <Label className={`text-base font-medium ${
                            !canHaveDrawers ? 'text-muted-foreground' : ''
                          }`}>Lades voor kleine items</Label>
                          <p className="text-xs text-muted-foreground mt-1">Voor ondergoedkastjes, sieraden en accessoires</p>
                          {!canHaveDrawers && (
                            <p className="text-xs text-destructive mt-2">Niet beschikbaar voor dit kasttype</p>
                          )}
                        </div>
                        <Input
                          type="number"
                          value={config.numberOfDrawers}
                          onChange={(e) => handleConfigChange("numberOfDrawers", parseInt(e.target.value) || 0)}
                          min="0"
                          max={optionAvailability.maxDrawers}
                          disabled={!canHaveDrawers}
                        />
                        {!canHaveDrawers && (
                          <p className="text-sm text-muted-foreground">Lades niet beschikbaar voor dit kasttype</p>
                        )}
                      </div>

                      {canHaveClothingRail && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="clothing-rail"
                            checked={config.hasClothingRail}
                            onCheckedChange={(checked) => handleConfigChange("hasClothingRail", checked)}
                            disabled={!canAddClothingRail}
                          />
                          <Label htmlFor="clothing-rail" className="cursor-pointer">
                            Kledingstang
                          </Label>
                        </div>
                      )}
                      {!canHaveClothingRail && (
                        <p className="text-xs text-muted-foreground italic">Kledingstang niet beschikbaar voor dit kasttype</p>
                      )}
                    </div>

                    <div>
                      <Button onClick={() => setCurrentStep(4)} className="w-full">
                        Volgende <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">Snel en vrijblijvend</p>
                    </div>
                  </Card>
                )}

                {/* Step 4: Material */}
                {currentStep >= 4 && (
                  <Card className="p-6 space-y-6">
                    <div className="space-y-3 pb-4 border-b border-border">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">Kies de uitstraling van jouw project</h2>
                        <p className="text-sm text-muted-foreground mt-2">Selecteer materiaal, hardware en installatieservice. Alle combinaties zijn mogelijk.</p>
                      </div>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-1 bg-accent/10 rounded">🎨 Veel kleuren</span>
                        <span className="px-2 py-1 bg-accent/10 rounded">✓ Duurzaam</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-medium">Materiaal & Kleur</Label>
                      <p className="text-xs text-muted-foreground">Kies de uitstraling die bij jouw interieur past. Wit Melamine is het meest populair en biedt een schoon, modern uiterlijk.</p>
                      <Select value={config.material as string} onValueChange={(v) => handleConfigChange("material", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="white_melamine"><div className="flex items-center gap-2">Wit Melamine <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded">Meest gekozen</span></div></SelectItem>
                        <SelectItem value="oak_decor"><div className="flex items-center gap-2">Eiken Decor <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">Aanbevolen</span></div></SelectItem>
                        <SelectItem value="black_decor">Zwart Decor</SelectItem>
                        <SelectItem value="mdf_white_ral9016">MDF Gelakt Wit (RAL 9016)</SelectItem>
                        <SelectItem value="mdf_grey_ral7035">MDF Gelakt Lichtgrijs (RAL 7035)</SelectItem>
                        <SelectItem value="mdf_grey_ral7038">MDF Gelakt Donkergrijs (RAL 7038)</SelectItem>
                        <SelectItem value="mdf_green_ral6029">MDF Gelakt Groen (RAL 6029)</SelectItem>
                        <SelectItem value="mdf_blue_ral5002">MDF Gelakt Blauw (RAL 5002)</SelectItem>
                        <SelectItem value="mdf_red_ral3020">MDF Gelakt Rood (RAL 3020)</SelectItem>
                        <SelectItem value="mdf_cream_ral1015">MDF Gelakt Crème (RAL 1015)</SelectItem>
                        <SelectItem value="mdf_brown_ral8017">MDF Gelakt Bruin (RAL 8017)</SelectItem>
                      </SelectContent>
                    </Select>
                    </div>

                    {/* Door Hardware */}
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Deurhardware</Label>
                      <p className="text-xs text-muted-foreground">Kies hoe je je deuren wilt bedienen. Push-to-open geeft een schoon, modern uiterlijk zonder zichtbare grepen.</p>
                      {config.numberOfDoors === 0 ? (
                        <div className="p-3 bg-muted/50 border border-border rounded-lg text-sm text-muted-foreground">
                          Voeg eerst deuren toe om deurhardware te selecteren
                        </div>
                      ) : (
                        <Select value={config.doorHardware} onValueChange={(v) => handleConfigChange("doorHardware", v as any)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableDoorHardware.includes('push_to_open') && <SelectItem value="push_to_open"><div className="flex items-center gap-2">Push-to-open (geen grepen) <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded">Aanbevolen</span></div></SelectItem>}
                            {availableDoorHardware.includes('handle') && <SelectItem value="handle">Handgreep</SelectItem>}
                            {availableDoorHardware.includes('knob') && <SelectItem value="knob">Knop</SelectItem>}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* Installation */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Plaatsing</Label>
                      <p className="text-xs text-muted-foreground">Laat onze experts uw kast professioneel plaatsen. Wij raden plaatsing aan voor perfecte afwerking en garantie.</p>
                      
                      {/* Recommended Option - With Installation */}
                      <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        config.includeInstallation 
                          ? 'border-accent bg-accent/5' 
                          : 'border-border bg-card/50 hover:border-accent/50'
                      }`}
                      onClick={() => handleConfigChange("includeInstallation", true)}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox 
                            id="installation-yes"
                            checked={config.includeInstallation}
                            onCheckedChange={(checked) => handleConfigChange("includeInstallation", checked)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Met plaatsing</span>
                              <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">Aanbevolen</span>
                            </div>
                            <p className="text-sm text-foreground/80 mt-1">Aanbevolen – wij zorgen voor perfecte plaatsing en afwerking</p>
                            <p className="text-xs text-muted-foreground mt-1">Plaatsing is optioneel en wordt apart berekend (25% van productprijs, minimum €400)</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* DIY Option */}
                      <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        !config.includeInstallation 
                          ? 'border-accent bg-accent/5' 
                          : 'border-border bg-card/50 hover:border-accent/50'
                      }`}
                      onClick={() => handleConfigChange("includeInstallation", false)}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox 
                            id="installation-no"
                            checked={!config.includeInstallation}
                            onCheckedChange={(checked) => handleConfigChange("includeInstallation", !checked)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <span className="font-medium">Zonder plaatsing</span>
                            <p className="text-sm text-foreground/80 mt-1">Enkel voor ervaren doe-het-zelvers</p>
                            <p className="text-xs text-muted-foreground mt-1">U ontvangt de zaaglijst en montagehandleiding</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Finish */}
                    <TopFinishSelector
                      value={config.topFinish as any}
                      onChange={(value) => handleConfigChange("topFinish", value)}
                      experienceLevel={experienceLevel}
                    />

                    {/* Bottom Finish */}
                    <BottomFinishSelector
                      value={config.bottomFinish as any}
                      onChange={(value) => handleConfigChange("bottomFinish", value)}
                      experienceLevel={experienceLevel}
                    />

                    <div>
                      <Button onClick={() => setCurrentStep(4.5)} className="w-full">
                        Volgende <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">Snel en vrijblijvend</p>
                    </div>
                  </Card>
                )}

                {/* Step 4.5: Review & Verification */}
                {currentStep === 4.5 && (
                  <Card className="p-6 space-y-6">
                    <div className="space-y-2 pb-4 border-b border-border">
                      <h2 className="text-2xl font-bold text-foreground">Controleer je gegevens</h2>
                      <p className="text-sm text-muted-foreground">Verifieer alle details voordat je je aanvraag indient</p>
                    </div>

                    {/* Verification Content */}
                    <div className="space-y-6">
                      {/* Dimensions Section */}
                      <div className="space-y-3 p-4 bg-card border border-border rounded-lg">
                        <h3 className="font-semibold text-foreground">Afmetingen</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Breedte:</span>
                            <span className="font-semibold text-foreground">{config.width} cm</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Hoogte:</span>
                            <span className="font-semibold text-foreground">{config.height} cm</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Diepte:</span>
                            <span className="font-semibold text-foreground">{config.depth} cm</span>
                          </div>
                        </div>
                      </div>

                      {/* Options Section */}
                      <div className="space-y-3 p-4 bg-card border border-border rounded-lg">
                        <h3 className="font-semibold text-foreground">Gekozen opties</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Kasttype:</span>
                            <span className="font-semibold text-foreground">
                              {cabinetType === "wardrobe" && "Kledingkast"}
                              {cabinetType === "tv-furniture" && "TV Meubel"}
                              {cabinetType === "shoe-cabinet" && "Schoenenkast"}
                              {cabinetType === "loft-cabinet" && "Zolderkast"}
                              {cabinetType === "stairs" && "Trap"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Materiaal:</span>
                            <span className="font-semibold text-foreground">
                              {config.material === ("white_melamine" as any) && "Wit Melamine"}
                              {config.material === ("oak_decor" as any) && "Eiken Decor"}
                              {config.material === ("black_decor" as any) && "Zwart Decor"}
                              {config.material === ("mdf_white_ral9016" as any) && "MDF Wit (RAL 9016)"}
                              {config.material === ("mdf_grey_ral7035" as any) && "MDF Lichtgrijs (RAL 7035)"}
                              {config.material === ("mdf_grey_ral7038" as any) && "MDF Donkergrijs (RAL 7038)"}
                              {config.material === ("mdf_green_ral6029" as any) && "MDF Groen (RAL 6029)"}
                              {config.material === ("mdf_blue_ral5002" as any) && "MDF Blauw (RAL 5002)"}
                              {config.material === ("mdf_red_ral3020" as any) && "MDF Rood (RAL 3020)"}
                              {config.material === ("mdf_cream_ral1015" as any) && "MDF Crème (RAL 1015)"}
                              {config.material === ("mdf_brown_ral8017" as any) && "MDF Bruin (RAL 8017)"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Deuren:</span>
                            <span className="font-semibold text-foreground">{config.numberOfDoors}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Planken:</span>
                            <span className="font-semibold text-foreground">{config.numberOfShelves}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Laden:</span>
                            <span className="font-semibold text-foreground">{config.numberOfDrawers}</span>
                          </div>
                          {config.hasClothingRail && (
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Kledingstang:</span>
                              <span className="font-semibold text-foreground">Ja</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Plaatsing:</span>
                            <span className="font-semibold text-foreground">{config.includeInstallation ? "Met plaatsing" : "Zonder plaatsing"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Verification Message */}
                      <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                        <p className="text-sm font-medium text-foreground">✓ Controleer je gegevens goed – wij verifiëren alles voor productie</p>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3">
                      <Button onClick={() => setCurrentStep(4)} variant="outline" className="flex-1">
                        Terug
                      </Button>
                      <Button onClick={() => setCurrentStep(5)} className="flex-1">
                        Bevestigen <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Step 5-8: Summary */}
                {currentStep >= 5 && (
                  <Card className="p-6 space-y-6">
                    <div className="space-y-2 pb-4 border-b border-border">
                      <h2 className="text-2xl font-bold text-foreground">Jouw project in één overzicht</h2>
                      <p className="text-sm text-muted-foreground">Controleer alle details hieronder. Wij nemen contact op om alles te bevestigen.</p>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Specificaties</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                              <span className="text-muted-foreground">Kasttype:</span>
                              <span className="font-semibold text-foreground">
                                {cabinetType === "wardrobe" && "Kledingkast"}
                                {cabinetType === "tv-furniture" && "TV Meubel"}
                                {cabinetType === "shoe-cabinet" && "Schoenenkast"}
                                {cabinetType === "loft-cabinet" && "Zolderkast"}
                                {cabinetType === "stairs" && "Trap"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                              <span className="text-muted-foreground">Afmetingen:</span>
                              <span className="font-semibold text-foreground">{config.width} × {config.height} × {config.depth} cm</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                              <span className="text-muted-foreground">Materiaal:</span>
                              <span className="font-semibold text-foreground">
                                {config.material === ("white_melamine" as any) && "Wit Melamine"}
                                {config.material === ("oak_decor" as any) && "Eiken Decor"}
                                {config.material === ("black_decor" as any) && "Zwart Decor"}
                                {config.material === ("mdf_white_ral9016" as any) && "MDF Wit (RAL 9016)"}
                                {config.material === ("mdf_grey_ral7035" as any) && "MDF Lichtgrijs (RAL 7035)"}
                                {config.material === ("mdf_grey_ral7038" as any) && "MDF Donkergrijs (RAL 7038)"}
                                {config.material === ("mdf_green_ral6029" as any) && "MDF Groen (RAL 6029)"}
                                {config.material === ("mdf_blue_ral5002" as any) && "MDF Blauw (RAL 5002)"}
                                {config.material === ("mdf_red_ral3020" as any) && "MDF Rood (RAL 3020)"}
                                {config.material === ("mdf_cream_ral1015" as any) && "MDF Crème (RAL 1015)"}
                                {config.material === ("mdf_brown_ral8017" as any) && "MDF Bruin (RAL 8017)"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-border">
                          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Details</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                              <span className="text-muted-foreground">Deuren:</span>
                              <span className="font-semibold text-foreground">{config.numberOfDoors}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                              <span className="text-muted-foreground">Planken:</span>
                              <span className="font-semibold text-foreground">{config.numberOfShelves}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                              <span className="text-muted-foreground">Laden:</span>
                              <span className="font-semibold text-foreground">{config.numberOfDrawers}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4 flex flex-col justify-between">

                        {/* Price Section */}
                        {calculationResult?.pricing && (
                          <div className="space-y-3 p-4 bg-gradient-to-br from-accent/10 via-accent/5 to-orange-500/10 rounded-lg border-2 border-accent/30">
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-accent uppercase tracking-wider">Richtprijs</p>
                                <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">Product:</span>
                                  <span className="font-semibold">€{(calculationResult.pricing as any).productPrice?.toFixed(2) || "0.00"}</span>
                                </div>
                                {config.includeInstallation && (calculationResult.pricing as any).installationCost > 0 && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Plaatsing (25%):</span>
                                    <span className="font-semibold">€{(calculationResult.pricing as any).installationCost?.toFixed(2) || "0.00"}</span>
                                  </div>
                                )}
                                <div className="flex justify-between items-center pt-2 border-t border-accent/20">
                                  <span className="font-bold text-foreground">Totaal:</span>
                                  <span className="text-2xl font-bold text-accent">€{(calculationResult.pricing as any).total?.toFixed(2) || "0.00"}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 text-xs text-muted-foreground pt-2 border-t border-accent/20">
                              <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
                              <p>
                                <span className="font-medium text-foreground">Richtprijs – definitieve prijs wordt bevestigd na controle</span>
                                <br />
                                Plaatsing is optioneel en wordt apart berekend
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Quick Actions */}
                        <div className="space-y-2">
                          <Button onClick={handleDownloadCutList} variant="outline" className="w-full gap-2 text-sm">
                            <Download className="w-4 h-4" />
                            Zaaglijst Downloaden
                          </Button>
                          <p className="text-xs text-muted-foreground text-center">Klaar voor uw timmerman</p>
                        </div>
                      </div>
                    </div>

                    {/* Main CTA Section */}
                    <div className="space-y-3 p-4 bg-gradient-to-r from-accent to-orange-500 rounded-lg">
                      <Button onClick={handleOrder} className="w-full gap-2 bg-white text-accent hover:bg-white/90" disabled={validationErrors.length > 0}>
                        <ShoppingCart className="w-4 h-4" />
                        Ontvang mijn prijs & advies
                      </Button>
                      <div className="space-y-1">
                        <p className="text-xs text-white font-medium text-center">✓ Vrijblijvende aanvraag</p>
                        <p className="text-xs text-white/90 text-center">Wij nemen binnen 24u contact met je op om alles te bevestigen</p>
                      </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
                      <span>✓ Veilig en beveiligd</span>
                      <span>•</span>
                      <span>✓ Geen verplichtingen</span>
                      <span>•</span>
                      <span>✓ Gratis advies</span>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>

          {/* 3D Preview */}
          <div className="lg:col-span-2">
            <Card className="p-6 h-full min-h-[600px] flex items-center justify-center">
              {isLoading ? (
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-muted-foreground">Berekening wordt uitgevoerd...</p>
                </div>
              ) : (
                <Cabinet3DSimple config={config} />
              )}
            </Card>
           </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ConfiguratorPreview productType={cabinetType} material={config.material} />
            </div>
          </div>
        </div>
      </div>

      {/* Request Form Modal */}
      <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ontvang uw prijs & advies</DialogTitle>
            <DialogDescription>
              Vul uw gegevens in en wij nemen binnen 24 uur contact met u op.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Reassuring Messages */}
            <div className="space-y-2 p-3 bg-accent/5 rounded-lg border border-accent/20">
              <p className="text-xs font-semibold text-accent uppercase tracking-wider">Waarom invullen?</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  <span>Vrijblijvende aanvraag</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  <span>Geen verplichtingen</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  <span>Gratis advies van ons team</span>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Naam *</Label>
                <Input
                  id="name"
                  placeholder="Uw volledige naam"
                  value={requestFormData.name}
                  onChange={(e) => setRequestFormData({ ...requestFormData, name: e.target.value })}
                  disabled={isSubmittingRequest}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Telefoonnummer *</Label>
                <Input
                  id="phone"
                  placeholder="Bijv. +32 123 45 67 89"
                  type="tel"
                  value={requestFormData.phone}
                  onChange={(e) => setRequestFormData({ ...requestFormData, phone: e.target.value })}
                  disabled={isSubmittingRequest}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">E-mailadres *</Label>
                <Input
                  id="email"
                  placeholder="uw.email@voorbeeld.com"
                  type="email"
                  value={requestFormData.email}
                  onChange={(e) => setRequestFormData({ ...requestFormData, email: e.target.value })}
                  disabled={isSubmittingRequest}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="space-y-3">
            <Button
              onClick={handleSubmitRequest}
              className="w-full bg-accent hover:bg-accent/90"
              disabled={isSubmittingRequest}
            >
              {isSubmittingRequest ? "Verzenden..." : "Verzend mijn aanvraag"}
            </Button>
            <Button
              onClick={() => setShowRequestForm(false)}
              variant="outline"
              className="w-full"
              disabled={isSubmittingRequest}
            >
              Annuleren
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Uw gegevens worden vertrouwelijk behandeld
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
