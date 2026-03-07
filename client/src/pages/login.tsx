import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({ title: "Preencha e-mail e senha", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === "client") {
        setLocation("/home");
      } else if (user.role === "driver") {
        setLocation("/operacional/motorista");
      } else if (user.role === "partner") {
        setLocation("/operacional/parceiro");
      } else if (user.role === "admin") {
        localStorage.setItem("admin_role", "adm");
        localStorage.setItem("admin_city", "Global");
        setLocation("/admin/dashboard");
      } else if (user.role === "manager") {
        localStorage.setItem("admin_role", "gerencia");
        localStorage.setItem("admin_city", user.city || "Cuiabá");
        setLocation("/admin/dashboard");
      }
    } catch (error: any) {
      toast({ title: error.message || "Erro ao fazer login", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-sm flex flex-col items-center space-y-8 z-10 relative">
        
        <div className="flex flex-col items-center space-y-2">
          <div className="w-20 h-20 bg-black border border-primary/30 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(255,204,0,0.3)] mb-4">
            <Zap className="w-10 h-10 text-primary" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-white">VOLTS</h1>
          <p className="text-muted-foreground text-sm font-medium">Entregas na velocidade da luz</p>
        </div>

        <div className="w-full space-y-4">
          <Input 
            data-testid="input-email"
            type="email" 
            placeholder="E-mail" 
            className="h-14 bg-zinc-900/50 border-white/10 text-white rounded-xl focus-visible:ring-primary/50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <Input 
            data-testid="input-password"
            type="password" 
            placeholder="Senha" 
            className="h-14 bg-zinc-900/50 border-white/10 text-white rounded-xl focus-visible:ring-primary/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          
          <div className="flex justify-end">
            <button 
              onClick={() => setLocation("/recovery")}
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Esqueci minha senha
            </button>
          </div>
        </div>

        <div className="w-full space-y-4 pt-4">
          <Button 
            data-testid="button-login"
            className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(255,204,0,0.2)]"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
          </Button>
          
          <div className="flex items-center justify-center space-x-1 text-sm font-medium">
            <span className="text-muted-foreground">Novo por aqui?</span>
            <button 
              onClick={() => setLocation("/register")}
              className="text-primary hover:underline"
            >
              Criar conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
