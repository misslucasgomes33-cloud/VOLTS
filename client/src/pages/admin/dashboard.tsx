import { useState, useEffect, useRef } from "react";
import { Video, Download, Sparkles, Instagram, PlayCircle, Loader2, ArrowLeft, Users, AlertCircle, PlusCircle, Building2, ShieldAlert, Cpu, Activity, BrainCircuit, ArrowRight, CheckCircle2, Mic, Bot, MessageSquare, Send, Map as MapIcon, Navigation, FileText, DollarSign, ListOrdered, Shield, QrCode, Trash2, TrendingUp, Filter, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import MapComponent from "@/components/MapComponent";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

// Import the generated videos
import promoLaunchVideo from '@/assets/videos/promo-volts.mp4';
import promoDriverVideo from '@/assets/videos/driver-promo.mp4';
import promoPartnerVideo from '@/assets/videos/partner-promo.mp4';

// Mock data for zones capacity
const zoneCapacity = [
  { id: 1, name: "Cristo Rei / Ponte Nova / Aeroporto", type: "driver", max: 15, current: 15, city: "Várzea Grande", waitlist: 3 },
  { id: 2, name: "São Matheus / Paiaguás", type: "driver", max: 10, current: 8, city: "Várzea Grande", waitlist: 0 },
  { id: 3, name: "Jd Glória / Mapim / Nova Esperança / Cohab Michel / Jacarandá", type: "driver", max: 15, current: 15, city: "Várzea Grande", waitlist: 5 },
  { id: 4, name: "Centro / CPA / Santa Rosa", type: "driver", max: 15, current: 15, city: "Cuiabá", waitlist: 0 },
  { id: 5, name: "Coxipó / Tijucal", type: "driver", max: 10, current: 10, city: "Cuiabá", waitlist: 8 },
];

const financialData = [
  { name: 'Seg', bruto: 4000, repasseParceiro: 2500, repasseMotoboy: 800, lucro: 700 },
  { name: 'Ter', bruto: 3000, repasseParceiro: 1800, repasseMotoboy: 700, lucro: 500 },
  { name: 'Qua', bruto: 5000, repasseParceiro: 3200, repasseMotoboy: 900, lucro: 900 },
  { name: 'Qui', bruto: 4500, repasseParceiro: 2800, repasseMotoboy: 850, lucro: 850 },
  { name: 'Sex', bruto: 8000, repasseParceiro: 5200, repasseMotoboy: 1500, lucro: 1300 },
  { name: 'Sáb', bruto: 11000, repasseParceiro: 7500, repasseMotoboy: 1900, lucro: 1600 },
  { name: 'Dom', bruto: 9500, repasseParceiro: 6200, repasseMotoboy: 1700, lucro: 1600 },
];

const avulsoData = [
  { time: '08:00', valor: 50 },
  { time: '10:00', valor: 120 },
  { time: '12:00', valor: 250 },
  { time: '14:00', valor: 180 },
  { time: '16:00', valor: 220 },
  { time: '18:00', valor: 400 },
  { time: '20:00', valor: 650 },
];

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('marketing'); // 'ai', 'marketing', 'capacity', 'map', 'users', 'orders', 'financial', 'logs', 'qr'
  const [adminRole, setAdminRole] = useState('adm'); // adm or gerencia
  const [adminCity, setAdminCity] = useState('Global');
  
  // Marketing State
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [template, setTemplate] = useState("launch");
  const [marketingPrompt, setMarketingPrompt] = useState("");
  const [isMarketingListening, setIsMarketingListening] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setVideoReady(false);
    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(false);
      setVideoReady(true);
    }, 2500);
  };

  const clearCreative = () => {
    setVideoReady(false);
    setMarketingPrompt("");
  };

  const handleMarketingPromptSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!marketingPrompt.trim()) return;
    
    // Check if user is asking for something specific like a business card or different type of video
    const promptLower = marketingPrompt.toLowerCase();
    
    if (promptLower.includes('cartão') || promptLower.includes('visita')) {
      setActiveTab('qr');
      setMarketingPrompt('');
      return;
    }
    
    if (promptLower.includes('restaurante') || promptLower.includes('parceiro')) {
      setTemplate('partner');
    } else if (promptLower.includes('motoboy') || promptLower.includes('entregador')) {
      setTemplate('driver');
    } else {
      setTemplate('launch');
    }
    
    handleGenerate();
  };

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
    
    const initialGreeting = `${timeGreeting}, Senhor Lucas! Como vai? O sistema está operando nominalmente, mas resolvi um travamento na fila do PIX há pouco. Precisa de algo?`;
    
    setGreeting(`${timeGreeting}, Senhor Lucas!`);
    setChatHistory([
      { role: 'ai', text: initialGreeting }
    ]);

    // Speak initial greeting
    speakText(initialGreeting);

  }, []);

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    
    // Try to find a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.lang.includes('pt-BR') && 
      (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('luciana') || voice.name.toLowerCase().includes('maria') || voice.name.toLowerCase().includes('zira'))
    ) || voices.find(voice => voice.lang.includes('pt-BR'));
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.1; // Slightly higher pitch for female feel if generic voice
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newHistory = [...chatHistory, { role: 'user', text: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage("");
    
    // Mock AI response with advanced logic based on user prompt
    setTimeout(() => {
      let responseText = "Compreendido. Registrei a informação e estou monitorando a operação no painel.";
      const msgLower = chatMessage.toLowerCase();
      
      if (msgLower.includes("piada")) {
        responseText = "Por que o banco de dados foi ao psiquiatra? Porque ele tinha muitos relacionamentos rompidos! 🥁 Ba-dum-tss. Brincadeiras à parte, a latência está em 42 milissegundos hoje.";
      } else if (msgLower.includes("problema") || msgLower.includes("bug") || msgLower.includes("erro") || msgLower.includes("resolver")) {
        responseText = "Pode deixar comigo. Já zerei a fila fantasma do PIX, reiniciei o gateway de pagamentos e bloqueei 3 IPs suspeitos de fraude na última hora. O sistema está blindado e voando baixo.";
      } else if (msgLower.includes("relatório") || msgLower.includes("status") || msgLower.includes("vendas") || msgLower.includes("como está a operação")) {
        responseText = "Hoje temos 1.240 pedidos em andamento, 125 motoboys online e 45 restaurantes ativos. A região do Coxipó está com alta demanda mas poucos entregadores. Sugiro darmos um bônus dinâmico na região Centro agora no jantar. Devo ativar a campanha?";
      } else if (msgLower.includes("motoboy") && msgLower.includes("falta")) {
        responseText = "Atualmente estamos com uma defasagem de 12% na frota do Centro de Cuiabá. Recomendo ativar a campanha automática de recrutamento no painel de Criativos IA e oferecer taxa zero no primeiro repasse. Quer que eu prepare o criativo?";
      } else if (msgLower.includes("bairro") || msgLower.includes("região")) {
        responseText = "Os bairros com maior volume de pedidos hoje são: Cristo Rei (Várzea Grande) e CPA (Cuiabá). Porém, o ticket médio mais alto está na região do Santa Rosa.";
      } else if (msgLower.includes("gerência") || msgLower.includes("equipe")) {
        responseText = "A equipe de Várzea Grande resolveu 14 chamados de suporte hoje. O tempo médio de resposta está em 2 minutos. Excelente desempenho!";
      }

      setChatHistory([...newHistory, { role: 'ai', text: responseText }]);
      speakText(responseText);
    }, 1200);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setChatMessage("Como está a operação hoje?");
        setIsListening(false);
      }, 2500);
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
          
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <ListOrdered className="w-3.5 h-3.5" /> Pedidos
          </button>
          
          {adminRole === 'adm' && (
            <button 
              onClick={() => setActiveTab('financial')}
              className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'financial' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <DollarSign className="w-3.5 h-3.5" /> Financeiro
            </button>
          )}

          {adminRole === 'adm' && (
            <button 
              onClick={() => setActiveTab('marketing')}
              className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'marketing' ? 'bg-purple-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Video className="w-3.5 h-3.5" /> Criativos IA
            </button>
          )}
          {adminRole === 'adm' && (
            <button 
              onClick={() => setActiveTab('qr')}
              className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'qr' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <QrCode className="w-3.5 h-3.5" /> QR Codes
            </button>
          )}
          <button 
            onClick={() => setActiveTab('capacity')}
            className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'capacity' ? 'bg-primary text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Users className="w-3.5 h-3.5" /> Vagas / Zonas
          </button>
          <button 
            onClick={() => setActiveTab('support')}
            className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'support' ? 'bg-orange-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Suporte
          </button>
          {adminRole === 'adm' && (
            <button 
              onClick={() => setActiveTab('logs')}
              className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'logs' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Shield className="w-3.5 h-3.5" /> Sec & Logs
            </button>
          )}
          <button 
            onClick={() => setActiveTab('map')}
            className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'map' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <MapIcon className="w-3.5 h-3.5" /> Mapa ao Vivo
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

        {/* MARKETING VIEW */}
        {activeTab === 'marketing' && adminRole === 'adm' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-purple-900/20 to-zinc-900 border border-purple-500/30 rounded-3xl p-6 relative overflow-hidden mb-6">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h2 className="text-lg font-bold text-white">Agência de Marketing IA</h2>
                  </div>
                  {videoReady && (
                    <Button 
                      onClick={clearCreative}
                      variant="outline" 
                      size="sm" 
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-8 text-xs font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Limpar Criativos
                    </Button>
                  )}
                </div>
                
                <p className="text-sm text-zinc-300 mb-6">
                  Crie vídeos, banners e textos promocionais. A IA gera narração, música de fundo e artes automaticamente.
                </p>

                <div className="space-y-4 mb-6">
                  <form onSubmit={handleMarketingPromptSubmit} className="relative">
                    <div className="absolute left-4 top-4">
                      <Bot className={`w-5 h-5 ${isMarketingListening ? 'text-red-400 animate-pulse' : 'text-purple-400'}`} />
                    </div>
                    <textarea 
                      value={marketingPrompt}
                      onChange={(e) => setMarketingPrompt(e.target.value)}
                      placeholder='Ex: "Crie um vídeo chamando motoboys para trabalhar no VOLTS em Cuiabá" ou "Faça um banner de frete grátis"'
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-sm text-white focus:outline-none focus:border-purple-500/50 min-h-[100px] resize-none"
                    />
                    <div className="absolute right-3 bottom-3 flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setIsMarketingListening(!isMarketingListening)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isMarketingListening ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                      <button 
                        type="submit"
                        disabled={isGenerating || !marketingPrompt.trim()}
                        className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 text-white flex items-center justify-center transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        setMarketingPrompt("Seja criativa e monte uma campanha do zero para captar novos parceiros (restaurantes) no VOLTS, oferecendo 1 mês sem taxa.");
                        setTimeout(() => handleGenerate(), 500);
                      }}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold h-12 rounded-xl border-none"
                    >
                      <Sparkles className="w-4 h-4 mr-2" /> Seja Criativa! (Auto)
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="h-px bg-white/10 flex-1" />
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Ou use modelos rápidos</span>
                  <div className="h-px bg-white/10 flex-1" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Button 
                    onClick={() => { setTemplate('launch'); handleGenerate(); }}
                    disabled={isGenerating}
                    variant="outline" 
                    className="border-white/10 bg-zinc-900/50 hover:bg-white/5 text-xs h-10"
                  >
                    🚀 App Clientes
                  </Button>
                  <Button 
                    onClick={() => { setTemplate('driver'); handleGenerate(); }}
                    disabled={isGenerating}
                    variant="outline" 
                    className="border-white/10 bg-zinc-900/50 hover:bg-white/5 text-xs h-10"
                  >
                    🏍️ Motoboys
                  </Button>
                  <Button 
                    onClick={() => { setTemplate('partner'); handleGenerate(); }}
                    disabled={isGenerating}
                    variant="outline" 
                    className="border-white/10 bg-zinc-900/50 hover:bg-white/5 text-xs h-10"
                  >
                    🏪 Parceiros
                  </Button>
                  <Button 
                    onClick={() => { setTemplate('promo'); handleGenerate(); }}
                    disabled={isGenerating}
                    variant="outline" 
                    className="border-white/10 bg-zinc-900/50 hover:bg-white/5 text-xs h-10"
                  >
                    🍕 Promos
                  </Button>
                </div>
                
                {isGenerating && (
                  <div className="mt-6 flex flex-col items-center justify-center p-6 bg-black/40 rounded-2xl border border-white/5">
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-3" />
                    <p className="text-sm font-bold text-white mb-1">A IA está trabalhando...</p>
                    <p className="text-xs text-zinc-400 text-center animate-pulse">
                      Escrevendo roteiro, gerando narração, aplicando música e renderizando animações...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {videoReady && (
              <div className="bg-zinc-900 border border-white/10 rounded-3xl p-5 animate-in fade-in zoom-in duration-500 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Campanha Pronta!
                  </h3>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center cursor-pointer hover:bg-pink-600 transition-colors">
                      <Instagram className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Video Preview */}
                  <div className="flex flex-col">
                    <div className="w-full max-w-[280px] mx-auto aspect-[9/16] bg-black rounded-2xl overflow-hidden relative border border-white/5 mb-4 group">
                      <video 
                        src={template === 'driver' ? promoDriverVideo : template === 'partner' ? promoPartnerVideo : promoLaunchVideo} 
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
                          {template === 'driver' ? 'VENHA PARA A VOLTS! 🛵' : template === 'partner' ? 'VENDAS DECOLANDO! 🚀' : 'CHEGAMOS! ⚡'}
                        </h4>
                        <div className="bg-primary text-black font-bold text-xs px-3 py-1.5 rounded-full inline-block">
                          {template === 'driver' ? 'TAXA ZERO NO PRIMEIRO MÊS' : template === 'partner' ? 'CADASTRE SEU RESTAURANTE' : 'BAIXE O APP E GANHE R$10'}
                        </div>
                      </div>
                    </div>

                    <a 
                      href={template === 'driver' ? promoDriverVideo : template === 'partner' ? promoPartnerVideo : promoLaunchVideo} 
                      download={`volts-promo-${template}.mp4`}
                      className="w-full max-w-[280px] mx-auto h-12 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" /> Baixar Vídeo (MP4)
                    </a>
                  </div>

                  {/* Generated Assets Info */}
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
                    <h4 className="text-purple-400 font-bold text-xs uppercase tracking-wider mb-4">Ativos Gerados</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] text-zinc-500 mb-1">Áudio Gerado (Narração AI)</p>
                        <div className="bg-zinc-900 border border-white/10 rounded-lg p-2 flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center">
                            <Mic className="w-3 h-3 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden w-full">
                              <div className="h-full bg-purple-500 w-1/3"></div>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-300 italic mt-2">
                          {template === 'driver' ? '"Trabalhe como motoboy VOLTS e receba seus ganhos toda semana..."' :
                           template === 'partner' ? '"Seja parceiro VOLTS e aumente suas vendas sem taxas abusivas..."' :
                           '"Peça agora pelo VOLTS e receba em minutos na sua porta..."'}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-zinc-500 mb-1">Música de Fundo</p>
                        <p className="text-xs text-white">Upbeat Corporate Electronic (Licença Inclusa)</p>
                      </div>

                      <div>
                        <p className="text-[10px] text-zinc-500 mb-1">Legenda para o Post</p>
                        <p className="text-xs text-zinc-300 bg-zinc-900 p-2 rounded-lg border border-white/5">
                          {template === 'driver' ? '🚀 Chegou a hora de acelerar seus ganhos! Faça seu próprio horário, seja dono do seu caminho e corra com a VOLTS. ⚡️ Baixe o app VOLTS Operacional agora mesmo e cadastre-se! #EntregadorVolts #Motoboy' :
                           template === 'partner' ? '🏪 Chega de taxas abusivas! Seja parceiro VOLTS e veja suas vendas decolarem. Baixe o app Operacional e cadastre seu restaurante! #ParceiroVolts #Delivery' :
                           '🍔 Bateu aquela fome? Peça pelo VOLTS! Entrega rápida, cupons exclusivos e os melhores restaurantes da cidade. Baixe agora! #VoltsDelivery #Fome'}
                        </p>
                        <button className="text-[10px] text-purple-400 font-bold mt-2 hover:text-purple-300 transition-colors">Copiar Texto</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* QR CODE GENERATOR */}
        {activeTab === 'qr' && adminRole === 'adm' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-indigo-900/20 to-zinc-900 border border-indigo-500/30 rounded-3xl p-6 relative overflow-hidden mb-6">
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <QrCode className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-lg font-bold text-white">Gerador de QR Codes</h2>
                </div>
                
                <p className="text-sm text-zinc-300 mb-6">
                  Crie QR Codes personalizados com a marca VOLTS para panfletos, restaurantes, redes sociais e uniformes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <QRCodeGenerator 
                    type="cliente" 
                    url="https://appvolts.com.br/download/cliente" 
                  />
                  <QRCodeGenerator 
                    type="motoboy" 
                    url="https://appvolts.com.br/download/operacional" 
                  />
                  <QRCodeGenerator 
                    type="parceiro" 
                    url="https://appvolts.com.br/parceiros/cadastro" 
                  />
                  <div className="flex flex-col h-full">
                    <QRCodeGenerator 
                      type="cliente" 
                      url="https://appvolts.com.br/cartao-visitas" 
                    />
                    <div className="mt-2 text-center">
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">Cartão de Visitas (Internet)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <div className="bg-gradient-to-br from-blue-900/20 to-zinc-900 border border-blue-500/30 rounded-3xl p-5 relative overflow-hidden mb-6">
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <ListOrdered className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-bold text-white">Gestão de Pedidos ({adminCity})</h2>
                </div>
                <p className="text-sm text-zinc-300 mb-6">Acompanhamento em tempo real dos pedidos na cidade.</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                    <p className="text-xs text-zinc-500 mb-1">Total Hoje</p>
                    <p className="text-2xl font-black text-white">1.240</p>
                  </div>
                  <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                    <p className="text-xs text-zinc-500 mb-1">Em Andamento</p>
                    <p className="text-2xl font-black text-blue-400">84</p>
                  </div>
                  <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                    <p className="text-xs text-zinc-500 mb-1">Cancelados</p>
                    <p className="text-2xl font-black text-red-400">12</p>
                  </div>
                  <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                    <p className="text-xs text-zinc-500 mb-1">Tempo Médio</p>
                    <p className="text-2xl font-black text-emerald-400">28m</p>
                  </div>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Pedidos Recentes</h3>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-zinc-900 border border-white/5 rounded-lg">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-white">#VOLTS-{1000 + i}</span>
                            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">Em Andamento</span>
                          </div>
                          <p className="text-[11px] text-zinc-400">Pizza Hut • Cliente: João S. • R$ 84,50</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="h-7 text-[10px] border-white/10">Ver Detalhes</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financial' && adminRole === 'adm' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <div className="bg-gradient-to-br from-emerald-900/20 to-zinc-900 border border-emerald-500/30 rounded-3xl p-5 relative overflow-hidden mb-6">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">Sistema Financeiro Global</h2>
                </div>
                <p className="text-sm text-zinc-300 mb-6">Visão completa de faturamento, repasses e lucro da plataforma.</p>

                {/* Filtros Financeiros */}
                <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
                  <Button size="sm" variant="outline" className="border-emerald-500/50 bg-emerald-500/10 text-emerald-400 h-8 text-xs shrink-0">Hoje</Button>
                  <Button size="sm" variant="outline" className="border-white/10 bg-zinc-900/50 text-zinc-300 hover:text-white h-8 text-xs shrink-0">Últimos 7 dias</Button>
                  <Button size="sm" variant="outline" className="border-white/10 bg-zinc-900/50 text-zinc-300 hover:text-white h-8 text-xs shrink-0">Este Mês</Button>
                  <Button size="sm" variant="outline" className="border-white/10 bg-zinc-900/50 text-zinc-300 hover:text-white h-8 text-xs shrink-0">Filtrar por Cidade</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">Lucro VOLTS (Liquído)</p>
                    <p className="text-3xl font-black text-white">R$ 4.250,00</p>
                    <p className="text-[10px] text-zinc-400 mt-2">+12% vs. ontem</p>
                  </div>
                  <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-5">
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Total Faturado (Bruto)</p>
                    <p className="text-3xl font-black text-zinc-300">R$ 52.480,00</p>
                  </div>
                  <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-5">
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Avulsos (Motoboy)</p>
                    <p className="text-3xl font-black text-zinc-300">R$ 850,00</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/40 border border-white/5 rounded-xl p-5">
                    <h3 className="text-sm font-bold text-white mb-4">Repasses Agendados</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-zinc-400">Restaurantes Parceiros</span>
                          <span className="text-white font-bold">R$ 38.500,00</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full w-[75%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-zinc-400">Motoboys</span>
                          <span className="text-white font-bold">R$ 8.880,00</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-yellow-500 h-full w-[18%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/5 rounded-xl p-5 md:col-span-2">
                    <h3 className="text-sm font-bold text-white mb-4 flex justify-between items-center">
                      Desempenho Financeiro
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded cursor-pointer">Ver Detalhes</span>
                    </h3>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorBruto" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="name" stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value/1000}k`} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff10', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                          />
                          <Area type="monotone" dataKey="bruto" name="Faturamento Bruto" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorBruto)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/5 rounded-xl p-5 md:col-span-2">
                    <h3 className="text-sm font-bold text-white mb-4 flex justify-between items-center">
                      Acompanhamento de Valores Avulsos
                      <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded cursor-pointer">Exportar XLS</span>
                    </h3>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={avulsoData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="time" stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value}`} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff10', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ fill: '#ffffff05' }}
                            formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Avulso']}
                          />
                          <Bar dataKey="valor" name="Avulsos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <div className="bg-gradient-to-br from-orange-900/20 to-zinc-900 border border-orange-500/30 rounded-3xl p-5 relative overflow-hidden mb-6">
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-orange-500/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-orange-400" />
                    <h2 className="text-lg font-bold text-white">Central de Suporte</h2>
                  </div>
                  <div className="flex gap-2">
                     <span className="px-2 py-1 bg-red-500/20 text-red-400 text-[10px] font-bold rounded">3 Pendentes</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-black/60 border border-orange-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold text-white">Carlos M. (Motoboy)</span>
                        <span className="text-[9px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">Há 5 min</span>
                      </div>
                      <span className="text-[9px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-bold uppercase">Repasse</span>
                    </div>
                    <p className="text-sm text-zinc-300 mb-3">
                      "Minha taxa da corrida do Burger King de 12:30 não caiu na carteira. O app travou na hora."
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="h-8 bg-orange-600 hover:bg-orange-700 text-white text-[10px]">Responder</Button>
                      <Button size="sm" variant="outline" className="h-8 border-white/10 text-[10px]">Resolver Automático (IA)</Button>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Restaurante Sabor de Casa</span>
                        <span className="text-[9px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">Há 15 min</span>
                      </div>
                      <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase">Pedido Atrasado</span>
                    </div>
                    <p className="text-sm text-zinc-300 mb-3">
                      "O motoboy aceitou o pedido #1045 há 20 minutos e ainda não chegou para coletar."
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="h-8 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px]">Responder</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && adminRole === 'adm' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-zinc-400" />
                <h2 className="text-lg font-bold text-white">Logs de Segurança (Audit)</h2>
              </div>
              <p className="text-sm text-zinc-400 mb-6">Registro imutável de ações sensíveis no painel administrativo.</p>

              <div className="space-y-1">
                <div className="grid grid-cols-4 gap-4 p-2 border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  <div>Data / Hora</div>
                  <div>Usuário</div>
                  <div>Ação</div>
                  <div>Detalhes</div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 p-3 border-b border-white/5 text-xs bg-black/20 hover:bg-black/40 transition-colors rounded">
                  <div className="text-zinc-400 font-mono">Hoje, 14:32</div>
                  <div className="text-white">Lucas (ADM)</div>
                  <div className="text-emerald-400">Aprovação Entregador</div>
                  <div className="text-zinc-500">Aprovou cadastro ID 8492</div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 p-3 border-b border-white/5 text-xs bg-black/20 hover:bg-black/40 transition-colors rounded">
                  <div className="text-zinc-400 font-mono">Hoje, 11:15</div>
                  <div className="text-white">Carlos (Gerência VG)</div>
                  <div className="text-blue-400">Alteração Status</div>
                  <div className="text-zinc-500">Pausou restaurante 'Sushizen'</div>
                </div>

                <div className="grid grid-cols-4 gap-4 p-3 border-b border-white/5 text-xs bg-red-500/5 hover:bg-red-500/10 transition-colors rounded">
                  <div className="text-zinc-400 font-mono">Ontem, 22:10</div>
                  <div className="text-red-400 font-bold">Sistema (IA)</div>
                  <div className="text-red-400">Bloqueio Automático</div>
                  <div className="text-zinc-500">Bloqueou IP 192.168.1.5 (Fraude)</div>
                </div>
              </div>
            </div>
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
        {activeTab === 'map' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-5 mb-6 flex flex-col h-[600px]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">Radar ao Vivo</h2>
                </div>
                <div className="flex items-center gap-2 text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  125 Entregadores Online
                </div>
              </div>
              
              <div className="flex-1 bg-black rounded-2xl overflow-hidden border border-white/5 relative">
                <MapComponent mode="admin" city={adminCity} />
                
                {/* Overlay Panel */}
                <div className="absolute top-4 left-4 right-4 bg-zinc-950/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 z-10 flex gap-4 overflow-x-auto hide-scrollbar">
                  <div className="flex items-center gap-2 min-w-max">
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="text-xs text-zinc-300">Motoristas (82)</span>
                  </div>
                  <div className="flex items-center gap-2 min-w-max">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-xs text-zinc-300">Restaurantes (45)</span>
                  </div>
                  <div className="flex items-center gap-2 min-w-max">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-xs text-zinc-300">Clientes Ativos</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                  <p className="text-[10px] text-zinc-500 mb-1">Entregas em Andamento</p>
                  <p className="text-lg font-bold text-white">48</p>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                  <p className="text-[10px] text-zinc-500 mb-1">Tempo Médio (Viagem)</p>
                  <p className="text-lg font-bold text-white">12m 30s</p>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                  <p className="text-[10px] text-zinc-500 mb-1">Zonas em Alerta</p>
                  <p className="text-lg font-bold text-red-400">2</p>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                  <p className="text-[10px] text-zinc-500 mb-1">Eficiência da Rede</p>
                  <p className="text-lg font-bold text-emerald-400">94%</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Removed inline CheckCircle2 because it is now imported from lucide-react