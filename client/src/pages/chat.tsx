import { ArrowLeft, Send, Bot, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Chat() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Olá! Sou a IA Assistente do VOLTS ⚡. Como posso te ajudar hoje? Posso sugerir restaurantes, tirar dúvidas sobre seu pedido ou te ajudar com suporte.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: 'Nossa inteligência artificial está analisando sua solicitação para oferecer a melhor experiência e suporte rápido!' 
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
            Atendimento Inteligente 24/7
          </div>
        </div>

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2 shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl p-3 ${
              msg.role === 'assistant' 
                ? 'bg-zinc-900 border border-white/5 text-zinc-200 rounded-tl-sm' 
                : 'bg-primary text-black font-medium rounded-tr-sm'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 bg-zinc-950/80 backdrop-blur-md border-t border-white/5 pb-8">
        <div className="flex items-center gap-2 relative">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte à IA do VOLTS..." 
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