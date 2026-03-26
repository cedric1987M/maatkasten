import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Trash2, Edit, Share2, Copy } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface SavedConfig {
  id: string;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  price: number;
  thumbnail?: string;
}

export default function SavedConfigurations() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [configs, setConfigs] = useState<SavedConfig[]>([
    {
      id: "1",
      name: "Slaapkamer Kast",
      description: "Moderne kledingkast voor slaapkamer",
      type: "cabinet",
      createdAt: "2024-03-10",
      price: 2500,
    },
    {
      id: "2",
      name: "Woonkamer TV Meubel",
      description: "Groot TV meubel met veel opbergruimte",
      type: "tv_furniture",
      createdAt: "2024-03-08",
      price: 1800,
    },
    {
      id: "3",
      name: "Zolderkast",
      description: "Zolderkast met dubbel schuine zijden",
      type: "loft_cabinet",
      createdAt: "2024-03-05",
      price: 3200,
    },
  ]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center space-y-4">
          <h2 className="text-2xl font-bold">Inloggen Vereist</h2>
          <p className="text-muted-foreground">
            U moet ingelogd zijn om uw opgeslagen configuraties te bekijken.
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            Terug naar Home
          </Button>
        </Card>
      </div>
    );
  }

  const deleteConfig = (id: string) => {
    setConfigs((prev) => prev.filter((c) => c.id !== id));
  };

  const duplicateConfig = (id: string) => {
    const config = configs.find((c) => c.id === id);
    if (!config) return;
    const newConfig = {
      ...config,
      id: `${Date.now()}`,
      name: `${config.name} (kopie)`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setConfigs((prev) => [newConfig, ...prev]);
  };

  const shareConfig = (id: string) => {
    const config = configs.find((c) => c.id === id);
    if (!config) return;
    const shareUrl = `${window.location.origin}/configurator?load=${id}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Deellink gekopieerd naar klembord!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-lg font-semibold">Mijn Configuraties</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            Terug
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Uw Opgeslagen Ontwerpen</h2>
            <p className="text-muted-foreground">
              {user?.name}, hier zijn al uw opgeslagen configuraties. U kunt deze bewerken, dupliceren of delen.
            </p>
          </div>

          {/* Configurations Grid */}
          {configs.length === 0 ? (
            <Card className="p-12 text-center space-y-4">
              <p className="text-muted-foreground text-lg">
                U hebt nog geen configuraties opgeslagen.
              </p>
              <Button onClick={() => navigate("/select-product")}>
                Start een Nieuw Ontwerp
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {configs.map((config) => (
                <Card key={config.id} className="card-elegant overflow-hidden hover:shadow-lg transition">
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500">
                    {config.thumbnail ? (
                      <img src={config.thumbnail} alt={config.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl mb-2">📦</div>
                        <p className="text-sm">{config.type}</p>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{config.name}</h3>
                      <p className="text-sm text-muted-foreground">{config.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Gemaakt op</p>
                        <p className="text-sm font-semibold">{config.createdAt}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Geschatte prijs</p>
                        <p className="text-lg font-bold text-accent">€{config.price.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => navigate(`/configurator?load=${config.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                        Bewerk
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => duplicateConfig(config.id)}
                        title="Dupliceren"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => shareConfig(config.id)}
                        title="Delen"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteConfig(config.id)}
                        title="Verwijderen"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* New Configuration Button */}
          <div className="text-center pt-8">
            <Button
              size="lg"
              onClick={() => navigate("/select-product")}
              className="gap-2"
            >
              + Nieuw Ontwerp Starten
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
