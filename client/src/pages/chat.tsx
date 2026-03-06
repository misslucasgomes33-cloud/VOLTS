import { ArrowLeft, Send, Bot, Zap, TrendingUp, Clock, Percent } from "lucide-react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Chat() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      text: 'Olá! Sou a IA Assistente do VOLTS ⚡. Analiso o fluxo de entregas e a demanda em tempo real para te oferecer a melhor experiência.' 
    },
    {
      role: 'assistant',
      isSystemAlert: true,
      text: 'No momento, identifiquei alta demanda no Centro. Realoquei entregadores para manter nossas entregas ultra-rápidas. Que tal pedir agora e evitar atrasos?'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    
    setTimeout(() => {
      let responseText = 'Analisando o clima, trânsito e fluxo de pedidos atual...';
      
      if (input.toLowerCase().includes('promoção') || input.toLowerCase().includes('desconto')) {
        responseText = 'Encontrei uma oportunidade! Com base no horário atual, as pizzarias estão com fluxo tranquilo. Posso aplicar um cupom relâmpago de 20% OFF na Pizza Express para você agora mesmo. Aceita?';
      } else if (input.toLowerCase().includes('demora') || input.toLowerCase().includes('tempo')) {
        responseText = 'Nosso algoritmo de despacho inteligente já previu a alta demanda na sua área. Direcionamos 15 entregadores adicionais para o seu bairro. Seu pedido chegará no prazo!';
      } else {
        responseText = 'Entendi! Como nossa malha de entregadores está distribuída eficientemente agora, qualquer pedido que você fizer será coletado em no máximo 3 minutos pelo entregador mais próximo.';
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: responseText 
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <div className="bg-zinc-950 px-5 pt-8 pb-4 sticky top-0 z-40 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => setLocation("/home")} className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-display font-bold text-white">Assistente IA</h1>
        </div>
        <div className="w-10 h-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-24 hide-scrollbar">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 border border-primary/20 text-primary text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3" fill="currentColor" />
            Controle de Fluxo Ativo
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          <button onClick={() => { setInput("Tem alguma promoção?"); handleSend(); }} className="bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-full text-xs text-white whitespace-nowrap flex items-center gap-1.5">
            <Percent className="w-3 h-3 text-primary" /> Sugerir Promoção
          </button>
          <button onClick={() => { setInput("Como está o tempo de entrega?"); handleSend(); }} className="bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-full text-xs text-white whitespace-nowrap flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-primary" /> Tempo de Entrega
          </button>
          <button onClick={() => { setInput("Qual a tendência de pedidos?"); handleSend(); }} className="bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-full text-xs text-white whitespace-nowrap flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-primary" /> Tendências
          </button>
        </div>

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
            {msg.role === 'assistant' && !msg.isSystemAlert && (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2 shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            
            {msg.isSystemAlert ? (
              <div className="w-full bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-start gap-3 mt-2">
                 <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                   <Zap className="w-4 h-4 text-primary" fill="currentColor" />
                 </div>
                 <div>
                   <p className="text-xs font-bold text-primary mb-0.5">Radar IA de Demanda</p>
                   <p className="text-sm text-zinc-300 leading-relaxed">{msg.text}</p>
                 </div>
              </div>
            ) : (
              <div className={`max-w-[75%] rounded-2xl p-3 ${
                msg.role === 'assistant' 
                  ? 'bg-zinc-900 border border-white/5 text-zinc-200 rounded-tl-sm' 
                  : 'bg-primary text-black font-medium rounded-tr-sm'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 bg-zinc-950/80 backdrop-blur-md border-t border-white/5 pb-8">
        <div className="flex items-center gap-2 relative">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ex: Tem promoção agora?..." 
            className="h-12 bg-zinc-900 border-white/10 rounded-full pl-4 pr-12 text-white focus-visible:ring-primary/50"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black hover:bg-primary/80 transition-colors"
          >
            <Send className="w-4 h-4 ml-[-2px]" />
          </button>
        </div>
      </div>
    </div>
  );
}