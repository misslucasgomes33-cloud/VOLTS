import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Plus, History } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Wallet() {
  return (
    <div className="flex flex-col min-h-full pb-24">
      <div className="bg-zinc-950 px-5 pt-8 pb-4 sticky top-0 z-40">
        <h1 className="text-xl font-display font-bold text-white">Carteira VOLTS</h1>
      </div>

      <div className="p-5">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl mb-6">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <WalletIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Saldo disponível</span>
            </div>
            
            <h2 className="text-4xl font-display font-bold text-white mb-6">
              R$ <span className="text-primary">124</span>,50
            </h2>

            <div className="flex gap-3">
              <Button className="flex-1 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl h-12 gap-2">
                <Plus className="w-4 h-4" /> Adicionar
              </Button>
              <Button variant="outline" className="flex-1 bg-zinc-800/50 hover:bg-zinc-800 border-white/10 text-white font-semibold rounded-xl h-12 gap-2">
                <ArrowUpRight className="w-4 h-4 text-primary" /> Transferir
              </Button>
            </div>
          </div>
        </div>

        {/* VOLTS VIP Status */}
        <div className="bg-zinc-900 border border-primary/20 rounded-2xl p-4 mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-white">Assinatura VIP</span>
              <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase">Ativa</span>
            </div>
            <p className="text-xs text-zinc-400">Próxima cobrança: 24/11 (R$ 24,99)</p>
          </div>
          <Button size="sm" variant="ghost" className="text-xs border-white/10">Gerenciar</Button>
        </div>

        {/* Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-zinc-400" />
              Histórico
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Pedido #4829</p>
                  <p className="text-xs text-zinc-500">Hoje, 20:15</p>
                </div>
              </div>
              <span className="text-sm font-bold text-white">- R$ 54,90</span>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Adição de saldo PIX</p>
                  <p className="text-xs text-zinc-500">Ontem, 14:30</p>
                </div>
              </div>
              <span className="text-sm font-bold text-green-500">+ R$ 100,00</span>
            </div>

            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Assinatura VOLTS VIP</p>
                  <p className="text-xs text-zinc-500">24 Out</p>
                </div>
              </div>
              <span className="text-sm font-bold text-white">- R$ 24,99</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}