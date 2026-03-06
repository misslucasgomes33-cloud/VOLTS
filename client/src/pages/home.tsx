import { Search, MapPin, Zap, Star, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

import burgerImg from '@/assets/burger.png';
import pizzaImg from '@/assets/pizza.png';
import acaiImg from '@/assets/acai.png';

const categories = [
  { id: 1, name: "Restaurantes", icon: "🍽️" },
  { id: 2, name: "Açaí/Sorveteria", icon: "🍧" },
  { id: 3, name: "Açougue", icon: "🥩" },
  { id: 4, name: "Bebidas", icon: "🍻" },
  { id: 5, name: "Farmácia", icon: "💊" },
  { id: 6, name: "Pet Shop", icon: "🐾" },
  { id: 7, name: "Variedades", icon: "🛍️" },
];

const recommended = [
  { id: 1, name: "Volt Burger", rating: 4.9, time: "15-25 min", fee: "R$ 4,99", image: burgerImg, tags: ["Lanches", "Premium"] },
  { id: 2, name: "Pizza Express", rating: 4.7, time: "30-40 min", fee: "Grátis", image: pizzaImg, tags: ["Pizza", "Italiana"] },
  { id: 3, name: "Açaí Energy", rating: 4.8, time: "10-20 min", fee: "R$ 2,99", image: acaiImg, tags: ["Doces", "Açaí"] },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-full pb-24">
      {/* Header */}
      <div className="bg-zinc-950 px-5 pt-8 pb-4 sticky top-0 z-40 border-b border-white/5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="w-4 h-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Entregar em</span>
              <div className="flex items-center gap-1 font-medium text-sm">
                Cuiabá, Centro <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-primary/20">
            <Zap className="w-3.5 h-3.5 text-primary" fill="currentColor" />
            <span className="text-xs font-bold text-primary">VIP</span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="O que você quer pedir hoje?" 
            className="pl-12 h-12 bg-zinc-900 border-white/5 rounded-2xl text-white focus-visible:ring-primary/30 shadow-inner"
          />
        </div>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="px-5 mt-6">
        <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4">
          {categories.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center gap-2 min-w-[72px]">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-2xl border border-white/5 shadow-sm hover:border-primary/50 transition-colors">
                {cat.icon}
              </div>
              <span className="text-[11px] font-medium text-center leading-tight text-zinc-400">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Banner */}
      <div className="px-5 mt-2">
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-5 border border-white/5 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-primary/20 blur-3xl rounded-full" />
          <div className="relative z-10">
            <h3 className="text-white font-display font-bold text-xl mb-1">Volts <span className="text-primary">VIP</span></h3>
            <p className="text-zinc-400 text-xs mb-3 max-w-[60%]">Entrega grátis e descontos exclusivos por R$ 24,99/mês.</p>
            <button className="bg-primary text-black text-xs font-bold px-4 py-2 rounded-lg">
              Assinar agora
            </button>
          </div>
          <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 text-primary opacity-20 rotate-12" fill="currentColor" />
        </div>
      </div>

      {/* Recommended list */}
      <div className="px-5 mt-8 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-display font-bold text-white">Recomendados</h2>
          <span className="text-xs text-primary font-medium">Ver todos</span>
        </div>

        <div className="flex flex-col gap-4">
          {recommended.map((item) => (
            <Card key={item.id} className="bg-zinc-900 border-white/5 overflow-hidden group hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-0 flex h-28">
                <div className="w-28 h-full relative shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 bg-zinc-950 px-1.5 py-0.5 rounded text-[10px] font-medium text-primary">
                        <Star className="w-3 h-3" fill="currentColor" />
                        {item.rating}
                      </div>
                      <span className="text-xs text-zinc-500">•</span>
                      <span className="text-xs text-zinc-400">{item.tags[0]}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-zinc-400">{item.time}</span>
                    <span className={item.fee === "Grátis" ? "text-xs font-semibold text-primary" : "text-xs text-zinc-400"}>
                      {item.fee === "Grátis" ? "Entrega Grátis" : item.fee}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}