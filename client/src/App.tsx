import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Bot } from "lucide-react";

// Client Pages
import Login from "@/pages/login";
import Register from "@/pages/register";
import Recovery from "@/pages/recovery";
import Home from "@/pages/home";
import Cart from "@/pages/cart";
import Orders from "@/pages/orders";
import Wallet from "@/pages/wallet";
import Profile from "@/pages/profile";
import Chat from "@/pages/chat";

// Operational Pages
import OpLogin from "@/pages/operacional/login";
import DriverDashboard from "@/pages/operacional/driver-dashboard";
import PartnerDashboard from "@/pages/operacional/partner-dashboard";

import BottomNav from "@/components/layout/bottom-nav";

function Router() {
  const [location, setLocation] = useLocation();
  
  const isAuthRoute = location === '/' || location.startsWith('/login') || location.startsWith('/register') || location.startsWith('/recovery');
  const isChatRoute = location === '/chat';
  
  // Operational routes check
  const isOpRoute = location.startsWith('/operacional');

  // Do not show bottom nav or bot button on auth, chat, or operational routes
  const hideClientNav = isAuthRoute || isChatRoute || isOpRoute;

  return (
    <div className="mobile-container">
      <div className={`flex-1 overflow-y-auto hide-scrollbar ${!hideClientNav ? 'pb-20' : ''}`}>
        <Switch>
          {/* Client Routes */}
          <Route path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/recovery" component={Recovery} />
          <Route path="/home" component={Home} />
          <Route path="/pedidos" component={Orders} />
          <Route path="/carrinho" component={Cart} />
          <Route path="/carteira" component={Wallet} />
          <Route path="/perfil" component={Profile} />
          <Route path="/chat" component={Chat} />
          
          {/* Operational Routes */}
          <Route path="/operacional" component={OpLogin} />
          <Route path="/operacional/motorista" component={DriverDashboard} />
          <Route path="/operacional/parceiro" component={PartnerDashboard} />
          
          <Route component={NotFound} />
        </Switch>
      </div>
      
      {!hideClientNav && (
        <button 
          onClick={() => setLocation('/chat')}
          className="absolute bottom-[90px] right-5 w-14 h-14 bg-primary text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,204,0,0.3)] z-40 hover:scale-105 transition-transform"
        >
          <Bot className="w-7 h-7" />
        </button>
      )}
      
      {!hideClientNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;