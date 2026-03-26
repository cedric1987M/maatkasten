import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import {
  Box,
  Home,
  Tv,
  Zap,
  Grid3x3,
  Sofa,
  Lock,
  Plus,
} from "lucide-react";

type ProductType = "cabinet" | "loft_cabinet" | "tv_furniture" | "stairs";

interface ProductOption {
  id: ProductType;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  subTypes: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

const PRODUCTS: ProductOption[] = [
  {
    id: "cabinet",
    name: "Kasten",
    description: "Standaard kasten en inbouwkasten",
    icon: <Box className="w-8 h-8" />,
    color: "from-blue-500 to-blue-600",
    subTypes: [
      { id: "standard", name: "Standaard Kast", description: "Klassieke rechthoekige kast" },
      { id: "wardrobe", name: "Kledingkast", description: "Kledingkast met hangers" },
      { id: "built_in", name: "Inbouwkast", description: "Ingebouwde kast in muur" },
      { id: "tv_furniture", name: "TV Meubel", description: "Meubel voor televisie" },
    ],
  },
  {
    id: "loft_cabinet",
    name: "Zolderkasten",
    description: "Kasten met schuine zijden",
    icon: <Home className="w-8 h-8" />,
    color: "from-amber-500 to-amber-600",
    subTypes: [
      { id: "loft_left", name: "Links Schuin", description: "Schuine zijde aan linkerkant" },
      { id: "loft_right", name: "Rechts Schuin", description: "Schuine zijde aan rechterkant" },
      { id: "loft_double", name: "Dubbel Schuin", description: "Schuine zijden aan beide kanten" },
    ],
  },
  {
    id: "tv_furniture",
    name: "TV Meubels",
    description: "Meubels voor televisie en entertainment",
    icon: <Tv className="w-8 h-8" />,
    color: "from-purple-500 to-purple-600",
    subTypes: [
      { id: "tv_stand", name: "TV Standaard", description: "Staand TV meubel" },
      { id: "wall_mounted", name: "Wandgemonteerd", description: "Aan muur gemonteerd meubel" },
      { id: "entertainment", name: "Entertainment Unit", description: "Groot entertainment meubel" },
    ],
  },
  {
    id: "stairs",
    name: "Trappen",
    description: "Verschillende trap types",
    icon: <Zap className="w-8 h-8" />,
    color: "from-green-500 to-green-600",
    subTypes: [
      { id: "straight", name: "Rechte Trap", description: "Eenvoudige rechte trap" },
      { id: "quarter_turn", name: "Kwartdraai", description: "Trap met 90° bocht" },
      { id: "half_turn", name: "Halfdraai", description: "Trap met 180° bocht" },
      { id: "floating", name: "Zwevende Trap", description: "Moderne zwevende trap" },
      { id: "with_storage", name: "Met Opbergruimte", description: "Trap met ingebouwde lades" },
    ],
  },
];

export default function ProductSelector() {
  const [, navigate] = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  const handleSelectSubType = (productId: ProductType, subTypeId: string) => {
    navigate(`/configurator?product=${productId}&type=${subTypeId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">
              MC
            </div>
            <span className="text-lg font-semibold">Maatkast Planner</span>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
          >
            Terug naar Home
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12 space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-5xl font-bold">Wat wilt u ontwerpen?</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Kies het type meubel dat u wilt configureren. Elk type heeft zijn eigen specifieke opties en instellingen.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="space-y-4">
              {/* Main Product Card */}
              <Card
                className={`card-elegant overflow-hidden cursor-pointer transition hover:shadow-lg border-2 ${
                  selectedProduct === product.id ? "border-accent" : "border-transparent"
                }`}
                onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
              >
                <div className={`bg-gradient-to-r ${product.color} p-6 text-white`}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-lg">{product.icon}</div>
                    <div>
                      <h2 className="text-2xl font-bold">{product.name}</h2>
                      <p className="text-white/80">{product.description}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Sub Types */}
              {selectedProduct === product.id && (
                <div className="space-y-3 pl-2 animate-in fade-in slide-in-from-top-2">
                  {product.subTypes.map((subType) => (
                    <Card
                      key={subType.id}
                      className="card-elegant p-4 hover:shadow-md transition cursor-pointer"
                      onClick={() =>
                        handleSelectSubType(product.id, subType.id)
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{subType.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {subType.description}
                          </p>
                        </div>
                        <Plus className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="card-elegant p-6 space-y-3">
            <div className="flex items-center gap-3">
              <Grid3x3 className="w-6 h-6 text-accent" />
              <h3 className="font-semibold text-lg">Realtime 3D</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Zie uw ontwerp direct in 3D met realistische materialen en kleuren.
            </p>
          </Card>

          <Card className="card-elegant p-6 space-y-3">
            <div className="flex items-center gap-3">
              <Sofa className="w-6 h-6 text-accent" />
              <h3 className="font-semibold text-lg">Drag & Drop</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Sleep onderdelen in uw meubel en plaats ze precies waar u wilt.
            </p>
          </Card>

          <Card className="card-elegant p-6 space-y-3">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-accent" />
              <h3 className="font-semibold text-lg">Professioneel</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Automatische zaaglijsten en offertes voor professionele productie.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
