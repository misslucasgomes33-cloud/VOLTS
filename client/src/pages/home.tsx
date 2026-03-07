import { useState, useEffect } from "react";
import { Search, MapPin, Zap, Star, ChevronRight, Bot, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

import burgerImg from '@/assets/burger.png';
import pizzaImg from '@/assets/pizza.png';
import acaiImg from '@/assets/acai.png';
import bannerImg from '@/assets/banner.png';
import meatImg from '@/assets/meat.png';
import drinksImg from '@/assets/drinks.png';
import pharmacyImg from '@/assets/pharmacy.png';

const categories = [
  { id: 1, name: "Restaurantes", icon: "🍔", image: burgerImg },
  { id: 2, name: "Mercado", icon: "🛒", image: meatImg },
  { id: 3, name: "Açaí", icon: "🍧", image: acaiImg },
  { id: 4, name: "Açougue", icon: "🥩", image: meatImg },
  { id: 5, name: "Bebidas", icon: "🍻", image: drinksImg },
  { id: 6, name: "Farmácia", icon: "💊", image: pharmacyImg },
];

const categoryImages: Record<string, string> = {
  "Lanches": burgerImg,
  "Pizza": pizzaImg,
  "Açaí": acaiImg,
  "Restaurante": burgerImg,
  "Bebidas": drinksImg,
  "Mercado": meatImg,
};

const banners = [
  { id: 1, image: bannerImg, title: "Ofertas Relâmpago", subtitle: "Até 50% OFF" }
];

interface Restaurant {
  id: number;
  name: string;
  category: string | null;
  city: string | null;
  rating: string | null;
  deliveryTime: string | null;
  deliveryFee: string | null;
  isOpen: boolean | null;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/restaurants")
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(() => {});
  }, []);

  const filteredRestaurants = restaurants.filter(r =>
    !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (r.category && r.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getRestaurantImage = (r: Restaurant) => {
    if (r.category && categoryImages[r.category]) return categoryImages[r.category];
    return burgerImg;
  };

  return (
    <div className="flex flex-col min-h-full pb-24">
      <div className="bg-zinc-950 px-5 pt-8 pb-4 sticky top-0 z-40 border-b border-white/5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="w-4 h-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Entregar em</span>
              <div className="flex items-center gap-1 font-medium text-sm">
                {user?.city || "Cuiabá"}, Centro <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-primary/20 cursor-pointer hover:bg-zinc-800 transition-colors">
            <Zap className="w-3.5 h-3.5 text-primary" fill="currentColor" />
            <span className="text-xs font-bold text-primary">Seja VIP</span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            data-testid="input-search"
            placeholder="Comida, mercado, farmácia..." 
            className="pl-12 h-12 bg-zinc-900 border-white/5 rounded-2xl text-white focus-visible:ring-primary/30 shadow-inner text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="px-5 mt-4">
        <div onClick={() => setLocation('/chat')} className="cursor-pointer bg-gradient-to-r from-zinc-900 to-zinc-800 border border-primary/20 rounded-2xl p-4 flex gap-4 items-start relative overflow-hidden group hover:border-primary/40 transition-all mb-4">
          <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 blur-2xl rounded-full" />
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0 border border-primary/30">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Assistente VOLTS</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            </div>
            <p className="text-sm text-zinc-300 leading-snug font-medium">
              A demanda está alta, mas nossos entregadores são rápidos! <strong className="text-white">Toque aqui</strong> para cupons relâmpago.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> Desafio da Semana
            </h4>
            <span className="text-xs font-bold text-primary">R$ 15 Cashback</span>
          </div>
          <div className="space-y-2 relative z-10">
            <p className="text-xs text-zinc-400">
              Faça 3 pedidos acima de R$ 40 em Restaurantes diferentes e ganhe R$ 15 na carteira!
            </p>
            <div className="flex justify-between text-[10px] text-zinc-500 font-bold mb-1">
              <span>Progresso</span>
              <span className="text-primary">1 / 3 pedidos</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '33%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-6">
        <div className="relative h-36 rounded-2xl overflow-hidden border border-white/10 group cursor-pointer">
          <img src={bannerImg} alt="Banner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center p-5">
            <h2 className="text-white font-display font-black text-2xl uppercase italic tracking-wider">Entrega<br/><span className="text-primary">Na Velocidade da Luz</span></h2>
          </div>
        </div>
      </div>

      <div className="px-5 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Categorias</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => setSearchQuery(cat.name)}>
              <div className="w-full aspect-square rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden relative shadow-sm group-hover:border-primary/50 transition-colors">
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center text-3xl z-10 drop-shadow-md">
                  {cat.icon}
                </div>
              </div>
              <span className="text-[11px] font-medium text-center text-zinc-300 group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 mt-10 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Lojas em Destaque <Zap className="w-4 h-4 text-primary" fill="currentColor" />
          </h2>
          <span className="text-xs text-primary font-medium hover:underline cursor-pointer">Ver todos</span>
        </div>

        <div className="flex flex-col gap-4">
          {filteredRestaurants.length > 0 ? filteredRestaurants.map((item) => (
            <Card key={item.id} data-testid={`card-restaurant-${item.id}`} className="bg-zinc-900/50 border-white/5 overflow-hidden group hover:bg-zinc-900 hover:border-primary/30 transition-all cursor-pointer">
              <CardContent className="p-0">
                <div className="w-full h-36 relative overflow-hidden">
                  <img src={getRestaurantImage(item)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  <div className="absolute top-3 right-3 bg-zinc-900/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
                    <Clock className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-bold text-white">{item.deliveryTime || "20-35 min"}</span>
                  </div>
                  {!item.isOpen && (
                    <div className="absolute top-3 left-3 bg-red-500/90 px-2 py-1 rounded-lg">
                      <span className="text-[10px] font-bold text-white">Fechado</span>
                    </div>
                  )}
                </div>
                <div className="p-4 -mt-6 relative z-10">
                  <div className="flex justify-between items-end mb-2">
                    <h3 className="font-display font-bold text-white text-lg tracking-tight">{item.name}</h3>
                    <div className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded-lg border border-primary/20 shadow-[0_0_10px_rgba(255,204,0,0.1)]">
                      <Star className="w-3.5 h-3.5 text-primary" fill="currentColor" />
                      <span className="text-xs font-bold text-primary">{item.rating || "4.5"}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-md">{item.category || "Restaurante"}</span>
                    <span className="text-xs text-zinc-500">•</span>
                    <span className="text-xs text-zinc-400">{item.city}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {item.city}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${item.deliveryFee === "0" || item.deliveryFee === "Grátis" ? "bg-primary/10 text-primary border border-primary/20" : "bg-zinc-800 text-zinc-300"}`}>
                      {item.deliveryFee === "0" || item.deliveryFee === "Grátis" ? "Entrega Grátis" : `Taxa R$ ${item.deliveryFee || "4,99"}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-8 text-zinc-500">
              <p className="text-sm">Nenhum restaurante encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
