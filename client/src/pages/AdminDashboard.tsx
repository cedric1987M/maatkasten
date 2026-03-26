import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Search, Download, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react";

type OrderStatus = "pending" | "confirmed" | "in_production" | "completed" | "cancelled";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orders, isLoading } = trpc.cabinet.getAllOrders.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const updateStatusMutation = trpc.cabinet.updateOrderStatus.useMutation({
    onSuccess: () => {
      toast.success("Orderstatus bijgewerkt");
    },
    onError: () => {
      toast.error("Fout bij het bijwerken van orderstatus");
    },
  });

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="card-elegant p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Toegang Geweigerd</h1>
          <p className="text-muted-foreground">
            U hebt geen toestemming om het admin dashboard te openen.
          </p>
        </Card>
      </div>
    );
  }

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toString().includes(searchTerm);

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in_production":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_production":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "In afwachting",
      confirmed: "Bevestigd",
      in_production: "In productie",
      completed: "Voltooid",
      cancelled: "Geannuleerd",
    };
    return labels[status] || status;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Bestellingenbeheer</h1>
          <p className="text-lg text-muted-foreground">
            Beheer alle klantbestellingen en hun status
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: "Totaal bestellingen", value: orders?.length || 0, color: "text-blue-600" },
            {
              label: "In afwachting",
              value: orders?.filter((o) => o.status === "pending").length || 0,
              color: "text-yellow-600",
            },
            {
              label: "In productie",
              value: orders?.filter((o) => o.status === "in_production").length || 0,
              color: "text-purple-600",
            },
            {
              label: "Voltooid",
              value: orders?.filter((o) => o.status === "completed").length || 0,
              color: "text-green-600",
            },
          ].map((stat) => (
            <Card key={stat.label} className="card-elegant">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Zoeken op naam, email of ordernummer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-elegant pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle statussen</SelectItem>
              <SelectItem value="pending">In afwachting</SelectItem>
              <SelectItem value="confirmed">Bevestigd</SelectItem>
              <SelectItem value="in_production">In productie</SelectItem>
              <SelectItem value="completed">Voltooid</SelectItem>
              <SelectItem value="cancelled">Geannuleerd</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <Card className="card-elegant overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Bestellingen worden geladen...
            </div>
          ) : filteredOrders && filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Ordernummer</th>
                    <th className="text-left py-3 px-4 font-semibold">Klant</th>
                    <th className="text-left py-3 px-4 font-semibold">E-mail</th>
                    <th className="text-left py-3 px-4 font-semibold">Bedrag</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Datum</th>
                    <th className="text-left py-3 px-4 font-semibold">Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition">
                      <td className="py-3 px-4 font-semibold">#{order.id}</td>
                      <td className="py-3 px-4">{order.customerName}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{order.customerEmail}</td>
                      <td className="py-3 px-4 font-semibold">
                        € {parseFloat(order.totalPrice || "0").toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${getStatusColor(order.status)} flex items-center gap-2 w-fit`}>
                          {getStatusIcon(order.status)}
                          {getStatusLabel(order.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("nl-NL")}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrder(order)}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Details
                          </Button>
                          {order.status !== "completed" && order.status !== "cancelled" && (
                            <Select
                              value={order.status}
                              onValueChange={(newStatus) => {
                                updateStatusMutation.mutate({
                                  orderId: order.id,
                                  status: newStatus as OrderStatus,
                                });
                              }}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">In afwachting</SelectItem>
                                <SelectItem value="confirmed">Bevestigd</SelectItem>
                                <SelectItem value="in_production">In productie</SelectItem>
                                <SelectItem value="completed">Voltooid</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              Geen bestellingen gevonden
            </div>
          )}
        </Card>

        {/* Order Details Modal */}
        {selectedOrder && (
          <Card className="card-elegant space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Besteldetails #{selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Klantgegevens</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Naam:</span>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">E-mail:</span>
                    <p className="font-medium">{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Telefoon:</span>
                    <p className="font-medium">{selectedOrder.customerPhone || "Niet opgegeven"}</p>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Bestelgegevens</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className="font-medium">{getStatusLabel(selectedOrder.status)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bedrag:</span>
                    <p className="font-medium">€ {parseFloat(selectedOrder.totalPrice || "0").toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Datum:</span>
                    <p className="font-medium">
                      {new Date(selectedOrder.createdAt).toLocaleDateString("nl-NL")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration */}
            {selectedOrder.configSnapshot && (
              <div className="space-y-4 border-t border-border pt-6">
                <h3 className="font-semibold text-lg">Configuratie</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {(() => {
                    try {
                      const config = JSON.parse(selectedOrder.configSnapshot);
                      return (
                        <>
                          <div>
                            <span className="text-muted-foreground">Breedte:</span>
                            <p className="font-medium">{config.width} cm</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Hoogte:</span>
                            <p className="font-medium">{config.height} cm</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Diepte:</span>
                            <p className="font-medium">{config.depth} cm</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Materiaal:</span>
                            <p className="font-medium">{config.material}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Vakken:</span>
                            <p className="font-medium">{config.numberOfCompartments}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Legplanken:</span>
                            <p className="font-medium">{config.numberOfShelves}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Deuren:</span>
                            <p className="font-medium">{config.numberOfDoors}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Lades:</span>
                            <p className="font-medium">{config.numberOfDrawers}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Materiaal:</span>
                            <p className="font-medium">{config.material}</p>
                          </div>
                        </>
                      );
                    } catch {
                      return <p className="text-muted-foreground">Configuratie niet beschikbaar</p>;
                    }
                  })()}
                </div>
              </div>
            )}

            {/* Material Optimization Info */}
            {selectedOrder.configSnapshot && (
              <div className="space-y-4 border-t border-border pt-6">
                <h3 className="font-semibold text-lg">Materiaaloptimalisatie</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="card-elegant p-4">
                    <p className="text-sm text-muted-foreground">Benodigde platen</p>
                    <p className="text-2xl font-bold text-accent">2-3</p>
                  </Card>
                  <Card className="card-elegant p-4">
                    <p className="text-sm text-muted-foreground">Geschat afval</p>
                    <p className="text-2xl font-bold text-yellow-600">~15%</p>
                  </Card>
                  <Card className="card-elegant p-4">
                    <p className="text-sm text-muted-foreground">Totaal oppervlakte</p>
                    <p className="text-2xl font-bold text-blue-600">~2.5 m²</p>
                  </Card>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6 border-t border-border">
              <Button className="button-primary gap-2">
                <Download className="w-4 h-4" />
                Zaaglijst downloaden
              </Button>
              <Button variant="outline">
                Offerte e-mailen
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
