import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ProductSelector from "./pages/ProductSelector";
import Configurator from "./pages/Configurator";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import Templates from "./pages/Templates";
import QuoteRequest from "./pages/QuoteRequest";
import SavedConfigurations from "./pages/SavedConfigurations";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/product-selector"} component={ProductSelector} />
      <Route path={"/templates"} component={Templates} />
      <Route path={"/configurator"} component={Configurator} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/quote-request"} component={QuoteRequest} />
      <Route path={"/saved-configurations"} component={SavedConfigurations} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/404"} component={NotFound} />
      <Route path={"/"} component={Home} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
