import { useState } from "react";
import { Video, Download, Sparkles, Instagram, PlayCircle, Loader2, ArrowLeft, Users, AlertCircle, PlusCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";

// Import the generated video
import promoVideo from '@/assets/videos/promo-volts.mp4';

// Mock data for zones capacity
const zoneCapacity = [
  { id: 1, name: "Cristo Rei / Ponte Nova / Aeroporto", type: "driver", max: 12, current: 12, city: "Várzea Grande", waitlist: 3 },
  { id: 2, name: "São Matheus / Paiaguás", type: "driver", max: 6, current: 4, city: "Várzea Grande", waitlist: 0 },
  { id: 3, name: "Mapim / Nova Esperança / Jd Imperial", type: "driver", max: 8, current: 8, city: "Várzea Grande", waitlist: 5 },
  { id: 4, name: "Centro / CPA / Santa Rosa", type: "driver", max: 20, current: 15, city: "Cuiabá", waitlist: 0 },
  { id: 5, name: "Coxipó / Tijucal", type: "driver", max: 15, current: 15, city: "Cuiabá", waitlist: 8 },
];

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('marketing'); // 'marketing' or 'capacity'
  
  // Marketing State
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [template, setTemplate] = useState("launch");

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(false);
      setVideoReady(true);
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 pb-24">
      {/* Header */}
      <div className="bg-zinc-950 px-5 pt-8 pb-4 sticky top-0 z-40 border-b border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setLocation("/operacional")} className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 text-white shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-display font-black text-white">Admin VOLTS</h1>
            <p className="text-xs text-zinc-400">Marketing & Operações</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-zinc-900/50 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('marketing')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${activeTab === 'marketing' ? 'bg-purple-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Video className="w-3.5 h-3.5" /> Criativos IA
          </button>
          <button 
            onClick={() => setActiveTab('capacity')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${activeTab === 'capacity' ? 'bg-primary text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Users className="w-3.5 h-3.5" /> Vagas / Zonas
          </button>
        </div>
      </div>

      <div className="p-5">
        {activeTab === 'marketing' ? (
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
        ) : (
          <div className="animate-in fade-in duration-300">
            
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-primary/20 rounded-2xl p-4 mb-6 flex gap-3 items-start">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary mb-1">Alerta IA de Demanda</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  A região <strong>Coxipó / Tijucal</strong> está com fila de espera (8 entregadores), mas a demanda de restaurantes lá cresceu 40%. Sugiro aumentar o limite em +5 vagas hoje.
                </p>
                <Button size="sm" className="mt-3 h-8 bg-zinc-800 text-white hover:bg-zinc-700 font-bold border border-white/10">Aumentar Limite Automaticamente</Button>
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
                        <button className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors">
                          <PlusCircle className="w-3 h-3" /> Aumentar teto
                        </button>
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

// Inline CheckCircle2 component
function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}