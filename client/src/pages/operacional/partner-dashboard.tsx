import { Store, ShoppingBag, CheckCircle, Clock, ChevronRight, TrendingUp, AlertTriangle, Crown, Star, Sparkles, Activity } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function PartnerDashboard() {
  const { user } = useAuth();
  const [storeStatus, setStoreStatus] = useState(true);
  const [activeTab, setActiveTab] = useState('pedidos');

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header */}
      <div className="bg-zinc-950 px-5 pt-8 pb-4 sticky top-0 z-40 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border-2 border-blue-500/50 flex items-center justify-center relative">
               <Store className="w-5 h-5 text-blue-500" />
               <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full p-0.5">
                  <Crown className="w-3 h-3 text-black" />
               </div>
            </div>
            <div>
              <h2 className="text-white font-bold text-sm flex items-center gap-1">
                {user?.name || "Parceiro"} 
                <span className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-yellow-500 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Pro</span>
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${storeStatus ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">{storeStatus ? 'Loja Aberta' : 'Loja Fechada'}</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setStoreStatus(!storeStatus)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${storeStatus ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}
          >
            {storeStatus ? 'Pausar' : 'Abrir'}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-zinc-900/50 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('pedidos')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'pedidos' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Pedidos
          </button>
          <button 
            onClick={() => setActiveTab('assinatura')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${activeTab === 'assinatura' ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-yellow-500 shadow-sm border border-yellow-500/30' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Crown className="w-3.5 h-3.5" /> Planos
          </button>
        </div>
      </div>

      <div className="p-5">
        {activeTab === 'pedidos' ? (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-zinc-900 border border-white/5 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-white">12</span>
                <span className="text-[10px] text-zinc-500 uppercase mt-1">Pendentes</span>
              </div>
              <div className="bg-zinc-900 border border-white/5 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-primary">5</span>
                <span className="text-[10px] text-zinc-500 uppercase mt-1">No Fogo</span>
              </div>
              <div className="bg-zinc-900 border border-white/5 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-green-500">28</span>
                <span className="text-[10px] text-zinc-500 uppercase mt-1">Entregues</span>
              </div>
            </div>

            {/* AI Assistant Insight (Pro Feature Preview) */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-yellow-500/30 rounded-2xl p-4 mb-6 relative overflow-hidden flex gap-3">
              <div className="absolute right-0 top-0 w-24 h-24 bg-yellow-500/10 blur-xl rounded-full" />
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 border border-yellow-500/30">
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="relative z-10">
                <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-1">IA VOLTS PRO</h4>
                <p className="text-xs text-zinc-300 leading-relaxed mb-2">
                  Previsão de <strong>alta demanda</strong> na sua região às 19:30. Sugiro ativar o "Combo Burger + Coca" com 10% de desconto para atrair os clientes que estão abrindo o app agora.
                </p>
                <Button size="sm" className="h-7 text-[10px] bg-yellow-500 hover:bg-yellow-400 text-black font-bold">Ativar Promoção Sugerida</Button>
              </div>
            </div>

            {/* Partner Mission */}
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 mb-6 relative overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" /> Desafio de Performance
                </h4>
                <span className="text-xs font-bold text-blue-400">-2% na Taxa Hoje</span>
              </div>
              <p className="text-xs text-zinc-400 mb-3">
                Aceite os próximos 10 pedidos em menos de 1 minuto e reduza sua comissão para 8% até o fim do dia!
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-zinc-400 font-bold mb-1">
                  <span>Pedidos Aceitos Rápido</span>
                  <span className="text-blue-500">6 / 10</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>

            {/* Orders Queue */}
            <div className="space-y-4">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" /> Novos Pedidos
              </h3>

              {/* Incoming Order Card */}
              <div className="bg-zinc-900 border border-primary/30 rounded-2xl p-4 shadow-[0_0_15px_rgba(255,204,0,0.1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">NOVO</div>
                
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs text-zinc-400">Pedido #4830</span>
                    <h4 className="font-bold text-white text-lg mt-1">João Silva</h4>
                    <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Há 2 minutos
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-white">R$ 54,90</span>
                    <span className="block text-[10px] text-zinc-500">Pago via PIX</span>
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-3 mb-4 text-sm text-zinc-300">
                  <div className="flex justify-between mb-1">
                    <span>1x Double Smash Premium</span>
                    <span>R$ 38,90</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>1x Fritas Média</span>
                    <span>R$ 10,00</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>1x Coca-Cola Lata</span>
                    <span>R$ 6,00</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30">
                    Recusar
                  </Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold">
                    Aceitar
                  </Button>
                </div>
              </div>

              {/* In Prep Order */}
              <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 opacity-70">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs text-zinc-400">Pedido #4829</span>
                    <h4 className="font-bold text-white text-base mt-1">Maria Santos</h4>
                  </div>
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded font-bold">Preparando</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                   <span className="text-xs text-zinc-500">Entregador: Carlos M. (a caminho)</span>
                   <Button size="sm" variant="outline" className="h-8 text-xs border-white/10">Despachar</Button>
                </div>
              </div>

            </div>

            {/* Multi-stop / Combo alert for Partners */}
            <div className="mt-8 bg-zinc-900 border border-blue-500/30 rounded-2xl p-4 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full" />
              <h4 className="font-bold text-sm text-white flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-500" /> Modo Churrasco Ativo
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                O sistema está combinando pedidos do seu açougue com distribuidoras próximas para gerar carrinhos maiores.
              </p>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wide">Múltiplas paradas habilitadas para entregadores</span>
            </div>
          </>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-display font-black text-white">Planos VOLTS</h3>
              <p className="text-sm text-zinc-400 mt-2">Escolha o plano ideal para o tamanho da sua fome de crescer.</p>
            </div>

            {/* PRO Plan (Highlighted) */}
            <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border-2 border-yellow-500 rounded-3xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(234,179,8,0.15)]">
              <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Seu Plano Atual
              </div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-yellow-500/20 blur-3xl rounded-full" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-6 h-6 text-yellow-500" />
                  <h4 className="text-2xl font-black text-white italic">PRO</h4>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-yellow-500">R$ 109,99</span>
                  <span className="text-zinc-400 text-sm">/mês</span>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-lg font-bold text-yellow-500/70">10%</span>
                  <span className="text-zinc-500 text-xs">de taxa por pedido</span>
                </div>
                <p className="text-xs text-zinc-300 mb-6 font-medium">O ecossistema completo para dominar as vendas e gerir seu negócio.</p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm text-zinc-200">
                    <CheckCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" /> <span>Taxa super reduzida (10%)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-zinc-200">
                    <CheckCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" /> <span><strong>IA VOLTS:</strong> Assistente inteligente de vendas e gestão</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-zinc-200">
                    <CheckCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" /> <span>Destaque máximo no app e notificações Push</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-zinc-200">
                    <CheckCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" /> <span>Gestão financeira, controle de estoque e relatórios avançados</span>
                  </li>
                </ul>
                
                <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl h-12">
                  Gerenciar Plano PRO
                </Button>
              </div>
            </div>

            {/* PREMIUM Plan */}
            <div className="bg-zinc-900 border border-primary/30 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-primary" />
                <h4 className="text-xl font-black text-white">PREMIUM</h4>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-2xl font-bold text-primary">R$ 49,99</span>
                <span className="text-zinc-400 text-sm">/mês</span>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-lg font-bold text-primary/70">13%</span>
                <span className="text-zinc-500 text-xs">de taxa por pedido</span>
              </div>
              <p className="text-xs text-zinc-400 mb-6">Ideal para quem quer crescer e aparecer mais para os clientes.</p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-zinc-300">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" /> <span>Taxa reduzida (13%)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-zinc-300">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" /> <span>Posicionamento especial nas buscas</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-zinc-300">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" /> <span>Análise básica de desempenho</span>
                </li>
              </ul>
              
              <Button variant="outline" className="w-full bg-zinc-800/50 hover:bg-zinc-800 border-primary/20 text-white font-bold rounded-xl h-12">
                Mudar para Premium
              </Button>
            </div>

            {/* FREE Plan */}
            <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6">
              <h4 className="text-lg font-bold text-zinc-300 mb-1">Básico (Gratuito)</h4>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-xl font-bold text-white">15%</span>
                <span className="text-zinc-500 text-sm">de taxa</span>
              </div>
              <p className="text-xs text-zinc-500 mb-6">Apenas listar e vender, sem mensalidades.</p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-zinc-400">
                  <CheckCircle className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" /> <span>Presença no app VOLTS</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-zinc-400">
                  <CheckCircle className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" /> <span>Recebimento de pedidos</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}