import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MapPin, Navigation, Clock, CheckCircle2, Zap, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Driver() {
  const [, setLocation] = useLocation();
  const [isOnline, setIsOnline] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [newOrder, setNewOrder] = useState<any>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOnline) {
      setQueuePosition(3); // Start near the front of the queue
      
      // Simulate getting an order based on queue + distance
      timer = setTimeout(() => {
        setQueuePosition(1); // Moved to front
        
        setTimeout(() => {
          setNewOrder({
            id: "#4829",
            restaurant: "Pizza Express",
            distanceRest: "1.2 km",
            deliveryType: "Porta do apartamento",
            distanceCustomer: "3.5 km",
            fee: "R$ 12,50",
            extraFee: "R$ 5,00", // The door delivery fee
            total: "R$ 17,50"
          });
        }, 2000);
      }, 3000);
    } else {
      setQueuePosition(0);
      setNewOrder(null);
    }
    
    return () => clearTimeout(timer);
  }, [isOnline]);

  const acceptOrder = () => {
    setNewOrder(null);
    // After accepting, driver moves to the end of the queue (mocked as position 45)
    setQueuePosition(45);
  };

  const rejectOrder = () => {
    setNewOrder(null);
    // Rejecting might also penalize queue position
    setQueuePosition(50);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-zinc-950 relative overflow-hidden">
      {/* Map Background Simulation */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* Header */}
      <div className="bg-zinc-900/90 backdrop-blur-md px-5 pt-8 pb-4 sticky top-0 z-40 border-b border-white/5 flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-white">VOLTS <span className="text-primary">Driver</span></h1>
        <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full border border-white/10">
          <span className="text-xs font-medium text-zinc-300">Status:</span>
          <Switch 
            checked={isOnline} 
            onCheckedChange={setIsOnline} 
            className="data-[state=checked]:bg-primary"
          />
          <span className={`text-xs font-bold ${isOnline ? 'text-primary' : 'text-zinc-500'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col z-10 relative">
        {!isOnline ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 mb-4">
              <Navigation className="w-8 h-8 text-zinc-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Você está offline</h2>
            <p className="text-sm text-zinc-400 max-w-[250px]">Fique online para entrar na fila de entregas e receber pedidos.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Intelligent Dispatch Status */}
            <Card className="bg-gradient-to-br from-zinc-900 to-black border-primary/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
              <CardContent className="p-5 relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-primary" fill="currentColor" />
                  <h3 className="font-bold text-white">Despacho Inteligente IA</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-950/50 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Sua Posição</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-display font-black text-primary">{queuePosition}</span>
                      <span className="text-xs text-zinc-500">na fila</span>
                    </div>
                  </div>
                  <div className="bg-zinc-950/50 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Fator de Match</p>
                    <p className="text-sm font-bold text-white leading-tight">Fila + Distância</p>
                  </div>
                </div>
                
                <p className="text-xs text-zinc-400 mt-4 bg-primary/5 p-2 rounded-lg border border-primary/10">
                  O sistema envia os pedidos para os entregadores mais próximos que estão nas primeiras posições da fila.
                </p>
              </CardContent>
            </Card>

            {/* Income today mockup */}
            <div className="flex justify-between items-center bg-zinc-900 border border-white/5 p-4 rounded-2xl">
              <div>
                <p className="text-xs text-zinc-400">Ganhos de hoje</p>
                <p className="text-xl font-bold text-white">R$ 145,50</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-400">Entregas</p>
                <p className="text-xl font-bold text-white">12</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Order Popup Overlay */}
      {newOrder && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-zinc-900 w-full max-w-[400px] rounded-3xl border border-primary/30 shadow-[0_0_40px_rgba(255,204,0,0.15)] overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
            {/* Header indicator */}
            <div className="bg-primary px-4 py-3 flex items-center justify-between">
              <span className="text-black font-bold text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" /> Nova Corrida!
              </span>
              <span className="bg-black/20 text-black text-xs px-2 py-1 rounded font-bold">
                Match Perfeito
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-display font-black text-white">{newOrder.total}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-zinc-400">Taxa base: {newOrder.fee}</span>
                    {newOrder.extraFee && (
                      <span className="text-xs text-primary font-medium border border-primary/30 px-1 rounded">+{newOrder.extraFee} Porta</span>
                    )}
                  </div>
                </div>
                <div className="bg-zinc-950 px-3 py-2 rounded-xl text-center border border-white/5">
                  <p className="text-[10px] text-zinc-500 uppercase">Tempo Est.</p>
                  <p className="text-sm font-bold text-white">18 min</p>
                </div>
              </div>

              <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/5 relative">
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-zinc-800" />
                
                <div className="flex gap-3 relative z-10">
                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center mt-1">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{newOrder.restaurant}</p>
                    <p className="text-xs text-zinc-400">{newOrder.distanceRest} até o local</p>
                  </div>
                </div>

                <div className="flex gap-3 relative z-10 pt-2">
                  <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center mt-1 shadow-[0_0_10px_rgba(255,204,0,0.5)]">
                    <MapPin className="w-2.5 h-2.5 text-black" fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Cliente</p>
                    <p className="text-xs text-zinc-400">{newOrder.distanceCustomer} de trajeto</p>
                    <p className="text-xs font-medium text-primary mt-0.5 bg-primary/10 inline-block px-1.5 py-0.5 rounded border border-primary/20">
                      Entregar em: {newOrder.deliveryType}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200 leading-tight">
                  Após aceitar esta corrida, você irá para o final da fila (posição 45 atual).
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={rejectOrder} variant="outline" className="flex-1 h-14 rounded-xl border-white/10 hover:bg-white/5 text-zinc-300">
                  Rejeitar
                </Button>
                <Button onClick={acceptOrder} className="flex-[2] h-14 bg-primary hover:bg-primary/90 text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(255,204,0,0.2)]">
                  Aceitar Corrida
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}