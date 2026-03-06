import { Power, MapPin, Navigation, Wallet, ShieldAlert, Zap, Banknote, ListOrdered, User, AlertTriangle, CalendarDays, CheckCircle2, ChevronRight, Crown, Phone, MessageSquare, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MapComponent from "@/components/MapComponent";

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [isAdminDriver, setIsAdminDriver] = useState(true);
  
  // Delivery states
  const [hasNewOrder, setHasNewOrder] = useState(false);
  const [activeDelivery, setActiveDelivery] = useState(false);
  const [deliveryStep, setDeliveryStep] = useState(0); // 0 = going to restaurant, 1 = going to customer

  const [schedule, setSchedule] = useState({
    seg: ['11:00 - 15:00', '18:00 - 23:00'],
    ter: ['18:00 - 23:00'],
    qua: [],
    qui: ['11:00 - 15:00'],
    sex: ['11:00 - 15:00', '18:00 - 00:00'],
    sab: ['11:00 - 15:00', '18:00 - 00:00'],
    dom: ['18:00 - 00:00'],
  });

  const toggleAdmin = () => setIsAdminDriver(!isAdminDriver);

  // Helper for schedule
  const daysMap = [
    { key: 'seg', label: 'Segunda', active: schedule.seg.length > 0 },
    { key: 'ter', label: 'Terça', active: schedule.ter.length > 0 },
    { key: 'qua', label: 'Quarta', active: schedule.qua.length > 0 },
    { key: 'qui', label: 'Quinta', active: schedule.qui.length > 0 },
    { key: 'sex', label: 'Sexta', active: schedule.sex.length > 0 },
    { key: 'sab', label: 'Sábado', active: schedule.sab.length > 0 },
    { key: 'dom', label: 'Domingo', active: schedule.dom.length > 0 },
  ];

  // Simulate receiving an order after going online
  useEffect(() => {
    let timeout: any;
    if (isOnline && !activeDelivery && !hasNewOrder) {
      timeout = setTimeout(() => {
        setHasNewOrder(true);
      }, 5000); // 5 seconds to get an order
    }
    return () => clearTimeout(timeout);
  }, [isOnline, activeDelivery, hasNewOrder]);

  const acceptOrder = () => {
    setHasNewOrder(false);
    setActiveDelivery(true);
    setDeliveryStep(0);
  };

  const declineOrder = () => {
    setHasNewOrder(false);
  };

  const advanceDelivery = () => {
    if (deliveryStep === 0) {
      setDeliveryStep(1);
    } else {
      setActiveDelivery(false);
      setDeliveryStep(0);
    }
  };

  // Mock coordinates
  const driverPos: [number, number] = [-15.6010, -56.0974];
  const restaurantPos: [number, number] = [-15.6030, -56.0980];
  const customerPos: [number, number] = [-15.5960, -56.0966];

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24 relative">
      {/* Header */}
      <div className="bg-zinc-950 px-5 pt-8 pb-4 sticky top-0 z-40 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-primary overflow-hidden relative cursor-pointer" onClick={toggleAdmin}>
             {isAdminDriver && (
               <div className="absolute -top-1 -right-1 bg-purple-500 rounded-full p-0.5 z-10">
                 <Crown className="w-3 h-3 text-white" />
               </div>
             )}
             <div className="w-full h-full bg-zinc-700 flex items-center justify-center relative z-0">
               <User className="w-5 h-5 text-zinc-400" />
             </div>
          </div>
          <div onClick={toggleAdmin} className="cursor-pointer">
            <h2 className="text-white font-bold text-sm flex items-center gap-1">
              Carlos M. {isAdminDriver && <span className="text-xs text-purple-400 font-normal">(Admin)</span>}
            </h2>
            <div className="flex items-center gap-1">
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold">Nível Ouro</span>
              <span className="text-[10px] text-zinc-400">98% Aceitação</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setShowSOS(true)}
          className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30"
        >
          <ShieldAlert className="w-5 h-5 text-red-500" />
        </button>
      </div>

      <div className="p-5 flex-1">
        {/* Active Delivery UI */}
        {activeDelivery && (
          <div className="absolute inset-0 bg-black z-50 flex flex-col">
            {/* Map Area */}
            <div className="flex-1 relative">
              <MapComponent 
                driverPos={driverPos}
                restaurantPos={restaurantPos}
                customerPos={customerPos}
              />
              
              {/* Top Bar Overlay */}
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-start">
                <button 
                  onClick={() => setShowSOS(true)}
                  className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30 backdrop-blur-md"
                >
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                </button>
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-white font-bold text-sm">
                    {deliveryStep === 0 ? "Chegar em 4 min" : "Entrega em 12 min"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Info Card */}
            <div className="bg-zinc-950 rounded-t-3xl border-t border-white/10 p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-primary font-bold text-xs uppercase tracking-wider mb-1 block">
                    {deliveryStep === 0 ? "COLETAR NO RESTAURANTE" : "ENTREGAR PARA CLIENTE"}
                  </span>
                  <h2 className="text-xl font-bold text-white">
                    {deliveryStep === 0 ? "Burger King - CPA" : "Residencial Alphaville"}
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    {deliveryStep === 0 ? "Av. Historiador Rubens de Mendonça, 123" : "Rua das Palmeiras, Quadra 4, Lote 12"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white">R$ 14,50</span>
                  <p className="text-xs text-zinc-500">2.4 km</p>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 mb-4">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-white">
                      #42
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Pedido #4289</p>
                      <p className="text-xs text-zinc-400">1x Combo Whopper, 1x Coca-Cola</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white gap-2">
                    <MessageSquare className="w-4 h-4" /> Chat
                  </Button>
                  <Button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white gap-2">
                    <Phone className="w-4 h-4" /> Ligar
                  </Button>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={advanceDelivery}
                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-black rounded-xl"
              >
                {deliveryStep === 0 ? "Cheguei no Restaurante" : "Finalizar Entrega"}
              </Button>
            </div>
          </div>
        )}

        {/* New Order Alert */}
        {hasNewOrder && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-5">
            <div className="bg-zinc-900 border-2 border-primary rounded-3xl p-6 w-full max-w-sm flex flex-col items-center text-center animate-in zoom-in duration-300">
              <div className="absolute inset-0 bg-primary/10 animate-pulse rounded-3xl pointer-events-none" />
              
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4 relative z-10">
                <div className="absolute inset-0 border-4 border-primary rounded-full animate-ping opacity-50" />
                <Zap className="w-10 h-10 text-primary" />
              </div>
              
              <h2 className="text-2xl font-black text-white mb-1 relative z-10">NOVA CORRIDA!</h2>
              <p className="text-primary font-bold mb-6 relative z-10">Você tem 15 segundos para aceitar</p>
              
              <div className="w-full bg-black/50 rounded-2xl p-4 mb-6 text-left border border-white/5 relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-white">R$ 14,50</span>
                  <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-300">2.4 km total</span>
                </div>
                
                <div className="space-y-3 relative">
                  <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-zinc-800" />
                  
                  <div className="flex items-start gap-3 relative z-10">
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mt-0.5 shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Burger King - CPA</p>
                      <p className="text-[10px] text-zinc-500">Coleta • 1.2 km de você</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 relative z-10">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Residencial Alphaville</p>
                      <p className="text-[10px] text-zinc-500">Entrega • 1.2 km do restaurante</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full space-y-3 relative z-10">
                <Button 
                  onClick={acceptOrder}
                  className="w-full bg-primary hover:bg-primary/90 text-black font-black text-lg h-14 rounded-xl shadow-[0_0_20px_rgba(255,204,0,0.3)]"
                >
                  ACEITAR CORRIDA
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={declineOrder}
                  className="w-full text-zinc-400 hover:text-white"
                >
                  Recusar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Warning */}
        {isAdminDriver && (
          <div className="bg-gradient-to-r from-purple-900/40 to-black border border-purple-500/30 rounded-2xl p-3 mb-6 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
               <Crown className="w-4 h-4 text-purple-400" />
             </div>
             <div>
               <h4 className="text-xs font-bold text-white">Privilégio Admin: Acesso Global</h4>
               <p className="text-[10px] text-zinc-400 leading-tight">
                 Você pode aceitar entregas em qualquer zona, ignorando limites de capacidade de 10 ou 15 motoristas.
               </p>
             </div>
          </div>
        )}

        {/* Schedule CTA */}
        <button 
          onClick={() => setShowSchedule(true)}
          className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 mb-6 flex items-center justify-between hover:bg-zinc-800 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Disponibilidade / Escala</h4>
              <p className="text-[10px] text-zinc-400">Reserve seus horários para ter prioridade</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-500" />
        </button>

        {/* Status Toggle */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 mb-6 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
          {isOnline && <div className="absolute inset-0 bg-primary/5 animate-pulse" />}
          
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-xl transition-all duration-300 relative z-10 ${
              isOnline 
                ? 'bg-primary border-primary text-black shadow-[0_0_40px_rgba(255,204,0,0.4)]' 
                : 'bg-zinc-800 border-zinc-700 text-zinc-400'
            }`}
          >
            <Power className="w-10 h-10" />
          </button>
          
          <h3 className={`mt-4 font-bold text-lg ${isOnline ? 'text-primary' : 'text-zinc-500'}`}>
            {isOnline ? 'ONLINE NA FILA' : 'OFFLINE'}
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            {isOnline ? 'Buscando pedidos próximos...' : 'Fique online para receber pedidos'}
          </p>
          
          {isOnline && (
            <div className="mt-4 bg-black/40 border border-white/5 rounded-xl p-3 w-full flex justify-between items-center z-10">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500">
                  {isAdminDriver ? 'Acesso Livre (Admin)' : 'Sua Posição na Zona'}
                </span>
                <span className="text-sm font-bold text-white">
                  {isAdminDriver ? 'Qualquer Zona (Prioridade)' : '#3 de 15 entregadores'}
                </span>
              </div>
              <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                <Navigation className="w-4 h-4 text-primary" />
              </div>
            </div>
          )}
        </div>

        {/* Earnings Card */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex flex-col">
            <span className="text-xs text-zinc-400 mb-1 flex items-center gap-1"><Wallet className="w-3 h-3" /> Ganhos Hoje</span>
            <span className="text-xl font-bold text-white">R$ 145,50</span>
            <span className="text-[10px] text-green-500 mt-1">+12 entregas</span>
          </div>
          <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex flex-col">
            <span className="text-xs text-zinc-400 mb-1 flex items-center gap-1"><Banknote className="w-3 h-3" /> Saldo Semanal</span>
            <span className="text-xl font-bold text-white">R$ 480,20</span>
            <span className="text-[10px] text-primary mt-1">Repasse: Terça-feira</span>
          </div>
        </div>

        {/* Dynamic Zone Rules */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4">
          <h4 className="font-bold text-sm text-white flex items-center gap-2 mb-3"><MapPin className="w-4 h-4 text-primary" /> Zonas de Alta Demanda</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div>
                <span className="block text-xs font-bold text-white">Jd Glória / Mapim / Cohab Michel</span>
                <span className="block text-[10px] text-red-400">Demanda alta • Cap: 15/15</span>
              </div>
              <span className="text-primary font-bold text-sm">+ R$ 3,00</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div>
                <span className="block text-xs font-bold text-white">Centro / CPA / Santa Rosa</span>
                <span className="block text-[10px] text-amber-400">Demanda média • Cap: 12/15</span>
              </div>
              <span className="text-primary font-bold text-sm">+ R$ 1,50</span>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showSchedule && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-5">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSchedule(false)}></div>
          
          <div className="w-full h-[85vh] sm:h-auto sm:max-h-[80vh] sm:max-w-md bg-zinc-950 border-t sm:border border-white/10 sm:rounded-3xl rounded-t-3xl relative z-10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-900 sticky top-0 z-20">
              <div>
                <h3 className="text-white font-bold">Disponibilidade (Escala)</h3>
                <p className="text-[10px] text-zinc-400">Reserve slots para garantir pedidos na sua zona</p>
              </div>
              <button onClick={() => setShowSchedule(false)} className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center hover:text-white transition-colors">
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-5 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-200 leading-relaxed">
                  Agendar seus horários garante prioridade no envio de pedidos (dispatch) na sua zona principal. Se a zona lotar, motoristas agendados recebem antes.
                </p>
              </div>

              <div className="space-y-3">
                {daysMap.map((day) => (
                  <div key={day.key} className="bg-zinc-900 border border-white/5 rounded-2xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-sm">{day.label}</span>
                      {day.active ? (
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">Agendado</span>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-bold px-2 py-0.5">Livre</span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {['Almoço (11h-15h)', 'Jantar (18h-23h)', 'Madrugada (23h-03h)'].map((slot, i) => {
                        // Mock active state for visual purposes
                        const isSelected = (i === 0 && day.key !== 'qua' && day.key !== 'ter') || 
                                           (i === 1 && day.key !== 'qua' && day.key !== 'qui');
                        return (
                          <div 
                            key={i} 
                            className={`px-3 py-1.5 rounded-lg text-xs border transition-colors cursor-pointer ${
                              isSelected 
                                ? 'bg-primary/20 border-primary text-primary font-bold' 
                                : 'bg-black border-white/10 text-zinc-500 hover:border-white/30'
                            }`}
                          >
                            {slot.split(' ')[0]}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-white/5 bg-zinc-950">
               <Button onClick={() => setShowSchedule(false)} className="w-full bg-primary text-black hover:bg-primary/90 font-bold h-12 rounded-xl">
                 Salvar Escala Semanal
               </Button>
            </div>
          </div>
        </div>
      )}

      {/* SOS Modal */}
      {showSOS && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-5">
          <div className="bg-zinc-900 border border-red-500/50 rounded-3xl p-6 w-full max-w-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Botão de Emergência</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Esta ação enviará sua localização em tempo real para a central VOLTS e contatos de segurança.
            </p>
            <div className="w-full space-y-3">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12">
                Acionar Emergência
              </Button>
              <Button variant="ghost" onClick={() => setShowSOS(false)} className="w-full text-zinc-400 hover:text-white">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}