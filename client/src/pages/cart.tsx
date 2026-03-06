import { ArrowLeft, MapPin, CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import burgerImg from '@/assets/burger.png';

export default function Cart() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col min-h-screen pb-32">
      <div className="bg-zinc-950 px-5 pt-8 pb-4 sticky top-0 z-40 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => setLocation("/home")} className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-display font-bold text-white">Carrinho</h1>
        <div className="w-10 h-10"></div>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-4 pb-6 border-b border-white/5">
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
            <img src={burgerImg} alt="Volt Burger" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-base">Volt Burger</h3>
            <p className="text-sm text-zinc-400">1x Double Smash Premium</p>
            <p className="font-semibold text-primary mt-1">R$ 38,90</p>
          </div>
        </div>

        <div className="py-6 border-b border-white/5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Opções de Entrega
          </h3>
          
          <RadioGroup defaultValue="portaria" className="space-y-3">
            <div className="flex items-center space-x-3 bg-zinc-900 p-4 rounded-xl border border-white/5 has-[[data-state=checked]]:border-primary/50 has-[[data-state=checked]]:bg-primary/5 transition-all">
              <RadioGroupItem value="portaria" id="portaria" className="text-primary border-zinc-600" />
              <Label htmlFor="portaria" className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Entregar na Portaria</span>
                  <span className="text-primary text-sm font-semibold">Grátis</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">Você desce para buscar</p>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 bg-zinc-900 p-4 rounded-xl border border-white/5 has-[[data-state=checked]]:border-primary/50 has-[[data-state=checked]]:bg-primary/5 transition-all">
              <RadioGroupItem value="porta" id="porta" className="text-primary border-zinc-600" />
              <Label htmlFor="porta" className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Entregar na Porta</span>
                  <span className="text-white text-sm font-semibold">+ R$ 5,00</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">O entregador sobe até você (taxa visível para ele)</p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="py-6 space-y-3">
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Subtotal</span>
            <span>R$ 38,90</span>
          </div>
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Taxa de entrega (Portaria)</span>
            <span className="text-primary font-medium">Grátis (VIP)</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-white pt-2 border-t border-white/5">
            <span>Total</span>
            <span>R$ 38,90</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-[80px] w-full max-w-[430px] p-5 bg-background/90 backdrop-blur-md z-40 border-t border-white/5">
        <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(255,204,0,0.2)]">
          Fazer Pedido
        </Button>
      </div>
    </div>
  );
}