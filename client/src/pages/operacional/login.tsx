import { ShieldAlert, LogIn, Store, Bike, ArrowRight, Video } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OpLogin() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-black p-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
          <ShieldAlert className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-3xl font-display font-black text-white mb-2 tracking-tight text-center">
          SISTEMA <span className="text-primary">OPERACIONAL</span>
        </h1>
        <p className="text-zinc-400 text-center mb-10 text-sm max-w-[280px]">
          Área restrita para parceiros e entregadores VOLTS.
        </p>

        <div className="w-full space-y-4">
          <Button 
            onClick={() => setLocation('/operacional/parceiro')}
            className="w-full h-16 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white rounded-2xl flex items-center justify-between px-6 group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Store className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <span className="block font-bold text-white text-base">Sou Parceiro</span>
                <span className="block text-[10px] text-zinc-500">Restaurantes e Lojas</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-blue-500 transition-colors" />
          </Button>

          <Button 
            onClick={() => setLocation('/operacional/motorista')}
            className="w-full h-16 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white rounded-2xl flex items-center justify-between px-6 group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bike className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <span className="block font-bold text-white text-base">Sou Entregador</span>
                <span className="block text-[10px] text-zinc-500">Acesse sua conta</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-primary transition-colors" />
          </Button>
        </div>
      </div>
    </div>
  );
}