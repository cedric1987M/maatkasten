import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Grid3x3, Sofa, UtensilsCrossed, BookOpen, Plus } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  bedroom: <Grid3x3 className="w-5 h-5" />,
  kitchen: <UtensilsCrossed className="w-5 h-5" />,
  office: <BookOpen className="w-5 h-5" />,
  living_room: <Sofa className="w-5 h-5" />,
  custom: <Plus className="w-5 h-5" />,
};

export default function Templates() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: templates } = trpc.cabinet.getTemplates.useQuery();
  const { data: categories } = trpc.cabinet.getTemplateCategories.useQuery();

  const filteredTemplates = selectedCategory
    ? templates?.filter((t) => t.category === selectedCategory)
    : templates;

  const handleSelectTemplate = (templateId: string) => {
    navigate(`/configurator?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-elegant py-12 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Kastsjablonen</h1>
          <p className="text-lg text-muted-foreground">
            Kies uit vooraf ingestelde kastontwerpen of maak uw eigen configuratie
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Categorieën</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="gap-2"
            >
              Alle
            </Button>
            {categories?.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                className="gap-2"
              >
                {categoryIcons[cat.id]}
                <span className="hidden sm:inline">{cat.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates?.map((template) => (
            <Card key={template.id} className="card-elegant overflow-hidden hover:shadow-lg transition">
              <div className="p-6 space-y-4">
                {/* Category Badge */}
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="gap-2">
                    {categoryIcons[template.category]}
                    {template.category === "bedroom"
                      ? "Slaapkamer"
                      : template.category === "kitchen"
                        ? "Keuken"
                        : template.category === "office"
                          ? "Kantoor"
                          : template.category === "living_room"
                            ? "Woonkamer"
                            : "Aangepast"}
                  </Badge>
                </div>

                {/* Title and Description */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-muted-foreground text-xs">Breedte</p>
                    <p className="font-semibold">{template.config.width} cm</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-muted-foreground text-xs">Hoogte</p>
                    <p className="font-semibold">{template.config.height} cm</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-muted-foreground text-xs">Diepte</p>
                    <p className="font-semibold">{template.config.depth} cm</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-muted-foreground text-xs">Deuren</p>
                    <p className="font-semibold">{template.config.numberOfDoors}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {template.config.numberOfShelves > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {template.config.numberOfShelves} planken
                    </Badge>
                  )}
                  {template.config.numberOfDrawers > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {template.config.numberOfDrawers} lades
                    </Badge>
                  )}
                  {template.config.hasClothingRail && (
                    <Badge variant="outline" className="text-xs">
                      Kledingstang
                    </Badge>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleSelectTemplate(template.id)}
                  className="w-full button-primary mt-4"
                >
                  Gebruiken
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Custom Cabinet CTA */}
        <Card className="card-elegant p-8 bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Uw eigen ontwerp</h3>
            <p className="text-muted-foreground">
              Geen van deze sjablonen past perfect? Maak uw eigen aangepaste kastconfiguratie met volledige controle
              over alle dimensies en opties.
            </p>
            <Button
              onClick={() => navigate("/configurator")}
              className="button-primary gap-2"
            >
              <Plus className="w-4 h-4" />
              Aangepaste kast maken
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
