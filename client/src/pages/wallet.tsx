import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Plus, History, Gift, Zap, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Wallet() {
  return (
    <div className="flex flex-col min-h-full pb-24">
      <div className="bg-zinc-950 px-5 pt-8 pb-4 sticky top-0 z-40">
        <h1 className="text-xl font-display font-bold text-white">Carteira & Prêmios</h1>
      </div>

      <div className="p-5">
        {/* Balances Container */}
        <div className="space-y-3 mb-8">
          {/* Main Wallet Balance */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <WalletIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Saldo VOLTS</span>
                </div>
              </div>
              
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                R$ <span className="text-primary">124</span>,50
              </h2>

              <div className="flex gap-3">
                <Button className="flex-1 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl h-11 gap-2 text-sm">
                  <Plus className="w-4 h-4" /> Adicionar
                </Button>
                <Button variant="outline" className="flex-1 bg-zinc-800/50 hover:bg-zinc-800 border-white/10 text-white font-semibold rounded-xl h-11 gap-2 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-primary" /> Sacar
                </Button>
              </div>
              
              <div className="mt-4 flex items-start gap-2 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-zinc-400 leading-tight">
                  <strong className="text-red-400">Atenção:</strong> Saques possuem taxa de R$5,00 para transferência imediata (limite de 3 ao dia). Saque mínimo: R$40.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Cashback Balance */}
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4">
              <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mb-1 block">Saldo Cashback</span>
              <span className="text-xl font-bold text-green-400">R$ 18,90</span>
              <p className="text-[10px] text-zinc-500 mt-1">Expira em 15 dias</p>
            </div>

            {/* Loyalty Points */}
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4">
              <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mb-1 block">Pontos Fidelidade</span>
              <span className="text-xl font-bold text-primary flex items-center gap-1">1.250 <Zap className="w-4 h-4" fill="currentColor" /></span>
              <p className="text-[10px] text-zinc-500 mt-1">VIP pontua 2x mais</p>
            </div>
          </div>
        </div>

        {/* Loyalty Rewards (Redemption) */}
        <div className="mb-8">
           <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
             <Gift className="w-4 h-4 text-primary" />
             Resgatar Pontos
           </h3>
           <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
             <div className="min-w-[140px] bg-zinc-900 border border-primary/30 rounded-2xl p-3 relative">
               <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-xl">Liberado</div>
               <span className="text-2xl mb-2 block">🍟</span>
               <h4 className="font-bold text-white text-sm">Fritas Média</h4>
               <p className="text-primary text-xs font-bold mt-1">800 pts</p>
               <Button className="w-full mt-3 h-8 text-xs bg-primary hover:bg-primary/90 text-black font-bold">Resgatar</Button>
             </div>
             <div className="min-w-[140px] bg-zinc-900 border border-white/5 rounded-2xl p-3">
               <span className="text-2xl mb-2 block">🥤</span>
               <h4 className="font-bold text-white text-sm">Coca-Cola Lata</h4>
               <p className="text-zinc-400 text-xs font-bold mt-1">1.500 pts</p>
               <Button className="w-full mt-3 h-8 text-xs bg-zinc-800 text-zinc-500 font-bold" disabled>Faltam 250</Button>
             </div>
             <div className="min-w-[140px] bg-zinc-900 border border-white/5 rounded-2xl p-3">
               <span className="text-2xl mb-2 block">🛵</span>
               <h4 className="font-bold text-white text-sm">Frete Grátis</h4>
               <p className="text-zinc-400 text-xs font-bold mt-1">2.000 pts</p>
               <Button className="w-full mt-3 h-8 text-xs bg-zinc-800 text-zinc-500 font-bold" disabled>Faltam 750</Button>
             </div>
           </div>
        </div>

        {/* Referral System */}
        <div className="bg-zinc-900 border border-primary/20 rounded-2xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Indique e Ganhe R$15</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Convide amigos para o VOLTS. Eles ganham R$10 no primeiro pedido, e você ganha R$15.
              </p>
              <div className="mt-3 flex gap-2">
                <div className="bg-black border border-white/10 rounded-lg px-3 py-2 flex-1 flex items-center justify-between text-xs font-mono text-zinc-300">
                  VOLTS-JOAO24
                </div>
                <Button size="sm" className="bg-zinc-800 text-white hover:bg-zinc-700">Copiar</Button>
              </div>
            </div>
          </div>
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
                  <Gift className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Cashback Recebido</p>
                  <p className="text-xs text-zinc-500">Hoje, 20:15</p>
                </div>
              </div>
              <span className="text-sm font-bold text-green-500">+ R$ 2,50</span>
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