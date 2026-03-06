import { Receipt, Clock, MapPin, Zap } from "lucide-react";
import pizzaImg from '@/assets/pizza.png';

export default function Orders() {
  return (
    <div className="flex flex-col min-h-full pb-24">
      <div className="bg-zinc-950 px-5 pt-8 pb-4 sticky top-0 z-40 border-b border-white/5">
        <h1 className="text-xl font-display font-bold text-white">Seus Pedidos</h1>
      </div>

      <div className="p-5 space-y-6">
        {/* Active Order */}
        <div>
          <h2 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Em andamento</h2>
          
          <div className="bg-zinc-900 border border-primary/30 rounded-2xl p-4 shadow-[0_0_15px_rgba(255,204,0,0.05)]">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                  <img src={pizzaImg} alt="Pizza" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Pizza Express</h3>
                  <p className="text-xs text-zinc-400">Pedido #4829</p>
                </div>
              </div>
              <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" fill="currentColor" />
                A caminho
              </div>
            </div>

            <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/5">
              <div className="flex items-start gap-3 relative">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0 z-10" />
                <div className="absolute left-[3px] top-3 bottom-[-20px] w-[2px] bg-zinc-800" />
                <div>
                  <p className="text-sm text-white font-medium">Preparando pedido</p>
                  <p className="text-xs text-zinc-500">20:15</p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0 z-10 shadow-[0_0_8px_rgba(255,204,0,0.8)] animate-pulse" />
                <div className="absolute left-[3px] top-3 bottom-[-20px] w-[2px] bg-zinc-800" />
                <div className="bg-primary/5 border border-primary/20 p-2 rounded-lg -mt-1 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <p className="text-sm text-primary font-bold">Despacho IA</p>
                    <Zap className="w-3 h-3 text-primary" fill="currentColor" />
                  </div>
                  <p className="text-xs text-zinc-400 leading-tight">Nosso sistema de controle de fluxo está conectando seu pedido ao entregador mais rápido e próximo.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative">
                <div className="w-2 h-2 rounded-full bg-zinc-700 mt-1.5 shrink-0 z-10" />
                <div className="absolute left-[3px] top-3 bottom-[-20px] w-[2px] bg-zinc-800" />
                <div>
                  <p className="text-sm text-zinc-400 font-medium">Saiu para entrega</p>
                </div>
              </div>
              <div className="flex items-start gap-3 relative">
                <div className="w-2 h-2 rounded-full bg-zinc-700 mt-1.5 shrink-0 z-10" />
                <div>
                  <p className="text-sm text-zinc-400 font-medium">Previsão de entrega</p>
                  <p className="text-xs text-primary font-bold">20:45 - 20:55</p>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute right-0 top-0 w-16 h-16 bg-primary/20 blur-2xl rounded-full" />
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1 z-10">Código de Confirmação</span>
              <span className="text-4xl font-display font-black text-white tracking-[0.25em] z-10">7492</span>
              <span className="text-[11px] text-zinc-400 mt-2 text-center z-10 max-w-[80%] leading-tight">
                Passe este código para o entregador quando ele chegar para finalizar a corrida
              </span>
            </div>
            
            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between text-sm">
              <span className="text-zinc-400 flex items-center gap-1"><MapPin className="w-3 h-3"/> Entrega no Condomínio</span>
              <span className="text-white font-bold">R$ 54,90</span>
            </div>
          </div>
        </div>

        {/* History */}
        <div>
          <h2 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Anteriores</h2>
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm">Açaí Energy</h3>
                    <p className="text-xs text-zinc-500">12 Out • Entregue</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">R$ 28,50</p>
                  <button className="text-xs text-primary font-medium mt-1">Repetir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}