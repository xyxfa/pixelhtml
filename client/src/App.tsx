import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import TechNotes from "./pages/TechNotes";
import Ideas from "./pages/Ideas";
import { MotionProvider } from "./contexts/MotionContext";
import PixelCompanions from "./components/PixelCompanions";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/notes/:slug"} component={TechNotes} />
      <Route path={"/notes"} component={TechNotes} />
      <Route path={"/ideas"} component={Ideas} />
      <Route path={"/ideas/:slug"} component={Ideas} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <MotionProvider>
            <Toaster />
            <Router />
            <PixelCompanions />
            <Analytics />
          </MotionProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
