import { Power, MapPin, Navigation, Wallet, ShieldAlert, Zap, Banknote, ListOrdered, User, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [showSOS, setShowSOS] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24 relative">
      {/* Header */}
      <div className="bg-zinc-950 px-5 pt-8 pb-4 sticky top-0 z-40 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-primary overflow-hidden">
             {/* avatar */}
             <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
               <User className="w-5 h-5 text-zinc-400" />
             </div>
          </div>
          <div>
            <h2 className="text-white font-bold text-sm">Carlos M.</h2>
            <div className="flex items-center gap-1">
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold">Nível Ouro</span>
              <span className="text-[10px] text-zinc-400">98% Aceitação</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setShowSOS(true)}
          className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30"
        >
          <ShieldAlert className="w-5 h-5 text-red-500" />
        </button>
      </div>

      <div className="p-5 flex-1">
        {/* Status Toggle */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 mb-6 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
          {isOnline && <div className="absolute inset-0 bg-primary/5 animate-pulse" />}
          
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-xl transition-all duration-300 relative z-10 ${
              isOnline 
                ? 'bg-primary border-primary text-black shadow-[0_0_40px_rgba(255,204,0,0.4)]' 
                : 'bg-zinc-800 border-zinc-700 text-zinc-400'
            }`}
          >
            <Power className="w-10 h-10" />
          </button>
          
          <h3 className={`mt-4 font-bold text-lg ${isOnline ? 'text-primary' : 'text-zinc-500'}`}>
            {isOnline ? 'ONLINE NA FILA' : 'OFFLINE'}
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            {isOnline ? 'Buscando pedidos próximos...' : 'Fique online para receber pedidos'}
          </p>
          
          {isOnline && (
            <div className="mt-4 bg-black/40 border border-white/5 rounded-xl p-3 w-full flex justify-between items-center z-10">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500">Sua Posição na Zona (Centro)</span>
                <span className="text-sm font-bold text-white">#3 de 12 entregadores</span>
              </div>
              <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                <Navigation className="w-4 h-4 text-primary" />
              </div>
            </div>
          )}
        </div>

        {/* Earnings Card */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex flex-col">
            <span className="text-xs text-zinc-400 mb-1 flex items-center gap-1"><Wallet className="w-3 h-3" /> Ganhos Hoje</span>
            <span className="text-xl font-bold text-white">R$ 145,50</span>
            <span className="text-[10px] text-green-500 mt-1">+12 entregas</span>
          </div>
          <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex flex-col">
            <span className="text-xs text-zinc-400 mb-1 flex items-center gap-1"><Banknote className="w-3 h-3" /> Saldo Semanal</span>
            <span className="text-xl font-bold text-white">R$ 480,20</span>
            <span className="text-[10px] text-primary mt-1">Repasse: Terça-feira</span>
          </div>
        </div>

        {/* Missions / Performance */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Missão do Dia</h4>
            <span className="text-xs font-bold text-primary">R$ 30 Bônus</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400 mb-1">
              <span>Faça 20 corridas hoje</span>
              <span>12 / 20</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>

        {/* Dynamic Zone Rules */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4">
          <h4 className="font-bold text-sm text-white flex items-center gap-2 mb-3"><MapPin className="w-4 h-4 text-primary" /> Alta Demanda</h4>
          
          <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div>
              <span className="block text-sm font-bold text-white">Várzea Grande (Centro)</span>
              <span className="block text-xs text-red-400">Demanda muito alta agora</span>
            </div>
            <span className="text-primary font-bold text-sm">+ R$ 3,00/entrega</span>
          </div>
        </div>
      </div>

      {/* SOS Modal */}
      {showSOS && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-5">
          <div className="bg-zinc-900 border border-red-500/50 rounded-3xl p-6 w-full max-w-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Botão de Emergência</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Esta ação enviará sua localização em tempo real para a central VOLTS e contatos de segurança.
            </p>
            <div className="w-full space-y-3">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12">
                Acionar Emergência
              </Button>
              <Button variant="ghost" onClick={() => setShowSOS(false)} className="w-full text-zinc-400 hover:text-white">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}