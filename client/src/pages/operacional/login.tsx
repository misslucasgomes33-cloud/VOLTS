import { useState } from "react";
import { ShieldAlert, Store, Bike, ArrowRight, ArrowLeft, Mail, KeyRound, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function OpLogin() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"select" | "login">("select");
  const [loginType, setLoginType] = useState<"partner" | "driver">("partner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Preencha e-mail e senha", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      if (loginType === "partner" && user.role === "partner") {
        setLocation("/operacional/parceiro");
      } else if (loginType === "driver" && user.role === "driver") {
        setLocation("/operacional/motorista");
      } else {
        toast({ title: "Conta não tem permissão para este acesso", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: error.message || "Erro ao fazer login", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (mode === "login") {
    return (
      <div className="flex flex-col min-h-screen bg-black p-6">
        <button 
          onClick={() => setMode("select")} 
          className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 text-white shrink-0 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className={`w-20 h-20 ${loginType === "partner" ? "bg-blue-500/10" : "bg-primary/10"} rounded-2xl flex items-center justify-center mb-6 border ${loginType === "partner" ? "border-blue-500/20" : "border-primary/20"}`}>
            {loginType === "partner" ? <Store className="w-10 h-10 text-blue-500" /> : <Bike className="w-10 h-10 text-primary" />}
          </div>

          <h1 className="text-2xl font-display font-black text-white mb-2 text-center">
            {loginType === "partner" ? "Login Parceiro" : "Login Entregador"}
          </h1>
          <p className="text-zinc-400 text-center mb-8 text-sm">
            Entre com suas credenciais
          </p>

          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                data-testid="input-op-email"
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com" 
                className="w-full bg-zinc-900 border border-white/10 rounded-xl h-14 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50"
              />
            </div>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                data-testid="input-op-password"
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-zinc-900 border border-white/10 rounded-xl h-14 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50"
              />
            </div>

            <Button 
              data-testid="button-op-login"
              type="submit" 
              disabled={loading}
              className={`w-full h-14 ${loginType === "partner" ? "bg-blue-600 hover:bg-blue-700" : "bg-primary hover:bg-primary/90 text-black"} font-bold rounded-xl mt-4`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black p-6">
      <button 
        onClick={() => setLocation("/")} 
        className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 text-white shrink-0 mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
          <ShieldAlert className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-3xl font-display font-black text-white mb-2 tracking-tight text-center">
          SISTEMA <span className="text-primary">OPERACIONAL</span>
        </h1>
        <p className="text-zinc-400 text-center mb-10 text-sm max-w-[280px]">
          Área restrita para parceiros e entregadores VOLTS.
        </p>

        <div className="w-full space-y-4">
          <Button 
            data-testid="button-partner-select"
            onClick={() => { setLoginType("partner"); setMode("login"); }}
            className="w-full h-16 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white rounded-2xl flex items-center justify-between px-6 group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Store className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <span className="block font-bold text-white text-base">Sou Parceiro</span>
                <span className="block text-[10px] text-zinc-500">Restaurantes e Lojas</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-blue-500 transition-colors" />
          </Button>

          <Button 
            data-testid="button-driver-select"
            onClick={() => { setLoginType("driver"); setMode("login"); }}
            className="w-full h-16 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white rounded-2xl flex items-center justify-between px-6 group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bike className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <span className="block font-bold text-white text-base">Sou Entregador</span>
                <span className="block text-[10px] text-zinc-500">Acesse sua conta</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-primary transition-colors" />
          </Button>
        </div>
      </div>
    </div>
  );
}
