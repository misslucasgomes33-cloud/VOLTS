import { ArrowLeft, MapPin, CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

import burgerImg from '@/assets/burger.png';

export default function Cart() {
  const [, setLocation] = useLocation();
  const [deliveryType, setDeliveryType] = useState("portaria");
  const [doorFee, setDoorFee] = useState([5]);

  const subtotal = 38.90;
  const deliveryFee = deliveryType === "porta" ? doorFee[0] : 0;
  const total = subtotal + deliveryFee;

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
          
          <RadioGroup value={deliveryType} onValueChange={setDeliveryType} className="space-y-3">
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
            
            <div className="flex flex-col space-y-3 bg-zinc-900 p-4 rounded-xl border border-white/5 has-[[data-state=checked]]:border-primary/50 has-[[data-state=checked]]:bg-primary/5 transition-all">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="porta" id="porta" className="text-primary border-zinc-600" />
                <Label htmlFor="porta" className="flex-1 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">Entregar dentro do Condomínio</span>
                    <span className="text-white text-sm font-semibold">+ R$ {doorFee[0]},00</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">O entregador entra no condomínio e vai até sua porta</p>
                </Label>
              </div>

              {deliveryType === "porta" && (
                <div className="pt-4 border-t border-white/5 mt-2 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-zinc-300">Defina a taxa de entrega</span>
                    <span className="text-primary font-bold bg-primary/10 px-2 py-1 rounded-md text-sm">R$ {doorFee[0]},00</span>
                  </div>
                  <Slider 
                    defaultValue={[5]} 
                    min={5} 
                    max={13} 
                    step={1}
                    value={doorFee}
                    onValueChange={setDoorFee}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2 text-[10px] text-zinc-500 font-medium">
                    <span>Mínimo R$ 5</span>
                    <span>Máximo R$ 13</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-3 text-center bg-black/20 p-2 rounded-lg">
                    Esta taxa é visível e repassada integralmente ao entregador.
                  </p>
                </div>
              )}
            </div>
          </RadioGroup>
        </div>

        <div className="py-6 space-y-3">
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Taxa de entrega ({deliveryType === 'portaria' ? 'Portaria' : 'Porta'})</span>
            <span className={deliveryType === 'portaria' ? "text-primary font-medium" : "text-white"}>
              {deliveryType === 'portaria' ? 'Grátis (VIP)' : `+ R$ ${doorFee[0].toFixed(2).replace('.', ',')}`}
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg text-white pt-2 border-t border-white/5">
            <span>Total</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-[80px] w-full max-w-[430px] p-5 bg-background/90 backdrop-blur-md z-40 border-t border-white/5">
        <Button 
          onClick={() => setLocation("/pedidos")}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(255,204,0,0.2)]"
        >
          Fazer Pedido
        </Button>
      </div>
    </div>
  );
}