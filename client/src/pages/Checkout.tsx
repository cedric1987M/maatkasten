import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function Checkout() {
  const [, navigate] = useLocation();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    notes: "",
  });

  const createOrderMutation = trpc.cabinet.createOrder.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Vul alstublieft alle verplichte velden in");
      return;
    }

    try {
      // In a real app, you would get the configuration from state/context
      const result = await createOrderMutation.mutateAsync({
        configurationId: 0,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        configData: {
          width: 120,
          height: 200,
          depth: 60,
          numberOfCompartments: 2,
          numberOfShelves: 3,
          numberOfDoors: 2,
          numberOfDrawers: 0,
          hasClothingRail: false,
          material: "white_melamine",
        },
      });

      setOrderId(`ORDER-${Date.now()}`);
      setOrderPlaced(true);
      toast.success("Bestelling succesvol geplaatst!");
    } catch (error) {
      console.error(error);
      toast.error("Er is een fout opgetreden bij het plaatsen van de bestelling");
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            <div className="card-elegant space-y-6 text-center">
              <div className="flex justify-center">
                <div className="rounded-full bg-accent/10 p-4">
                  <CheckCircle className="w-16 h-16 text-accent" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Bestelling Geplaatst!</h1>
                <p className="text-lg text-muted-foreground">
                  Bedankt voor uw bestelling. We zullen u spoedig contacteren.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bestelreferentie:</span>
                  <span className="font-semibold">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Klantgegevens:</span>
                  <span className="font-semibold">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">E-mail:</span>
                  <span className="font-semibold">{formData.email}</span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <p className="text-sm text-muted-foreground">
                  Een bevestigingsmail is verzonden naar <strong>{formData.email}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  U kunt uw bestelling volgen via uw account of door contact op te nemen met onze klantenservice.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button className="button-primary" onClick={() => navigate("/")}>
                  Terug naar startpagina
                </Button>
                <Button variant="outline" onClick={() => navigate("/configurator")}>
                  Nieuw ontwerp maken
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/configurator")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Terug
          </button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <Card className="card-elegant space-y-6">
              <h2 className="text-2xl font-semibold">Klantgegevens</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Persoonlijke gegevens</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Voornaam *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="input-elegant"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Achternaam *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="input-elegant"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mailadres *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-elegant"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefoonnummer *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="input-elegant"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Bedrijf (optioneel)</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="input-elegant"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Adresgegevens</h3>

                  <div className="space-y-2">
                    <Label htmlFor="address">Adres *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="input-elegant"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postcode *</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        className="input-elegant"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Plaats *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="input-elegant"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Land *</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="input-elegant"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Opmerkingen</h3>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Speciale wensen of opmerkingen (optioneel)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Bijvoorbeeld: speciale afwerkingen, leveringsdata, etc."
                      className="input-elegant min-h-24"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/configurator")}
                    className="flex-1"
                  >
                    Annuleren
                  </Button>
                  <Button
                    type="submit"
                    className="button-primary flex-1"
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? "Bezig met verwerken..." : "Bestelling plaatsen"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="card-elegant sticky top-6 space-y-6">
              <h2 className="text-xl font-semibold">Bestelsamenvattting</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Afmetingen</span>
                  <span>120 × 200 × 60 cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Materiaal</span>
                  <span>Wit Melamine</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vakken</span>
                  <span>2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Legplanken</span>
                  <span>3 per vak</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deuren</span>
                  <span>2</span>
                </div>

                <div className="border-t border-border pt-3 flex justify-between font-semibold">
                  <span>Totaal</span>
                  <span className="text-accent">€ 1.250,00</span>
                </div>
              </div>

              <div className="bg-accent/10 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold text-foreground">Volgende stappen:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Bevestigingsmail ontvangen</li>
                  <li>✓ Offerte wordt opgesteld</li>
                  <li>✓ Zaaglijst wordt gegenereerd</li>
                  <li>✓ Productie start</li>
                </ul>
              </div>

              <p className="text-xs text-muted-foreground">
                Door te klikken op "Bestelling plaatsen" accepteert u onze algemene voorwaarden.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
