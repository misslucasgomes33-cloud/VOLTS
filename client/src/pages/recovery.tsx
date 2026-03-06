import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, KeyRound } from "lucide-react";

export default function Recovery() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col p-6 bg-background relative overflow-hidden">
      <div className="absolute top-[20%] left-[-20%] w-[100%] h-[40%] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="flex items-center mb-8 z-10">
        <button onClick={() => setLocation("/login")} className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
      
      <div className="z-10 flex-1 flex flex-col items-center mt-12">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 mb-8">
          <KeyRound className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl font-display font-bold text-white mb-2 text-center">Recuperar senha</h1>
        <p className="text-muted-foreground text-sm mb-8 text-center max-w-xs">
          Digite seu e-mail cadastrado. Enviaremos um código para redefinir sua senha.
        </p>

        <div className="w-full space-y-4">
          <Input type="email" placeholder="Seu e-mail" className="h-14 bg-zinc-900/50 border-white/10 text-white rounded-xl focus-visible:ring-primary/50 text-center" />
        </div>

        <Button 
          className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-bold text-lg rounded-xl mt-8"
          onClick={() => setLocation("/login")}
        >
          Enviar código
        </Button>
      </div>
    </div>
  );
}