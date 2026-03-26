import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { ArrowRight, Zap, Palette, ShoppingCart, FileText, Users, CheckCircle, Clock, MapPin } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-accent">MC Maatkast</div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">Welkom, {user?.name}</span>
                <Button variant="ghost" onClick={logout}>Uitloggen</Button>
              </>
            ) : (
              <Button variant="ghost" onClick={() => window.location.href = getLoginUrl()}>Inloggen</Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-accent/10 via-background to-background">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Maatwerk interieur <span className="text-accent">eenvoudig samengesteld</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Van maatkasten tot trappen en meubels op maat. Stel je project samen en ontvang snel een prijsindicatie.
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/product-selector">
                  <button className="px-8 py-6 text-base font-semibold bg-gradient-to-r from-accent to-orange-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center w-full">
                    Start je project <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </Link>
              </div>
              
              {/* Trust Message Below CTA */}
              <div className="space-y-1 pt-3">
                <div className="text-sm font-medium text-accent">✓ Vrijblijvende aanvraag</div>
                <div className="text-sm text-muted-foreground">Wij nemen binnen 24u contact op</div>
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-accent" />
                  <span className="text-foreground font-medium">Realtime 3D visualisatie</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-accent" />
                  <span className="text-foreground font-medium">Automatische zaaglijst generatie</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-accent" />
                  <span className="text-foreground font-medium">Directe prijsberekening</span>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 pt-6 border-t border-border/30">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>Op maat gemaakt in België</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4 text-accent" />
                  <span>Persoonlijke opvolging</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Vrijblijvende aanvraag</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl blur-3xl"></div>
                <div className="relative bg-card rounded-2xl p-8 border border-border shadow-xl">
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Palette className="w-16 h-16 text-accent/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">3D Visualisatie</p>
                      <p className="text-sm text-muted-foreground mt-2">Uw ontwerp verschijnt hier</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-card/50 border-y border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Hoe het werkt</h2>
            <p className="text-lg text-muted-foreground">Drie eenvoudige stappen naar uw perfecte maatkast</p>
            <p className="text-sm text-accent font-medium mt-3">✓ Geen verplichtingen • Geen verstopte kosten • Transparante prijzen</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚙️",
                title: "Configureer",
                description: "Stel de afmetingen, materialen en opties in naar uw wensen"
              },
              {
                icon: "🎨",
                title: "Bekijk in 3D",
                description: "Zie uw ontwerp direct in 3D en roteer het naar wens"
              },
              {
                icon: "✓",
                title: "Bestel",
                description: "Ontvang de zaaglijst en plaats uw bestelling"
              }
            ].map((step, i) => (
              <Card key={i} className="p-8 hover:shadow-lg transition-all duration-300 hover:border-accent/50">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Materialen & Afwerkingen</h2>
            <p className="text-lg text-muted-foreground">Kies uit onze premium materialen</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Wit Melamine",
                description: "Schoon, modern en betaalbaar",
                color: "bg-gradient-to-br from-slate-50 to-slate-100"
              },
              {
                name: "Eiken Decor",
                description: "Warm en klassiek design",
                color: "bg-gradient-to-br from-amber-100 to-amber-200"
              },
              {
                name: "Zwart Decor",
                description: "Elegant en stijlvol",
                color: "bg-gradient-to-br from-slate-800 to-slate-900"
              }
            ].map((material, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className={`h-40 ${material.color}`}></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{material.name}</h3>
                  <p className="text-muted-foreground">{material.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Hoe werkt het?</h2>
            <p className="text-lg text-muted-foreground">Drie eenvoudige fasen van idee tot voltooiing</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "1",
                title: "Jij stelt samen",
                description: "Ontwerp uw maatkast in onze configurator. Kies afmetingen, materialen en opties naar wens."
              },
              {
                number: "2",
                title: "Wij controleren alles",
                description: "Ons team controleert uw ontwerp en geeft advies. U ontvangt een gedetailleerde offerte."
              },
              {
                number: "3",
                title: "Productie en levering",
                description: "Wij produceren uw maatkast en leveren het ter plaatse. Professionele montage optioneel."
              }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="flex flex-col items-center text-center">
                  {/* Step Number Circle */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-orange-500 text-white flex items-center justify-center text-2xl font-bold mb-4">
                    {step.number}
                  </div>
                  
                  {/* Step Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                
                {/* Connector Line (hidden on last item) */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-border"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Realisaties/Portfolio Section */}
      <section className="py-20 bg-gradient-to-b from-background to-card/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Realisaties</h2>
            <p className="text-lg text-muted-foreground">Bekijk enkele van onze voltooide projecten</p>
            <p className="text-sm text-accent font-medium mt-3">✓ Meer dan 500 tevreden klanten • Kwaliteit gegarandeerd</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Moderne Kledingkast",
                description: "Wit melamine met push-to-open deuren",
                category: "Kledingkast",
                image: "🏠"
              },
              {
                title: "TV Meubel Eiken",
                description: "Eiken decor met veel opbergruimte",
                category: "TV Meubel",
                image: "📺"
              },
              {
                title: "Schoenenkast Zwart",
                description: "Zwart decor met schuifdeur",
                category: "Schoenenkast",
                image: "👟"
              },
              {
                title: "Zolderkast Wit",
                description: "Aangepast aan hellend dak",
                category: "Zolderkast",
                image: "🏠"
              },
              {
                title: "Trap met Opberging",
                description: "Zwevende trap met kasten",
                category: "Trap",
                image: "🪜"
              },
              {
                title: "Inbouwkast MDF",
                description: "RAL 7035 grijs met spiegeldeuren",
                category: "Inbouwkast",
                image: "✨"
              }
            ].map((project, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-lg border border-border bg-card hover:border-accent transition-all duration-300 hover:shadow-lg"
              >
                {/* Image Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {project.image}
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-all duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                      {project.category}
                    </span>
                    <span className="text-lg">→</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Gallery CTA */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Wilt u meer voorbeelden zien?</p>
            <Link href="/gallery">
              <button className="px-8 py-3 text-base font-semibold bg-gradient-to-r from-accent to-orange-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 inline-flex items-center gap-2">
                Bekijk alle projecten <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <div className="mt-2 text-xs text-muted-foreground">✓ Inspiratie zonder verplichtingen</div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-r from-accent/5 to-orange-500/5 border-y border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Waarom klanten voor ons kiezen</h2>
            <p className="text-lg text-muted-foreground">Wat ons onderscheidt van de rest</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "✂️",
                title: "Volledig op maat gemaakt",
                description: "Elk project is uniek. Wij ontwerpen en produceren volledig naar uw wensen en ruimte."
              },
              {
                icon: "👥",
                title: "Persoonlijke opvolging van begin tot einde",
                description: "U krijgt een dedicated contactperson die u begeleidt door het hele proces."
              },
              {
                icon: "✓",
                title: "Wij controleren alles voor productie",
                description: "Kwaliteitscontrole en advies van onze experts voordat productie begint."
              }
            ].map((item, i) => (
              <Card key={i} className="p-8 hover:shadow-lg transition-all duration-300 hover:border-accent/50 bg-background">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-20 bg-card/50 border-t border-border">        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: ShoppingCart, label: "Start ontwerpen", href: "/product-selector" },
              { icon: FileText, label: "Sjablonen", href: "/templates" },
              { icon: Users, label: "Admin Dashboard", href: "/admin" },
              { icon: Palette, label: "Offerte Aanvragen", href: "/quote-request" }
            ].map((item, i) => (
              <Link key={i} href={item.href}>
                <button className="group p-6 rounded-lg border border-border bg-card hover:border-accent hover:shadow-lg transition-all duration-300 w-full text-left">
                  <item.icon className="w-8 h-8 text-accent mb-3 group-hover:scale-110 transition-transform" />
                  <p className="font-semibold text-foreground group-hover:text-accent transition-colors">{item.label}</p>
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Klaar om te beginnen?</h2>
          <p className="text-lg text-muted-foreground mb-8">Ontwerp nu uw maatkast en ontvang direct een prijsopgave</p>
              <Link href="/product-selector">
                <button className="px-10 py-6 text-lg font-semibold bg-gradient-to-r from-accent to-orange-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 inline-flex items-center">
                  Start nu <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span>Prijs en advies binnen 24u</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Geen verplichtingen • Geen kosten</span>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition">Configurator</a></li>
                <li><a href="#" className="hover:text-accent transition">Prijzen</a></li>
                <li><a href="#" className="hover:text-accent transition">Materialen</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Bedrijf</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition">Over ons</a></li>
                <li><a href="#" className="hover:text-accent transition">Contact</a></li>
                <li><a href="#" className="hover:text-accent transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Juridisch</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition">Privacybeleid</a></li>
                <li><a href="#" className="hover:text-accent transition">Gebruiksvoorwaarden</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground">Email: info@mcmaatkast.nl</p>
              <p className="text-sm text-muted-foreground">Tel: +31 (0)6 12345678</p>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 MC Maatkast. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
