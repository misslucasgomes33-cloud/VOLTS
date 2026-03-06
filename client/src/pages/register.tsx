import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();

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
          <Input placeholder="Nome completo" className="h-14 bg-zinc-900/50 border-white/10 text-white rounded-xl focus-visible:ring-primary/50" />
          <Input type="email" placeholder="E-mail" className="h-14 bg-zinc-900/50 border-white/10 text-white rounded-xl focus-visible:ring-primary/50" />
          <Input type="tel" placeholder="Telefone / WhatsApp" className="h-14 bg-zinc-900/50 border-white/10 text-white rounded-xl focus-visible:ring-primary/50" />
          
          <Select>
            <SelectTrigger className="h-14 bg-zinc-900/50 border-white/10 text-white rounded-xl focus-visible:ring-primary/50">
              <SelectValue placeholder="Selecione sua cidade" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10 text-white">
              <SelectItem value="cuiaba">Cuiabá</SelectItem>
              <SelectItem value="vg">Várzea Grande</SelectItem>
            </SelectContent>
          </Select>

          <Input type="password" placeholder="Senha" className="h-14 bg-zinc-900/50 border-white/10 text-white rounded-xl focus-visible:ring-primary/50" />
          <Input type="password" placeholder="Confirmar senha" className="h-14 bg-zinc-900/50 border-white/10 text-white rounded-xl focus-visible:ring-primary/50" />
        </div>

        <Button 
          className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-bold text-lg rounded-xl mt-8 shadow-[0_0_20px_rgba(255,204,0,0.2)]"
          onClick={() => setLocation("/home")}
        >
          Cadastrar
        </Button>
      </div>
    </div>
  );
}