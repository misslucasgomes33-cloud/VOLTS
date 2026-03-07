import { useState } from "react";
import { useLocation } from "wouter";
import { ShieldCheck, UserCog, Lock, ArrowLeft, Mail, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (role: string) => {
    if (role === 'gerencia') {
      setSelectedRole('gerencia');
      return; // Show form
    }
    
    // ADM direct login for mockup
    localStorage.setItem('admin_role', 'adm');
    localStorage.setItem('admin_city', 'Global');
    setLocation('/admin/dashboard');
  };

  const submitGerenciaLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock city detection based on email
    let city = "Cuiabá (MT)";
    if (email.toLowerCase().includes("vg") || email.toLowerCase().includes("varzea")) {
      city = "Várzea Grande (MT)";
    } else if (email.toLowerCase().includes("cg") || email.toLowerCase().includes("campo")) {
      city = "Campo Grande (MS)";
    }
    
    localStorage.setItem('admin_role', 'gerencia');
    localStorage.setItem('admin_city', city);
    setLocation('/admin/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-black p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <button 
        onClick={() => selectedRole ? setSelectedRole(null) : setLocation("/")} 
        className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 text-white shrink-0 mb-8 relative z-10 hover:bg-zinc-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="flex flex-col items-center mb-12 relative z-10">
        <div className={`w-20 h-20 ${selectedRole === 'gerencia' ? 'bg-blue-500/20 border-blue-500/30' : 'bg-purple-500/20 border-purple-500/30'} border rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.3)] mb-6 transition-colors`}>
          {selectedRole === 'gerencia' ? (
            <UserCog className="w-10 h-10 text-blue-500" />
          ) : (
            <ShieldCheck className="w-10 h-10 text-purple-500" />
          )}
        </div>
        <h1 className="text-3xl font-display font-black text-white tracking-tight text-center">
          {selectedRole === 'gerencia' ? 'Portal da Gerência' : 'Acesso Restrito'}
        </h1>
        <p className="text-zinc-400 text-sm mt-2 text-center max-w-xs">
          {selectedRole === 'gerencia' 
            ? 'Faça login para acessar a operação da sua cidade' 
            : 'Selecione seu nível de acesso para entrar no sistema VOLTS'}
        </p>
      </div>

      <div className="w-full max-w-sm mx-auto relative z-10 flex-1">
        {!selectedRole ? (
          <div className="space-y-4">
            <div 
              onClick={() => handleLogin('adm')}
              className="bg-zinc-900 border border-white/10 hover:border-purple-500/50 p-5 rounded-2xl flex items-center gap-4 cursor-pointer transition-all group hover:scale-[1.02] shadow-lg"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-purple-500/30 transition-colors">
                <ShieldCheck className="w-6 h-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-bold group-hover:text-purple-400 transition-colors">Administrador (ADM)</h2>
                <p className="text-[11px] text-zinc-400 mt-1 leading-tight">Acesso total ao sistema, financeiro, segurança e controle de IAs</p>
              </div>
            </div>

            <div 
              onClick={() => handleLogin('gerencia')}
              className="bg-zinc-900 border border-white/10 hover:border-blue-500/50 p-5 rounded-2xl flex items-center gap-4 cursor-pointer transition-all group hover:scale-[1.02] shadow-lg"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-500/30 transition-colors">
                <UserCog className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-bold group-hover:text-blue-400 transition-colors">Gerência</h2>
                <p className="text-[11px] text-zinc-400 mt-1 leading-tight">Acesso operacional, resolução de entregas e suporte a parceiros</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={submitGerenciaLogin} className="space-y-4 animate-in slide-in-from-right-8 duration-300">
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-bold ml-1">Email Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gerente.cuiaba@volts.com" 
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl h-14 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-bold ml-1">Senha</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl h-14 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl mt-6">
              Entrar na Operação
            </Button>
            
            <p className="text-center text-[10px] text-zinc-500 mt-4">
              O sistema detectará sua cidade automaticamente pelo email.
            </p>
          </form>
        )}
      </div>
      
      <div className="mt-auto pt-8 pb-4 text-center relative z-10 flex flex-col items-center gap-2">
        <Lock className="w-4 h-4 text-zinc-600" />
        <p className="text-[10px] text-zinc-600 font-medium tracking-widest uppercase">
          Ambiente Seguro & Criptografado
        </p>
      </div>
    </div>
  );
}