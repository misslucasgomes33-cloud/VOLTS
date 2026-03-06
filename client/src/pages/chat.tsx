import { ArrowLeft, Send, Bot, Zap, Tag, MapPin, Search, Headset, Info, AlertTriangle, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [, setLocation] = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      isProactiveAlert: true,
      text: 'Notei que o restaurante "Pizza Express" está demorando um pouco mais que o normal (10 min de atraso). Mas não se preocupe! Já entrei em contato com eles e o seu pedido está no forno. Para compensar a espera, aqui está um cupom de frete grátis para sua próxima compra! 🍕' 
    },
    { 
      role: 'assistant', 
      text: 'Oi! 👋 Sou a IA do VOLTS. Posso te ajudar a encontrar comida, resolver problemas com pedidos, ou explicar como funciona o app.' 
    }
  ]);
  const [input, setInput] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    
    setTimeout(() => {
      let responseText = '';
      const lowerInput = userText.toLowerCase();
      
      if (lowerInput.includes('promoção') || lowerInput.includes('desconto')) {
        responseText = 'Hoje temos 20% OFF na Pizza Express e entrega grátis no Volt Burger para pedir agora. Quer dar uma olhada na tela principal? 🍕🍔';
      } else if (lowerInput.includes('pedido') || lowerInput.includes('cade') || lowerInput.includes('cadê') || lowerInput.includes('acompanhar')) {
        responseText = 'Seu pedido #4829 da Pizza Express já está com o entregador e chega em aprox. 15 minutos! Você pode ver no menu "Pedidos". 🛵💨';
      } else if (lowerInput.includes('porta') || lowerInput.includes('portaria') || lowerInput.includes('taxa')) {
        responseText = 'Funciona assim: a "Entrega na portaria" é grátis (padrão). Mas se quiser que o entregador suba até sua porta, você escolhe a "Entrega dentro do condomínio" no carrinho e define uma caixinha de R$5 a R$13 que vai 100% para ele! 🏢';
      } else if (lowerInput.includes('restaurante') || lowerInput.includes('fome') || lowerInput.includes('comer')) {
        responseText = 'Que tal um Volt Burger? É o mais bem avaliado perto de você, chega em 20 min. Ou talvez um Açaí Energy para refrescar? 😋';
      } else if (lowerInput.includes('suporte') || lowerInput.includes('problema') || lowerInput.includes('ajuda') || lowerInput.includes('falar')) {
        responseText = 'Entendi. Vou te conectar agora mesmo com um de nossos atendentes humanos para resolver isso rápido para você. Um momento... 🎧';
      } else if (lowerInput.includes('demora') || lowerInput.includes('atrasado') || lowerInput.includes('motoboy') || lowerInput.includes('entregador')) {
        responseText = 'Poxa, vi aqui que o motoboy parou por 5 minutos no trajeto. Já enviei um alerta para ele e estou monitorando. Se ele não se mover em 2 minutos, vou acionar o suporte e te enviar um cupom, combinado? 🚦';
      } else if (lowerInput.includes('faltando') || lowerInput.includes('veio errado') || lowerInput.includes('errado')) {
        responseText = 'Que chato! 😔 Pelo visto o restaurante esqueceu algum item. Não se preocupe! Posso pedir para eles enviarem o que faltou agora mesmo ou fazer o reembolso automático na sua carteira VOLTS. Qual você prefere?';
      } else {
        responseText = 'Certo! Se precisar resolver algum B.O com pedido, quiser saber de promoções ou tirar dúvidas sobre entregas, é só me perguntar. Estou aqui pra ajudar! 😊';
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: responseText 
      }]);
    }, 800);
  };

  const handleQuickAction = (text: string) => {
    setInput(text);
    setTimeout(() => {
      document.getElementById('chat-send-btn')?.click();
    }, 100);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <div className="bg-zinc-950 px-5 pt-8 pb-4 sticky top-0 z-40 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => setLocation("/home")} className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">Suporte VOLTS</h1>
            <p className="text-[10px] text-zinc-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span> IA Monitorando Pedidos
            </p>
          </div>
        </div>
        <div className="w-10 h-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-32 hide-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
            {msg.role === 'assistant' && !msg.isProactiveAlert && (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2 shrink-0 border border-primary/30 mt-auto mb-1">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            
            {msg.isProactiveAlert ? (
               <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex flex-col gap-3 mt-2 mb-4">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                     <Clock className="w-4 h-4 text-red-500" />
                   </div>
                   <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Aviso Automático IA</p>
                 </div>
                 <p className="text-sm text-zinc-200 leading-relaxed">{msg.text}</p>
                 <div className="flex gap-2 mt-2">
                    <button onClick={() => handleQuickAction("Quero o reembolso na carteira")} className="bg-zinc-900 border border-white/10 px-3 py-2 rounded-lg text-xs font-medium text-white hover:bg-zinc-800 transition-colors">
                      Aceitar Cupom
                    </button>
                    <button onClick={() => handleQuickAction("Falar com suporte")} className="bg-red-500/20 border border-red-500/30 px-3 py-2 rounded-lg text-xs font-medium text-white hover:bg-red-500/30 transition-colors">
                      Falar com humano
                    </button>
                 </div>
              </div>
            ) : (
              <div className={`max-w-[80%] rounded-2xl p-3.5 shadow-sm ${
                msg.role === 'assistant' 
                  ? 'bg-zinc-900 border border-white/5 text-zinc-200 rounded-bl-sm' 
                  : 'bg-primary text-black font-medium rounded-br-sm'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-zinc-950/95 backdrop-blur-md border-t border-white/5">
        {/* Quick Actions */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar p-3 border-b border-white/5">
          <button onClick={() => handleQuickAction("Meu pedido está atrasado")} className="bg-zinc-900 border border-white/10 px-3 py-2 rounded-xl text-xs text-white whitespace-nowrap flex items-center gap-2 hover:bg-zinc-800 transition-colors">
            <Clock className="w-3.5 h-3.5 text-primary" /> Pedido atrasado
          </button>
          <button onClick={() => handleQuickAction("Veio faltando um item")} className="bg-zinc-900 border border-white/10 px-3 py-2 rounded-xl text-xs text-white whitespace-nowrap flex items-center gap-2 hover:bg-zinc-800 transition-colors">
            <AlertTriangle className="w-3.5 h-3.5 text-primary" /> Veio faltando item
          </button>
          <button onClick={() => handleQuickAction("Acompanhar pedido")} className="bg-zinc-900 border border-white/10 px-3 py-2 rounded-xl text-xs text-white whitespace-nowrap flex items-center gap-2 hover:bg-zinc-800 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-primary" /> Acompanhar motoboy
          </button>
          <button onClick={() => handleQuickAction("Falar com suporte")} className="bg-zinc-900 border border-white/10 px-3 py-2 rounded-xl text-xs text-white whitespace-nowrap flex items-center gap-2 hover:bg-zinc-800 transition-colors">
            <Headset className="w-3.5 h-3.5 text-primary" /> Falar com suporte
          </button>
        </div>

        <div className="p-3 pb-8">
          <div className="flex items-center gap-2 relative">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Descreva seu problema..." 
              className="h-12 bg-zinc-900 border-white/10 rounded-full pl-4 pr-12 text-white focus-visible:ring-primary/50 text-sm"
            />
            <button 
              id="chat-send-btn"
              onClick={handleSend}
              className="absolute right-1.5 w-9 h-9 bg-primary rounded-full flex items-center justify-center text-black hover:bg-primary/80 transition-colors"
            >
              <Send className="w-4 h-4 ml-[-2px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}