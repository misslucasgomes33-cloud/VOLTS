import { Link } from "wouter";
import { Zap, ShieldCheck, Bike, Utensils, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Portal() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[120%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(255,204,0,0.4)] rotate-3">
          <Zap className="w-12 h-12 text-black" fill="currentColor" />
        </div>
        
        <h1 className="text-4xl font-display font-black text-white tracking-tight mb-2 text-center">
          Ecossistema VOLTS
        </h1>
        <p className="text-zinc-400 text-center mb-12">
          Selecione o aplicativo que deseja acessar
        </p>

        {/* App Links */}
        <div className="w-full space-y-4">
          
          {/* Cliente App */}
          <Link href="/login">
            <div className="w-full bg-zinc-900 border border-primary/30 hover:border-primary/80 p-5 rounded-2xl flex items-center gap-4 cursor-pointer transition-all group hover:scale-[1.02] shadow-lg">
              <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/30 transition-colors">
                <Utensils className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-bold text-lg group-hover:text-primary transition-colors">VOLTS Cliente</h2>
                <p className="text-xs text-zinc-400 mt-1">App para clientes fazerem pedidos</p>
              </div>
            </div>
          </Link>

          {/* Operacional App */}
          <Link href="/operacional">
            <div className="w-full bg-zinc-900 border border-blue-500/30 hover:border-blue-500/80 p-5 rounded-2xl flex items-center gap-4 cursor-pointer transition-all group hover:scale-[1.02] shadow-lg">
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-500/30 transition-colors">
                <Bike className="w-7 h-7 text-blue-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">VOLTS Operacional</h2>
                <p className="text-xs text-zinc-400 mt-1">App para entregadores e parceiros</p>
              </div>
            </div>
          </Link>

          {/* Admin App */}
          <Link href="/admin">
            <div className="w-full bg-zinc-900 border border-purple-500/30 hover:border-purple-500/80 p-5 rounded-2xl flex items-center gap-4 cursor-pointer transition-all group hover:scale-[1.02] shadow-lg">
              <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-purple-500/30 transition-colors">
                <ShieldCheck className="w-7 h-7 text-purple-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-bold text-lg group-hover:text-purple-400 transition-colors">VOLTS Gestão</h2>
                <p className="text-xs text-zinc-400 mt-1">Painel ADM central e Gerência local</p>
              </div>
            </div>
          </Link>

        </div>
        
        <div className="mt-12 text-center">
          <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
            Mockup Mode • v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
