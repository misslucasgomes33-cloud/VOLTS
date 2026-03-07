import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "As senhas não coincidem", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const cityName = city.startsWith("vg") ? "Várzea Grande" : "Cuiabá";
      await register({ name, email, password, phone, role: "client", city: cityName });
      toast({ title: "Conta criada com sucesso!" });
      setLocation("/home");
    } catch (error: any) {
      toast({ title: error.message || "Erro ao criar conta", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-background relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[100%] h-[40%] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="flex items-center mb-8 z-10">
        <button onClick={() => setLocation("/login")} className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
      
      <div className="z-10 flex-1 flex flex-col">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Criar conta</h1>
        <p className="text-muted-foreground text-sm mb-8">Junte-se à revolução das entregas rápidas.</p>

        <div className="space-y-4 flex-1">
          <Input 
            data-testid="input-register-name"
            placeholder="Nome completo" 
            className="h-14 bg-zinc-900/50 border-white/10 text-white rounded-xl focus-visible:ring-primary/50" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input 
            data-testid="input-register-email"
            type="email" 
            placeholder="E-mail" 
            className="h-14 bg-zinc-900/50 border-white/10 text-white rounded-xl focus-visible:ring-primary/50" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            data-testid="input-register-phone"
            type="tel" 
            placeholder="Telefone / WhatsApp" 
            className="h-14 bg-zinc-900/50 border-white/10 text-white rounded-xl focus-visible:ring-primary/50" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          
          <Select onValueChange={setCity}>
            <SelectTrigger className="h-14 bg-zinc-900/50 border-white/10 text-white rounded-xl focus-visible:ring-primary/50 text-left">
              <SelectValue placeholder="Selecione sua cidade e zona" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10 text-white max-h-[300px]">
              <SelectGroup>
                <SelectLabel className="text-primary font-bold">Cuiabá</SelectLabel>
                <SelectItem value="cba-centro">Centro</SelectItem>
                <SelectItem value="cba-cpa">CPA</SelectItem>
                <SelectItem value="cba-santa-rosa">Santa Rosa</SelectItem>
                <SelectItem value="cba-coxipo">Coxipó</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel className="text-primary font-bold mt-2">Várzea Grande</SelectLabel>
                <SelectItem value="vg-centro">Centro</SelectItem>
                <SelectItem value="vg-cristo-rei">Cristo Rei</SelectItem>
                <SelectItem value="vg-ponte-nova">Ponte Nova</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input 
            data-testid="input-register-password"
            type="password" 
            placeholder="Senha" 
            className="h-14 bg-zinc-900/50 border-white/10 text-white rounded-xl focus-visible:ring-primary/50" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input 
            data-testid="input-register-confirm"
            type="password" 
            placeholder="Confirmar senha" 
            className="h-14 bg-zinc-900/50 border-white/10 text-white rounded-xl focus-visible:ring-primary/50" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button 
          data-testid="button-register"
          className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-bold text-lg rounded-xl mt-8 shadow-[0_0_20px_rgba(255,204,0,0.2)]"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Cadastrar"}
        </Button>
      </div>
    </div>
  );
}
