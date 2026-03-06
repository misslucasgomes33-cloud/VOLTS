import { useState } from "react";
import { Video, Download, Sparkles, Instagram, PlayCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";

// Import the generated video
import promoVideo from '@/assets/videos/promo-volts.mp4';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
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
      <div className="bg-zinc-950 px-5 pt-8 pb-4 sticky top-0 z-40 border-b border-white/5 flex items-center gap-3">
        <button onClick={() => setLocation("/operacional")} className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-display font-black text-white">Admin VOLTS</h1>
          <p className="text-xs text-zinc-400">Marketing Studio</p>
        </div>
      </div>

      <div className="p-5">
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
    </div>
  );
}

// Inline CheckCircle2 component to avoid missing import
function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}