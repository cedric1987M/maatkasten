import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function QuoteRequest() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectDescription: "",
    budget: "",
    timeline: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // const createQuote = trpc.cabinet.createQuote.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos((prev) => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email) {
      setError("Naam en e-mail zijn verplicht");
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError("Er is een fout opgetreden. Probeer het later opnieuw.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <Card className="p-8 max-w-md text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold">Offerte Aanvraag Verzonden!</h2>
          <p className="text-muted-foreground">
            Dank u voor uw aanvraag. Wij nemen zo snel mogelijk contact met u op.
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            Terug naar Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-lg font-semibold">Offerte Aanvraag</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Annuleren
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Vraag een Offerte aan</h2>
            <p className="text-muted-foreground">
              Vul het formulier in en upload foto's van uw ruimte. Wij zullen een gedetailleerde offerte opstellen.
            </p>
          </div>

          {/* Form */}
          <Card className="p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Persoonlijke Gegevens</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Naam *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Uw naam"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="uw@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefoonnummer</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+31 6 12345678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Bedrijf (optioneel)</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Bedrijfsnaam"
                    />
                  </div>
                </div>
              </div>

              {/* Project Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Project Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Projectbeschrijving</Label>
                  <Textarea
                    id="projectDescription"
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    placeholder="Beschrijf uw project, wensen en specifieke eisen..."
                    rows={5}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (optioneel)</Label>
                    <Input
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="€ 5.000 - € 10.000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">Gewenste Deadline</Label>
                    <Input
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      placeholder="Bijv. Q2 2024"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Foto's van uw ruimte</h3>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center space-y-3">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <div>
                    <Label htmlFor="photos" className="cursor-pointer">
                      <span className="text-accent font-semibold">Klik om foto's te uploaden</span>
                      {" "}of sleep ze hier heen
                    </Label>
                    <Input
                      id="photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG tot 10MB per foto
                  </p>
                </div>

                {photos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">{photos.length} foto('s) geselecteerd:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-600 overflow-hidden">
                            {photo.name}
                          </div>
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-semibold rounded-lg"
                          >
                            Verwijderen
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1"
                  disabled={false}
                >
                  Offerte Aanvraag Verzenden
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/")}
                >
                  Annuleren
                </Button>
              </div>
            </form>
          </Card>

          {/* Info */}
          <Card className="p-6 bg-muted/50 space-y-3">
            <h4 className="font-semibold">Wat gebeurt er volgende?</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>✓ Wij ontvangen uw aanvraag en foto's</li>
              <li>✓ Ons team analyseert uw project</li>
              <li>✓ Wij stellen een gedetailleerde offerte op</li>
              <li>✓ U ontvangt de offerte per e-mail</li>
              <li>✓ Wij bespreken de volgende stappen met u</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
