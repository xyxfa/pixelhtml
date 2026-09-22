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
import { lazy, Suspense } from "react";

const CompanionPreview = import.meta.env.DEV ? lazy(() => import("./pages/CompanionPreview")) : null;

function Router() {
  return (
    <Switch>
      {CompanionPreview && <Route path="/companion-preview"><Suspense fallback={null}><CompanionPreview /></Suspense></Route>}
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
          </MotionProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
