import { Link } from "wouter";
import { Smartphone, Store, Bike, ShieldCheck, Zap } from "lucide-react";

export default function Portal() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col items-center mb-12 relative z-10">
        <div className="w-16 h-16 bg-black border border-primary/30 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(255,204,0,0.3)] mb-4">
          <Zap className="w-8 h-8 text-primary" fill="currentColor" />
        </div>
        <h1 className="text-3xl font-display font-black text-white tracking-tight text-center">
          Ecossistema VOLTS
        </h1>
        <p className="text-zinc-400 text-sm mt-2 text-center max-w-xs">
          Selecione qual aplicativo deseja simular neste protótipo
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4 relative z-10">
        {/* App Cliente */}
        <Link href="/login">
          <div className="bg-zinc-900 border border-white/10 hover:border-primary/50 p-5 rounded-2xl flex items-center gap-4 cursor-pointer transition-all group hover:scale-[1.02]">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-white font-bold">VOLTS Cliente</h2>
              <p className="text-xs text-zinc-400 mt-0.5">App para pedir comida (Usuário final)</p>
            </div>
          </div>
        </Link>

        {/* App Operacional */}
        <Link href="/operacional">
          <div className="bg-zinc-900 border border-white/10 hover:border-blue-500/50 p-5 rounded-2xl flex items-center gap-4 cursor-pointer transition-all group hover:scale-[1.02]">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
              <div className="flex items-center gap-1">
                <Store className="w-4 h-4 text-blue-500" />
                <Bike className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <div>
              <h2 className="text-white font-bold">VOLTS Operacional</h2>
              <p className="text-xs text-zinc-400 mt-0.5">App para Restaurantes e Motoristas</p>
            </div>
          </div>
        </Link>

        {/* App Admin */}
        <Link href="/admin">
          <div className="bg-zinc-900 border border-white/10 hover:border-purple-500/50 p-5 rounded-2xl flex items-center gap-4 cursor-pointer transition-all group hover:scale-[1.02]">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-white font-bold">VOLTS Admin</h2>
              <p className="text-xs text-zinc-400 mt-0.5">App de Gestão Global e Vagas</p>
            </div>
          </div>
        </Link>
      </div>
      
      <p className="absolute bottom-8 text-[10px] text-zinc-600 font-medium tracking-widest uppercase">
        DEV PROTOTYPE LAUNCHER
      </p>
    </div>
  );
}