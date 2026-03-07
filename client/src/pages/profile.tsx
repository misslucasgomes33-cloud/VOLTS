import { User, Settings, MapPin, CreditCard, Bell, HelpCircle, LogOut, ChevronRight, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: MapPin, label: "Endereços", desc: "Meus endereços de entrega" },
    { icon: CreditCard, label: "Pagamento", desc: "Cartões e PIX" },
    { icon: Zap, label: "Assinatura VIP", desc: "Gerenciar plano", highlight: true },
    { icon: Bell, label: "Notificações", desc: "Preferências de alertas" },
    { icon: Settings, label: "Configurações", desc: "Dados da conta" },
    { icon: HelpCircle, label: "Ajuda", desc: "Suporte e Dúvidas" },
  ];

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <div className="flex flex-col min-h-full pb-24 bg-zinc-950">
      <div className="px-5 pt-12 pb-6 bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-20 h-20 bg-zinc-800 rounded-full border-2 border-primary p-1 flex items-center justify-center">
            <div className="w-full h-full bg-zinc-700 rounded-full flex items-center justify-center text-zinc-400">
              <User className="w-8 h-8" />
            </div>
          </div>
          <div>
            <h1 data-testid="text-username" className="text-2xl font-display font-bold text-white">{user?.name || "Visitante"}</h1>
            <p className="text-zinc-400 text-sm">{user?.email || ""}</p>
            <div className="mt-2 inline-flex items-center gap-1 bg-primary/20 border border-primary/30 px-2 py-0.5 rounded text-xs font-bold text-primary">
              <Zap className="w-3 h-3" fill="currentColor" /> Cliente VIP
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden">
          {menuItems.map((item, idx) => (
            <div 
              key={idx} 
              className={`flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors ${
                idx !== menuItems.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.highlight ? 'bg-primary/10 text-primary' : 'bg-zinc-800 text-zinc-400'}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className={`font-medium ${item.highlight ? 'text-primary' : 'text-white'}`}>{item.label}</p>
                  <p className="text-xs text-zinc-500">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600" />
            </div>
          ))}
        </div>

        <button 
          data-testid="button-logout"
          onClick={handleLogout}
          className="w-full mt-6 bg-transparent border border-red-500/30 text-red-500 font-medium h-14 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair da conta
        </button>
        
        <p className="text-center text-zinc-600 text-xs mt-6">VOLTS v1.0.0</p>
      </div>
    </div>
  );
}
