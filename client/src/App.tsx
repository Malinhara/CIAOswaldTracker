import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "./pages/HomePage";
import PredictionPage from "./pages/PredictionPage";
import PredictionMarketsPage from "./pages/PredictionMarketsPage";
import CreateMarketPage from "./pages/CreateMarketPage";

console.log('📱 Rendering App.tsx');

function App() {
  return (
    <div className="min-h-screen">
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/markets" component={PredictionMarketsPage} />
        <Route path="/predict/:id" component={PredictionPage} />
        <Route path="/markets/create" component={CreateMarketPage} />
      </Switch>
      <Toaster />
    </div>
  );
}

export default App;