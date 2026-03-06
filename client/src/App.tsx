import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Login from "@/pages/login";
import Register from "@/pages/register";
import Recovery from "@/pages/recovery";
import Home from "@/pages/home";
import Cart from "@/pages/cart";
import Orders from "@/pages/orders";
import Wallet from "@/pages/wallet";
import Profile from "@/pages/profile";
import BottomNav from "@/components/layout/bottom-nav";

function Router() {
  const [location] = useLocation();
  const isAuthRoute = ['/', '/login', '/register', '/recovery'].includes(location);

  return (
    <div className="mobile-container">
      <div className={`flex-1 overflow-y-auto hide-scrollbar ${!isAuthRoute ? 'pb-20' : ''}`}>
        <Switch>
          <Route path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/recovery" component={Recovery} />
          
          <Route path="/home" component={Home} />
          <Route path="/pedidos" component={Orders} />
          <Route path="/carrinho" component={Cart} />
          <Route path="/carteira" component={Wallet} />
          <Route path="/perfil" component={Profile} />
          
          <Route component={NotFound} />
        </Switch>
      </div>
      
      {!isAuthRoute && <BottomNav />}
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
