import { useState, useEffect } from "react";
import { Video, Download, Sparkles, Instagram, PlayCircle, Loader2, ArrowLeft, Users, AlertCircle, PlusCircle, Building2, ShieldAlert, Cpu, Activity, BrainCircuit, ArrowRight, CheckCircle2, Mic, Bot, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";

// Import the generated video
import promoVideo from '@/assets/videos/promo-volts.mp4';

// Mock data for zones capacity
const zoneCapacity = [
  { id: 1, name: "Cristo Rei / Ponte Nova / Aeroporto", type: "driver", max: 15, current: 15, city: "Várzea Grande", waitlist: 3 },
  { id: 2, name: "São Matheus / Paiaguás", type: "driver", max: 10, current: 8, city: "Várzea Grande", waitlist: 0 },
  { id: 3, name: "Jd Glória / Mapim / Nova Esperança / Cohab Michel / Jacarandá", type: "driver", max: 15, current: 15, city: "Várzea Grande", waitlist: 5 },
  { id: 4, name: "Centro / CPA / Santa Rosa", type: "driver", max: 15, current: 15, city: "Cuiabá", waitlist: 0 },
  { id: 5, name: "Coxipó / Tijucal", type: "driver", max: 10, current: 10, city: "Cuiabá", waitlist: 8 },
];

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('ai'); // 'ai', 'marketing' or 'capacity'
  const [adminRole, setAdminRole] = useState('adm'); // adm or gerencia
  
  // Marketing State
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [template, setTemplate] = useState("launch");

  // AI Chat State
  const [isListening, setIsListening] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [greeting, setGreeting] = useState("Olá");
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Carregando interface de voz...' }
  ]);

  useEffect(() => {
    // get from localStorage or default to adm
    const role = localStorage.getItem('admin_role') || 'adm';
    setAdminRole(role);
    
    // Gerência doesn't have access to marketing by default in this prototype
    if (role === 'gerencia' && activeTab === 'marketing') {
      setActiveTab('capacity');
    }

    // Set greeting based on time
    const hour = new Date().getHours();
    let timeGreeting = "Boa noite";
    if (hour >= 5 && hour < 12) timeGreeting = "Bom dia";
    else if (hour >= 12 && hour < 18) timeGreeting = "Boa tarde";
    
    setGreeting(`${timeGreeting}, Senhor Lucas!`);
    setChatHistory([
      { role: 'ai', text: `${timeGreeting}, Senhor Lucas! Como vai? Sistema operando nominalmente, mas resolvi um travamento na fila do PIX há pouco. Precisa de algo?` }
    ]);

  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(false);
      setVideoReady(true);
    }, 2500);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newHistory = [...chatHistory, { role: 'user', text: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage("");
    
    // Mock AI response
    setTimeout(() => {
      let responseText = "Entendido, chefe. Estou monitorando isso de perto.";
      
      if (chatMessage.toLowerCase().includes("piada")) {
        responseText = "Por que o banco de dados foi ao psiquiatra? Porque ele tinha muitos relacionamentos rompidos! 🥁 Ba-dum-tss. Brincadeiras à parte, a latência está em 42ms hoje.";
      } else if (chatMessage.toLowerCase().includes("problema") || chatMessage.toLowerCase().includes("bug") || chatMessage.toLowerCase().includes("b.o")) {
        responseText = "Pode deixar comigo. Já zerei a fila fantasma do PIX e bloqueei 3 IPs suspeitos na última hora. O sistema está blindado e voando baixo.";
      } else if (chatMessage.toLowerCase().includes("relatório")) {
        responseText = "Tivemos 1.240 pedidos hoje, ticket médio de R$ 42. Sugiro darmos um boost de bônus na região Centro agora no jantar. Devo ativar?";
      }

      setChatHistory([...newHistory, { role: 'ai', text: responseText }]);
    }, 1000);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setChatMessage("Como estão as vendas hoje?");
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 pb-24">
      {/* Header */}
      <div className="bg-zinc-950 px-5 pt-8 pb-4 sticky top-0 z-40 border-b border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setLocation("/admin")} className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 text-white shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-display font-black text-white flex items-center gap-2">
              Painel VOLTS
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${adminRole === 'adm' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {adminRole === 'adm' ? 'ADM' : 'Gerência'}
              </span>
            </h1>
            <p className="text-xs text-zinc-400">Controle Operacional & Inteligência</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-zinc-900/50 p-1 rounded-xl overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'ai' ? 'bg-cyan-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <BrainCircuit className="w-3.5 h-3.5" /> Monitor IA
          </button>
          {adminRole === 'adm' && (
            <button 
              onClick={() => setActiveTab('marketing')}
              className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'marketing' ? 'bg-purple-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Video className="w-3.5 h-3.5" /> Criativos
            </button>
          )}
          <button 
            onClick={() => setActiveTab('capacity')}
            className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'capacity' ? 'bg-primary text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Users className="w-3.5 h-3.5" /> Vagas / Zonas
          </button>
        </div>
      </div>

      <div className="p-5">
        {activeTab === 'ai' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            
            {/* Guardian AI Report */}
            <div className="bg-gradient-to-br from-cyan-900/20 to-zinc-900 border border-cyan-500/30 rounded-3xl p-5 relative overflow-hidden">
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-lg font-bold text-white">IA Guardian (Vigilância)</h2>
                  </div>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                </div>
                
                <p className="text-xs text-zinc-300 mb-4">
                  Monitoramento contínuo do sistema. Identifica falhas, tentativas de fraude, duplicidade de contas e anomalias operacionais. Relatórios em tempo real.
                </p>

                <div className="space-y-3">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      <span className="text-xs font-bold text-red-500 uppercase">Fraude Bloqueada</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Detectadas 3 contas de clientes usando o mesmo dispositivo (IMEI: A7X...). Ação: Contas suspensas e IPs bloqueados.
                    </p>
                  </div>
                  
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs font-bold text-amber-500 uppercase">Alerta Operacional</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Motorista "Marcos T." com GPS inconsistente ou simulado. Tempo de entrega 40% acima da média na região do Cristo Rei. Conta pausada para análise.
                    </p>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-xs font-bold text-orange-500 uppercase">Falha de Sistema Detectada</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      O serviço de pagamentos via PIX retornou erro (TimeOut) 15 vezes nos últimos 2 minutos. Fila de processos engarrafada.
                    </p>
                  </div>
                  
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Cpu className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-xs font-bold text-green-500 uppercase">Saúde do Servidor</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Carga do servidor estável (42%). Nenhuma anomalia de rede. Banco de dados sincronizado e backup diário OK.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <span className="text-[9px] text-cyan-500 flex items-center gap-1 font-mono bg-cyan-950 px-2 py-1 rounded-full border border-cyan-500/20">
                    <ArrowRight className="w-3 h-3" /> ENVIANDO RELATÓRIO PARA IA ADVISOR
                  </span>
                </div>
              </div>
            </div>

            {/* Advisor AI Dashboard */}
            <div className="bg-gradient-to-br from-indigo-900/20 to-zinc-900 border border-indigo-500/30 rounded-3xl p-5 relative overflow-hidden flex flex-col">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full" />
              <div className="relative z-10 flex-1 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-bold text-white">Assistente Executivo</h2>
                  </div>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold border border-indigo-500/30">ONLINE</span>
                </div>
                
                {/* Voice / Chat Interface */}
                <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-4 mb-4 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4 hide-scrollbar min-h-[150px] max-h-[200px]">
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-primary text-black font-medium rounded-tr-sm' 
                            : 'bg-zinc-800 text-zinc-200 border border-white/10 rounded-tl-sm'
                        }`}>
                          {msg.role === 'ai' && <Bot className="w-3 h-3 text-indigo-400 inline-block mr-1.5 -mt-0.5" />}
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="relative mt-auto">
                    <input 
                      type="text" 
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Fale comigo ou digite aqui..."
                      className="w-full bg-zinc-900 border border-white/10 rounded-full pl-4 pr-24 py-3 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                    />
                    <div className="absolute right-1 top-1 flex gap-1">
                      <button 
                        onClick={toggleVoice}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={handleSendMessage}
                        className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors"
                      >
                        <Send className="w-3.5 h-3.5 -ml-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">

                  {/* Auto-Fix Section */}
                  <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-3">
                     <div className="flex items-center justify-between mb-2">
                       <span className="text-indigo-400 font-bold text-xs flex items-center gap-1">
                         <Cpu className="w-3.5 h-3.5" /> Correção Automática de Bugs
                       </span>
                       <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono">LOG DE AÇÕES</span>
                     </div>
                     <p className="text-[11px] text-zinc-300 leading-relaxed mb-2">
                       Recebi o alerta da IA Guardian sobre falhas na fila do PIX. Analisei os logs do servidor e notei travamento em processos zumbis na fila temporária.
                     </p>
                     <div className="bg-black/40 border border-white/5 p-2 rounded-lg space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-green-400">
                          <CheckCircle2 className="w-3 h-3" /> Reiniciei serviço de pagamentos (Gateway)
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-green-400">
                          <CheckCircle2 className="w-3 h-3" /> Limpei fila temporária presa
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-green-400">
                          <CheckCircle2 className="w-3 h-3" /> Reenviei os 15 eventos de falha (Sucesso: 100%)
                        </div>
                     </div>
                     <p className="text-[10px] text-zinc-500 mt-2 font-mono">Resolvido sem intervenção humana às 19:42.</p>
                  </div>

                  <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-3">
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      <span className="text-indigo-400 font-bold block mb-1">Estratégia de Crescimento (Negócios)</span>
                      Analisando o fluxo de pedidos, a região do <strong>Coxipó / Tijucal</strong> tem um ticket médio 25% maior às sextas, mas baixa adesão de restaurantes no almoço.
                      <br/><br/>
                      💡 <strong className="text-white">Recomendação:</strong> Enviar notificação push recrutando parceiros nessa região com taxa reduzida (12%) nos primeiros 30 dias.
                    </p>
                    {adminRole === 'adm' && (
                      <Button size="sm" className="w-full mt-3 h-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px]">
                        Aprovar Campanha
                      </Button>
                    )}
                  </div>
                  
                  <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-3">
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      <span className="text-indigo-400 font-bold block mb-1">Prevenção de Crise (Operacional)</span>
                      Com o bloqueio do motorista "Marcos T." feito pelo Guardian, a zona Cristo Rei pode sofrer com fila de espera e falta de cobertura às 20h.
                      <br/><br/>
                      💡 <strong className="text-white">Ação Automática:</strong> Ativei o Bônus Progressivo (+R$ 3,00) no Cristo Rei para atrair entregadores de áreas vizinhas e escalei +1 entregador da fila de espera. Realocação concluída.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        )}

        {activeTab === 'marketing' && adminRole === 'adm' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-purple-900/20 to-zinc-900 border border-purple-500/30 rounded-3xl p-6 relative overflow-hidden mb-6">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-bold text-white">Gerador de Criativos IA</h2>
                </div>
                
                <p className="text-sm text-zinc-300 mb-6">
                  Crie vídeos promocionais virais para o TikTok, Reels e Status do WhatsApp usando IA em segundos.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-2 block">Selecione o Modelo</label>
                    <Select value={template} onValueChange={setTemplate}>
                      <SelectTrigger className="w-full h-14 bg-zinc-900/50 border-white/10 text-white rounded-xl">
                        <SelectValue placeholder="Escolha um modelo" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="launch">🚀 Lançamento (App p/ Clientes)</SelectItem>
                        <SelectItem value="driver">🏍️ Recrutamento de Entregadores</SelectItem>
                        <SelectItem value="partner">🏪 Captação de Restaurantes</SelectItem>
                        <SelectItem value="promo">🍕 Promoções & Cupons (Flash)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Gerando criativo...
                      </>
                    ) : (
                      <>
                        <Video className="w-5 h-5" /> Gerar Vídeo Vertical
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {videoReady && (
              <div className="bg-zinc-900 border border-white/10 rounded-3xl p-5 animate-in fade-in zoom-in duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Criativo Pronto!
                  </h3>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <Instagram className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                <div className="w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden relative border border-white/5 mb-4 group">
                  <video 
                    src={promoVideo} 
                    className="w-full h-full object-cover"
                    autoPlay 
                    loop 
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center text-black backdrop-blur-sm cursor-pointer">
                      <PlayCircle className="w-8 h-8" />
                    </div>
                  </div>
                  
                  {/* Overlay preview mockup */}
                  <div className="absolute bottom-6 left-4 right-4 text-center z-10">
                    <h4 className="text-white font-black font-display text-2xl uppercase italic drop-shadow-lg mb-1">
                      CHEGAMOS! ⚡
                    </h4>
                    <div className="bg-primary text-black font-bold text-xs px-3 py-1.5 rounded-full inline-block">
                      BAIXE O APP E GANHE R$10
                    </div>
                  </div>
                </div>

                <Button className="w-full h-12 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Baixar Vídeo (MP4)
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'capacity' && (
          <div className="animate-in fade-in duration-300">
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-3 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Modo: {adminRole === 'adm' ? 'Administrador' : 'Gerência'}</h4>
                  <p className="text-[10px] text-zinc-400">
                    {adminRole === 'adm' 
                      ? 'Você pode alterar limites de vagas e aprovar motoristas.' 
                      : 'Você pode visualizar vagas e gerenciar filas, mas não alterar limites globais.'}
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-zinc-400" />
              Limites por Região
            </h3>

            <div className="space-y-4">
              {zoneCapacity.map((zone) => {
                const isFull = zone.current >= zone.max;
                const percentage = Math.min(100, Math.round((zone.current / zone.max) * 100));
                
                return (
                  <div key={zone.id} className={`bg-zinc-900 border rounded-2xl p-4 transition-all ${isFull ? 'border-red-500/30' : 'border-white/5'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-1 block">{zone.city}</span>
                        <h4 className="font-bold text-white text-sm leading-tight">{zone.name}</h4>
                      </div>
                      {isFull && (
                        <span className="bg-red-500/10 text-red-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0 border border-red-500/20">
                          Lotado
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-zinc-400">Vagas Ocupadas</span>
                        <span className={`font-bold ${isFull ? 'text-red-400' : 'text-primary'}`}>{zone.current} / {zone.max}</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${isFull ? 'bg-red-500' : 'bg-primary'}`} 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {isFull && zone.waitlist > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-amber-500">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span><strong>{zone.waitlist}</strong> na lista de espera</span>
                        </div>
                        {adminRole === 'adm' && (
                          <button className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors">
                            <PlusCircle className="w-3 h-3" /> Aumentar teto
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Removed inline CheckCircle2 because it is now imported from lucide-react